import * as React from 'react';
import Autocomplete from "./Autocomplete";
import RangeSlider from "./slider"

class SearchWidgetWrapper extends React.Component<any, any,any> {
    constructor(props:any) {
        super(props);
       
        this.onChange = this.onChange.bind(this);
        this.state = {
          min: 100,
          max: 1000,
          step: 10,
          values: [100, 1000],
        }; 
      }
      onChange(values: any) {
        this.setState({ values: values });
      }
    render() {
        const fetchLocationData = (inputValue: any, callback: any) => {
            // Mock api call
            setTimeout(() => {
                callback([
                    {
                        value: 1,
                        label: "Melbourne International Airport, Australia",
                        optionLabel: "Melbourne International Airport (MEL)",
                        optionSubLabel: "Melbourne, Australia"
                    },
                    {
                        value: 2,
                        label: "Sydney International Airport, Australia",
                        optionLabel: "Sydney International Airport (SYD)",
                        optionSubLabel: "Sydney, Australia"
                    },
                    {
                        value: 3,
                        label: "Perth International Airport, Australia",
                        optionLabel: "Perth International Airport (PER)",
                        optionSubLabel: "Perth, Australia"
                    }
                ]);
            }, 500);
        };

        const noOptionsMessage =
            "No cities or airports were found. Please check your spelling.";
        return (
            <div className="widgetContainer">
                <div >
                    <Autocomplete
                        id="pickup-location"
                        className="pickup-location"
                        placeholder="Sydney International Airport (SYD)"
                        minValueLength={3}
                        noOptionsMessage={noOptionsMessage}
                        fetchOptions={fetchLocationData}
                        inputIconClassName="wj-car-pickup"
                    />
                   
                    <RangeSlider
                    
                    min={this.state.min}
                    max={this.state.max}
                    values={this.state.values}
                    step={this.state.step}
                    className={this.state.className}
                    onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}

export default SearchWidgetWrapper