import React from "react";
import { shallow } from "enzyme";
import { Table, Icon } from "semantic-ui-react";

import { TableRow } from "components/AdminDashboard/TableRow";
import EditableTableCell from "components/AdminDashboard/EditableTableCell";
let wrapped;
let mockDelete;

describe("Students choices table", () => {
  beforeEach(() => {
    const props = {
      target: { name: "David", studentid: "12345", choices: ["Google", "Apple"], department: "Law" },
      group: "students",
      editable: false,
      deleteRow: (id) => {
        return id;
      },
      t: (text) => {
        return text;
      }
    };
    wrapped = shallow(<TableRow {...props} />);
  });

  it("should render a table row", () => {
    expect(wrapped.find(Table.Row).length).toEqual(1);
  });
  it("should render correct columns", () => {
    expect(wrapped.find(Table.Cell).length).toEqual(5);
  });
});

describe("Editable company table", () => {
  beforeEach(() => {
    mockDelete = jest.fn();
    const props = {
      target: { name: "Google", choices: ["Sam", "Paul"], numberAccepted: "2", _id: "34243" },
      group: "companies",
      editable: true,
      deleteRow: mockDelete,
      t: (text) => {
        return text;
      }
    };
    wrapped = shallow(<TableRow {...props} />);
  });

  it("should render a table row", () => {
    expect(wrapped.find(Table.Row).length).toEqual(1);
  });

  it("should render appropriate cells", () => {
    // delete button
    expect(wrapped.find(Icon).length).toEqual(1);

    expect(wrapped.find({ category: "name" }).length).toEqual(1);
    expect(wrapped.find({ category: "name" }).props().content).toEqual("Google");

    expect(wrapped.find({ category: "_id" }).length).toEqual(0);

    expect(wrapped.find({ category: "numberAccepted" }).length).toEqual(1);
    expect(wrapped.find({ category: "numberAccepted" }).props().content).toEqual("2");
    
    expect(wrapped.find({ category: "choices" }).length).toEqual(2);
    expect(wrapped.find({ content: "Sam" }).length).toEqual(1);
    expect(wrapped.find({ content: "Paul" }).length).toEqual(1);
  });

  it("table cells should be editable", () => {
    expect(wrapped.find(EditableTableCell).length).toEqual(4);
  });

  it("should call deleteRow on click", () => {
    wrapped.find(Icon).simulate("click");
    expect(mockDelete.mock.calls.length).toBe(1);
  });
});
