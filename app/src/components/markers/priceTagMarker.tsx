import * as React from 'react';
import { Component } from 'react';
import './priceTagMarker.scss';

declare global {
    interface Window {
        modal: () => void;
    }
}

export interface GoogleMapRequiredProps {
    lat: number;
    lng: number;
}

export interface DestinationProp {
    destination: string;
    destinationCode: string;
    priority: number;
    dateOut: Date;
    dateBack: Date;
}

interface MarkerProps extends GoogleMapRequiredProps {
    price: number;
    fromCode: string;
    fromLabel: string;
    destinations: DestinationProp[];
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

interface MarkerState {
    expanded: boolean;
    hoveredDestination: DestinationProp | null;
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

export class PriceTagMarker extends Component<MarkerProps, MarkerState> {
    constructor(props: MarkerProps) {
        super(props);

        this.state = {
            expanded: false,
            hoveredDestination: null
        };

        this.showModal = this.showModal.bind(this);
        this.onHoverExpandable = this.onHoverExpandable.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    showModal() {
        if (!this.state.hoveredDestination) {
            return;
        }

        const param: flightSearchParameters = {
            from: this.props.fromCode,
            fromCity: this.props.fromLabel,
            to: this.state.hoveredDestination.destinationCode,
            toCity: this.state.hoveredDestination.destination,
            tripType: 'Return',
            dateOut: this.formatDate(this.state.hoveredDestination.dateOut),
            dateBack: this.formatDate(this.state.hoveredDestination.dateBack)
        };
        window.populateFlight(param);
    }

    onHover(selectedIdx: number) {
        this.setState({
            hoveredDestination: this.props.destinations[selectedIdx]
        });
        this.props.onMouseEnter();
    }

    onHoverExpandable() {
        this.setState({
            expanded: true,
            hoveredDestination: this.props.destinations[0]
        });
        this.props.onMouseEnter();
    }

    onMouseLeave() {
        this.setState({
            hoveredDestination: null
        });
        setTimeout(() => {
            if (!this.state.hoveredDestination) {
                this.setState({
                    expanded: false
                });
            }
        }, 200);
        this.props.onMouseLeave();
    }

    render = () => {
        const destinations = this.props.destinations;
        if (!destinations || destinations.length === 0) {
            return '';
        }
        const destination = destinations[0];
        if (destinations.length === 1) {
            // Simple price tag marker
            return (
                <span
                    role={'button'}
                    onMouseEnter={() => this.onHover(0)}
                    onMouseLeave={this.onMouseLeave}
                    onClick={this.showModal}
                    onKeyDown={this.showModal}
                    tabIndex={-1}
                >
                    <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                        <div className="city-text">{destination.destination}</div>
                        <div className="price-text">${Number(this.props.price.toFixed(1)).toLocaleString()}</div>
                    </a>
                </span>
            );
        } else {
            // Expanding price tag marker
            return (
                <div className="expandale-marker-container">
                    <span
                        role={'button'}
                        onMouseEnter={() => this.onHoverExpandable()}
                        onMouseLeave={this.onMouseLeave}
                        onClick={this.showModal}
                        onKeyDown={this.showModal}
                        tabIndex={-1}
                    >
                        <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                            <div className="city-text">{destination.destination}</div>
                            <div className="price-text">${Number(this.props.price.toFixed(1)).toLocaleString()}</div>
                            <div className="more-text">{destinations.length - 1} more</div>
                        </a>
                    </span>
                    {this.state.expanded && (
                        <div className="expandale-markers">
                            {destinations
                                .filter((_, idx: number) => idx !== 0)
                                .map((destination: DestinationProp, idx: number) => (
                                    <span
                                        role={'button'}
                                        key={idx}
                                        onMouseEnter={() => this.onHover(idx)}
                                        onMouseLeave={this.onMouseLeave}
                                        onClick={this.showModal}
                                        onKeyDown={this.showModal}
                                        tabIndex={-1}
                                    >
                                        <a
                                            role="button"
                                            className="price-marker"
                                            href="#searchWidgetModal"
                                            data-toggle="modal"
                                        >
                                            <div className="city-text">{destination.destination}</div>
                                            <div className="price-text">
                                                ${Number(this.props.price.toFixed(1)).toLocaleString()}
                                            </div>
                                        </a>
                                    </span>
                                ))}
                        </div>
                    )}
                </div>
            );
        }
    };

    private formatDate(d: Date): string {
        d = new Date(d); // actually needed
        // month + 2 to send month correctly to WebJet's modal popup
        const date = d.getFullYear() + `0${d.getMonth() + 2}`.slice(-2) + `0${d.getDate()}`.slice(-2);
        return date;
    }
}
