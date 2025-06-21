/**
 * A codec that can encode and decode values of type V to and from strings.
 * @typeParam V The type of values that can be encoded and decoded.
 */

/**
 * A codec that can encode and decode Date objects to and from strings.
 */
export const CODEC_DATE = {
  parse: value => new Date(value),
  stringify: value => value.toISOString()
};

/**
 * A codec that can encode and decode Date objects to and from strings, but only the date part.
 */
export const CODEC_DATE_ONLY = {
  parse: value => new Date(value),
  stringify: value => value.toISOString().split('T')[0]
};

/**
 * A codec that can encode and decode numbers to and from strings.
 */
export const CODEC_NUMBER = {
  parse: value => Number(value),
  stringify: value => String(value)
};

/**
 * A codec that can encode and decode boolean values to and from strings.
 */
export const CODE_BOOLEAN = {
  parse: value => value === 'true',
  stringify: value => String(value)
};

/**
 * A codec that can encode and decode JSON values to and from strings.
 */
export const CODEC_JSON = {
  parse: value => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  stringify: value => JSON.stringify(value)
};

/**
 * A codec that can encode and decode JSON values to and from strings.
 * If the JSON value is invalid, parsing will fail.
 */
export const CODEC_JSON_STRICT = {
  parse: value => JSON.parse(value),
  stringify: value => JSON.stringify(value)
};

/**
 * A codec that can encode and decode strings to and from strings.
 */
export const CODEC_STRING = {
  parse: value => value,
  stringify: value => value
};