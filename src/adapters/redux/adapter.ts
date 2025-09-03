import { useSelector } from "react-redux"
import type { AnyModalStore } from "../../kernel/modal-factory/interface"
import type { BaseStoreImpl, CreateAdapterFn, Listener, Unsubscibe, Updater } from "../../kernel/store/interface"
import { reduxStoreFacade, type ReduxStoreFacade } from "./facade"
import { isFunction } from "mobx/dist/internal"
import { merge } from "../../shared/utils"

export class ReduxToModalStoreAdapter<
  Store extends AnyModalStore,
  Type extends string
> implements BaseStoreImpl<Store> {
  constructor(private readonly _type: Type, private readonly _redux: ReduxStoreFacade) {
    this._redux.injectModal(_type)
  }

  public get state() {
    return this._redux.rootStore.getState()[this._type] as Store
  }

  public _subscibe(listener: Listener): Unsubscibe {
    return this._redux.rootStore.subscribe(listener)
  }

  public setState(updater: Updater<Store>) {
    const currentState = this._redux.rootStore.getState()

    const updatedState = isFunction(updater) 
      ? updater(currentState) 
      : merge(currentState, updater)
  
    const action = this._redux
      .getSlice(this._type).actions
      .update(updatedState)

    this._redux.rootStore.dispatch(action)
  }

  public useStore<T>(selector: (store: Store) => T): T {
    return useSelector.withTypes<Store>()((store) => {
      return selector(store) as T
    })
  }
}

export const createReduxStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new ReduxToModalStoreAdapter<Store, Type>(type, reduxStoreFacade)
  return adapter
}