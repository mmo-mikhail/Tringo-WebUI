import * as React from 'react';
import './styles/tringo.scss';
import SimpleMap from './components/googleMap';

/**
 * @class App
 * @extends {Component}
 */
class Tringo extends React.Component<any, any> {
    render() {
        return (
            <div className="App">
                <SimpleMap maxNumberOfConcurrentPriceMarkers={25} />
            </div>
        );
    }
}

export default Tringo;
