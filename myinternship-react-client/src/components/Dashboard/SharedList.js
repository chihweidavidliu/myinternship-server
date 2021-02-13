import uniqueId from "lodash/uniqueId";
import React from "react";
import { connect } from "react-redux";
import Sortable from "react-sortablejs";
import PropTypes from "prop-types";

// Functional Component
export const SharedList = ({ items, listType, onChange, auth, type }) => {
  if (items && auth) {
    items = items.map((val) => {
      if (type === "options") {
        // only render companies that do not appear in student choices
        if (!auth.choices.includes(val)) {
          return (
            <li key={uniqueId()} data-id={val}>
              {val}
            </li>
          );
        }
        return null;
      } else {
        // if dealing with student choices, render everything
        return (
          <li key={uniqueId()} data-id={val}>
            {val}
          </li>
        );
      }
    });
  }
  return (
    <Sortable
      // See all Sortable options at https://github.com/RubaXa/Sortable#options
      options={{
        group: "shared"
      }}
      tag={listType}
      onChange={onChange}
      className="sortable-list"
    >
      {items}
    </Sortable>
  );
};

SharedList.propTypes = {
  items: PropTypes.array,
  auth: PropTypes.object,
  onChange: PropTypes.func,
  listType: PropTypes.oneOf(["ol", "ul"]),
  type: PropTypes.oneOf(["choices", "options"])
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};
export default connect(mapStateToProps)(SharedList);
