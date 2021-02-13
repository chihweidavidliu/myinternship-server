import React from "react";
import { shallow } from "enzyme";
import { Message } from "semantic-ui-react";

import { Dashboard } from "components/Dashboard/Dashboard";
import Navbar from "components/Dashboard/Navbar";
import SharedList from "components/Dashboard/SharedList";
import ChoicesModal from "components/Dashboard/ChoicesModal";

let wrapped;
let mockT;
let mockRemoveErrorMessage;
let mockFetchCompanies;

beforeEach(() => {
  mockT = jest.fn();
  mockRemoveErrorMessage = jest.fn();
  mockFetchCompanies = jest.fn();

  const props = {
    t: mockT,
    auth: {
      _id: "5c8d30c5d5d85aa69a3b706f",
      studentid: "12345",
      name: "David",
      department: "studentForms.departments.Management",
      choices: ["Apple", "Amazon", "Uber", "LG"]
    },
    authMessage: "Test message",
    form: {},
    language: "English",
    companies: ["Apple", "Amazon", "Uber", "Deliveroo", "Huawei", "LG", "Microsoft"],
    signupAuth: true,
    numberOfAdmins: null,
    students: [],
    unsavedChanges: false,
    removeErrorMessage: mockRemoveErrorMessage,
    fetchCompanies: mockFetchCompanies
  };
  wrapped = shallow(<Dashboard {...props} />);
});

it("should render a Navbar", () => {
  expect(wrapped.find(Navbar).length).toBe(1);
});

it("should render any authMessages", () => {
  expect(wrapped.find(Message).length).toBe(1);
});

it("should render two SharedLists", () => {
  expect(wrapped.find(SharedList).length).toBe(2);
});

it("should render a ChoicesModal", () => {
  expect(wrapped.find(ChoicesModal).length).toBe(1);
});

it("should call appropriate action creators on mount", () => {
  expect(mockFetchCompanies.mock.calls.length).toBe(1);
  expect(mockRemoveErrorMessage.mock.calls.length).toBe(1);
});
