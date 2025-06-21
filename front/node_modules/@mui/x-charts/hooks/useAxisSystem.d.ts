/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
export declare function useAxisSystem(): 'none' | 'polar' | 'cartesian';