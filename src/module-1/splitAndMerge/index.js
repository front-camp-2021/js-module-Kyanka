export const splitAndMerge = (str = "", separator = "") => {
  return str.split(" ").map(word => word.split("").join(separator)).join(" ");
};

