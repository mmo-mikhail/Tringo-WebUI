import * as React from "react";
import * as PropTypes from "prop-types";
import classnames from "classnames";
import { components } from "react-select";
import { Async as AsyncSelect } from "react-select";

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({ children, ...props } : any) => {
    const { inputIconClassName } = props.selectProps;
    const hasIcon = inputIconClassName !== "";

    return (
        <components.Control {...props}>
            {hasIcon && (
                <span className={classnames("wj-icon", inputIconClassName)} />
            )}
            {children}
        </components.Control>
    );
};

const Option = ({ data, ...props } : any) => (
    <components.Option {...props}>
        <span>{data.optionLabel}</span>
        <span>{data.optionSubLabel}</span>
    </components.Option>
);

const Input = (props : any) => (
    <components.Input {...props} role="presentation" name="props.id" />
);

// Autocomplete component starts from here
const Autocomplete = ({
    id,
    className,
    placeholder,
    minValueLength,
    noOptionsMessage,
    inputIconClassName,
    fetchOptions,
    disabled
}:any) => {
    const loadOptionsHandler = (inputValue : any, callback : any) => {
        // Start loading options after minimum length of typed value
        if (inputValue.length >= minValueLength) fetchOptions(inputValue, callback);
        else callback();
    };

    const noOptionsMessageHandler = ({ inputValue } : any) => {
        // Only return no options message after minimum length of typed value
        // Otherwise do not show empty dropdown by returning null
        if (inputValue.length >= minValueLength) return noOptionsMessage;
        return null;
    };
    return (
        <AsyncSelect
            inputId={id}
            isClearable
            placeholder={placeholder}
            isDisabled={disabled}
            loadOptions={loadOptionsHandler}
            noOptionsMessage={noOptionsMessageHandler}
            className={classnames("wj-rc-autocomplete", className)}
            classNamePrefix="rc-autocomplete"
            components={{ Control, Option, LoadingIndicator, Input }}
        />
    );
};

Autocomplete.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    minValueLength: PropTypes.number.isRequired,
    noOptionsMessage: PropTypes.string,
    inputIconClassName: PropTypes.string,
    fetchOptions: PropTypes.func.isRequired,
};

Autocomplete.defaultProps = {
    className: "",
    placeholder: "",
    minValueLength: 1,
    noOptionsMessage: "",
    inputIconClassName: ""
};

export default Autocomplete;
