import React from "react";
import { shallow } from "enzyme";
import { Route } from "react-router";

import { AdminDashboard } from "components/AdminDashboard/AdminDashboard";
import AdminNavbar from "components/AdminDashboard/AdminNavbar";
import AdminStudentView from "components/AdminDashboard/AdminStudentView";
import AdminCompanyView from "components/AdminDashboard/AdminCompanyView";
import AdminSorter from "components/AdminDashboard/AdminSorter";
import AdminSettings from "components/AdminDashboard/AdminSettings";

let wrapped;
let mockT;
beforeEach(() => {
  mockT = jest.fn();
  const props = {
    t: mockT
  };
  wrapped = shallow(<AdminDashboard {...props} />);
});

it("should render a navbar", () => {
  expect(wrapped.find(AdminNavbar).length).toEqual(1);
});

it("should render 4 routes", () => {
  expect(wrapped.find(Route).length).toEqual(4);
});

it("should render a route to AdminStudentView", () => {
  expect(wrapped.find({ component: AdminStudentView }).length).toEqual(1);
});

it("should render a route to AdminCompanyView", () => {
  expect(wrapped.find({ component: AdminCompanyView }).length).toEqual(1);
});

it("should render a route to AdminSorter", () => {
  expect(wrapped.find({ component: AdminSorter }).length).toEqual(1);
});

it("should render a route to AdminSettings", () => {
  expect(wrapped.find({ component: AdminSettings }).length).toEqual(1);
});
