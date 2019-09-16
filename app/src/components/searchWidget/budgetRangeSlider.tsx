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
    maxValue: number;
    labelCount: number;
}

interface StepBracket {
    lowerLabelBound: number;
    upperLabelBound: number;
    sliderLowerBrake: number;
    stepping: number;
}

class BudgetRangeSlider extends React.Component<SliderProps, SliderState> {
    priceBrackets = new Array<StepBracket>();

    constructor(props: SliderProps) {
        super(props);

        let maxVal = this.maxVal();

        this.state = {
            maxValue: maxVal,
            currentValue: maxVal,
            labelCount: this.props.max
        };

        this.onChangeSlider = this.onChangeSlider.bind(this);
        this.onAfterChangeSlider = this.onAfterChangeSlider.bind(this);
    }

    maxVal(): number {
        let totalSteps = 0;

        this.priceBrackets.push(
            { lowerLabelBound: 0, sliderLowerBrake: 0, upperLabelBound: 1200, stepping: 20 },
            { lowerLabelBound: 1200, sliderLowerBrake: 60, upperLabelBound: this.props.max, stepping: 100 }
        );

        for (let bracket of this.priceBrackets) {
            totalSteps += (bracket.upperLabelBound - bracket.lowerLabelBound) / bracket.stepping;
        }

        return totalSteps;
    }

    countLabel(sliderValue: number): number {
        let step: number;
        let bracketLblrFloor = this.props.min;
        let steppUpperBrake: number;
        if (sliderValue >= this.priceBrackets[1].sliderLowerBrake) {
            bracketLblrFloor = this.priceBrackets[1].lowerLabelBound;
            step = this.priceBrackets[1].stepping;
            steppUpperBrake = this.priceBrackets[1].sliderLowerBrake;
        } else {
            bracketLblrFloor = 0;
            step = 20;
            steppUpperBrake = 0;
        }

        return (sliderValue - steppUpperBrake) * step + bracketLblrFloor;
    }

    onChangeSlider(sliderValue: number) {
        this.setState({
            currentValue: sliderValue,
            labelCount: this.countLabel(sliderValue)
        });
    }

    onAfterChangeSlider(sliderValue: number) {
        this.props.onChange && this.props.onChange([this.props.min, sliderValue]);
    }

    render() {
        const { className } = this.props;

        const sliderClassName = classnames(className, {
            'max-filtered': this.state.currentValue !== this.state.maxValue
        });

        const sliderLabel =
            this.state.currentValue === this.state.maxValue
                ? 'Any price'
                : `$ ${this.state.labelCount
                      .toFixed()
                      .toString()
                      .replace(/\d(?=(\d{3})+)/g, '$&,')}`;

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
                            min={this.props.min}
                            max={this.state.maxValue}
                            value={this.state.currentValue}
                            step={1}
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
