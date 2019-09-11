import * as React from 'react';
import { FC } from 'react';
import classnames from 'classnames';
import { Async as AsyncSelect, components } from 'react-select';
import './styles/widget.scss';
import { ValueType } from 'react-select/lib/types';
import Highlighter from 'react-highlight-words';

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({ children, ...props }: any) => (
    <components.Control {...props}>
        {<span className={classnames('wj-icon', 'wj-mappin')} />}
        {children}
    </components.Control>
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
    fetchOptions: (args: string, callback: () => {}) => unknown;
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
    const Option = ({ data, ...props }: any) => (
        <components.Option {...props}>
            <div className={classnames({ 'has-metro': data.hasMetro })}>
                <Highlighter className={'auto-label'} searchWords={[highlight]} textToHighlight={data.optionLabel} />
                <br />
                <Highlighter
                    className={'auto-sub-label'}
                    searchWords={[highlight]}
                    textToHighlight={data.optionSubLabel}
                />
            </div>
        </components.Option>
    );

    const [highlight, setHighlight] = React.useState('');

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

    const onSelectChanged = (v: ValueType<OptionType>) => {
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
            onInputChange={(val: string) => setHighlight(val)}
        />
    );
};

export default Autocomplete;
