import { createTanstackStoreAdapter } from "../adapters"
import { addContextStoreMiddleware, addLocalStateMiddleware } from "../addons/hooks"
import { createDirector } from "../kernel/modal-factory/implementation"

const director = createDirector({
  createStore: createTanstackStoreAdapter,
  variants: {
    base: [],
    hooks: [addLocalStateMiddleware, addContextStoreMiddleware]
  } as const
})

const loginModal = director
  .base("loginV2")
  .withParams<{ anyValue: "terminator" }>()

const newModal = director.hooks("newModal").withParams<{ value: number }>()
const newModalV2 = director.hooks("newModalV2").withParams<{ value: number }>()

export function TestNewModal() {
  const { isOpen, payload, onClose, onOpen } = newModalV2.useModalStore()
  
  return (
    <div>
      {String(isOpen)}
      {payload?.value}

      <button onClick={() => onOpen({ __internal_name: "payload", value: 678 })}>Открыть новую модалку</button>

      <button onClick={onClose}>Закрыть новую модалку</button>
    </div>
  )
}


export function TestReduxAdapter() {
  const isOpen = loginModal.useIsOpen()
  const payload = loginModal.usePayload()

  console.log(newModal)
  const newModalState = newModal.useLocalModalState()

  return (
    <div>
      <newModalV2.ModalStoreProvider>
        <TestNewModal />
      </newModalV2.ModalStoreProvider>

      <p>{payload?.anyValue}</p>

      <button onClick={() => loginModal.open({ anyValue: "terminator" })}>Переключить</button>
      <p>{isOpen ? "Открыто" : "Закрыто"}</p>

      <div>
        <h1>Новая модалка</h1>
        <h4>Значение: {newModalState.payload?.value}</h4>
        <h5>Состояние: {String(newModalState.isOpen)}</h5>

        <button
          onClick={() => newModalState.onOpen({ __internal_name: "payload", value: 123 })}
        >
          Открыть
        </button>

        <button
          onClick={newModalState.onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}