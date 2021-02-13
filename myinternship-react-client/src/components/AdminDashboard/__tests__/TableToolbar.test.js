import React from "react";
import { shallow } from "enzyme";
import { Button } from "semantic-ui-react";

import { TableToolbar } from "components/AdminDashboard/TableToolbar";
import UploadCompaniesModal from "components/AdminDashboard/UploadCompaniesModal";

let wrapped;
let mockT;
let mockAddRow;
let mockAddChoice;
let mockRemoveChoice;
let mockSaveChanges;

beforeEach(() => {
  mockT = jest.fn();
  mockAddRow = jest.fn();
  mockAddChoice = jest.fn();
  mockRemoveChoice = jest.fn();
  mockSaveChanges = jest.fn();

  const props = {
    t: mockT,
    unsavedChanges: false,
    companies: [{ _id: "75736736", name: "Google", choices: ["David", "Sam"] }],
    addRow: mockAddRow,
    addChoice: mockAddChoice,
    removeChoice: mockRemoveChoice,
    saveChanges: mockSaveChanges
  };
  wrapped = shallow(<TableToolbar {...props} />);
});

it("should render 4 buttons", () => {
  expect(wrapped.find(Button).length).toEqual(4);
});

it("should render UploadCompaniesModal", () => {
  expect(wrapped.find(UploadCompaniesModal).length).toEqual(1);
});

it("should call appropriate callback on click", () => {
  wrapped.find(".addRow-button").simulate("click");
  wrapped.update();
  expect(mockAddRow.mock.calls.length).toEqual(1);

  wrapped.find(".addChoice-button").simulate("click");
  wrapped.update();
  expect(mockAddChoice.mock.calls.length).toEqual(1);

  wrapped.find(".removeChoice-button").simulate("click");
  wrapped.update();
  expect(mockRemoveChoice.mock.calls.length).toEqual(1);

  wrapped.find(".saveChanges-button").simulate("click");
  wrapped.update();
  expect(mockSaveChanges.mock.calls.length).toEqual(1);
});
