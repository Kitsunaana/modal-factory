import type { Simplify } from "../shared/types"

export type ModalStoreWhenIsOpened<Payload> = Simplify<{
  payload: Payload,
  isOpen: true
}>

export type ModalStoreWhenIsNotOpened<Payload> = Simplify<{
  payload?: Payload,
  isOpen: false
}>

export type ModalStore<Payload, Store> = 
  Simplify<Store & (
    | ModalStoreWhenIsOpened<Payload>
    | ModalStoreWhenIsNotOpened<Payload>
  )>

export type AnyModalStore = ModalStore<unknown, unknown>

export type Listener = () => void

export type Unsubscibe = () => void

export type Updater<Store extends AnyModalStore> = ((store: Store) => Store) | Partial<Store>

export type UseStoreSelector<Store extends AnyModalStore> = <T>(store: Store) => T

export type BaseStoreImpl<Store extends AnyModalStore> = {
  get state(): Store

  _subscibe: (listener: Listener) => () => void

  setState: (updater: Updater<any>) => void
  useStore: <T>(selector: (store: Store) => T) => T
}

export type CreateAdapterFn = <Store extends AnyModalStore, Type extends string>(type: Type) => BaseStoreImpl<Store>