import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Async as AsyncSelect, components } from 'react-select';
import './styles/widget.scss';
import { ValueType } from 'react-select/lib/types';
import Highlighter from 'react-highlight-words';
import { useMediaQuery } from '@material-ui/core';
import { fetchLocationData } from 'services/dataService';

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({ children, ...props }: any) => <components.Control {...props}>{children}</components.Control>;

const Input = (props: any) => <components.Input {...props} role="presentation" name="props.id" />;

// Autocomplete component starts from here
export interface AutoCompleteProps {
    onChange: (airportId: string, displayValue: string, city: string) => void;
    id: string;
    name: string;
    className: string;
    minValueLength: number;
    noOptionsMessage: string;
    placeholder: string;
    disabled: boolean;
}

export interface OptionType {
    hasMetro?: boolean;
    label: string | null;
    value: string | null;
    optionLabel?: string;
    optionSubLabel?: string;
    city: string;
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
    const isMobileVIew = useMediaQuery(
        'only screen and (max-width: 960px), only screen and (max-width: 1024px) and (orientation: landscape)'
    );
    const [willResetField, setWillResetField] = useState<boolean>(false);
    const [highlight, setHighlight] = React.useState('');
    const [currentValue, setCurrentValue] = React.useState<OptionType | null>({
        label: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
        value: process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '',
        city: process.env.REACT_APP_DEFAULT_DEPARTURE_CITY || ''
    });
    const [nonEmptyValue, setNonEmptyValue] = React.useState<OptionType>({
        label: process.env.REACT_APP_DEFAULT_DEPARTURE_LABEL || '',
        value: process.env.REACT_APP_DEFAULT_DEPARTURE_ID || '',
        city: process.env.REACT_APP_DEFAULT_DEPARTURE_CITY || ''
    });

    const loadOptionsHandler = (inputValue: string, callback: any) => {
        // Start loading options after minimum length of typed value
        if (inputValue.length >= props.minValueLength) {
            fetchLocationData(inputValue, callback);
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
            setCurrentValue(option);
            setNonEmptyValue(option);
            props.onChange(option.value || '', option.label || '', option.city || '');
        } else {
            setCurrentValue(null);
            if (isMobileVIew) setWillResetField(true);
        }
    };

    const onFocus = () => {
        if (!currentValue) {
            setWillResetField(true);
        }
    };

    const ondBlur = () => {
        if (!currentValue && willResetField) {
            setCurrentValue(nonEmptyValue);
            setWillResetField(false);
        }
    };

    useEffect(() => {
        setCurrentValue(nonEmptyValue);
    }, [nonEmptyValue]);

    return (
        <AsyncSelect
            inputId={props.id}
            isClearable={true}
            placeholder={props.placeholder}
            isDisabled={props.disabled}
            loadOptions={loadOptionsHandler}
            noOptionsMessage={noOptionsMessageHandler}
            className={classnames('wj-rc-autocomplete', props.className)}
            classNamePrefix="rc-autocomplete"
            components={{ Control, Option, LoadingIndicator, Input }}
            onChange={onSelectChanged}
            onInputChange={(val: string) => setHighlight(val)}
            onBlur={ondBlur}
            onFocus={onFocus}
            value={currentValue}
        />
    );
};

export default Autocomplete;
