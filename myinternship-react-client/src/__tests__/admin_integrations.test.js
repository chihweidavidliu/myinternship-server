import React from "react";
import moxios from "moxios";
import { MemoryRouter } from "react-router-dom";
import { Message, Button } from "semantic-ui-react";
import { mount } from "enzyme";

import Root from "Root";
import AdminDashboard from "components/AdminDashboard/AdminDashboard";
import TableRow from "components/AdminDashboard/TableRow";
import EditableTableCell from "components/AdminDashboard/EditableTableCell";
import ChoicesTable from "components/AdminDashboard/ChoicesTable";

// mock i18n
jest.mock("i18n", () => {
  return;
});

jest.mock("react-i18next", () => {
  // copy the real library to get initReactI18next method to pass on (need this to avoid initiation error)
  const i18next = jest.requireActual("react-i18next");
  // this mock makes sure any components using the translate HoC receive a mock t function as a prop
  const withTranslation = () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: (string) => string };
    return Component;
  };
  return { withTranslation: withTranslation, initReactI18next: i18next.initReactI18next };
});

let wrapped;
let initialState;
let companyChoices;

beforeEach(() => {
  moxios.install();
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

  initialState = {
    auth: {
      _id: "5c7fa1edf72a71570246ecad",
      username: "admin",
      companyChoices: companyChoices,
      allowStudentSignup: true,
      allowStudentChoices: true,
      auth: "admin"
    },
    authMessage: null,
    form: {},
    language: "English",
    companies: companyChoices,
    signupAuth: true,
    numberOfAdmins: null,
    students: [{ _id: "12345", name: "David", department: "Law", choices: ["Apple", "Microsoft"] }],
    unsavedChanges: false
  };
});

afterEach(() => {
  moxios.uninstall();
  wrapped.unmount();
});

describe("Company View", () => {
  beforeEach(() => {
    wrapped = mount(
      <Root initialState={initialState}>
        <MemoryRouter
          initialEntries={["/admin/dashboard/companies", "/admin/dashboard/sorter", "/admin/dashboard/settings"]}
          initialIndex={0}
        >
          <AdminDashboard />
        </MemoryRouter>
      </Root>
    );
  });

  it("should render a h2", () => {
    expect(wrapped.find("h2").length).toEqual(1);
  });

  describe("the toolbar", () => {
    it("should add row when clicked", () => {
      expect(wrapped.find(TableRow).length).toEqual(2);
      // click add row
      wrapped.find({ className: "ui small basic button addRow-button" }).simulate("click");
      wrapped.update();
      expect(wrapped.find(TableRow).length).toEqual(3);
    });

    it("should display save prompt when there are unsaved changes", () => {
      // there should be no message initially
      expect(wrapped.find(Message).length).toEqual(0);
      // click add row
      wrapped.find({ className: "ui small basic button addRow-button" }).simulate("click");
      wrapped.update();
      expect(wrapped.find(Message).length).toEqual(1);
    });

    it("should remove row when delete icon is clicked", () => {
      expect(wrapped.find(TableRow).length).toEqual(2);
      // click delete row
      wrapped.find({ className: "close icon deleteButton", company: "Apple" }).simulate("click");
      wrapped.update();
      expect(wrapped.find(TableRow).length).toEqual(1);
      // remaining company should be Microsoft
      expect(wrapped.find({ className: "close icon deleteButton" }).prop("company")).toBe("Microsoft");
    });

    it("should add choice column when choice button clicked", () => {
      // Apple should have 6 editable table cells
      expect(
        wrapped
          .find({ id: "table-row 0" })
          .children()
          .find(EditableTableCell).length
      ).toBe(6);
      // click add choice button
      wrapped.find({ className: "ui small basic button addChoice-button" }).simulate("click");
      wrapped.update();
      expect(
        wrapped
          .find({ id: "table-row 0" })
          .children()
          .find(EditableTableCell).length
      ).toBe(7);
    });

    it("should remove choice column when remove choice clicked", () => {
      expect(
        wrapped
          .find({ id: "table-row 0" })
          .children()
          .find(EditableTableCell).length
      ).toBe(6);
      wrapped.find({ className: "ui small basic button removeChoice-button" }).simulate("click");
      wrapped.update();
      expect(
        wrapped
          .find({ id: "table-row 0" })
          .children()
          .find(EditableTableCell).length
      ).toBe(5);
    });

    it("should save the choices on click", (done) => {
      moxios.stubRequest("/api/updateAdmin", {
        status: 200,
        response: {
          _id: "5c7fa1edf72a71570246ecad",
          username: "admin",
          companyChoices: [
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
        }
      });
      // delete Apple
      wrapped.find({ className: "close icon deleteButton", company: "Apple" }).simulate("click");
      wrapped.update();
      expect(wrapped.find(Message).length).toEqual(1);
      // save the changes
      wrapped.find({ className: "ui yellow small basic button saveChanges-button" }).simulate("click");
      moxios.wait(() => {
        wrapped.update();
        // check saveprompt has gone
        expect(wrapped.find(Message).length).toEqual(0);
        // check request was made
        expect(moxios.requests.mostRecent().url).toBe("/api/updateAdmin");
        done();
      });
    });
  });
});

describe("Sorter view", () => {
  beforeEach(() => {
    wrapped = mount(
      <Root initialState={initialState}>
        <MemoryRouter
          initialEntries={["/admin/dashboard/companies", "/admin/dashboard/sorter", "/admin/dashboard/settings"]}
          initialIndex={1}
        >
          <AdminDashboard />
        </MemoryRouter>
      </Root>
    );
  });
  it("should show save output button and output when sort is started", (done) => {
    expect(wrapped.find(Button).length).toEqual(1);
    wrapped.find(Button).simulate("click");
    wrapped.update();
    // give time for sort
    setTimeout(() => {
      wrapped.update();
      expect(wrapped.find(Button).length).toEqual(2);
      expect(wrapped.find(ChoicesTable).length).toEqual(2);
      done()
    }, 1000);
  });
});
