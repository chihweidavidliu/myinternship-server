import history from "history.js";

// external submit function to be passed to SignUpForm via reduxForm options 
const submitAdminSignup = async (values, dispatch, props) => {
  // await action creator to sign up adminForms
  await props.adminSignup(values);
  history.push("/admin/dashboard");
};

export default submitAdminSignup;
