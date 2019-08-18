import * as React from 'react';
import { connect } from "react-redux";
import GoogleMapReact from 'google-map-react';
import PriceTagMarker from './priceTagMarker';
import { IDestination } from './../models/destination';
import * as destinationActions from './../actions/destinations';

class SimpleMap extends React.Component<any, any> {

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
            destinations.map((record: IDestination, idx:number) => (
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

    render() {
        //const { destinations } = this.props;

        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    {this.renderDestinations()}
                </GoogleMapReact>
            </div>
        );
    }
}

const mapStateToProps = (state : any) => {
    const destinations = state.destinationsReducer.destinations;
    return {
        destinations
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchDestinations: () => dispatch(destinationActions.fetchDestinationsStart()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SimpleMap);