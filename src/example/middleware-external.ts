import { createEvent, EventEmitter, type EventCreator, type EventType, type Listener } from "../kernel/event-bus/types"
import { Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator, AnyModalCreator, AnyModalCreatorWithBuilder, ExtendModalCreator, Middleware, ModalCreator, ModalCreatorWithBuilder, PayloadBrand, PayloadUnbrand, WithApplyPayload } from "../kernel/modal-factory/interface"
import type { AnyRecord, GetParameters, RecordsMerge } from "../shared/types"


// ------------------------------ EXAMPLE ------------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */

// ---------------------------------------------------------------------------
type ExtendContext = { abc: string }
type ExtendPayload = { zxc: string }

const testV4: Modal.middleware<AnotherModalCreator, ExtendContext, ExtendPayload> = ({ context, next }) => {
  context.open({ terminator: "zxc" })

  return next.extendPayload<ExtendPayload>()({
    ctx: {
      abc: "s"
    }
  })
}

type ExtendContextV2 = { anotherCallback: (data: Modal.payload<typeof testV4>) => void }
type ExtendPayloadV2 = { data: { a: { b: "terminator" } } }

const testV5: Modal.middleware<AnotherModalCreator, ExtendContextV2, ExtendPayloadV2> = ({ next }) => {
  return next.extendPayload<ExtendPayloadV2>()({
    ctx: {
      anotherCallback(data) {
        return data.zxc
      },
    } satisfies ExtendContextV2
  })
}

const modTestV4 = testV4({} as any)

modTestV4.abc // Появилось новое поле "abc"
modTestV4.payload({ zxc: "1" }) // Базовый пустой Payload расширен и требует новое свойство

const sharedEventBus = new EventEmitter()

const addEventMiddleware = ({ context, next }: GetParameters<Modal.middleware<AnotherModalCreator>>) => {
  const openEventName = `modal.open.${context.type}` as const
  const closeEventName = `modal.close.${context.type}` as const

  const openModalEvent = createEvent(openEventName)
    .withParams<Modal.payload<typeof context>>()

  const closeModalEvent = createEvent(closeEventName)

  const handleOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
    sharedEventBus.emit(openModalEvent(payload))
    context.open(payload)
  }

  const handleClose = () => {
    sharedEventBus.emit(closeModalEvent({}))
    context.close()
  }

  const subscribeHandleOpen = <
    Event extends Listener<typeof openEventName, Modal.payload<typeof context>>
  >(callback: Event) => {
    sharedEventBus.on(openModalEvent, callback)
  }

  const subscribeHandleClose = <Event extends Listener<typeof closeEventName>>(callback: Event) => {
    sharedEventBus.on(closeModalEvent, callback)
  }

  const updatedContext = {
    zxc: 1,
    event: {
      openModalEvent,
      closeModalEvent,

      handleOpen,
      handleClose,

      subscribeHandleOpen,
      subscribeHandleClose,
    },
  }

  const result = next.extendPayload()({
    ctx: updatedContext
  })

  return result
}

testV5({} as any).payload({})
addEventMiddleware({} as any)

type Ctx = { a: number }
type CtxWrapper<C extends Ctx, Extend extends AnyRecord> = C & Extend

type TestCtx = CtxWrapper<{ a: 1 }, { callback: () => void }>

type R5 = TestCtx extends Ctx ? 1 : 2

type AnyMiddleware = Middleware<AnyModalCreatorWithBuilder, any, any>

type AnyMiddlewareV2 = AnyMiddleware

type GetModalCreatorFromBuilder<Context extends AnyModalCreatorWithBuilder> = (
  Context extends ModalCreatorWithBuilder<infer InferedContext>
    ? InferedContext
    : never
)

type MergeMiddlewares<
  MiddlewaresV2 extends readonly unknown[], 
  Type extends string = string, 
  ExtendContext extends AnyRecord = {}, 
  ExtendPayload = {}
> = (
  MiddlewaresV2 extends readonly [infer FirstMiddeware, ...infer Rest]
    ? FirstMiddeware extends Middleware<any, any, any>
      ? ReturnType<FirstMiddeware> extends ModalCreatorWithBuilder<infer InferedContext>
        ? InferedContext extends ModalCreator<any, infer InferedPayload, any>
          ? MergeMiddlewares<
              Rest,
              InferedContext["type"],
              ExtendContext & Omit<
                ReturnType<FirstMiddeware>, 
                keyof ModalCreatorWithBuilder<
                  ModalCreator<string, PayloadBrand<unknown>, {}>
                >
              >,
              ExtendPayload & InferedPayload
          >
          : 4
        : 3
      : 2
    : ModalCreatorWithBuilder<
        ExtendContext & ModalCreator<
          Type,
          PayloadBrand<ExtendPayload>,
          {}
        > & WithApplyPayload<PayloadBrand<ExtendPayload>>
      >
)

type AnyMiddlewareFn = (...args: any[]) => AnyModalCreatorWithBuilder

type IsAssignable<A, B> = A extends B ? 1 : 2

const middlewares = [testV5, addEventMiddleware] as const

type Z1 = MergeMiddlewares<typeof middlewares>
const z1 = ({} as Z1).event.subscribeHandleClose(({ payload }) => {
  payload
})

type F1 = IsAssignable<typeof testV4, AnyMiddlewareFn> // 1
type F2 = IsAssignable<ExtendContextV2, any> // 1
type F3 = IsAssignable<ExtendPayloadV2, any> // 1

type F4 = Middleware<typeof testV4, {}, {}>
type F5 = Middleware<AnyMiddlewareFn, {}, {}>

type F6 = IsAssignable<GetParameters<F5>, GetParameters<F4> & any> // 1
type F7 = IsAssignable<ReturnType<F4>, ReturnType<F5>> // 1

type F8 = IsAssignable<F4, F5> // 2

type F9 = ReturnType<typeof testV4>
type F10 = ReturnType<AnyMiddlewareFn>

type F11 = IsAssignable<F9, F10> // 1

type C1 = ReturnType<typeof testV4>

type R2 = Middleware<typeof testV4, ExtendContext, ExtendPayload> extends Middleware<infer R, ExtendContext, ExtendPayload>
  ? R
  : 2

type WhyNotAssignable = F4 extends F5 ? true : {
  params: Parameters<F4> extends Parameters<F5> ? true : false,
  returns: ReturnType<F4> extends ReturnType<F5> ? true : false,
  context: ThisParameterType<F4> extends ThisParameterType<F5> ? true : false
}

type MParam = { a: number }
type M2Param = MParam & { b: number }

type M3 = IsAssignable<M2Param, MParam> // 1

type Fn1 = (arg: MParam) => boolean
type Fn2 = (arg: M2Param) => boolean

type F12 = IsAssignable<Fn2, Fn1> // 1

type BaseParam = { a: number }
type ExtendedParam = BaseParam & { b: number; test: { callback: (arg: number) => boolean } }

type A1<Param extends BaseParam, Return> = (param: Param) => Return

type A = A1<BaseParam, boolean> // base
type B = A1<ExtendedParam, boolean> // extended

type A2 = B extends A1<infer Param, infer Return>
  ? Param
  : 2


const director = {
  applyAllRules: <Context extends ModalCreatorWithBuilder<AnyModalCreator>>(modal: Context) => {
    const middlewares = [testV4, testV5, addEventMiddleware] as const

    type Result = MergeMiddlewares<typeof middlewares>

    const result = modal
      .builder.use(testV4)
      .builder.use(testV5)
      .builder.use(({ context, next }) => {
        return addEventMiddleware({ context, next })
      }) as Result

    return result as unknown as typeof result & {
      extendParam: <PayloadV2 extends AnyRecord>() => typeof result extends ModalCreatorWithBuilder<infer InferedContext>
        ? InferedContext extends ModalCreator<any, infer Payload extends PayloadBrand<unknown>>
        ? ModalCreatorWithBuilder<
          RecordsMerge<
            Omit<InferedContext, "builder">,
            ModalCreator<InferedContext["type"], Payload & PayloadV2> & WithApplyPayload<Payload & PayloadV2>
          >
        >
        : never
        : never
    }
  }
}

const modTestV5 = testV5({} as any)
modTestV5.anotherCallback({ zxc: "" })
// ---------------------------------------------------------------------------


// Через director можно расширеть контекст модального окна добавив новые поля или метод
// расширять можно также и payload, то есть данные передаваемые при вызове .open 
const newTestModal = director
  .applyAllRules(new Modal("new-modal"))

newTestModal.event.subscribeHandleOpen(({ payload }) => payload)
newTestModal.event.subscribeHandleClose(() => { })

newTestModal.event.handleOpen({})
newTestModal.event.handleClose()
newTestModal.open({  })
newTestModal.anotherCallback({ zxc: "" })

// Не требуется приведение типов, в payload появились поля из первого и второго middleware
newTestModal.open((ctx) => ctx.payload({
  zxc: "",
  newValue: "1",
  data: {
    a: {
      b: "terminator"
    }
  }
}))

newTestModal.close()