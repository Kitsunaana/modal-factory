import type { ExtendAnyValue } from "../../shared/extend-any-value"
import type {
  AnyRecord,
  Brand,
  ExcludeProperty,
  GetParameters,
  RecordsMerge
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

type FindAllDifferentProperties<Context extends AnyModalCreator, ExtendedContext extends AnyModalCreator> = {
  [Key in keyof ExtendedContext as Key extends keyof Context ? never : Key]: ExtendedContext[Key]
}

export type ExtendModalCreator<ExtendableContext extends AnyModalCreator, ExtendPayload extends {} = {}> = (
  ExtendableContext extends ModalCreator<any, infer Payload>
    ? ModalCreator<ExtendableContext["type"], Payload & ExtendPayload> 
      & ExtendAnyValue<
          FindAllDifferentProperties<AnyModalCreator, ExtendableContext>, 
          ExtendPayload
        > 
      & WithApplyPayload<Payload & ExtendPayload> 
    : never
)

export type WithApplyPayload<Payload extends PayloadBrand<AnyRecord>> = {
  payload: (payload: ExcludeProperty<Payload, { __internal_name: "payload" }>) => Payload
}

export type InferContext<Context extends unknown> = 
  Context extends ModalCreatorWithBuilder<infer InferContext extends AnyModalCreator>
    ? InferContext
    : Context extends AnyModalCreator
      ? Context
      : never

export type InferPayload<Payload extends unknown> =
  Payload extends PayloadBrand<unknown>
    ? PayloadUnbrand<Payload>
    : Payload extends AnyRecord
      ? Payload
      : {}

export type AvailableContextsUnion = AnyModalCreator | AnyModalCreatorWithBuilder
export type AvailablePayloadsUnion = PayloadBrand<unknown> | PayloadBrand<AnyRecord> | AnyRecord
    
export type DeepMergeModalCreators<
  Sources extends readonly AvailableContextsUnion[],
  Result extends AnyModalCreator = AnyModalCreator
> = Sources extends [infer First, ...infer Rest extends AvailableContextsUnion[]]
  ? DeepMergeModalCreators<Rest, RecordsMerge<Result, InferContext<First>>>
  : Result

export type DeepMergePayloads<
  Sources extends readonly AvailablePayloadsUnion[],
  Result extends PayloadBrand<unknown> = PayloadBrand<unknown>
> = Sources extends [infer First, ...infer Rest extends AvailablePayloadsUnion[]]
  ? DeepMergePayloads<Rest, PayloadBrand<RecordsMerge<PayloadUnbrand<Result>, InferPayload<First>>>>
  : Result

export type BuildModalCreatorWithoutBuilder<
  SourceContexts extends readonly AvailableContextsUnion[],
  SourcePayloads extends readonly AvailablePayloadsUnion[],
> = DeepMergeModalCreators<SourceContexts> extends ModalCreator<any, infer Payload extends PayloadBrand<unknown>>
  ? ExtendModalCreator<
      DeepMergeModalCreators<
        [
          ...SourceContexts,
          ModalCreator<
            DeepMergeModalCreators<SourceContexts>["type"],
            DeepMergePayloads<[...SourcePayloads, Payload]>
          > & WithApplyPayload<DeepMergePayloads<[...SourcePayloads, Payload]>>
        ]
      >,
      DeepMergePayloads<[...SourcePayloads, Payload]>
    >
  : never

export type BuildModalCreator<
  SourceContexts extends readonly AvailableContextsUnion[],
  SourcePayloads extends readonly AvailablePayloadsUnion[],
> = ModalCreatorWithBuilder<
  BuildModalCreatorWithoutBuilder<SourceContexts, SourcePayloads>
>

export type NextFuntionWithMethods<ContextParam extends AnyModalCreatorWithBuilder, ExtendPayload extends {} = {}> = {
  <
    Context extends AnyRecord = {},
    Payload extends PayloadBrand<AnyRecord> = PayloadBrand<{}>,
    Store extends AnyRecord = {},
  >(data: {
    ctx: Context,
  }): ContextParam extends ModalCreatorWithBuilder<infer InferedContext>
        ? InferedContext extends ModalCreator<infer Type, infer OldPayload, infer OldStore>
          ? ModalCreatorWithBuilder<
              ExtendModalCreator<
                RecordsMerge<
                  RecordsMerge<InferedContext, Context>,
                  ModalCreator<
                    Type,
                    RecordsMerge<OldPayload, Payload & ExtendPayload>,
                    RecordsMerge<OldStore, Store>
                  > & WithApplyPayload<RecordsMerge<OldPayload, Payload & ExtendPayload>>
                >
              >
            > & BaseStore<ModalStore<RecordsMerge<OldPayload, Payload & ExtendPayload>, RecordsMerge<OldStore, Store>>>
          : never
        : never

  extendPayload: <Payload2 extends AnyRecord>() => ContextParam extends ModalCreatorWithBuilder<infer InferedContext>
    ? InferedContext extends ModalCreator<any, infer Payload extends PayloadBrand<unknown>>
      ? NextFuntionWithMethods<
          BuildModalCreator<
            [InferedContext],
            [Payload, Payload2]
          >,
          Payload2
        >
      : never
    : never

  getContext: () => ContextParam
}

export type GetPayload<Context extends
  | ModalCreatorWithBuilder<AnyModalCreator>
  | NextFuntionWithMethods<ModalCreatorWithBuilder<AnyModalCreator>, any>
> = Context extends ModalCreatorWithBuilder<infer InferedContext>
      ? InferedContext extends ModalCreator<any, infer Payload>
        ? Payload
        : never
      : Context extends NextFuntionWithMethods<ModalCreatorWithBuilder<AnyModalCreator>, any>
        ? GetPayload<ReturnType<Context["getContext"]>>
        : never

export type Builder<ContextParam extends AnyModalCreator> = {
  use: <ConcatedContext extends ModalCreatorWithBuilder<AnyModalCreator>>(
    middleware: (params: {
      context: ModalCreatorWithBuilder<ContextParam>,
      next: NextFuntionWithMethods<ModalCreatorWithBuilder<ContextParam>>
    }) => ConcatedContext
  ) => ConcatedContext
}

export type GetMiddlewareUse<ContextWithBuilder extends AnyModalCreatorWithBuilder> =
  GetParameters<ContextWithBuilder["builder"]["use"]>

export type ComputeBaseModalCreator<
  Context extends AnyModalCreator, 
  ExtendContext extends AnyRecord,
  Payload extends AnyRecord, 
  ExtendPayload extends AnyRecord, 
  Store extends AnyRecord
> = RecordsMerge<
      RecordsMerge<Omit<Context, "builder">, ExtendContext>,
      ModalCreator<
        Context["type"],
        PayloadBrand<Payload & ExtendPayload>,
        Store
      > & WithApplyPayload<PayloadBrand<Payload & ExtendPayload>>
    >

type GetResultMiddleware<Context, ExtendContext extends AnyRecord, ExtendPayload extends AnyRecord> =
  Context extends ModalCreatorWithBuilder<infer InferedContext>
    ? (params: GetParameters<GetMiddlewareUse<Context>>) => (
      InferedContext extends ModalCreator<any, infer Payload, infer Store extends AnyRecord>
        ? ModalCreatorWithBuilder<
            ComputeBaseModalCreator<
              InferedContext, 
              ExtendContext, 
              Payload, 
              ExtendPayload, 
              Store
            >
          >
        : never
    )
    : never


export type AnyFnReturnMiddleware = (...args: any[]) => AnyModalCreatorWithBuilder

export type Middleware<
  Context extends
    | AnyModalCreatorWithBuilder
    | AnyFnReturnMiddleware,
  ExtendContext extends {} = {},
  ExtendPayload extends {} = {},
> = Context extends AnyFnReturnMiddleware
  ? GetResultMiddleware<ReturnType<Context>, ExtendContext, ExtendPayload>
  : GetResultMiddleware<Context, ExtendContext, ExtendPayload>
