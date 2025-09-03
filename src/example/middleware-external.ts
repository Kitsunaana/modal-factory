// --------------------------------- EXAMPLE ---------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */

import { createEvent, EventEmitter, type Listener } from "../kernel/event-bus/types"
import { Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator, AnyModalCreator, AnyObject, ExtendModalCreator, GetUniqueContextProperties, ModalCreator, ModalCreatorWithBuilder } from "../kernel/modal-factory/interface"
import type { AnyArrowFn, GetParameters, RecordsMerge, Simplify } from "../shared/types"

// ---------------------------------------------------------------------------
/**
 * 
 * 
 *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
 * 
 * 
 */
// ---------------------------------------------------------------------------
type ExtendContext = { abc: string }
type ExtendPayload = { zxc: string }

/**
 * Абстрактный, не зависит от других мидлваров, заранее указываем контекст и 
 * payload которыми расширяем базовый общий контекст 
 */
const testV4: Modal.middleware<AnotherModalCreator, ExtendContext, ExtendPayload> = ({ context, next }) => {
  const modifiedNext = next.extendPayload<ExtendPayload>()

  const result = modifiedNext({
    ctx: {
      abc: "s"
    } as const
  })

  result.abc === "s"
  modifiedNext.getContext().open({
    zxc: ""
  })

  return result
}

testV4({} as any)
// ---------------------------------------------------------------------------
/**
 * 
 * 
 *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
 * 
 * 
 */
// ---------------------------------------------------------------------------
type ExtendPayloadV2 = { data: { a: { b: "terminator" } } }

type ExtendContextV2 = { 
  anotherCallback: (data: Modal.payloadWithBrand<ReturnType<typeof testV4>>) => void 
}

const testV5: Modal.middleware<AnotherModalCreator, ExtendContextV2, ExtendPayloadV2> = ({ next }) => {
  const modifiedNext = next.extendPayload<ExtendPayloadV2>()

  return modifiedNext({
    ctx: {
      anotherCallback(data) {
        data.zxc

        modifiedNext
          .getContext()
          .open({ 
            data: { 
              a: { 
                b: "terminator"
              }
            }
          })

        return data.zxc
      },
    } satisfies ExtendContextV2
  })
}

type V1 = ExtendPayloadV2 extends AnyObject ? 1 : 2
type V2 = ExtendContextV2 extends AnyObject ? 1 : 2


// ---------------------------------------------------------------------------
/**
 * 
 * 
 *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
 * 
 * 
 */
// ---------------------------------------------------------------------------
const sharedEventBus = new EventEmitter()

const addEventMiddleware = ({ context, next }: GetParameters<Modal.middleware<AnotherModalCreator>>) => {
  const openEventName = `modal.open.${context.type}` as const
  const closeEventName = `modal.close.${context.type}` as const

  const openModalEvent = createEvent(openEventName)
    .withParams<Modal.payloadWithBrand<typeof context>>()

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
    Event extends Listener<typeof openEventName, Modal.payloadWithBrand<typeof context>>
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

  const result = next({ 
    ctx: updatedContext
  })

  return result
}
type G0 = typeof addEventMiddleware
type G2 = typeof testV5

type IsModalCreator<Value extends unknown> = Value extends AnyModalCreator ? true : false

type ExcludeBuilder<Context extends AnyModalCreator | ModalCreatorWithBuilder<AnyModalCreator>> = Simplify<Omit<Context, "builder">>

type X1 = ExcludeBuilder<ReturnType<G0>>

type AbstractFnToMiddleware<Fn extends AnyArrowFn> = IsModalCreator<ReturnType<Fn>> extends true
  ? ExcludeBuilder<ReturnType<Fn>> extends ModalCreator<any, infer Payload>
    ? Modal.middleware<AnotherModalCreator, GetUniqueContextProperties<ExcludeBuilder<ReturnType<Fn>>>, Payload>
    : never
  : never

type CalculatePayloadFromMiddleware<Middleware extends AnyArrowFn> = (
  Middleware extends Modal.middleware<any, infer Payload, any>
    ? Payload
    : CalculatePayloadFromMiddleware<AbstractFnToMiddleware<Middleware>>
) 

type G1 = CalculatePayloadFromMiddleware<G0>
type G3 = CalculatePayloadFromMiddleware<G2>

addEventMiddleware({} as any).event.subscribeHandleOpen(({ payload }) => {
  payload
})

const to = (params: GetParameters<Modal.middleware<AnyModalCreator>>) => {
  return <M extends Modal.middleware<AnyModalCreator, AnyObject, any>>(middleware: M) => {
    return middleware(params) as unknown as M extends Modal.middleware<any, infer Context, infer Payload>
      ? Context
      : 2
  }
}

const loginModal = new Modal("login")
  .builder.use(({ context, next }) => {
    const result = testV4({ context, next })
    return result    
  })
  .builder.use(({ context, next }) => {
    const t = to({ context, next })(testV5)
    
 
    return t
  })

loginModal
loginModal.open({
  
})

type AnyMiddleware = Modal.middleware<AnyModalCreator, any, any>

type DeepExtendModalCreator<
  Type extends string, 
  Middlewares extends readonly unknown[], 
  ResultContext extends AnyObject = AnyObject,
  ResultPayload extends AnyObject = AnyObject,
> = (
  Middlewares extends readonly [infer First extends AnyArrowFn, ...infer Rest]
    ? AbstractFnToMiddleware<First> extends Modal.middleware<any, infer Context, infer Payload>
      ? DeepExtendModalCreator<Type, Rest, RecordsMerge<ResultContext, Context>, RecordsMerge<ResultPayload, Payload>>
      : DeepExtendModalCreator<Type, Rest, ResultContext, ResultPayload>
    : ExtendModalCreator<
        ModalCreator<Type> & ResultContext,
        ResultPayload
      >
)

const m = [testV4, testV5, addEventMiddleware] as const

type T1 = Simplify<DeepExtendModalCreator<"login", typeof m>>

const t1 = ({} as T1)

t1.event.subscribeHandleOpen(({ payload }) => {

})

const createDirector = <T extends Record<string, readonly Modal.middleware<AnotherModalCreator, any, any>[]>>({ variants }: {
  variants: T
}) => {
  return ({} as {
    [Key in keyof T]: <Type extends string>(type: Type) => (
      ModalCreatorWithBuilder<
        DeepExtendModalCreator<Type, T[Key]>
      >
    )
  })
}

const combine = <M extends Modal.middleware<AnotherModalCreator, any, any>>(middleware: M) => {
  return <Params extends GetParameters<Modal.middleware<AnyModalCreator>>>(params: Params) => {
    return middleware(params) as unknown as M extends Modal.middleware<any, infer Context, infer Payload>
      ? ModalCreatorWithBuilder<ExtendModalCreator<Params["context"] & Context, Payload>>
      : never
  }
}

const director = createDirector({
  variants: {
    base: [],
    events: [addEventMiddleware],
    allRules: [testV4, testV5, addEventMiddleware],
  } as const
})

const loginV1 = director.events("login-v1")
  .builder.use(combine(testV4))
  .builder.use(combine(testV5))

loginV1.event.subscribeHandleOpen(({ payload }) => payload)

const loginV2 = director.allRules("login-v2")
loginV2.event.subscribeHandleOpen(({ payload }) => payload)


