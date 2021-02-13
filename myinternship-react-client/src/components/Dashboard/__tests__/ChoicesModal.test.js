import React from "react";
import { shallow } from "enzyme";
import { Modal, Button } from "semantic-ui-react";
import { PDFDocumentFactory, PDFDocumentWriter } from "pdf-lib";
import fileSaver from "file-saver";
import { ChoicesModal } from "components/Dashboard/ChoicesModal";

let wrapped;
let mockT;

// mock file saver
jest.mock("file-saver", () => ({ saveAs: jest.fn() }));
global.Blob = function(content, options) {
  return { content, options };
};

// mock fetch and convert font
const mockArrayBuffer = { arrayBuffer: jest.fn(() => "buffer") };
const fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() => mockArrayBuffer);

const pdfCreateSpy = jest.spyOn(PDFDocumentFactory, "create");
const saveToBytesSpy = jest.spyOn(PDFDocumentWriter, "saveToBytes");

describe("When there are choices", () => {
  beforeEach(() => {
    mockT = jest.fn(() => "text");
    const props = {
      t: mockT,
      i18n: { language: "en" },
      auth: {
        _id: "5c8d30c5d5d85aa69a3b706f",
        studentid: "12345",
        name: "David",
        department: "studentForms.departments.Management",
        choices: ["Apple", "Amazon", "Uber", "LG"]
      },
      choices: ["Apple", "Amazon", "Uber", "LG"]
    };
    wrapped = shallow(<ChoicesModal {...props} />);
    wrapped.setState({ open: true });
  });

  it("should render a Modal", () => {
    expect(wrapped.find(Modal).length).toBe(1);
    expect(wrapped.find(Button).length).toBe(2);
  });

  it("should render an ol with each choice", () => {
    expect(wrapped.find("ol").length).toBe(1);
    expect(wrapped.find("li").length).toBe(4);
  });

  it("should close on cancel", () => {
    expect(wrapped.state("open")).toBe(true);
    wrapped.find({ color: "red" }).simulate("click");
    wrapped.update();
    expect(wrapped.state("open")).toBe(false);
  });

  it("should create a pdf on submit", async (done) => {
    expect(wrapped.state("downloading")).toBe(false);
    // create instance to directly trigger handleConfirm (this allows us to use await and make our assertions after everything has done - no more setTimeout!)
    const instance = wrapped.instance();
    await instance.handleConfirm();
    wrapped.update();
    expect(fetchSpy).toHaveBeenCalled();
    expect(pdfCreateSpy).toHaveBeenCalled();
    expect(saveToBytesSpy).toHaveBeenCalled();
    expect(fileSaver.saveAs).toHaveBeenCalled();
    expect(wrapped.state("downloading")).toBe(false);
    done();
  });
});
