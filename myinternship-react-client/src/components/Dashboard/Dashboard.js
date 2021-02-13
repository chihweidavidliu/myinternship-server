import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";
import PropTypes from "prop-types";

import * as actions from "actions";
import requireStudentAuth from "requireStudentAuth";
import Navbar from "./Navbar";
import SharedList from "./SharedList";
import ChoicesModal from "./ChoicesModal";

export class Dashboard extends Component {
  async componentDidMount() {
    await this.props.removeErrorMessage();
    this.props.fetchCompanies();
  }

  handleConfirm = () => {};

  renderError() {
    const { authMessage, t } = this.props;
    if (authMessage) {
      let header;
      let error;
      // if the message is merely a warning about disabled choices, change header and turn error to false
      if (authMessage === "dashboard.errors.choicesDisabled.message") {
        error = false;
        header = t("dashboard.errors.choicesDisabled.header");
      } else {
        error = true;
        header = t("studentForms.formErrors.errorHeader");
      }
      return (
        <Message
          style={{ marginBottom: "15px", width: "80%" }}
          error={error}
          header={header}
          content={t(authMessage)}
        />
      );
    }
  }
  renderChoices() {
    if (this.props.companies) {
      const { t } = this.props;
      return (
        <React.Fragment>
          <div id="company-choices">
            <div id="choices">
              <h2>{t("dashboard.choices")}</h2>
              <p>{t("dashboard.choicesPrompt")}</p>
              <SharedList
                items={this.props.auth.choices}
                onChange={(order, sortable, evt) => {
                  // action creator to submit choices
                  this.props.updateStudentChoices(order);
                }}
                listType="ol"
                type="choices"
              />
            </div>
            <div id="options">
              <h2>{t("dashboard.options")}</h2>
              <p>{t("dashboard.optionsPrompt")}</p>
              <SharedList
                items={this.props.companies}
                onChange={(order, sortable, evt) => {
                  this.setState({ options: order });
                }}
                listType="ul"
                type="options"
              />
            </div>
          </div>
          <ChoicesModal auth={this.props.auth} choices={this.props.auth.choices} />
        </React.Fragment>
      );
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div className="dashboard-container">
        <Navbar auth={this.props.auth} />
        <div className="dashboard-flex-box">
          <div className="main-box">
            <h1>{t("dashboard.header")}</h1>
            {this.renderError()}
            {this.renderChoices()}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  authMessage: PropTypes.string,
  companies: PropTypes.array,
  removeErrorMessage: PropTypes.func,
  fetchCompanies: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    authMessage: state.authMessage,
    companies: state.companies
  };
};

const wrapped = connect(
  mapStateToProps,
  actions
)(requireStudentAuth(Dashboard));
export default withTranslation()(wrapped);
