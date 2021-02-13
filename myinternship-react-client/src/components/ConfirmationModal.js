import React, { Component } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as actions from "actions";

export class ConfirmationModal extends Component {
  state = { open: false, errorMessage: [] };

  close = () => this.setState({ open: false });
  show = () => this.setState({ open: true });

  handleTriggerClick = async (e) => {
    e.preventDefault(); // prevent form submit
    await this.validate(); // validate the form on modal open
    this.show();
  };

  handleConfirm = async () => {
    // dispatches custom action creator that dispatches redux-form submit method with the relevant form name
    // the submit method will then call the external submit function 'submitSignup' to call the signup action creator with the form values
    let formToSubmit;
    if (this.props.for === "student") {
      formToSubmit = "studentSignup";
    } else {
      formToSubmit = "adminSignup";
    }
    await this.props.submitReduxForm(formToSubmit);
  };

  validate() {
    const { signUpForm } = this.props;
    const { t } = this.props;
    const errorMessage = [];

    if (signUpForm && signUpForm.values) {
      if (this.props.for === "student") {

        if(!signUpForm.values.institutionCode) {
          errorMessage.push(t("studentForms.formErrors.institutionCode.missing"));
        }

        if (!signUpForm.values.studentid) {
          errorMessage.push(t("studentForms.formErrors.studentid.missing"));
        } else if (
          signUpForm.values.studentid.split("")[0] === "s" ||
          signUpForm.values.studentid.split("")[0] === "S"
        ) {
          errorMessage.push(t("studentForms.formErrors.studentid.initialS"));
        }

        if (!signUpForm.values.name) {
          errorMessage.push(t("studentForms.formErrors.name.missing"));
        }

        if (!signUpForm.values.department) {
          errorMessage.push(t("studentForms.formErrors.department.missing"));
        }
      } else {
        // admin case
        if (!signUpForm.values.adminSecret) {
          errorMessage.push(t("adminForms.formErrors.adminSecret.missing"));
        }

        if (!signUpForm.values.username) {
          errorMessage.push(t("adminForms.formErrors.username.missing"));
        }
        if (!signUpForm.values.adminSecret) {
          errorMessage.push(t("adminForms.formErrors.adminSecret.missing"));
        }
      }
      // password needed for both cases
      if (!signUpForm.values.password) {
        errorMessage.push(t("studentForms.formErrors.password.missing"));
      } else if (signUpForm.values.password.length < 6) {
        errorMessage.push(t("studentForms.formErrors.password.tooShort"));
      }

      // set the errorMessage in state to force rerender
      this.setState({ errorMessage: errorMessage });
    } else if (signUpForm && !signUpForm.values) {
      errorMessage.push("Please enter some values");
      this.setState({ errorMessage: errorMessage });
    }
  }

  renderDetails() {
    const { signUpForm, t } = this.props;

    if (signUpForm && !signUpForm.values) {
      return <p>{this.state.errorMessage[0]}</p>;
    } else if (signUpForm && signUpForm.values) {
      if (this.state.errorMessage.length > 0) {
        return this.state.errorMessage.map((error, index) => {
          return <p key={index}>{error}</p>;
        });
      }

      if (this.props.for === "student") {
        return (
          <div>
            <p>
              <strong>{t("studentForms.placeholders.institutionCode")} :</strong> {this.props.signUpForm.values.institutionCode}
            </p>
            <p>
              <strong>{t("studentForms.placeholders.studentid")} :</strong> {this.props.signUpForm.values.studentid}
            </p>
            <p>
              <strong>{t("studentForms.placeholders.name")} :</strong> {this.props.signUpForm.values.name}
            </p>
            <p>
              <strong>{t("studentForms.placeholders.password")} :</strong> {this.props.signUpForm.values.password}
            </p>
            <p>
              <strong>{t("studentForms.placeholders.department")} :</strong>{" "}
              {t(this.props.signUpForm.values.department)}
            </p>
          </div>
        );
      }
      // admin case
      return (
        <div>
          <p>
            <strong>{t("adminForms.placeholders.adminSecret")} :</strong> {this.props.signUpForm.values.adminSecret}
          </p>
          <p>
            <strong>{t("adminForms.placeholders.username")} :</strong> {this.props.signUpForm.values.username}
          </p>
          <p>
            <strong>{t("adminForms.placeholders.password")} :</strong> {this.props.signUpForm.values.password}
          </p>
        </div>
      );
    }
  }

  renderActions() {
    const { t } = this.props;

    if (this.state.errorMessage.length > 0) {
      return (
        <Modal.Actions>
          <Button color="red" onClick={this.close}>
            <Icon name="cancel" /> {t("studentForms.signupModal.dismiss")}
          </Button>
        </Modal.Actions>
      );
    }
    return (
      <Modal.Actions>
        <Button color="red" onClick={this.close}>
          <Icon name="cancel" /> {t("studentForms.signupModal.cancel")}
        </Button>
        <Button color="green" onClick={this.handleConfirm}>
          <Icon name="checkmark" /> {t("studentForms.signupModal.confirm")}
        </Button>
      </Modal.Actions>
    );
  }

  render() {
    const { t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={
          <Button name="Sign up" color="blue" onClick={this.handleTriggerClick}>
            {t("studentForms.placeholders.signup")}
          </Button>
        }
        open={open}
        onClose={this.close}
        style={{ maxWidth: "500px" }}
      >
        <Modal.Content>
          <Modal.Description>
            <Header>
              {this.state.errorMessage.length === 0
                ? t("studentForms.signupModal.title")
                : t("studentForms.signupModal.errorTitle")}
            </Header>
            {this.renderDetails()}
          </Modal.Description>
        </Modal.Content>

        {this.renderActions()}
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // determine which form to fetch from redux store
  let signUpForm;
  if (ownProps.for === "student") {
    signUpForm = state.form.studentSignup;
  } else {
    signUpForm = state.form.adminSignup;
  }

  return {
    signUpForm: signUpForm,
    auth: state.auth
  };
};
const wrapped = connect(
  mapStateToProps,
  actions
)(ConfirmationModal);

export default withTranslation()(wrapped);
