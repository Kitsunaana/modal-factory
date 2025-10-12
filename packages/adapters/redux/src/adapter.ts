import {
  AnyModalStore,
  BaseStoreImpl,
  CreateAdapterFn,
  isFunction,
  Listener,
  Unsubscibe,
  Updater
} from "@modal-factory/core"
import { useSelector } from "react-redux"
import { reduxStoreFacade, ReduxStoreFacade } from "./facade"

export class ReduxToModalStoreAdapter<
  Store extends AnyModalStore,
  Type extends string
> implements BaseStoreImpl<Store> {
  constructor(private readonly _type: Type, private readonly _innerStore: ReduxStoreFacade) {
    this._innerStore.injectModal(_type)
  }

  public get state() {
    return this._innerStore.rootStore.getState()[this._type] as Store
  }

  public _subscibe(listener: Listener): Unsubscibe {
    return this._innerStore.rootStore.subscribe(listener)
  }

  public setState(updater: Updater<Store>) {
    const updatedState = isFunction(updater) 
      ? updater(this.state) 
      : updater
  
    const action = this._innerStore
      .getSlice(this._type).actions
      .update(updatedState)

    this._innerStore.rootStore.dispatch(action)
  }

  public useStore<T>(selector: (store: Store) => T): T {
    return useSelector((root: any) => selector(root[this._type] as Store));
  }
}

export const createReduxStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new ReduxToModalStoreAdapter<Store, Type>(type, reduxStoreFacade)
  
  return adapter
}