import React from "react";
import { shallow } from "enzyme";
import { Modal, Form } from "semantic-ui-react";
import { Field } from "redux-form";

import { UploadCompaniesModal } from "components/AdminDashboard/UploadCompaniesModal";
import ChoicesTable from "components/AdminDashboard/ChoicesTable";

let wrapped;
let mockT;
let mockDuplicateCompanies;
let mockUpdateAdmin;
let mockHandleSubmit;
let companyChoices;

beforeEach(() => {
  mockT = jest.fn();
  mockDuplicateCompanies = jest.fn();
  mockUpdateAdmin = jest.fn();
  mockHandleSubmit = jest.fn();

  companyChoices = [
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
  ];

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
    updateAdmin: mockUpdateAdmin,
    duplicateCompanies: mockDuplicateCompanies,
    handleSubmit: mockHandleSubmit
  };

  wrapped = shallow(<UploadCompaniesModal {...props} />);
});

describe("components rendered", () => {
  it("should render a modal", () => {
    expect(wrapped.find(Modal).length).toEqual(1);
  });

  it("should render an example ChoicesTable", () => {
    expect(wrapped.find(ChoicesTable).length).toEqual(1);
  });

  it("should render a Form with UploadCompaniesInput", () => {
    expect(wrapped.find(Form).length).toEqual(1);
    expect(wrapped.find(Field).length).toEqual(1);
  });

  it("should render two actions buttons", () => {
    expect(wrapped.find({ className: "modal-button"}).length).toEqual(2);
  });
});

describe("upload functionality", () => {
  it("should call handleSubmit on submit", () => {
    expect(mockHandleSubmit.mock.calls.length).toBe(1);
  });
});
