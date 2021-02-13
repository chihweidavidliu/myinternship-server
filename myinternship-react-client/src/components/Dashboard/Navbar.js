import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import PropTypes from "prop-types";

import LanguageSelector from "components/LanguageSelector";

export class Navbar extends Component {
  renderInfo(info) {
    const { t } = this.props;
    if(this.props.auth) {
      if(info === "department") {
        return `${t(`studentForms.placeholders.${info}`)} : ${t(this.props.auth[`${info}`])}`
      }
      return `${t(`studentForms.placeholders.${info}`)} : ${this.props.auth[`${info}`]}`
    }
  }

  render() {
    const { t } = this.props;

    return (
      <Menu fluid borderless stackable inverted className="navbar">
        <Menu.Item>
          <Link to="/dashboard">
            <h3>MyInternship</h3>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <LanguageSelector />
        </Menu.Item>
        <Menu.Item>
          <p>{this.props.auth.name}</p>
        </Menu.Item>
        <Menu.Item>
          <p>{this.renderInfo("studentid")}</p>
        </Menu.Item>
        <Menu.Item>
          <p>{this.renderInfo("department")}</p>
        </Menu.Item>

        <Menu.Item position="right">
          <a href="/auth/logout">{t("dashboard.signout")}</a>
        </Menu.Item>
      </Menu>
    );
  }
}

Navbar.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object
};

export default withTranslation() (Navbar);
