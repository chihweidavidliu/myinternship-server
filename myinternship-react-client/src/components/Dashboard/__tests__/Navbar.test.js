import React from "react";
import { shallow } from "enzyme";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { Navbar } from "components/Dashboard/Navbar";
import LanguageSelector from "components/LanguageSelector";
let wrapped;
let mockT;
beforeEach(() => {
  mockT = jest.fn();

  const props = {
    t: mockT,
    auth: {
      _id: "5c8d30c5d5d85aa69a3b706f",
      studentid: "12345",
      name: "David",
      department: "studentForms.departments.Management",
      choices: ["Apple", "Amazon", "Uber", "LG"]
    }
  };

  wrapped = shallow(<Navbar {...props} />);

});

it("should render a Menu", () => {
  expect(wrapped.find(Menu).length).toBe(1);
});

it("should render a Link to the dashboard", () => {
  expect(wrapped.find(Link).length).toBe(1);
  expect(wrapped.find(Link).props().to).toBe("/dashboard");
});

it("should render a logout link", () => {
  expect(wrapped.find("a").length).toBe(1);
  expect(wrapped.find("a").props().href).toBe("/auth/logout");
});

it("should render a LanguageSelector", () => {
  expect(wrapped.find(LanguageSelector).length).toBe(1);
});

it("should render three p elements", () => {
  expect(wrapped.find("p").length).toBe(3);
})
