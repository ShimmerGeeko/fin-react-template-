import React, { Component, Fragment } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';

class FinDataGrid extends Component {

    render(){
        return (
            <Fragment>
                <MaterialTable {...this.props}/>
            </Fragment>

        );
    }
}

export const FDataGrid 
    = React.forwardRef((props, ref) => <FinDataGrid ref={ref} {...props}/>)

FDataGrid.propTypes = {

}

FDataGrid.defaultProps = {

}