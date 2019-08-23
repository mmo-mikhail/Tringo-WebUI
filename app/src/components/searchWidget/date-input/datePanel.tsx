import * as React from 'react';
import './styles/dateInput.scss';
import { ExpandedDatePanel, StateChangedProps } from './expandedDatePanel';
import {
    DatesInput,
    Duration,
    UncertainDates
} from '../../../models/request/dateInput';
import { monthNames } from './dateunknown';

interface DatePanelState {
    isHidden: boolean;
    currentModel: DatesInput;
}

class DatePanel extends React.Component<StateChangedProps, DatePanelState> {
    private datePanelWrapper: React.RefObject<HTMLInputElement> | undefined;

    bindHandleOutsideClick(event: any) {}

    constructor(props: StateChangedProps) {
        super(props);
        this.state = {
            isHidden: true,
            currentModel: props.initialModel
        };
        this.onChange = this.onChange.bind(this);

        this.datePanelWrapper = React.createRef();
        this.bindHandleOutsideClick = this.handleOutsideClick.bind(this);
    }

    onChange(dateModel: DatesInput) {
        this.setState({
            currentModel: dateModel
        });
        this.props.onChange(dateModel);
    }

    render() {
        return (
            <div>
                <div className="date-panel-wrapper" ref={this.datePanelWrapper}>
                    <div
                        className="date-panel-collapsed"
                        onClick={this.toggleHidden.bind(this)}
                    >
                        {this.state.currentModel &&
                            this.state.currentModel.uncertainDates && (
                                <div>
                                    {this.getUncertainDatesText(
                                        this.state.currentModel.uncertainDates
                                    )}
                                </div>
                            )}
                        {this.state.currentModel &&
                            this.state.currentModel.dateFrom && (
                                <div>
                                    {this.getSpecificDatesText(
                                        this.state.currentModel
                                    )}
                                </div>
                            )}
                    </div>
                    {!this.state.isHidden && (
                        <ExpandedDatePanel
                            onChange={this.onChange}
                            initialModel={this.state.currentModel}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Helpers:

    getUncertainDatesText(uncertainDates: UncertainDates) {
        let durationText = '';
        switch (uncertainDates.duration) {
            case Duration.Weekend:
                durationText = 'Weekend';
                break;
            case Duration.Week:
                durationText = 'Week';
                break;
            case Duration.TwoWeek:
                durationText = 'Two Weeks';
                break;
        }
        const monthName =
            uncertainDates.monthIdx === -1
                ? 'any month'
                : monthNames[uncertainDates.monthIdx];
        return (
            <span>
                {durationText} in {monthName}
            </span>
        );
    }

    getSpecificDatesText(datesModel: DatesInput) {
        if (!datesModel.dateFrom || !datesModel.dateUntil) return;

        return (
            <span>
                from {datesModel.dateFrom.toDateString()} to{' '}
                {datesModel.dateUntil.toDateString()}
            </span>
        );
    }

    // Handle expand/collapse

    componentWillMount() {
        document.addEventListener('click', this.bindHandleOutsideClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener(
            'click',
            this.bindHandleOutsideClick,
            false
        );
    }

    toggleHidden(event: React.MouseEvent<HTMLInputElement>) {
        event.preventDefault();
        this.setState({
            isHidden: !this.state.isHidden
        });
    }

    handleOutsideClick(event: React.ChangeEvent<HTMLInputElement>) {
        if (
            !this.state.isHidden &&
            this.datePanelWrapper &&
            this.datePanelWrapper.current &&
            !this.datePanelWrapper.current.contains(event.target) &&
            // prevent closing on month select in date-picker:
            event.target.className.indexOf('rc-select') === -1 &&
            event.target.id.indexOf('react-select-') === -1
        ) {
            event.preventDefault();
            event.stopPropagation();

            this.setState({
                isHidden: true
            });
        }
    }
}

export default DatePanel;
