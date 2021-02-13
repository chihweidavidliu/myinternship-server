import React from "react";
import { shallow } from "enzyme";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AdminNavbar } from "components/AdminDashboard/AdminNavbar";
import LanguageSelector from "components/LanguageSelector";

let wrapped;
let mockT;
beforeEach(() => {
  mockT = jest.fn();
  const props = {
    t: mockT
  };
  wrapped = shallow(<AdminNavbar {...props} />);
});

it("should render a Menu", () => {
  expect(wrapped.find(Menu).length).toEqual(1);
});

it("should render a LanguageSelector", () => {
  expect(wrapped.find(LanguageSelector).length).toEqual(1);
});

it("should render 5 Links with correct routes", () => {
  expect(wrapped.find(Link).length).toEqual(5);
  expect(wrapped.find({ to: "/admin/dashboard" }).length).toEqual(2);
  expect(wrapped.find({ to: "/admin/dashboard/companies" }).length).toEqual(1);
  expect(wrapped.find({ to: "/admin/dashboard/sorter" }).length).toEqual(1);
  expect(wrapped.find({ to: "/admin/dashboard/settings" }).length).toEqual(1);
});

it("should render a logout link", () => {
  expect(wrapped.find({ href: "/auth/logout" }).length).toEqual(1);
});
