export const sorter = {
  async sort(students, companyChoices, tentativeAdmits, logger) {
    let round = 1;

    while (students.some((student) => student.resolved === false)) {
      await logger("round", `Round ${round}`);
      // console.log(`Round ${round}`);
      // loop through students
      for (let i = 0; i < students.length; i++) {
        // skip students who have been resolved tentatively or definitively
        if (students[i].resolved === true || students[i].resolved === "tentative") {
          continue;
        }
        const currentStudent = students[i].name;
        logger("header", `Current Student: ${currentStudent}`);
        // console.log(`CURRENT STUDENT: ${currentStudent}`);

        if (students[i].choices.length === 0) {
          students[i].choices = ["Eliminated"];
          students[i].resolved = true;

          // remove instances of the student from companyChoices;
          for (let company in companyChoices) {
            const filtered = companyChoices[company].choices.filter((choice) =>
              choice !== currentStudent ? true : false
            );
            companyChoices[company].choices = filtered;
          }

          if (round === 1) {
            logger("warning", `${currentStudent} has not made any choices and has been removed from contention.`);
            // console.log(`${currentStudent} has not made any choices and has been removed from contention.`);
          } else {
            logger(
              "warning",
              `${currentStudent} has been eliminated by all choices and has been removed from contention.`
            );
            // console.log(`${currentStudent} has been eliminated by all choices and has been removed from contention.`);
          }
          continue;
        }

        // if student has choices, loop through them
        for (let j = 0; j < students[i].choices.length; j++) {
          let currentStudentChoice = students[i]["choices"][j];
          // skip companies chosen by students which do not appear in the companies list for whatever reason
          if (!companyChoices[currentStudentChoice]) {
            // mark student as eliminated from this choice
            students[i]["choices"][j] = "eliminated";
            logger("message", `Choice number ${j + 1} for ${currentStudent} is ${currentStudentChoice}`);
            logger("warning", `This company is not on the company list.`);
            logger("message", `Moving to next choice`);
            //console.log(`Choice number ${j + 1} for ${currentStudent} is ${currentStudentChoice}`);
            // console.log(`This company is not on the company list.`);
            // console.log("Moving on to next choice");
            continue;
          }

          const currentCompanyChoices = companyChoices[currentStudentChoice].choices;
          logger("message", `Choice number ${j + 1} for ${currentStudent} is ${currentStudentChoice}`);
          // console.log(`Choice number ${j + 1} for ${currentStudent} is ${currentStudentChoice}`);

          if (currentCompanyChoices.includes(currentStudent) === false) {
            logger("warning", `${currentStudent} eliminated by ${currentStudentChoice} (not on company list)`);
            // console.log(`${currentStudent} eliminated by ${currentStudentChoice} (not on company list)`);
            students[i]["choices"][j] = "eliminated";
            continue;
          }
          // if the student is in the company list
          const numberAccepted = companyChoices[currentStudentChoice].numberAccepted;
          logger("message", `${currentStudentChoice} accepts ${numberAccepted} student(s)`);
          // console.log(`${currentStudentChoice} accepts ${numberAccepted} student(s)`);

          const currentNumberOfAdmits = tentativeAdmits[currentStudentChoice].length;
          logger("message", `${currentStudentChoice} has currently accepted ${currentNumberOfAdmits} student(s)`);
          // console.log(`${currentStudentChoice} has currently accepted ${currentNumberOfAdmits} student(s)`);

          // push the current student name into the tentativeAdmits provisionally
          tentativeAdmits[currentStudentChoice].push(currentStudent);
          // sort the array in rank order
          tentativeAdmits[currentStudentChoice].sort(function(a, b) {
            return (
              companyChoices[currentStudentChoice]["choices"].indexOf(a) -
              companyChoices[currentStudentChoice]["choices"].indexOf(b)
            );
          });

          // if adding the student does not surpass the quota
          if (tentativeAdmits[currentStudentChoice].length <= numberAccepted) {
            logger("success", `${currentStudent} shortlisted by ${currentStudentChoice}`);
            // console.log(`${currentStudent} shortlisted by ${currentStudentChoice}`);
            // mark student as tentatively resolved
            students[i].resolved = "tentative";
            // move on to next student
            break;
          }

          // if company's quota is already filled
          logger("message", `${currentStudentChoice}'s quota has already been filled`);
          logger("message", "Checking student ranking");
          // console.log(`${currentStudentChoice}'s quota has already been filled`);
          // console.log("Checking student ranking");

          // if last person in array is the current student, student is rejected
          const lastPerson = tentativeAdmits[currentStudentChoice].length - 1;

          if (tentativeAdmits[currentStudentChoice][lastPerson] === currentStudent) {
            logger("warning", `${currentStudent} is ranked lower than current admits.`);
            logger("warning", `${currentStudent} is eliminated from contention.`);
            // console.log(`${currentStudent} is ranked lower than current admits and has been eliminated from contention.`);

            // mark the choice as eliminated
            students[i]["choices"][j] = "eliminated";
            // remove the student from tentative admits array
            tentativeAdmits[currentStudentChoice].pop();
            // move on to next choice
            continue;
          }

          // if last person in the array is not the current student
          logger("success", `${currentStudent} shortlisted by ${currentStudentChoice}`);
          // console.log(`${currentStudent} shortlisted by ${currentStudentChoice}`);

          // mark current student resolved status as tentative
          students[i]["resolved"] = "tentative";

          // log to console the name of the displaced person
          // console.log(
          //   `${tentativeAdmits[currentStudentChoice][lastPerson]} has been removed from ${currentStudentChoice}'s list.`
          // );
          logger(
            "warning",
            `${tentativeAdmits[currentStudentChoice][lastPerson]} has been removed from ${currentStudentChoice}'s list.`
          );

          // remove the company name from the displaced student's choices array and mark the student as unresolved
          students.forEach((student) => {
            if (student.name === tentativeAdmits[currentStudentChoice][lastPerson]) {
              student.choices = [...student.choices].filter((choice) => choice !== currentStudentChoice);
              student.resolved = false;
            }
          });

          // remove displaced person from tentative admits array
          tentativeAdmits[currentStudentChoice].pop();

          // move on to next student
          break;
        }
      }
      // after each round, filter out instances of 'eliminated' from the students' choices
      students.forEach((student) => {
        if (Array.isArray(student.choices)) {
          // ignore students who do not have a choices array
          const filtered = student.choices.filter((choice) => {
            return choice !== "eliminated";
          });
          student["choices"] = filtered;
        }
      });

      // console.log(`Student choices after this round:`);
      // console.log(students);
      // console.log(`Tentative Admits after this round:`);
      // console.log(tentativeAdmits);

      logger("header", "Tentative Admits after this round:");
      for (let company in tentativeAdmits) {
        let list = "";
        let rank = 1;
        tentativeAdmits[company].forEach((admit) => {
          list += `${rank}. ${admit} `;
          rank++;
        });
        logger("tentativeAdmits", { company: company, list: list });
      }

      round++;
    }
    // after all students are resolved, mark all students as resolved (as opposed to tentative)
    students.forEach((student) => {
      student.resolved = true;
    });

    logger("round", "Sorting completed");
    // console.log("sorting completed");
    // console.log(tentativeAdmits);
    // console.log(students);

    return { students: students, tentativeAdmits: tentativeAdmits, companyChoices: companyChoices, sortFinished: true };
  }
};
