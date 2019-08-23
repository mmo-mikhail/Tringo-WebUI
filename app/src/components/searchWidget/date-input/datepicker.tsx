import React from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import Select from 'react-select';
import * as dateFns from 'date-fns';
import './styles/datepicker.scss';

class DatePicker extends React.Component<any, any> {
    static propTypes: {
        from: PropTypes.Requireable<{ [any: string]: any }>;
        to: PropTypes.Requireable<{ [any: string]: any }>;
        maxAvailableMonths: PropTypes.Requireable<number>;
        onDayChanged: PropTypes.Validator<(...args: any[]) => any>;
    };
    static defaultProps: {
        from: undefined;
        to: undefined;
        maxAvailableMonths: number;
    };
    constructor(props: any) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);

        this.state = {
            showMonth: props.from || new Date(),
            hoveredToDate: props.to
        };
    }

    getCalendarHeader(showMonth: any, numberOfMonthsAhead: any) {
        let options = [];
        for (let i = 0; i < numberOfMonthsAhead + 1; i++) {
            let month = dateFns.addMonths(new Date(), i);
            let monthStr = dateFns.format(month, 'MMMM yyyy');
            let monthVal = dateFns.format(month, 'yyyy-MM-01');
            options.push({ value: monthVal, label: monthStr });
        }

        let label = dateFns.format(showMonth, 'MMMM yyyy');
        let value = dateFns.format(showMonth, 'yyyy-MM-01');
        return (
            <div className="header">
                <Select
                    options={options}
                    isSearchable={false}
                    value={{ value: value, label: label }}
                    className="wj-rc-select"
                    classNamePrefix="rc-select"
                    onChange={this.handleMonthSelected}
                />
            </div>
        );
    }

    handleDayClick(day: any, modifiers = {}) {
        if (this.state.disabled) return;

        const { from, to, onDayChanged } = this.props;
        let range = { from, to };
        // When both from & to have values, then reset range and hoveredToDate
        if (from && to) {
            range = { from: undefined, to: undefined };
            this.setState({ hoveredToDate: null });
        }
        const newRange = DateUtils.addDayToRange(day, range);
        if (onDayChanged) onDayChanged(newRange);
    }

    handleDayMouseEnter(day: any, modifiers = {}) {
        if (this.state.disabled) return;

        const { from, to } = this.props;
        if ((from && !to) || (!from && to))
            this.setState({ hoveredToDate: day });
    }

    handleMonthSelected(selectedOption: any) {
        const month = new Date(Date.parse(selectedOption.value));
        this.setState({ showMonth: month });
    }

    handleMonthChange(month: any) {
        this.setState({ showMonth: month });
    }

    render() {
        const { from, to, maxAvailableMonths } = this.props;
        const { showMonth, hoveredToDate } = this.state;
        const today = new Date();

        // Disabled dates before today or before the first selected date
        const disabledBefore = !to && from ? from : today;
        // Disabled months that comes after the limit of maxAvailableMonths
        const disabledAfter = dateFns.addMonths(today, maxAvailableMonths);
        return (
            <div className="wj-rc-datepicker">
                {this.getCalendarHeader(showMonth, maxAvailableMonths)}
                <DayPicker
                    selectedDays={{ from, to: hoveredToDate }}
                    month={showMonth}
                    showOutsideDays
                    disabledDays={{
                        before: disabledBefore,
                        after: disabledAfter
                    }}
                    modifiers={{ start: from, end: hoveredToDate }}
                    onDayClick={this.handleDayClick}
                    onMonthChange={this.handleMonthChange}
                    onDayMouseEnter={this.handleDayMouseEnter}
                    weekdaysShort={[
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat'
                    ]}
                />
            </div>
        );
    }
}

DatePicker.propTypes = {
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    maxAvailableMonths: PropTypes.number,
    onDayChanged: PropTypes.func.isRequired
};

DatePicker.defaultProps = {
    from: undefined,
    to: undefined,
    maxAvailableMonths: 11
};

export default DatePicker;
