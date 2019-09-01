import React from 'react';
import classnames from 'classnames';
import Slider from 'rc-slider';
import './styles/slider.scss';

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
            // 'min-filtered': values[0] !== min
        });

        return (
            <div id="one-handler-range-slider" className={sliderClassName}>
                <div className="budget-label">Budget</div>
                {<Slider min={min} max={max} value={values[1]} step={step} onChange={this.onChangeSlider} />}
                {
                    <div>
                        <br />
                        <div className="from">$ {values[0]}</div>
                        <div className="to">$ {values[1].toString().replace(/\d(?=(\d{3})+)/g, '$&,')}</div>
                    </div>
                }
            </div>
        );
    }
}

export default BudgetRangeSlider;
