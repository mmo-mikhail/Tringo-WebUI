import * as React from 'react';
import { Component } from 'react';
import './priceTagMarker.scss';
import { findDOMNode } from 'react-dom';

declare global {
    interface Window {
        modal: () => void;
    }
}

export interface GoogleMapRequiredProps {
    key: number;
    lat: number;
    lng: number;
}

interface MarkerProps extends GoogleMapRequiredProps {
    price: number;
    fromCode: string;
    fromLabel: string;
    destination: string;
    destinationCode: string;
    priority: number;
    dateOut: Date;
    dateBack: Date;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
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

export class PriceTagMarker extends Component<MarkerProps, flightSearchParameters> {
    constructor(props: MarkerProps, private param: flightSearchParameters) {
        super(props);
    }

    addListener(): void {
        this.param = {
            from: this.props.fromCode,
            fromCity: this.props.fromLabel,
            to: this.props.destinationCode,
            toCity: this.props.destination,
            tripType: 'Return',
            dateOut: this.formatDate(this.props.dateOut),
            dateBack: this.formatDate(this.props.dateBack)
        };
        let tag = findDOMNode(this) as Node;
        tag.removeEventListener('click', () => {});
        tag.addEventListener('click', () => window.populateFlight(this.param));
    }

    componentDidMount(): void {
        this.addListener();
    }

    componentDidUpdate(): void {
        this.addListener();
    }

    render = () => (
        <span onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
            <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                <div className="city-text">{this.props.destination}</div>
                <div className="price-text">From ${Number(this.props.price.toFixed(1)).toLocaleString()}+</div>
            </a>
        </span>
    );

    private formatDate(d: Date): string {
        d = new Date(d); // actually needed
        // month + 2 to send month correctly to WebJet's modal popup
        const date = d.getFullYear() + `0${d.getMonth() + 2}`.slice(-2) + `0${d.getDate()}`.slice(-2);
        return date;
    }
}
