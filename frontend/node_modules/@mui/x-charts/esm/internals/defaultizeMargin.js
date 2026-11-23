import _extends from "@babel/runtime/helpers/esm/extends";
export function defaultizeMargin(input, defaultMargin) {
  if (typeof input === 'number') {
    return {
      top: input,
      bottom: input,
      left: input,
      right: input
    };
  }
  if (defaultMargin) {
    return _extends({}, defaultMargin, input);
  }
  return input;
}