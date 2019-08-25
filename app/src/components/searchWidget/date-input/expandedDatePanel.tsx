import * as React from 'react';
import './styles/dateInput.scss';
import '../../common.scss';
import { Dateunknown } from './dateunknown';
import DatePicker from './datepicker';
import { DatesInput, UncertainDates } from '../../../models/request/dateInput';
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
        this.onUnknownDatesChange=this.onUnknownDatesChange.bind(this);
    }

    onSpecificDateChange(newDateRange: RangeModifier) {
        this.setState({
            from: newDateRange.from,
            to: newDateRange.to
        });
        if (newDateRange.from && newDateRange.to) {
            this.props.initialModel.dateFrom = newDateRange.from;
            this.props.initialModel.dateUntil = newDateRange.to;
            this.props.onChange(this.props.initialModel);
        }
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
            this.props.initialModel.dateFrom === null &&
            this.props.initialModel.dateUntil === null &&
            this.props.initialModel.uncertainDates === null
        )
            return; // the selection was changed but nothign is selected yet
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
                        <DatePicker
                            from={from}
                            to={to}
                            maxAvailableMonths={11}
                            onDayChanged={this.onSpecificDateChange}
                        />
                    </div>
                )}
                {this.state.datePanelType === datePanelTypes.UNKNOWN_DATES && (
                    <div className="flexible-dates-main-area">
                        <Dateunknown
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
