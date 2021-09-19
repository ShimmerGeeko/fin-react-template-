import { Backdrop } from '@material-ui/core';
import React, { Component } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BeatLoader, ClimbingBoxLoader, ClockLoader, BounceLoader, BarLoader, PropagateLoader } from 'react-spinners';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


export const LoadingSpinnerComponent = (props) => {
    const { promiseInProgress } = usePromiseTracker();
    const classes = useStyles();
    return (
        <div>
            <Backdrop className={classes.backdrop} open={promiseInProgress}>
                {/* <CircularProgress color="inherit" /> */}
                {/* <ClockLoader size={80} color="orange"/>
                <BounceLoader size={100} color="orange"/>
                <BeatLoader size={30} color="orange"/> */}
                {/* <BarLoader size={50} color="orange"/> */}
                <BeatLoader size={30} color="orange"/> 
                {/* <PropagateLoader size={30} color="orange" /> */}
            </Backdrop>
        </div>
    )
};