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

export interface StepBracket {
    lowerLabelBound: number;
    upperLabelBound: number;
    stepping: number;
}

class BudgetRangeSlider extends React.Component<SliderProps, SliderState> {
    priceBrackets: StepBracket[];

    constructor(props: SliderProps) {
        super(props);

        this.priceBrackets = new Array<StepBracket>();
        this.priceBrackets.push(
            { lowerLabelBound: 0, upperLabelBound: 1000, stepping: 20 },
            { lowerLabelBound: 1000, upperLabelBound: 1600, stepping: 100 },
            { lowerLabelBound: 1600, upperLabelBound: this.props.max, stepping: 200 }
        );

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
        let sliderMaxVal = 0;

        for (let bracket of this.priceBrackets) {
            sliderMaxVal += (bracket.upperLabelBound - bracket.lowerLabelBound) / bracket.stepping;
        }

        return sliderMaxVal;
    }

    countLabel(sliderValue: number): number {
        let step = this.props.min;
        let bracketLblFloor = this.props.min;
        let bracketSliderMinVal = 0;
        let bracketSliderMaxVal = 0;

        for (let bracket of this.priceBrackets) {
            bracketSliderMinVal = bracketSliderMaxVal;
            bracketSliderMaxVal += (bracket.upperLabelBound - bracket.lowerLabelBound) / bracket.stepping;

            if (sliderValue > bracketSliderMinVal && sliderValue <= bracketSliderMaxVal) {
                bracketLblFloor = bracket.lowerLabelBound;
                step = bracket.stepping;
                break;
            }
        }

        return (sliderValue - bracketSliderMinVal) * step + bracketLblFloor;
    }

    onChangeSlider(sliderValue: number) {
        this.setState({
            currentValue: sliderValue,
            labelCount: this.countLabel(sliderValue)
        });
    }

    onAfterChangeSlider() {
        this.props.onChange && this.props.onChange([this.props.min, this.state.labelCount]);
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
