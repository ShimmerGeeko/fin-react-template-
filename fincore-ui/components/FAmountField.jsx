import { makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useImperativeHandle, useState, useContext } from 'react'
import AutoNumeric from 'autonumeric';
import PropTypes from 'prop-types';
import { FormContext } from './FCanvas';

const useStyles = makeStyles((theme) => {
    return {
        textField: {
            textAlign: "right",
          },
    }
    
})
const FinAmountField = React.memo(React.forwardRef((props, ref) => {

    const _input = useRef(null)
    const _valid = useRef(true);
    const _length = useRef(13);
    const _autoRef = useRef(null);
    const [error, setError] = useState(false);
    const formContext = useContext(FormContext);
    const classes = useStyles();

    useImperativeHandle(ref, () => {
        console.log("imperative")
        return {
            isValid: () => _valid.current,
            input: _input.current,
            label: label,
            focus: () => {
                setTimeout(() => {
                    _input.current.focus();
                }, 10);
            },
        }
    })

    const {
        value,
        label,
        required,
        allowNegetive,
        onBlur,
        onFocus,
        onKeyDown,
        onTab,
        inputProps,
        ...otherProps
    } = props;

    useEffect(() => {

        
        const options = {
            selectOnFocus: true,
            caretPositiononFocus: null,
            digitalGroupSpacing: '2',

        }
        if(!allowNegetive){
            options.minimumValue = 0;
        }
        options.decimalPlaces = 2;
        let vMax="";
        for (let i = 0; i < _length.current; i++) {
            vMax = vMax.concat("9");
        }
        options.vMax = vMax;

        _autoRef.current = new AutoNumeric(_input.current, options);
    }, [])

    useEffect(() => {
        
        if(value){
            AutoNumeric.set(_input.current, value);
            
        }
        else{
            AutoNumeric.set(_input.current, "");
        }
        // if(error){
        //     setError(false);
        // }
        
    }, [props.value])

    useState(()=> {
        if(error){
            _input.current.focus();
            console.log("setting focus...");
        }
    }, [error])

    

    function getPattern() {

        let regexpStr = ``;
    
    }
    function validate() {

        let value = _autoRef.current.getFormatted();
        if (required) {
            if (value) {
                _valid.current = true
            }
            else {
                _valid.current = false;
                console.log(_valid)
                return;
            }
        }
        else {
            _valid.current = true
        }
    }
    function internalOnBlur(evt) {

        validate();
        if (_valid.current) {
            setError(false);
        }
        else {
            setError(true);
            _input.current.focus();
        }
        if (onBlur) {
            onBlur(evt);
        }
    }
    function internalOnFocus(evt) {
        //setError(false);
        if (onFocus) {
            onFocus(evt);
        }
    }
    
    function internalOnKeyDown(evt){
        if(evt.key === "Tab"){
            //console.log("FNumField Tab...")
            validate();
            if(!_valid.current){
                evt.preventDefault();
            }
            else{
                if(onTab){
                    onTab(evt);
                }
            }
        }
        if (onKeyDown) {
            onKeyDown(evt);
        }
    }

    return (
        <TextField
            value={value}
            label={label}
            required={required}
            error={error}
            onKeyDown={internalOnKeyDown}
            onFocus={internalOnFocus}
            onBlur={internalOnBlur}
            inputRef={_input}
            ref={ref}
            InputLabelProps={{ shrink: true, style: { fontWeight: "bold", fontSize: "1.1em" } }}
            disabled={formContext.disabled}
            inputProps={{
                className: classes.textField,
                ...inputProps,
              }}
            {...otherProps} />
    )
}));

export const FAmountField = React.forwardRef((props, ref) => <FinAmountField ref={ref} {...props} />)

FAmountField.propTypes = {

    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    inputProps: PropTypes.object,
    InputProps: PropTypes.object,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    allowNegetive: PropTypes.bool,
    value: PropTypes.any,
    helperText: PropTypes.string,
    autoFocus: PropTypes.bool,
    /**
    * Defines the current user action 
    */
    //mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    size: PropTypes.oneOf(["medium", "small"]),
    variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
    onTab:PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
}

FAmountField.defaultProps = {
    //mode: Mode.VIEW,
    variant: "outlined",
    size: "small",
    allowNegetive: true
}
