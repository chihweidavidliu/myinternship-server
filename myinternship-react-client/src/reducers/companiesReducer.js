import {
  FETCH_COMPANIES,
  DUPLICATE_COMPANIES,
  ADD_ROW,
  DELETE_ROW,
  ADD_CHOICE,
  REMOVE_CHOICE,
  UPDATE_CELL, 
  DELETE_ALL
} from "actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_COMPANIES:
      return action.payload;
    case DUPLICATE_COMPANIES:
      return action.payload;
    case ADD_ROW:
      return action.payload;
    case DELETE_ROW:
      // filter out the name of the company by name passed via action payload
      return state.filter((company) => company._id !== action.payload);
    case ADD_CHOICE:
      return state.map((company) => ({ ...company, choices: [...company.choices, ""] }));
    case REMOVE_CHOICE:
      return state.map((company) => {
        const indexOfLastItem = company.choices.length - 1;
        return { ...company, choices: company.choices.filter((choice, index) => index !== indexOfLastItem) };
      });
    case UPDATE_CELL:
      const { companyId, categoryToEdit, newText, choiceIndex } = action.payload;
      return state.map((company) => {
        // identify company to edit by name
        if (company._id === companyId) {
          if (categoryToEdit === "choices") {

            const filtered = company.choices.filter((choice) => choice !== "");
            // if the cell is not currently populated, add it to the end of the valid values
            if (!filtered[choiceIndex]) {
              return { ...company, choices: [...filtered, newText] };
            }
            // if the user is editing a currently populated cell, replace that cell specifically

            // if newText is empty string, delete the value of the cell
            if (newText.trim() === "") {
              return { ...company, choices: company.choices.filter((choice, index) => index !== choiceIndex) };
            }
            // if the new value is a valid different value, replace the old value
            return {
              ...company,
              choices: company.choices.map((choice, index) => {
                if (index === choiceIndex) {
                  return newText;
                }
                return choice;
              })
            };
          }
          // if dealing with name or numberAccepted, no need for an index value to update the cell
          return { ...company, [categoryToEdit]: newText };
        }
        // skip over irrelevant companies
        return company;
      });
    case DELETE_ALL:
      return []
    default:
      return state;
  }
};
