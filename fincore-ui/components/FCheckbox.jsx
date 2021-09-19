import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
//import { Mode } from '../helpers/Mode';
import PropTypes from 'prop-types';


const FinCheckbox = React.memo(React.forwardRef((props, ref) => {

   

    return (
        <Checkbox ref={ref} {...props}/>
    )
}));

export const FCheckbox = (props) => <FinCheckbox {...props}/>

FCheckbox.propTypes = {

    checked: PropTypes.bool,
    checkedIcon: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "primary", "secondary"]),
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    icon: PropTypes.node,
    indeterminate: PropTypes.bool,
    indeterminateIcon: PropTypes.node,
    inputProps: PropTypes.object,
    inputRef: PropTypes.oneOfType([
        PropTypes.func, 
        PropTypes.shape({ current: PropTypes.any })
    ]),
    onChange: PropTypes.func,
    required: PropTypes.bool,

    /**
    * Defines the current user action 
    */
    //mode: PropTypes.oneOf(["add", "modify", "delete", "view", "authorize"]),
    size: PropTypes.oneOf(["medium", "small"]),
    startIcon: PropTypes.node,
    value: PropTypes.any,
}

FCheckbox.defaultProps = {
    //mode: Mode.VIEW
}