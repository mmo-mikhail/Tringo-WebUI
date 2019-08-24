import * as React from 'react';
import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import PriceTagMarker from './marker/priceTagMarker';
import { IDestination } from '../models/destination';
import * as destinationActions from './../actions/destinations';
import SearchWidgetWrapper from './searchWidget/searchWidgetWrapper';
import {
    FlightDestinationRequest,
    MapArea,
    Budget
} from '../models/request/flightDestinationRequest';
import {
    DatesInput,
    UncertainDates,
    Duration
} from '../models/request/dateInput';

class SimpleMap extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            destinationsRequestModel: new FlightDestinationRequest(
                'MEL',
                new MapArea(this.props.center.lat, this.props.center.lng, 200),
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
            destinations.map((record: IDestination, idx: number) => (
                <PriceTagMarker
                    key={idx}
                    lat={record.lat}
                    lng={record.lng}
                    price={record.price}
                    title={record.cityName}
                />
            ))
        );
    }

    componentDidMount() {
        this.props.fetchDestinations();
    }

    requestDestinationsUpdate(model: FlightDestinationRequest) {
        //console.log("requestDestinationsUpdate, for model:");
        //console.log(model);
        this.setState({
            destinationsRequestModel: model
        });
        //intiiate fetching destinations here
    }

    render() {
        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs'
                    }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.defaultZoom} // km = ( 40000/2 ^ zl ) * 2
                    style={{ height: '100%', width: '100%' }}
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
        fetchDestinations: () =>
            dispatch(destinationActions.fetchDestinationsStart())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimpleMap);
