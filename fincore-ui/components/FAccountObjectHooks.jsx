import React, {Fragment,useState, useRef, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { TextField, Paper, makeStyles } from '@material-ui/core';
import axios from 'axios';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {FSearchWindow} from './FSearchWindow';
import PropTypes from 'prop-types';
import {FormContext} from './FCanvas';

const useStyles = makeStyles((theme) => ({
    list: {
        border: '2px solid blue',
        padding: 2,
        margin: 2,
        minWidth: 400
    },
    close: {
        margin: 2
    },
    paper: {
        maxHeight: 300,
        overflow: 'auto',
    },
    label: {
        backgroundColor: 'lightblue',
        margin: 2,
        border: '1px solid blue'
    },
    input: {
        // height: 25,
        // width: 150
    },
    inputStatic: {
        // height: 25,
    }
}));



const BLANK_ACC = "        000000000000000000000000";

const FinAccountObject = (props) => {

    const {value, disabled, label, size, variant, descriptionVisible, searchWindow} = props;
    const classes = useStyles();

    const {productId, setProductId} = useState("");
    const {accountId, setAccountId} = useState("");
    const {subAccountId, setSubAccountId} = useState("");
    const {accountDescription, setAccountDescription} = useState("");
    const {anchorElement, setAnchorElement} = useState(null);

    const {productError, setProductError} = useState(false);
    const {accountError, setAccountError} = useState(false);
    const {subAccountError, setSubAccountError} = useState(false);

    const prdIdRef = useRef(null);
    const accIdRef = useRef(null);
    const subIdRef = useRef(null);
    const anchorRef = useRef(null);
    const formContext = useContext(FormContext);


    const _disabled = disabled ? disabled : formContext.disabled;

    function onChangeProductId(){}
    function onChangeAccountId(){}
    function onChangeSubAccountId(){}

    function onBlurProductId(){}
    function onBlurAccountId(){}
    function onBlurSubAccountId(){}

    function onProductKeyDown(){}
    function onAccountKeyDown(){}
    function onSubAccountKeyDown(){}

    function closePopover(){

        setAnchorElement(null);
    }

    const open = Boolean(anchorElement);

    return (
        <Fragment>
            {/* {searchWindow && showSearchWindow ? <FSearchWindow contents={searchWindow} onClose={onSearchWindowClose} /> : null} */}
            <Grid container>
                <Grid container spacing={1} justify="center">
                    <Grid item xs={4}>
                        <TextField
                            variant={variant}
                            error={productError}
                            onKeyDown={onProductKeyDown}
                            inputRef={prdIdRef}
                            value={productId}
                            onChange={onChangeProductId}
                            onBlur={onBlurProductId}
                            disabled={_disabled}
                            InputProps={{ className: classes.input }}
                            InputLabelProps={{ shrink: true }}
                            size={size}
                            label={label}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant={variant}
                            error={accountError}
                            inputRef={accIdRef}
                            disabled={_disabled}
                            value={accountId}
                            onChange={onChangeAccountId}
                            onBlur={onBlurAccountId}
                            onKeyDown={onAccountKeyDown}
                            InputProps={{ className: classes.input }}
                            InputLabelProps={{ shrink: true }}
                            size={size} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant={variant}
                            error={subAccountError}
                            inputRef={subIdRef}
                            value={subAccountId}
                            onChange={onChangeSubAccountId}
                            disabled={_disabled}
                            onKeyDown={onSubAccountKeyDown}
                            InputProps={{ className: classes.input }}
                            InputLabelProps={{ shrink: true }}
                            size={size}/>
                    </Grid>
                    {descriptionVisible ?<Grid item xs={12}>
                        <TextField 
                            variant={variant}
                            fullWidth
                            disabled={true}
                            inputRef={anchorRef}
                            value={accountDescription}
                            InputProps={{ className: classes.inputStatic }}
                            InputLabelProps={{ shrink: true }}
                            size={size} />

                    </Grid> : null}
                </Grid>
                <Popover open={open}
                    anchorEl={anchorElement}
                    onClose={closePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}>
                    <Paper >
                        {/* {productTable}
                        {accountTable}
                        {subAccountTable} */}
                    </Paper>
                </Popover>
            </Grid>
        </Fragment>);

}






export const FAccountObject = React.forwardRef((props, ref) => <FinAccountObject ref={ref} {...props} />)


FAccountObject.propTypes = {

    onBlur : PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    AcceptLevel: PropTypes.string,
    HomeBranchCode: PropTypes.string,
    ModuleFilter: PropTypes.string,
    BranchCode: PropTypes.string,
    classes: PropTypes.any,
    PickAddMode: PropTypes.string,
    Text: PropTypes.string,
    SearchWindow: PropTypes.any,
    descriptionVisible: PropTypes.bool,
    disabled : PropTypes.bool,
    variant: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    LBrCode: PropTypes.string,
    DbConnName: PropTypes.string,
    HomeLBrCode: PropTypes.string,
    ModuleString: PropTypes.string,
    UsrGrpCd: PropTypes.number,
    CustNoFilter: PropTypes.string,
    HideClosedAccounts: PropTypes.bool,
    size: PropTypes.oneOf(["small", "medium"]),
    productLabel: PropTypes.string
}

FAccountObject.defaultProps = {
    onBlur: () => { },
    onFocus: () => { },
    onChange: () => { },
    variant: "outlined",
    required: false,
    DbConnName: "",
    HomeBranchCode: "0",
    ModuleFilter: "",
    UsrGrpCd: 1,
    CustNoFilter: "",
    HideClosedAccounts: false,
    text: "",
    descriptionVisible: true,
    disabled: false,
    size: "small"
}



