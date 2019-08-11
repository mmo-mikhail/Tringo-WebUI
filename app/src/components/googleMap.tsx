import * as React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class MapContainer extends React.Component<any, any> {

    displayMarker = () => {
        return <Marker  position={{
            lat: 47.444,
            lng: -122.176
        }} />
    }

    render() {
        return (
            <div>
           
                <Map
                    google={this.props.google}
                    zoom={8}
                    initialCenter={{ lat: 47.444, lng: -122.176 }}
                >
                    {this.displayMarker()}
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs'
})(MapContainer);