declare function sliceUntilModern(text: string, endIndex: number): string;
/** Creates a slice of {@link text} from the start until the {@link endIndex}th grapheme (basically character). */
export declare const sliceUntil: typeof sliceUntilModern;
export {};