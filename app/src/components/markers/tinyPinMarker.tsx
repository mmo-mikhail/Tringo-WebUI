import * as React from 'react';
import './tinyPinMarker.scss';
import {GoogleMapRequiredProps} from './priceTagMarker';

const TinyPinMarker: React.FC<GoogleMapRequiredProps> = () => {
    return <div className="tiny-marker"></div>;
};

export default TinyPinMarker;
