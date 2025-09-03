import type { AnyObject } from "../../kernel/modal-factory/interface"
import type { AnyArrowFn, RecordsMerge } from "../types"

export const isFunction = (value: unknown): value is AnyArrowFn => typeof value === "function" 
export const merge = <A extends AnyObject, B extends AnyObject>(a: A, b: B): RecordsMerge<A, B> => ({ ...a, ...b }) 