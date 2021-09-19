import React, { Component, Fragment } from 'react'
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';


class FinRadioButton extends Component {

    render() {
        return (
            <Fragment>
                <Radio size="small" {...this.props}/>
            </Fragment>
        );
    }
}
export const FRadioButton 
    = React.forwardRef((props, ref) => <FinRadioButton ref={ref} {...props}/>)

FRadioButton.propTypes = {

}

FRadioButton.defaultProps = {

}