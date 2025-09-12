import type { AnyArrowFn, AnyRecord, Simplify, UnknownBrand } from "./types"

export type ExtendEveryTupleValue<Tuple extends unknown[], Extend extends AnyRecord = {}, Result extends unknown[] = []> = Simplify<(
  Tuple extends [infer First, ...infer Rest]
    ? ExtendEveryTupleValue<
        Rest,
        Extend,
        [ ...Result, ExtendAnyValue<First, Extend> ]
      >
    : Result
)>

export type ExtendEveryPropertyRecord<Object extends AnyRecord, Extend extends AnyRecord = {}> = Simplify<{
  [Key in keyof Object]: ExtendAnyValue<Object[Key], Extend>
}>

export type ExtendEveryFunctionParams<Function extends AnyArrowFn, Extend extends AnyRecord = {}> = (
  (...args: ExtendEveryTupleValue<Parameters<Function>, Extend>) => ExtendAnyValue<ReturnType<Function>, Extend>
)

export type ExtendValue<Value extends UnknownBrand, Extend extends AnyRecord = {}> = Simplify<Value & Extend>

export type ExtendAnyValue<Value extends unknown, Extend extends AnyRecord = {}> = (
  Value extends UnknownBrand
    ? ExtendValue<Value, Extend>
    : Value extends AnyArrowFn
      ? ExtendEveryFunctionParams<Value, Extend>
      : Value extends AnyRecord
        ? ExtendEveryPropertyRecord<Value, Extend>
        : Value extends unknown[]
          ? ExtendEveryTupleValue<Value, Extend>
          : Value
)
