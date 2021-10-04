export const cutStrings = (arr = []) => {
  return arr.map((str) => str.slice(0, arr.reduce((a,b) => a.length <= b.length ? a : b).length));
};



