import {
  ADMIN_SIGNIN,
  ADMIN_SIGNUP,
  UPDATE_STUDENT,
  STUDENT_SIGNUP,
  STUDENT_SIGNIN,
  FETCH_USER,
  UPDATE_ADMIN, 
  DELETE_ALL,
} from "actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case STUDENT_SIGNUP:
      return action.payload;
    case STUDENT_SIGNIN:
      return action.payload;
    case FETCH_USER:
      return action.payload;
    case UPDATE_STUDENT:
      return action.payload;
    case ADMIN_SIGNIN:
      return action.payload;
    case ADMIN_SIGNUP:
      return action.payload;
    case UPDATE_ADMIN:
      return action.payload;
    case DELETE_ALL:
      return {...state, companyChoices: [] };
    default:
      return state;
  }
};
