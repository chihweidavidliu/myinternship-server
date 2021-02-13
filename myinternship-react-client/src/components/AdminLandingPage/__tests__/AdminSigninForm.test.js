import React from "react";
import { shallow } from "enzyme";
import { Form } from "semantic-ui-react";
import { Field } from "redux-form";

import { AdminSignInForm } from "components/AdminLandingPage/AdminSignInForm";

let wrapped;
let mockT;
let mockHandleSubmit;
let mockHandleSignin;

beforeEach(() => {
  mockT = jest.fn();
  mockHandleSubmit = jest.fn(callback => callback);
  mockHandleSignin = jest.fn();

  const props = {
    t: mockT,
    handleSubmit: mockHandleSubmit,
    handleSignin: mockHandleSignin
  };

  wrapped = shallow(<AdminSignInForm {...props} />);
});

it("should render a Form", () => {
  expect(wrapped.find(Form).length).toBe(1);
});

it("should render appropriate fields", () => {
  expect(wrapped.find(Field).length).toBe(2);
  expect(wrapped.find({ name: "username" }).length).toBe(1);
  expect(wrapped.find({ name: "password" }).length).toBe(1);
});

it("should call handleSubmit on submit", () => {
  wrapped.find(Form).simulate("submit");
  expect(mockHandleSubmit.mock.calls.length).toBe(1);
  expect(mockHandleSignin.mock.calls.length).toBe(1);
});
