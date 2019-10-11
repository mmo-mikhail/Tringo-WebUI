import * as React from 'react';
import { Component } from 'react';
import './styles/priceTagMarker.scss';

declare global {
    interface Window {
        populateFlight(param: flightSearchParameters): void;
    }
}

export interface flightSearchParameters {
    from: string;
    fromCity: string;
    to: string;
    toCity: string;
    tripType: string;
    dateOut: string;
    dateBack: string;
}

export interface GoogleMapRequiredProps {
    key: number;
    lat: number;
    lng: number;
}

export interface DestinationProp {
    destination: string;
    airportName?: string;
    destinationCode: string;
    destinationCountryName: string;
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
    markerDestination: flightSearchParameters | null;
    expanded: boolean;
}

export class PriceTagMarker extends Component<MarkerProps, MarkerState> {
    constructor(props: MarkerProps) {
        super(props);

        let param: flightSearchParameters | null = null;

        if (this.props.destinations && this.props.destinations.length > 0) {
            const destination = this.props.destinations[0];
            param = this.buildDestinationProp(destination);
        }

        this.state = {
            expanded: false,
            markerDestination: param
        };

        this.delayedLeave = this.delayedLeave.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.buildDestinationProp = this.buildDestinationProp.bind(this);
    }

    buildDestinationProp = (destination: DestinationProp): flightSearchParameters => ({
        from: this.props.fromCode,
        fromCity: this.props.fromLabel,
        to: destination.destinationCode,
        // eslint-disable-next-line max-len
        toCity: `${destination.destination}, ${destination.destinationCountryName} - ${destination.airportName} (${destination.destinationCode})`,
        tripType: 'Return',
        dateOut: PriceTagMarker.formatDate(destination.dateOut),
        dateBack: PriceTagMarker.formatDate(destination.dateBack)
    });

    componentDidMount(): void {
        const destination = this.props.destinations[0];
        let param: flightSearchParameters = this.buildDestinationProp(destination);
        this.setState({
            markerDestination: param
        });
    }

    componentDidUpdate(prevProps: Readonly<MarkerProps>): void {
        const destination = this.props.destinations[0];
        if (this.props.fromLabel !== prevProps.fromLabel || destination !== prevProps.destinations[0]) {
            let param: flightSearchParameters = this.buildDestinationProp(destination);
            this.setState({
                markerDestination: param
            });
        }
    }

    zoomIn() {
        if (this.props.customOnClick && this.props.forbidExpand) {
            this.props.customOnClick();
            return;
        }
    }

    delayedLeave() {
        setTimeout(() => {
            this.props.onMouseLeave();
        }, 50);
    }

    PriceMarker(destination: DestinationProp, moreText?: string, key?: number) {
        return (
            <span role={'button'} tabIndex={-1} key={key} onClick={this.zoomIn} onKeyDown={this.zoomIn}>
                <a
                    style={{ zIndex: destination.priority }}
                    role="button"
                    className={`price-marker ${destination.price === -1 ? 'no-price' : ''}`}
                    href={this.props.customOnClick && this.props.forbidExpand ? '_blank' : '#searchWidgetModal'}
                    data-toggle="modal"
                    onClick={() => window.populateFlight(this.state.markerDestination as flightSearchParameters)}
                >
                    <div className="city-text">{destination.destination}</div>
                    {destination.price === -1 && ( // if no price available:
                        <div>
                            <div className="price-text-wrapper">
                                <div className="price-text no-price">
                                    <span>No Price Found</span>
                                </div>
                            </div>
                            <div className="more-text">Click to search</div>
                        </div>
                    )}
                    {destination.price !== -1 && ( // else (price present):
                        <div>
                            {this.props.showAirportName && destination.airportName && (
                                <div className="airprot-name-text">{destination.airportName}</div>
                            )}
                            <div className="price-text-wrapper">
                                <div className="price-text">
                                    <span className="from-text">from </span>$
                                    {Number(destination.price.toFixed(1)).toLocaleString()}*
                                </div>
                            </div>
                            {moreText && <div className="more-text">{moreText}</div>}
                        </div>
                    )}
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
                    {this.PriceMarker(destination)}
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
                <div>{this.PriceMarker(destination, `${(destinations.length - 1).toString()} more`)}</div>
                {this.state.expanded && (
                    <div className="expandable-markers">
                        {destinations
                            .filter((_, idx: number) => idx !== 0)
                            .map((destination: DestinationProp, idx: number) => (
                                <div>{this.PriceMarker(destination, undefined, idx + 1)}</div>
                            ))}
                    </div>
                )}
            </div>
        );
    };

    private static formatDate(d: Date): string {
        d = new Date(d); // actually needed
        // month + 1 to send month correctly to WebJet's modal popup
        const date = d.getFullYear() + `0${d.getMonth() + 1}`.slice(-2) + `0${d.getDate()}`.slice(-2);
        return date;
    }
}
