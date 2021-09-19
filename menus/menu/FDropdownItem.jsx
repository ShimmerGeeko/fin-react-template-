import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router';


class FDropdownItem extends Component {
    
    navigate = () => {
  // debugger;
        console.log("screen name", this.props.screen);
      

        this.props.history.push(this.props.screen, { info: this.props });
       
    }
    render() {

        const { history, screen, mode,pageName, pageMode,staticContext,progMode,location, match, ...props } = this.props;
        return (

            <Dropdown.Item className={screen + progMode}  {...props} onClick={() => this.navigate()} >
            </Dropdown.Item>
        );
    }
}




export default withRouter(FDropdownItem);

