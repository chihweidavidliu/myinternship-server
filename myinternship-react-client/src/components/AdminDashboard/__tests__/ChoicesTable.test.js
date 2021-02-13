import React from "react";
import { shallow } from "enzyme";
import { Table } from "semantic-ui-react";
// get named export without redux instead of default export
import { ChoicesTable } from "components/AdminDashboard/ChoicesTable";

let wrapped;
let mockT;

describe("Students table", () => {
  mockT = jest.fn();

  beforeEach(() => {
    const props = {
      t: mockT,
      group: "students",
      editable: false,
      data: [{ studentid: "242424242", name: "David", department: "Law", choices: ["Google", "Microsoft"] }],
      fixedHeaders: ["studentid", "name", "department"]
    };
    wrapped = shallow(<ChoicesTable {...props} />);
  });

  it("should render a table", () => {
    expect(wrapped.find(Table).length).toEqual(1);
  });

  it("should render header", () => {
    expect(wrapped.find(Table.Header).length).toEqual(1);
  });
  it("should render table row with relevant data", () => {
    expect(wrapped.find({ id: "table-row 0" }).length).toEqual(1);
    expect(wrapped.find({ id: "table-row 0" }).props().target).toEqual({
      studentid: "242424242",
      name: "David",
      department: "Law",
      choices: ["Google", "Microsoft"]
    });
  });
});
