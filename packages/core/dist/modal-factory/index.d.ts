import type { BaseStoreImpl, CreateAdapterFn, ModalStore } from "../noop-store/types";
import type { AnyArrowFn, AnyObject, GetParameters } from "../shared/types";
import type { AbstractFnToMiddleware, AnotherModalCreator, AnyModalCreator, AnyNextFunctionWithMethods, AnyPayloadBrand, AnyStoreBrand, Builder, DeepExtendModalCreator, ExtendModalCreator, GetPayload, Middleware, ModalCreator, ModalCreatorWithBuilder, PayloadBrand, PayloadUnbrand, StoreUnbrand } from "./types";
export declare class Modal<Type extends string = string, Payload extends AnyObject = AnyObject, Store extends AnyObject = AnyObject> {
    readonly type: Type;
    readonly store: BaseStoreImpl<ModalStore<Payload, Store>>;
    private _modifiedContext;
    builder: Builder<ModalCreator<Type, Payload>>;
    constructor(type: Type, store: BaseStoreImpl<ModalStore<Payload, Store>>);
    withParams<PayloadV2 extends AnyObject>(): ModalCreatorWithBuilder<{
        type: Type;
        close: () => void;
        open: (payload: PayloadV2) => void;
        store: BaseStoreImpl<ModalStore<PayloadV2, Store>>;
        usePayload: <IsOpen extends boolean>(isOpen?: IsOpen | undefined) => IsOpen extends true ? PayloadV2 : undefined;
        useIsOpen: () => boolean;
    }>;
    useIsOpen(): (Store & {
        payload: Payload;
        isOpen: true;
    })["isOpen"] | (Store & {
        payload?: Payload | undefined;
        isOpen: false;
    })["isOpen"];
    usePayload(): (Store & {
        payload: Payload;
        isOpen: true;
    })["payload"] | (Store & {
        payload?: Payload | undefined;
        isOpen: false;
    })["payload"] | undefined;
    open(payload: Payload): void;
    close(): void;
}
export declare const createDirector: <T extends Record<string, readonly (Modal.middleware<AnyModalCreator, any, any> | Modal.middleware<AnotherModalCreator, any, any>)[]>>({ variants, createStore, }: {
    variants: T;
    createStore?: CreateAdapterFn;
}) => { [Key in keyof T]: <Type extends string>(type: Type) => (ModalCreatorWithBuilder<DeepExtendModalCreator<Type, T[Key]> & {
    withParams: <PayloadV2 extends AnyObject>() => ModalCreatorWithBuilder<ExtendModalCreator<DeepExtendModalCreator<Type, T[Key]>, PayloadV2>>;
}>); };
export declare const combine: <M extends AnyArrowFn>(callback: M) => <Params extends Modal.params>(params: Params) => AbstractFnToMiddleware<M> extends Modal.middleware<any, infer Context, infer Payload> ? ModalCreatorWithBuilder<ExtendModalCreator<Params["context"] & Context, Payload>> : never;
export declare const toBrand: {
    payload: <Payload extends AnyPayloadBrand>(params: PayloadUnbrand<Payload>) => Payload;
    store: <Store extends AnyStoreBrand>(params: StoreUnbrand<Store>) => Store;
};
type FnReturnAnyModalCreatorWithBuilder = (...args: any[]) => AnyModalCreator;
type AvailableContextUnion = AnyModalCreator | AnyNextFunctionWithMethods | FnReturnAnyModalCreatorWithBuilder;
export declare namespace Modal {
    type payload<Context extends AvailableContextUnion> = (Context extends FnReturnAnyModalCreatorWithBuilder ? PayloadUnbrand<GetPayload<ReturnType<Context>>> : Context extends AnyModalCreator | AnyNextFunctionWithMethods ? PayloadUnbrand<GetPayload<Context>> : never);
    type payloadWithBrand<Context extends AvailableContextUnion> = PayloadBrand<payload<Context>>;
    type middleware<Context extends AnyModalCreator, ExtendContext extends AnyObject = AnyObject, ExtendPayload extends AnyObject = AnyObject> = Middleware<Context, ExtendContext, ExtendPayload>;
    type params = GetParameters<Middleware<AnotherModalCreator, any, any>>;
}
export {};
