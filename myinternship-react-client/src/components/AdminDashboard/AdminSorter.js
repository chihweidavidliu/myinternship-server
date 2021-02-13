import React, { Component, Fragment } from "react";
import { Message, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";

import ChoicesTable from "./ChoicesTable";
import * as actions from "actions";
import { sorter } from "./sorter";

export class AdminSorter extends Component {
  state = { students: [], companyChoices: {}, tentativeAdmits: {}, consoleContents: [], sortFinished: false };

  async componentDidMount() {
    await this.props.fetchStudents();
    // set students in state, adding a resolved key/value pair
    const students = this.props.students.map((student) => {
      return { ...student, resolved: false };
    });
    this.setState({ students: students });

    // set companyChoices and tentativeAdmits in state
    const companyChoices = {};
    const tentativeAdmits = {};
    this.props.auth.companyChoices.forEach((company) => {
      companyChoices[company.name] = company;
      tentativeAdmits[company.name] = [];
    });
    this.setState({ companyChoices: companyChoices, tentativeAdmits: tentativeAdmits });
  }

  startSort = async () => {
    if (this.state.sortFinished === true) {
      return;
    }
    console.log(this.state);
    // deep copy state
    const students = JSON.parse(JSON.stringify(this.state.students));
    const companyChoices = JSON.parse(JSON.stringify(this.state.companyChoices));
    const tentativeAdmits = JSON.parse(JSON.stringify(this.state.tentativeAdmits));
    const results = await sorter.sort(students, companyChoices, tentativeAdmits, this.logger);
    await this.setState(results);
    console.log("newState", this.state);
  };

  logger = (type, text) => {
    const item = { type: type, text: text };
    const newContents = [...this.state.consoleContents, item];
    // for some reason the logger is erasing previous values
    this.setState({ consoleContents: newContents });
  };

  outputResults = () => {
    const { t } = this.props;
    const { students, tentativeAdmits } = this.state;
    // format data into 2d array
    const finalStudentOutcomes = [
      [
        t("studentForms.placeholders.studentid"),
        t("studentForms.placeholders.name"),
        t("studentForms.placeholders.department"),
        t("adminDashboard.students.choice")
      ],
      ...students.map((student) => {
        return [student.studentid, student.name, t(student.department), student.choices[0]];
      })
    ];

    let finalCompanyChoices = Object.keys(tentativeAdmits).map((company) => {
      return [company, ...tentativeAdmits[company]];
    });

    // add headers by calculating longest array to see how many choices headers needed
    let longestArray = [];
    finalCompanyChoices.forEach((company) => {
      if (company.length > longestArray.length) {
        longestArray = company;
      }
    });
    const headers = [t("adminDashboard.companies.company")];

    let count = 1;
    while (headers.length < longestArray.length) {
      headers.push(`${t("adminDashboard.students.choice")} ${count}`);
      count++;
    }

    finalCompanyChoices = [headers, ...finalCompanyChoices];

    // Create new workbook
    const workbook = XLSX.utils.book_new();
    workbook.props = {
      Title: "MyInternship Results"
    };

    // create student outcomes worksheet
    workbook.SheetNames.push(t("adminDashboard.sorter.finalStudentOutcomes"));
    const worksheet_data = finalStudentOutcomes;
    const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
    workbook.Sheets[t("adminDashboard.sorter.finalStudentOutcomes")] = worksheet;

    // create company choices worksheet
    workbook.SheetNames.push(t("adminDashboard.sorter.finalCompanyChoices"));
    const worksheet_data2 = finalCompanyChoices;
    const worksheet2 = XLSX.utils.aoa_to_sheet(worksheet_data2);
    workbook.Sheets[t("adminDashboard.sorter.finalCompanyChoices")] = worksheet2;

    // convert to binary
    const output = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    // convert to octet
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    }

    saveAs(
      new Blob([s2ab(output)], { type: "application/octet-stream" }),
      `${t("adminDashboard.sorter.output.fileName")} ${new Date().toLocaleDateString()}.xlsx`
    );
  };

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

  renderConsole() {
    return this.state.consoleContents.map((item, index) => {
      if (item.type === "tentativeAdmits") {
        return (
          <li key={index} className={`console-${item.type}`}>
            <u>{item.text.company}</u>: {item.text.list}
          </li>
        );
      }
      return (
        <li key={index} className={`console-${item.type}`}>
          {item.text}
        </li>
      );
    });
  }

  renderActions() {
    const { t } = this.props;
    if (this.state.sortFinished === true) {
      return (
        <React.Fragment>
          <Button id="startSort-button" basic size="small" onClick={this.startSort}>
            {t("adminDashboard.sorter.startSort")}
          </Button>
          <Button id="saveOutput-button" basic size="small" onClick={this.outputResults}>
            {t("adminDashboard.sorter.saveOutput")}
          </Button>
        </React.Fragment>
      );
    }
    return (
      <Button basic size="small" onClick={this.startSort}>
        {t("adminDashboard.sorter.startSort")}
      </Button>
    );
  }

  renderOutput() {
    const { t } = this.props;
    const { students, tentativeAdmits } = this.state;
    // format data to be readable by ChoicesTable
    const finalCompanyChoices = Object.keys(tentativeAdmits).map((company) => {
      return { name: company, choices: tentativeAdmits[company] };
    });
    // remove all choices but first from student
    const finalStudentOutcomes = students.map((student) => ({ ...student, choices: [student.choices[0]] }));

    if (this.state.sortFinished === true) {
      // return tentative admits and student choices
      return (
        <React.Fragment>
          <h3>{t("adminDashboard.sorter.finalStudentOutcomes")}</h3>
          <ChoicesTable
            editable={false}
            group="students"
            data={finalStudentOutcomes}
            fixedHeaders={[
              t("studentForms.placeholders.studentid"),
              t("studentForms.placeholders.name"),
              t("studentForms.placeholders.department")
            ]}
          />
          <h3>{t("adminDashboard.sorter.finalCompanyChoices")}</h3>
          <ChoicesTable
            editable={false}
            group="companies"
            data={finalCompanyChoices}
            fixedHeaders={[t("adminDashboard.companies.company")]}
          />
        </React.Fragment>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <h2>{t("adminDashboard.sorter.header")}</h2>
        {this.renderError()}
        <div className="actions-bar">{this.renderActions()}</div>
        <div className="sorter-container">
          <div className="sorter-box">
            <h3>Console</h3>
            <div id="console" className="sorter-display">
              <ul>{this.renderConsole()}</ul>
            </div>
          </div>
          <div className="sorter-box">
            <h3>Output</h3>
            <div id="output" className="sorter-display">
              {this.renderOutput()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

AdminSorter.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  authMessage: PropTypes.string,
  students: PropTypes.array,
  fetchStudents: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    authMessage: state.authMessage,
    students: state.students
  };
};
const wrapped = connect(
  mapStateToProps,
  actions
)(AdminSorter);
export default withTranslation()(wrapped);
