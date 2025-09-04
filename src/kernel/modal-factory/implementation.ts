import type { AnyArrowFn, GetParameters } from "../../shared/types"
import { merge } from "../../shared/utils"
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
  NextFuntionWithMethods,
  PayloadBrand,
  PayloadUnbrand
} from "./interface"

const isNotEmpty = (value: unknown): value is object => (
  value !== undefined && 
  value !== null && 
  typeof value === "object"
)

export class Modal<
  Type extends string = string, 
  Payload extends AnyObject = AnyObject,
  Store extends AnyObject = AnyObject
> {
  private _modifiedContext: ModalCreator<Type, Payload, Store> & any = this

  public builder: Builder<ModalCreator<Type, Payload>> = {
    use: (middleware) => {
      type CurrentModalCreator = ModalCreator<Type, Payload, Store>

      const next = (data: GetParameters<NextFuntionWithMethods<CurrentModalCreator>>) => {
        const context = isNotEmpty(data.ctx) ? data.ctx : {}
        const store = isNotEmpty(data.store) ? data.store : {}

        this.store.setState(merge(this.store.state, store))

        return merge(context, this._modifiedContext)
      }
      
      next.extendPayload = () => this._modifiedContext

      next.getContext = () => this._modifiedContext
      
      const result = middleware({ 
        context: this._modifiedContext,
        next: next as unknown as NextFuntionWithMethods<CurrentModalCreator>
      })

      this._modifiedContext = Object.assign(this, result)

      return this._modifiedContext
    }
  }

  constructor(
    public readonly type: Type, 
    public readonly store: BaseStoreImpl<ModalStore<Payload, Store>>
  ) {}

  public withParams<PayloadV2 extends AnyObject>() {
    type UpdatedModal = ModalCreator<Type, PayloadV2, Store>

    return this as unknown as ModalCreatorWithBuilder<UpdatedModal>
  }

  public useIsOpen() {
    return this.store.useStore(store => store.isOpen)
  }

  public usePayload() {
    return this.store.useStore(store => store.payload)
  }

  public open(payload: Payload) {
    this.store.setState({
      isOpen: true,
      payload,
    })
  }

  public close() {
    this.store.setState({
      isOpen: false,
      payload: undefined
    })
  }
}

export const createDirector = <
  T extends Record<
    string,
    readonly (
      | Modal.middleware<AnyModalCreator, any, any>
      | Modal.middleware<AnotherModalCreator, any, any>
    )[]
  >
>({
  variants,
  createStore,
}: {
  variants: T,
  createStore: CreateAdapterFn
}) => {
  const computedDirector = Object
    .entries(variants)
    .reduce((prev, [key, middlewares]) => {
      prev[key] = <Type extends string>(type: Type) => {
        const createdModal =  new Modal(type, createStore(type))

        return middlewares.reduce(
          (context, middleware) => {
            const appliedAllRules = context.builder.use(middleware) as typeof createdModal

            Object.assign(appliedAllRules, {
              withParams: () => appliedAllRules
            })

            return appliedAllRules
          }, 
          createdModal
        )
      }

      return prev
    }, {} as Record<string, AnyArrowFn>)

  return (computedDirector as {
    [Key in keyof T]: <Type extends string>(type: Type) => (
      ModalCreatorWithBuilder<
        DeepExtendModalCreator<Type, T[Key]> & {
          withParams: <PayloadV2 extends AnyObject>() => ModalCreatorWithBuilder<
            ExtendModalCreator<
              DeepExtendModalCreator<Type, T[Key]>,
              PayloadV2
            >
          >
        }
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

  export type params = GetParameters<Middleware<AnotherModalCreator>>
}
