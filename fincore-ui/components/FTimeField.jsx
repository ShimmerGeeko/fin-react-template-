import React, { useRef, useState, useImperativeHandle, useContext } from 'react'
import DateFnsUtils from "@date-io/date-fns";
import {
    KeyboardTimePicker, MuiPickersUtilsProvider, KeyboardTimePickerProps
} from "@material-ui/pickers";
import PropTypes from 'prop-types';
import { FormContext } from './FCanvas';



const FinFTimeField = React.memo(React.forwardRef((props, ref) => {

    const {
        onError, onBlur, disabled, required,onValidate, onTab,onKeyDown, label, ...otherProps } = props;
    const [error, setError] = useState(false);
    const _input = useRef(null)
    const _valid = useRef(true);
    const formContext = useContext(FormContext);
    const _disabled = disabled ? disabled : formContext.disabled;
    const errorCode = useRef(null);


    useImperativeHandle(ref, () => {
        return {
            isValid: () => _valid.current,
            disable: () => { _input.current.disabled = true },
            enable: () => { _input.current.disabled = false },
            focus: () => { _input.current.focus() },
            input: _input.current,
            validate: () => { return validate() },
            clear: () => { setError(false) },
        }
    });

    function validate() {

        let value = _input.current.value;
        if (required) {
            if (value) {
                _valid.current = true
            }
            else {
                _valid.current = false
                errorCode.current = "error_required";

                setError(true);



                if (onValidate) {
                    onValidate({
                        isValid: _valid.current,
                        errorCode: errorCode.current
                    });
                }
                return {
                    isValid: _valid.current,
                    errorCode: errorCode.current
                };
            }
        }
        else {
            _valid.current = true
        }
        errorCode.current = _valid.current ? null : "error_required";
        if (_valid.current) {

            if (error) {

                setError(false);


            }
        }
        else {


            setError(true)


        }
        if (onValidate) {
            onValidate({
                isValid: _valid.current,
                errorCode: errorCode.current
            });
        }
        return {
            isValid: _valid.current,
            errorCode: errorCode.current
        };

    }

    function internalonKeyDown(evt) {

        let validationResult;
        if (evt.key === "Tab") {
            validationResult = validate();
            if (!_valid.current) {
                evt.preventDefault();
            }
            else {
                if (onTab) {
                    onTab(evt)
                }
            }
        }
        if (onKeyDown) {
            onKeyDown(evt, validationResult);
        }
    }


    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
                required={required}
                label={label}
                error={error}
                InputLabelProps={{ shrink: true }}
                inputRef={_input}
                ref={ref}
                disabled={_disabled}
                onKeyDown={internalonKeyDown}
                KeyboardButtonProps={{ hidden: _disabled }}
                {...otherProps}
            />
        </MuiPickersUtilsProvider>
    )


}))

export const FTimeField = React.forwardRef((props, ref) => <FinFTimeField ref={ref} {...props} />)

FTimeField.propTypes = {


    ampm: PropTypes.bool,
    autoOk: PropTypes.bool,
    disabled: PropTypes.bool,
    disableToolbar: PropTypes.bool,
    emptyLabel: PropTypes.string,
    format: PropTypes.string,
    initialFocusedDate: PropTypes.objectOf(Date),
    inputVariant: PropTypes.oneOf(["standard", "outlined", "filled"]),
    invalidDateMessage: PropTypes.string,
    invalidLabel: PropTypes.string,
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    maxDateMessage: PropTypes.string,
    minDateMessage: PropTypes.string,
    readOnly: PropTypes.bool,
    variant: PropTypes.oneOf(["dialog", "inline", "static"]),
    views: PropTypes.oneOf(["hours", "minutes", "seconds"]),
    value: PropTypes.objectOf(Date),
    onOpen: PropTypes.func,
    onError: PropTypes.func,
    onAccept: PropTypes.func,
    onClose: PropTypes.func,
    onChange: PropTypes.func

}

FTimeField.defaultProps = {

    mask: "__:__ _M",
    onChange: (value) => { },
    size: "small"

}