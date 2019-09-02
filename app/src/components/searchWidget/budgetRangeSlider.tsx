import React from 'react';
import classnames from 'classnames';
import Slider from 'rc-slider';
import './styles/slider.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

export interface sliderProps {
    min: number;
    max: number;
    step: number;
    values: number[];
    className: string;
    onChange: (sliderChange: number[]) => void;
}

class BudgetRangeSlider extends React.Component<sliderProps> {
    constructor(props: sliderProps) {
        super(props);
        this.onChangeRange = this.onChangeRange.bind(this);
        this.onChangeSlider = this.onChangeSlider.bind(this);
    }

    onChangeRange(sliderValue: number[]) {
        this.props.onChange && this.props.onChange(sliderValue);
    }

    onChangeSlider(sliderValue: number) {
        this.props.onChange && this.props.onChange([this.props.min, sliderValue]);
    }

    render() {
        const { min, max, values, step, className } = this.props;
        if (!values || values.length < 2) {
            return null;
        }

        const sliderClassName = classnames(className, {
            'max-filtered': values[1] !== max
        });

        const sliderLabel =
            values[1] === max ? 'Any price' : `$ ${values[1].toString().replace(/\d(?=(\d{3})+)/g, '$&,')}`;

        return (
            <div className={'widget-row'}>
                <div className="slider-label wj-icon">
                    <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div id="one-handler-range-slider" className={sliderClassName}>
                    {<Slider min={min} max={max} value={values[1]} step={step} onChange={this.onChangeSlider} />}
                    {
                        <div>
                            <div className="to">{sliderLabel}</div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default BudgetRangeSlider;
