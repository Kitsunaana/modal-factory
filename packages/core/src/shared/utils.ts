import type { AnyArrowFn, AnyObject, RecordsMerge } from "./types"

export const isFunction = (value: unknown): value is AnyArrowFn => typeof value === "function"
export const merge = <A extends AnyObject, B extends AnyObject>(a: A, b: B): RecordsMerge<A, B> => ({ ...a, ...b })

export const isNotEmpty = (value: unknown): value is object => (
  value !== undefined && 
  value !== null && 
  typeof value === "object"
)