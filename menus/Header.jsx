import * as React from "react";
import logoHeader from "../../images/finacus-logo.png";
import FTopIconMenu from "./FTopIconMenu";
//import * as LoginsStore from "../../store/Logins";
//import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
//import { ApplicationState } from "../../store";
import FCoreMenu from "./menu/FCoreMenu";
import { withTranslation, Trans } from "react-i18next";


//  class Header extends React.PureComponent<LoginProps,{}, { isOpen: boolean }> {
class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userid: "",
      isOpen: false,
    };
  }

  componentDidMount= () => {
    if (!this.state.userid)
      this.setState({ userid: this.props.loginData.UserID });
  };

  componentDidUpdate = () => {
    //if (!this.state.userid)
      this.setState({ userid: this.props.loginData.UserID });
  };

  logout = () => {
    window.location.reload();
  };

  render() {
    return (
      <React.Fragment>
        {/* <Menu size="tiny">
          <Menu.Menu position="right">
            <Menu.Item>
              <img src={logoHeader} alt="FINACUS" />
            </Menu.Item>
            <Menu.Item>
              {this.props.t("Welcome")}: {this.state.userid}
            </Menu.Item>
            <FTopIconMenu />
          </Menu.Menu>
        </Menu>
        <FCoreMenu /> */}

        <div className="ui secondary menu">
          <div className="left" style={{marginTop:10}}>
            <img src={logoHeader} alt="FINACUS" />
          </div>
          <div className="item">
            {this.props.t("Welcome")}: {this.state.userid}
          </div>
          <div className="right item">
            <FTopIconMenu />
          </div>
        </div>
        <FCoreMenu />
      </React.Fragment>
    );
  }

  // private toggle = () => {
  //     this.setState({
  //         isOpen: !this.state.isOpen
  //     });
  // }
}

// export default withTranslation()(
//   connect(
//     (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
//     LoginsStore.actionCreators // Selects which action creators are merged into the component's props
//   )(Header as any)
// );
