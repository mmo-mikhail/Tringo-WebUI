import * as React from 'react';
import './marker.scss';
import TransitionsModal from './markerSearchDialogue';

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
            <TransitionsModal
                props={{
                    title: this.props.title,
                    price: this.props.price
                }}
            />
        );
    }
}
