import React from "react";
import { shallow } from "enzyme";
import { Message, Button } from "semantic-ui-react";

import { sorter } from "components/AdminDashboard/sorter";
import { AdminSorter } from "components/AdminDashboard/AdminSorter";
import ChoicesTable from "components/AdminDashboard/ChoicesTable";

let wrapped;
let mockT;
let mockFetchStudents;
let companyChoices;

jest.mock("i18n", () => {
  return;
});

beforeEach(() => {
  mockT = jest.fn((message) => message);
  mockFetchStudents = jest.fn();

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
    authMessage: "Test message",
    students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
    companies: companyChoices,
    fetchStudents: mockFetchStudents
  };

  wrapped = shallow(<AdminSorter {...props} />);
});

it("should render a h2", () => {
  expect(wrapped.find("h2").length).toEqual(1);
});

it("should call fetchStudents on mount", () => {
  expect(mockFetchStudents.mock.calls.length).toEqual(1);
});

it("should render a Message with any error messages", () => {
  expect(wrapped.find(Message).length).toEqual(1);
});

describe("the start sort button", () => {
  it("should render a start sort button", () => {
    expect(wrapped.find(Button).length).toEqual(1);
    expect(wrapped.find("li").length).toEqual(0);
  });

  describe("the sort process", () => {
    let spy;
    beforeEach(() => {
      spy = jest.spyOn(sorter, "sort");
      wrapped.find(Button).simulate("click");
      wrapped.update();
    });
    it("should call sorter on click and output button should appear", () => {
      expect(spy).toHaveBeenCalled();
    });
    it("output button should appear after sort", (done) => {
      setTimeout(() => {
        expect(wrapped.find(Button).length).toEqual(2);
        done();
      }, 1000);
    });
    it("should render two ChoicesTable in the output", (done) => {
      setTimeout(() => {
        expect(wrapped.find(ChoicesTable).length).toEqual(2);
        done();
      }, 1000);
    });
    it("should render messages in the console", (done) => {
      setTimeout(() => {
        expect(wrapped.find("li").length).toBeGreaterThan(0);
        done();
      }, 1000);
    });
  });
});
