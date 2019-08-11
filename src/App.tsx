import React, { Component } from 'react';
import { connect } from 'react-redux';


import logo from './logo.svg';
import './App.scss';

import { simpleAction } from './actions/simpleAction'
import GoogleMap from "./components/googleMap";
/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = (dispatch : any) => {
	return {
		simpleAction: () => dispatch(simpleAction())
	}
};

/* 
 * mapStateToProps
*/
const mapStateToProps = (state :any) => ({
	...state
});

/**
 * @class App
 * @extends {Component}
 */
class App extends Component<any, any> {

	/**
	 * @memberof App
	 * @summary handles button click 
	 */
	simpleAction(event : any) {
        //this.props.simpleAction();
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
					<h6 className="App-intro">
						by the best team ever
					</h6>
                </header>
                {/*
				<pre>
					{
						JSON.stringify(this.props)
					}
				</pre>
				<button onClick={this.simpleAction}>Test redux action</button>
				*/}

                <GoogleMap/>
				
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);