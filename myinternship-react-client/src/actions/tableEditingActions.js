import { ADD_ROW, DELETE_ROW, ADD_CHOICE, REMOVE_CHOICE, UPDATE_CELL, MARK_CHANGES_AS_SAVED } from "actions/types";
import shortid from "shortid";

function getLongestChoicesArray(data) {
  let longestArray = [];
  data.forEach((item) => {
    if (item.choices.length > longestArray.length) {
      longestArray = item.choices;
    }
  });
  return longestArray;
}

export const addRow = (data) => {
  const emptyChoicesArr = [];
  // work out longest choices array to add empty values
  const longestArray = getLongestChoicesArray(data);
  while (emptyChoicesArr.length < longestArray.length) {
    emptyChoicesArr.push("");
  }
  const updated = [{ _id: shortid.generate(), name: "", numberAccepted: "", choices: emptyChoicesArr }, ...data];
  return {
    type: ADD_ROW,
    payload: updated
  };
};

export const deleteRow = (id) => {
  return {
    type: DELETE_ROW,
    payload: id
  };
};

export const addChoice = () => {
  return {
    type: ADD_CHOICE
  };
};

export const removeChoice = () => {
  return {
    type: REMOVE_CHOICE
  };
};

export const updateCell = (companyId, categoryToEdit, newText, choiceIndex) => {
  return {
    type: UPDATE_CELL,
    payload: { companyId, categoryToEdit, newText, choiceIndex }
  };
};

export const markChangesAsSaved = () => {
  return { type: MARK_CHANGES_AS_SAVED };
};
