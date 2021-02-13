import {
  TOGGLE_LANGUAGE,
} from "actions/types";

export default (state = "English", action) => {
  switch (action.type) {
    case TOGGLE_LANGUAGE:
      return action.payload;
    default:
      return state;
  }
};
