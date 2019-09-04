import React from 'react';
import classnames from 'classnames';
import Slider from 'rc-slider';
import './styles/slider.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

export interface SliderProps {
    min: number;
    max: number;
    step: number;
    className: string;
    onChange: (sliderChange: number[]) => void;
}

interface SliderState {
    currentValue: number;
}

class BudgetRangeSlider extends React.Component<SliderProps, SliderState> {
    constructor(props: SliderProps) {
        super(props);

        this.state = {
            currentValue: props.max
        };
        this.onChangeRange = this.onChangeRange.bind(this);
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.onAfterChangeSlider = this.onAfterChangeSlider.bind(this);
    }

    onChangeRange(sliderValue: number[]) {
        this.props.onChange && this.props.onChange(sliderValue);
    }

    onChangeSlider(sliderValue: number) {
        this.setState({
            currentValue: sliderValue
        });
    }

    onAfterChangeSlider(sliderValue: number) {
        this.props.onChange && this.props.onChange([this.props.min, sliderValue]);
    }

    render() {
        const { min, max, step, className } = this.props;
        const { currentValue } = this.state;

        const sliderClassName = classnames(className, {
            'max-filtered': currentValue !== max
        });

        const sliderLabel =
            currentValue === max ? 'Any price' : `$ ${currentValue.toString().replace(/\d(?=(\d{3})+)/g, '$&,')}`;

        return (
            <div className={'widget-row widget-row-fill'}>
                <div className="icon-label wj-icon">
                    <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div id="one-handler-range-slider" className={sliderClassName}>
                    {
                        <Slider
                            min={min}
                            max={max}
                            value={currentValue}
                            step={step}
                            onChange={this.onChangeSlider}
                            onAfterChange={this.onAfterChangeSlider}
                        />
                    }
                    {<span className="to">{sliderLabel}</span>}
                </div>
            </div>
        );
    }
}

export default BudgetRangeSlider;
