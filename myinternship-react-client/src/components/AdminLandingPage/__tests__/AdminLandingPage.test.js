import React from "react";
import { shallow } from "enzyme";
import { Message } from "semantic-ui-react";

import { AdminLandingPage } from "components/AdminLandingPage/AdminLandingPage";
import LanguageSelector from "components/LanguageSelector";
import AdminSignInForm from "components/AdminLandingPage/AdminSignInForm";
import AdminSignUpForm from "components/AdminLandingPage/AdminSignUpForm";

let wrapped;
let mockCheckNumberOfAdmins;
let mockT;

describe("Admin doesn't exist", () => {
  beforeEach(() => {
    mockCheckNumberOfAdmins = jest.fn();
    mockT = jest.fn();

    const props = {
      t: mockT,
      auth: false,
      authMessage: "Test message",
      students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
      numberOfAdmins: 0,
      checkNumberOfAdmins: mockCheckNumberOfAdmins
    };

    wrapped = shallow(<AdminLandingPage {...props} />);
  });

  it("should call checkNumberOfAdmins on mount", () => {
    expect(mockCheckNumberOfAdmins.mock.calls.length).toBe(1);
  });

  it("should render a LanguageSelector", () => {
    expect(wrapped.find(LanguageSelector).length).toBe(1);
  });

  it("should render error message", () => {
    expect(wrapped.find(Message).length).toBe(1);
    expect(wrapped.find(Message).props().content).toBe("Test message");
  });

  it("should render an AdminSignUpForm", () => {
    expect(wrapped.find(AdminSignUpForm).length).toBe(1);
    expect(wrapped.find(AdminSignInForm).length).toBe(0);
  });
});

describe("Admin doesn't exist", () => {
  beforeEach(() => {
    mockCheckNumberOfAdmins = jest.fn();
    mockT = jest.fn();

    const props = {
      t: mockT,
      auth: false,
      authMessage: "Test message",
      students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
      numberOfAdmins: 1,
      checkNumberOfAdmins: mockCheckNumberOfAdmins
    };

    wrapped = shallow(<AdminLandingPage {...props} />);
  });

  it("should render an AdminSignInForm", () => {
    expect(wrapped.find(AdminSignUpForm).length).toBe(0);
    expect(wrapped.find(AdminSignInForm).length).toBe(1);
  });
});
