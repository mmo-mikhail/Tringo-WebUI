import * as React from 'react';
import './styles/dateInput.scss';
import { ExpandedDatePanel, StateChangedProps } from './expandedDatePanel';
import { DatesInput, Duration, UncertainDates } from 'models/request/dateInput';
import { monthNames } from './dateUnknown';

interface DatePanelState {
    isHidden: boolean;
    currentModel: DatesInput;
}

class DatePanel extends React.Component<StateChangedProps, DatePanelState> {
    private datePanelWrapper: React.RefObject<HTMLInputElement> | undefined;

    // @ts-ignore
    bindHandleOutsideClick(event: unknown) {}

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

        // when nothing selected OR only date From is selected
        if (dateModel.uncertainDates == null && dateModel.dateUntil == null) {
            return; // need to handle this case to keep state updated, but do not proceed further
        }

        this.props.onChange(dateModel);

        if (dateModel.uncertainDates == null && dateModel.dateUntil != null) {
            // specific dates werre selected, so close the window
            this.setState({
                isHidden: true
            });
        }
    }

    render() {
        return (
            <div className={'widget-row'}>
                <span className="wj-icon icon-label wj-calendar" />

                <div className="date-panel-wrapper" ref={this.datePanelWrapper}>
                    <div className="date-panel-collapsed" onClick={this.toggleHidden.bind(this)}>
                        {this.state.currentModel && this.state.currentModel.uncertainDates && (
                            <div>{this.getUncertainDatesText(this.state.currentModel.uncertainDates)}</div>
                        )}
                        {this.state.currentModel && this.state.currentModel.dateFrom && (
                            <div>{this.getSpecificDatesText(this.state.currentModel)}</div>
                        )}
                    </div>
                    {!this.state.isHidden && (
                        <ExpandedDatePanel onChange={this.onChange} initialModel={this.state.currentModel} />
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
        const monthName = uncertainDates.monthIdx === -1 ? 'any month' : monthNames[uncertainDates.monthIdx];
        return (
            <span>
                {durationText} on {monthName}
            </span>
        );
    }

    getSpecificDatesText(datesModel: DatesInput) {
        if (!datesModel.dateFrom || !datesModel.dateUntil) {
            return;
        }

        return (
            <span>
                {datesModel.dateFrom.getDate()} {datesModel.dateFrom.toLocaleString('default', { month: 'short' })} -{' '}
                {datesModel.dateUntil.getDate()} {datesModel.dateUntil.toLocaleString('default', { month: 'short' })}
            </span>
        );
    }

    // Handle expand/collapse

    componentWillMount() {
        document.addEventListener('click', this.bindHandleOutsideClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.bindHandleOutsideClick, false);
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
            if (this.state.currentModel.dateUntil == null && this.state.currentModel.uncertainDates == null) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            this.setState({
                isHidden: true
            });
        }
    }
}

export default DatePanel;
