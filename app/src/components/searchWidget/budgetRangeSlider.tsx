import React from 'react';
import classnames from 'classnames';
import Slider from 'rc-slider';
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
        this.getStep = this.getStep.bind(this);
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

    getStep() {
        let ratio = Math.floor((this.state.currentValue / this.props.max) * 6);
        switch (ratio) {
            case 0:
                return process.env.REACT_APP_SLIDER_LOWEST_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_LOWEST_STEP)
                    : this.props.step;
            case 1:
                return process.env.REACT_APP_SLIDER_LOWEST_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_LOWEST_STEP)
                    : this.props.step;
            case 2:
                return process.env.REACT_APP_SLIDER_MEDIUM_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_MEDIUM_STEP)
                    : this.props.step;
            case 3:
                return process.env.REACT_APP_SLIDER_MEDIUM_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_MEDIUM_STEP)
                    : this.props.step;
            case 4:
                return process.env.REACT_APP_SLIDER_HIGHEST_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_HIGHEST_STEP)
                    : this.props.step;
            case 5:
                return process.env.REACT_APP_SLIDER_HIGHEST_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_HIGHEST_STEP)
                    : this.props.step;
            case 6:
                return process.env.REACT_APP_SLIDER_HIGHEST_STEP
                    ? parseInt(process.env.REACT_APP_SLIDER_HIGHEST_STEP)
                    : this.props.step;
            default:
                return this.props.step;
        }
    }

    render() {
        const { min, max, className } = this.props;
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
                    <div className="text-container middle-text">
                        <span className="to">{sliderLabel}</span>
                    </div>
                    <div className="slider-container middle-text">
                        <Slider
                            min={min}
                            max={max}
                            value={currentValue}
                            step={this.getStep()}
                            onChange={this.onChangeSlider}
                            onAfterChange={this.onAfterChangeSlider}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default BudgetRangeSlider;
