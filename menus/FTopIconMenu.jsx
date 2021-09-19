import React, { Component } from 'react';
import { Menu, Icon, Input } from 'semantic-ui-react'
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import { withTranslation, Trans } from "react-i18next";
import i18n from "i18next";


//class FTopIconMenu extends Component<RouteComponentProps<any>>{
class FTopIconMenu extends Component{
    state = { activeItem: 'gamepad' }
    //handleItemClick = (e:any, data:any) =>
    handleItemClick = (e, data) =>
    { this.setState({ activeItem: data.name })
      if (data.name==="logout")
      window.location.reload();
      else
      alert('Development in process..');
    }
    render() {

        const { activeItem } = this.state

        return (
            <Menu size="tiny" >
                <Menu.Menu  position="right">
                    <Menu.Item>
                        <Input icon='search' placeholder={i18n.t("Search")} />
                    </Menu.Item>
                    
                    <Menu.Item name='lock' active={activeItem === 'lock'} onClick={this.handleItemClick}>
                        <Tooltip title={i18n.t("Lock Screen")}>
                            <Icon name='lock' />
                        </Tooltip>    
                        {/* Lock Screen */}
                    </Menu.Item>
                    <Menu.Item name='calc' active={activeItem === 'calc'} onClick={this.handleItemClick}>
                        <Tooltip title={i18n.t("EMI Calculator")}>
                            <Icon name='calculator' />
                        </Tooltip>   
                        {/* EMI Calculator */}
                    </Menu.Item>
                    <Menu.Item name='tdCalc' active={activeItem === 'tdCalc'} onClick={this.handleItemClick}>
                        
                        <Tooltip title={i18n.t("TD Calculator")}>
                            <Icon name='percent' />
                        </Tooltip>    
                        {/* TD Calculator */}
                    </Menu.Item>
                    <Menu.Item name='prevWF' active={activeItem === 'prevWF'} onClick={this.handleItemClick}>
                        
                        <Tooltip title={i18n.t("Previous Workflow")}>
                            <Icon name='caret square left' />
                        </Tooltip>    
                        {/* Previous Workflow */}
                    </Menu.Item>
                    <Menu.Item name='nextWF' active={activeItem === 'nextWF'} onClick={this.handleItemClick}>
                        
                        <Tooltip title={i18n.t("Next Workflow")}>
                            <Icon name='caret square right' />
                        </Tooltip>    
                        {/* Next Workflow */}
                    </Menu.Item>
                    <Menu.Item name='wfList' active={activeItem === 'wfList'} onClick={this.handleItemClick}>
                        
                        <Tooltip title={i18n.t("Workflow List")}>
                            <Icon name='list alternate' />
                        </Tooltip>    
                        {/* Workflow List */}
                    </Menu.Item>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
                        
                        <Tooltip title={i18n.t("Home")}>
                            <Icon name='home' />
                        </Tooltip>    
                        {/* Home */}
                    </Menu.Item>

                    <Menu.Item
                        name='logout'
                        active={activeItem === 'logout'}
                        onClick={this.handleItemClick}>
                        <Tooltip title={i18n.t("Logout")}>
                            <Icon name='close' />
                        </Tooltip>    
                        
                        {/* Logout */}
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default withRouter(FTopIconMenu)