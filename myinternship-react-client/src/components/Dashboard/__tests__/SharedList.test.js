import React from "react";
import { shallow } from "enzyme";
import Sortable from "react-sortablejs";

import { SharedList } from "components/Dashboard/SharedList";

let wrapped;
let mockT;
let mockOnChange;

describe("options", () => {
  beforeEach(() => {
    mockT = jest.fn();
    mockOnChange = jest.fn();

    const props = {
      t: mockT,
      auth: {
        _id: "5c8d30c5d5d85aa69a3b706f",
        studentid: "12345",
        name: "David",
        department: "studentForms.departments.Management",
        choices: ["Apple", "Amazon", "Uber", "LG"]
      },
      items: ["Apple", "Amazon", "Uber", "LG", "Deliveroo"],
      listType: "ul",
      type: "options",
      onChange: mockOnChange
    }

    wrapped = shallow(<SharedList {...props} />)
  });

  it("should render a Sortable", () => {
    expect(wrapped.find(Sortable).length).toBe(1);
    expect(wrapped.find(Sortable).props().tag).toBe("ul");
  });
  it("should render the companies the student hasn't chosen", () => {
    expect(wrapped.find("li").length).toBe(1);
    expect(wrapped.find("li").text()).toBe("Deliveroo");
  });
});

describe("choices", () => {
  beforeEach(() => {
    mockT = jest.fn();
    mockOnChange = jest.fn();

    const props = {
      t: mockT,
      auth: {
        _id: "5c8d30c5d5d85aa69a3b706f",
        studentid: "12345",
        name: "David",
        department: "studentForms.departments.Management",
        choices: ["Apple", "Amazon", "Uber", "LG"]
      },
      items: ["Apple", "Amazon", "Uber", "LG"],
      listType: "ol",
      type: "choices",
      onChange: mockOnChange
    }

    wrapped = shallow(<SharedList {...props} />)
  });

  it("should render a Sortable", () => {
    expect(wrapped.find(Sortable).length).toBe(1);
    expect(wrapped.find(Sortable).props().tag).toBe("ol");
  });
  it("should render the companies the student hasn't chosen", () => {
    expect(wrapped.find("li").length).toBe(4);
    expect(wrapped.find({ "data-id": "Apple" }).length).toBe(1);
    expect(wrapped.find({ "data-id": "Amazon" }).length).toBe(1);
    expect(wrapped.find({ "data-id": "Uber" }).length).toBe(1);
    expect(wrapped.find({ "data-id": "LG" }).length).toBe(1);
  });
});
