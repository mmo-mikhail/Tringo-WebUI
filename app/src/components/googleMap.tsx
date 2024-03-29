/* eslint-disable no-underscore-dangle,max-len */
import * as React from 'react';
import { connect } from 'react-redux';
import GoogleMapReact, { ChangeEventValue, MapTypeStyle } from 'google-map-react';
import { DestinationProp, PriceTagMarker } from 'components/markers/priceTagMarker';
import DepartureMarker from 'components/markers/departureMarker';
import TinyPinMarker from 'components/markers/tinyPinMarker';
import { IDestination } from 'models/response/destination';
import * as destinationActions from 'actions/destinations';
import SearchWidgetWrapper from 'components/searchWidget/searchWidgetWrapper';
import { Coordinates, FlightDestinationRequest, MapArea } from 'models/request/flightDestinationRequest';
import { DatesInput } from 'models/request/dateInput';
import gMapConf from './gMapConf.json';
import { DestinationsState } from 'models/response/destinations';
import { LinearProgress, withStyles } from '@material-ui/core';
import { fetchDepartureAirport } from 'services/dataService';
import './styles/googleMap.scss';
import {
    GoogleClusterIntf,
    GoogleMarkerClustererInf,
    GoogleMarkerIntf,
    GoogleLatLng,
    GoogleLatLngBounds
} from './clusteringHelpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

interface MapProp {
    error?: string;
    isLoading: boolean;
    maxNumberOfConcurrentPriceMarkers: number;
    destinations: IDestination[];
    fetchDestinations: (arg: FlightDestinationRequest) => {};
}

type MapHandling = 'cooperative' | 'auto' | 'greedy';

interface MapState {
    destinationsRequestModel: FlightDestinationRequest;
    isLoading?: boolean;
    error?: string;
    selectedAirportLabel: string; //label and Id is not the same thing
    departureCoordinate: Coordinates;
    onPinHoverElement?: JSX.Element;
    isFullScreen?: boolean;
    markers?: JSX.Element[];
}

interface MapInitProps {
    defaultZoom: number;
    zoomControl: boolean;
    scrollwheel: boolean;
    gestureHandling: MapHandling;
}

interface GoogleMapObj {
    map: { zoom: number; fitBounds: (bounds: any, padding?: number) => void };
    maps: {
        Polyline: any;
        LatLng: GoogleLatLng;
        LatLngBounds: GoogleLatLngBounds;
        Marker: any;
        event: any;
    };
}

declare global {
    interface Window {
        MarkerClusterer: GoogleMarkerClustererInf;
        ClusterIcon: any;
    }
}

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#cccccc'
    },
    barColorPrimary: {
        backgroundColor: '#999'
    }
})(LinearProgress);

const convertDestination = function(record: IDestination): DestinationProp {
    return {
        destination: record.cityName,
        destinationCode: record.destAirportCode,
        destinationCountryName: record.countryName,
        airportName: record.airportName,
        priority: record.personalPriorityIdx,
        dateOut: record.flightDates.departureDate,
        dateBack: record.flightDates.returnDate,
        price: record.price
    };
};

const sortDestinationsDesc = (a: IDestination, b: IDestination) => {
    // sorting by descending
    if (a.personalPriorityIdx < b.personalPriorityIdx) {
        return 1;
    }
    if (a.personalPriorityIdx > b.personalPriorityIdx) {
        return -1;
    }
    return 0;
};

const anySimilarDestinations = (destinations: IDestination[]): boolean => {
    const cityNames = destinations.map(m => m.cityName);
    return new Set(cityNames).size !== cityNames.length;
};

class SimpleMap extends React.Component<MapProp, MapState> {
    public static IsMobile(): boolean {
        return window.screen.width < parseInt(process.env.REACT_APP_MOBILE_WIDTH || '');
    }

    private static mapInitProp = (): MapInitProps =>
        SimpleMap.IsMobile()
            ? {
                  defaultZoom: gMapConf.defaultMobileZoom as number,
                  zoomControl: false,
                  scrollwheel: false,
                  gestureHandling: 'greedy'
              }
            : {
                  defaultZoom: gMapConf.defaultDesktopZoom as number,
                  zoomControl: true,
                  scrollwheel: true,
                  gestureHandling: 'greedy'
              };

    private googleMaps?: GoogleMapObj;
    private flightPathPolyLine: any;

    private priceHovered?: boolean; // helps to avoid closing price-marker when hover price-marker leaving pin-marker

    private previousDestinations?: IDestination[];
    private markerClusterer?: GoogleMarkerClustererInf;

    private lastRequestTimeMs: number;
    private minLoaderShowMs: number;

    private defaultCenter: Coordinates;
    private mapProps: MapInitProps;
    private departureAirportId: string;

    constructor(props: any) {
        super(props);
        // no matters what MapArea at this point at all,
        // we set lat/lng and zoom for component directly and it will be overridden
        this.state = {
            destinationsRequestModel: new FlightDestinationRequest(
                process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '',
                MapArea.createRandom(),
                null,
                new DatesInput(-1)
            ),
            selectedAirportLabel: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
            departureCoordinate: new Coordinates(0, 0),
            isFullScreen: false
        };
        this.departureAirportId = process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '';
        this.defaultCenter = gMapConf.defaultCentre;
        this.mapProps = SimpleMap.mapInitProp();

        this.requestDestinationsUpdate = this.requestDestinationsUpdate.bind(this);
        this.mapChanged = this.mapChanged.bind(this);
        this.onGoogleApiLoaded = this.onGoogleApiLoaded.bind(this);
        this.drawPolyLine = this.drawPolyLine.bind(this);
        this.cleanupPolyLines = this.cleanupPolyLines.bind(this);
        this.updateDepartureAirport = this.updateDepartureAirport.bind(this);
        this.setDepartureCoordinates = this.setDepartureCoordinates.bind(this);
        this.toggleOnPinPriceMarker = this.toggleOnPinPriceMarker.bind(this);
        this.fullScreenToggle = this.fullScreenToggle.bind(this);
        this.fullScreenClickHelper = this.fullScreenClickHelper.bind(this);
        SimpleMap.IsMobile = SimpleMap.IsMobile.bind(this);

        this.lastRequestTimeMs = Date.now();
        this.minLoaderShowMs = parseInt(process.env.REACT_APP_LOADER_SHOW_MIN_TIME_MS || '');
    }

    componentDidMount(): void {
        fetchDepartureAirport(this.departureAirportId, this.setDepartureCoordinates);
    }

    onGoogleApiLoaded(maps: GoogleMapObj) {
        this.googleMaps = maps;
    }

    fullScreenToggle() {
        let container = document.getElementById('main-container');
        let text = document.getElementsByClassName('filter-title');
        this.setState({
            isFullScreen: !this.state.isFullScreen
        });
        if (text.length !== 0) {
            for (let i = 0; i < text.length; i++) {
                this.fullScreenClickHelper(text.item(i) as HTMLElement, 'hide');
            }
        }
        if (container) {
            this.fullScreenClickHelper(container, 'full-screen');
        }
    }

    fullScreenClickHelper(element: HTMLElement, className: string) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    }

    drawPolyLine(destLat: number, destLng: number): void {
        if (!this.googleMaps) {
            return;
        }

        if (this.flightPathPolyLine && this.flightPathPolyLine.map) {
            return;
        }
        const pointsline = [{ lat: destLat, lng: destLng }, this.state.departureCoordinate];
        this.flightPathPolyLine = new this.googleMaps.maps.Polyline({
            path: pointsline,
            geodesic: true,
            strokeColor: '#454545',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        this.flightPathPolyLine.setMap(this.googleMaps.map);
    }

    cleanupPolyLines(): void {
        if (this.flightPathPolyLine) {
            this.flightPathPolyLine.setMap(null);
        }
    }

    loadMarkerClusers(
        map: any,
        markers: GoogleMarkerIntf[],
        options: any,
        callback: (markerCluster: GoogleMarkerClustererInf) => JSX.Element[]
    ) {
        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }
        this.markerClusterer = new window.MarkerClusterer(map, markers, options);

        this.loadMarkerClusersDelayed(callback);
    }

    loadMarkerClusersDelayed(callback: (markerCluster: GoogleMarkerClustererInf) => JSX.Element[]) {
        setTimeout(() => {
            if (this.markerClusterer!.ready_) {
                this.setState({
                    markers: callback(this.markerClusterer!)
                });
            } else {
                this.loadMarkerClusersDelayed(callback);
            }
        }, 50);
    }

    loadDestinations() {
        // run it in timeout as marker,googlemap or destinations may not be yet ready
        // used instead of setInverval, as clearInverval may not stop interval
        setTimeout(() => {
            const dests = this.props.destinations;
            if (!this.props.destinations || !window.MarkerClusterer || !this.googleMaps) {
                this.loadDestinations();
                return;
            }

            if (this.previousDestinations === dests) {
                // prevent recursion: performLoadDestinations will update
                // state in callback eventually which will fire loadDestinations again
                return;
            }
            this.previousDestinations = dests;
            this.performLoadDestinations(dests);
        }, 50);
    }

    performLoadDestinations(dests: IDestination[]) {
        const noPriceDests = dests.filter(d => d.price === -1);
        const hasPriceDests = dests.filter(d => d.price !== -1).sort(sortDestinationsDesc);
        const markersObj = hasPriceDests.map((d: IDestination) => {
            const m: GoogleMarkerIntf = new this.googleMaps!.maps.Marker({
                position: { lat: d.lat, lng: d.lng }
            });
            m.setVisible(false); // hide markers even before adding them to MarkerCluterer
            m.destination = d; // add destination property to marker, it'll be passed to markerCluster.clusters_[i].markers array
            return m;
        });

        const customSelectMany = function selectMany<TIn, TOut>(
            input: TIn[],
            selectListFn: (t: TIn) => TOut[]
        ): TOut[] {
            return input.reduce((out, inx) => {
                out.push(...selectListFn(inx));
                return out;
            }, new Array<TOut>());
        };
        this.loadMarkerClusers(
            this.googleMaps!.map,
            markersObj,
            {
                gridSize: 70, // The grid size of a cluster in pixels.
                minimumClusterSize: 2, // The minimum number of markers to be in a cluster before the markers are hidden and a count is shown
                zoomOnClick: true, // Whether the default behaviour of clicking on a cluster is to zoom into it
                averageCenter: true, // Whether the center of each cluster should be the average of all markers in the cluster,
                ignoreHidden: true
            },
            (markerCluster: GoogleMarkerClustererInf) => {
                // The idea is to find clusters to render,
                // then specific markers to render that may be either price tag marker or pin - marker

                const generatePriceTagMarker = (
                    key: number,
                    record: IDestination,
                    cluster?: GoogleClusterIntf,
                    sameCity: boolean = false
                ): JSX.Element => (
                    <PriceTagMarker
                        key={key}
                        lat={record.lat} // to be consumed only by Maps API
                        lng={record.lng} // to be consumed only by Maps API
                        // properties used by marker component properties:
                        destinations={[convertDestination(record)]}
                        showAirportName={showAirportName}
                        forbidExpand={!sameCity}
                        fromCode={this.state.destinationsRequestModel.departureAirportId}
                        fromLabel={this.state.selectedAirportLabel ? this.state.selectedAirportLabel : ''}
                        onMouseEnter={() => {
                            setTimeout(() => {
                                this.drawPolyLine(record.lat, record.lng);
                            }, 50);
                        }}
                        customOnClick={!sameCity && cluster ? () => this.zoomIn(cluster) : undefined}
                        onMouseLeave={this.cleanupPolyLines}
                    />
                );
                const self = this;
                const generatePinMarker = (
                    key: number,
                    priceTagMarkerEl: JSX.Element,
                    record: IDestination,
                    disabled: boolean
                ): JSX.Element => {
                    const hidableMarkerProps = { ...priceTagMarkerEl.props };
                    const onLeaveOriginal = hidableMarkerProps.onMouseLeave.bind({});
                    const onHoverOriginal = hidableMarkerProps.onMouseEnter.bind({});

                    hidableMarkerProps.onMouseLeave = () => {
                        onLeaveOriginal();
                        self.toggleOnPinPriceMarker();
                        self.priceHovered = false;
                    };
                    hidableMarkerProps.onMouseEnter = () => {
                        onHoverOriginal();
                        self.priceHovered = true;
                    };
                    const hidableMarker = React.cloneElement(priceTagMarkerEl, hidableMarkerProps);
                    return (
                        <TinyPinMarker
                            key={key}
                            lat={record.lat} // to be consumed only by Maps API
                            lng={record.lng} // to be consumed only by Maps API
                            // properties used by marker component properties:
                            disabled={disabled}
                            onHover={() => {
                                self.drawPolyLine(record.lat, record.lng);
                                self.toggleOnPinPriceMarker(hidableMarker);
                            }}
                            onLeave={() =>
                                setTimeout(() => {
                                    if (!self.priceHovered) {
                                        // if price tag marker was hovered, no need to close it
                                        self.toggleOnPinPriceMarker();
                                    }
                                    if (!self.priceHovered) {
                                        self.cleanupPolyLines();
                                    }
                                }, 100)
                            } // add small timeout to let it detect hover on price tag mareker
                        />
                    );
                };

                const clustersToRender = markerCluster.clusters_
                    .filter(
                        (c: GoogleClusterIntf) =>
                            c.getMarkers().length >= c.minClusterSize_ && c.getMarkers().length > 0
                    )
                    .map((cluster: GoogleClusterIntf, idx: number) => {
                        const destsInCluster = cluster
                            .getMarkers()
                            .map((m: GoogleMarkerIntf) => m.destination)
                            .sort(sortDestinationsDesc); // make sure they're sored. who knows whether google API keep markers sorted

                        const sameCity = false;

                        const topMarker = destsInCluster[0];

                        return (
                            <PriceTagMarker
                                key={idx}
                                lat={topMarker.lat}
                                lng={topMarker.lng}
                                destinations={destsInCluster.map((record: IDestination) => convertDestination(record))}
                                forbidExpand={!sameCity}
                                fromCode={this.state.destinationsRequestModel.departureAirportId}
                                fromLabel={this.state.selectedAirportLabel ? this.state.selectedAirportLabel : ''}
                                onMouseEnter={() => {
                                    setTimeout(() => {
                                        this.drawPolyLine(topMarker.lat, topMarker.lng);
                                    }, 50);
                                }}
                                customOnClick={!sameCity ? () => this.zoomIn(cluster) : undefined}
                                onMouseLeave={this.cleanupPolyLines}
                            />
                        );
                    });

                const singleMarkers = customSelectMany(
                    markerCluster.clusters_.filter((c: GoogleClusterIntf) => c.getMarkers().length < c.minClusterSize_),
                    (c: GoogleClusterIntf) => c.getMarkers()
                );

                const sortedDests = singleMarkers
                    .filter(m => m.destination)
                    .map(m => m.destination)
                    .sort(sortDestinationsDesc);
                const showAirportName = anySimilarDestinations(sortedDests);

                const singleMarkersToRender = sortedDests.map((record: IDestination, idx: number) => {
                    const priceTagMarkerEl = generatePriceTagMarker(clustersToRender.length + idx, record);

                    // now show tiny markers. notice, that clusters No is counted
                    if (this.props.maxNumberOfConcurrentPriceMarkers <= clustersToRender.length + idx) {
                        return generatePinMarker(clustersToRender.length + idx, priceTagMarkerEl, record, false);
                    }
                    return priceTagMarkerEl;
                });
                return clustersToRender.concat(singleMarkersToRender).concat(
                    noPriceDests.map((dest: IDestination, idx: number) => {
                        dest.flightDates.departureDate = new Date();
                        dest.flightDates.returnDate = new Date(dest.flightDates.departureDate);
                        dest.flightDates.returnDate.setDate(dest.flightDates.returnDate.getDate() + 7);
                        const marker = generatePriceTagMarker(clustersToRender.length + idx, dest);
                        return generatePinMarker(
                            clustersToRender.length + singleMarkersToRender.length + idx,
                            marker,
                            dest,
                            true
                        );
                    })
                );
            }
        );
    }

    zoomIn(cluster: GoogleClusterIntf) {
        if (!this.googleMaps || !cluster.markers_) {
            return;
        }
        // zoom in
        const prevZoom = this.googleMaps.map.zoom;
        const bounds = cluster.getBounds();
        this.googleMaps.map.fitBounds(bounds, 20);
        if (this.googleMaps.map.zoom === prevZoom) {
            // only on some mobiles in landscape mode zoom may not work properly, no manually reduce bounds:
            const strength = 1.1;
            var newne = new this.googleMaps.maps.LatLng(
                bounds.getNorthEast().lat() - strength,
                bounds.getNorthEast().lng() - strength
            );
            var newsw = new this.googleMaps.maps.LatLng(
                bounds.getSouthWest().lat() + strength,
                bounds.getSouthWest().lng() + strength
            );
            this.googleMaps.map.fitBounds(new this.googleMaps.maps.LatLngBounds(newsw, newne));
        }
    }

    toggleOnPinPriceMarker(element?: JSX.Element) {
        this.setState({
            onPinHoverElement: element
        });
    }

    setDepartureCoordinates(values: Coordinates) {
        this.setState({
            departureCoordinate: values
        });
    }

    renderDepartureAirport() {
        return (
            <DepartureMarker
                key={this.state.departureCoordinate.lat}
                lat={this.state.departureCoordinate.lat} // to be consumed only by Maps API
                lng={this.state.departureCoordinate.lng} // to be consumed only by Maps API
            />
        );
    }

    updateDepartureAirport(departureAirportCode: string) {
        if (this.departureAirportId !== departureAirportCode) {
            this.departureAirportId = departureAirportCode ? departureAirportCode : '';
            fetchDepartureAirport(this.departureAirportId, this.setDepartureCoordinates);
        }
    }

    requestDestinationsUpdate(model: FlightDestinationRequest, selectedAirportLabel: string | null) {
        this.lastRequestTimeMs = Date.now();

        this.setState(
            {
                destinationsRequestModel: model,
                selectedAirportLabel: selectedAirportLabel ? selectedAirportLabel : this.state.selectedAirportLabel
            },
            () => {
                // initiate fetching destinations here
                this.props.fetchDestinations(this.state.destinationsRequestModel);
            }
        );
    }

    // mapChanged. Get fired on: drag end/zoom/on initial load
    mapChanged(changeEvent: ChangeEventValue) {
        const currentMode = this.state.destinationsRequestModel;
        currentMode.searchArea.nw = changeEvent.marginBounds.nw;
        currentMode.searchArea.se = changeEvent.marginBounds.se;

        // google-map-react does not reset Lng when moving accross pacific ocean. So let's do it manually
        if (currentMode.searchArea.nw.lng > 180) {
            currentMode.searchArea.nw.lng -= 360;
        }
        if (currentMode.searchArea.se.lng > 180) {
            currentMode.searchArea.se.lng -= 360;
        }
        if (currentMode.searchArea.nw.lng < -180) {
            currentMode.searchArea.nw.lng += 360;
        }
        if (currentMode.searchArea.se.lng < -180) {
            currentMode.searchArea.se.lng += 360;
        }

        this.requestDestinationsUpdate(currentMode, this.state.selectedAirportLabel);
        if (this.flightPathPolyLine) {
            this.flightPathPolyLine.setMap(null);
        }
    }

    getDelayedLoader(): boolean {
        const diff = Date.now() - this.lastRequestTimeMs;
        if (diff < this.minLoaderShowMs && !this.props.isLoading) {
            setTimeout(() => {
                //this.loading = false;
                this.forceUpdate();
            }, this.minLoaderShowMs);
            return true;
        }
        if (diff < this.minLoaderShowMs && this.props.isLoading) {
            return true;
        }
        return this.props.isLoading;
    }

    render() {
        const isLoading = this.getDelayedLoader();
        this.loadDestinations();
        return (
            <div className={classnames('app-wrapper', { 'full-screen-map-toggle': this.state.isFullScreen })}>
                <div className={'filter-widget-wrapper'}>
                    <SearchWidgetWrapper
                        onChange={this.requestDestinationsUpdate}
                        initialModel={this.state.destinationsRequestModel}
                        updateDepartureAirport={this.updateDepartureAirport}
                        isFullScreen={!!this.state.isFullScreen}
                    />
                </div>
                <div className={'map-wrapper-container'}>
                    <div className={'map-row-wrapper'}>
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                key: process.env.REACT_APP_GMAP_API_KEY || '',
                                language: 'en'
                            }}
                            defaultCenter={this.defaultCenter}
                            defaultZoom={this.mapProps.defaultZoom}
                            onChange={this.mapChanged}
                            onGoogleApiLoaded={this.onGoogleApiLoaded}
                            yesIWantToUseGoogleMapApiInternals={true} // because we want to access PolyLine
                            options={{
                                fullscreenControl: false,
                                gestureHandling: this.mapProps.gestureHandling,
                                maxZoom: this.mapProps.defaultZoom * 3,

                                minZoom: this.mapProps.defaultZoom * 0.8,
                                minZoomOverride: true,
                                zoomControl: this.mapProps.zoomControl,
                                scrollwheel: this.mapProps.scrollwheel,
                                styles: gMapConf.styles as MapTypeStyle[]
                            }}
                        >
                            {this.state.markers}
                            {this.renderDepartureAirport()}
                            {this.state.onPinHoverElement}
                        </GoogleMapReact>
                    </div>
                </div>

                {isLoading && (
                    <div className="loader-container">
                        <ColorLinearProgress />
                    </div>
                )}

                {!SimpleMap.IsMobile() && (
                    <div>
                        {this.state.isFullScreen ? (
                            <button className="full-screen-switcher" onClick={this.fullScreenToggle}>
                                <FontAwesomeIcon icon={faCompress} />
                            </button>
                        ) : (
                            <button className="full-screen-switcher" onClick={this.fullScreenToggle}>
                                <FontAwesomeIcon icon={faExpand} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: { destinationsReducer: DestinationsState }) => {
    return {
        destinations: state.destinationsReducer.destinations,
        isLoading: state.destinationsReducer.isLoading,
        error: state.destinationsReducer.error
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchDestinations: (model: FlightDestinationRequest) =>
            dispatch(destinationActions.fetchDestinationsStart(model))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimpleMap);
