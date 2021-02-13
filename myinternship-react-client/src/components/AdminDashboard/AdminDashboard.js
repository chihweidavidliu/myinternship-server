import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

import requireAdminAuth from "requireAdminAuth";
import AdminNavbar from "./AdminNavbar";
import AdminStudentView from "components/AdminDashboard/AdminStudentView";
import AdminCompanyView from "components/AdminDashboard/AdminCompanyView";
import AdminSorter from "components/AdminDashboard/AdminSorter";
import AdminSettings from "./AdminSettings";

export class AdminDashboard extends Component {
  render() {
    return (
      <div className="dashboard-container">
        <AdminNavbar />
        <div className="dashboard-flex-box">
          <div className="main-box-admin">
            <Route path="/admin/dashboard" exact component={AdminStudentView} />
            <Route path="/admin/dashboard/sorter" exact component={AdminSorter} />
            <Route path="/admin/dashboard/companies" exact component={AdminCompanyView} />
            <Route path="/admin/dashboard/settings" exact component={AdminSettings} />
          </div>
        </div>
      </div>
    )
  }
}

AdminDashboard.propTypes = {
  t: PropTypes.func
};


const wrapped = requireAdminAuth(AdminDashboard);
export default withTranslation()(wrapped);
