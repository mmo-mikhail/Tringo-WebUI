import * as React from 'react';
import './tringo.scss';
import gMapConf from 'components/gMapConf.json';
import SimpleMap from './components/googleMap';

/**
 * @class App
 * @extends {Component}
 */
class Tringo extends React.Component<any, any> {
    render() {
        return (
            <div className="App">
                <SimpleMap center={gMapConf.defaultCentre} defaultZoom={this.defaultZoom()} />
            </div>
        );
    }

    private defaultZoom(): number {
        const zoom =
            window.screen.width < 600
                ? (gMapConf.defaultMobileZoom as number)
                : (gMapConf.defaultDesktopZoom as number);

        // const screenHeight = window.screen.height * window.devicePixelRatio;
        return zoom;
    }
}

export default Tringo;
