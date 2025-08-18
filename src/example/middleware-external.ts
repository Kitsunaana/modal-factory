import { createEvent, EventEmitter, type EventCreator, type EventType, type Listener } from "../kernel/event-bus/types"
import { Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator, AnyModalCreator, ModalCreator, ModalCreatorWithBuilder, PayloadBrand, WithApplyPayload } from "../kernel/modal-factory/interface"
import type { AnyRecord, RecordsMerge } from "../shared/types"


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

const testV5: Modal.middleware<typeof testV4, ExtendContextV2, ExtendPayloadV2> = ({ next }) => {
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

const director = {
  applyAllRules: <Context extends ModalCreatorWithBuilder<AnyModalCreator>>(modal: Context) => {
    const result = modal
      .builder.use(testV4)
      .builder.use(testV5)
      .builder.use(({ context, next }) => {
        const eventName = `modal.open.${context.type}` as const

        const openModalEvent = createEvent(eventName)
          .withParams<Modal.payload<typeof context>>()

        const handleOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
          sharedEventBus.emit(openModalEvent(payload))
          context.open(payload)
        }

        const subscribeHandleOpen = <Event extends Listener<typeof eventName, Modal.payload<typeof context>>>(callback: Event) => {
          sharedEventBus.on(openModalEvent, callback)
        }

        return next({ 
          ctx: {
            openModalEvent,

            handleOpen,
            subscribeHandleOpen,
          }
        })
      })

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
const newTestModal = director.applyAllRules(new Modal("new-modal")).extendParam<{ newValue: string }>()

newTestModal.subscribeHandleOpen(({ payload }) => {
  payload.data.a.b === "terminator"
})

newTestModal.handleOpen({  })
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
