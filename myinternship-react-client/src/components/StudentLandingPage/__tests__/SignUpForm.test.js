import React from "react";
import { shallow } from "enzyme";
import { Form } from "semantic-ui-react";
import { Field } from "redux-form";

import { SignUpForm } from "components/StudentLandingPage/SignUpForm";

let wrapped;
let mockT;
let mockHandleSubmit;

beforeEach(() => {
  mockT = jest.fn();
  mockHandleSubmit = jest.fn((callback) => callback);

  const props = {
    t: mockT,
    handleSubmit: mockHandleSubmit,
  };

  wrapped = shallow(<SignUpForm {...props} />);
});

it("should render a Form", () => {
  expect(wrapped.find(Form).length).toBe(1);
});

it("should render appropriate fields", () => {
  expect(wrapped.find(Field).length).toBe(5);
  expect(wrapped.find({ name: "institutionCode" }).length).toBe(1);
  expect(wrapped.find({ name: "studentid" }).length).toBe(1);
  expect(wrapped.find({ name: "name" }).length).toBe(1);
  expect(wrapped.find({ name: "password" }).length).toBe(1);
  expect(wrapped.find({ name: "department" }).length).toBe(1);
});

it("should call handleSubmit on submit", () => {
  wrapped.find(Form).simulate("submit");
  expect(mockHandleSubmit.mock.calls.length).toBe(1);
});
