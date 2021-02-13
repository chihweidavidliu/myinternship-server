import React from "react";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import UploadCompaniesModal from "./UploadCompaniesModal";
import * as actions from "actions";

export const TableToolbar = (props) => {
  const { addRow, addChoice, removeChoice, saveChanges, t, companies } = props;
  return (
    <div className="actions-bar">
      <Button className="addRow-button" basic size="small" onClick={() => addRow(companies)}>
        {t("adminDashboard.tableActions.addRow")}
      </Button>
      <Button className="addChoice-button" basic size="small" onClick={addChoice}>
        {t("adminDashboard.tableActions.addChoice")}
      </Button>
      <Button className="removeChoice-button" basic size="small" onClick={removeChoice}>
        {t("adminDashboard.tableActions.removeChoice")}
      </Button>
      <UploadCompaniesModal />
      <Button
        className="saveChanges-button"
        basic
        size="small"
        onClick={saveChanges}
        color={props.unsavedChanges ? "yellow" : null}
      >
        {t("adminDashboard.tableActions.save")}
      </Button>
    </div>
  );
};

TableToolbar.propTypes = {
  t: PropTypes.func,
  unsavedChanges: PropTypes.bool,
  companies: PropTypes.array,
  addRow: PropTypes.func,
  addChoice: PropTypes.func,
  removeChoice: PropTypes.func,
  saveChanges: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    unsavedChanges: state.unsavedChanges,
    companies: state.companies
  };
};

export default connect(
  mapStateToProps,
  actions
)(TableToolbar);
