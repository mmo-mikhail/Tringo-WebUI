import * as React from 'react';
import { connect } from 'react-redux';
import GoogleMapReact, { ChangeEventValue, MapTypeStyle } from 'google-map-react';
import PriceTagMarker from 'components/marker/priceTagMarker';
import { IDestination } from 'models/response/destination';
import * as destinationActions from 'actions/destinations';
import SearchWidgetBase from 'components/searchWidget/searchWidgetBase';
import { Budget, FlightDestinationRequest, MapArea } from 'models/request/flightDestinationRequest';
import { DatesInput, Duration, UncertainDates } from 'models/request/dateInput';
import gMapConf from './gMapConf.json';
import { DestinationsState } from 'models/response/destinations';

interface MapProp {
    error?: string;
    isLoading?: boolean;
    destinations: IDestination[];
    fetchDestinations: (arg: FlightDestinationRequest) => {};
}

interface MapState {
    center: {
        lat: number;
        lng: number;
    };
    mapProps: MapInitProps;
    destinationsRequestModel: FlightDestinationRequest;
    isLoading?: boolean;
    error?: string;
}

interface MapInitProps {
    defaultZoom: number;
    zoomControl: boolean;
    scrollwheel: boolean;
}

class SimpleMap extends React.Component<MapProp, MapState> {
    constructor(props: any) {
        super(props);

        // no matters what MapArea at this point at all,
        // we set lat/lng and zoom for component directly and it will be overriden
        this.state = {
            mapProps: this.mapInitProp(),
            center: gMapConf.defaultCentre,
            destinationsRequestModel: new FlightDestinationRequest(
                'SYD',
                MapArea.createRandom(),
                new Budget(0, parseInt(process.env.REACT_APP_MAX_BUDGET || '')),
                new DatesInput(null, null, new UncertainDates(new Date().getMonth() + 1, Duration.Weekend))
            )
        };

        this.requestDestinationsUpdate = this.requestDestinationsUpdate.bind(this);
        this.mapChanged = this.mapChanged.bind(this);
    }

    private mapInitProp(): MapInitProps {
        let prop =
            window.screen.width < parseInt(process.env.REACT_APP_MOBILE_WIDTH || '')
                ? {
                      defaultZoom: gMapConf.defaultMobileZoom as number,
                      zoomControl: false,
                      scrollwheel: false
                  }
                : {
                      defaultZoom: gMapConf.defaultDesktopZoom as number,
                      zoomControl: true,
                      scrollwheel: true
                  };

        // const screenHeight = window.screen.height * window.devicePixelRatio;
        return prop;
    }

    renderDestinations() {
        return (
            this.props.destinations &&
            this.props.destinations.map((record: IDestination, idx: number) => {
                if (
                    record.lat === undefined ||
                    record.lng === undefined ||
                    record.price === undefined ||
                    record.personalPriorityIdx === undefined ||
                    record.cityName === undefined
                ) {
                    return '';
                }
                return (
                    <PriceTagMarker
                        key={idx} // required for Maps API
                        lat={record.lat} // to be consumed only by Maps API
                        lng={record.lng} // to be consumed only by Maps API
                        // properties used by marker component properties:
                        price={record.price}
                        title={record.cityName}
                        priority={record.personalPriorityIdx}
                        redirectUrl={this.buildRedirectUrl(record)}
                    />
                );
            })
        );
    }

    requestDestinationsUpdate(model: FlightDestinationRequest) {
        this.setState({
            destinationsRequestModel: model,
            isLoading: true
        });
        //this.props.isLoading = true;
        // initiate fetching destinations here
        this.props.fetchDestinations(this.state.destinationsRequestModel);
    }

    // mapChanged. Get fired on: drag end/zoom/on initial load
    mapChanged(changeEvent: ChangeEventValue) {
        const currentMode = this.state.destinationsRequestModel;
        currentMode.searchArea.nw = changeEvent.marginBounds.nw;
        currentMode.searchArea.se = changeEvent.marginBounds.se;
        this.requestDestinationsUpdate(currentMode);
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
                    options={{
                        fullscreenControl: false,
                        maxZoom: this.state.mapProps.defaultZoom * 1.5,
                        minZoom: this.state.mapProps.defaultZoom * 0.8,
                        minZoomOverride: true,
                        disableDefaultUI: true,
                        zoomControl: this.state.mapProps.zoomControl,
                        scrollwheel: this.state.mapProps.scrollwheel,
                        styles: gMapConf.styles as MapTypeStyle[]
                    }}
                >
                    {this.renderDestinations()}
                </GoogleMapReact>
                <SearchWidgetBase
                    onChange={this.requestDestinationsUpdate}
                    initialModel={this.state.destinationsRequestModel}
                />
                {this.props.isLoading && <div></div>}
            </div>
        );
    }

    buildRedirectUrl(destination: IDestination): string {
        return 'https://google.com';
        //const reqModel = this.state.destinationsRequestModel;
        //const destAirportId = 'LON'; // from destination
        //const depDate = new Date(2019, 10, 17); // from destination
        //const retDate = new Date(2019, 10, 19); // from destination
        //const url = "https://services.dev.webjet.com.au/web/flights/redirect?" +
        //	`adults=1&children=0&infants=0&triptype=return&steps=${reqModel.departureAirportId}all-${destAirportId}all-${this.formatDate(depDate)}-economy-${reqModel.departureAirportId}-${destAirportId}` +
        //	`_${destAirportId}all-${reqModel.departureAirportId}all-${this.formatDate(retDate)}-economy-${destAirportId}-${reqModel.departureAirportId}`;
        //console.log(url);
        //return url;
    }

    private formatDate(d: Date): string {
        return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString();
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
