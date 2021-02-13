import { CHECK_SIGNUP_AUTH } from "actions/types";

export default (state=true, action) => {
  switch (action.type) {
    case CHECK_SIGNUP_AUTH:
      return action.payload;
    default:
      return state;
  }
};
