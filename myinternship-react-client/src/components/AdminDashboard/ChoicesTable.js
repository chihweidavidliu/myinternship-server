import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

import TableRow from "./TableRow";
import addEmptyValues from "./addEmptyValues";

export class ChoicesTable extends Component {
  state = { companies: [], students: [] };

  async componentDidMount() {
    // identify what group we are dealing with (students/companies)
    const { group, data } = this.props;
    // get the data for the group passed down as a props
    await this.setState({ [group]: data });
    // format the data
    this.formatAndUpdateTable(this.state[group]);
  }

  // match component state to redux store
  async componentDidUpdate(prevProps) {
    const { group, data } = this.props;
    if (data !== prevProps.data) {
      await this.setState({ [group]: data });
      // format the data
      this.formatAndUpdateTable(this.state[group]);
    }
  }

  formatAndUpdateTable = (choices) => {
    // choices = either companies or students in state
    const { group } = this.props;
    const longestArray = this.getLongestChoicesArray();
    // pad out each choices array with empty strings to fill up each cell of the table
    const padded = addEmptyValues(choices, longestArray);
    // update the relevant group with the padded data
    this.setState({ [group]: padded });
  };

  getLongestChoicesArray() {
    // get the longest choices array of either companies or students, based on 'group' prop value
    const { data } = this.props;
    let longestArray = [];
    data.forEach((member) => {
      if (member.choices.length > longestArray.length) {
        longestArray = member.choices;
      }
    });
    return longestArray;
  }

  // renders fixed headers like name/company/id/numberAccepted to be passed down from parent as array
  renderFixedHeaders() {
    const { fixedHeaders } = this.props;
    return fixedHeaders.map((header, index) => {
      return <Table.HeaderCell key={index}>{header}</Table.HeaderCell>;
    });
  }
  renderChoiceHeaders() {
    const { group, t } = this.props;
    if (group) {
      // find longest student choices array
      const longestArray = this.getLongestChoicesArray();
      return longestArray.map((choice, index) => {
        return <Table.HeaderCell key={index}>{`${t("adminDashboard.students.choice")} ${index + 1}`}</Table.HeaderCell>;
      });
    }
  }

  renderTableRows() {
    const { group, t, editable } = this.props;
    // get data of the specified group from state
    const data = this.state[group];
    if (data) {
      return data.map((item, index) => {
        return (
          <TableRow
            key={`table-row ${index}`}
            id={`table-row ${index}`}
            group={group}
            target={item}
            editable={editable}
            t={t}
          />
        );
      });
    }
  }

  render() {
    return (
      <Table size="small" celled striped >
        <Table.Header>
          <Table.Row>
            {this.renderFixedHeaders()}
            {this.renderChoiceHeaders()}
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.renderTableRows()}</Table.Body>
      </Table>
    );
  }
}

ChoicesTable.propTypes = {
  t: PropTypes.func,
  editable: PropTypes.bool,
  group: PropTypes.oneOf(["students", "companies"]),
  data: PropTypes.array,
  fixedHeaders: PropTypes.array
};

export default withTranslation()(ChoicesTable);
