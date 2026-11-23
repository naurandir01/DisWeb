/**
 * A resumable transition class inspired by d3-transition.
 * Allows for starting, and stopping and resuming transitions.
 *
 * The transition is started automatically.
 * A transition cannot be restarted after it has finished.
 * Resuming a transition will continue from the point it was stopped, i.e., easing will continue from the point it was
 * stopped.
 */
export declare class Transition {
  private readonly duration;
  private elapsed;
  private readonly easingFn;
  private timer;
  private readonly onTickCallback;
  /**
   * Create a new ResumableTransition.
   * @param duration Duration in milliseconds
   * @param easingFn The easing function
   * @param onTick Callback function called on each animation frame with the eased time in range [0, 1].
   */
  constructor(duration: number, easingFn: (t: number) => number, onTick: (easedT: number) => void);
  private get running();
  private timerCallback;
  /**
   * Resume the transition
   */
  resume(): this;
  /**
   * Stops the transition.
   */
  stop(): this;
  /**
   * Immediately finishes the transition and calls the tick callback with the final value.
   */
  finish(): this;
}