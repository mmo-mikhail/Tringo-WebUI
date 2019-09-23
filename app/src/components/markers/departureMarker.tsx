import * as React from 'react';
import './departureMarker.scss';
import {GoogleMapRequiredProps} from './priceTagMarker';

const DepartureMarker: React.FC<GoogleMapRequiredProps> = () => {
    return <img alt="" className="departure-marker "
    src="https://services.webjet.com.au/web/hotels/search/content/images/google-map-pin.png" />;
    
};

export default DepartureMarker;
