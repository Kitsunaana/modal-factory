import type { AnyArrowFn, AnyObject, RecordsMerge } from "./types";
export declare const isFunction: (value: unknown) => value is AnyArrowFn;
export declare const merge: <A extends AnyObject, B extends AnyObject>(a: A, b: B) => RecordsMerge<A, B>;
export declare const isNotEmpty: (value: unknown) => value is object;
