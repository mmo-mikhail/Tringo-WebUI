import * as React from 'react';
import Select from 'react-select';
import * as dateFns from 'date-fns';
import { DatesInput } from 'models/request/dateInput';
import { ValueType } from 'react-select/lib/types';
import './styles/monthselect.scss';

export interface dropdownprops {
    onChange: (datedModel: DatesInput, value: string) => void;
}

export interface MyOptionType {
    value: number;
    label: string;
}

export const DateNumberOptionHelper = (indx: number): [number, string] => {
    if (indx === -1) {
        return [indx, 'Any month'];
    }
    let month = dateFns.addMonths(new Date(), indx);
    let monthNum = month.getMonth();
    let monthStr = dateFns.format(month, 'MMMM yyyy');
    return [monthNum, monthStr];
};

const MonthSelect: React.FC<{ props: dropdownprops }> = ({ props }) => {
    const handleSelection = (value: ValueType<MyOptionType>) => {
        const valueNumber = value as MyOptionType;
        const dates = new DatesInput(valueNumber.value);
        props.onChange(dates, valueNumber.label);
    };

    let options = [];
    // options.push({ value: -1, label: 'Any month' });
    let numberOfMonthsAhead = 11;
    for (let i = -1; i < numberOfMonthsAhead + 1; i++) {
        let option = DateNumberOptionHelper(i);
        options.push({ value: option[0], label: option[1] });
    }

    return (
        <div className="wj-rc-select">
            <Select
                options={options}
                isSearchable={false}
                placeholder="Select ..."
                className="wj-rc-select"
                classNamePrefix="rc-select"
                onChange={handleSelection}
                defaultValue={options[0]}
            />
        </div>
    );
};

export default MonthSelect;
