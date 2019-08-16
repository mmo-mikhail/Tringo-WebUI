import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.scss';

import { simpleAction } from './actions/simpleAction'
import SimpleMap from "./components/googleMap";
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
					<SimpleMap/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
