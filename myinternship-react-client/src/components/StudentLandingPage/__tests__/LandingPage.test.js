import React from "react";
import { shallow } from "enzyme";
import { Message } from "semantic-ui-react";

import { LandingPage } from "components/StudentLandingPage/LandingPage";
import LanguageSelector from "components/LanguageSelector";
import SignUpForm from "components/StudentLandingPage/SignUpForm";
import SigninForm from "components/StudentLandingPage/SigninForm";
import ToggleForm from "components/StudentLandingPage/ToggleForm";

let wrapped;
let mockCheckNumberOfAdmins;
let mockT;
let mockCheckSignupAuth;
let mockAddErrorMessage;

describe("StudentSignup Allowed", () => {
  beforeEach(() => {
    mockCheckSignupAuth = jest.fn();
    mockAddErrorMessage = jest.fn();
    mockT = jest.fn();

    const props = {
      t: mockT,
      auth: false,
      authMessage: "Test message",
      signupAuth: true,
      checkNumberOfAdmins: mockCheckNumberOfAdmins,
      checkSignupAuth: mockCheckSignupAuth,
      addErrorMesssage: mockAddErrorMessage
    };

    wrapped = shallow(<LandingPage {...props} />);
  });

  it("should call checkNumberOfAdmins on mount", () => {
    expect(mockCheckSignupAuth.mock.calls.length).toBe(1);
  });

  it("should render a LanguageSelector", () => {
    expect(wrapped.find(LanguageSelector).length).toBe(1);
  });

  it("should render error message", () => {
    expect(wrapped.find(Message).length).toBe(1);
    expect(wrapped.find(Message).props().content).toBe("Test message");
  });

  it("should render a toggleForm", () => {
    expect(wrapped.find(ToggleForm).length).toBe(1);
  });

  it("toggleForm should change state and toggle form", () => {
    wrapped.find(ToggleForm).simulate("click");
    wrapped.update();
    expect(wrapped.state("currentForm")).toBe("signIn");
    expect(wrapped.find(SigninForm).length).toBe(1);
    expect(wrapped.find(SignUpForm).length).toBe(0);
  });

  it("should render an SignUpForm", () => {
    expect(wrapped.find(SignUpForm).length).toBe(1);
    expect(wrapped.find(SigninForm).length).toBe(0);
  });
});

describe("StudentSignup not allowed", () => {
  beforeEach(() => {
    mockCheckNumberOfAdmins = jest.fn();
    mockT = jest.fn();

    const props = {
      t: mockT,
      auth: false,
      authMessage: "Test message",
      signupAuth: false,
      checkNumberOfAdmins: mockCheckNumberOfAdmins,
      checkSignupAuth: mockCheckSignupAuth,
      addErrorMesssage: mockAddErrorMessage
    };

    wrapped = shallow(<LandingPage {...props} />);
  });

  it("should render an SigninForm", () => {
    expect(wrapped.find(SigninForm).length).toBe(1);
    expect(wrapped.find(SignUpForm).length).toBe(0);
  });

  it("should not render a toggleForm", () => {
    expect(wrapped.find(ToggleForm).length).toBe(0);
  });
});
