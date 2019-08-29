import * as React from 'react';
import './marker.scss';

interface MarkerProps {
    key: number;
    lat: number;
    lng: number;
    price: number;
    title: string;
    priority: number;
}

export default class PriceTagMarker extends React.Component<MarkerProps> {
    render() {
        return (
            <p className="price-marker">
                <span>{this.props.title}</span>
                <br />
                <span className="price-text">${this.props.price}</span>
            </p>
        );
    }
}
