import { createEvent, EventEmitter, type Listener } from "../kernel/event-bus/types"
import { Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator, AnyModalCreator, AnyModalCreatorWithBuilder, BuildModalCreator, Middleware, ModalCreator, PayloadBrand } from "../kernel/modal-factory/interface"
import type { AnyRecord, GetParameters } from "../shared/types"


// --------------------------------- EXAMPLE ---------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */

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

  modifiedNext.getContext().payload({ zxc: "" })

  const result = modifiedNext({
    ctx: {
      abc: "s"
    }
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
  anotherCallback: (data: Modal.payload<ReturnType<typeof testV4>>) => void 
}

const testV5: Modal.middleware<AnotherModalCreator, ExtendContextV2, ExtendPayloadV2> = ({ next }) => {
  const modifiedNext = next.extendPayload<ExtendPayloadV2>()

  return modifiedNext({
    ctx: {
      anotherCallback(data) {
        modifiedNext
          .getContext()
          .payload({ 
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

  const result = next.extendPayload()({
    ctx: updatedContext
  })

  return result
}




const middlewares = [testV4, testV5] as const

type AnyMiddleware = Middleware<AnyModalCreatorWithBuilder, any, any>

type GetPayloadFromMiddleware<Fn extends AnyMiddleware> = 
  Fn extends Middleware<any, any, infer Payload>
    ? Payload
    : {}

type GetAddedContextFromMiddleware<Fn extends AnyMiddleware> = 
  Fn extends Middleware<any, infer AddedContext, any>
    ? AddedContext
    : {}

type GetAllAddedContext<Middlewares extends readonly AnyMiddleware[], Result extends AnyRecord[] = []> = 
  Middlewares extends readonly [infer First extends AnyMiddleware, ...infer Rest extends readonly AnyMiddleware[]]
    ? GetAllAddedContext<
        Rest,
        [...Result, GetAddedContextFromMiddleware<First>]
      >
    : Result

type GetAllPayload<Middlewares extends readonly AnyMiddleware[], Result extends AnyRecord[] = []> = 
  Middlewares extends readonly [infer First extends AnyMiddleware, ...infer Rest extends readonly AnyMiddleware[]]
    ? GetAllPayload<
        Rest,
        [...Result, GetPayloadFromMiddleware<First>]
      >
    : Result

type R1 = GetAllAddedContext<typeof middlewares>
type R3 = GetAllPayload<typeof middlewares>

type R4 = BuildModalCreator<
  [ModalCreator<"test">],
  R3
>

const r4 = ({} as R4).payload({})

type R2 = typeof testV5 extends AnyMiddleware 
  ? [GetAddedContextFromMiddleware<typeof testV5>, GetPayloadFromMiddleware<typeof testV5>]
  : 2