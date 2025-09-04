import type { Reducer, Slice } from "@reduxjs/toolkit"
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit"
import type { ProviderProps } from "react-redux"
import { Provider } from "react-redux"

export class ReduxStoreFacade {
  private readonly _slices: Record<string, Slice> = {}
  private readonly _reducers: Record<string, Reducer> = {}

  private readonly _store = configureStore({
    reducer: (state = {}) => state
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
        update: (_state, { payload }) => {
          Object.assign(_state, payload)
        }
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

export const reduxStoreFacade = new ReduxStoreFacade()