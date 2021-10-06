export const cutStrings = (arr = []) => {
  let minLen = arr.length ? arr[0].length : 0;
  arr.forEach((word) => { minLen = word.length <= minLen ? word.length : minLen});
  return arr.map(word => word.slice(0,minLen));
};




