import type { 
  Brand,
  AnyRecord,
  AnyArrowFn,
  RecordsMerge,
  GetParameters,
  ExcludeProperty
} from "../../shared/types"

import { BaseStore } from "../store/implementation"

export type PayloadUnbrand<BrandType> = BrandType extends Brand<infer Data, infer Name extends "payload">
  ? ExcludeProperty<Data, { __internal_name: Name }>
  : never

export type PayloadBrand<Payload> = Brand<Payload, "payload">

export type ModalStoreWhenIsOpened<Payload extends unknown> = {
  payload: Payload,
  isOpen: true
}

export type ModalStoreWhenIsNotOpened<Payload extends unknown> = {
  payload?: Payload,
  isOpen: false
}

export type ModalStore<Payload extends unknown, Store extends unknown = {}> = Store & (
  | ModalStoreWhenIsOpened<Payload>
  | ModalStoreWhenIsNotOpened<Payload>
)

export type ModalCreator<
  Type extends string = string,
  Payload extends PayloadBrand<unknown> = PayloadBrand<unknown>,
  Store extends unknown = {},
> = BaseStore<ModalStore<Payload, Store>> & {
  type: Type

  close: () => void
  open: (
    payload:
      | Payload
      | ((context: ModalCreator<Type, Payload, Store> & BaseStore<ModalStore<Payload, Store>>) => Payload)
      | ExcludeProperty<Payload, { __internal_name: "payload" }>
  ) => void

  withParams: <PayloadV2>() => ModalCreator<Type, PayloadBrand<PayloadV2>, Store>

  payload: (payload: PayloadUnbrand<Payload>) => Payload
}

export type AnyModalCreator = ModalCreator<any, PayloadBrand<any>, any>

export type ModalCreatorWithBuilder<Context extends AnyModalCreator> =
  Context extends ModalCreator<infer Type, infer Payload>
    ? ModalCreator<Type, Payload> & Context & { builder: Builder<Context> }
    : never

export type AnyModalCreatorWithBuilder = ModalCreatorWithBuilder<AnyModalCreator>

export type AnotherModalCreator = ModalCreatorWithBuilder<
  ModalCreator<string, PayloadBrand<{}>, {}>
>

export type ExtendModalCreator<ExtendableContext extends AnyModalCreator, ExtendPayload = {}> = {
  [Key in keyof ExtendableContext]: (
    ExtendableContext[Key] extends AnyArrowFn
      ? Parameters<ExtendableContext[Key]>[0] extends PayloadBrand<infer OldPayload>
        ? (payload: PayloadBrand<OldPayload & ExtendPayload>) => ReturnType<ExtendableContext[Key]>
        : ExtendableContext[Key]
      : ExtendableContext[Key]
  )
}

export type WithApplyPayload<Payload extends PayloadBrand<AnyRecord>> = {
  payload: (payload: ExcludeProperty<Payload, { __internal_name: "payload" }>) => Payload
}

export type NextFuntionWithMethods<ContextParam extends AnyModalCreatorWithBuilder, ExtendPayload = {}> = {
  <
    Context extends AnyRecord = {},
    Payload extends PayloadBrand<AnyRecord> = PayloadBrand<{}>,
    Store extends AnyRecord = {},
  >(data: {
    ctx: Context,
  }): (
      ContextParam extends ModalCreatorWithBuilder<infer InferedContext>
        ? InferedContext extends ModalCreator<infer Type, infer OldPayload, infer OldStore>
          ? ExtendModalCreator<
            ModalCreatorWithBuilder<
              RecordsMerge<
                RecordsMerge<InferedContext, Context>,
                ModalCreator<
                  Type,
                  RecordsMerge<OldPayload, Payload & ExtendPayload>,
                  RecordsMerge<OldStore, Store>
                > & WithApplyPayload<RecordsMerge<OldPayload, Payload & ExtendPayload>>
              >
            >,
            ExtendPayload
          > & BaseStore<ModalStore<RecordsMerge<OldPayload, Payload & ExtendPayload>, RecordsMerge<OldStore, Store>>>
          : never
        : never
    )

  extendPayload: <Payload2 extends AnyRecord>() => (
    ContextParam extends ModalCreatorWithBuilder<infer InferedContext>
      ? InferedContext extends ModalCreator<any, infer Payload extends PayloadBrand<unknown>, infer Store>
        ? (
          NextFuntionWithMethods<
            ModalCreatorWithBuilder<
              RecordsMerge<
                InferedContext,
                ModalCreator<
                  InferedContext["type"],
                  PayloadBrand<Payload & Payload2>,
                  Store
                > & WithApplyPayload<Payload & Payload2>
              >
            >,
            Payload2
          >
        )
        : never
      : never
  )

  getContext: () => ContextParam
}

export type GetPayload<Context extends
  | ModalCreatorWithBuilder<AnyModalCreator>
  | NextFuntionWithMethods<ModalCreatorWithBuilder<AnyModalCreator>, any>
> = (
    Context extends ModalCreatorWithBuilder<infer InferedContext>
      ? InferedContext extends ModalCreator<any, infer Payload>
        ? Payload
        : never
      : Context extends NextFuntionWithMethods<ModalCreatorWithBuilder<AnyModalCreator>, any>
        ? GetPayload<ReturnType<Context["getContext"]>>
        : never
  )

export type Builder<ContextParam extends AnyModalCreator> = {
  use: <ConcatedContext extends ModalCreatorWithBuilder<AnyModalCreator>>(
    middleware: (params: {
      context: ModalCreatorWithBuilder<ContextParam>,
      next: NextFuntionWithMethods<ModalCreatorWithBuilder<ContextParam>>
    }) => ConcatedContext
  ) => ConcatedContext
}

export type GetMiddlewareUse<ContextWithBuilder extends AnyModalCreatorWithBuilder> = (
  GetParameters<ContextWithBuilder["builder"]["use"]>
)

export type Middleware<
  Context extends 
    | AnyModalCreatorWithBuilder
    | ((...args: any[]) => AnyModalCreatorWithBuilder),
  ExtendContext = {},
  ExtendPayload = {},
> = Context extends ((...args: any[]) => AnyModalCreatorWithBuilder)
  ? Middleware<ReturnType<Context>, ExtendContext, ExtendPayload>
  : Context extends ModalCreatorWithBuilder<infer InferedContext>
    ? (params: GetParameters<GetMiddlewareUse<Context>>) => InferedContext extends ModalCreator<any, infer Payload, infer Store>
      ? ModalCreatorWithBuilder<
          RecordsMerge<
            RecordsMerge<Omit<InferedContext, "builder">, ExtendContext>,
            ModalCreator<
              InferedContext["type"],
              PayloadBrand<Payload & ExtendPayload>,
              Store
            > & WithApplyPayload<Payload & ExtendPayload>
          >
        >
      : never
    : never