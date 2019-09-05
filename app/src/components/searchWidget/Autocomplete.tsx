import * as React from 'react';
import classnames from 'classnames';
import {Async as AsyncSelect, components} from 'react-select';
import './styles/widget.scss';
import {ActionMeta} from 'react-select/lib/types';
import Highlighter from 'react-highlight-words';

// AsyncSelect custom components below
const LoadingIndicator = () => <span className="loader alt" />;

const Control = ({children, ...props}: any) => {
    const {inputIconClassName} = props.selectProps;
    const hasIcon = inputIconClassName !== '';

    return (
        <components.Control {...props}>
            {hasIcon && <span className={classnames('wj-icon wj-depart', inputIconClassName)} />}
            {children}
        </components.Control>
    );
};


const Input = (props: any) => <components.Input {...props} role="presentation" name="props.id" />;

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

interface AutoCompleteState {
    inputValue?: string;
    selectedOption: any,
}

class Autocomplete extends React.Component<AutoCompleteProps, AutoCompleteState> {
    constructor(props: AutoCompleteProps) {
        super(props);
        this.loadOptionsHandler = this.loadOptionsHandler.bind(this);
        this.noOptionsMessageHandler = this.noOptionsMessageHandler.bind(this);
        this.onSelectChanged = this.onSelectChanged.bind(this);
        this.formatOptionLabel = this.formatOptionLabel.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            inputValue: process.env.REACT_APP_DEFAULT_LOCATION,
            selectedOption: null
        };
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

    onSelectChanged(value: any, {action}: ActionMeta) {
        this.props.onChange(value);

        if (action === 'clear' || value === null) {
            this.setState({selectedOption: value, inputValue: ''}, () => {
                console.log(`option is cleared value now is${  this.state.inputValue}`)
            })
            return;
        }
        this.setState({selectedOption: value, inputValue: value.optionLabel}, () => {
        })


    }

    onInputChange = (inputValue: any) => {
        if (inputValue !== '') {
            this.setState({inputValue: inputValue}, () => {
                console.log(`input change triggered${  this.state.inputValue}`)
            });
        }

    };

    formatOptionLabel({optionLabel, optionSubLabel}: any, {inputValue}: any) {


        return (
            <div>
                <div className='format-label'>
                    <Highlighter
                        searchWords={[inputValue]}
                        textToHighlight={optionLabel}
                        autoEscape={true}
                        highlightClassName='high-light'
                        unhighlightClassName='un-high-light'
                    />
                </div>
                <br />
                <div className='format-label'>
                    <Highlighter
                        searchWords={[inputValue]}
                        textToHighlight={optionSubLabel}
                        autoEscape={true}
                        highlightClassName='high-light'
                        unhighlightClassName='un-high-light'
                    />
                </div>
            </div>
        );
    }


    render() {
        let inputValue = this.state.inputValue;

        return (
            <AsyncSelect
                inputId={this.props.id}
                isClearable
                inputValue={this.state.inputValue}
                placeholder={this.props.placeholder}
                isDisabled={this.props.disabled}
                loadOptions={this.loadOptionsHandler}
                noOptionsMessage={this.noOptionsMessageHandler}
                formatOptionLabel={this.formatOptionLabel}
                className={classnames('wj-rc-autocomplete', this.props.className)}
                classNamePrefix="rc-autocomplete"
                components={{Control, LoadingIndicator}}
                onChange={this.onSelectChanged}
                onInputChange={this.onInputChange}
            />
        );
    }
}

export default Autocomplete;
