import { sorter } from "components/adminDashboard/sorter";

const students = [
  {
    studentid: "12345",
    name: "David",
    department: "Business",
    choices: ["Google", "Microsoft", "Apple"],
    resolved: false
  },
  { studentid: "2345", name: "Esther", department: "Law", choices: ["Apple", "Google", "Microsoft"], resolved: false },
  { studentid: "3345", name: "Paul", department: "Law", choices: ["Microsoft", "Google", "Apple"], resolved: false },
  { studentid: "4345", name: "Sam", department: "Law", choices: ["Apple", "Microsoft", "Google"], resolved: false },
  { studentid: "3345", name: "Angela", department: "Law", choices: ["Apple", "Google", "Microsoft"], resolved: false }
];

const companyChoices = {
  Google: { _id: "LAgRMuXEtQ", name: "Google", numberAccepted: 2, choices: ["Sam", "Paul", "David", "Angela"] },
  Apple: { _id: "wNmgJVHpQ", name: "Apple", numberAccepted: 2, choices: ["David", "Sam", "Angela", "Esther"] },
  Microsoft: { _id: "lQ-pTI2Lyf", name: "Microsoft", numberAccepted: 1, choices: ["Angela", "Esther", "Paul", "David"] }
};

const tentativeAdmits = {
  Google: [],
  Apple: [],
  Microsoft: []
};
const logger = (type, text) => {
  return text;
};

it("Should sort students", async () => {
  const results = await sorter.sort(students, companyChoices, tentativeAdmits, logger);
  // console.log(JSON.stringify(results, null, 2))
  expect(results.tentativeAdmits.Google).toEqual(["Paul", "David"]);
  expect(results.tentativeAdmits.Apple).toEqual(["Sam", "Angela"]);
  expect(results.tentativeAdmits.Microsoft).toEqual(["Esther"]);
});
