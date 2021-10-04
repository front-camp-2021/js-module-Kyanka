export const weirdString = (str = "") => {
 return str.split(" ").map(str => str.length > 0 ? str.slice(0,-1).toUpperCase() + str[str.length-1].toLowerCase() : "").join(" ")
};

