import React from 'react';
import classnames from 'classnames';
import Slider from 'rc-slider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDollarSign} from '@fortawesome/free-solid-svg-icons';

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
            currentValue: Math.log(props.max)
        };
        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.onAfterChangeSlider = this.onAfterChangeSlider.bind(this);
    }

    onChangeSlider(sliderValue: number) {
        this.setState({
            currentValue: sliderValue
        });
    }

    onAfterChangeSlider(sliderValue: number) {
        this.props.onChange && this.props.onChange([this.props.min, Math.round(Math.exp(sliderValue))]);
    }

    render() {
        const {min, max, className} = this.props;
        const {currentValue} = this.state;

        let curMin = Math.log(min) >= 0 ? Math.log(min) : 0;
        let curMax = Math.log(max);

        const sliderClassName = classnames(className, {
            'max-filtered': currentValue !== curMax
        });

        const sliderLabel =
            currentValue === curMax ? 'Any price' : `$ ${Math.round(Math.exp(currentValue)).toString().replace(/\d(?=(\d{3})+)/g, '$&,')}`;

        return (
            <div className={'widget-row widget-row-fill'}>
                <div className="icon-label wj-icon">
                    <FontAwesomeIcon icon={faDollarSign}/>
                </div>
                <div id="one-handler-range-slider" className={sliderClassName}>
                    <div className="text-container middle-text">
                        <span className="to">{sliderLabel}</span>
                    </div>
                    <div className="slider-container middle-text">
                        <Slider
                            min={curMin}
                            max={curMax}
                            value={currentValue}
                            step={(curMax - curMin) / 5000}
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
