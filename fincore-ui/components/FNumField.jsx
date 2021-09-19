import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useImperativeHandle, useState, useContext } from 'react'
import AutoNumeric from 'autonumeric';
import PropTypes from 'prop-types';
import {FormContext} from './FCanvas';
import ErrorIcon from '@material-ui/icons/ErrorOutline';


const FinNumField = React.memo(React.forwardRef((props, ref) => {

    const {
        value,
        label,
        required,
        onBlur,
        onTab,
        onFocus,
        onKeyDown,
        length,
        decimalLength,
        onValidate,
        disabled,
        ...otherProps
    } = props;

    const _input = useRef(null)
    const _valid = useRef(true);
    const _length = useRef(13);
    const _decimalLength= useRef(0);
    const _autoRef = useRef(null);
    const [error, setError] = useState(false);
    const formContext = useContext(FormContext);
    const errorCode=useRef(null);
    const _disabled = disabled ? disabled : formContext.disabled;
    
    useImperativeHandle(ref, () => {
        return {
            isValid: () => _valid.current,
            input: _input.current,
            disable: () => {_input.current.disabled=true},
            enable: () => {_input.current.disabled=false},
            setError: () => {setError(true)},
            removeError: () => {setError(false)},
            focus: () => {
                setTimeout(() => {
                    console.log("focus result")
                    _input.current.focus();
                }, 10);
            },
            validate: () => {return validate()},
            clear: () => {setError(false)},
            label: label
        }
    })

    useEffect(() => {

        const options = {
            digitGroupSeparator: "",
            selectOnFocus: true
        }
        if(decimalLength){
            _decimalLength.current = decimalLength;
        }
        options.decimalPlaces = _decimalLength.current;
       
        let vMax = '';
        if(length){

            _length.current = length - _decimalLength.current;
            
           for(let i =0; i < _length.current; i++){
               vMax = vMax.concat("9");
           }
           options.vMax = vMax;
        }
        _autoRef.current = new AutoNumeric(_input.current, options);
    }, []);

    useEffect(() => {
        
        if(props.value){
            AutoNumeric.set(_input.current, props.value);
            
        }
        else{
            AutoNumeric.set(_input.current, "");
        }
        if(error){
            setError(false);
        }
        
    }, [props.value])
    

    

    function getPattern() {

        let regexpStr = ``;
        if (length && decimalLength && decimalLength > 0) {

            const updatedLength = length - decimalLength;
            regexpStr = `^\\d{0,${updatedLength}}(\\.\\d{0,${decimalLength}})?$`;
        }
        else {
            regexpStr = `^\\d{0,}$`;
        }
        const regexp = new RegExp(regexpStr);
        return regexp;
    }
    function validate(){
        console.log("FNumField: calling validate");
        let value = _autoRef.current.getFormatted();
        if (required) {
            if (value) {
                _valid.current = true
            }
            else {
                _valid.current = false;
                errorCode.current = "error_required";
                setError(true);
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
            errorCode.current = null;
        }
        const regEx = getPattern();
        _valid.current =  regEx.test(value);
        errorCode.current = _valid.current ? null : "error_invalid_format";
        if(_valid.current){

            if(error){
                setError(false);
            }
        }
        else{
            setError(true)
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
    function internalOnBlur(evt) {  
        
        //console.log("FNumField onBlur")
        //validate();
        if (onBlur) {
            //console.log("FNumField onBlur")
            onBlur(evt);
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
    function internalOnFocus(evt){
        if(onFocus){
            onFocus(evt);
        }
    }
    

    return (
        <TextField
            value={value}
            label={label}
            required={required}
            error = {error}
            onFocus={internalOnFocus}
            onBlur={internalOnBlur}
            onKeyDown={internalOnKeyDown}
            inputRef={_input}
            disabled={_disabled}
            //inputProps={{readOnly: formContext.disabled, tabIndex: formContext.disabled ? -1 : 0}}
            InputProps={{
                endAdornment: error?<InputAdornment position="end"><ErrorIcon color="error"/></InputAdornment>: null
            }}
            //helperText={helperMessage}
           // ref={ref}
            InputLabelProps={{ shrink: true }}
            //inputProps={{style: {fontSize: 15}}}
            //disabled={formContext.disabled}
            {...otherProps} />
    )
}));

export const FNumField = React.forwardRef((props, ref) => <FinNumField ref={ref} {...props}/>)

FNumField.propTypes = {

    classes: PropTypes.object,
    color: PropTypes.oneOf(["primary", "secondary"]),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    inputProps: PropTypes.object,
    InputProps: PropTypes.object,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    length: PropTypes.number,
    decimalLength: PropTypes.number,
    value:PropTypes.any,
    helperText: PropTypes.string,
    autoFocus: PropTypes.bool,
    /**
    * Defines the current user action 
    */
    //mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    size: PropTypes.oneOf(["medium", "small"]),
    variant: PropTypes.oneOf(["standard", "filled", "outlined"]),

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onValidate: PropTypes.func,
    onTab: PropTypes.func
}

FNumField.defaultProps = {
    //mode: Mode.VIEW,
    variant: "outlined",
    size: "small"
}
