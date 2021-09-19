import React, { Component, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Menu, Dropdown, Input } from 'semantic-ui-react'
import { withRouter } from 'react-router';
import FDropdownItem from './FDropdownItem';
import { listToTree } from './listToTree';
import { withTranslation } from 'react-i18next';
import 'semantic-ui-css/semantic.min.css'
import './FCoreMenu.css';
//import {connect} from 'react-redux';

var chuckSize = 10;
function MenuList(props) {

    const { item, index, generateNextLevel, level, parent } = props;
    const [currentIndex, setCurrentIndex] = useState(-1);
    const totalCount = useRef(0);
    const dropDownRef = useRef(null);
    var chunks = useRef([]);
    

    useEffect(() => {
        totalCount.current = item.Children.length;
        console.log("totalCount", item.Description, totalCount);

        for (var i = 0; i < item.Children.length; i += chuckSize) {
            chunks.current.push(item.Children.slice(i, i + chuckSize));
        }
        console.log(item.Description, chunks.current);
        setCurrentIndex(0);

    }, []);

    function getNextItemsCount() {
        //chunks.current.slice(currentIndex, chunks.length.length);

        const next = chunks.current.slice(currentIndex + 1, chunks.current.length);
     //   console.log(next);
        const nextCount = [].concat.apply([], next);
    //    console.log(nextCount);
        return nextCount.length;
    }
    function getPrevItemsCount() {
        //chunks.current.slice(currentIndex, chunks.length.length);

        const prev = chunks.current.slice(0, currentIndex);
      //  console.log(prev);
        const prevCount = [].concat.apply([], prev);
     //   console.log(prevCount);
        return prevCount.length;
    }

    function getDropdownRef() {
        return dropDownRef.current;
    }

    function next(e) {
        
       
        setCurrentIndex(currentIndex + 1);
        
        if (level === 1) {
            setTimeout(() => {
                dropDownRef.current.open();
            }, 1);
           
        }

        if (level === 2) {

            setTimeout(() => {

                if (parent && parent !== null) {
                    parent().open();
                }
                dropDownRef.current.open();
            }, 1);
        }
        


    }
    function previous() {

        
        setCurrentIndex(currentIndex - 1);

        if (level === 1) {
            setTimeout(() => {
                dropDownRef.current.open();
            }, 1);
            return;
        }

        if (level === 2) {

            setTimeout(() => {
                if (parent && parent !== null) {
                    parent().open();
                }

                dropDownRef.current.open();
            }, 1);
        }


    }
    function reset(){

        
    }

    if (chunks.current.length > 0) {
        return (

            <Dropdown aria-hidden="false" key={index} item text={item.Description} ref={dropDownRef} 
                                                                                        onClick={reset}>
                <Dropdown.Menu>
                    {chunks.current[currentIndex].map((child, index) => {

                        return generateNextLevel(child, index, getDropdownRef)

                    })}
                    {currentIndex !== 0 || currentIndex !== (chunks.current.length - 1) ? <Dropdown.Divider /> : null}
                    {currentIndex !== 0 ? <div role="option" onClick={previous} className="item"><span className="menu-nav-prev text">{"Previous (" + getPrevItemsCount() + " items)"}</span></div> : null}
                    {currentIndex !== (chunks.current.length - 1) ? <div role="option" onClick={next} className="item"><span className="menu-nav-next text">{"Next (" + getNextItemsCount() + " items)"}</span></div> : null}
                    {/* <div role="listbox" onClick={next} class="ui dropdown item">More...</div> */}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
    else {
        return null;
    }

}


class FCoreMenu extends Component {

    constructor(props) {
        super(props)
        console.log(this.props);
    }
    state = {

        allMenus: [],

    }
    async componentDidMount() {
        let url = process.env.REACT_APP_MENU_API_URL;
        const data = { GroupId: "99" }
        try {


            const resp = await axios.post(url || "", data);
            const result = await resp.data;
            //this.props.saveMenu(result);

            let id = 1;
            let levelOneRoot;
            let levelTwoRoot;
            let levelThreeRoot;
            //let levelFourRoot;
            let modified = result.map((item, index) => {

                const { level, MenuType, PageName, Add, Modify, Delete, Inquire, Authorize } = item;
                if (level === 1 && MenuType === 1) {
                    item.ParentId = 0;
                    item.IsParent = true;
                    levelOneRoot = item;
                }
                if (level === 2 && PageName) {
                    item.ParentId = levelOneRoot.Id;
                    item.IsParent = false;
                }
                if (level === 2 && !PageName) {
                    item.ParentId = levelOneRoot.Id;
                    item.IsParent = true;
                    levelTwoRoot = item;
                }
                if (level === 3 && !PageName) {
                    item.ParentId = levelTwoRoot.Id;
                    item.IsParent = true;
                    levelThreeRoot = item;
                }
                if (level === 3 && PageName) {
                    item.ParentId = levelTwoRoot.Id;
                    item.IsParent = false;
                }
                if (level === 4) {
                    item.ParentId = levelThreeRoot.Id;
                    item.IsParent = false;
                }
                item.Id = id;
                item.Children = [];
                item.CRUD = Add || Modify || Delete || Inquire || Authorize;
                id++;
                return item;
            });
            console.log("Modified", modified)
            const tree = listToTree(modified, {
                idKey: "Id", parentKey: "ParentId", childrenKey: "Children"
            })

            this.setState({
                allMenus: tree
            })

            console.log("allmenus -", this.state.allMenus)
        } catch (error) {
            console.log("Failed to load menu");
        }
    }

    generateMenu = () => {

        const { allMenus } = this.state;

        return allMenus.map((item, index) => {

            return (

                <MenuList level={1} item={item} index={index} generateNextLevel={this.generateNextLevel} />
            );

        });
    }
    generateNextLevel = (item, index, parentRef) => {

        const { PageName, CRUD, Add, Modify, Delete, Inquire, Authorize } = item;
        if (PageName && !CRUD) {

            return (
                <FDropdownItem screen={"/" + PageName.replace('.xaml', '')}
                    key={index} pageName={PageName}>{item.Description}</FDropdownItem>

            );
        }
        if (PageName && CRUD) {

            return (

                <Dropdown key={index} text={item.Description} openOnFocus={false} pointing='left' className="item">
                    <Dropdown.Menu >
                        {Add ? <FDropdownItem pageMode="Add" progMode={1} history={this.props.history} screen={PageName.replace('.xaml', '')}>{this.props.t("Add")}</FDropdownItem> : null}
                        {Modify ? <FDropdownItem pageMode="Modify" progMode={2} history={this.props.history} screen={PageName.replace('.xaml', '')}>{this.props.t("Modify")}</FDropdownItem> : null}
                        {Delete ? <FDropdownItem pageMode="Delete" progMode={4} history={this.props.history} screen={PageName.replace('.xaml', '')}>{this.props.t("Delete")}</FDropdownItem> : null}
                        {Inquire ? <FDropdownItem pageMode="Inquire" progMode={8} history={this.props.history} screen={PageName.replace('.xaml', '')}>{this.props.t("Inquire")}</FDropdownItem> : null}
                        {Authorize ? <FDropdownItem pageMode="Authorize" progMode={16} history={this.props.history} screen={PageName.replace('.xaml', '')}>{this.props.t("Authorize")}</FDropdownItem> : null}
                    </Dropdown.Menu>
                </Dropdown>

            );
        }
        if (!PageName) {
            return (
                <MenuList level={2} item={item}
                    index={index} generateNextLevel={this.generateNextLevel} parent={parentRef} />

            );
        }
    }

    render() {

        const subMenus = this.generateMenu();

        return (
            <Menu
                horizontal="true"
                size="mini"
                color="blue"
                inverted={true}
                style={{ borderRadius: 0, backgroundColor: "#0C56A6" }}
            >
                {subMenus}

                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Input icon='search' placeholder='Search...' />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );

    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {

//         saveMenu: (items)=> {dispatch({type: "SAVE_MENU_ITEMS", items: items})}

//     }
// }

export default withRouter(withTranslation("MenuLabels")(FCoreMenu));

