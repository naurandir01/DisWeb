export declare function useZAxes(): {
  zAxis: {
    [axisId: string]: import("../internals/index.js").ZAxisDefaultized;
  };
  zAxisIds: import("../internals/index.js").AxisId[];
};
export declare function useZAxis(identifier?: number | string): import("../internals/index.js").ZAxisDefaultized;