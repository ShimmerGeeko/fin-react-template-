import React, { useState, useCallback, useRef, useEffect, useImperativeHandle, Fragment, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { TextField, Paper, Typography } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import MaterialTable from 'material-table';
import ArrowRightOutlined from '@material-ui/icons/ArrowRightOutlined';
import { FStrField, FStrFormat } from './FStrField';
import PropTypes from 'prop-types';
import { trackPromise } from 'react-promise-tracker';
import { FormContext } from './FCanvas';

export class FLookupFieldResult {
    lookupId = "";
    lookupDescription = ""

}

const useStyles = makeStyles(theme => ({
    list: {
        minWidth: 100,
        maxWidth: 200,
        border: '1px solid darkblue',
        //padding: 2,
        //margin: 2
    },
    close: {
        margin: 2
    },
    paper: {
        maxHeight: 200,
        overflow: 'auto',
    },
    label: {

        backgroundColor: 'lightblue',
        margin: 2,
        border: '1px solid blue'

    },
    input: {
        height: 25,
        width: 150
    }
}));

let CONTROLS_API_URL = "";
const FinLookupField = React.memo(React.forwardRef((props, ref) => {


    const {
        label,
        lookupIdPlaceholder,
        descriptionLabel,
        descriptionPlaceholder,
        codeType,
        required,
        descriptionVisible,
        mode,
        format,
        size,
        keyGridSize,
        keyFullWidth,
        descGridSize,
        descFullWidth,
        addMode,
        onChange,
        onError,
        onValidate,
        onBlur,
        onTab,
        disabled
    } = props;

    // console.log("FinLookupField");
    const classes = useStyles();
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    //const [open, setOpen] = useState(false);
    const [pFieldValue, setPFieldValue] = useState("");
    const [sFieldValue, setSFieldValue] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [placement, setPlacement] = useState("bottom-start");
    const [disablePortal, setDisablePortal] = useState(false);
    const formContext = useContext(FormContext);

    const keyRef = useRef(null);
    const displayRef = useRef(null);
    const shouldInvokeApiOnTab = useRef(true);
    const selectedData = useRef(null);
    const _disabled = disabled ? disabled : formContext.disabled;
    const isFirstRender = useRef(true);


    useImperativeHandle(ref, () => {
        //  console.log("lookup imperative")
        return {
            idRef: keyRef.current.input,
            descRef: displayRef.current,
            value: () => {
                return {
                    lookupId: pFieldValue,
                    lookupDescription: sFieldValue,
                    props: {
                        ...props
                    }
                }
            },
            focus: () => { keyRef.current.focus() },
            validate: () => { return validate() },
            label: label,
            selectedRecord: () => {
                return selectedData;
            },
            clear: () => {
                keyRef.current.removeError();
            }
        }
    })
    useEffect(() => {
        CONTROLS_API_URL = process.env.REACT_APP_CONTROLS_API_URL || undefined;
    }, []);

    useEffect(async () => {
        console.log("value updated", props.value);
        if (props.value && props.value != pFieldValue) {
            try {
                //setPFieldValue(props.value);
                const result = await fetchDataCheckInitLookup(props.value);
                if (result) {

                    setPFieldValue(props.value);
                    setSFieldValue(result.LookupDescriprionDb);
                    selectedData.current = result;
                    setError(false);
                    shouldInvokeApiOnTab.current = false;
                }
                else {

                }

                console.log(result);
            }
            catch (error) {

                setPFieldValue(props.value);
                setSFieldValue("");
                setError(true);
                //console.log(keyRef.current);
                keyRef.current.input.focus();
                if (onError) {
                    onError(error);
                }
                if (onChange) {
                    onChange({
                        lookupId: pFieldValue,
                        lookupDescription: sFieldValue,
                        props: {
                            ...props
                        }
                    });
                }
            }
        }
        else {

            if (!props.value) {
                setPFieldValue("");
                setSFieldValue("");
            }

        }
    }, [props.value])

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!isFirstRender.current) {

            if (onChange) {
                onChange({
                    lookupId: pFieldValue,
                    lookupDescription: sFieldValue,
                    props: {
                        ...props
                    }
                });
            }

            if (pFieldValue) {
                const result = validate();
                if (result.isValid) {
                    keyRef.current.removeError();
                }
            }

        }

    }, [pFieldValue, sFieldValue])

   


    function fetchDataGetInitLookup() {
        return new Promise(async (resolve, reject) => {

            try {
                const { organizationId, codeType, lookupTableName } = props;
                const url = CONTROLS_API_URL + "ListGetInitLookup";

                const data = {
                    OrgId: organizationId,
                    LookupCode: codeType,
                    LkTableName: lookupTableName
                }
                console.log(url, data);
                const response = await trackPromise(axios.post(url, data));
                console.log("response", response)
                const result = response.data;
                resolve(result);
            }
            catch (ex) {
                reject(ex);
            }
        })
    }
    const fetchDataCheckInitLookup = (value, success, error) => {

        return new Promise(async (resolve, reject) => {

            const lookupId = value ? value.toString() : pFieldValue.toString()
            try {
                const { organizationId, codeType, lookupTableName } = props;
                const url = CONTROLS_API_URL + "ListCheckInitLookup";
                const data = {

                    LookupId: lookupId,
                    OrgId: organizationId,
                    LookupCode: codeType,
                    LkTableName: lookupTableName
                }
                const response = await trackPromise(axios.post(url, data));
                const result = response.data;
                resolve(result);

            } catch (ex) {
                reject(ex);
            }

        });
    }


    const lookupId_onKeyDown = async (event, validationResult) => {

        if (event.key === "F2" && !addMode) {
            try {

                const result = await fetchDataGetInitLookup();
                setData(result);
                setAnchorEl(keyRef.current)
                //setAnchorEl(displayRef.current);
               

            } catch (ex) {

                if (onError) {
                    onError(ex)
                }

            }

        }
        if(event.key === "Tab" && addMode){

            const result = validate();
            if(result.isValid){
                keyRef.current.removeError();
            }
            else{
                keyRef.current.setError();
                event.preventDefault();
            }
            
            return;
        }
        if(event.key === "Tab" && addMode){
            const result = validate();
            if(result.isValid){
                keyRef.current.removeError();
            }else{
                keyRef.current.setError();
                event.preventDefault();
            }
            return;
        }
        if (event.key === "Tab" && !addMode) {

            if (validationResult && onValidate) {
                onValidate(validationResult);
            }

            if(shouldInvokeApiOnTab.current === false){
                if (onTab) {
                    onTab(selectedData.current);
                }
                return;
            }

            if (pFieldValue) {

                try {
                    const result = await fetchDataCheckInitLookup();
                    if (result) {

                        setPFieldValue(result.LookupIDDb);
                        setSFieldValue(result.LookupDescriprionDb);
                        selectedData.current = result;
                        keyRef.current.removeError();
                        if (onChange) {

                            onChange({
                                lookupId: pFieldValue,
                                lookupDescription: sFieldValue,
                                props: {
                                    ...props
                                }
                            });
                           
                            
                        }
                        if(onTab){
                            onTab(selectedData.current);
                        }
                    }
                    else {

                        setSFieldValue("");
                        keyRef.current.focus();
                        keyRef.current.setError();
                        if (onError) {
                            onError();
                        }
                        
                    }

                } catch (ex) {
                    setSFieldValue("");
                    keyRef.current.focus();
                    keyRef.current.setError();
                    if (onError) {
                        onError(ex);
                    }
                }
            }
            else {

                keyRef.current.setError();
                event.preventDefault();

            }
        }

    }

    function validate() {

        if (required) {
            const validationResult = keyRef.current.validate();
            console.log("Lookup", validationResult)
            if (onValidate) {
                onValidate(validationResult)
            }
            return validationResult;
        }
        let result = {
            isValid: true,
            errorCode: null
        };
        if (onValidate) {
            onValidate(result);
        }
        return result;
    }
    const lookupId_onBlur = (evt) => {
        // console.log("onBlur...");
        // validate();

        // if(onBlur){
        //     onBlur(evt)
        // }
    }
    const lookupId_onChange = (evt) => {

        setPFieldValue(evt.target.value);
        setSFieldValue("");
        setError(false);
        shouldInvokeApiOnTab.current = true;
    }
    
    const rowSelect = (evt, selectedRow) => {

        setPFieldValue(selectedRow["LookupIDDb"]);
        setSFieldValue(selectedRow["LookupDescriprionDb"]);
        selectedData.current = selectedRow;
        shouldInvokeApiOnTab.current = false;
        closePopover();
    }
    const closePopover = () => {

        setAnchorEl(null);
    }
    const generateList = () => {
        if (data) {
            return (
                <MaterialTable
                    title="Lookup"
                    columns={[
                        { title: label, field: "LookupIDDb" },
                        { title: descriptionLabel, field: "LookupDescriprionDb" },
                    ]}
                    data={data}
                    onRowClick={rowSelect}
                />
            )
        }
    }

    const open = Boolean(anchorEl);
    return (
        <Fragment>
            <Grid container spacing={0} style={{ alignItems: 'center' }}>
                <Grid item xs={keyGridSize}>
                    <FStrField
                        required={required}
                        variant="outlined"
                        placeholder={lookupIdPlaceholder}
                        label={label}
                        value={pFieldValue}
                        onKeyDown={lookupId_onKeyDown}
                        //inputRef={ref => { anchorRef.current = ref }}
                        ref={keyRef}
                        onBlur={lookupId_onBlur}
                        onChange={lookupId_onChange}
                        InputLabelProps={{ shrink: true, style: {} }}
                        format={format}
                        size={size}
                        fullWidth={keyFullWidth}
                        displayError={false} 
                        disabled={_disabled}/>
                </Grid>
                {descriptionVisible ? <Grid item>
                    <ArrowRightOutlined color="secondary" />
                </Grid> : null}
                {descriptionVisible ? <Grid item xs={descGridSize} hidden={!descriptionVisible}>
                    <TextField
                        //required={required && addMode}
                        variant="outlined"
                        inputProps={{ readOnly: true, tabIndex: -1 }}
                        label={descriptionLabel}
                        placeholder={descriptionPlaceholder}
                        value={sFieldValue}
                        //onChange={desc_onChange}
                        InputLabelProps={{ shrink: true }}
                        disabled={_disabled}
                        inputRef={displayRef}
                        //onBlur={desc_onBlur}
                        size={size}
                        fullWidth={descFullWidth}
                    />
                </Grid> : null}
            </Grid>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={closePopover}>
                <Paper >
                    <Paper  >
                        {generateList()}
                    </Paper>
                    <Paper>
                        <Typography className={classes.label} align='center' color='primary'>{codeType}</Typography>
                    </Paper>
                </Paper>
            </Popover>
        </Fragment>
    )

}));

export const FLookupField = React.forwardRef((props, ref) => <FinLookupField ref={ref} {...props} />)

FLookupField.propTypes = {

    addMode: PropTypes.bool,
    organizationId: PropTypes.number,
    dbConnName: PropTypes.string,
    codeType: PropTypes.number,

    lookupId: PropTypes.any,
    data: PropTypes.objectOf(FLookupFieldResult),

    description: PropTypes.string,
    label: PropTypes.string,
    descriptionLabel: PropTypes.string,
    lookupIdPlaceholder: PropTypes.string,
    descriptionPlaceholder: PropTypes.string,
    descriptionVisible: PropTypes.bool,

    lookupTableName: PropTypes.string,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    required: PropTypes.bool,
    classes: PropTypes.any,
    dataRef: PropTypes.func,

    value: PropTypes.any,
    disabled: PropTypes.bool,
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
    size: PropTypes.oneOf(["medium", "small"]),
    keyGridSize: PropTypes.number,
    descGridSize: PropTypes.number,
    keyFullWidth: PropTypes.bool,
    descFullWidth: PropTypes.bool,
    onBlur: PropTypes.func
}

FLookupField.defaultProps = {

    descriptionVisible: true,
    dbConnName: "",
    lookupTableName: "",
    onChange: () => { },
    onError: () => { },
    required: false,
    addMode: false,
    format: FStrFormat.type_x,
    size: "small",
    size: "small",
    keyGridSize: 4,
    descGridSize: 6,
    keyFullWidth: true,
    descFullWidth: true
}