import * as React from 'react';

import Autocomplete from './Autocomplete';
import BudgetRangeSlider from './budgetRangeSlider';
import DatePanel from './date-input/datePanel';

import { FlightDestinationRequest, Budget } from 'models/request/flightDestinationRequest';
import { DatesInput } from 'models/request/dateInput';

interface SearchWidgetWrapperProps {
    onChange: (model: FlightDestinationRequest) => void;
    initialModel: FlightDestinationRequest;
}

interface SearchWidgetWrapperState {
    datesState: DatesInput;
    budgetMin: number;
    budgetMax: number;
    budgetStep: number;
    budgetValues: number[];
}

class SearchWidgetWrapper extends React.Component<SearchWidgetWrapperProps, SearchWidgetWrapperState> {
    constructor(props: SearchWidgetWrapperProps) {
        super(props);

        this.state = {
            datesState: this.props.initialModel.dates,
            budgetMin: this.props.initialModel.budget.min,
            budgetMax: this.props.initialModel.budget.max,
            budgetStep: 10,
            budgetValues: [this.props.initialModel.budget.min, this.props.initialModel.budget.max]
        };
        this.onBudgetChanged = this.onBudgetChanged.bind(this);
        this.onDatesChanged = this.onDatesChanged.bind(this);

        this.onDepartureChanged = this.onDepartureChanged.bind(this);
    }

    onBudgetChanged(values: number[]) {
        if (values.length !== 2) {
            throw new Error('onRangeChanged has invalid agrument: must be array 2 values length');
        }
        this.setState({ budgetValues: values });

        this.props.initialModel.budget = new Budget(values[0], values[1]);
        this.props.onChange(this.props.initialModel);
    }

    onDatesChanged(datedModel: DatesInput) {
        this.setState({
            datesState: datedModel
        });

        this.props.initialModel.dates = datedModel;
        this.props.onChange(this.props.initialModel);
    }

    onDepartureChanged(airportId: string) {
        this.props.initialModel.departureAirportId = airportId;
        this.props.onChange(this.props.initialModel);
    }

    render() {
        const fetchLocationData = (inputValue: any, callback: any) => {
            // Mock api call
            setTimeout(() => {
                callback([
                    {
                        value: 'MEL',
                        label: 'Melbourne International Airport, Australia',
                        optionLabel: 'Melbourne International Airport (MEL)',
                        optionSubLabel: 'Melbourne, Australia'
                    },
                    {
                        value: 'SYD',
                        label: 'Sydney International Airport, Australia',
                        optionLabel: 'Sydney International Airport (SYD)',
                        optionSubLabel: 'Sydney, Australia'
                    },
                    {
                        value: 'PER',
                        label: 'Perth International Airport, Australia',
                        optionLabel: 'Perth International Airport (PER)',
                        optionSubLabel: 'Perth, Australia'
                    }
                ]);
            }, 500);
        };

        const noOptionsMessage = 'No cities or airports were found. Please check your spelling.';
        return (
            <div className="widgetContainer">
                <div>
                    <Autocomplete
                        id="pickup-location"
                        className="pickup-location"
                        minValueLength={3}
                        noOptionsMessage={noOptionsMessage}
                        placeholder="City or Airport"
                        fetchOptions={fetchLocationData}
                        inputIconClassName="wj-car-pickup"
                        onChange={this.onDepartureChanged}
                    />

                    <BudgetRangeSlider
                        min={this.state.budgetMin}
                        max={this.state.budgetMax}
                        values={this.state.budgetValues}
                        step={this.state.budgetStep}
                        isRangeSlider={true}
                        isBasicSlider={false}
                        className={'sliderClassName'}
                        onChange={this.onBudgetChanged}
                    />

                    <DatePanel onChange={this.onDatesChanged} initialModel={this.state.datesState} />
                </div>
            </div>
        );
    }
}

export default SearchWidgetWrapper;
