import { createDirector, Modal } from "@modal-factory/core"
import { createTanstackStoreAdapter } from "@modal-factory/adapters-tanstack-store"

const addPrefixHandleToFns = ({ context, next }: Modal.params) => {
  const handleClose = context.close

  const handleOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
    return context.open(payload)
  }

  return next({
    ctx: {
      handleClose,
      handleOpen,
    }
  })
}

export const director = createDirector({
  createStore: createTanstackStoreAdapter,
  variants: {
    base: [],
  } as const
})

