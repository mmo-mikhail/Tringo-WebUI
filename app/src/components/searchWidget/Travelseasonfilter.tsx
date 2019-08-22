import * as React from "react";

import './widget.scss';

class Travelseasonfilter extends React.Component<any, any> {

    constructor(props:any)
    {
       super(props);
       this.handleClick=this.handleClick.bind(this);
       this.state={
           active:"any",
       }
    }

     handleClick(event: React.MouseEvent<HTMLElement>)
    {    
        let id=event.currentTarget.id;
        this.setState({active:id},()=>{console.log(this.state.active) });      
    }

    render() {
        return (
            <div>              
                <div className="btn-group">               
                      <button id="inseason" className={this.state.active=="inseason"?"btn-selection short":"btn-standard short"} onClick={(event: React.MouseEvent<HTMLElement>) => {this.handleClick(event)}}>In Season</button>
                      <button id="any" className={this.state.active=="any"?"btn-selection short":"btn-standard short"} onClick={(event: React.MouseEvent<HTMLElement>) => {this.handleClick(event)}}>Any</button>
                      <button id="offseason" className={this.state.active=="offseason"?"btn-selection short":"btn-standard short"} onClick={(event: React.MouseEvent<HTMLElement>) => {this.handleClick(event)}}>Off Season</button>
                </div>
            </div>
        )
    }
}

export default Travelseasonfilter
