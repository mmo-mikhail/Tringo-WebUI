import * as React from 'react';
import './departureMarker.scss';
import {GoogleMapRequiredProps} from './priceTagMarker';

const DepartureMarker: React.FC<GoogleMapRequiredProps> = () => {
    return <div className="departure-marker"></div>;
};

export default DepartureMarker;
