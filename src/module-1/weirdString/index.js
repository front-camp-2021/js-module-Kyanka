export const weirdString = (str = "") => {
  return str.split(" ").map(word => {
    let isFirst = true;
    return word.split("").reverse().map(char => {
      if (char.toUpperCase() != char.toLowerCase() && isFirst) {
        isFirst = false;
        return char.toLowerCase();
      } else{
        return char.toUpperCase();
      }
    }).reverse().join("")}).join(" ")
}





