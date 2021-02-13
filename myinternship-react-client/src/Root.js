import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "reducers";

export default (props) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // set up redux dev tools - need this for the dev tools to work with middleware
  const store = createStore(reducers, props.initialState, composeEnhancers(applyMiddleware(thunk)));
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}
