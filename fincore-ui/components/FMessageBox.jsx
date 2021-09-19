import React, { Fragment, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { yellow, red, blue } from '@material-ui/core/colors';
import MaterialTable from 'material-table';
import { ListItemIcon, ListItemSecondaryAction, Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    dialog: {
        // minWidth: "500px"
    },
    root: {
        width: '100%',
        //maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    yellow: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500],
    },
    red: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
    },
    blue: {
        color: theme.palette.getContrastText(blue[500]),
        backgroundColor: blue[500],
    },

}));



const FFieldValidationDialoge = React.forwardRef((props, ref) => {

    const [open, setOpen] = React.useState(false);
    const [newData, setData] = React.useState([{}])
    const [message, setMessage] = React.useState("");
    const [extMessage, setExtMessage] = React.useState("");
    const [warnings, setWarnings] = React.useState([]);
    const [questions, setQuestions] = React.useState([]);
    const [infoMessages, setInfoMessages] = React.useState([]);

    React.useImperativeHandle(ref, () => {
        return {
            openDialog: (newData, extMessage, warnings, questions, onCloseCb, onCancelCb, infoMessages) => {
                setData(newData)
                setMessage(message);
                setExtMessage(extMessage);
                setWarnings(warnings);
                setQuestions(questions)
                setInfoMessages(infoMessages);
                OpenDialog()
                onClose.current = onCloseCb;
                onCancel.current = onCancelCb;
            }
        }

    })
    const classes = useStyles();
    const { okButtonText, cancelButtonText } = props;
    const onClose = useRef(null);
    const onCancel = useRef(null);

    const OpenDialog = () => {
        setOpen(true);
    };

    const CloseDialog = (type) => {
        setOpen(false);
        if (type === 'ok' && onClose.current) {
            console.log("result onclose")
            //onClose.current(questions);
        }
        else if (type === 'cancel' && onCancel.current) {
            console.log("result cancel")
            //onCancel.current(questions);
        }
        // else if(type === 'ok' && this.pageMode === 'Add' && mgsId === -1){

        // }

    };
    const handleToggle = (evt, index) => {
        const _questions = [...questions];
        _questions[index].userAnswer = evt.target.checked;
        setQuestions(_questions);
    }

    //console.log("data", newData)
    newData.map((item, i) => {
        //console.log("item", item)
    })

    return (
        <Dialog
            open={open}
            onClose={CloseDialog}
            maxWidth="lg"
            disableBackdropClick={true}
            className={classes.dialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Message</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">

                    {
                        newData.map((name,i)=>(
                            <Typography>{name}</Typography>
                        ))
                    }

                    
                </DialogContentText>
            </DialogContent>


            <DialogActions>
                <Button onClick={() => { CloseDialog('ok') }} color="primary">
                    {okButtonText}
                </Button>

                <Button onClick={() => { CloseDialog('cancel') }} color="primary" autoFocus>
                    {cancelButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
})

FFieldValidationDialoge.propTypes = {
    newData: PropTypes.array,
    message: PropTypes.array,
    okButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    hideCancelButton: PropTypes.bool,
    onOpen: PropTypes.func,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
}

FFieldValidationDialoge.defaultProps = {

    okButtonText: "OK",
    cancelButtonText: "CANCEL",
    hideCancelButton: true
}

export default FFieldValidationDialoge;