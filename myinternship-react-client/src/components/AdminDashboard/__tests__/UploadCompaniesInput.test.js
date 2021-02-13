import React from "react";
import { shallow } from "enzyme";
import { Input } from "semantic-ui-react";

import { UploadCompaniesInput } from "components/AdminDashboard/UploadCompaniesInput";

let wrapped;
let mockOnChange;

beforeEach(() => {
  mockOnChange = jest.fn();
  const props = {
    onChange: mockOnChange
  };
  wrapped = shallow(<UploadCompaniesInput {...props} />);
});

it("should render an input", () => {
  expect(wrapped.find(Input).length).toBe(1);
});

it("should call redux onChange on change", () => {
  wrapped.find(Input).simulate("change", { target: { files: ["file"] }, preventDefault: () => { return } });
  wrapped.update();
  expect(mockOnChange.mock.calls.length).toBe(1);
});
