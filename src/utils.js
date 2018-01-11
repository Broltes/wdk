function once(fn) {
  let result;
  let isCalled;

  return function (...args) {
    if (!isCalled) {
      result = fn.apply(this, args);
      isCalled = true;
    }

    return result;
  };
}

export default {
  once,
};
