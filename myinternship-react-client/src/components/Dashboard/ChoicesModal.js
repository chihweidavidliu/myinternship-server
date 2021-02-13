import React, { Component } from "react";
import { Icon, Button, Modal } from "semantic-ui-react";
import { withTranslation } from "react-i18next";
import { PDFDocumentFactory, PDFDocumentWriter, drawText, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import _ from "lodash";

import SimHei from "./SimHei.ttf";
import LoadingPage from "components/LoadingPage";

export class ChoicesModal extends Component {
  state = { open: false, downloading: false };

  close = () => this.setState({ open: false });
  show = () => this.setState({ open: true });

  handleConfirm = async () => {
    const { t, i18n, choices, auth } = this.props;
    this.setState({ downloading: true });
    const today = new Date();
    const time = today.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    const date = today.toLocaleDateString("en-GB");

    // get SimHei font and convert it to Uint8Array
    const response = await fetch(SimHei);
    const buffer = await response.arrayBuffer();
    let fontBytes;
    // set the font depending on whether testing or not (cannot fetch and return SimHei Uint8Array in testing env)
    process.env.NODE_ENV === "test" ? (fontBytes = StandardFonts.TimesRoman) : (fontBytes = new Uint8Array(buffer));

    const pdfDoc = PDFDocumentFactory.create();

    // embed the SimHei font (in testing environments this is actually TimesRoman but the reference variables are always SimHei)
    let [simHeiRef, simHeiFont] = [null, null];
    process.env.NODE_ENV === "test"
      ? ([simHeiRef, simHeiFont] = pdfDoc.embedStandardFont(fontBytes))
      : ([simHeiRef, simHeiFont] = pdfDoc.embedNonstandardFont(fontBytes));

    // create new page
    const page = pdfDoc.createPage([350, 500]).addFontDictionary("SimHei", simHeiRef);

    // formatting
    let prompt;
    choices.length === 0 ? (prompt = "renouncePrompt") : (prompt = "confirmPrompt");

    let fontSize;
    i18n.language === "en" ? (fontSize = 8) : (fontSize = 10);

    const headerStyle = { x: 30, size: 14, font: "SimHei", colorRgb: [0, 0, 0] };
    const normalStyle = { x: 30, size: fontSize, font: "SimHei", colorRgb: [0, 0, 0] };

    let pdfContents = [
      drawText(simHeiFont.encodeText(t("dashboard.choicesConfirmation.confirmationSlip.header")), {
        ...headerStyle,
        y: 450
      }),
      drawText(simHeiFont.encodeText(`${t("studentForms.placeholders.studentid")}: ${auth.studentid}`), {
        ...normalStyle,
        y: 430
      }),
      drawText(simHeiFont.encodeText(`${t("studentForms.placeholders.name")}: ${auth.name}`), {
        ...normalStyle,
        y: 410
      }),
      drawText(simHeiFont.encodeText(`${t("studentForms.placeholders.department")}: ${t(`${auth.department}`)}`), {
        ...normalStyle,
        y: 390
      }),
      drawText(simHeiFont.encodeText(t(`dashboard.choicesConfirmation.confirmationSlip.${prompt}`)), {
        ...normalStyle,
        y: 360
      })
    ];

    // prepare choices text
    let startY = 340;
    // split into nested array of groups of 3
    const dividedChoices = _.chunk(choices, 4);
    let index = 1;
    // loop through the array of arrays
    dividedChoices.forEach((subArray) => {
      let text = "";
      subArray.forEach((choice) => {
        text += `${index}.${choice}  `;
        index++;
      });

      // push the text of the row of four choices to pdfContents
      pdfContents.push(
        drawText(simHeiFont.encodeText(text), {
          ...normalStyle,
          y: startY
        })
      );
      // at the end of each subArray start a new line
      startY -= 20;
    });

    const contentEnd = [
      drawText(simHeiFont.encodeText(t(`dashboard.choicesConfirmation.confirmationSlip.signature`)), {
        ...normalStyle,
        y: startY - 20
      }),
      drawText(simHeiFont.encodeText(t("dashboard.choicesConfirmation.confirmationSlip.sumbitInstructions")), {
        ...normalStyle,
        y: startY - 50
      }),
      drawText(
        simHeiFont.encodeText(
          `${t("dashboard.choicesConfirmation.confirmationSlip.date")} : ${date}, ${t(
            "dashboard.choicesConfirmation.confirmationSlip.time"
          )} : ${time}`
        ),
        {
          ...normalStyle,
          y: startY - 80
        }
      )
    ];

    pdfContents = [...pdfContents, ...contentEnd];

    // using apply method on a function allows you to pass arguments as an array;
    const contentStream = pdfDoc.createContentStream.apply(null, pdfContents);

    page.addContentStreams(pdfDoc.register(contentStream));

    pdfDoc.addPage(page);

    const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
    await saveAs(new Blob([pdfBytes], { type: "application/octet-stream" }), "InternshipChoices.pdf");
    this.setState({ downloading: false });
    this.close();
  };

  renderChoices() {
    const { t, choices } = this.props;
    if (choices.length === 0) {
      return <p>{t("dashboard.choicesConfirmation.noChoicesPrompt")}</p>;
    }
    return (
      <div className="confirm-choices-container">
        <p>{t("dashboard.choicesConfirmation.choicesPrompt")}</p>
        <ol className="confirm-choices-list">
          {choices.map((choice) => (
            <li key={choice}>{choice}</li>
          ))}
        </ol>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { open, downloading } = this.state;
    if (downloading === true) {
      return <LoadingPage message={t("dashboard.choicesConfirmation.downloadingPdf")} />;
    }
    return (
      <Modal
        trigger={
          <Button basic color="blue" onClick={this.show}>
            {t("dashboard.choicesConfirmation.buttonText")}
          </Button>
        }
        open={open}
        onClose={this.close}
      >
        <Modal.Header>{t("dashboard.choicesConfirmation.header")}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {this.renderChoices()}
            <p>
              {t("dashboard.choicesConfirmation.downloadInstructions")}
              <br />
              {t("dashboard.choicesConfirmation.signSlipPrompt")}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.close}>
            <Icon name="cancel" /> {t("studentForms.signupModal.dismiss")}
          </Button>
          <Button color="green" onClick={this.handleConfirm}>
            <Icon name="checkmark" /> {t("studentForms.signupModal.confirm")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

ChoicesModal.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  choices: PropTypes.array
};
export default withTranslation()(ChoicesModal);
