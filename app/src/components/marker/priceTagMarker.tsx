import * as React from 'react';
import './marker.scss';

export default class PriceTagMarker extends React.Component<any, any> {
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
