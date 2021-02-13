import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

export class SigninForm extends Component {
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
    this.props.handleSignin(formValues);
  };

  render() {
    const { t } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit)} error>
        <Form.Field>
          <Field
            name="studentid"
            type="text"
            placeholder={t("studentForms.placeholders.studentid")}
            component={this.renderInput}
          />
        </Form.Field>
        <Form.Field>
          <Field
            name="password"
            type="password"
            placeholder={t("studentForms.placeholders.password")}
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

  if (!formValues.studentid) {
    errors.studentid = t("studentForms.formErrors.studentid.missing");
  } else if (formValues.studentid.split("")[0] === "s") {
    errors.studentid = t("studentForms.formErrors.studentid.initialS");
  }

  if (!formValues.password) {
    errors.password = t("studentForms.formErrors.password.missing");
  }

  return errors;
};

SigninForm.propTypes = {
  t: PropTypes.func,
  handleSubmit: PropTypes.func, // reduxForm method
  handleSignin: PropTypes.func, // passed down from LandingPage
};
const wrapped = reduxForm({ form: "studentSignin", validate: validate })(SigninForm);
export default withTranslation()(wrapped);
