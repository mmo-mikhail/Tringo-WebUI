import * as React from 'react';
import classnames from 'classnames';
import { Async as AsyncSelect, components } from 'react-select';
import './styles/widget.scss';
import { ActionMeta } from 'react-select/lib/types';

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({ children, ...props }: any) => {
    const { inputIconClassName } = props.selectProps;
    const hasIcon = inputIconClassName !== '';

    return (
        <components.Control {...props}>
            {hasIcon && (
                <span
                    className={classnames(
                        'wj-icon wj-depart',
                        inputIconClassName
                    )}
                />
            )}
            {children}
        </components.Control>
    );
};

const Option = ({ data, ...props }: any) => (
    <components.Option {...props}>
        <span>{data.optionLabel}</span>
        <span>{data.optionSubLabel}</span>
    </components.Option>
);

const Input = (props: any) => (
    <components.Input {...props} role="presentation" name="props.id" />
);

// Autocomplete component starts from here
interface AutoCompleteProps {
    onChange: (airportId: string) => void;
    id: string;
    className: string;
    minValueLength: number;
    noOptionsMessage: string;
    placeholder: string;
    inputIconClassName: string;
    fetchOptions: (args: any, callback: any) => any;
    disabled?: boolean;
}

class Autocomplete extends React.Component<AutoCompleteProps> {
    constructor(props: AutoCompleteProps) {
        super(props);

        this.loadOptionsHandler = this.loadOptionsHandler.bind(this);
        this.noOptionsMessageHandler = this.noOptionsMessageHandler.bind(this);
        this.onSelectChanged = this.onSelectChanged.bind(this);
    }

    loadOptionsHandler(inputValue: any, callback: any) {
        // Start loading options after minimum length of typed value
        if (inputValue.length >= this.props.minValueLength) {
            this.props.fetchOptions(inputValue, callback);
        } else {
            callback();
        }
    }

    noOptionsMessageHandler(inputValue: { inputValue: string }) {
        // Only return no options message after minimum length of typed value
        // Otherwise do not show empty dropdown by returning null
        if (inputValue.inputValue.length >= this.props.minValueLength) {
            return this.props.noOptionsMessage;
        }
        return null;
    }

    onSelectChanged(value: any, action: ActionMeta) {
        this.props.onChange(value);
    }

    render() {
        return (
            <AsyncSelect
                inputId={this.props.id}
                isClearable
                defaultInputValue={process.env.REACT_APP_DEFAULT_LOCATION}
                placeholder={this.props.placeholder}
                isDisabled={this.props.disabled}
                loadOptions={this.loadOptionsHandler}
                noOptionsMessage={this.noOptionsMessageHandler}
                className={classnames(
                    'wj-rc-autocomplete',
                    this.props.className
                )}
                classNamePrefix="rc-autocomplete"
                components={{ Control, Option, LoadingIndicator, Input }}
                onChange={this.onSelectChanged}
            />
        );
    }
}

export default Autocomplete;
