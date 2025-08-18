// ------------------------------ EXAMPLE ------------------------------
/** 
 * Создание модального окна с возможностью изменение контекста с передачей 
 * функции прямо в builder.use с сохранением строгой типизации
 */

const kit = createModal("test")
  .withParams<{ terminator: "zxc" }>()

type T1 = Modal.payloadWithBrand<typeof kit>
const t1: T1 = { terminator: "zxc", __internal_name: "payload" }

type T2 = Modal.payload<typeof kit>
const t2: T2 = { terminator: "zxc" }

const modals = { kit }

modals.kit.open(modals.kit.payload({ terminator: "zxc" }))
modals.kit.open(c => c.payload({ terminator: "zxc" }))

const kitWithMiddleware = modals.kit
  .builder.use(({ context, next }) => {
    const handleTest = (payload: GetPayload<typeof context>) => {
      return payload.terminator
    }

    const handleTestWithoutExtendablePayload = (payload: Unbrand<GetPayload<typeof context>>) => {
      return payload.terminator
    }

    const result = next.extendPayload<{ newValue: string }>()({
      ctx: {
        zxc: 15,
        handleTest,
        handleTestWithoutExtendablePayload,
      },
    })

    return result
  })
  .builder.use(({ context, next }) => {
    context.handleTestWithoutExtendablePayload({ terminator: "zxc" })
    context.handleTest(context.payload({ newValue: "1", terminator: "zxc" }))
    context.open({ newValue: "1", terminator: "zxc" })

    context.payload({ newValue: "s", terminator: "zxc" })

    const modifiedNext = next.extendPayload<{ Dan: string }>()

    modifiedNext.getContext().payload({
      Dan: "",
      newValue: "",
      terminator: "zxc"
    })

    const handleHandleTest = (payload: GetPayload<typeof modifiedNext>) => {
      payload.Dan

      context.handleTestWithoutExtendablePayload({
        terminator: payload.terminator
      })
    }

    return modifiedNext({
      ctx: {
        handleHandleTest
      }
    })
  })


kitWithMiddleware.handleTestWithoutExtendablePayload({
  terminator: "zxc"
})

kitWithMiddleware.open({
  newValue: "s",
  terminator: "zxc",
  Dan: "s"
})
// ------------------------------ EXAMPLE ------------------------------