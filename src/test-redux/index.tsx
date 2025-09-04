import { createTanstackStoreAdapter } from "../adapters"
import { createDirector } from "../kernel/modal-factory/implementation"

const director = createDirector({
  createStore: createTanstackStoreAdapter,
  variants: {
    base: []
  } as const
})

const loginModal = director
  .base("loginV2")
  .withParams<{ anyValue: "terminator" }>()

export function TestReduxAdapter() {
  const isOpen = loginModal.useIsOpen()
  const payload = loginModal.usePayload()

  return (
    <div>
      <p>{payload?.anyValue}</p>

      <button onClick={() => loginModal.open({ anyValue: "terminator" })}>Переключить</button>
      <p>{isOpen ? "Открыто" : "Закрыто"}</p>
    </div>
  )
}