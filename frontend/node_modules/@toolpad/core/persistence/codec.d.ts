/**
 * A codec that can encode and decode values of type V to and from strings.
 * @typeParam V The type of values that can be encoded and decoded.
 */
export interface Codec<V> {
  /**
   * Decodes a string value into a value of type V.
   * @param value The value to decode.
   * @returns The decoded value.
   */
  parse: (value: string) => V;
  /**
   * Encodes a value of type V into a string.
   * @param value The value to encode.
   * @returns The encoded value.
   */
  stringify: (value: V) => string;
}
/**
 * A codec that can encode and decode Date objects to and from strings.
 */
export declare const CODEC_DATE: Codec<Date>;
/**
 * A codec that can encode and decode Date objects to and from strings, but only the date part.
 */
export declare const CODEC_DATE_ONLY: Codec<Date>;
/**
 * A codec that can encode and decode numbers to and from strings.
 */
export declare const CODEC_NUMBER: Codec<number>;
/**
 * A codec that can encode and decode boolean values to and from strings.
 */
export declare const CODE_BOOLEAN: Codec<boolean>;
/**
 * A codec that can encode and decode JSON values to and from strings.
 */
export declare const CODEC_JSON: Codec<unknown>;
/**
 * A codec that can encode and decode JSON values to and from strings.
 * If the JSON value is invalid, parsing will fail.
 */
export declare const CODEC_JSON_STRICT: Codec<unknown>;
/**
 * A codec that can encode and decode strings to and from strings.
 */
export declare const CODEC_STRING: Codec<string>;