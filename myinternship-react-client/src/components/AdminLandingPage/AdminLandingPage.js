import React, { Component } from "react";
import { connect } from "react-redux";
import { Message } from "semantic-ui-react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

import history from "history.js";
import * as actions from "actions";
import LanguageSelector from "components/LanguageSelector";
import AdminSignInForm from "./AdminSignInForm";
import AdminSignUpForm from "./AdminSignUpForm";

export class AdminLandingPage extends Component {
  state = { allowSignup: false };

  async componentDidMount() {
    await this.props.checkNumberOfAdmins();
    if (this.props.numberOfAdmins === 0) {
      // only allow admin signup if there are no admins in database
      this.setState({ allowSignup: true });
    }
  }

  handleSignin = async (formValues) => {
    await this.props.adminSignin(formValues);
    if (this.props.auth) {
      history.push("/admin/dashboard");
    }
  };

  renderForm() {
    if (this.state.allowSignup === true) {
      // pass down the adminSignup action creator to signup form
      return <AdminSignUpForm adminSignup={this.props.adminSignup} />;
    }
    return <AdminSignInForm handleSignin={this.handleSignin} />;
  }

  renderError() {
    const { authMessage, t } = this.props;
    if (authMessage) {
      return (
        <Message
          style={{ marginBottom: "15px" }}
          error
          header={t("studentForms.formErrors.errorHeader")}
          content={authMessage}
        />
      );
    }
  }

  render() {
    return (
      <div className="flex-container">
        <LanguageSelector position="language-selector-top" />
        <div className="box">
          <h1>My Internship Admin</h1>
          <div className="error-box">{this.renderError()}</div>
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

AdminLandingPage.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), // false after failed auth,
  authMessage: PropTypes.string,
  numberOfAdmins: PropTypes.number,
  checkNumberOfAdmins: PropTypes.func // action creator to see if signup is allowed
};

const mapStatetoProps = (state) => {
  return {
    auth: state.auth,
    authMessage: state.authMessage,
    numberOfAdmins: state.numberOfAdmins
  };
};

const wrapped = connect(
  mapStatetoProps,
  actions
)(AdminLandingPage);
export default withTranslation()(wrapped);
