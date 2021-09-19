
import React, { useEffect, useRef, useState, useImperativeHandle, useCallback, useContext } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import {FormContext} from './FCanvas';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import { FormatListNumberedRtlOutlined } from '@material-ui/icons';
//import { Mode } from '../helpers/Mode';


export const FStrFormat = {

    type_x: "type_x",
    type_aN: "type_aN",
    type_N: "type_N",
    //uppercase
    type_ANC: "type_ANC",
    type_GSTIN: "type_GSTIN",
    type_IFSCCode: "type_IFSCCode",
    type_PanNo: "type_PanNo",
    type_XC: "type_XC",
    type_AC: "type_AC",
    type_Name: "type_Name",
    type_Name_Space: "type_Name_Space",
    type_Name_Space_Dot: "type_Name_Space_Dot"
}

const capsFormats = [
    "type_ANC",
    "type_GSTIN",
    "type_IFSCCode",
    "type_PanNo",
    "type_XC",
    "type_AC",
    "type_Name",
    "type_Name_Space",
    "type_Name_Space_Dot"
];

const FormatRules = {
    type_x: "",
    type_XC: "[A-Z]",
    type_aN: "^[a-z0-9]*$",
    type_ANC: "^[a-zA-Z0-9]*$",
    type_a: "^[A-Za-z]*$",
    type_AC: "^[a-zA-Z]*$",
    type_Name: "^[a-zA-Z0-9]*[']{0,1}[a-zA-Z0-9]*$",
    type_Name_Space: "^[a-zA-Z0-9 ]*[']{0,1}[a-zA-Z0-9 ]*$",
    type_N: "^[0-9]*$",
    //Validations On Value Changed
    type_PanNo: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    type_IFSCCode: "^[A-Z]{4}[0][a-zA-Z0-9]{6}$",
    type_GSTIN: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    type_Name_Space_Dot: "^[a-zA-Z0-9 ]*[.]{0,1}[a-zA-Z0-9 ]*$",
}

const ErrorCodeMapping = {
    type_x: "error_type_x",
    type_XC: "error_type_XC",
    type_aN: "error_type_aN",
    type_ANC: "error_type_ANC",
    type_a: "error_type_a",
    type_AC: "error_type_AC",
    type_Name: "error_type_Name",
    type_Name_Space: "error_type_Name_Space",
    type_N: "error_type_N",
    //Validations On Value Changed
    type_PanNo: "error_type_PanNo",
    type_IFSCCode: "error_type_IFSCCode",
    type_GSTIN: "error_type_GSTIN",
    type_Name_Space_Dot: "error_type_Name_Space_Dot",
}

const FinStrField = React.memo(React.forwardRef((props, ref) => {

    
    const {
        value,
        label,
        placeholder,
        format,
        required,
        onBlur,
        onTab,
        onChange,
        onKeyDown,
        onFocus,
        onValidate,
        disabled,
        length,
        displayError,
        ...otherProps
    } = props;

    const [error, setError] = useState(false);
    const _input = useRef(null)
    const _valid = useRef(true);
    
    const formContext = useContext(FormContext);
    const errorCode=useRef(null);

    const _disabled = disabled ? disabled : formContext.disabled;

    useImperativeHandle(ref, () => {
       // console.log("imperative")
        return {
            isValid: () => _valid.current,
            input: _input.current,
            disable: () => {_input.current.disabled=true},
            enable: () => {_input.current.disabled=false},
            focus: () => {_input.current.focus()},
            validate: () => {return validate()} ,
            setError: () => {setError(true)},
            removeError: () => {setError(false)},
            clear: () => {setError(false)},
            label: label
        }
    })
    useEffect(() => {

        //console.log("value effect", _input.current.value)
        if (_input.current.value) {
            const capsOn = capsFormats.includes(format);
            _input.current.value = _input.current.value.toUpperCase();
        }

    }, [props.value])


    function internalOnBlur(evt) {

        //validate()
        // if (!_valid.current) {
        //     setError(true);
        //     evt.preventDefault();
        // }
        // else{
        //     setError(false);
        // }
        if (onBlur) {
            onBlur(evt)
        }
    }
    function internalOnFocus(evt) {

        
        if (onFocus) {
           
            onFocus(evt)
        }
    }
    function internalKeyDown(evt) {

        // if(evt.key === "Enter"){
        //     console.log("enter", _input.current.dispatchEvent);
        //     _input.current.dispatchEvent(new KeyboardEvent("keyDown", {
        //         key: "Tab"
        //     }));
        //     return;
        // }
        let validationResult;
        if (format === FStrFormat.type_N) {
            if (evt.keyCode === 37 || evt.keyCode === 39 || evt.keyCode === 46 || evt.keyCode === 8 || evt.keyCode === 9 || (!evt.shiftKey && ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)))) {
                //return;
            }
            else {
                evt.preventDefault();
            }
        }
        if(evt.key === "Tab"){
            validationResult = validate()
            if (!_valid.current) { 
                evt.preventDefault();
            }
            else{
                if(onTab){
                    onTab(evt)
                }
            }
        }
        if (onKeyDown) {
            onKeyDown(evt, validationResult);
        }
    }
    const internalOnChange = useCallback(function(evt) {
        const _evt = { ...evt };
        const capsOn = capsFormats.includes(format);
        if (capsOn) {
            _evt.target.value = _evt.target.value.toUpperCase();
            // console.log("value:", _evt.target.value);
        }
        if (onChange) {
            onChange(_evt);
        }
    }, [props.value]);

    function validate() {

        let value = _input.current.value;
        if (required) {
            if (value) {
                _valid.current = true
            }
            else {
                _valid.current = false
                errorCode.current = "error_required";
                if(displayError){
                     setError(true);
                }
                
                if(onValidate){
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
        if(length){
            
            if(value.length > length){
                _valid.current = false;
                errorCode.current = "error_invalid_length";
                if(displayError){
                    setError(true);
                }
                
                if(onValidate){
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
            else{
                _valid.current = true;
            }
        }
        const validationRule = FormatRules[format];
        const capsOn = capsFormats.includes(format);
        if (capsOn) {
            value = value.toUpperCase();
        }
        const regEx = new RegExp(validationRule);
        const isRegEx = regEx.test(value);
        _valid.current = isRegEx;
        errorCode.current = _valid.current ? null : ErrorCodeMapping[format];
        if(_valid.current){

            if(error){
                if(displayError){
                    setError(false);
                }
                
            }
        }
        else{

            if(displayError){
                setError(true)
            }
            
        }
        if(onValidate){
            onValidate({
                isValid: _valid.current,
                errorCode: errorCode.current
            });
        }
        return {
            isValid: _valid.current,
            errorCode: errorCode.current
        }
    }
   
    return (
       
            <TextField
                value={value}
                label={label}
                error={error}
                placeholder={placeholder}
                required={required}
                onBlur={internalOnBlur}
                onKeyDown={internalKeyDown}
                onFocus={internalOnFocus}
                inputRef={_input}
                InputLabelProps={{ shrink: true}}
                //inputProps={{readOnly: formContext.disabled, tabIndex: formContext.disabled ? -1 : 0}}
                inputProps={{"data-testid": label, maxLength:length}}
                InputProps={{
                    endAdornment: error?<InputAdornment position="end"><ErrorIcon color="error"/></InputAdornment>: null
                }}
                onChange={internalOnChange}
                disabled={_disabled}
                 {...otherProps} 
                />
        
    )

}))

export const FStrField = React.forwardRef((props, ref) => <FinStrField ref={ref} {...props} />)

FStrField.propTypes = {

    /**
    * Defines the current user action 
    */
   // mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    /**
   * Defines the format of the input    */
    format: PropTypes.oneOf([
        "type_x",
        "type_aN",
        "type_N",
        "type_ANC",
        "type_GSTIN",
        "type_IFSCCode",
        "type_PanNo",
        "type_XC",
        "type_AC",
        "type_Name",
        "type_Name_Space",
        "type_Name_Space_Dot"
    ]),
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
    onFocus: PropTypes.func,
    onValidate: PropTypes.func,
    displayError: PropTypes.bool
}

FStrField.defaultProps = {
    // mode: Mode.VIEW,
    format: FStrFormat.type_x,
    variant: "outlined",
    size: "small",
    displayError: true
}
 