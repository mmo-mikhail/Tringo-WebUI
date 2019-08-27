import * as React from 'react';
import './styles/dateunknownstyle.scss';
import './styles/dateInput.scss';
import { Duration, UncertainDates } from '../../../models/request/dateInput';

export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

interface DateUnknownProps {
    initialDates: UncertainDates;
    onChange: (unknownDates: UncertainDates) => void;
}

interface DateUnknownState {
    monthNameOption: number;
    durationOption: Duration;
}

export class DateUnknown extends React.Component<
    DateUnknownProps,
    DateUnknownState
> {
    constructor(props: DateUnknownProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.createMonthOptions = this.createMonthOptions.bind(this);
        this.state = {
            monthNameOption: this.props.initialDates.monthIdx,
            durationOption: this.props.initialDates.duration
        };
    }

    createMonthOptions() {
        let buttons = [];
        let dt = new Date();
        let monNumber = dt.getMonth();
        for (let i = 0; i < 6; i++) {
            buttons.push(
                <button
                    key={monthNames[(monNumber + i) % 12]}
                    id={((monNumber + i) % 12).toString()}
                    className={
                        this.state.monthNameOption === (monNumber + i) % 12
                            ? 'btn-selection'
                            : 'btn-standard'
                    }
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        this.handleClick(event);
                    }}
                >
                    {monthNames[(monNumber + i) % 12]}
                </button>
            );
        }
        return buttons;
    }

    handleClick(event: React.MouseEvent<HTMLElement>) {
        let cId = event.currentTarget.id;
        if (
            cId === Duration[Duration.Weekend] ||
            cId === Duration[Duration.Week] ||
            cId === Duration[Duration.TwoWeek]
        ) {
            let curDuration = this.state.durationOption;
            let curButton = document.getElementById(Duration[curDuration]);
            curButton!.className = 'btn-standard';
            let dura = Duration.Weekend;
            if (cId === Duration[Duration.Weekend]) dura = Duration.Weekend;
            if (cId === Duration[Duration.Week]) dura = Duration.Week;
            if (cId === Duration[Duration.TwoWeek]) dura = Duration.TwoWeek;
            this.setState(
                {
                    durationOption: dura
                },
                () => {
                    const dates = new UncertainDates(
                        this.state.monthNameOption,
                        dura
                    );
                    this.props.onChange(dates);
                }
            );
        } else {
            let curMonth = this.state.monthNameOption;
            let curbutton = document.getElementById(curMonth.toString());
            curbutton!.className = 'btn-standard';
            this.setState({ monthNameOption: parseInt(cId) }, () => {
                let dura = Duration.Weekend;
                if (this.state.durationOption === Duration.Weekend)
                    dura = Duration.Weekend;
                if (this.state.durationOption === Duration.Week)
                    dura = Duration.Week;
                if (this.state.durationOption === Duration.TwoWeek)
                    dura = Duration.TwoWeek;
                const dates = new UncertainDates(
                    this.state.monthNameOption,
                    dura
                );
                this.props.onChange(dates);
            });
        }
        event.currentTarget.className === 'btn-selection'
            ? (event.currentTarget.className = 'btn-standard')
            : (event.currentTarget.className = 'btn-selection');
    }

    render() {
        return (
            <div className="flexible-dates-main-area">
                <div id="monthbtgroup" className="btn-group">
                    <button
                        id="-1"
                        className={
                            this.state.monthNameOption === -1
                                ? 'btn-selection'
                                : 'btn-standard'
                        }
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        All
                    </button>
                    {this.createMonthOptions()}
                </div>
                <hr className="hr" />
                <div id="durationbtgroup" className="btn-group">
                    <button
                        id={Duration[Duration.Weekend]}
                        className={
                            Duration[this.state.durationOption] ===
                            Duration[Duration.Weekend]
                                ? 'btn-selection'
                                : 'btn-standard'
                        }
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        Weekend
                    </button>
                    <button
                        id={Duration[Duration.Week]}
                        className={
                            Duration[this.state.durationOption] ===
                            Duration[Duration.Week]
                                ? 'btn-selection'
                                : 'btn-standard'
                        }
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        1 Week
                    </button>
                    <button
                        id={Duration[Duration.TwoWeek]}
                        className={
                            Duration[this.state.durationOption] ===
                            Duration[Duration.TwoWeek]
                                ? 'btn-selection'
                                : 'btn-standard'
                        }
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        2 Weeks
                    </button>
                </div>
            </div>
        );
    }
}
