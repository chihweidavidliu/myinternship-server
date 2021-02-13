import React from "react";
import ReactDOM from "react-dom";

import App from "components/App";
import Root from "Root";
import './i18n';

ReactDOM.render(
  <Root>
    <App />
  </Root>,
  document.querySelector("#root")
)
