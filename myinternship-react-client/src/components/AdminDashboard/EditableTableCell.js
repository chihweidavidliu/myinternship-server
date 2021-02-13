import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "actions";

export class EditableTableCell extends Component {
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // if user hits enter, prevent new paragraph and deblur todo
      e.preventDefault();
      e.target.blur();
    }
  };

  render() {
    return (
      <Table.Cell
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) =>
          this.props.updateCell(this.props.target._id, this.props.category, e.target.innerText, this.props.index)
        }
        onKeyPress={this.handleKeyPress}
      >
        {this.props.content}
      </Table.Cell>
    );
  }
}

EditableTableCell.propTypes = {
  contentEditable: PropTypes.bool,
  suppressContentEditableWarning: PropTypes.bool,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  updateCell: PropTypes.func, // action creator
  category: PropTypes.string, // choices or name, numberAccepted etc.
  index: PropTypes.number, // to help identify which choice has been edited
  content: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // the specific value of the cell
  target: PropTypes.object // the object containing all row data for the student/company
};

export default connect(null, actions)(EditableTableCell);
