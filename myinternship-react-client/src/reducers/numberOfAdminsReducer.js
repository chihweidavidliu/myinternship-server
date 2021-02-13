import { CHECK_NUMBER_OF_ADMINS } from "actions/types";

export default (state=null, action) => {
  switch (action.type) {
    case CHECK_NUMBER_OF_ADMINS:
      return action.payload;
    default:
      return state;
  }
}
