import React from "react";
import { shallow } from "enzyme";
import { Message } from "semantic-ui-react";

import { AdminCompanyView } from "components/AdminDashboard/AdminCompanyView";
import ChoicesTable from "components/AdminDashboard/ChoicesTable";
import TableToolbar from "components/AdminDashboard/TableToolbar";

let wrapped;
let mockT;
let mockDuplicateCompanies;
let mockUpdateAdmin;
let mockMarkChangesAsSaved;
let companyChoices
beforeEach(() => {
  mockT = jest.fn();
  mockDuplicateCompanies = jest.fn();
  mockUpdateAdmin = jest.fn();
  mockMarkChangesAsSaved = jest.fn();

  companyChoices = [{
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
  }]

  const props = {
    t: mockT,
    auth: {
      _id: "5c7fa1edf72a71570246ecad",
      username: "admin",
      companyChoices: companyChoices,
      allowStudentSignup: true,
      allowStudentChoices: true,
      auth: "admin"
    },
    authMessage: "Test message",
    students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
    companies: companyChoices,
    duplicateCompanies: mockDuplicateCompanies,
    updateAdmin: mockUpdateAdmin,
    markChangesAsSaved: mockMarkChangesAsSaved
  };

  wrapped = shallow(<AdminCompanyView {...props} />);
});

describe("components rendered", () => {
  it("should render an h2", () => {
    expect(wrapped.find("h2").length).toEqual(1);
  });

  it("should render a table toolbar", () => {
    expect(wrapped.find(TableToolbar).length).toEqual(1);
  });

  it("should render a ChoicesTable", () => {
    expect(wrapped.find(ChoicesTable).length).toEqual(1);
  });

  it("should render a Message with any error messages", () => {
    expect(wrapped.find(Message).length).toEqual(1);
  });
});

describe("Lifecycle methods", () => {
  it("should call duplicateCompanies on mount", () => {
    expect(mockDuplicateCompanies.mock.calls.length).toEqual(1);
    // expect it to have been called with companyChoices
    expect(mockDuplicateCompanies.mock.calls[0][0]).toEqual(companyChoices);
  });

  it("should call markChangesAsSaved on mount", () => {
    expect(mockMarkChangesAsSaved.mock.calls.length).toEqual(1);
  });
});
