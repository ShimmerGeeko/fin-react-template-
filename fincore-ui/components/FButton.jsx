import React from 'react'
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';

/**
 * Primary UI component for user interaction
 */
const FinButton = React.memo(React.forwardRef((props, ref) => {

    //const mode = props.mode || "view";
    // let disabled = true;
    // if (mode === Mode.ADD || mode === Mode.MODIFY) {
    //     console.log(mode)
    //     disabled = false
    // }

    return (
        <Button
            //variant="outlined"
            // disabled={disabled}
            ref={ref}
            {...props}> {props.children}</Button>
    )
}));

export const FButton = React.forwardRef((props, ref) => <FinButton ref={ref} {...props}>{props.children}</FinButton>)

FButton.propTypes = {

    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "secondary", "inherit"]),
    component: PropTypes.elementType,
    disabled: PropTypes.bool,
    disableElevation: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    endIcon: PropTypes.node,
    fullWidth: PropTypes.bool,
    href: PropTypes.string,
    /**
    * Defines the current user action 
    */
    // mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    size: PropTypes.oneOf(["large", "medium", "small", "inherit"]),
    startIcon: PropTypes.node,
    variant: PropTypes.oneOf(["contained", "text", "outlined"]),

    onClick: PropTypes.func,
    onBlur: PropTypes.func
}

FButton.defaultProps = {

    variant: "contained",
    color: "primary"
    //mode: Mode.VIEW
}



