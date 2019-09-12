import * as React from 'react';
import Select from 'react-select';
import * as dateFns from 'date-fns';
import { DatesInput } from 'models/request/dateInput';
import { ValueType } from 'react-select/lib/types';
import './styles/monthselect.scss';

export interface dropdownprops {
    onChange: (datedModel: DatesInput) => void;
}

export interface MyOptionType {
    value: number;
    label: string;
}

const MonthSelect: React.FC<{ props: dropdownprops }> = ({ props }) => {
    const handleSelection = (value: ValueType<MyOptionType>) => {
        const valuenumber = value as MyOptionType;
        const dates = new DatesInput(valuenumber.value);
        props.onChange(dates);
    };

    let options = [];
    options.push({ value: -1, label: 'Any month' });
    let numberOfMonthsAhead = 11;
    for (let i = 0; i < numberOfMonthsAhead + 1; i++) {
        let month = dateFns.addMonths(new Date(), i);
        let monthNum = month.getMonth();
        let monthStr = dateFns.format(month, 'MMMM yyyy');
        options.push({ value: monthNum, label: monthStr });
    }

    return (
        <div className="option-select">
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
