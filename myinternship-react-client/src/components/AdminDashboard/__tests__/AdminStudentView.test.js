import React from "react";
import { shallow } from "enzyme";
import { Message } from "semantic-ui-react";

import { AdminStudentView } from "components/AdminDashboard/AdminStudentView";
import ChoicesTable from "components/AdminDashboard/ChoicesTable";

let wrapped;
let mockT;
let mockRemoveErrorMessage;
let mockFetchStudents;
beforeEach(() => {
  mockT = jest.fn();
  mockRemoveErrorMessage = jest.fn();
  mockFetchStudents = jest.fn();

  const props = {
    t: mockT,
    auth: {
      _id: "5c7fa1edf72a71570246ecad",
      username: "admin",
      companyChoices: [
        {
          _id: "QiRpdJrGG",
          name: "Apple",
          numberAccepted: 2,
          choices: ["Sam", "Paul", "David", "Aneta"]
        },
        {
          _id: "FJEo3i2JMN",
          name: "Microsoft",
          numberAccepted: 1,
          choices: ["Paul", "Esther"]
        }
      ],
      allowStudentSignup: true,
      allowStudentChoices: true,
      auth: "admin"
    },
    authMessage: "Test message",
    students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
    removeErrorMessage: mockRemoveErrorMessage,
    fetchStudents: mockFetchStudents
  };

  wrapped = shallow(<AdminStudentView {...props} />);
});

describe("components", () => {
  it("should render an h2", () => {
    expect(wrapped.find("h2").length).toEqual(1);
  });
  it("should render a ChoicesTable", () => {
    expect(wrapped.find(ChoicesTable).length).toEqual(1);
  });

  it("should render a Message with any error messages", () => {
    expect(wrapped.find(Message).length).toEqual(1);
  });
});

describe("lifecycle methods", () => {
  it("should call removeErrorMessage on mount", () => {
    expect(mockRemoveErrorMessage.mock.calls.length).toEqual(1);
  });
  it("should call fetchStudents on mount", () => {
    expect(mockFetchStudents.mock.calls.length).toEqual(1);
  });
});
