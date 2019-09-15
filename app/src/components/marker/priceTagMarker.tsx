import * as React from 'react';
import { Component } from 'react';
import './marker.scss';
import { findDOMNode } from 'react-dom';

declare global {
    interface Window {
        modal: () => void;
    }
}

interface MarkerProps {
    key: number;
    lat: number;
    lng: number;
    price: number;
    destination: string;
    destinationCode: string;
    priority: number;
}

declare global {
    interface Window {
        populateFlight(param: flightSearchParameters): void;
    }
}

interface flightSearchParameters {
    from: string;
    fromCity: string;
    to: string;
    toCity: string;
    tripType: string;
    dateOut: string;
    dateBack: string;
}

export default class PriceTagMarker extends Component<MarkerProps, flightSearchParameters> {
    constructor(props: MarkerProps, private param: flightSearchParameters) {
        super(props);
    }

    addListener(): void {
        this.param = {
            from: 'SYD',
            fromCity: 'Sydney, Australia - Sydney Intl (SYD)',
            to: this.props.destinationCode,
            toCity: this.props.destination,
            tripType: 'Return',
            dateOut: '20191220',
            dateBack: '20191225'
        };
        let tag = findDOMNode(this) as Node;
        tag.addEventListener('click', () => window.populateFlight(this.param));
    }

    componentDidMount(): void {
        this.addListener();
    }

    componentDidUpdate(): void {
        this.addListener();
    }

    render = () => (
        <span>
            <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                <div className="city-text">{this.props.destination}</div>
                <div className="price-text">${Number(this.props.price.toFixed(1)).toLocaleString()}</div>
            </a>
        </span>
    );
}
