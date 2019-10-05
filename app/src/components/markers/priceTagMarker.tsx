import * as React from 'react';
import { Component } from 'react';
import './styles/priceTagMarker.scss';

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
    customOnClick?: () => void;
    forbidExpand?: boolean;
    showAirportName?: boolean;
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
        this.onSpecificDestinationLeave = this.onSpecificDestinationLeave.bind(this);
        this.delayedLeave = this.delayedLeave.bind(this);
    }

    showModal() {
        if (this.props.customOnClick && this.props.forbidExpand) {
            this.props.customOnClick();
            return;
        }

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
    }

    onHoverExpandable() {
        if (!this.props.forbidExpand) {
            this.setState({
                expanded: true,
                hoveredDestination: this.props.destinations[0]
            });
        }
    }

    onSpecificDestinationLeave() {
        this.setState({
            hoveredDestination: null
        });
        setTimeout(() => {
            if (!this.state.hoveredDestination) {
                this.setState({
                    expanded: false
                });
            } // else it was moved to other destination from 'more' option
        }, 50); // add tiny delay to let it detect mouse move over other destinations from sub-list for multiple-destinations case
    }

    delayedLeave() {
        setTimeout(() => {
            this.props.onMouseLeave();
        }, 50);
    }

    PriceMarker(destination: DestinationProp, onHover: () => void, moreText?: string, key?: number) {
        return (
            <span
                role={'button'}
                tabIndex={-1}
                key={key}
                onMouseEnter={onHover}
                onMouseLeave={this.onSpecificDestinationLeave}
                onClick={this.showModal}
                onKeyDown={this.showModal}
            >
                <a
                    role="button"
                    className="price-marker"
                    href={this.props.customOnClick && this.props.forbidExpand ? '_blank' : '#searchWidgetModal'}
                    data-toggle="modal"
                >
                    <div className="city-text">{destination.destination}</div>
                    <div className="price-text-wrapper">
                        <div className="price-text">
                            <span className="from-text">from </span>$
                            {Number(destination.price.toFixed(1)).toLocaleString()}*
                        </div>
                    </div>
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
            return (
                <div onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.delayedLeave}>
                    {this.PriceMarker(destination, () => this.onHover(0))}
                </div>
            );
        }
        // Expanding price tag marker
        return (
            <div
                className="expandable-marker-container"
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.delayedLeave}
            >
                <div>
                    {this.PriceMarker(
                        destination,
                        () => this.onHoverExpandable(),
                        `${(destinations.length - 1).toString()} more`
                    )}
                </div>
                {this.state.expanded && (
                    <div className="expandable-markers">
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
        // month + 1 to send month correctly to WebJet's modal popup
        const date = d.getFullYear() + `0${d.getMonth() + 1}`.slice(-2) + `0${d.getDate()}`.slice(-2);
        return date;
    }
}
