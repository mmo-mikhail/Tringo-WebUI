import * as React from 'react';
import * as PropTypes from "prop-types";

import Autocomplete from "./Autocomplete";
import RangeSlider from "./slider"
import DatePanel from "./date-input/datePanel";

import { FlightDestinationRequest, Budget } from "./../../models/request/flightDestinationRequest";

interface StateChangedProps {
    onChange: (model: FlightDestinationRequest) => void
    initialModel: FlightDestinationRequest
}

class SearchWidgetWrapper extends React.Component<StateChangedProps, any> {
    constructor(props: StateChangedProps) {
        super(props);

        this.onBudgetChanged = this.onBudgetChanged.bind(this);
        this.state = {
            budgetMin: this.props.initialModel.budget.from,
            budgetMax: this.props.initialModel.budget.to,
            budgetStep: 10,
            budgetValues: [this.props.initialModel.budget.from, this.props.initialModel.budget.to],
        };
    }

    onBudgetChanged(values: number[]) {
        if (values.length !== 2) {
            throw new Error("onRangeChanged has invalid agrument: must be array 2 values length");
        }
        this.setState({ budgetValues: values});

        this.props.initialModel.budget = new Budget(values[0], values[1]);
        this.props.onChange(this.props.initialModel);
    }

    render() {
        const fetchLocationData = (inputValue: any, callback: any) => {
            // Mock api call
            setTimeout(() => {
                callback([
                    {
                        value: 1,
                        label: "Melbourne International Airport, Australia",
                        optionLabel: "Melbourne International Airport (MEL)",
                        optionSubLabel: "Melbourne, Australia"
                    },
                    {
                        value: 2,
                        label: "Sydney International Airport, Australia",
                        optionLabel: "Sydney International Airport (SYD)",
                        optionSubLabel: "Sydney, Australia"
                    },
                    {
                        value: 3,
                        label: "Perth International Airport, Australia",
                        optionLabel: "Perth International Airport (PER)",
                        optionSubLabel: "Perth, Australia"
                    }
                ]);
            }, 500);
        };

        const noOptionsMessage =
            "No cities or airports were found. Please check your spelling.";
        return (
            <div className="widgetContainer">
                <div >
                    <Autocomplete
                        id="pickup-location"
                        className="pickup-location"
                        placeholder="Sydney International Airport (SYD)"
                        minValueLength={3}
                        noOptionsMessage={noOptionsMessage}
                        fetchOptions={fetchLocationData}
                        inputIconClassName="wj-car-pickup"
                    />

                    <RangeSlider
                        min={this.state.budgetMin}
                        max={this.state.budgetMax}
                        values={this.state.budgetValues}
                        step={this.state.budgetStep}
                        className={this.state.className}
                        onChange={this.onBudgetChanged}
                    />

                    <DatePanel />
                </div>
            </div>
        );
    }
}

export default SearchWidgetWrapper