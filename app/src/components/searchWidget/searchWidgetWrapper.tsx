import * as React from 'react';
import { Component } from 'react';
import Autocomplete from './Autocomplete';
import BudgetRangeSlider from './budgetRangeSlider';
import './styles/widget.scss';
import { Budget, FlightDestinationRequest } from 'models/request/flightDestinationRequest';
import { DatesInput } from 'models/request/dateInput';
import { fetchLocationData } from 'services/dataService';
import MonthSelect from './date-input/monthselect';

interface SearchWidgetWrapperProps {
    onChange: (model: FlightDestinationRequest, selectedAirportLabel: string | null) => void;
    initialModel: FlightDestinationRequest;
}

interface SearchWidgetWrapperState {
    datesState: DatesInput;
    budgetMin: number;
    budgetMax: number;
    budgetStep: number;
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
            budgetStep: parseInt(process.env.REACT_APP_SLIDER_STEP || '')
        };
        this.onBudgetChanged = this.onBudgetChanged.bind(this);
        this.onDatesChanged = this.onDatesChanged.bind(this);
        this.onDepartureChanged = this.onDepartureChanged.bind(this);
    }

    onBudgetChanged(values: number[]) {
        if (values.length !== 2) {
            throw new Error('onRangeChanged has invalid agrument: must be array 2 values length');
        }

        this.props.initialModel.budget = new Budget(values[0], values[1]);
        this.props.onChange(this.props.initialModel, null);
    }

    onDatesChanged(datedModel: DatesInput) {
        this.setState({
            datesState: datedModel
        });
        this.props.initialModel.dates = datedModel;
        this.props.onChange(this.props.initialModel, null);
    }

    onDepartureChanged(airportId: string, airportLabel: string) {
        this.props.initialModel.departureAirportId = airportId;
        this.props.onChange(this.props.initialModel, airportLabel);
    }

    render() {
        const noOptionsMessage = 'No cities or airports were found. Please check your spelling.';
        return (
            <div className="widget-container">
                <div className={'widget-row'}>
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

                    <div className={'date-panel date-picker'}>
                        <MonthSelect props={{ onChange: this.onDatesChanged }} />
                    </div>
                </div>
                <div className="budget-panel">
                    <BudgetRangeSlider
                        min={this.state.budgetMin}
                        max={this.state.budgetMax}
                        step={this.state.budgetStep}
                        className={'range-slider max-only'}
                        onChange={this.onBudgetChanged}
                    />
                </div>
            </div>
        );
    }
}

export default SearchWidgetWrapper;
