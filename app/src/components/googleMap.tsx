import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import PriceTagMarker from './priceTagMarker'

export default class SimpleMap extends React.Component<any, any> {

    render() {
        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCYHeC_ETn53YOfjFKM7jSh6-diOCPTEGs' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    <PriceTagMarker
                        lat={-33.8688}
                        lng={151.2093}
                        price={200}
                        title={"Sydney"}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}