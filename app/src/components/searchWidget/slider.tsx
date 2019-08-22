import React, {Requireable } from "react";
import classnames from "classnames";
import PropTypes, {Validator } from "prop-types";
import Slider, {Range} from "rc-slider";
import 'rc-slider/assets/index.css';
import "./slider.scss"




// const myleftlabelStyles: CSSProperties = {
//   position: 'absolute',
//   left:"-15px",
//   color: "#f5f5f5"
// }

// const myrightlabelStyles: CSSProperties = {
//   position: 'absolute',
//   left:"275px",
//   color: "#f5f5f5"
// }

// const mysliderStyles: CSSProperties = {
//   position: 'relative',
//   left: "115px",
//   width: "50%"
// }

// const myheaderStyles: CSSProperties = {
//   position: 'absolute',
//   left: "-95px",
//   color: "#f5f5f5",
//   top:"-2px",
  

// }


class RangeSlider extends React.Component<any,any> {
    static defaultProps: { className: string; values: number[]; isRangeSlider: boolean; isBasicSlider: boolean; };
    static propTypes: { 
        min: Validator<number> 
        max: Validator<number>; 
        step: Validator<number>; 
        values: Validator<number[]>; 
        isRangeSlider: Requireable<boolean>; 
        isBasicSlider: Requireable<boolean>; 
        className: Requireable<string>; 
        onChange: PropTypes.Requireable<(...args: any[]) => any>
        
    
    };
  constructor(props:any) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(sliderValue:any) {
    const values = this.props.isRangeSlider
      ? sliderValue
      : [this.props.min, sliderValue];
    this.props.onChange && this.props.onChange(values);
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
    console.log(values[0]);
    
    const sliderClassName = classnames("range-slider", className, {
      "min-filtered": values[0] !== min,
      "max-filtered": values[1] !== max,
      "max-only": !isRangeSlider,
      "selector-slider": isBasicSlider
    });
    
    return (
      <div    className={sliderClassName}>

      
        
      <div className="budgetlabel">Budget</div>
          
        {isRangeSlider && (
          <Range
            min={min}
            max={max}
            value={values}
            allowCross={false}
            step={step}
            onChange={this.onChange}
          />
        )}
        {!isRangeSlider && (
          <Slider
          
            min={min}
            max={max}
            value={values[0]}
            step={step}
            onChange={this.onChange}
          />

        )}

      
        
        {!isBasicSlider && (
          <div>
            
            <br/>
            <div className="from" >{values[0]}$</div>
            <div className="to" >{values[1]}$</div> 
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
  className: "sliderClassName",
  values: [0, 1000],
  isRangeSlider: true,
  isBasicSlider: false      
    

};

export default RangeSlider;
