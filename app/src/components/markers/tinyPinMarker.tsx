import * as React from 'react';
import './styles/tinyPinMarker.scss';
import { GoogleMapRequiredProps } from './priceTagMarker';
import classnames from 'classnames';

interface TinyMakrerProps extends GoogleMapRequiredProps {
    disabled?: boolean;
    onHover?: () => void;
    onLeave?: () => void;
}

const TinyPinMarker: React.FC<TinyMakrerProps> = props => {
    return (
        <div
            className={classnames('tiny-marker', { disabled: props.disabled })}
            onMouseEnter={() => {
                if (props.onHover) {
                    props.onHover();
                }
            }}
            onMouseOut={() => {
                if (props.onLeave) {
                    props.onLeave();
                }
            }}
        />
    );
};

export default TinyPinMarker;
