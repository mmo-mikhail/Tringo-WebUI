import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import PriceTagMarker from './priceTagMarker'

export default class SimpleMap extends React.Component<any, any> {

    render() {
        //const { destinations } = this.props;
        const destinations = [{
            lat: -33.8688,
            lng: 151.2093,
            price: 1200,
            cityName: 'Sydney'
        }, {
            lat: -34.9285,
            lng: 138.6007,
            price: 100,
            cityName: 'Adelaide'
        }];

        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    {destinations.map((record: { lat: number; lng: number; price: number; cityName: string; }) => (
                        <PriceTagMarker
                            lat={record.lat}
                            lng={record.lng}
                            price={record.price}
                            title={record.cityName}
                        />
                    ))}
                    
                </GoogleMapReact>
            </div>
        );
    }
}