import React, { Fragment, PureComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import { TextField, Paper, Typography } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import MaterialTable from 'material-table';
import ArrowRightSharp from '@material-ui/icons/ArrowRightSharp';
import ArrowRightOutlined from '@material-ui/icons/ArrowRightOutlined';
import { FStrField, FStrFormat } from './FStrField';
import PropTypes from 'prop-types';
import { Mode } from '../helpers/Mode';

const styles = theme => ({
    list: {
        minWidth: 300,
        maxWidth: 600,
        border: '2px solid darkblue',
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
});


export class FLookupFieldResult {
    lookupId = "";
    lookupDescription = ""

}
class FinLookupField extends PureComponent {

    state = {
        data: [],
        open: false,
        placement: 'bottom-start',
        disablePortal: false,
        pFieldValue: "",
        sFieldValue: "",
        error: false,
        anchorEl: null,
        isInternalChange: false
    }
    lookupId = null;
    lookupDescription = null;
    data = {};

    CONTROLS_API_URL = "";
    anchorRef = null;
    displayRef = null;

    constructor(props) {

        super(props);
        this.CONTROLS_API_URL = process.env.REACT_APP_CONTROLS_API_URL || undefined;
    }
    componentDidUpdate(prevProps) {

        //console.log("FLookupField componentDidUpdate", this.props.value)
        if (!this.props.addMode && this.props.value && this.props.value != prevProps.value) {

            if (this.props.value) {

                this.state.pFieldValue = this.props.value.toString();
                // if (this.props.data && this.props.data.lookupId) {
                //     this.state.pFieldValue = this.props.data.lookupId;
                // }
                // else {
                //     this.state.pFieldValue = this.props.value;
                // }

                this.fetchDataCheckInitLookup(() => {

                    this.data = {
                        lookupId: this.state.pFieldValue,
                        lookupDescription: this.state.sFieldValue
                    }
                    // this.lookupId = this.state.pFieldValue;
                    // this.lookupDescription = this.state.sFieldValue;

                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                }, (ex) => {
                    if (this.props.onError) {
                        this.props.onError(ex);
                    }
                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                });
            }
        }

        if (this.props.value == "") {
            this.setState({
                pFieldValue: "",
                sFieldValue: ""
            });
        }
    }
    componentDidMount() {

        //console.log("FLookupField componentDidMount")
        if (this.props.dataRef) {
            this.props.dataRef(this.data);
        }
        if (!this.props.addMode) {
            if ((this.props.data && this.props.data.lookupId) || this.props.value) {

                if (this.props.data && this.props.data.lookupId) {
                    this.state.pFieldValue = this.props.data.lookupId.toString();
                }
                else {
                    this.state.pFieldValue = this.props.value.toString();
                }

                this.fetchDataCheckInitLookup(() => {

                    this.data = {
                        lookupId: this.state.pFieldValue,
                        lookupDescription: this.state.sFieldValue
                    }
                    // this.lookupId = this.state.pFieldValue;
                    // this.lookupDescription = this.state.sFieldValue;

                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                }, (ex) => {
                    if (this.props.onError) {
                        this.props.onError(ex);
                    }
                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                });
            }
        }
    }

    fetchDataGetInitLookup = async (success, error) => {

        //console.log("FLookupField fetchDataGetInitLookup")
        try {
            const { organizationId, codeType, lookupTableName } = this.props;
            const url = this.CONTROLS_API_URL + "ListGetInitLookup";

            const data = {
                OrgId: organizationId,
                LookupCode: codeType,
                LkTableName: lookupTableName
            }
            console.log(url, data);
            const response = await axios.post(url, data);
            console.log("respnse", response)
            const result = await response.data;
            this.setState({
                data: result
            });
            success();
        }
        catch (ex) {
            error(ex);
        }
    }
    fetchDataCheckInitLookup = async (success, error) => {

        // console.log("FLookupField fetchDataCheckInitLookup")
        try {
            const { organizationId, codeType, lookupTableName } = this.props;
            const { pFieldValue } = this.state;
            const url = this.CONTROLS_API_URL + "ListCheckInitLookup";
            const data = {

                LookupId: pFieldValue.toString(),
                OrgId: organizationId,
                LookupCode: codeType,
                LkTableName: lookupTableName
            }
            const response = await axios.post(url, data);
            const result = await response.data;
            if (result) {
                this.setState(() => {
                    return {
                        sFieldValue: result.LookupDescriprionDb,
                        error: false
                    };
                }, () => {
                    success()
                })
            }
            else {
                this.setState(() => {
                    return {

                        sFieldValue: "",
                        error: true
                    };
                }, () => {
                    this.anchorRef.input.focus();
                    error()
                })
            }
        } catch (ex) {

            this.setState(() => {
                return {
                    pFieldValue: "",
                    sFieldValue: "",
                    error: true
                };
            }, () => {
                setTimeout(() => {
                    this.anchorRef.input.focus();
                }, 0);
                error(ex);
            })
        }
    }

    lookupId_onKeyDown = (event) => {

        // console.log("FLookupField lookupId_onKeyDown")
        if (event.key === "F2" && !this.props.addMode) {
            // console.log("F2 anchorRef", this.anchorRef)
            this.fetchDataGetInitLookup(() => {

                this.setState({
                    anchorEl: this.anchorRef,
                    error: false
                });

            }, (ex) => {
                //console.log(ex);
                if (this.props.onError) {
                    this.props.onError(ex);
                }

            });
        }
        if (event.key === "Tab" && !this.props.addMode) {
            if (this.state.pFieldValue) {
                this.fetchDataCheckInitLookup(() => {

                    this.data = {
                        lookupId: this.state.pFieldValue,
                        lookupDescription: this.state.sFieldValue
                    }
                    // this.lookupId = this.state.pFieldValue;
                    // this.lookupDescription = this.state.sFieldValue;
                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                }, (ex) => {
                    if (this.props.onError) {
                        this.props.onError(ex);
                    }
                    if (this.props.onChange) {
                        this.props.onChange({
                            lookupId: this.state.pFieldValue,
                            lookupDescription: this.state.sFieldValue,
                            props: {
                                ...this.props
                            }
                        });
                    }
                })
            }
            else {

                event.preventDefault();
                this.setState({ error: true });
            }
        }

    }
    lookupId_onBlur = (event) => {


    }
    lookupId_onChange = (event) => {

        // console.log("FLookupField lookupId_onChange")
        this.data = {}
        //this.lookupId = null;
        //this.lookupDescription = null;
        this.setState({
            pFieldValue: event.target.value,
            sFieldValue: "",
            error: false
        }, () => {
            if (this.props.onChange) {
                this.props.onChange({
                    lookupId: this.state.pFieldValue,
                    lookupDescripton: this.state.sFieldValue,
                    props: {
                        ...this.props
                    }
                });
            }
        });
    }
    desc_onChange = (event) => {

        // console.log("FLookupField desc_onChange")
        if (this.props.addMode) {


            this.setState({
                sFieldValue: event.target.value,

            }, () => {
                if (this.props.onChange) {
                    this.props.onChange({
                        lookupId: this.state.pFieldValue,
                        lookupDescripton: this.state.sFieldValue,
                        props: {
                            ...this.props
                        }
                    });
                }
            });
        }
    }
    handleItemClick = (item) => {

        // console.log("FLookupField handleItemClick")
        // console.log("selected: ", item)
        this.setState(() => {
            return {
                pFieldValue: item.LookupIDDb,
                sFieldValue: item.LookupDescriprionDb,
                anchorEl: null,
                error: false
            }
        }, () => {

            if (this.props.onChange) {
                this.props.onChange({
                    lookupId: this.state.pFieldValue,
                    lookupDescripton: this.state.sFieldValue,
                    props: {
                        ...this.props
                    }
                });
            }
        })
    }
    handleChange = (evt) => {

        //console.log("FLookupField handleChange")
        this.setState({
            pFieldValue: evt.target.value
        });
    }
    closePopover = () => {
        this.setState({
            anchorEl: null
        });
    }
    rowSelect = (evt, selectedRow) => {

        this.setState(() => {
            return {
                pFieldValue: selectedRow["LookupIDDb"],
                sFieldValue: selectedRow["LookupDescriprionDb"]
            }
        }, () => {
            this.closePopover();

            this.data = {
                lookupId: this.state.pFieldValue,
                lookupDescription: this.state.sFieldValue
            }
            //console.log("setting, ", this.state.sFieldValue)
            if (this.props.onChange) {
                this.props.onChange({
                    lookupId: this.state.pFieldValue,
                    lookupDescription: this.state.sFieldValue,
                    props: {
                        ...this.props
                    }
                });
            }
        })


    }

    generateList = () => {
        if (this.state.data) {
            return (
                <MaterialTable
                    title="Lookup"
                    columns={[
                        { title: this.props.lookupIdLabel, field: "LookupIDDb" },
                        { title: this.props.descriptionLabel, field: "LookupDescriprionDb" },
                    ]}
                    data={this.state.data}
                    onRowClick={this.rowSelect}
                />
            )
        }
    }

    checkValidity = () => {

        //console.log("FLookupField checkValidity")
        if (this.props.addMode) {
            return this.anchorRef.validity.valid && this.displayRef.validity.valid
        }
        else {

            let displayValid = false;
            if (this.props.required && this.displayRef.value != "") {
                displayValid = true;
            }
            if (!this.props.required) {
                displayValid = true;
            }

            return this.anchorRef.validity.valid
                && displayValid
        }
    }
    onDisplayBlur = () => {

        // console.log("FLookupField onDisplayBlur")
        if (this.props.addMode) {
            const valid = this.checkValidity();
            if (!valid) {
                this.setState({
                    error: true
                });
            }
        }
    }
    render() {

        const {
            lookupIdLabel,
            lookupIdPlaceholder,
            descriptionLabel,
            descriptionPlaceholder,
            codeType,
            required,
            classes,
            descriptionVisible,
            mode,
            format,
            size,
            keyGridSize,
            keyFullWidth,
            descGridSize,
            descFullWidth }
            = this.props;

        // let _disabled = true;
        // if (mode && (mode === Mode.ADD || mode === Mode.MODIFY)) {
        //     _disabled = false;
        // }
        const open = Boolean(this.state.anchorEl);


        const list = this.generateList();

        return (
            <Fragment>
                <Grid container spacing={0} style={{ alignItems: 'center' }}>
                    <Grid item xs={keyGridSize}>
                        <FStrField
                            // error={this.state.error} 
                            required={required}
                            error={this.state.error}
                            variant="outlined"
                            placeholder={lookupIdPlaceholder}
                            label={lookupIdLabel}
                            value={this.state.pFieldValue}
                            onKeyDown={this.lookupId_onKeyDown}
                            //inputRef={ref => { this.anchorRef = ref }}
                            ref={ref => { this.anchorRef = ref }}
                            onBlur={this.lookupId_onBlur}
                            onChange={this.lookupId_onChange}
                            // mode={mode}
                            InputLabelProps={{ shrink: true, style: {} }}
                            format={format}
                            size={size}
                            fullWidth={keyFullWidth} />
                    </Grid>
                    {descriptionVisible ? <Grid item>
                        <ArrowRightOutlined color="secondary" />
                    </Grid> : null}
                    {descriptionVisible ? <Grid item xs={descGridSize} hidden={!descriptionVisible}>
                        <TextField
                            required={this.props.required && this.props.addMode}
                            variant="outlined"
                            inputProps={{ readOnly: !this.props.addMode, tabIndex: this.props.addMode ? 0 : -1 }}
                            label={descriptionLabel}
                            placeholder={descriptionPlaceholder}
                            value={this.state.sFieldValue}
                            onChange={this.desc_onChange}
                            InputLabelProps={{ shrink: true }}
                            // disabled={_disabled}
                            inputRef={ref => this.displayRef = ref}
                            onBlur={this.onDisplayBlur}
                            size={size}
                            fullWidth={descFullWidth}
                        />
                    </Grid> : null}
                </Grid>
                <Popover
                    open={open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    onClose={this.closePopover}>
                    <Paper >
                        <Paper  >
                            {list}
                            {/* <List component="nav" className={classes.list}>
                                    <ListItem>
                                            <ListItemText primary={lookupIdLabel}/>
                                            <ListItemText primary={descriptionLabel}/>
                                    </ListItem>
                                    <Divider component="li" />
                                    <Paper className={classes.paper}>
                                        
                                    </Paper> 
                                </List>                               */}
                        </Paper>
                        <Paper>
                            <Typography className={classes.label} align='center' color='primary'>{codeType}</Typography>
                        </Paper>
                    </Paper>
                </Popover>

            </Fragment>
        );
    }
}

const FinFLookupField = withStyles(styles)(FinLookupField);

export const FLookupField = React.forwardRef((props, ref) => <FinFLookupField ref={ref} {...props} />)

FLookupField.propTypes = {

    /**
    * Defines the current user action 
    */
    mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    addMode: PropTypes.bool,
    organizationId: PropTypes.number,
    dbConnName: PropTypes.string,
    codeType: PropTypes.number,

    lookupId: PropTypes.any,
    data: PropTypes.objectOf(FLookupFieldResult),

    description: PropTypes.string,
    lookupIdLabel: PropTypes.string,
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
    descFullWidth: PropTypes.bool
}

FLookupField.defaultProps = {

    lookupIdLabel: "Lookup ID",
    //descriptionLabel: "Description",
    // lookupIdPlaceholder: undefined,
    // descriptionPlaceholder: undefined,
    descriptionVisible: true,
    dbConnName: "",
    lookupTableName: "",
    onChange: () => { },
    onError: () => { },
    required: false,
    addMode: false,
    disabled: true,
    format: FStrFormat.type_x,
    size: "small",
    size: "small",
    keyGridSize: 4,
    descGridSize: 6,
    keyFullWidth: false,
    descFullWidth: false
}