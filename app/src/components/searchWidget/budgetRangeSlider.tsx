import React from 'react';
import classnames from 'classnames';
import Slider, { Range } from 'rc-slider';
import './styles/slider.scss';

export interface sliderProps {
    min: number;
    max: number;
    step: number;
    values: number[];
    isRangeSlider: boolean;
    isBasicSlider: boolean;
    className: string;
    onChange: (sliderChange: number[]) => void;
}

class BudgetRangeSlider extends React.Component<sliderProps> {
    constructor(props: any) {
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
        const { min, max, values, isRangeSlider, isBasicSlider, step, className } = this.props;
        if (!values || values.length < 2) return null;

        const sliderClassName = classnames(className, {
            'min-filtered': values[0] !== min,
            'max-filtered': values[1] !== max,
            'max-only': !isRangeSlider,
            'selector-slider': isBasicSlider
        });

        return (
            <div className={sliderClassName}>
                <div className="budgetlabel">Budget</div>

                {isRangeSlider && (
                    <Range
                        min={min}
                        max={max}
                        value={values}
                        allowCross={false}
                        step={step}
                        onChange={this.onChangeRange}
                    />
                )}
                {!isRangeSlider && (
                    <Slider min={min} max={max} value={values[0]} step={step} onChange={this.onChangeSlider} />
                )}
                {!isBasicSlider && (
                    <div>
                        <br />
                        <div className="from">{values[0]}$</div>
                        <div className="to">{values[1]}$</div>
                    </div>
                )}
            </div>
        );
    }
}

export default BudgetRangeSlider;
