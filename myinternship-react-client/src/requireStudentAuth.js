import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import LoadingPage from "components/LoadingPage";

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    checkAuth() {
      if (!this.props.auth) {
        this.props.history.push("/");
      }
    }

    async componentDidMount() {
      await this.props.fetchUser();
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    render() {
      if(!this.props.auth) {
        return <LoadingPage />
      }
      return <ChildComponent {...this.props} />;
    }
  }

  return connect(
    mapStateToProps,
    actions
  )(ComposedComponent);
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};
