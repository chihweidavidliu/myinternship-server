import { ADD_ROW, DELETE_ROW, ADD_CHOICE, REMOVE_CHOICE, UPDATE_CELL, MARK_CHANGES_AS_SAVED } from "actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case ADD_ROW:
      return true;
    case DELETE_ROW:
      return true;
    case ADD_CHOICE:
      return true;
    case REMOVE_CHOICE:
      return true;
    case UPDATE_CELL:
      return true;
    case MARK_CHANGES_AS_SAVED:
      return false;
    default:
      return state;
  }
};
