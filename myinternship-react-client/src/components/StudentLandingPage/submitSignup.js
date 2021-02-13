import history from "history.js";

// external submit function to be passed to SignUpForm and called by external redux form 'submit'
const submitSignup = async (values, dispatch, props) => {
  await props.studentSignup(values);
  history.push("/dashboard");
};

export default submitSignup;
