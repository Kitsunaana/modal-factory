import type { ExtendAnyValue } from "../../shared/extend-any-value"
import type {
  Brand,
  ExcludeProperty,
  GetParameters,
  RecordsMerge,
  Simplify
} from "../../shared/types"

export type PayloadBrand<Payload> = Simplify<Brand<Payload, "payload">>
export type StoreBrand<Store> = Simplify<Brand<Store, "store">>

export type AnyPayloadBrand = PayloadBrand<unknown>
export type AnyStoreBrand = StoreBrand<unknown>

export type PayloadUnbrand<BrandType extends AnyPayloadBrand> = Simplify<ExcludeProperty<
  BrandType, { __internal_name: "payload" }
>>
export type StoreUnbrand<BrandType extends AnyStoreBrand> = Simplify<ExcludeProperty<
  BrandType, { __internal_name: "store" }
>>

export type ModalStoreWhenIsOpened<Payload> = Simplify<{
  payload: Payload,
  isOpen: true
}>

export type ModalStoreWhenIsNotOpened<Payload> = Simplify<{
  payload?: Payload,
  isOpen: false
}>

export type ModalStore<Payload, Store> = 
  Simplify<Store & (
    | ModalStoreWhenIsOpened<Payload>
    | ModalStoreWhenIsNotOpened<Payload>
  )>

export type AnyModalStore = ModalStore<unknown, unknown>
export type AnyObject = {}

export type ModalCreator<
  Type extends string = string,
  Payload extends AnyObject = AnyObject,
  Store extends AnyObject = AnyObject,
> = Simplify<{
  type: Type

  close: () => void
  open: (payload: Payload) => void

  withParams: <PayloadV2 extends AnyObject>() => ModalCreator<Type, PayloadV2, Store>
}>

export type AnyModalCreator = ModalCreator<string, any, any>

export type FindAllDifferentProperties<
  Context extends AnyModalCreator, 
  ExtendedContext extends AnyModalCreator
> = {
  [Key in keyof ExtendedContext as Key extends keyof Context ? never : Key]: ExtendedContext[Key]
}

export type GetUniqueContextProperties<Context extends AnyModalCreator> = 
  FindAllDifferentProperties<AnyModalCreator, Context>

export type ModalCreatorWithBuilder<Context extends AnyModalCreator> = Context & { builder: Builder<Context> }

export type ExtendModalCreator<Context extends AnyModalCreator, Payload extends AnyObject = AnyObject> = (
  Context extends ModalCreator<any, infer IPayload>
    ? Simplify<
        ModalCreator<Context["type"], Simplify<
          RecordsMerge<IPayload, Payload>
        >> 
        & Simplify<
            ExtendAnyValue<
              GetUniqueContextProperties<Context>,
              Simplify<RecordsMerge<IPayload, Payload>>
            >
          > 
      >
    : never
)

export type NextFuntionWithMethods<ContextParam extends AnyModalCreator, ExtendPayload extends AnyObject = AnyObject> = {
  getContext: () => ContextParam
  
  <Context extends AnyObject = AnyObject>(data: { ctx: Context }): (
    ModalCreatorWithBuilder<ExtendModalCreator<ContextParam & Context, ExtendPayload>>
  )

  extendPayload: <Payload2 extends AnyObject>() => (
    NextFuntionWithMethods<
      ExtendModalCreator<ContextParam, Payload2>,
      Payload2
    >
  )
}

export type AnyNextFunctionWithMethods = NextFuntionWithMethods<AnyModalCreator, any> 

export type GetPayload<Context extends
  | AnyModalCreator
  | AnyNextFunctionWithMethods
> = (
  Context extends AnyModalCreator
    ? Context extends ModalCreator<any, infer Payload>
      ? Payload
      : never
    : Context extends AnyNextFunctionWithMethods
      ? GetPayload<ReturnType<Context["getContext"]>>
      : never
)

export type Builder<ContextParam extends AnyModalCreator> = {
  use: <ConcatedContext extends ModalCreatorWithBuilder<AnyModalCreator>>(
    middleware: (params: {
      context: ContextParam,
      next: NextFuntionWithMethods<ContextParam>
    }) => ConcatedContext
  ) => ConcatedContext
}

// Middleware<LoginModal, {...}, {...}>
// Middleware<AbstractModal, {...}, {...}>
// Params<LoginModal>
// Params<AbstractModal>

export type AnotherModalCreator = ModalCreator<string, AnyObject, AnyObject>

export type Middleware<
  Context extends AnyModalCreator = AnyModalCreator, 
  ExtendContext extends AnyObject = AnyObject,
  ExtendPayload extends AnyObject = AnyObject,
> = (...params: Parameters<GetParameters<ModalCreatorWithBuilder<Context>["builder"]["use"]>>) => (
  ModalCreatorWithBuilder<ExtendModalCreator<Context & ExtendContext, ExtendPayload>>
) 