import { FETCH_STUDENTS, DELETE_ALL } from "actions/types";

export default (state=[], action) => {
  switch (action.type) {
    case FETCH_STUDENTS:
      return action.payload;
    case DELETE_ALL:
      return []
    default:
      return state;
  }
};
