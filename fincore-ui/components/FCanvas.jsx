import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, makeStyles } from '@material-ui/core';
import { Label } from 'semantic-ui-react'

const useStyles = makeStyles((theme) => {
    return {
        container: {
            //border: "2px solid",
            //   margin: "10px",
            //   padding: "38px"
            // backgroundColor: "red"
        },
        paper: {
            //margin: theme.spacing(0.1),
            padding: theme.spacing(2)
        }
    }
})

export const FormContext = React.createContext({
    disabled: false
})
const FinCanvas = function (props, ref) {

    const classes = useStyles();
    return (
        <FormContext.Provider value={{ disabled: props.disabled }}>
            {props.mode === "key" ?

                <Grid item xs={12}>
                    <Box border={1} paddingTop={2} paddingBottom={1} paddingLeft={1} paddingRight={1} borderColor="black">
                        <Grid container>
                            <Grid item xs={1}>
                                <Label as='div' color='orange' ribbon>
                                     {props.label}
                                </Label>
                            </Grid>
                            <Grid container item xs={11} spacing={2}
                                className={classes.container} justify={props.justify} alignItems="center">

                                {props.children}

                            </Grid>

                        </Grid>
                    </Box>
                </Grid>

                :

                <Grid item xs={12}>
                    <Box border={1} paddingTop={2} paddingBottom={1} paddingLeft={1} paddingRight={1} borderColor="black">
                        <Grid container item xs={12} spacing={2}
                            className={classes.container} justify={props.justify} alignItems="center">

                            {props.children}

                        </Grid>
                    </Box>
                </Grid>}
        </FormContext.Provider>
    )
}

export const FCanvas = React.forwardRef((props, ref) => <FinCanvas ref={ref} {...props} />);

FCanvas.propTypes = {
    disabled: PropTypes.bool,
    justify: PropTypes.string,
    mode: PropTypes.oneOf(["key", "nkey"]),
    label: PropTypes.string
}
FCanvas.defaultProps = {
    disabled: false,
    justify: "flex-start",
    mode: "nkey"
}