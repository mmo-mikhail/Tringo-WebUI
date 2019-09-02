import * as React from 'react';
import './marker.scss';

interface MarkerProps {
    key: number;
    lat: number;
    lng: number;
    price: number;
    title: string;
    priority: number;
    redirectUrl: string;
}

export default class PriceTagMarker extends React.Component<MarkerProps> {
    render() {
        return (
            <a href={this.props.redirectUrl} className="price-marker" title={this.props.title}>
                <div className="city-text">{this.props.title}</div>
                <div className="price-text">${Number(this.props.price.toFixed(1)).toLocaleString()}</div>
            </a>
        );
    }
}
