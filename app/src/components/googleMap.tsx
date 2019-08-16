import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';


class SimpleMap extends Component {

    render() {
        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs' }}
                    defaultCenter={{lat: -23.7970703, lng: 132.3082171 }}
                    defaultZoom={4.72}
                    style={{ height: '100%', width: '100%' }}
                >
                </GoogleMapReact>
            </div>
        );
    }
}

export default SimpleMap;






// 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs'
