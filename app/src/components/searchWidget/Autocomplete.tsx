import * as React from 'react';
import classnames from 'classnames';
import { Async as AsyncSelect, components } from 'react-select';
import './styles/widget.scss';
import { ActionMeta, ValueType } from 'react-select/lib/types';
import { FC } from 'react';

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({ children, ...props }: any) => (
    <components.Control {...props}>
        {<span className={classnames('wj-icon', 'wj-depart')} />}
        {children}
    </components.Control>
);

const Option = ({ data, ...props }: any) => (
    <components.Option {...props}>
        <span className={classnames({ 'has-metro': data.hasMetro })}>
            <span>{data.optionLabel}</span>
            <span>{data.optionSubLabel}</span>
        </span>
    </components.Option>
);

const Input = (props: any) => <components.Input {...props} role="presentation" name="props.id" />;

// Autocomplete component starts from here
export interface AutoCompleteProps {
    onChange: (airportId: string) => void;
    id: string;
    name: string;
    className: string;
    minValueLength: number;
    noOptionsMessage: string;
    placeholder: string;
    inputIconClassName: string;
    fetchOptions: (args: string, callback: any) => any;
    disabled: boolean;
}

export interface OptionType {
    hasMetro?: boolean;
    label: string;
    value: string;
    optionLabel?: string;
    optionSubLabel?: string;
}

const Autocomplete: FC<{ props: AutoCompleteProps }> = ({ props }) => {
    const loadOptionsHandler = (inputValue: string, callback: any) => {
        // Start loading options after minimum length of typed value
        if (inputValue.length >= props.minValueLength) {
            props.fetchOptions(inputValue, callback);
        } else {
            callback();
        }
    };

    const noOptionsMessageHandler = (inputValue: { inputValue: string }) => {
        // Only return no options message after minimum length of typed value
        // Otherwise do not show empty dropdown by returning null
        if (inputValue.inputValue.length >= props.minValueLength) {
            return props.noOptionsMessage;
        }
        return null;
    };

    const onSelectChanged = (v: ValueType<OptionType>, action: ActionMeta) => {
        const option = v as OptionType;
        if (option) {
            props.onChange(option.value);
        }
    };

    return (
        <AsyncSelect
            inputId={props.id}
            isClearable
            defaultValue={{
                label: 'Sydney, Australia',
                value: process.env.REACT_APP_DEFAULT_DEPARTURE || ''
            }}
            placeholder={props.placeholder}
            isDisabled={props.disabled}
            loadOptions={loadOptionsHandler}
            noOptionsMessage={noOptionsMessageHandler}
            className={classnames('wj-rc-autocomplete', props.className)}
            classNamePrefix="rc-autocomplete"
            components={{ Control, Option, LoadingIndicator, Input }}
            onChange={onSelectChanged}
        />
    );
};

export default Autocomplete;
