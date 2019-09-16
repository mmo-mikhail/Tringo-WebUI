import * as React from 'react';
import { connect } from 'react-redux';
import GoogleMapReact, { ChangeEventValue, MapTypeStyle } from 'google-map-react';
import PriceTagMarker from 'components/marker/priceTagMarker';
import { IDestination } from 'models/response/destination';
import * as destinationActions from 'actions/destinations';
import SearchWidgetWrapper from 'components/searchWidget/searchWidgetWrapper';
import { FlightDestinationRequest, MapArea } from 'models/request/flightDestinationRequest';
import { DatesInput } from 'models/request/dateInput';
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
    selectedAirportlabel: string;
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
                process.env.REACT_APP_DEFAULT_DEPARTURE || '',
                MapArea.createRandom(),
                null,
                new DatesInput(-1)
            ),
            selectedAirportlabel: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || ''
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
                        destination={record.cityName}
                        destinationCode={record.destAirportCode}
                        priority={record.personalPriorityIdx}
                        dateOut={record.flightDates.departureDate}
                        dateBack={record.flightDates.returnDate}
                        fromCode={this.state.destinationsRequestModel.departureAirportId}
                        fromLabel={this.state.selectedAirportlabel ? this.state.selectedAirportlabel : ''}
                    />
                );
            })
        );
    }

    requestDestinationsUpdate(model: FlightDestinationRequest, selectedAirportLabel: string | null) {
        this.setState({
            destinationsRequestModel: model,
            isLoading: true
        });
        if (selectedAirportLabel) {
            this.setState({
                selectedAirportlabel: selectedAirportLabel
            });
        }
        //this.props.isLoading = true;
        // initiate fetching destinations here
        this.props.fetchDestinations(this.state.destinationsRequestModel);
    }

    // mapChanged. Get fired on: drag end/zoom/on initial load
    mapChanged(changeEvent: ChangeEventValue) {
        const currentMode = this.state.destinationsRequestModel;
        currentMode.searchArea.nw = changeEvent.marginBounds.nw;
        currentMode.searchArea.se = changeEvent.marginBounds.se;
        this.requestDestinationsUpdate(currentMode, this.state.selectedAirportlabel);
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
                <SearchWidgetWrapper
                    onChange={this.requestDestinationsUpdate}
                    initialModel={this.state.destinationsRequestModel}
                />
                {this.props.isLoading && <div />}
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
