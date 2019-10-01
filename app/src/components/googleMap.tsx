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
import { pixelDistance } from 'components/markers/Clusterer';

import './googleMap.scss';

interface MapProp {
    error?: string;
    isLoading?: boolean;
    maxNumberOfConcurrentPriceMarkers: number;
    destinations: IDestination[];
    fetchDestinations: (arg: FlightDestinationRequest) => {};
}

type DrawerSide = 'cooperative' | 'auto';

interface MapState {
    center: {
        lat: number;
        lng: number;
    };
    mapProps: MapInitProps;
    destinationsRequestModel: FlightDestinationRequest;
    isLoading?: boolean;
    error?: string;
    selectedAirportlabel: string; //label and Id is not the same thing
    departureAirportId: string;
    departureCoordinate: Coordinates;
    onPinHoverElement?: JSX.Element;
}

interface MapInitProps {
    defaultZoom: number;
    zoomControl: boolean;
    scrollwheel: boolean;
    gestureHandling: DrawerSide;
}

interface GoogleMapObj {
    map: { zoom: number };
    maps: { Polyline: any };
}

interface IDestinationGroup {
    key: IDestination;
    values: DestinationProp[];
}

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: '#cccccc'
    },
    barColorPrimary: {
        backgroundColor: '#999'
    }
})(LinearProgress);

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
                  gestureHandling: 'cooperative'
              }
            : {
                  defaultZoom: gMapConf.defaultDesktopZoom as number,
                  zoomControl: true,
                  scrollwheel: true,
                  gestureHandling: 'auto'
              };

    private googleMaps?: GoogleMapObj;
    private flightPathPolyLine: any;

    private priceHovered?: boolean; // helps to avoid closing price-marker when hover price-marker leaving pin-marker

    constructor(props: any) {
        super(props);
        // no matters what MapArea at this point at all,
        // we set lat/lng and zoom for component directly and it will be overridden
        this.state = {
            mapProps: SimpleMap.mapInitProp(),
            center: gMapConf.defaultCentre,
            destinationsRequestModel: new FlightDestinationRequest(
                process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '',
                MapArea.createRandom(),
                null,
                new DatesInput(-1)
            ),
            selectedAirportlabel: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
            departureAirportId: process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '',
            departureCoordinate: new Coordinates(0, 0)
        };

        this.requestDestinationsUpdate = this.requestDestinationsUpdate.bind(this);
        this.mapChanged = this.mapChanged.bind(this);
        this.onGoogleApiLoaded = this.onGoogleApiLoaded.bind(this);
        this.drawPolyLine = this.drawPolyLine.bind(this);
        this.cleanupPolyLines = this.cleanupPolyLines.bind(this);
        this.updateDepartureAirport = this.updateDepartureAirport.bind(this);
        this.setDepartureCoordinates = this.setDepartureCoordinates.bind(this);
        this.toogleOnPinPriceMarker = this.toogleOnPinPriceMarker.bind(this);
        SimpleMap.IsMobile = SimpleMap.IsMobile.bind(this);
    }

    componentDidMount(): void {
        fetchDepartureAirport(this.state.departureAirportId, this.setDepartureCoordinates);
    }

    onGoogleApiLoaded(maps: GoogleMapObj) {
        this.googleMaps = maps;
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

    renderDestinations() {
        const dests = this.props.destinations;
        if (!dests) {
            return '';
        }
        const noPriceDests = dests.filter(d => d.price === -1);
        const hasPriceDests = dests.filter(d => d.price !== -1).sort((a: IDestination, b: IDestination) => {
            // sorting by descending
            if (a.personalPriorityIdx < b.personalPriorityIdx) {
                return 1;
            }
            if (a.personalPriorityIdx > b.personalPriorityIdx) {
                return -1;
            }
            return 0;
        });
		const groupedDests = this.groupDestinations(hasPriceDests);
        return groupedDests
            .map((group: { key: IDestination; values: DestinationProp[] }, idx: number) => {
                const record = group.key;
                if (
                    record.lat === undefined ||
                    record.lng === undefined ||
                    record.price === undefined ||
                    record.personalPriorityIdx === undefined ||
                    record.cityName === undefined
                ) {
                    return '';
                }

                const priceTagMarkerEl = (
                    <PriceTagMarker
                        key={idx}
                        lat={record.lat} // to be consumed only by Maps API
                        lng={record.lng} // to be consumed only by Maps API
                        // properties used by marker component properties:
                        destinations={group.values}
                        fromCode={this.state.destinationsRequestModel.departureAirportId}
                        fromLabel={this.state.selectedAirportlabel ? this.state.selectedAirportlabel : ''}
                        onMouseEnter={() => {
                            this.drawPolyLine(record.lat, record.lng);
                        }}
                        onMouseLeave={this.cleanupPolyLines}
                    />
                );
				if (hasPriceDests.indexOf(record) > this.props.maxNumberOfConcurrentPriceMarkers) {
                    const hidableMarkerProps = { ...priceTagMarkerEl.props };
                    const onLeaveOriginal = hidableMarkerProps.onMouseLeave.bind({});
                    const onHoverOriginal = hidableMarkerProps.onMouseEnter.bind({});

                    hidableMarkerProps.onMouseLeave = () => {
                        onLeaveOriginal();
                        this.toogleOnPinPriceMarker();
                        this.priceHovered = false;
                    };
                    hidableMarkerProps.onMouseEnter = () => {
                        onHoverOriginal();
                        this.priceHovered = true;
                    };
                    const hidableMarker = React.cloneElement(priceTagMarkerEl, hidableMarkerProps);
                    return (
                        <TinyPinMarker
                            key={idx}
                            lat={record.lat} // to be consumed only by Maps API
                            lng={record.lng} // to be consumed only by Maps API
                            // properties used by marker component properties:
                            onHover={() => {
                                this.drawPolyLine(record.lat, record.lng);
                                this.toogleOnPinPriceMarker(hidableMarker);
                            }}
                            onLeave={() =>
                                setTimeout(() => {
                                    if (!this.priceHovered)
                                        // if price tag marker was hovered, no need to close it
                                        this.toogleOnPinPriceMarker();
                                    if (!this.priceHovered) {
                                        this.cleanupPolyLines();
                                    }
                                }, 100)
                            } // add small timeout to let it detect hover on price tag mareker
                        />
                    );
                }
                return priceTagMarkerEl;
            })
            .concat(
                noPriceDests.map((d: IDestination, idx: number) => (
                    <TinyPinMarker
                        key={groupedDests.length + idx}
                        lat={d.lat} // to be consumed only by Maps API
                        lng={d.lng} // to be consumed only by Maps API
                        disabled={true}
                    />
                ))
            );
    }

    toogleOnPinPriceMarker(element?: JSX.Element) {
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

    areDestinationsCloseEnough(d1: IDestination, d2: IDestination): boolean {
        if (!this.googleMaps) {
            return d1.lat === d2.lat && d1.lng === d2.lng;
        } //if something is wrong, just don't show clusterization

        // TODO: use advanced clusterization algorithm. while 4/zl should be ok for the beginning
        const zoomLevel = this.googleMaps.map.zoom; // int numbers, for instance: 7 (close), 6, 5, 4, 3 (far away)
		if (zoomLevel > 7) {
			return d1.lat === d2.lat && d1.lng === d2.lng;
		}
		const dist = pixelDistance(d1.lat, d1.lng, d2.lat, d2.lng, zoomLevel);
		return dist < 70;
    }

    groupDestinations(dests: IDestination[]): IDestinationGroup[] {
		const self = this;
		const group = dests.reduce(function (storage: IDestinationGroup[], item: IDestination) {
            // get the first instance of the key by which we're grouping
            const existingStorageItem = storage.find(g => self.areDestinationsCloseEnough(g.key, item));
            if (existingStorageItem) {
                existingStorageItem.values.push({
                    destination: item.airportName ? item.airportName : item.cityName,
                    destinationCode: item.destAirportCode,
                    priority: item.personalPriorityIdx,
                    dateOut: item.flightDates.departureDate,
                    dateBack: item.flightDates.returnDate,
                    price: item.price
                });
            } else {
                // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
                storage.push({
                    key: item,
                    values: [
                        {
                            destination: item.cityName,
                            destinationCode: item.destAirportCode,
                            priority: item.personalPriorityIdx,
                            dateOut: item.flightDates.departureDate,
                            dateBack: item.flightDates.returnDate,
                            price: item.price
                        }
                    ]
                });
            }
            // return the updated storage to the reduce function, which will then loop through the next
            return storage;
        }, []);
        return group;
    }

    updateDepartureAirport(departureAirportCode: string) {
        if (this.state.departureAirportId !== departureAirportCode) {
            this.setState(
                {
                    departureAirportId: departureAirportCode ? departureAirportCode : ''
                },
                () => {
                    fetchDepartureAirport(this.state.departureAirportId, this.setDepartureCoordinates);
                }
            );
        }
    }

    requestDestinationsUpdate(model: FlightDestinationRequest, selectedAirportLabel: string | null) {
        this.setState({
            destinationsRequestModel: model,
            isLoading: model.departureAirportId != null
        });

        this.setState({
            selectedAirportlabel: selectedAirportLabel ? selectedAirportLabel : ''
        });

        // initiate fetching destinations here
        this.props.fetchDestinations(this.state.destinationsRequestModel);
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

        this.requestDestinationsUpdate(currentMode, this.state.selectedAirportlabel);
        if (this.flightPathPolyLine) {
            this.flightPathPolyLine.setMap(null);
        }
    }

    render() {
        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs',
                        language: 'en'
                    }}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.mapProps.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    onChange={this.mapChanged}
                    onGoogleApiLoaded={this.onGoogleApiLoaded}
                    yesIWantToUseGoogleMapApiInternals={true} // because we want to access PolyLine
                    options={{
                        fullscreenControl: true,
                        fullscreenControlOptions: {
                            position: 6
                        },
                        gestureHandling: 'cooperative',
                        maxZoom: this.state.mapProps.defaultZoom * 3,

                        minZoom: this.state.mapProps.defaultZoom * 0.8,
                        minZoomOverride: true,
                        // disableDefaultUI: true,
                        zoomControl: this.state.mapProps.zoomControl,
                        scrollwheel: this.state.mapProps.scrollwheel,
                        styles: gMapConf.styles as MapTypeStyle[]
                    }}
                >
                    {this.renderDestinations()}
                    {this.renderDepartureAirport()}
                    {this.state.onPinHoverElement}
                </GoogleMapReact>
                <SearchWidgetWrapper
                    onChange={this.requestDestinationsUpdate}
                    initialModel={this.state.destinationsRequestModel}
                    updateDepartureAirport={this.updateDepartureAirport}
                />
                {this.props.isLoading && (
                    <div className="loader-container">
                        <ColorLinearProgress />
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
