import * as React from 'react';
import { connect } from "react-redux";
import GoogleMapReact from 'google-map-react';
import PriceTagMarker from './priceTagMarker';
import { IDestination } from './../models/destination';
import * as destinationActions from './../actions/destinations';
import Autocomplete from "./Autocomplete";

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
        const fetchLocationData = (inputValue:any, callback:any) => {
            // Mock api call
            setTimeout(() => {
                callback([
                    {
                        value: 1,
                        label: "Melbourne International Airport, Australia",
                        optionLabel: "Melbourne International Airport (MEL)",
                        optionSubLabel: "Melbourne, Australia"
                    },
                    {
                        value: 2,
                        label: "Sydney International Airport, Australia",
                        optionLabel: "Sydney International Airport (SYD)",
                        optionSubLabel: "Sydney, Australia"
                    },
                    {
                        value: 3,
                        label: "Perth International Airport, Australia",
                        optionLabel: "Perth International Airport (PER)",
                        optionSubLabel: "Perth, Australia"
                    }
                ]);
            }, 500);
        };
        const noOptionsMessage =
            "No cities or airports were found. Please check your spelling.";
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
                <div >
                    <Autocomplete
                        id="pickup-location"
                        className="pickup-location"
                        placeholder="Pick up location"
                        minValueLength={3}
                        noOptionsMessage={noOptionsMessage}
                        fetchOptions={fetchLocationData}
                        inputIconClassName="wj-car-pickup"
                    />
                </div>
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