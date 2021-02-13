import {
  ADD_ERROR_MESSAGE,
  REMOVE_ERROR_MESSAGE
} from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case ADD_ERROR_MESSAGE:
      return action.payload;
    case REMOVE_ERROR_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};
