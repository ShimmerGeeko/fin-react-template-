import React, { useRef, useState, useImperativeHandle, useContext } from 'react'
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardDatePickerProps } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';
import {FormContext} from './FCanvas';
//import { Mode } from '../helpers/Mode';

const FinFDateField = React.memo(React.forwardRef((props, ref) => {

    const { 
            onError, onBlur,value,disabled, label,onValidate,required,displayError,onTab,onKeyDown,  ...otherProps } = props;
    const [error, setError] = useState(false);
    const _input = useRef(null)
    const _valid = useRef(true);
    const errorCode=useRef(null);
    
    const formContext = useContext(FormContext);
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
  
    function internalOnError(e, val) {

        if (onError) {
            onError(e, val)
        }
    }

    function validate(){

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
        errorCode.current = _valid.current ? null : "error_required";
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
        };

    }

    function internalonKeyDown(evt){

        let validationResult;
        if(evt.key === "Tab"){
            validationResult = validate();
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
    
    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                required={required}
                label={label}
                error={error}
                InputAdornmentProps={{ position: "end" }}
                InputLabelProps={{ shrink: true}}
                onError={internalOnError}
                onKeyDown={internalonKeyDown}
                //inputProps={{readOnly: formContext.disabled, tabIndex: formContext.disabled ? -1 : 0}}
                KeyboardButtonProps={{hidden: _disabled}}
                disabled={_disabled}
                {...otherProps}
                inputRef={_input}
                ref={ref}
                value={value? value : null}
            />
        </MuiPickersUtilsProvider>

    )

}))

export const FDateField = React.forwardRef((props, ref) => <FinFDateField ref={ref} {...props} />)

FDateField.propTypes = {

    /**
    * Defines the current user action 
    */
   // mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    required: PropTypes.bool,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    disableFuture: PropTypes.bool,
    disablePast: PropTypes.bool,
    disableToolbar: PropTypes.bool,
    emptyLabel: PropTypes.string,
    initialFocusedDate: PropTypes.string,
    inputVariant: PropTypes.oneOf(["standard", "outlined", "filled"]),
    invalidDateMessage: PropTypes.string,
    invalidLabel: PropTypes.string,
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    maxDate: PropTypes.objectOf(Date),
    maxDateMessage: PropTypes.string,
    minDate: PropTypes.objectOf(Date),
    minDateMessage: PropTypes.string,
    readOnly: PropTypes.bool,
    variant: PropTypes.oneOf(["dialog", "inline", "static"]),
    value: PropTypes.objectOf(Date),
    onOpen: PropTypes.func,
    onError: PropTypes.func,
    onAccept: PropTypes.func,
    onClose: PropTypes.func,
    onChange: PropTypes.func


}
FDateField.defaultProps = {
  //  mode: Mode.VIEW,
    format: "dd/MM/yyyy",
    onChange: (value) => { },
    inputVariant: "outlined",
    size: "small"
}