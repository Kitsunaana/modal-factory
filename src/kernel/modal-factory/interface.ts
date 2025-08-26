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

  ExtendContext = {}
> = BaseStore<ModalStore<Payload, Store>> & ExtendContext & {
  type: Type

  close: () => void
  open: (
    payload:
      | Payload
      | ((context: ModalCreator<Type, Payload, Store, ExtendContext> & BaseStore<ModalStore<Payload, Store>>) => Payload)
      | ExcludeProperty<Payload, { __internal_name: "payload" }>
  ) => void

  withParams: <PayloadV2>() => ModalCreator<Type, PayloadBrand<PayloadV2>, Store, ExtendContext>

  payload: (payload: PayloadUnbrand<Payload>) => Payload
}

export type AnyModalCreator = ModalCreator<any, PayloadBrand<any>, any, AnyRecord>

export type ModalCreatorWithBuilder<Context extends AnyModalCreator> =
  Context extends ModalCreator<infer Type, infer Payload>
  ? ModalCreator<Type, Payload> & Context & { builder: Builder<Context> }
  : never

export type AnyModalCreatorWithBuilder = ModalCreatorWithBuilder<AnyModalCreator>

export type AnotherModalCreator = ModalCreatorWithBuilder<
  ModalCreator<string, PayloadBrand<{}>, {}>
>

type FilterOnlyRecord<Target extends Record<string, unknown>> = {
  [
    Key in keyof Target as Target[Key] extends 
      | Record<string, unknown>
      | Array<unknown> 
      | readonly unknown[] 
        ? Key 
        : never
  ]: Target[Key]
}

type DeepExtendRecord<
  ExtendableContext extends {}, 
  ExtendPayload extends {}, 
  DeepIncludeKeys extends keyof FilterOnlyRecord<ExtendableContext> | void = void
> = {
  [Key in keyof ExtendableContext]: (
    ExtendableContext[Key] extends AnyArrowFn
      ? Parameters<ExtendableContext[Key]>[0] extends PayloadBrand<infer OldPayload>
        ? (payload: PayloadBrand<OldPayload & ExtendPayload>) => ReturnType<ExtendableContext[Key]>
        : GetParameters<ExtendableContext[Key]> extends AnyArrowFn
          ? GetParameters<GetParameters<ExtendableContext[Key]>> extends PayloadBrand<infer OldPayload>
            ? (callback: (payload: PayloadBrand<OldPayload & ExtendPayload>) => ReturnType<GetParameters<ExtendableContext[Key]>>) => 
                ReturnType<ExtendableContext[Key]>
            : ExtendableContext[Key]
          : ExtendableContext[Key]
      : Key extends DeepIncludeKeys
        ? ExtendableContext[Key] extends {}
          ? DeepExtendRecord<ExtendableContext[Key], ExtendPayload, void>
          : ExtendableContext[Key]
        : ExtendableContext[Key]
  )
}

export type ExtendModalCreator<ExtendableContext extends AnyModalCreator, ExtendPayload extends {} = {}> = (
  DeepExtendRecord<ExtendableContext, ExtendPayload> extends AnyModalCreator 
    ? DeepExtendRecord<ExtendableContext, ExtendPayload>
    : never
)

type Test3 = { 
  events: {
    callback: (param: PayloadBrand<unknown>) => void
  }
}

type Test1 = ExtendModalCreator<
  Test3 & ModalCreator<string, PayloadBrand<unknown>, {}>,
  { a: 1 }
>

type Test2 = Test1 extends AnyModalCreator ? 1 : 2

export type WithApplyPayload<Payload extends PayloadBrand<AnyRecord>> = {
  payload: (payload: ExcludeProperty<Payload, { __internal_name: "payload" }>) => Payload
}

export type NextFuntionWithMethods<ContextParam extends AnyModalCreatorWithBuilder, ExtendPayload extends {} = {}> = {
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

export type ComputeBaseModalCreator<
  Context extends AnyModalCreator, 
  ExtendContext,
  Payload, 
  ExtendPayload, 
  Store
> = ModalCreatorWithBuilder<
  RecordsMerge<
    RecordsMerge<Omit<Context, "builder">, ExtendContext>,
    ModalCreator<
      Context["type"],
      PayloadBrand<Payload & ExtendPayload>,
      Store
    > & WithApplyPayload<PayloadBrand<Payload & ExtendPayload>>
  >
>

export type Middleware<
  Context extends
  | AnyModalCreatorWithBuilder
  | ((...args: any[]) => AnyModalCreatorWithBuilder),
  ExtendContext = {},
  ExtendPayload = {},
> = [Context] extends [((arg: any) => AnyModalCreatorWithBuilder)]
  ? ReturnType<Context> extends ModalCreatorWithBuilder<infer InferedContext extends AnyModalCreatorWithBuilder>
    ? (params: GetParameters<GetMiddlewareUse<InferedContext>>) => InferedContext extends ModalCreator<any, infer Payload, infer Store>
      ? ComputeBaseModalCreator<InferedContext, ExtendContext, Payload, ExtendPayload, Store>
      : never
    : never
  : Context extends ModalCreatorWithBuilder<infer InferedContext>
    ? (params: GetParameters<GetMiddlewareUse<Context>>) => InferedContext extends ModalCreator<any, infer Payload, infer Store>
      ? ComputeBaseModalCreator<InferedContext, ExtendContext, Payload, ExtendPayload, Store>
      : never
    : never