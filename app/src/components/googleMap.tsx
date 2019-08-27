import * as React from 'react';
import { connect } from 'react-redux';
import GoogleMapReact, { MapTypeStyle } from 'google-map-react';
import { googleZoomToKms } from 'utils/helpers';
import PriceTagMarker from 'components/marker/priceTagMarker';
import { IDestination } from 'models/destination';
import * as destinationActions from 'actions/destinations';
import SearchWidgetWrapper from 'components/searchWidget/searchWidgetWrapper';
import {
    Budget,
    FlightDestinationRequest,
    MapArea
} from 'models/request/flightDestinationRequest';
import { DatesInput, Duration, UncertainDates } from 'models/request/dateInput';
import gMapConf from './gMapConf.json';

export interface MapProp {
    center: {
        lat: number;
        lng: number;
    };
    defaultZoom: number;
    error?: object;
    isLoading?: boolean;
    destinations: {
        map: (arg: object) => {};
    };
    fetchDestinations: (arg: object) => {};
}

export interface MapState {
    destinationsRequestModel: FlightDestinationRequest;
}

class SimpleMap extends React.Component<MapProp, MapState> {
    constructor(props: any) {
        super(props);

        this.state = {
            destinationsRequestModel: new FlightDestinationRequest(
                'MEL',
                new MapArea(
                    this.props.center.lat,
                    this.props.center.lng,
                    googleZoomToKms(this.props.defaultZoom)
                ),
                new Budget(0, 1000),
                new DatesInput(
                    null,
                    null,
                    new UncertainDates(
                        new Date().getMonth() + 1,
                        Duration.Weekend
                    )
                )
            )
        };
        this.requestDestinationsUpdate = this.requestDestinationsUpdate.bind(
            this
        );
        this.onMapDrag = this.onMapDrag.bind(this);
        this.onMapZoomAnimationEnd = this.onMapZoomAnimationEnd.bind(this);
    }

    renderDestinations() {
        const { error, isLoading, destinations } = this.props;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        return (
            destinations &&
            destinations.map((record: IDestination, idx: number) => {
                    if (record.lat === undefined
                        || record.lng === undefined
                        || record.price === undefined
                        || record.personalPriorityIdx === undefined
                        || record.cityName === undefined) {
                        return "";
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
                        />
                    );
                })
        );
    }

    componentDidMount() {
        this.props.fetchDestinations(this.state.destinationsRequestModel);
    }

    requestDestinationsUpdate(model: FlightDestinationRequest) {
        this.setState({
            destinationsRequestModel: model
        });
        // initiate fetching destinations here
        this.props.fetchDestinations(this.state.destinationsRequestModel);
    }

    onMapDrag(args: any) {
        const currentMode = this.state.destinationsRequestModel;
        currentMode.areaToRequest.lat = args.center.lat;
        currentMode.areaToRequest.lng = args.center.lng;

        this.requestDestinationsUpdate(currentMode);
    }

    onMapZoomAnimationEnd(args: any) {
        if (args === undefined) return;

        const currentMode = this.state.destinationsRequestModel;
        //currentMode.areaToRequest.radius = googleZoomToKms(args.zoom));
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
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    onDrag={this.onMapDrag}
                    onZoomAnimationEnd={this.onMapZoomAnimationEnd}
                    options={{
                        fullscreenControl: false,
                        maxZoom:
                            this.props.defaultZoom +
                            this.props.defaultZoom * 0.3,
                        minZoom:
                            this.props.defaultZoom -
                            this.props.defaultZoom * 0.2,
                        minZoomOverride: true,
                        disableDefaultUI: true,
                        zoomControl: true,
                        styles: gMapConf.styles as MapTypeStyle[]
                    }}
                >
                    {this.renderDestinations()}
                </GoogleMapReact>
                <SearchWidgetWrapper
                    onChange={this.requestDestinationsUpdate}
                    initialModel={this.state.destinationsRequestModel}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    const destinations = state.destinationsReducer.destinations;
    return {
        destinations
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
