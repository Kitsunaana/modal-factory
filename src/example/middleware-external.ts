// --------------------------------- EXAMPLE ---------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */

import { createReduxStoreAdapter } from "../adapters"
import { createEvent, EventEmitter, type Listener } from "../kernel/event-bus/types"
import { combine, createDirector, Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator } from "../kernel/modal-factory/interface"
import type { GetParameters } from "../shared/types"

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

const testV6: Modal.middleware<ReturnType<typeof testV5>> = ({ context, next }) => {
  const result = next({ ctx: {} })

  return result
}

const director = createDirector({
  createStore: createReduxStoreAdapter,
  variants: {
    base: [],
    events: [addEventMiddleware],
    allRules: [testV4, testV5, addEventMiddleware],
    two: [addEventMiddleware, testV6]
  } as const
})

director.two("ads")

const loginV1 = director.events("login-v1")
  .builder.use(combine(testV4))
  .builder.use(combine(testV5))
  
loginV1.event.subscribeHandleOpen(({ payload }) => payload)

const loginV2 = director.allRules("login-v2")
loginV2.event.subscribeHandleOpen(({ payload }) => payload)

const reg = new Modal("reg", {} as any).withParams<{ abc: string }>()
const regv2 = new Modal("regv2", {} as any).withParams<{ abc: string }>()