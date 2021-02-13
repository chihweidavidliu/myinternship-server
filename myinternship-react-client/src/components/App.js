import React, { Component, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import background from "images/internship.jpg";
import history from "history.js";
import * as actions from "actions";
import "components/styles/App.css";
import LandingPage from "components/StudentLandingPage/LandingPage";
import Dashboard from "components/Dashboard/Dashboard";
import AdminLandingPage from "components/AdminLandingPage/AdminLandingPage";
import AdminDashboard from "components/AdminDashboard/AdminDashboard";
import LoadingPage from "components/LoadingPage";

export class App extends Component {

  async componentDidMount() {
    await this.props.fetchUser();
    if (this.props.auth) {
      if (this.props.auth.auth === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/dashboard");
      }
    }
  }

  render() {
    const style = { backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }
    return (
      <Router history={history}>
        <Suspense fallback={<LoadingPage />}>
        <div className="app-container" style={style}>
          <Switch >
            <Route path="/" exact render={(props) => <LandingPage {...props} language={this.props.language} />} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/admin" exact component={AdminLandingPage} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
          </Switch>
        </div>
        </Suspense>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    language: state.language
  }
}
export default connect(mapStateToProps, actions) (App);
