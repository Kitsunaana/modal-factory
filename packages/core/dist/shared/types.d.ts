export type ExcludeProperty<Target, ExcludeProperty> = {
    [Key in keyof Target as Key extends keyof ExcludeProperty ? [Target[Key]] extends [ExcludeProperty[Key]] ? never : Key : Key]: Target[Key];
};
export type Brand<T, N = string> = T & {
    __internal_name: N;
};
export type AnyRecord = Record<string, any>;
export type AnyObject = {};
export type UnknownBrand = Brand<unknown, string>;
export type RecordsMerge<Old, Add> = Omit<Old, keyof Add> & Add;
export type AnyArrowFn = (...args: any[]) => any;
export type GetParameters<T extends AnyArrowFn> = Parameters<T>[0];
export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
export type SimplifyUnion<T> = T extends any ? T : never;
export type ExtendEveryTupleValue<Tuple extends unknown[], Extend extends AnyRecord = {}, Result extends unknown[] = []> = Simplify<(Tuple extends [infer First, ...infer Rest] ? ExtendEveryTupleValue<Rest, Extend, [
    ...Result,
    ExtendAnyValue<First, Extend>
]> : Result)>;
export type ExtendEveryPropertyRecord<Object extends AnyRecord, Extend extends AnyRecord = {}> = Simplify<{
    [Key in keyof Object]: ExtendAnyValue<Object[Key], Extend>;
}>;
export type ExtendEveryFunctionParams<Function extends AnyArrowFn, Extend extends AnyRecord = {}> = ((...args: ExtendEveryTupleValue<Parameters<Function>, Extend>) => ExtendAnyValue<ReturnType<Function>, Extend>);
export type ExtendValue<Value extends UnknownBrand, Extend extends AnyRecord = {}> = Simplify<Value & Extend>;
export type ExtendAnyValue<Value extends unknown, Extend extends AnyRecord = {}> = (Value extends UnknownBrand ? ExtendValue<Value, Extend> : Value extends AnyArrowFn ? ExtendEveryFunctionParams<Value, Extend> : Value extends AnyRecord ? ExtendEveryPropertyRecord<Value, Extend> : Value extends unknown[] ? ExtendEveryTupleValue<Value, Extend> : Value);
