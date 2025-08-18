import type { AnyModalCreator, Builder, GetPayload, Middleware, ModalCreator, ModalCreatorWithBuilder, ModalStore, PayloadBrand, PayloadUnbrand, WithApplyPayload } from "./interface"
import { BaseStore } from "../store/implementation"

export class Modal<
  Type extends string = string, Payload extends PayloadBrand<unknown> = PayloadBrand<unknown>
> extends BaseStore<ModalStore<Payload>> implements ModalCreator<Type, PayloadBrand<Payload>> {
  public builder: Builder<ModalCreator<Type, PayloadBrand<Payload>> & WithApplyPayload<PayloadBrand<Payload>>> = {
    use: (middleware) => {
      return {} as any
    }
  }

  constructor(public readonly type: Type) {
    super({
      isOpen: false,
      payload: undefined
    })
  }

  public withParams<PayloadV2>() {
    return this as unknown as ModalCreatorWithBuilder<
      ModalCreator<
        Type,
        PayloadBrand<PayloadV2>
      > & WithApplyPayload<PayloadBrand<PayloadV2>>
    >
  }

  open(payload: PayloadBrand<Payload>) { }

  close() { }

  payload(payload: PayloadUnbrand<Payload>): Payload {
    return {
      ...payload,
      __internal_name: "payload",
    } as unknown as Payload
  }
}

export namespace Modal {
  export type payloadWithBrand<Context extends ModalCreatorWithBuilder<AnyModalCreator>> = GetPayload<Context>

  export type payload<Context extends ModalCreatorWithBuilder<AnyModalCreator>> = (
    PayloadUnbrand<GetPayload<Context>>
  )

  export type middleware
    <
      Context extends
      | ModalCreatorWithBuilder<AnyModalCreator>
      | ((...args: any[]) => ModalCreatorWithBuilder<AnyModalCreator>),
      ExtendContext = {},
      ExtendPayload = {},
    > = Middleware<Context, ExtendContext, ExtendPayload>
}
