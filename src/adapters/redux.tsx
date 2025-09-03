import { combineReducers, configureStore, createSlice, type Reducer, type Slice } from "@reduxjs/toolkit"
import { Provider, useSelector, type ProviderProps } from "react-redux"
import type { AnyModalStore, AnyObject } from "../kernel/modal-factory/interface"
import type { BaseStoreImpl, Listener, Unsubscibe, Updater } from "../kernel/store/interface"
import type { AnyArrowFn, RecordsMerge } from "../shared/types"

export class ReduxStoreFacade {
  private readonly _slices: Record<string, Slice> = {}
  private readonly _reducers: Record<string, Reducer> = {}

  private readonly _store = configureStore({
    reducer: (state) => state
  })

  public get ReduxModalProvider() {
    return (props: Omit<ProviderProps, "store">) => (
      <Provider store={this._store} {...props} />
    )
  }

  public get rootStore() {
    return this._store
  }

  public getSlice(name: string) {
    return this._slices[name]
  }

  public injectModal<Type extends string>(type: Type) {
    const createdModalSlice = createSlice({
      name: type,
      initialState: {
        isOpen: false,
        payload: undefined,
      },
      reducers: {
        update: (_state, { payload }) => payload
      }
    }) 

    Object.assign(this._slices, { [createdModalSlice.name]: createdModalSlice })
    Object.assign(this._reducers, { 
      [createdModalSlice.name]: createdModalSlice.reducer
    })

    const nextReducers = combineReducers(this._reducers)

    this._store.replaceReducer(nextReducers)
  }
}

const reduxStoreFacade = new ReduxStoreFacade()

const isFunction = (value: unknown): value is AnyArrowFn => typeof value === "function" 
const merge = <A extends AnyObject, B extends AnyObject>(a: A, b: B): RecordsMerge<A, B> => ({ ...a, ...b }) 

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

export type CreateAdapterFn = <Store extends AnyModalStore, Type extends string>(type: Type) => BaseStoreImpl<Store>

export const createReduxStoreAdapter: CreateAdapterFn = <
  Store extends AnyModalStore,
  Type extends string
>(type: Type) => {
  const adapter = new ReduxToModalStoreAdapter<Store, Type>(type, reduxStoreFacade)
  return adapter
}