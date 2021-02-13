// function that loops through student or company array and fills up each item's choices array with empty strings for table formatting
export default (targetArray, longestArray) => {
  return targetArray.map((item) => {
    if (item.choices.length < longestArray.length) {
      let padding = [];
      while (padding.length < longestArray.length - item.choices.length) {
        padding.push("");
      }
      return { ...item, choices: [...item.choices, ...padding] };
    }
    return item;
  });
};
