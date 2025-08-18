import { Modal } from "../kernel/modal-factory/implementation"
import type { AnotherModalCreator, AnyModalCreator, ModalCreatorWithBuilder } from "../kernel/modal-factory/interface"


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

const director = {
  applyAllRules: <Context extends ModalCreatorWithBuilder<AnyModalCreator>>(modal: Context) => {
    return modal
      // .builder.use(testV4)
      .builder.use(testV5)
  }
}

const modTestV5 = testV5({} as any)
modTestV5.anotherCallback({ zxc: "" })
// ---------------------------------------------------------------------------


// Через director можно расширеть контекст модального окна добавив новые поля или метод
// расширять можно также и payload, то есть данные передаваемые при вызове .open 
const newTestModal = director.applyAllRules(new Modal("new-modal"))

newTestModal.anotherCallback({ zxc: "" })

// Не требуется приведение типов, в payload появились поля из первого и второго middleware
newTestModal.open((ctx) => ctx.payload({
  zxc: "s",
  data: {
    a: {
      b: "terminator"
    }
  }
}))
