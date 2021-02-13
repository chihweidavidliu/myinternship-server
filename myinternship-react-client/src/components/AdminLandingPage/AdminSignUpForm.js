import React, { Component } from "react";
import { Form, Message } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

// custom submit function for signUp form to be passed to redux form constructor and triggered by modal confirm
import submitAdminSignup from "./submitAdminSignup";

import ConfirmationModal from "components/ConfirmationModal";

export class AdminSignUpForm extends Component {
  renderError = (meta) => {
    // meta object passed via the renderInput function and its formProps
    if (meta.touched === true && meta.error) {
      return <Message error content={meta.error} />;
    }
  };

  renderInput = (formProps) => {
    const error = formProps.meta.error && formProps.meta.touched ? true : false;
    return (
      <React.Fragment>
        <Form.Input {...formProps.input} autoComplete="off" placeholder={formProps.placeholder} error={error} />
        {this.renderError(formProps.meta)}
      </React.Fragment>
    );
  };

  render() {
    const { t, handleSubmit } = this.props;
    // here handleSubmit is not passed a callback submit method defined within the component itself as the submit will be triggered by separate component
    // in these cases it is easier to pass the callback to handleSubmit via the reduxForm options wnen wrapping the component (see bottom of page)
    return (
      <Form onSubmit={handleSubmit} error>
        <Form.Field>
          <Field
            name="adminSecret"
            type="text"
            placeholder={t("adminForms.placeholders.adminSecret")}
            component={this.renderInput}
          />
        </Form.Field>
        <Form.Field>
          <Field name="username" placeholder={t("adminForms.placeholders.username")} component={this.renderInput} />
        </Form.Field>
        <Form.Field>
          <Field name="password" placeholder={t("adminForms.placeholders.password")} component={this.renderInput} />
        </Form.Field>
        <ConfirmationModal auth={this.props.auth} for="admin" />
      </Form>
    );
  }
}

// validate function that returns any errors as an object - connect it with reduxForm and these errors will appear on the formProps.meta object of the component
const validate = (formValues, props) => {
  const { t } = props;
  const errors = {};

  if (! formValues.adminSecret) {
    errors.adminSecret = t("adminForms.formErrors.adminSecret.missing");
  }

  if (!formValues.username) {
    errors.username = t("adminForms.formErrors.username.missing");
  }
  if (!formValues.password) {
    errors.password = t("adminForms.formErrors.password.missing");
  } else if (formValues.password.length < 6) {
    errors.password = t("adminForms.formErrors.password.tooShort");
  }
  return errors;
};

AdminSignUpForm.propTypes = {
  t: PropTypes.func,
  handleSubmit: PropTypes.func,
  adminSignup: PropTypes.func // action creator passed down from AdminLandingPage to be called by external submitAdminSignup function
};

const wrapped = reduxForm({ form: "adminSignup", validate: validate, onSubmit: submitAdminSignup })(AdminSignUpForm);
export default withTranslation()(wrapped);
