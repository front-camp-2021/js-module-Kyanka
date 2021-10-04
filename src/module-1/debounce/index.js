export const debounce = (fn, delay = 0) => {
  let timeout = false;
  return function() {
    if (timeout) return;
    fn.apply(this, arguments);
    timeout = true;
    setTimeout(() => timeout = false, delay);
  };
}



