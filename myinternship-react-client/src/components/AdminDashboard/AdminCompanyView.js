import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Message } from "semantic-ui-react";
import PropTypes from "prop-types";

import * as actions from "actions";
import ChoicesTable from "./ChoicesTable";
import TableToolbar from "./TableToolbar";

export class AdminCompanyView extends Component {
  saveChanges = async () => {
    // filter out empty strings in choices array
    const updatedCompanies = this.props.companies.map((company) => {
      const filteredChoices = company.choices.filter((choice) => {
        return choice !== "";
      });
      // replace each company's choices array with the filtered one (non-mutating)
      return { ...company, choices: filteredChoices };
    });
    //update db
    await this.props.updateAdmin({ companyChoices: updatedCompanies });
    this.props.markChangesAsSaved();
  };

  componentDidMount() {
    if (this.props.auth) {
      // put companies array in a separate part of redux store to monitor unstage edits before being committed to companyChoices in auth
      this.props.duplicateCompanies(this.props.auth.companyChoices);
      // dismiss any previous unsaved changes prompts (as any previous unmounting of component will have cleared all unsaved changes anyway)
      this.props.markChangesAsSaved();
    }
  }

  renderError() {
    const { authMessage, t } = this.props;
    if (authMessage) {
      return (
        <Message
          style={{ marginBottom: "15px", width: "80%" }}
          error
          header={t("studentForms.formErrors.errorHeader")}
          content={t(authMessage)}
        />
      );
    }
  }

  renderSavePrompt() {
    const { t } = this.props;
    if (this.props.unsavedChanges) {
      return (
        <Message
          style={{ marginBottom: "15px", marginTop: "0px", width: "80%" }}
          content={t("adminDashboard.companies.savePrompt")}
          color="yellow"
        />
      );
    }
  }
  renderTable() {
    // get companies from state - need to put companies in state
    const { companies } = this.props;
    const { t } = this.props;

    if (companies && companies.length > 0) {
      return (
        <ChoicesTable
          editable={true}
          group="companies"
          data={companies}
          fixedHeaders={[null, t("adminDashboard.companies.company"), t("adminDashboard.companies.numberAccepted")]}
        />
      );
    }
  }
  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <h2>{t("adminDashboard.companies.header")}</h2>
        {this.renderSavePrompt()}
        {this.renderError()}
        <TableToolbar t={t} saveChanges={this.saveChanges} />
        <div className="table-container">{this.renderTable()}</div>
      </React.Fragment>
    );
  }
}

AdminCompanyView.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  authMessage: PropTypes.string,
  companies: PropTypes.array,
  unsavedChanges: PropTypes.bool,
  duplicateCompanies: PropTypes.func, // action creator to duplicate companies for staging edits
  updateAdmin: PropTypes.func, // action creator to save changes to admin on committing duplicated companies
  markChangesAsSaved: PropTypes.func, // action creator to set unsavedChanges to false
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    authMessage: state.authMessage,
    companies: state.companies,
    unsavedChanges: state.unsavedChanges
  };
};

const wrapped = connect(
  mapStateToProps,
  actions
)(AdminCompanyView);
export default withTranslation()(wrapped);
