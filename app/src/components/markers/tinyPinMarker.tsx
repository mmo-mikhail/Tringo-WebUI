import * as React from 'react';
import './tinyPinMarker.scss';
import { GoogleMapRequiredProps } from './priceTagMarker';

interface TinyMakrerProps extends GoogleMapRequiredProps {
    disabled?: boolean;
}

const TinyPinMarker: React.FC<TinyMakrerProps> = props => {
    return <div className={'tiny-marker ' + (props.disabled ? 'disabled' : '')}></div>;
};

export default TinyPinMarker;
