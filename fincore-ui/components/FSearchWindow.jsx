import React, { Component, Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper } from '@material-ui/core';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

function PaperComponent(props) {
    return (
      <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }
// interface FSearchWindowProps {
//     onClose?: () => void,
//     component?: any,
//     contents?: any
//    //open: boolean
// }
class FinSearchWindow extends Component {

    state={
        open : true
    }
    handleClose = () => {
        
        if(this.props.onClose)
            this.props.onClose();
    } 

    render() {

        const {open} = this.state;
        const {contents} = this.props;
        return (
            <Fragment>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                    fullWidth={true}
                    maxWidth="lg">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Search
                    </DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
                        </DialogContentText> */}
                        {contents}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>


            </Fragment>
        );
    }
}
export const FSearchWindow 
    = React.forwardRef((props, ref) => <FinSearchWindow ref={ref} {...props}/>)

FSearchWindow.propTypes = {
    onClose: PropTypes.func,
    component: PropTypes.any,
    contents: PropTypes.any
   //open: boolean
}

FSearchWindow.defaultProps = {
    onClose: () => {},
    component: null
}