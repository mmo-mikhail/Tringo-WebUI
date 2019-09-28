import * as React from 'react';
import { FC } from 'react';
import './tinyPinMarker.scss';
import { GoogleMapRequiredProps } from './priceTagMarker';
import classnames from 'classnames';

interface TinyMakrerProps extends GoogleMapRequiredProps {
    disabled?: boolean;
}

const TinyPinMarker: FC<TinyMakrerProps> = props => (
    <div className={classnames('tiny-marker', { disabled: props.disabled })} />
);

export default TinyPinMarker;
