import axios from "axios";
import { submit } from "redux-form";
import i18n from "i18n";



import {
  FETCH_STUDENTS,
  CHECK_NUMBER_OF_ADMINS,
  CHECK_SIGNUP_AUTH,
  ADMIN_SIGNIN,
  ADMIN_SIGNUP,
  UPDATE_ADMIN,
  REMOVE_ERROR_MESSAGE,
  UPDATE_STUDENT,
  FETCH_COMPANIES,
  ADD_ERROR_MESSAGE,
  STUDENT_SIGNUP,
  STUDENT_SIGNIN,
  FETCH_USER,
  TOGGLE_LANGUAGE,
  DUPLICATE_COMPANIES,
  DELETE_ALL
} from "actions/types";


// export tableEditing actions
export * from "./tableEditingActions";


export const studentSignup = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/signup", formData);
    dispatch({ type: STUDENT_SIGNUP, payload: response.data });
  } catch (err) {
    if (err.response.data.message === "studentid is in use") {
      dispatch({ type: STUDENT_SIGNIN, payload: false });
      return dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.studentid.duplicateId") });
    }

    if (err.response.data.message === "incorrect institution code") {
      dispatch({ type: STUDENT_SIGNIN, payload: false });
      return dispatch({
        type: ADD_ERROR_MESSAGE,
        payload: i18n.t("studentForms.formErrors.institutionCode.incorrect")
      });
    }
    dispatch({ type: STUDENT_SIGNIN, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.signupFailure") });
  }
};

export const studentSignin = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/signin", formData);
    dispatch({ type: STUDENT_SIGNIN, payload: response.data });
  } catch (err) {
    dispatch({ type: STUDENT_SIGNIN, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: i18n.t("studentForms.formErrors.signinFailure") });
  }
};

export const addErrorMesssage = (message) => {
  return {
    type: ADD_ERROR_MESSAGE,
    payload: message
  };
};

export const removeErrorMessage = () => {
  return {
    type: REMOVE_ERROR_MESSAGE,
    payload: null
  };
};

export const fetchUser = () => async (dispatch, getState) => {
  try {
    const response = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (err) {
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const checkSignupAuth = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/signupAuth");
    dispatch({ type: CHECK_SIGNUP_AUTH, payload: response.data });
  } catch (err) {
    dispatch({ type: CHECK_SIGNUP_AUTH, payload: true });
  }
};

export const fetchCompanies = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/companies");
    dispatch({ type: FETCH_COMPANIES, payload: response.data.companies });
  } catch (err) {
    if (err.response.data === "choices disabled by admin") {
      // value of false in state tells us that admin has explicitly disabled choices
      dispatch({ type: ADD_ERROR_MESSAGE, payload: "dashboard.errors.choicesDisabled.message" });
      return dispatch({ type: FETCH_COMPANIES, payload: false });
    }
    dispatch({ type: FETCH_COMPANIES, payload: null });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "dashboard.errors.failedCompanyFetch" });
  }
};

export const updateStudentChoices = (choices) => async (dispatch) => {
  try {
    const response = await axios.patch("/api/updateStudent", { choices: choices });
    dispatch({ type: UPDATE_STUDENT, payload: response.data });
  } catch (err) {
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "dashboard.errors.failedStudentUpdate" });
  }
};

export const adminSignin = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/admin/signin", formData);
    dispatch({ type: ADMIN_SIGNIN, payload: response.data });
  } catch (err) {
    dispatch({ type: ADMIN_SIGNIN, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminForms.formErrors.signinFailure" });
  }
};

export const deleteAll = (confirmMessage, successMessage) => async (dispatch) => {
  try {
    if(window.confirm(confirmMessage)) {
      const response = await axios.delete("/api/all");
      alert(successMessage);
      dispatch({ type: DELETE_ALL, payload: response.data });
    }
  } catch (error) {
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "dashboard.errors.failedStudentUpdate" });
  }
}

export const adminSignup = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/admin/signup", formData);
    dispatch({ type: ADMIN_SIGNUP, payload: response.data });
  } catch (err) {
    if (err.response.data.message === "admin already exists") {
      dispatch({ type: ADMIN_SIGNUP, payload: false });
      return dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminForms.formErrors.username.adminExists" });
    } else if (err.response.data.message === "incorrect adminSecret") {
      return dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminForms.formErrors.wrongAdminSecret" });
    }
    dispatch({ type: ADMIN_SIGNUP, payload: false });
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminForms.formErrors.signupFailure" });
  }
};

export const updateAdmin = (values) => async (dispatch) => {
  try {
    const response = await axios.patch("/api/updateAdmin", values);
    dispatch({ type: UPDATE_ADMIN, payload: response.data });
  } catch (err) {
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminDashboard.errors.updateFailed" });
  }
};

export const checkNumberOfAdmins = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/numberOfAdmins");
    dispatch({ type: CHECK_NUMBER_OF_ADMINS, payload: response.data });
  } catch (err) {
    dispatch({ type: CHECK_NUMBER_OF_ADMINS, payload: null });
  }
};

export const fetchStudents = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/studentChoices");
    dispatch({ type: FETCH_STUDENTS, payload: response.data.students });
  } catch(err) {
    dispatch({ type: ADD_ERROR_MESSAGE, payload: "adminDashboard.errors.fetchStudentsFailed" })
  }
};


export const duplicateCompanies = (companyChoices) => {
  return {
    type: DUPLICATE_COMPANIES,
    payload: companyChoices
  }
}

export const toggleLanguage = (language) => {
  return {
    type: TOGGLE_LANGUAGE,
    payload: language
  };
};

export const submitReduxForm = (formName) => async (dispatch) => {
  await dispatch(submit(formName));
};
