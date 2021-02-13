import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

export class AdminSignInForm extends Component {
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
        <Form.Input
          {...formProps.input}
          type={formProps.type}
          autoComplete="off"
          placeholder={formProps.placeholder}
          error={error}
        />
        {this.renderError(formProps.meta)}
      </React.Fragment>
    );
  };

  onSubmit = (formValues) => {
    // handleSignin passed down from LandingPage
    this.props.handleSignin(formValues);
  };

  render() {
    const { t } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit)} error>
        <Form.Field>
          <Field
            name="username"
            type="text"
            placeholder={t("adminForms.placeholders.username")}
            component={this.renderInput}
          />
        </Form.Field>
        <Form.Field>
          <Field
            name="password"
            type="password"
            placeholder={t("adminForms.placeholders.password")}
            component={this.renderInput}
          />
        </Form.Field>
        <Button color="blue" type="submit">{t("studentForms.placeholders.signin")}</Button>
      </Form>
    );
  }
}

// validate function that returns any errors as an object - connect it with reduxForm and these errors will appear on the formProps.meta object of the component
const validate = (formValues, props) => {
  const { t } = props;
  const errors = {};

  if (!formValues.username) {
    errors.username = t("adminForms.formErrors.username.missing");
  }

  if (!formValues.password) {
    errors.password = t("adminForms.formErrors.password.missing");
  }

  return errors;
};

AdminSignInForm.propTypes = {
  t: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleSignin: PropTypes.func,
};

const wrapped = reduxForm({ form: "adminSignin", validate: validate })(AdminSignInForm);
export default withTranslation()(wrapped);
