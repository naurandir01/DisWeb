/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 *
 * Source: https://github.com/facebook/react/blob/c2a196174763e0b4f16ed1c512ed4442b062395e/packages/shared/shallowEqual.js#L18
 */
export declare function shallowEqual(objA: unknown, objB: unknown): boolean;