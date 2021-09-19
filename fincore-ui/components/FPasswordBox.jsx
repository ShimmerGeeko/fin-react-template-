import { TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState, useImperativeHandle, useCallback, useContext } from 'react'
import PropTypes from 'prop-types';
import { FormContext } from './FCanvas';







const FinPasswordBox = React.memo(React.forwardRef((props, ref) => {

    const [error, setError] = useState(false);
    const _input = useRef(null)
    const _valid = useRef(true);
    const _disabled = useRef(true);
    const formContext = useContext(FormContext);
    useImperativeHandle(ref, () => {
        return {
            isValid: () => _valid.current,
            input: _input.current
        }
    })


    const {
        value,
        placeholder,
        required,
        onBlur,
        onFocus,
        length,
        ...otherProps
    } = props;



    function internalOnBlur(evt) {
        validate()
        if (!_valid.current) {
            setError(true);
            _input.current.focus();
        }
        if (onBlur) {
            onBlur(evt)
        }
    }

    function internalOnFocus(evt) {

        //console.log("internalOnFocus", onFocus)
        //setError(false);
        if (onFocus) {
            //console.log("internalOnFocus inside")
            onFocus(evt)
        }
    }


    function validate() {

        let value = _input.current.value;
        if (required) {
            if (value) {
                _valid.current = true
            }
            else {
                _valid.current = false
                return;
            }
        }
        else {
            _valid.current = true
        }
        if (length) {

            if (value.length > length) {
                _valid.current = false;
                return;
            }
            else {
                _valid.current = true;
            }
        }
    }

    return (

        <TextField
            value={value}
            type="password"
            error={error}
            placeholder={placeholder}
            required={required}
            onBlur={internalOnBlur}
            onFocus={internalOnFocus}
            inputRef={_input}
            inputProps={{readOnly: formContext.disabled, tabIndex: formContext.disabled ? -1 : 0}}
            InputLabelProps={{ shrink: true, style: {} }}
            ref={ref}
            //disabled={formContext.disabled}
            {...otherProps} />

    )

}))

export const FPasswordBox = React.forwardRef((props, ref) => <FinPasswordBox ref={ref} {...props} />)

FPasswordBox.propTypes = {


    length: PropTypes.number,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    inputProps: PropTypes.object,
    InputProps: PropTypes.object,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.any,
    helperText: PropTypes.string,
    autoFocus: PropTypes.bool,
    size: PropTypes.oneOf(["medium", "small"]),
    variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
}

FPasswordBox.defaultProps = {

    variant: "outlined",
    size: "small"
}
