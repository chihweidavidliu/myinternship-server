import React from "react";
import moxios from "moxios";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";

import Root from "Root";
import Dashboard from "components/Dashboard/Dashboard";
import Navbar from "components/Dashboard/Navbar";
import SharedList from "components/Dashboard/SharedList";
import LanguageSelector from "components/LanguageSelector";
import ChoicesModal from "components/Dashboard/ChoicesModal";

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
beforeEach(() => {
  moxios.install();

  const initialState = {
    auth: {
      _id: "5c8d30c5d5d85aa69a3b706f",
      studentid: "12345",
      name: "David",
      department: "studentForms.departments.Management",
      choices: ["Google"]
    },
    authMessage: null,
    form: {},
    language: "English",
    companies: ["Google", "Apple"],
    signupAuth: true,
    numberOfAdmins: null,
    students: [],
    unsavedChanges: false
  };

  // enzyme does not yet support suspense
  wrapped = mount(
    <Root initialState={initialState}>
      <MemoryRouter>
          <Dashboard />
      </MemoryRouter>
    </Root>
  );
});

afterEach(() => {
  moxios.uninstall();
  wrapped.unmount();
});

describe("components rendered", () => {
  it("should render a Dashboard", () => {
    // console.log(wrapped.find(Dashboard).debug());
    expect(wrapped.find(Dashboard).length).toEqual(1);
  });

  describe("the Navbar", () => {
    it("should render a Navbar", () => {
      expect(wrapped.find(Navbar).length).toEqual(1);
    });
    it("should contain a LanguageSelector", () => {
      expect(wrapped.find(LanguageSelector).length).toEqual(1);
    });
    it("should contain a Logout link", () => {
      expect(wrapped.find('[href="/auth/logout"]').length).toEqual(1);
    });

  });

  describe("The choices lists", () => {
    it("should render two shared lists", () => {
      expect(wrapped.find(SharedList).length).toEqual(2);
    });

    it("should render the companies in state, excluding those chosen by the student", () => {
      const companyOptions = wrapped.find("ul").children();
      expect(companyOptions.find("li").length).toEqual(1);
      expect(companyOptions.find("li").text()).toBe("Apple")
    });

    it("should render the student's choices", () => {
      const studentChoices = wrapped.find("ol").children();
      expect(studentChoices.find("li").length).toEqual(1);
      expect(studentChoices.find("li").text()).toBe("Google");
    });
  });

  describe("confirmation modal", () => {
    it("should render a ChoicesModal", () => {
      expect(wrapped.find(ChoicesModal).length).toBe(1);
    });

  });
});
