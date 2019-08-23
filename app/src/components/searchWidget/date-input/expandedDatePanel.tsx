import * as React from 'react';
import './styles/dateInput.scss';
import '../../common.scss';
import Dateunknown from './dateunknown';
import DatePicker from './datepicker';

export enum datePanelTypes {
    SPECIFIC_DATES = 'SPECIFIC_DATES',
    UNKNOWN_DATES = 'UNKNOWN_DATES'
}

class ExpandedDatePanel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.state = {
            datePanelType: datePanelTypes.UNKNOWN_DATES // selected by default
        };
        var today = new Date();
        this.state = {
            from: new Date(
                today.getFullYear(),
                today.getMonth() + 2,
                15,
                11,
                30,
                0,
                0
            ),
            to: new Date(
                today.getFullYear(),
                today.getMonth() + 2,
                20,
                16,
                30,
                0,
                0
            )
        };
        this.state = {
            from: undefined,
            to: undefined,
            datePanelType: datePanelTypes.UNKNOWN_DATES
        };
    }

    handleDateChange(newDateRange: any) {
        this.setState({ from: newDateRange.from, to: newDateRange.to });
    }
    selectPanel(panelType: datePanelTypes) {
        this.setState({
            datePanelType: panelType
        });
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
                            onDayChanged={this.handleDateChange}
                        />
                    </div>
                )}
                {this.state.datePanelType === datePanelTypes.UNKNOWN_DATES && (
                    <div className="flexible-dates-main-area">
                        <Dateunknown />
                    </div>
                )}
            </div>
        );
    }
}

export default ExpandedDatePanel;
