/** Animates a ref. The animation can be skipped by setting {@link skip} to true.
 *
 * If possible, prefer {@link useAnimate}.
 *
 * - If {@link skip} is false, a transition will be started.
 * - If {@link skip} is true and no transition is in progress, no transition will be started and {@link applyProps} will
 *   never be called.
 * - If {@link skip} becomes true and a transition is in progress, the transition will immediately end and
 *   {@link applyProps} be called with the final value.
 * */
export declare function useAnimateInternal<Props extends {}, Elem extends Element>(props: Props, {
  createInterpolator,
  applyProps,
  skip,
  initialProps
}: {
  createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
  applyProps: (element: Elem, props: Props) => void;
  skip?: boolean;
  initialProps?: Props;
}): (element: Elem | null) => void;