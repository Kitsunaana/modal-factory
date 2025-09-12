import type { AnyModalStore } from "../../kernel/modal-factory/interface";
import type { BaseStoreImpl, CreateAdapterFn, Listener, Updater } from "../../kernel/store/interface";

export class NoopModalStoreAdapter<
  Store extends AnyModalStore,
  Type extends string
> implements BaseStoreImpl<Store> {  
  public get state(): Store {
    return {} as Store
  }

  constructor (private readonly _type: Type) {}

  public _subscibe(listener: Listener) {
    return () => {}
  }

  public setState(updater: Updater<any>) {} 

  public useStore<T>(selector: (store: Store) => T) {
    return selector(this.state)
  }
}

export const createNoopStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new NoopModalStoreAdapter<Store, Type>(type)
  return adapter
}