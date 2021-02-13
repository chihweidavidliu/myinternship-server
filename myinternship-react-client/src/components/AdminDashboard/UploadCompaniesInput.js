import React, { Component } from "react";
import { Input } from "semantic-ui-react";
import PropTypes from "prop-types";

export class UploadCompaniesInput extends Component {
  onChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // manually pass the uploaded file to the reduxForm onChange function
    this.props.onChange(file);
  };

  render() {
    return <Input type="file" accept=".xlsx, .xls" onChange={this.onChange} className="upload-input" />;
  }
}

UploadCompaniesInput.propTypes = {
  onChange: PropTypes.func // passed down by parent from the formProps.input object
};

export default UploadCompaniesInput;
