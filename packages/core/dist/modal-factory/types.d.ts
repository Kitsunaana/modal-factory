import { Modal } from ".";
import type { BaseStoreImpl, ModalStore } from "../noop-store/types";
import type { AnyArrowFn, AnyObject, Brand, ExcludeProperty, ExtendAnyValue, GetParameters, RecordsMerge, Simplify } from "../shared/types";
export type PayloadBrand<Payload> = Simplify<Brand<Payload, "payload">>;
export type StoreBrand<Store> = Simplify<Brand<Store, "store">>;
export type AnyPayloadBrand = PayloadBrand<unknown>;
export type AnyStoreBrand = StoreBrand<unknown>;
export type PayloadUnbrand<BrandType extends AnyPayloadBrand> = Simplify<ExcludeProperty<BrandType, {
    __internal_name: "payload";
}>>;
export type StoreUnbrand<BrandType extends AnyStoreBrand> = Simplify<ExcludeProperty<BrandType, {
    __internal_name: "store";
}>>;
export type ModalCreator<Type extends string = string, Payload extends AnyObject = AnyObject, Store extends AnyObject = AnyObject> = Simplify<{
    type: Type;
    close: () => void;
    open: (payload: Payload) => void;
    store: BaseStoreImpl<ModalStore<Payload, Store>>;
    usePayload: <IsOpen extends boolean>(isOpen?: IsOpen) => IsOpen extends true ? Payload : undefined;
    useIsOpen: () => boolean;
}>;
export type AnyModalCreator = ModalCreator<string, any, any>;
export type FindAllDifferentProperties<Context extends AnyModalCreator, ExtendedContext extends AnyModalCreator> = {
    [Key in keyof ExtendedContext as Key extends keyof Context ? never : Key]: ExtendedContext[Key];
};
export type GetUniqueContextProperties<Context extends AnyModalCreator> = FindAllDifferentProperties<AnyModalCreator, Context>;
export type ModalCreatorWithBuilder<Context extends AnyModalCreator> = Context & {
    builder: Builder<Context>;
};
export type ExtendModalCreator<Context extends AnyModalCreator, Payload extends AnyObject = AnyObject, Store extends AnyObject = AnyObject> = (Context extends ModalCreator<any, infer IPayload, infer IStore> ? Simplify<ModalCreator<Context["type"], Simplify<RecordsMerge<IPayload, Payload>>, Simplify<RecordsMerge<IStore, Store>>> & Simplify<ExtendAnyValue<GetUniqueContextProperties<Context>, Simplify<RecordsMerge<IPayload, Payload>>>>> : never);
export type NextFuntionWithMethods<ContextParam extends AnyModalCreator, ExtendPayload extends AnyObject = AnyObject> = {
    getContext: () => ContextParam;
    <Context extends AnyObject = AnyObject, Store extends AnyObject = AnyObject>(data: {
        ctx?: Context;
        store?: Store;
    }): (ModalCreatorWithBuilder<ExtendModalCreator<ContextParam & Context, ExtendPayload, Store>>);
    extendPayload: <Payload2 extends AnyObject>() => (NextFuntionWithMethods<ExtendModalCreator<ContextParam, Payload2>, Payload2>);
};
export type AnyNextFunctionWithMethods = NextFuntionWithMethods<AnyModalCreator, any>;
export type GetPayload<Context extends AnyModalCreator | AnyNextFunctionWithMethods> = (Context extends AnyModalCreator ? Context extends ModalCreator<any, infer Payload> ? Payload : never : Context extends AnyNextFunctionWithMethods ? GetPayload<ReturnType<Context["getContext"]>> : never);
export type Builder<ContextParam extends AnyModalCreator> = {
    use: <ConcatedContext extends ModalCreatorWithBuilder<AnyModalCreator>>(middleware: (params: {
        context: ContextParam;
        next: NextFuntionWithMethods<ContextParam>;
    }) => ConcatedContext) => ConcatedContext;
};
export type AnotherModalCreator = ModalCreator<string, AnyObject, AnyObject>;
export type Middleware<Context extends AnyModalCreator = AnyModalCreator, ExtendContext extends AnyObject = AnyObject, ExtendPayload extends AnyObject = AnyObject> = (...params: Parameters<GetParameters<ModalCreatorWithBuilder<Context>["builder"]["use"]>>) => (ModalCreatorWithBuilder<ExtendModalCreator<Context & ExtendContext, ExtendPayload>>);
export type IsModalCreator<Value extends unknown> = Value extends AnyModalCreator | AnotherModalCreator ? true : false;
export type ExcludeBuilder<Context extends AnyModalCreator | ModalCreatorWithBuilder<AnyModalCreator>> = Simplify<Omit<Context, "builder">>;
export type AbstractFnToMiddleware<Fn extends AnyArrowFn> = IsModalCreator<ReturnType<Fn>> extends true ? ExcludeBuilder<ReturnType<Fn>> extends ModalCreator<any, infer Payload> ? Modal.middleware<AnotherModalCreator, GetUniqueContextProperties<ExcludeBuilder<ReturnType<Fn>>>, Payload> : never : never;
export type DeepExtendModalCreator<Type extends string, Middlewares extends readonly unknown[], ResultContext extends AnyObject = AnyObject, ResultPayload extends AnyObject = AnyObject> = (Middlewares extends readonly [infer First extends AnyArrowFn, ...infer Rest] ? AbstractFnToMiddleware<First> extends Modal.middleware<any, infer Context, infer Payload> ? DeepExtendModalCreator<Type, Rest, RecordsMerge<ResultContext, Context>, RecordsMerge<ResultPayload, Payload>> : DeepExtendModalCreator<Type, Rest, ResultContext, ResultPayload> : ExtendModalCreator<ModalCreator<Type> & ResultContext, ResultPayload>);
