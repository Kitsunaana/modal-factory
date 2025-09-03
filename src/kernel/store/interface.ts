import type { AnyModalStore } from "../modal-factory/interface"

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