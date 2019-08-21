import * as React from 'react';

import './App.scss';

import SimpleMap from "./components/googleMap";

/**
 * @class App
 * @extends {Component}
 */
class App extends React.Component<any, any> {

	render() {
		return (
			<div className="App">
                <SimpleMap
                    center={{ lat: -23.7970703, lng: 132.3082171 }}
                    defaultZoom={4.72}/>
			</div>
		);
	}
}

export default App;
