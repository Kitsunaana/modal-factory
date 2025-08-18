export type Listener = () => void

export type UnknownBaseStore = Record<string, unknown>

export type Updater<Store extends UnknownBaseStore> = (store: Store) => Store

export type UseStoreSelector<Store extends UnknownBaseStore> = <T>(store: Store) => T

export type BaseStoreImpl<Store extends UnknownBaseStore> = {
  _listeners: Set<Listener>

  _subscibe: (listener: Listener) => () => void

  setState: (updater: Updater<Store>) => void
  useStore: (selector: UseStoreSelector<Store>) => ReturnType<UseStoreSelector<Store>>
}