import * as React from 'react';
import Autocomplete from "./Autocomplete";


class SearchWidgetWrapper extends React.Component<any, any> {
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
                        placeholder="Pick up location"
                        minValueLength={3}
                        noOptionsMessage={noOptionsMessage}
                        fetchOptions={fetchLocationData}
                        inputIconClassName="wj-car-pickup"
                    />
                </div>
            </div>
        );
    }
}

export default SearchWidgetWrapper