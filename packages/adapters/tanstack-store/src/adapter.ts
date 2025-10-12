import {
  AnyModalStore,
  BaseStoreImpl,
  CreateAdapterFn,
  isFunction,
  Listener,
  merge,
  Unsubscibe,
  Updater
} from "@modal-factory/core"
import { Store, useStore } from "@tanstack/react-store"

class TanstackToModalStoreAdapter<
  Observable extends AnyModalStore,
  Type extends string
> implements BaseStoreImpl<Observable> {
  public readonly _innerStore = new Store<Observable>({
    isOpen: false,
    payload: undefined,
  } as Observable)

  constructor(private readonly _type: Type) {}

  public get state(): Observable {
    return this._innerStore.state as Observable
  }

  public _subscibe(listener: Listener): Unsubscibe {
    return this._innerStore.subscribe(listener)
  }

  public setState(updater: Updater<Observable>) {
    this._innerStore.setState((prev) => {
      const updatedState = isFunction(updater) 
        ? updater(prev as Observable) 
        : merge(prev, updater)

      return updatedState as typeof prev
    })
  }

  useStore = <T>(selector: (store: Observable) => T): T => {
    return useStore(this._innerStore, selector)
  }
}

export const createTanstackStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new TanstackToModalStoreAdapter<Store, Type>(type)
  return adapter
}