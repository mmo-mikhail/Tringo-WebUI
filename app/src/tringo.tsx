import * as React from 'react';

import './tringo.scss';

import SimpleMap from './components/googleMap';

/**
 * @class App
 * @extends {Component}
 */
class Tringo extends React.Component<any, any> {
    render() {
        return (
            <div className="App">
                <SimpleMap
                    center={{ lat: -23.7970703, lng: 132.3082171 }}
                    defaultZoom={this.defaultZoom()}
                />
            </div>
        );
    }

    private defaultZoom(): number {
        const screenWidth = window.screen.width * window.devicePixelRatio;
        // const screenHeight = window.screen.height * window.devicePixelRatio;
        return screenWidth < 600 ? 10 : 4.72;
    }
}

export default Tringo;
