"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CODE_BOOLEAN = exports.CODEC_STRING = exports.CODEC_NUMBER = exports.CODEC_JSON_STRICT = exports.CODEC_JSON = exports.CODEC_DATE_ONLY = exports.CODEC_DATE = void 0;
/**
 * A codec that can encode and decode values of type V to and from strings.
 * @typeParam V The type of values that can be encoded and decoded.
 */

/**
 * A codec that can encode and decode Date objects to and from strings.
 */
const CODEC_DATE = exports.CODEC_DATE = {
  parse: value => new Date(value),
  stringify: value => value.toISOString()
};

/**
 * A codec that can encode and decode Date objects to and from strings, but only the date part.
 */
const CODEC_DATE_ONLY = exports.CODEC_DATE_ONLY = {
  parse: value => new Date(value),
  stringify: value => value.toISOString().split('T')[0]
};

/**
 * A codec that can encode and decode numbers to and from strings.
 */
const CODEC_NUMBER = exports.CODEC_NUMBER = {
  parse: value => Number(value),
  stringify: value => String(value)
};

/**
 * A codec that can encode and decode boolean values to and from strings.
 */
const CODE_BOOLEAN = exports.CODE_BOOLEAN = {
  parse: value => value === 'true',
  stringify: value => String(value)
};

/**
 * A codec that can encode and decode JSON values to and from strings.
 */
const CODEC_JSON = exports.CODEC_JSON = {
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
const CODEC_JSON_STRICT = exports.CODEC_JSON_STRICT = {
  parse: value => JSON.parse(value),
  stringify: value => JSON.stringify(value)
};

/**
 * A codec that can encode and decode strings to and from strings.
 */
const CODEC_STRING = exports.CODEC_STRING = {
  parse: value => value,
  stringify: value => value
};