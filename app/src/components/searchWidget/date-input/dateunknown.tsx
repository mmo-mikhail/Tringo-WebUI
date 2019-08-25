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
export const durations= {
    1: 'Weekend',
    2: 'Week',
    4: 'TwoWeek',
}
export const durationToEnum= {
   1:Duration.Weekend,
   2:Duration.Week,
   4:Duration.TwoWeek
}
export interface dateUnknownProps{
    initialDates:UncertainDates,
    onChange:(unknownDates: UncertainDates) => void
}
export interface dateUnknownState{
    monthnameoption:number,
    durationoption:string
}
export class Dateunknown extends React.Component<dateUnknownProps, dateUnknownState> {
    constructor(props: dateUnknownProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.createMonthOptions = this.createMonthOptions.bind(this);
        this.state = {
            monthnameoption: -1,
            durationoption: durations[this.props.initialDates.duration]||'Weekend',
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
        if (cid === durations[1] || cid === durations[2] || 
            cid === durations[4]) {
            let curduration = this.state.durationoption;
            if (
                curduration === durations[1] ||
                curduration === durations[2] ||
                curduration === durations[4]
            ) {
                let curbutton = document.getElementById(curduration);
                curbutton!.className = 'btn-standard';
            }
               
            this.setState({ durationoption: cid,   
            }, () => {
                let dura=durationToEnum[1];
                if(cid === durations[1]) dura=durationToEnum[1]; 
                if(cid === durations[2]) dura=durationToEnum[2]; 
                if(cid === durations[4]) dura=durationToEnum[4];              
                 const dates=new UncertainDates(this.state.monthnameoption,dura);
                 this.props.onChange(dates);         
            });
        } else {
            let curmonth = this.state.monthnameoption;
            if (curmonth !== 15 ) {
                let curbutton = document.getElementById(curmonth.toString());
                curbutton!.className = 'btn-standard';
            }
          
            this.setState({ monthnameoption: parseInt(cid) }, () => {
                let dura=durationToEnum[1];
                if(this.state.durationoption === durations[1]) dura=durationToEnum[1]; 
                if(this.state.durationoption === durations[2] ) dura=durationToEnum[2]; 
                if(this.state.durationoption === durations[4]) dura=durationToEnum[4];
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
                        id='Weekend'
                        className="btn-standard"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        Weekend
                    </button>
                    <button
                        id='Week'
                        className="btn-standard"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            this.handleClick(event);
                        }}
                    >
                        1 Week
                    </button>
                    <button
                        id='TwoWeek'
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
