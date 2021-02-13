import React from "react";
import { shallow } from "enzyme";
import { Form } from "semantic-ui-react";
import { Field } from "redux-form";

import { AdminSignUpForm } from "components/AdminLandingPage/AdminSignUpForm";
import ConfirmationModal from "components/ConfirmationModal";

let wrapped;
let mockT;
let mockHandleSubmit;

beforeEach(() => {
  mockT = jest.fn();
  mockHandleSubmit = jest.fn(callback => callback);

  const props = {
    t: mockT,
    handleSubmit: mockHandleSubmit,
  };

  wrapped = shallow(<AdminSignUpForm {...props} />);
});

it("should render a Form", () => {
  expect(wrapped.find(Form).length).toBe(1);
});

it("should render a ConfirmationModal", () => {
  expect(wrapped.find(ConfirmationModal).length).toBe(1);
});

it("should render appropriate fields", () => {
  expect(wrapped.find(Field).length).toBe(3);
  expect(wrapped.find({ name: "adminSecret"}).length).toBe(1);
  expect(wrapped.find({ name: "username" }).length).toBe(1);
  expect(wrapped.find({ name: "password" }).length).toBe(1);
});

it("should call handleSubmit on submit", () => {
  wrapped.find(Form).simulate("submit");
  expect(mockHandleSubmit.mock.calls.length).toBe(1);
});
