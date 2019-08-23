import * as React from 'react';
import './styles/dateunknownstyle.scss';
import './styles/dateInput.scss';

class Dateunknown extends React.Component<any, any> {


    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.createMonthOptions = this.createMonthOptions.bind(this);
        this.state = {
            monthnameoption: "ini",
            durationoption: "ini"
        }
    }


    createMonthOptions() {
        let buttons = [];
        let dt = new Date();
        let monnumber = dt.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        for (let i = 0; i < 6; i++) {
            buttons.push(
                <button key={monthNames[(monnumber + i) % 12]} id={monthNames[(monnumber + i) % 12]} className="btn-standard"
                    onClick={(event: React.MouseEvent<HTMLElement>) => { this.handleClick(event) }}
                >{monthNames[(monnumber + i) % 12]}</button>
            )
        }
        return buttons;
    }



    handleClick(event: React.MouseEvent<HTMLElement>) {
        let cid = event.currentTarget.id;
        if (cid === "weekend" || cid === "oneweek" || cid === "twoweeks") {

            let curduration = this.state.durationoption;
            if (curduration === "weekend" || curduration === "oneweek" || curduration === "twoweeks") {

                let curbutton = document.getElementById(curduration);
                curbutton!.className = "btn-standard";
            }

            this.setState({ durationoption: cid }, () => { console.log(this.state.durationoption) })
        }

        else {
            let curmonth = this.state.monthnameoption;
            if (curmonth !== "ini") {

                let curbutton = document.getElementById(curmonth);
                curbutton!.className = "btn-standard";
            }
            this.setState({ monthnameoption: cid }, () => { console.log(this.state.monthnameoption) })
        }
        event.currentTarget.className === "btn-selection" ? event.currentTarget.className = "btn-standard" : event.currentTarget.className = "btn-selection";

    }
    render() {

        return (
            <div className="flexible-dates-main-area">
                <div id="monthbtgroup" className="btn-group">
                    <button id="all" className="btn-standard" onClick={(event: React.MouseEvent<HTMLElement>) => { this.handleClick(event) }}
                    >All</button>

                    {this.createMonthOptions()}

                </div>
                <hr className="hr" />
                <div id="durationbtgroup" className="btn-group">
                    <button id="weekend" className="btn-standard" onClick={(event: React.MouseEvent<HTMLElement>) => { this.handleClick(event) }}>Weekend</button>
                    <button id="oneweek" className="btn-standard" onClick={(event: React.MouseEvent<HTMLElement>) => { this.handleClick(event) }}>1 Week</button>
                    <button id="twoweeks" className="btn-standard" onClick={(event: React.MouseEvent<HTMLElement>) => { this.handleClick(event) }}>2 Weeks</button>
                </div>

            </div>
        )
    }
}
export default Dateunknown;