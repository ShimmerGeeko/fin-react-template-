import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { TextField, Paper } from '@material-ui/core';
import axios from 'axios';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {FSearchWindow} from './FSearchWindow';
import PropTypes from 'prop-types';
import {FormContext} from './FCanvas';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

const styles = (theme) => ({
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
        backgroundColor: 'lightblue'
    }
});



const BLANK_ACC = "        000000000000000000000000";
export class FinAccountObject extends Component {


    prdIdRef = undefined;
    accIdRef = undefined;
    subIdRef = undefined;
    anchorRef = undefined;
    showProductTable = false;
    showAccountTable = false;
    showSubAccountTable = false;

    product = { ProductId: "" };
    account = { AccountNo: "" };
    subAccount = {}
    CONTROLS_API_URL = undefined;

    implementationLevel = undefined;
    cacAuthNeeded = 0
    curCd = undefined;
    autoGenAcct = undefined;
    autoGenSubAcct = undefined;
    moduleType = 0;
    custNo = 0;
    prdAuthNeeded = 0;
    subAccAuthNeeded = 0;
    accNameTitle = ""
    accName = ""

    prdStat = 0;
    accStat = 0;
    subAccStat = 0;

    text = BLANK_ACC;

    state = {
        products: [],
        accounts: [],
        subAccounts: [],
        open: false,
        placement: 'bottom-start',
        disablePortal: false,
        error: false,
        accountError: false,
        subAccountError: false,
        productId: "",
        accountId: "",
        subAccountId: "",
        description: "",
        productTBDisabled: false,
        accountTBDisabled: true,
        subAccountTBDisabled: true,
        anchorEl: null,
        showSearchWindow: false,
        text: ""
    }
    constructor(props, context) {

        super(props, context);
        //console.log("FAccountObject const");
        this.state.productTBDisabled = this.props.disabled ? this.props.disabled : this.context.disabled;
        this.CONTROLS_API_URL = process.env.REACT_APP_CONTROLS_API_URL;
        if (this.props.Text) {

            if (this.props.Text.trim() === "") {
                this.state.text = this.text;
            }
            else {
                this.state.text = this.props.Text;
                this.text = this.props.Text
                this.setTextFieldValues();
            }
        }
        else {
            this.state.text = this.text;
        }

        // console.log("State Text: ", this.state.text);
        // console.log("Text: ", this.text);
    }

    componentDidUpdate(prevProps, prevState, snapshot){

        if(this.props.Text && this.props.Text !== prevProps.Text){

            
            this.text = this.props.Text;
            this.setTextFieldValues();
            this.setState({
                text: this.props.Text
            });
        }

    }
    setTextFieldValues = () => {

        //console.log(this.text, "--", this.text.length);
        if (this.text.length === 32) {
            let productId = "";
            let accountId = "";
            let subAccountId = "";

            let n_accId = 0
            let n_subAccId = 0

            productId = this.text.substr(0, 8);
            this.implementationLevel = "P";


            n_accId = parseInt(this.text.substr(16, 8));
            if (n_accId === 0) {
                //this.state.accountTBDisabled = true;
                accountId = "";
            }
            else {
                this.implementationLevel = "A";
                accountId = n_accId.toString();
               // this.state.accountTBDisabled = false;
            }

            n_subAccId = parseInt(this.text.substr(24, 8));
            if (n_subAccId === 0) {
              //  this.state.subAccountTBDisabled = true;
                subAccountId = "";
            }
            else {
                this.implementationLevel = "S";
                subAccountId = n_subAccId.toString();
               // this.state.subAccountTBDisabled = false;

            }

            this.state.productId = productId;
            this.state.accountId = accountId;
            this.state.subAccountId = subAccountId;
        }
    }

    raiseChangeEvent = (emitTabEvent) => {
        if (this.props.onChange) {

            let accountEventArgs = {

                id: this.text,
                desc: this.state.description,
                productNo: this.state.productId,
                accountNo: this.state.accountId,
                subAccountNo: this.state.subAccountId,
                implementationLevel: this.implementationLevel,
                moduleType: this.moduleType,
                curCd: this.curCd,
                autoGenAcct: this.autoGenAcct,
                autoGenSubAcct: this.autoGenSubAcct,
                custNo: this.custNo,
                prdStatus: this.prdStat,
                accStatus: this.accStat,
                subAccStatus: this.subAccStat,
                prdAuthNeeded: this.prdAuthNeeded,
                accAuthNeeded: this.cacAuthNeeded,
                subAccAuthNeeded: this.subAccAuthNeeded
            }


            this.props.onChange({
                text: this.text,
                args: accountEventArgs
            });
            if(emitTabEvent === true){
                setTimeout(() => {
                    this.props.onTab({
                        text: this.text,
                        args: accountEventArgs
                    });
                }, 10)
            }
            
           
        }
    }

    onChangeProductId = (evt) => {

        if (!evt.target.value || evt.target.value === "") {
            this.text = BLANK_ACC;
            this.raiseChangeEvent(false);
        }

        this.setState({
            productId: evt.target.value,
            accountId: "",
            subAccountId: "",
            description: "",
            accountTBDisabled: true,
            subAccountTBDisabled: true,
            error: false,
            accountError: false,
            subAccountError: false
        });
    }
    onChangeAccountId = (evt) => {
        this.setState({
            accountId: evt.target.value,
            subAccountId: "",
            accountError: false,
            subAccountError: false,
            //description: ""
        })
    }
    onChangeSubAccountId = (evt) => {

        if (this.state.accountId !== "") {
            this.setState({
                subAccountId: evt.target.value,
                subAccountError: false
            })
        }

    }
    fetchDataGetAccountsDBCustNoFilter = async (success, error) => {

        try {

            const { branchCode, custNoFilter, dbConnName, hideClosedAccounts } = this.props;
            let url = this.CONTROLS_API_URL + "GetAccountsDBCustNoFilter";
            let From = 0;
            if (this.state.accountId !== "") {
                From = parseInt(this.state.accountId);
            }
            const data = {
                LBrCode: branchCode,
                Product: this.state.productId,
                From,
                Pagen: 0,
                HideClosedAccounts: hideClosedAccounts,
                DbConnName: dbConnName,
                CustNoFilter : custNoFilter
            }
            //console.log(data);
            const response = await axios.post(url, data);
            const result = await response.data;
            this.setState({
                accounts: result
            });
            //console.log(result);
            success();

        } catch (ex) {
            error();
        }
    }
    fetchDataCheckAccountsDBCustNoFilter = async (success, error) => {

        try {

            const { branchCode, custNoFilter, dbConnName, hideClosedAccounts } = this.props;
            let url = this.CONTROLS_API_URL + "CheckAccountsDBCustNoFilter";
            let From = 0;
            if (this.state.accountId !== "") {
                From = parseInt(this.state.accountId);
            }
            const data = {
                LBrCode: branchCode,
                Product: this.state.productId,
                From,
                Pagen: 0,
                HideClosedAccounts : hideClosedAccounts,
                DbConnName : dbConnName,
                CustNoFilter : custNoFilter
            }
            //console.log(data);
            const response = await axios.post(url, data);
            const result = await response.data;
            success(result);

        } catch (ex) {
            error();
        }
    }
    fetchDataGetProductDBCustNoFilter = async (success, error) => {

        try {
            const { branchCode,   homeBranchCode, custNoFilter, dbConnName, moduleFilter, userGroupCode } = this.props;
            let url = this.CONTROLS_API_URL + "GetProductDBCustNoFilter";

            const data = {
                LBrCode: branchCode,
                HomeLBrCode:   homeBranchCode,
                CustNoFilter : custNoFilter,
                DbConnName: dbConnName,
                ModuleString: moduleFilter,
                UsrGrpCd : userGroupCode,
                ProdLike: this.prdIdRef.value
            }

            //console.log(data);
            const response = await axios.post(url, data);
            const result = await response.data;
            this.setState({
                products: result
            });
            //console.log(result);
            success();
        } catch (err) {
            //console.log(err);
            error()
        }

    }
    fetchDataGetSubAccountDBCustNoFilter = async (success, error) => {

        try {

            const { branchCode, custNoFilter, dbConnName, moduleFilter, hideClosedAccounts } = this.props;
            let url = this.CONTROLS_API_URL + "GetSubAccountDBCustNoFilter";
            let Product = this.state.productId;
            let Acc = 1;
            if (this.state.accountId !== "") {
                Acc = parseInt(this.state.accountId);
            }
            let From = 0;
            if (this.state.subAccountId !== "") {
                From = parseInt(this.state.subAccountId);
            }
            const data = {
                LBrCode: branchCode,
                Product,
                Acc,
                ModuleType: this.product.ModuleType,
                From,
                Pagen: 0,
                HideClosedAccounts : hideClosedAccounts,
                DbConnName: dbConnName,
                CustNoFilter : custNoFilter
            }
            //console.log(data);
            const response = await axios.post(url, data);
            const result = await response.data;
            //this.subAccounts = { ...result };
            this.setState({
                subAccounts: result
            });
            success();

        } catch (err) {
            error();
        }
    }

    fetchDataCheckSubAccountDBCustNoFilter = async (success, error) => {

        try {

            const { branchCode, custNoFilter, dbConnName, moduleFilter } = this.props;
            let url = this.CONTROLS_API_URL + "CheckSubAccountDBCustNoFilter";
            let Product = this.state.productId;
            let acc = 0;
            if (this.state.accountId !== "") {
                acc = parseInt(this.state.accountId) | 0;
            }
            let receipt = 0;
            if (this.state.subAccountId !== "") {
                receipt = parseInt(this.state.subAccountId) | 0
            }
            const data = {
                LBrCode: branchCode,
                Product,
                Acc: acc,
                ModuleType: this.product.ModuleType,
                DbConnName :dbConnName,
                CustNoFilter : custNoFilter,
                ReceiptNo: receipt
            }
            const response = await axios.post(url, data);
            const result = await response.data;
            success(result);

        } catch (err) {
            error()
        }

    }

    fetchDataCheckProductDBCustNoFilter = async (success, error) => {

        try {
            const { branchCode,  homeBranchCode, custNoFilter, dbConnName, moduleFilter, userGroupCode } = this.props;
            let url = this.CONTROLS_API_URL + "CheckProductDBCustNoFilter";

            const data = {
                LBrCode: branchCode,
                HomeLBrCode:  homeBranchCode,
                CustNoFilter : custNoFilter,
                DbConnName: dbConnName,
                ModuleString: moduleFilter,
                UsrGrpCd : userGroupCode,
                ProdLike: this.prdIdRef.value
            }

            //console.log(data);
            const response = await axios.post(url, data);
            const result = await response.data;
            success(result);
        } catch (err) {

            error()
        }

    }
    setFieldsByModuleType = () => {

        let product = this.product;
        let implementationLevel = product.ImplementationLevel;
        //console.log(implementationLevel);
        switch (implementationLevel) {
            case "P":
                this.setState({
                    productTBDisabled: false,
                    accountTBDisabled: true,
                    subAccountTBDisabled: true
                });

                break;
            case "A":
                this.setState({
                    productTBDisabled: false,
                    accountTBDisabled: false,
                    subAccountTBDisabled: true
                }, () => {

                    this.accIdRef.focus();
                });

                break;

            case "S":
                this.setState({
                    productTBDisabled: false,
                    accountTBDisabled: false,
                    subAccountTBDisabled: false
                });
                this.accIdRef.focus();
                break;
            case "T":
                this.setState({
                    productTBDisabled: false,
                    accountTBDisabled: false,
                    subAccountTBDisabled: false
                });
                //console.log("case T");
                this.accIdRef.focus();
                break;

            default:
                //console.log("default");
                break;
        }
    }

    onProductKeyDown = (evt) => {

        if (evt.key === "F2") {

            if (evt.shiftKey) {
                if (this.props.searchWindow) {

                    this.setState({
                        showSearchWindow: true
                    });
                }
                else {
                    alert("No Advance Search Avaialbale")
                }
            }
            else {
                this.showProductTable = true;
                this.fetchDataGetProductDBCustNoFilter(() => {
                    this.setState({
                        anchorEl: this.anchorRef,
                        error: false
                    })
                }, () => { });
            }



        }
        if (evt.key === "Tab") {
            if (evt.target.value && evt.target.value.trim() !== "") {
                this.fetchDataCheckProductDBCustNoFilter((result) => {

                    this.product = { ...result };
                    this.setState({
                        productId: result.ProductId.trim(),
                        description: result.ProductName,
                        error: false
                    }, () => {

                        this.setFieldsByModuleType();
                        this.setProductResultValues();
                        this.triggerValueChangedForProduct(true);
                        if (this.props.addMode && this.implementationLevel === "A" && this.autoGenAcct === "Y") {
                            this.accStat = 0;
                            this.cacAuthNeeded = 0;
                        }
                        setTimeout(() => {
                            this.accIdRef.focus();
                        }, 100)

                    });
                }, () => {
                    alert("Invalid Product Code");
                    this.setState({
                        error: true
                    });
                    this.prdIdRef.focus();
                });
            }
        }
    }
    onAccountKeyDown = (evt) => {
        if (evt.key === "F2") {

            if (evt.shiftKey && !(this.props.addMode && this.implementationLevel === "A")) {
                if (this.props.searchWindow) {

                    this.setState({
                        showSearchWindow: true
                    });

                }
                else {
                    alert("No Advance Search Avaialbale")
                }
            }
            else {
                this.showAccountTable = true;
                this.fetchDataGetAccountsDBCustNoFilter(() => {
                    this.setState({
                        anchorEl: this.anchorRef,
                        error: false,
                        accountError: false
                    })
                }, () => { });
            }


        }
        if (evt.key === "Tab") {
            this.fetchDataCheckAccountsDBCustNoFilter((result) => {

                if (this.props.addMode && this.autoGenAcct != "Y" &&
                    (this.implementationLevel == "A" || (this.implementationLevel == "S" && this.props.acceptLevel == "A"))) {

                    if (!result) {
                        let accountNo =
                            this.product.ProductId.trim().padEnd(8, ' ') + "00000000" + this.state.accountId.trim().padStart(8, '0') + "00000000";

                        this.account = {
                            AccountNo: accountNo,
                            ShortAccountNo: FAccountObject.toShortAccountNo(accountNo)
                        };
                        this.custNo = this.account.CustNo;
                        this.triggerValueChangedForAccount(this.account, true);
                    }
                    else {
                        alert("Account already exists");
                        this.setState({
                            description: "",
                            accountError: true
                        });
                    }

                } else {

                    if (result) {

                        this.account = result;
                        this.setAccountResultValues();
                        this.setState({
                            description: this.account.NameTittle + " " + this.account.FullName,
                            accountError: false,
                        });
                        this.accNameTitle = this.account.NameTittle;
                        this.accName = this.account.FullName;
                        this.triggerValueChangedForAccount(this.account, true);
                        if ((this.implementationLevel === "S" || this.implementationLevel === "T") && this.props.acceptLevel !== "A")
                            this.subIdRef.focus();
                        else {
                            this.setState({
                                subAccountTBDisabled: true
                            })
                        }
                    }
                    else {

                        alert("Invalid Account Code");
                        this.setState({
                            subAccountId: "",
                            accountError: true,
                            description: ""
                        }, () => {
                            setTimeout(() => {
                                this.accIdRef.focus();
                            }, 100)
                        })
                    }

                }
            },
                () => {
                    this.setState({
                        accountError: true
                    })
                    this.accIdRef.focus();
                });
        }
    }
    onSubAccountKeyDown = (evt) => {
        if (evt.key === "F2") {

            if (evt.shiftKey && !(this.props.addMode && this.implementationLevel === "A")) {

                if (this.props.searchWindow) {

                    this.setState({
                        showSearchWindow: true
                    });

                }
                else {
                    alert("No Advance Search Avaialbale")
                }
            }
            else {

                this.showSubAccountTable = true;
                this.fetchDataGetSubAccountDBCustNoFilter(() => {
                    this.setState({
                        anchorEl: this.anchorRef,
                        error: false
                    })
                }, () => { });
            }
        }
        if (evt.key === "Tab") {
            this.showSubAccountTable = false;
            this.fetchDataCheckSubAccountDBCustNoFilter((result) => {

                const { addMode } = this.props;

                if (addMode && this.autoGenSubAcct !== "Y") {

                    if (!result) {
                        this.subAccount = result;
                        this.subAccount.ReceiptNo = this.state.productId.trim().padEnd(8, ' ') +
                            "00000000" +
                            this.state.accountId.trim().padStart(8, '0') +
                            this.state.subAccountId.trim().padStart(8, '0');
                        this.subAccount.ShortReceiptNo = FAccountObject.toShortAccountNo(this.subAccount.ReceiptNo);
                        this.subAccStat = 0;
                        this.subAccAuthNeeded = 0;
                        this.triggerValueChangedForSubAccountNumber(this.subAccount, true);
                        this.setState({
                            subAccountError: false
                        });
                    }
                    else {

                        alert("Receipt Number Already Present")
                        this.setState({
                            subAccountError: true
                        }, () => {
                            setTimeout(() => {
                                this.subIdRef.focus();
                            }, 100)
                        });
                        this.text = BLANK_ACC;
                        this.raiseChangeEvent(false);
                    }
                }
                else {

                    if (!result) {

                        alert("Invalid Receipt No.");
                        this.setState({
                            subAccountError: true
                        }, () => {
                            setTimeout(() => {
                                this.subIdRef.focus();
                            })
                        });
                        this.text = BLANK_ACC;
                        this.raiseChangeEvent(false);
                    }
                    else {

                        this.subAccount = result;
                        this.subAccStat = this.subAccount.Status;
                        this.subAccAuthNeeded = this.subAccount.DbtrAuthNeeded;
                        this.setState({
                            description: this.subAccount.FullName,
                            subAccountError: false
                        });
                        this.triggerValueChangedForSubAccountNumber(this.subAccount, true);
                    }
                }


            }, () => {
                this.setState({
                    subAccountError: true
                })
                setTimeout(() => {
                    this.subIdRef.focus();
                }, 0)

            })
        }
    }

    triggerValueChangedForProduct = (isTabEvent) => {

        let product = this.product;
        const { acceptLevel, addMode } = this.props;

        if (product.ImplementationLevel === "P" || acceptLevel === "P") {
            this.text = product.ProductId.padEnd(8, ' ') + "000000000000000000000000";
            this.setState({
                accountTBDisabled: true,
                subAccountTBDisabled: true
            }, () => {
                this.raiseChangeEvent(isTabEvent);
            })
        }
        else if (product.ImplementationLevel === "A" && addMode && this.autoGenAcct === "Y") {
            this.accStat = 0;
            this.cacAuthNeeded = 0;
            this.text = product.ProductId.padEnd(8, ' ') + "000000000000000000000000";
            this.setState({
                accountTBDisabled: true,
                subAccountTBDisabled: true
            }, () => {
                this.raiseChangeEvent(isTabEvent);
            });
            //console.log("Text: ", this.text);
        }
        else if (product.ImplementationLevel == "S" && addMode && this.autoGenAcct == "Y" && acceptLevel == "A") {
            this.accStat = 0;
            this.subAccStat = 0;
            this.cacAuthNeeded = 0;
            this.subAccAuthNeeded = 0;
            this.text = product.ProductId.padEnd(8, ' ') + "000000000000000000000000";
            this.setState({
                accountTBDisabled: true,
                subAccountTBDisabled: true
            }, () => {
                this.raiseChangeEvent(isTabEvent)
            });

        }
        else if (product.ImplementationLevel == "S" && addMode && this.autoGenSubAcct == "Y") {
            this.subAccStat = 0;
            this.subAccAuthNeeded = 0;
            this.setState({
                subAccountTBDisabled: true
            });
            return;
        }
        else
            return;
    }

    triggerValueChangedForAccount = (account, isTabbed) => {

        const { acceptLevel, addMode } = this.props;
        const { implementationLevel, autoGenSubAcct } = this;

        if (implementationLevel === "A" || (implementationLevel === "S" && acceptLevel === "A")) {

            this.setTextOnAccountChanged(account);
            this.raiseChangeEvent(isTabbed);
        }
        else if (implementationLevel === "S" && addMode && autoGenSubAcct == "Y") {

            this.setTextOnAccountChanged(account);
            this.setState({
                subAccountTBDisabled: true
            }, () => {
                this.raiseChangeEvent(isTabbed);
            })
        }
        else if (implementationLevel == "S" && addMode && acceptLevel == "A") {

            this.setTextOnAccountChanged(account);
            this.setState({
                subAccountTBDisabled: true
            }, () => {
                this.raiseChangeEvent(isTabbed);
            })

        }
        else {
            return;
        }
    }

    triggerValueChangedForSubAccountNumber = (subAccount, isTabbed) => {

        const { implementationLevel } = this;

        if (implementationLevel == "S" || implementationLevel == "T") {
            // console.log(this.product.ProductId.trim().padEnd(8, ' '))
            // console.log("00000000");
            // console.log(this.state.accountId.padStart(8, '0'));
            // console.log(subAccount.ShortReceiptNo!.split('/')[2].trim().padStart(8, '0'));

            this.text = this.product.ProductId.trim().padEnd(8, ' ') + "00000000" + this.state.accountId.padStart(8, '0') + subAccount.ShortReceiptNo.split('/')[2].trim().padStart(8, '0');

            //console.log(this.text);
        }
        else {
            return;
        }


        if (this.text.trim() !== "") {

            let accountEventArgs = {

                id: this.text,
                desc: this.state.description,
                productNo: this.state.productId,
                accountNo: this.state.accountId,
                subAccountNo: this.state.subAccountId,
                implementationLevel: this.implementationLevel,
                moduleType: this.moduleType,
                curCd: this.curCd,
                autoGenAcct: this.autoGenAcct,
                autoGenSubAcct: this.autoGenSubAcct,
                custNo: this.custNo,
                prdStatus: this.prdStat,
                accStatus: this.accStat,
                subAccStatus: this.subAccStat,
                prdAuthNeeded: this.prdAuthNeeded,
                accAuthNeeded: this.cacAuthNeeded,
                subAccAuthNeeded: this.subAccAuthNeeded
            }
            this.raiseChangeEvent(isTabbed);
        }

    }

    onBlurProductId = (evt) => {
        //console.log(evt.target.value);

    }
    onBlurAccountId = (evt) => {

    }


    productRowSelect = (evt, selectedProduct) => {

        console.log(selectedProduct);
        this.showProductTable = false;
        this.product = {
            ...selectedProduct
        };
        let productId = selectedProduct["ProductId"].trim();
        this.setState(() => {
            return {
                productId: productId,
                description: selectedProduct["ProductName"].trim(),
                anchorEl: null
            }
        }, () => {

            this.setFieldsByModuleType();
            this.setProductResultValues();
            this.triggerValueChangedForProduct(false);
            //console.log(this.accIdRef);
            setTimeout(() => {
                this.accIdRef.focus();
            }, 100)
        });

    }
    accountRowSelect = (evt, selectedAccount) => {
        this.showAccountTable = false;
        this.account = { ...selectedAccount }
        //console.log("Account: " + this.account, this.account.AccountNo);
        let accountId = selectedAccount["ShortAccountNo"].split("/")[1];
        this.setState({
            accountId: accountId,
            description: this.account.NameTittle + " " + this.account.FullName,
            anchorEl: null
        }, () => {
            this.setAccountResultValues();
            this.triggerValueChangedForAccount(this.account, false)
            setTimeout(() => {
                this.subIdRef.focus();
            }, 100)
        });
    }

    subAccountRowSelect = (evt, selectedSubAccount) => {

        this.showSubAccountTable = false;
        this.subAccount = { ...selectedSubAccount };
        let subAccountId = selectedSubAccount["ShortReceiptNo"].split("/")[2];
        this.setState({
            subAccountId: subAccountId,
            description: this.subAccount.FullName,
            anchorEl: null
        }, () => {
            this.subAccStat = this.subAccount.Status;
            this.subAccAuthNeeded = this.subAccount.DbtrAuthNeeded;
            this.triggerValueChangedForSubAccountNumber(this.subAccount, false);
        })
    }
    closePopover = () => {
        //console.log("onclose");
        this.setState({
            anchorEl: null,
            products: [],
            accounts: []
        });
        this.showProductTable = false;
        this.showAccountTable = false;
        this.showSubAccountTable = false;
    }

    setTextOnAccountChanged(account) {

        const { ShortAccountNo } = account;
        this.text = this.product.ProductId.trim().padEnd(8, ' ') + "00000000" + ShortAccountNo.split('/')[1].toString().trim().padStart(8, '0') + "00000000";
    }

    setAccountResultValues() {
        this.accStat = this.account.Status;
        this.cacAuthNeeded = this.account.DbtrAuthNeeded;
        this.custNo = this.account.CustNo;
    }

    setProductResultValues() {
        this.implementationLevel = this.product.ImplementationLevel;
        this.curCd = this.product.CurCd;
        this.prdStat = this.product.Status;
        this.prdAuthNeeded = this.product.DbtrAuthNeeded;
        this.autoGenAcct = this.product.AutoGenAcct;
        this.autoGenSubAcct = this.product.AutoGenSubAcct;
        this.custNo = 0;
    }

    generateProductTable() {

        if (this.state.products) {
            return (
                <MaterialTable
                    title="Products"
                    columns={[
                        { title: "Product ID", field: "ProductId" },
                        { title: "Product Name", field: "ProductName" },
                    ]}
                    data={this.state.products}
                    onRowClick={this.productRowSelect}
                    options={{
                        filtering: true
                    }}
                />
            )
        }
    }
    generateAccountTable() {

        if (this.state.accounts) {
            return (
                <MaterialTable
                    title="Accounts"
                    columns={[
                        { title: "Account ID", field: "ShortAccountNo" },
                        { title: "Account Holder's Name", field: "FullName" },
                        { title: "Account Status", field: "AccountStatus" },
                    ]}
                    data={this.state.accounts}
                    onRowClick={this.accountRowSelect}
                />
            )
        }
    }
    generateSubAccountTable() {

        if (this.state.subAccounts) {
            return (
                <MaterialTable
                    title="SubAccounts"
                    columns={[
                        { title: "Account ID", field: "ShortReceiptNo" },
                        { title: "Account Holder's Name", field: "FullName" },
                        { title: "Account Status", field: "ReceiptStatus" },
                    ]}
                    data={this.state.subAccounts}
                    onRowClick={this.subAccountRowSelect}
                />
            )
        }
    }

    componentDidMount() {

    }

    onSearchWindowClose = () => {
        this.setState({
            showSearchWindow: false
        });
    }

    static toShortAccountNo(str) {

        if (str.length !== 32) {
            return str;
        }
        else {

            try {

                if (parseInt(str.substring(24, 8)) === 0) {
                    str = str.substring(0, 8).trim() + "/" + parseInt(str.substring(16, 8)) || "0"
                }
                else {
                    str = str.substring(0, 8).trim() + "/"
                        + parseInt(str.substring(16, 8)) || "0"
                        + "/"
                        + parseInt(str.substring(28, 8)) || "0"
                }
                return str;

            } catch (error) {
                return str;
            }
        }
    }

    expandAccName = () => {


        const { implementationLevel } = this;

        if (implementationLevel === "P") {

            this.fetchDataCheckProductDBCustNoFilter((result) => {

                if (result !== null) {
                    let productData = result;
                    this.setState({
                        description: productData.ProductName
                    });
                }

            }, () => {

            })
        }
        else if (implementationLevel === "A" || implementationLevel === "S") {

            this.fetchDataCheckAccountsDBCustNoFilter((result) => {

                if (result !== null) {
                    let accountData = result;
                    this.setState({
                        description: accountData.NameTittle + " " + accountData.FullName
                    });
                    this.custNo = accountData.CustNo;
                }

            }, () => { });
        }

    }

    clearValues = () => {

        this.setState({
            productId: "",
            accountId: "",
            subAccountId: "",
            description: "",

        });
        this.text = "";

    }


    render() {

        const { classes, descriptionVisible, size, productLabel, accountIdLabel, subAccountIdLabel } = this.props;
        const open = Boolean(this.state.anchorEl);
        let productTable = null;
        let accountTable = null;
        let subAccountTable = null;
        if (this.showProductTable) {
            productTable = this.generateProductTable();
        }
        if (this.showAccountTable) {
            accountTable = this.generateAccountTable();
        }
        if (this.showSubAccountTable) {
            subAccountTable = this.generateSubAccountTable();
        }



        return (
            <Fragment>
                {this.props.searchWindow && this.state.showSearchWindow ? <FSearchWindow contents={this.props.searchWindow} onClose={this.onSearchWindowClose} /> : null}
                <Grid container>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                variant={this.props.variant}
                                error={this.state.error}
                                onKeyDown={this.onProductKeyDown}
                                inputRef={ref => { this.prdIdRef = ref }}
                                value={this.state.productId}
                                onChange={this.onChangeProductId}
                                onBlur={this.onBlurProductId}
                                disabled={this.state.productTBDisabled}
                                InputProps={{ className: classes.input }}
                                InputLabelProps={{ shrink: true }}
                                size={size}
                                label={productLabel}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                variant={this.props.variant}
                                error={this.state.accountError}
                                inputRef={ref => { this.accIdRef = ref }}
                                disabled={this.state.accountTBDisabled || this.props.disabled}
                                value={this.state.accountId}
                                onChange={this.onChangeAccountId}
                                onBlur={this.onBlurAccountId}
                                onKeyDown={this.onAccountKeyDown}
                                InputProps={{ className: classes.input }}
                                InputLabelProps={{ shrink: true }}
                                size={size}
                                label={accountIdLabel} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                variant={this.props.variant}
                                error={this.state.subAccountError}
                                inputRef={ref => { this.subIdRef = ref }}
                                value={this.state.subAccountId}
                                onChange={this.onChangeSubAccountId}
                                disabled={this.state.subAccountTBDisabled || this.props.disabled}
                                onKeyDown={this.onSubAccountKeyDown}
                                InputProps={{ className: classes.input }}
                                InputLabelProps={{ shrink: true }}
                                size={size}
                                label={subAccountIdLabel} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant={this.props.variant}
                                fullWidth
                                disabled={true}
                                hidden={!descriptionVisible}
                                inputRef={ref => { this.anchorRef = ref }}
                                value={this.state.description}
                                InputProps={{ className: classes.inputStatic }}
                                InputLabelProps={{ shrink: true }}
                                size={size} />

                        </Grid>
                    </Grid>
                    <Popover open={open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.closePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <Paper >
                            {productTable}
                            {accountTable}
                            {subAccountTable}
                        </Paper>
                    </Popover>
                </Grid>
            </Fragment>
        );
    }

}
FinAccountObject.contextType = FormContext;

const FinFAccountObject = withStyles(styles)(FinAccountObject);

export const FAccountObject = React.forwardRef((props, ref) => <FinFAccountObject ref={ref} {...props} />)


FAccountObject.propTypes = {

    onBlur : PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    acceptLevel: PropTypes.string,
    homeBranchCode: PropTypes.string,
    moduleFilter: PropTypes.string,
    branchCode: PropTypes.string,
    classes: PropTypes.any,
    addMode: PropTypes.string,
    Text: PropTypes.string,
    searchWindow: PropTypes.any,
    descriptionVisible: PropTypes.bool,
    disabled : PropTypes.bool,
    variant: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    dbConnName: PropTypes.string,
    userGroupCode: PropTypes.number,
    custNoFilter: PropTypes.string,
    hideClosedAccounts: PropTypes.bool,
    size: PropTypes.oneOf(["small", "medium"]),
    productLabel: PropTypes.string,
    accountIdLabel: PropTypes.string,
    subAccountIdLabel: PropTypes.string,

}

FAccountObject.defaultProps = {
    onBlur: () => { },
    onFocus: () => { },
    onChange: () => { },
    onTab: () => {},
    variant: "outlined",
    required: false,
    dbConnName: "",
    homeBranchCode: "0",
    moduleFilter: "",
    userGroupCode: 1,
    custNoFilter: "",
    hideClosedAccounts: false,
    text: "",
    descriptionVisible: true,
    disabled: false,
    size: "small"
}



