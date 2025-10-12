import type { AnyModalStore, BaseStoreImpl, CreateAdapterFn, Listener, Updater } from "./types"

export class BaseStore<Observable extends AnyModalStore> implements BaseStoreImpl<Observable> {
  constructor(public store: Observable) {}

  get state() {
    return {} as any
  }

  _subscibe(listener: Listener) {
    return () => { }
  }

  setState(updater: Updater<Observable>) {
    return
  }

  useStore<T>(selector: (store: Observable) => T): T {
    return {} as ReturnType<typeof selector>
  }
}

export const createNoopStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new BaseStore<Store>({} as Store)
  Object.assign(adapter, { type } as { type: Type })
  
  return adapter
}