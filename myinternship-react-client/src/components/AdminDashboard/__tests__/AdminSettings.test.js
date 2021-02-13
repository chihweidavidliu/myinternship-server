import React from "react";
import { shallow } from "enzyme";
import { Radio } from "semantic-ui-react";

import { AdminSettings } from "components/AdminDashboard/AdminSettings";

let wrapped;
let mockT;
let mockUpdateAdmin;

beforeEach(() => {
  mockT = jest.fn();
  mockUpdateAdmin = jest.fn();

  const props = {
    t: mockT,
    auth: {
      _id: "5c7fa1edf72a71570246ecad",
      username: "admin",
      companyChoices: [],
      allowStudentSignup: false,
      allowStudentChoices: true,
      auth: "admin"
    },
    authMessage: "Test message",
    students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
    companies: [],
    updateAdmin: mockUpdateAdmin
  };
  wrapped = shallow(<AdminSettings {...props} />);
});

it("should render two Radio buttons", () => {
  expect(wrapped.find(Radio).length).toEqual(2);
});


it("should call updateAdmin on click with allowStudentSignup", () => {
  wrapped.find({ for: "allowStudentSignup" }).simulate("click");
  wrapped.update();
  expect(mockUpdateAdmin.mock.calls.length).toEqual(1);
  expect(mockUpdateAdmin.mock.calls[0][0]).toEqual({ allowStudentSignup: true });
});

it("should call updateAdmin on click with allowStudentChoices", () => {
  wrapped.find({ for: "allowStudentChoices" }).simulate("click");
  wrapped.update();
  expect(mockUpdateAdmin.mock.calls.length).toEqual(1);
  // allowStudentChoices was originally true, expect update to change it to false
  expect(mockUpdateAdmin.mock.calls[0][0]).toEqual({ allowStudentChoices: false });
});
