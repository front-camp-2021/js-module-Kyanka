export const splitAndMerge = (str = "", separator = "") => {
  return str.split(" ").map(str => str.split("").join(separator)).join(" ");
};

