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
    price: number;
}

interface MarkerProps extends GoogleMapRequiredProps {
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

    PriceMarker(destination: DestinationProp, onHover: () => void, moreText?: string, key?: number) {
        return (
            <span
                role={'button'}
                tabIndex={-1}
                key={key}
                onMouseEnter={onHover}
                onMouseLeave={this.onMouseLeave}
                onClick={this.showModal}
            >
                <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                    <div className="city-text">{destination.destination}</div>
                    <div className="price-text">${Number(destination.price.toFixed(1)).toLocaleString()}</div>
                    {moreText && <div className="more-text">{moreText}</div>}
                </a>
            </span>
        );
    }

    render = () => {
        const destinations = this.props.destinations;
        if (!destinations || destinations.length === 0) {
            return '';
        }
        const destination = destinations[0];
        if (destinations.length === 1) {
            // Simple price tag marker
            return <div>{this.PriceMarker(destination, () => this.onHover(0))}</div>;
        }
        // Expanding price tag marker
        return (
            <div className="expandale-marker-container">
                <div>
                    {this.PriceMarker(
                        destination,
                        () => this.onHoverExpandable(),
                        (destinations.length - 1).toString() + 'more'
                    )}
                </div>
                {this.state.expanded && (
                    <div className="expandale-markers">
                        {destinations
                            .filter((_, idx: number) => idx !== 0)
                            .map((destination: DestinationProp, idx: number) => (
                                <div>
                                    {this.PriceMarker(destination, () => this.onHover(idx + 1), undefined, idx + 1)}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        );
    };

    private formatDate(d: Date): string {
        d = new Date(d); // actually needed
        // month + 2 to send month correctly to WebJet's modal popup
        const date = d.getFullYear() + `0${d.getMonth() + 2}`.slice(-2) + `0${d.getDate()}`.slice(-2);
        return date;
    }
}
