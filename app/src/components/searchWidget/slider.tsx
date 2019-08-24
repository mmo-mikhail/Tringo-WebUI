import React, { Requireable } from 'react';
import classnames from 'classnames';
import PropTypes, { Validator } from 'prop-types';
import Slider, { Range } from 'rc-slider';
import './styles/slider.scss';

class RangeSlider extends React.Component<any, any> {
    static defaultProps: {
        className: string;
        values: number[];
        isRangeSlider: boolean;
        isBasicSlider: boolean;
    };
    static propTypes: {
        min: Validator<number>;
        max: Validator<number>;
        step: Validator<number>;
        values: Validator<number[]>;
        isRangeSlider: Requireable<boolean>;
        isBasicSlider: Requireable<boolean>;
        className: Requireable<string>;
        onChange: PropTypes.Requireable<(...args: number[]) => void>;
    };
    constructor(props: any) {
        super(props);
        this.onChangeRange = this.onChangeRange.bind(this);
        this.onChangeSlider = this.onChangeSlider.bind(this);
    }

    onChangeRange(sliderValue: number[]) {
        this.props.onChange && this.props.onChange(sliderValue);
    }

    onChangeSlider(sliderValue: number) {
        this.props.onChange &&
            this.props.onChange([this.props.min, sliderValue]);
    }

    render() {
        const {
            min,
            max,
            values,
            isRangeSlider,
            isBasicSlider,
            step,
            className
        } = this.props;
        if (!values || values.length < 2) return null;

        const sliderClassName = classnames('range-slider', className, {
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
                    <Slider
                        min={min}
                        max={max}
                        value={values[0]}
                        step={step}
                        onChange={this.onChangeSlider}
                    />
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
RangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    isRangeSlider: PropTypes.bool,
    isBasicSlider: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func
};

RangeSlider.defaultProps = {
    className: 'sliderClassName',
    values: [0, 500],
    isRangeSlider: true,
    isBasicSlider: false
};

export default RangeSlider;
