import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { reduxForm, Field } from "redux-form";
import XLSX from "xlsx";
import shortid from "shortid";
import PropTypes from 'prop-types';

import * as actions from "actions";
import UploadCompaniesInput from "./UploadCompaniesInput";
import ChoicesTable from "./ChoicesTable";

export class UploadCompaniesModal extends Component {
  state = { open: false };

  close = () => this.setState({ open: false });
  show = () => this.setState({ open: true });

  onSubmit = async (formValues) => {
    const companyChoices = await this.parseSpreadSheet(formValues.companyUpload);
    // update redux store
    await this.props.updateAdmin({ companyChoices: companyChoices });
    // reset companies
    this.props.duplicateCompanies(this.props.auth.companyChoices);
    this.close();
  };

  parseSpreadSheet = (file) => {
    return new Promise((resolve, reject) => {
      // parse the file
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let data = e.target.result;
          data = new Uint8Array(data);
          // read the data fro the file
          const workbook = XLSX.read(data, { type: "array" });
          // get the first worksheet
          const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // convert to json specifying first row as header row
          const array = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
          // reformat to fit companyChoices schema
          const companyChoices = array
            .map((row, index) => {
              // skip header
              if (index !== 0) {
                const choices = [];
                for (let i = 2; i < row.length; i++) {
                  choices.push(row[i]);
                }
                return { _id: shortid.generate(), name: row[0], numberAccepted: row[1], choices: choices };
              }
              return null;
            })
            .filter((row) => (row !== null ? true : false));
          resolve(companyChoices);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  renderInput(formProps) {
    return <UploadCompaniesInput {...formProps.input} />;
  }

  render() {
    const { t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={
          <Button name="Sign up" basic size="small" onClick={this.show}>
            {t("adminDashboard.companyUpload.header")}
          </Button>
        }
        open={open}
        onClose={this.close}
        style={{ width: "500px" }}
      >
        <Modal.Content>
          <Modal.Description>
            <Header>{t("adminDashboard.companyUpload.header")}</Header>
            <p>{t("adminDashboard.companyUpload.prompt")}</p>
            <ChoicesTable
              editable={false}
              group="companies"
              data={[
                { name: "Apple", numberAccepted: "2", choices: ["Sam", "Paul"] },
                { name: "Microsoft", numberAccepted: "1", choices: ["David", "Esther"] }
              ]}
              fixedHeaders={[t("adminDashboard.companies.company"), t("adminDashboard.companies.numberAccepted")]}
            />
          </Modal.Description>
          <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Form.Field>
              <Field name="companyUpload" component={this.renderInput} />
            </Form.Field>
            <div className="modal-actions">
              <Button className="modal-button" color="red" onClick={this.close}>
                <Icon name="cancel" /> {t("studentForms.signupModal.cancel")}
              </Button>
              <Button type="submit" className="modal-button" color="green" onClick={this.handleConfirm}>
                <Icon name="checkmark" /> {t("adminDashboard.companyUpload.submit")}
              </Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

UploadCompaniesModal.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  updateAdmin: PropTypes.func,
  duplicateCompanies: PropTypes.func,
  handleSubmit: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const wrapped1 = connect(
  mapStateToProps,
  actions
)(UploadCompaniesModal);

const wrapped2 = reduxForm({ form: "uploadCompanies" })(wrapped1);
export default withTranslation()(wrapped2);
