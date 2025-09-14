interface EllipsizeConfig {
  width: number;
  height: number;
  /** Angle, in degrees, in which the text should be displayed */
  angle: number;
  measureText: (text: string) => {
    width: number;
    height: number;
  };
}
export declare function doesTextFitInRect(text: string, config: EllipsizeConfig): boolean;
/** This function finds the best place to clip the text to add an ellipsis.
 *  This function assumes that the {@link doesTextFit} never returns true for longer text after returning false for
 *  shorter text.
 *
 *  @param text Text to ellipsize if needed
 *  @param doesTextFit a function that returns whether a string fits inside a container.
 */
export declare function ellipsize(text: string, doesTextFit: (text: string) => boolean): string;
export {};