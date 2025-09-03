import type { GetParameters } from "../../shared/types"
import type { BaseStoreImpl, CreateAdapterFn } from "../store/interface"
import type {
  AnotherModalCreator,
  AnyModalCreator,
  AnyNextFunctionWithMethods,
  AnyObject,
  Builder,
  DeepExtendModalCreator,
  ExtendModalCreator,
  GetPayload,
  Middleware,
  ModalCreator,
  ModalCreatorWithBuilder,
  ModalStore,
  PayloadBrand,
  PayloadUnbrand
} from "./interface"

export class Modal<
  Type extends string = string, 
  Payload extends AnyObject = AnyObject,
  Store extends AnyObject = AnyObject
> {
  public builder: Builder<ModalCreator<Type, Payload>> = {
    use: (middleware) => {
      return {} as any
    }
  }

  constructor(public readonly type: Type, public readonly store: BaseStoreImpl<ModalStore<Payload, Store>>) {
  }

  public withParams<PayloadV2 extends AnyObject>() {
    type UpdatedModal = ModalCreator<Type, PayloadV2, Store>

    return this as unknown as ModalCreatorWithBuilder<UpdatedModal>
  }

  public open(payload: Payload) { }

  public close() { }
}

export const createDirector = <T extends Record<string, readonly Modal.middleware<AnotherModalCreator, any, any>[]>>({
  variants,
  createStore,
}: {
  variants: T,
  createStore: CreateAdapterFn
}) => {
  return ({} as {
    [Key in keyof T]: <Type extends string>(type: Type) => (
      ModalCreatorWithBuilder<
        DeepExtendModalCreator<Type, T[Key]>
      >
    )
  })
}

export const combine = <M extends Modal.middleware<AnyModalCreator, any, any>>(middleware: M) => {
  return <Params extends GetParameters<Modal.middleware<AnyModalCreator>>>(params: Params) => {
    return middleware(params) as unknown as M extends Modal.middleware<any, infer Context, infer Payload>
      ? ModalCreatorWithBuilder<ExtendModalCreator<Params["context"] & Context, Payload>>
      : never
  }
}

type FnReturnAnyModalCreatorWithBuilder = (...args: any[]) => AnyModalCreator

type AvailableContextUnion = AnyModalCreator | AnyNextFunctionWithMethods | FnReturnAnyModalCreatorWithBuilder

export namespace Modal {
  export type payload<Context extends AvailableContextUnion> = (
    Context extends FnReturnAnyModalCreatorWithBuilder
      ? PayloadUnbrand<GetPayload<ReturnType<Context>>>
      : Context extends
        | AnyModalCreator
        | AnyNextFunctionWithMethods
          ? PayloadUnbrand<GetPayload<Context>>
          : never
    )

  export type payloadWithBrand<Context extends AvailableContextUnion> = PayloadBrand<payload<Context>>

  export type middleware
    <
      Context extends AnyModalCreator,
      ExtendContext extends AnyObject = AnyObject,
      ExtendPayload extends AnyObject = AnyObject,
    > = Middleware<Context, ExtendContext, ExtendPayload>
}
