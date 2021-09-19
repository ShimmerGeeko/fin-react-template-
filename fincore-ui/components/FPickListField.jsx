import React, {
    Fragment,
    useState, useEffect, useRef, useImperativeHandle, useContext
} from 'react';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import { FStrField } from './FStrField';
import ArrowRightOutlined from '@material-ui/icons/ArrowRightOutlined';
import { TextField, makeStyles } from '@material-ui/core';
import MaterialTable from 'material-table';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { FormContext } from './FCanvas';
import { trackPromise } from 'react-promise-tracker';



const useStyles = makeStyles({

    close: {
        margin: 2
    },
    paper: {
       // maxHeight: 400,
        overflow: 'auto',
        border: '1px solid blue',
        //minWidth: 200

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
});



const FinPickListField
    = React.memo(React.forwardRef((props, ref) => {

        const {
            onTab,
            onBlur,
            onChange,
            required,
            variant,
            tableName,
            pickListName,
            pickListArgs,
            dbConnName,
            addMode,
            descriptionVisible,
            searchWindow,
            value,
            disabled,
            format,
            label,
            descLabel,
            pickIdPlaceholder,
            descPlaceHolder,
            size,
            keyGridSize,
            descGridSize,
            keyFullWidth,
            descFullWidth,
            onValidate,
            length
        } = props;


        //  const [anchorEl, setAnchorEL] = useState(null);
        const [element, setElement] = useState(null);
        const [pickId, setPickId] = useState(value);
        const [pickDesc, setPickDesc] = useState("");
        //  const [error, setError] = useState(false);
        const [showSearchWindow, setShowSearchWindow] = useState(false);
        const [pickListData, setPickListData] = useState(undefined);
        const formContext = useContext(FormContext);

        let pickFieldRef = useRef(null);
        let shouldInvokeApiOnTab = useRef(true);
        //   let callInProgress = useRef(false);
        const selectedData = useRef(null);

        let displayRef = useRef(null)

        const CONTROLS_API_URL = useRef("");
        const isValid = useRef(false);

        let data = { pickId: undefined };
        const _disabled = disabled ? disabled : formContext.disabled;
        const pagenation = {
            totalPages: 0,
            currentPage: 0
        }

        useImperativeHandle(ref, () => {
            return {
                value: () => {
                    return {
                        pickId,
                        pickDescription: pickDesc,
                        props: {
                            ...props
                        }
                    }
                },
                validate: () => { return validate() },
                input: pickFieldRef.current,
                focus: () => {
                    pickFieldRef.current.focus()
                },
                label: label,
                selectedRecord: () => {
                    return selectedData.current;
                },
                clear: () => {
                    pickFieldRef.current.removeError();
                }

            }
        });
        useEffect(() => {
            CONTROLS_API_URL.current = process.env.REACT_APP_CONTROLS_API_URL || undefined;

        }, [])
        useEffect(() => {

            if (!addMode) {
                if (value) {

                    let pickId = value;

                    onLoadfetchListCheckInitPicklistDB(pickId, (result) => {

                        const { PiclistOrder, DictOne } = result;
                        const PicklistTBOrderArr = PiclistOrder.split(",");
                        setPickId(DictOne[PicklistTBOrderArr[0].trim()]);
                        setPickDesc(DictOne[PicklistTBOrderArr[1].trim()]);
                        selectedData.current = DictOne;
                        isValid.current = true;


                    }, (error) => {

                        isValid.current = false;
                        setPickId("");
                        setPickDesc("");
                        pickFieldRef.current.input.focus();
                        if (error !== null) {
                            //alert("Network error");
                        }
                    })
                }
            }

        }, [])
        useEffect(() => {

            if (pickId) {
                const result = validate();
                if (result.isValid) {
                    pickFieldRef.current.removeError();
                }
                else {
                    pickFieldRef.current.setError();
                }
            }
            raiseResultChangeEvent();
        }, [pickId])

        useEffect(() => {
            if (!addMode) {

                if (value && value !== pickId) {

                    const pickId = value;
                    onLoadfetchListCheckInitPicklistDB(pickId, (result) => {

                        const { PiclistOrder, DictOne } = result;
                        const PicklistTBOrderArr = PiclistOrder.split(",");
                        setPickId(DictOne[PicklistTBOrderArr[0].trim()]);
                        setPickDesc(DictOne[PicklistTBOrderArr[1].trim()]);
                        selectedData.current = DictOne;
                        isValid.current = true;
                        shouldInvokeApiOnTab.current = false;


                    }, (error) => {

                        isValid.current = false;
                        setPickId("");
                        setPickDesc("");
                        pickFieldRef.current.input.focus();
                        if (error !== null) {
                            //alert("Network error");
                        }
                    })
                }

                if (!value) {
                    // console.log("calling !value")
                    setPickId("");
                    setPickDesc("");
                    pickFieldRef.current.removeError();

                }
            }
            else {
                if (value !== pickId && value !== undefined) {
                    setPickId(value);
                }
            }
        }, [value])



        const onLoadfetchListCheckInitPicklistDB = async (pickId, success, error) => {
            try {
                const url = CONTROLS_API_URL.current + "ListCheckInitPicklistDB";
                //const { tableName, pickListName, pickListArgs, dbConnName } = this.props;
                const data = {
                    TableName: tableName,
                    PicklistName: pickListName,
                    ParamArr: pickListArgs,
                    TBVal: pickId.toString(),
                    DbConnName: dbConnName,
                    KeyVal: pickId.toString()
                }

                let response = await trackPromise(Axios.post(url, data));
                const result = await response.data;
                if (result === null) {
                    error(result);
                }
                else {
                    success(result)
                }

            }
            catch (ex) {
                error(ex);
            }

        }

        function validate() {

            if (required) {
                const validationResult = pickFieldRef.current.validate();
                console.log("PickList", validationResult);
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

        const fetchListGetInitPicklistDB = async (success, error) => {

            try {
                const url = CONTROLS_API_URL.current + "ListGetInitPicklistDB?tot=" + pagenation.totalPages;
                //const { tableName, pickListName, pickListArgs, dbConnName } = this.props;
                const data = {
                    TableName: tableName,
                    PicklistName: pickListName,
                    ParamArr: pickListArgs,
                    TBVal: pickFieldRef.current.value,
                    DbConnName: dbConnName,
                    Pagen: pagenation.currentPage
                }
                let response = await trackPromise(Axios.post(url, data));
                const result = await response.data;
                success(result);
            }
            catch (ex) {
                error(ex);
            }
        }

        const searchOnF2 = () => {
            if (!addMode) {

                setPickListData(undefined);
                fetchListGetInitPicklistDB((result) => {



                    //setAnchorEL(pickFieldRef);
                    setElement(pickFieldRef.current);
                    setPickListData(result);

                    setTimeout(() => {
                        console.log("setElement", element);
                    }, 1000)



                }, (ex) => {
                    console.log(ex);
                });
            }
        }

        const onSearchKeyDown = (evt, validationResult) => {

            if (evt.key === "F2") {

                if (evt.shiftKey) {
                    if (!searchWindow) {
                        alert("No Advance Search Avaialbale");
                    }
                    else {
                        setShowSearchWindow(true);
                    }

                    return;
                }
                else {
                    searchOnF2();
                }
            }
            if (evt.key === "Tab") {
                if (validationResult && onValidate) {
                    onValidate(validationResult);
                }
                searchOnTab(evt);
            }
        }
        const fetchListCheckInitPicklistDB = async (success, error) => {

            if (pickId) {
                try {
                    const url = CONTROLS_API_URL.current + "ListCheckInitPicklistDB";
                    //const { tableName, pickListName, pickListArgs, dbConnName } = this.props;
                    const data = {
                        TableName: tableName,
                        PicklistName: pickListName,
                        ParamArr: pickListArgs,
                        TBVal: pickId.toString(),
                        DbConnName: dbConnName,
                        KeyVal: pickId.toString()
                    }

                    let response = await trackPromise(Axios.post(url, data));
                    const result = response.data;
                    if (!result || result === null || result === '') {
                        error(result);
                    }
                    else {
                        success(result)
                    }
                }
                catch (ex) {
                    console.log("PickList Error", ex);
                    error(ex);
                }

            }
        }
        const searchOnTab = (event) => {
            const pickIdVal = pickId;

            if (addMode) {

                const result = validate();
                if (result.isValid) {
                    pickFieldRef.current.removeError();
                    if (onTab) {
                        onTab(selectedData.current);
                    }
                }
                else {
                    pickFieldRef.current.setError();
                    event.preventDefault();
                }
                return;
            }

            if (!addMode && !required && !pickIdVal) {
                return;
            }

            if (pickIdVal && pickIdVal !== "") {

                if (shouldInvokeApiOnTab.current === true) {
                    fetchListCheckInitPicklistDB((result) => {

                        console.log("selectedRow", result);
                        const { PiclistOrder, DictOne } = result;
                        const PicklistTBOrderArr = PiclistOrder.split(",");

                        if (DictOne[PicklistTBOrderArr[0]]) {
                            setPickId(DictOne[PicklistTBOrderArr[0].trim()]);
                        }

                        if (PicklistTBOrderArr.length === 1) {
                            if (DictOne[PicklistTBOrderArr[0].trim()]) {
                                setPickDesc(DictOne[PicklistTBOrderArr[0].trim()])
                            }
                        }
                        else {
                            if (DictOne[PicklistTBOrderArr[1].trim()]) {
                                setPickDesc(DictOne[PicklistTBOrderArr[1].trim()])
                            }
                        }

                        selectedData.current = DictOne;
                        isValid.current = true;
                        pickFieldRef.current.removeError();
                        if (onTab) {
                            onTab(selectedData.current);
                        }
                    }, (error) => {

                        isValid.current = false;
                        setPickDesc("");
                        //setError(true);
                        pickFieldRef.current.setError();
                        pickFieldRef.current.focus();

                    });
                }
                else{
                    if (onTab) {
                        onTab(selectedData.current);
                    }
                }
            }
            else {
                pickFieldRef.current.setError();
                event.preventDefault();
            }
        }

        const onPickIdChange = (evt) => {

            setPickId(evt.target.value);
            setPickDesc("");
            isValid.current = false;
            shouldInvokeApiOnTab.current = true;
        };
        const onPickIdBlur = (evt) => {

            if (onBlur) {
                onBlur(evt, selectedData.current);
            }

        };
        const onItemSelect = (evt, selectedRow) => {

            console.log("selectedRow", pickListData)
            if (pickListData) {
                const { PiclistOrder } = pickListData;
                const PiclistOrderArr = PiclistOrder.split(",");
                console.log("selectedRow", selectedRow)
                setPickId(selectedRow[PiclistOrderArr[0]]);
                if (descriptionVisible) {

                    if (PiclistOrderArr.length === 1) {
                        setPickDesc(selectedRow[PiclistOrderArr[0]])
                    }
                    else {
                        setPickDesc(selectedRow[PiclistOrderArr[1]])
                    }

                }
                selectedData.current = selectedRow;
                shouldInvokeApiOnTab.current = false;
                setElement(null);
            }
        }
        const generateList = () => {

            if (pickListData) {

                const { PicklistHeader, PickDt, PiclistOrder } = pickListData;
                //Array
                const headers = PicklistHeader.split(",");
                const columns = [];

                const fields = PiclistOrder.split(",");

                // for (const header of headers) {
                //     columns.push({ title: header, field: header });
                // }
                for (let index = 0; index < headers.length; index++) {
                    columns.push({ title: headers[index], field: fields[index].trim() });
                }

                return (
                    <MaterialTable
                        title=""
                        isLoading={!pickListData}
                        columns={columns}
                        data={PickDt}
                        options={{
                            sorting: true,
                           // filtering: true,
                            pageSize: 5,
                            search: true,
                            searchFieldAlignment: 'left',
                            headerStyle: {
                                backgroundColor: '#01579b',
                                color: '#FFF'
                            },
                            // rowStyle: (arg, index) => {
                            //     return index % 2 == 0 ? {backgroundColor: 'aliceblue'}: {backgroundColor: 'beige'} 
                            // } 

                        }}
                        onRowClick={onItemSelect}
                        // actions={[
                        //     {
                        //         icon: 'add',
                        //         tooltip: 'Select',
                        //         onClick: onItemSelect
                        //     }
                        // ]}

                    />
                )

            }
        }
        const closePopover = () => {
            //f2active = false;
            setElement(null);
        }

        const open = Boolean(element);
        const list = generateList();
        const classes = useStyles();

        const raiseResultChangeEvent = () => {
            data.pickId = pickId;
            data.pickDescription = pickDesc;

            if (onChange) {
                onChange({
                    pickId: pickId,
                    pickDescription: pickDesc ? (typeof pickDesc === 'number' ? pickDesc : pickDesc.trim()) : undefined
                });
            }
        }

        return (
            <Fragment>
                <Grid container item xs={12} spacing={0} alignItems="center">
                    <Grid item xs={keyGridSize}>
                        <FStrField
                            variant={variant}
                            label={label}
                            placeholder={pickIdPlaceholder}
                            required={required}
                            onKeyDown={onSearchKeyDown}
                            ref={pickFieldRef}
                            value={pickId}
                            onChange={onPickIdChange}
                            onBlur={onPickIdBlur}
                            disabled={_disabled}
                            fullWidth={keyFullWidth}
                            format={format}
                            size={size}
                            displayError={false}
                            length={length}
                        />
                    </Grid>
                    {descriptionVisible ? <Grid item>
                        <ArrowRightOutlined color="primary" />
                    </Grid> : null}
                    {descriptionVisible ? <Grid item xs={descGridSize}>

                        <TextField
                            variant={variant}
                            //required={required && addMode}
                            label={descLabel}
                            placeholder={descPlaceHolder}
                            inputProps={{ readOnly: true, tabIndex: -1 }}
                            value={pickDesc}
                            //onChange={onDescChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={_disabled}
                            inputRef={displayRef}
                            size={size}
                            fullWidth={descFullWidth}
                        />
                    </Grid> : null}
                    <Popover
                        anchorEl={element}
                        open={open}
                        onClose={closePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <Paper>
                            {list}
                        </Paper>
                    </Popover>
                </Grid>
            </Fragment>
        );

    }));

export const FPickListField = React.forwardRef((props, ref) => <FinPickListField ref={ref} {...props} />)

FPickListField.propTypes = {

    label: PropTypes.string,
    pickIdPlaceholder: PropTypes.string,
    descLabel: PropTypes.string,
    descPlaceHolder: PropTypes.string,
    onTab: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    variant: PropTypes.oneOf(["filled", "standard", "outlined"]),
    tableName: PropTypes.string,
    pickListName: PropTypes.string,
    pickListArgs: PropTypes.string,
    dbConnName: PropTypes.string,
    addMode: PropTypes.bool,
    descriptionVisible: PropTypes.bool,
    classes: PropTypes.any,
    data: PropTypes.object,
    searchWindow: PropTypes.any,
    value: PropTypes.any,
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
    onValidate: PropTypes.func
}

FPickListField.defaultProps = {
    variant: "outlined",
    descriptionVisible: true,
    pickIdLabel: "Pick ID",
    //descLabel: "Description",
    size: "small",
    keyGridSize: 4,
    descGridSize: 6,
    keyFullWidth: true,
    descFullWidth: true
}