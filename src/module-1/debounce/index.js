export const debounce = (fn, delay = 0) => {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      fn.apply(this, args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, delay)
  };
}





