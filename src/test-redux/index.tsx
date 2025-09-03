import { createReduxStoreAdapter, createTanstackStoreAdapter } from "../adapters"
import type { ModalStore } from "../kernel/modal-factory/interface"

const createStore = createTanstackStoreAdapter // createReduxStoreAdapter 

const loginStore = createStore<
  ModalStore<
    { addCount: number }, 
    { counter: { count: number } }
  >, 
  "login"
>("login")

loginStore.setState({
  counter: {
    count: 10
  }
})

export function TestReduxAdapter() {
  const isOpen = loginStore.useStore(store => store.isOpen)
  const count = loginStore.useStore(store => store.counter.count)

  const handleAddToCount = () => {
    loginStore.setState({
      counter: {
        count: count + Math.random()
      }
    })
  }

  return (
    <div>
      <button onClick={handleAddToCount}>Добавить</button>
      <p>{count}</p>

      <button onClick={() => loginStore.setState({ isOpen: !isOpen })}>Переключить</button>
      <p>{isOpen ? "Открыто" : "Закрыто"}</p>
    </div>
  )
}