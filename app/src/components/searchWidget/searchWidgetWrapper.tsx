import * as React from 'react';
import { Component } from 'react';
import Autocomplete from './Autocomplete';
import BudgetRangeSlider from './budgetRangeSlider';
import './styles/widget.scss';
import classnames from 'classnames';
import { Budget, FlightDestinationRequest } from 'models/request/flightDestinationRequest';
import { DatesInput } from 'models/request/dateInput';
import { fetchLocationData } from 'services/dataService';
import MonthSelect, { DateNumberOptionHelper } from './date-input/monthselect';
import googleMap from '../googleMap';

interface SearchWidgetWrapperProps {
    onChange: (model: FlightDestinationRequest, selectedAirportLabel: string | null) => void;
    updateDepartureAirport: (departureAirportCode: string) => void;
    initialModel: FlightDestinationRequest;
}

interface SearchWidgetWrapperState {
    datesState: DatesInput;
    budgetMin: number;
    budgetMax: number;
    budgetStep: number;
    budgetLabel: string;
    airportLabel: string;
    departureCity: string;
    dateLabel: string;
    mobilePanelOpenState: boolean;
}

class SearchWidgetWrapper extends Component<SearchWidgetWrapperProps, SearchWidgetWrapperState> {
    constructor(props: SearchWidgetWrapperProps) {
        super(props);
        
        this.state = {
            datesState: this.props.initialModel.dates,
            budgetMin: this.props.initialModel.budget ? this.props.initialModel.budget.min : 0,
            budgetMax: this.props.initialModel.budget
                ? this.props.initialModel.budget.max
                : parseInt(process.env.REACT_APP_MAX_BUDGET || ''),
            budgetStep: parseInt(process.env.REACT_APP_SLIDER_STEP || ''),
            budgetLabel: BudgetRangeSlider.MAX_VALUE,
            airportLabel: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
            departureCity: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
            dateLabel: DateNumberOptionHelper(-1)[1],
            mobilePanelOpenState: false
        };
        this.onBudgetChanged = this.onBudgetChanged.bind(this);
        this.onDatesChanged = this.onDatesChanged.bind(this);
        this.onDepartureChanged = this.onDepartureChanged.bind(this);
        this.mobileFilterViewToggle = this.mobileFilterViewToggle.bind(this);
    }
    
    mobileFilterViewToggle() {
        let toggle = this.state.mobilePanelOpenState;
        this.setState({
            mobilePanelOpenState: !toggle
        });
    }
    
    onBudgetChanged(values: number[], label: string) {
        if (values.length !== 2) {
            throw new Error('onRangeChanged has invalid agrument: must be array 2 values length');
        }
        this.setState({ budgetMax: values[1], budgetLabel: label });
        this.props.initialModel.budget = new Budget(values[0], values[1]);
        this.props.onChange(this.props.initialModel, null);
    }
    
    onDatesChanged(datedModel: DatesInput, label: string) {
        this.setState({
            datesState: datedModel,
            dateLabel: label
        });
        this.props.initialModel.dates = datedModel;
        this.props.onChange(this.props.initialModel, null);
    }
    
    onDepartureChanged(airportId: string, airportLabel: string, city: string) {
        this.props.initialModel.departureAirportId = airportId;
        this.setState({ airportLabel: airportLabel, departureCity: city });
        this.props.updateDepartureAirport(airportId);
        this.props.onChange(this.props.initialModel, airportLabel);
    }
    
    render() {
        const noOptionsMessage = 'No cities or airports were found. Australian airports only.';
        const isMobile = googleMap.IsMobile();
        
        return (
            <div className="overlaid-content-wrapper">
                <div className="widget-container">
                    <div
                        role={'button'}
                        tabIndex={0}
                        onKeyDown={this.mobileFilterViewToggle}
                        className="widget-row widget-summary"
                        onClick={this.mobileFilterViewToggle}
                    >
                        <div className="search-cell">
                            <div className={'city'}>{this.state.departureCity}</div>
                            <div className={'date'}>{this.state.dateLabel}</div>
                            <div className={'price'}>{this.state.budgetLabel}</div>
                        </div>
                        <span
                            className={classnames(
                                'wj-icon',
                                this.state.mobilePanelOpenState ? 'wj-caret-up' : 'wj-caret-down'
                            )}
                        />
                    </div>
                    <div
                        className={classnames(
                            'widget-row',
                            'widget-controls',
                            isMobile && { hidden: !this.state.mobilePanelOpenState }
                        )}
                    >
                        <div className="search-cell">
                            <span className="filter-title">Departing from</span>
                            <Autocomplete
                                props={{
                                    id: 'departure-panel',
                                    name: 'departure-panel',
                                    placeholder: 'Departure City or Airport',
                                    disabled: false,
                                    minValueLength: 3,
                                    noOptionsMessage: noOptionsMessage,
                                    fetchOptions: fetchLocationData,
                                    onChange: this.onDepartureChanged,
                                    className: 'departure-panel'
                                }}
                            />
                        </div>
                        <div className="date-panel date-picker">
                            <span className="filter-title">Month</span>
                            <MonthSelect props={{ onChange: this.onDatesChanged }}/>
                        </div>
                        <div className="budget-panel">
                            <span className="filter-title">Price</span>
                            <BudgetRangeSlider
                                min={this.state.budgetMin}
                                max={this.state.budgetMax}
                                step={this.state.budgetStep}
                                className={'range-slider max-only'}
                                onChange={this.onBudgetChanged}
                            />
                        </div>
                    </div>
                </div>
                <div
                    tabIndex={-1}
                    className={classnames('background', { hidden: !this.state.mobilePanelOpenState })}
                    onClick={this.mobileFilterViewToggle}
                    onKeyDown={this.mobileFilterViewToggle}
                    role={'button'}
                />
            </div>
        );
    }
}

export default SearchWidgetWrapper;
