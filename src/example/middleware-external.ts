import { Modal } from "../kernel/modal-factory/implementation"
import type { AnyModalCreator, ModalCreator, ModalCreatorWithBuilder, PayloadBrand } from "../kernel/modal-factory/interface"

// ------------------------------ EXAMPLE ------------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */

const createdModal = new Modal("test")
  .withParams<{ terminator: "zxc" }>()

type AnotherModalCreator = ModalCreatorWithBuilder<
  ModalCreator<string, PayloadBrand<{}>, {}>
>

const testV4: Modal.middleware<AnotherModalCreator, { abc: string }, { zxc: string }> = ({ context, next }) => {
  context.open({ terminator: "zxc" })
  return next.extendPayload<{ zxc: string }>()({ ctx: { abc: "s" } })
}

const testV5: Modal.middleware<typeof testV4, { abcV2: string }, { zxcV2: string }> = ({ next }) => {
  return next.extendPayload<{ zxcV2: string }>()({ ctx: { abcV2: "s" } })
}

createdModal.open(ctx => ctx.payload({ terminator: "zxc" }))

const modTestV4 = testV4({} as any)
modTestV4.abc

const createModal = <Type extends string>(type: Type) => new Modal(type)

const director = {
  applyAllRules: <Context extends ModalCreatorWithBuilder<AnyModalCreator>>(modal: Context) => {
    return modal
      .builder.use(testV4)
      .builder.use(testV5)
  }
}

const newTestModal = director.applyAllRules(createModal("new-modal"))

newTestModal.open((ctx) => ctx.payload({

}))
