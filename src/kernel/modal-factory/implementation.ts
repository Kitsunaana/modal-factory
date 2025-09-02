import type {
  AnyModalCreator,
  AnyNextFunctionWithMethods,
  AnyObject,
  Builder,
  GetPayload,
  Middleware,
  ModalCreator,
  ModalCreatorWithBuilder,
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

  constructor(public readonly type: Type) {
  }

  public withParams<PayloadV2 extends AnyObject>() {
    type UpdatedModal = ModalCreator<Type, PayloadV2, Store>

    return this as unknown as ModalCreatorWithBuilder<UpdatedModal>
  }

  public open(payload: Payload) { }

  public close() { }
}

type FnReturnAnyModalCreatorWithBuilder = (...args: any[]) => AnyModalCreator

type AvailableContextUnion = AnyModalCreator | AnyNextFunctionWithMethods | FnReturnAnyModalCreatorWithBuilder

export namespace Modal {
  export type payload<Context extends AvailableContextUnion
  > = (
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
