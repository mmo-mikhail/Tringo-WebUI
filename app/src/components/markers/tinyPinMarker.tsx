import * as React from 'react';
import './tinyPinMarker.scss';
import { GoogleMapRequiredProps } from './priceTagMarker';

interface TinyMakrerProps extends GoogleMapRequiredProps {
    disabled?: boolean;
    onHover?: () => void;
    onLeave?: () => void;
}

const TinyPinMarker: React.FC<TinyMakrerProps> = props => {
    return (
        <div
            className={'tiny-marker ' + (props.disabled ? 'disabled' : '')}
            onMouseEnter={() => {
                if (props.onHover) props.onHover();
            }}
            onMouseOut={() => {
                if (props.onLeave) props.onLeave();
            }}
        ></div>
    );
};

export default TinyPinMarker;
