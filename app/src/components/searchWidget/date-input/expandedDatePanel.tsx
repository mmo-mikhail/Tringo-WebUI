import * as React from 'react';
import './styles/dateInput.scss';
import '../../common.scss';
import { DateUnknown } from './dateUnknown';
import TringoDatePicker from './tringoDatePicker';
import {
    DatesInput,
    UncertainDates,
    Duration
} from '../../../models/request/dateInput';
import { RangeModifier } from 'react-day-picker';

export enum datePanelTypes {
    SPECIFIC_DATES = 'SPECIFIC_DATES',
    UNKNOWN_DATES = 'UNKNOWN_DATES'
}

export interface StateChangedProps {
    onChange: (datesModel: DatesInput) => void;
    initialModel: DatesInput;
}

export class ExpandedDatePanel extends React.Component<StateChangedProps, any> {
    constructor(props: StateChangedProps) {
        super(props);

        this.state = {
            from: this.props.initialModel.dateFrom,
            to: this.props.initialModel.dateUntil,
            datePanelType: this.props.initialModel.uncertainDates
                ? datePanelTypes.UNKNOWN_DATES
                : datePanelTypes.SPECIFIC_DATES, // selected by default
            unknownDates: this.props.initialModel.uncertainDates
        };
        this.saveSelectedPanel(this.state.datePanelType);
        this.onSpecificDateChange = this.onSpecificDateChange.bind(this);
        this.onUnknownDatesChange = this.onUnknownDatesChange.bind(this);
    }

    onSpecificDateChange(newDateRange: RangeModifier) {
        this.setState({
            from: newDateRange.from,
            to: newDateRange.to
        });

        this.props.initialModel.dateFrom = newDateRange.from;
        this.props.initialModel.dateUntil = newDateRange.to;
        this.props.onChange(this.props.initialModel); // will be checked for nulls and stoped later on
    }

    onUnknownDatesChange(unknownDates: UncertainDates) {
        this.setState({
            unknownDates: unknownDates
        });
        this.props.initialModel.uncertainDates = unknownDates;
        this.props.onChange(this.props.initialModel);
    }

    selectPanel(panelType: datePanelTypes) {
        if (this.state.datePanelType === panelType) return; // nothing has changed
        this.setState({
            datePanelType: panelType
        });
        this.saveSelectedPanel(panelType);

        if (
            panelType === datePanelTypes.UNKNOWN_DATES &&
            this.props.initialModel.uncertainDates === null
        ) {
            // Set Default month and duration here
            this.props.initialModel.uncertainDates = new UncertainDates(
                -1,
                Duration.Weekend
            );
            this.setState({
                unknownDates: this.props.initialModel.uncertainDates
            });
        }

        this.props.onChange(this.props.initialModel);
    }

    saveSelectedPanel(panelType: datePanelTypes) {
        if (panelType === datePanelTypes.UNKNOWN_DATES) {
            this.props.initialModel.dateFrom = null;
            this.props.initialModel.dateUntil = null;
        } else if (panelType === datePanelTypes.SPECIFIC_DATES) {
            this.props.initialModel.uncertainDates = null;
        }
    }

    render() {
        const { from, to } = this.state;
        return (
            <div className="date-panel-expanded">
                <div className="top-toogler">
                    <div
                        className="dates-selector middle-text"
                        onClick={() =>
                            this.selectPanel(datePanelTypes.SPECIFIC_DATES)
                        }
                    >
                        <div>Specific Dates</div>
                    </div>
                    <div
                        className="dates-selector middle-text"
                        onClick={() =>
                            this.selectPanel(datePanelTypes.UNKNOWN_DATES)
                        }
                    >
                        <div>Flexible Dates</div>
                    </div>
                </div>
                {this.state.datePanelType === datePanelTypes.SPECIFIC_DATES && (
                    <div className="specific-dates-main-area">
                        <TringoDatePicker
                            from={from}
                            to={to}
                            maxAvailableMonths={11}
                            numberOfMonths={2}
                            onDayChanged={this.onSpecificDateChange}
                        />
                    </div>
                )}
                {this.state.datePanelType === datePanelTypes.UNKNOWN_DATES && (
                    <div className="flexible-dates-main-area">
                        <DateUnknown
                            initialDates={this.state.unknownDates}
                            onChange={this.onUnknownDatesChange}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default ExpandedDatePanel;
