import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as actions from "actions";
import requireAdminAuth from "requireAdminAuth";
import ChoicesTable from "./ChoicesTable";

export class AdminStudentView extends Component {
  componentDidMount() {
    // clear error message
    this.props.removeErrorMessage();
    // action creator that fetches all Students - to be passed down to ChoicesTable
    this.props.fetchStudents();
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

  renderTable() {
    const { students, t } = this.props;
    if(students.length > 0) {
      return (
        <ChoicesTable
          editable={false}
          group="students"
          data={students}
          fixedHeaders={[
            t("studentForms.placeholders.studentid"),
            t("studentForms.placeholders.name"),
            t("studentForms.placeholders.department")
          ]}
        />
      )
    }
  }

  render() {
    const { t, auth } = this.props;
    return (
      <React.Fragment>
        <h2>{t("adminDashboard.students.header")}</h2>
        <p>
          {auth.allowStudentChoices
            ? t("adminDashboard.students.choicesEnabled")
            : t("adminDashboard.students.choicesDisabled")}
        </p>
        {this.renderError()}
        <div className="table-container">
          {this.renderTable()}
        </div>
      </React.Fragment>
    );
  }
}

AdminStudentView.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  students: PropTypes.array,
  authMessage: PropTypes.string,
  removeErrorMessage: PropTypes.func, // action creator
  fetchStudents: PropTypes.func // action creator
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    students: state.students,
    authMessage: state.authMessage
  };
};

const wrapped = connect(
  mapStateToProps,
  actions
)(requireAdminAuth(AdminStudentView));
export default withTranslation()(wrapped);
