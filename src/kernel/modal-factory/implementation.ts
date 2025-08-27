import type { AnyRecord } from "../../shared/types"
import { BaseStore } from "../store/implementation"
import type { AnyModalCreatorWithBuilder, Builder, GetPayload, Middleware, ModalCreator, ModalCreatorWithBuilder, ModalStore, NextFuntionWithMethods, PayloadBrand, PayloadUnbrand, WithApplyPayload } from "./interface"

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

  public open(payload: PayloadBrand<Payload>) { }

  public close() { }

  public payload(payload: PayloadUnbrand<Payload>): Payload {
    return {
      ...payload,
      __internal_name: "payload",
    } as unknown as Payload
  }
}

type FnReturnAnyModalCreatorWithBuilder = (...args: any[]) => AnyModalCreatorWithBuilder

export namespace Modal {
  export type payload<Context extends
    | AnyModalCreatorWithBuilder
    | FnReturnAnyModalCreatorWithBuilder
    | NextFuntionWithMethods<AnyModalCreatorWithBuilder, any>
  > = (
      Context extends FnReturnAnyModalCreatorWithBuilder
        ? PayloadUnbrand<GetPayload<ReturnType<Context>>>
          : Context extends
            | AnyModalCreatorWithBuilder
            | NextFuntionWithMethods<AnyModalCreatorWithBuilder, any>
          ? PayloadUnbrand<GetPayload<Context>>
        : never
    )

  export type payloadWithBrand<Context extends
    | AnyModalCreatorWithBuilder
    | FnReturnAnyModalCreatorWithBuilder
    | NextFuntionWithMethods<AnyModalCreatorWithBuilder, any>
  > = PayloadBrand<payload<Context>>

  export type middleware
    <
      Context extends
      | AnyModalCreatorWithBuilder
      | FnReturnAnyModalCreatorWithBuilder,
      ExtendContext extends {} = {},
      ExtendPayload extends {} = {},
    > = Middleware<Context, ExtendContext, ExtendPayload>
}
