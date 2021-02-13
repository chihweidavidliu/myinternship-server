import React from "react";
import { shallow } from "enzyme";
import { Table } from "semantic-ui-react";
// get named export without redux instead of default export
import { EditableTableCell } from "components/AdminDashboard/EditableTableCell";

let wrapped;
let mockUpdate;

describe("Choices cell", () => {
  mockUpdate = jest.fn();

  beforeEach(() => {
    const props = {
      updateCell: mockUpdate,
      target: { _id: "wefewf3", name: "David", studentid: "12345", choices: ["Google", "Apple"], department: "Law" },
      category: "choices",
      content: "Google",
      index: 0
    };
    wrapped = shallow(<EditableTableCell {...props} />);
  });

  it("should render a table cell", () => {
    expect(wrapped.find(Table.Cell).length).toEqual(1);
  });

  it("should update on blur", () => {
    wrapped.find(Table.Cell).simulate("blur", { target: { innerText: "New Company" } });
    expect(mockUpdate.mock.calls.length).toEqual(1);
    // check the arguments are correct
    expect(mockUpdate.mock.calls[0][0]).toBe("wefewf3");
    expect(mockUpdate.mock.calls[0][1]).toBe("choices");
    expect(mockUpdate.mock.calls[0][2]).toBe("New Company");
    expect(mockUpdate.mock.calls[0][3]).toBe(0);
  });
});
