import * as React from 'react';
import './styles/dateunknownstyle.scss';
import './styles/dateInput.scss';
import {UncertainDates,Duration} from '../../../models/request/dateInput';

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

export interface DateUnknownProps{
    initialDates:UncertainDates,
    onChange:(unknownDates: UncertainDates) => void
}
export interface DateUnknownState{
    monthnameoption:number,
    durationoption:Duration
}
export class Dateunknown extends React.Component<DateUnknownProps, DateUnknownState> {
    constructor(props: DateUnknownProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.createMonthOptions = this.createMonthOptions.bind(this);
        this.state = {
            monthnameoption: this.props.initialDates.monthIdx,
            durationoption: this.props.initialDates.duration,
        };
    }
    createMonthOptions() {
        let buttons = [];
        let dt = new Date();
        let monnumber = dt.getMonth();
        for (let i = 0; i < 6; i++) {
            buttons.push(
                <button
                    key={monthNames[(monnumber + i) % 12]}
                    id={((monnumber + i) % 12).toString()}
                    className="btn-standard"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        this.handleClick(event);
                    }}
                >
                    {monthNames[(monnumber + i) % 12]}
                </button>
            );
        }
        return buttons;
    }
    handleClick(event: React.MouseEvent<HTMLElement>) {
        let cid = event.currentTarget.id;
        if (cid === Duration[Duration.Weekend] || cid === Duration[Duration.Week] || 
            cid === Duration[Duration.TwoWeek]) {
            let curduration = this.state.durationoption;
            let curbutton = document.getElementById(Duration[curduration]);
            curbutton!.className = 'btn-standard';   
                let dura=Duration.Weekend;
                if(cid === Duration[Duration.Weekend]) dura=Duration.Weekend; 
                if(cid === Duration[Duration.Week]) dura=Duration.Week;
                if(cid === Duration[Duration.TwoWeek]) dura=Duration.TwoWeek;      
            this.setState({ durationoption: dura,   
            }, () => {                  
                 const dates=new UncertainDates(this.state.monthnameoption,dura);
                 this.props.onChange(dates);         
            });
        } else {
            let curmonth = this.state.monthnameoption;          
                let curbutton = document.getElementById(curmonth.toString());
                curbutton!.className = 'btn-standard';                  
            this.setState({ monthnameoption: parseInt(cid) }, () => {
                let dura=Duration.Weekend;
                if(this.state.durationoption === Duration.Weekend) dura=Duration.Weekend; 
                if(this.state.durationoption === Duration.Week) dura=Duration.Week; 
                if(this.state.durationoption ===Duration.TwoWeek) dura=Duration.TwoWeek;
                 const dates=new UncertainDates(this.state.monthnameoption,dura);
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
                        className="btn-standard"
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
                        className="btn-standard"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        Weekend
                    </button>
                    <button
                        id={Duration[Duration.Week]}
                        className="btn-standard"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        1 Week
                    </button>
                    <button
                        id={Duration[Duration.TwoWeek]}
                        className="btn-standard"
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
export default Dateunknown;
