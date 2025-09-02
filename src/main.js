import { Store } from "@tanstack/react-store"
import { createSlice, configureStore, combineReducers } from "@reduxjs/toolkit"

class Builder {
  constructor(creator) {
    this._creator = creator
  }

  use(callback) {
    const next = (data) => {
      return {
        ...this._creator,
        ...data.ctx
      }
    }

    next.getContext = () => this._creator

    next.extendPayload = () => next

    const result = callback({
      context: this._creator,
      next
    })

    this._creator = result

    return result
  }
}

const isFunction = (value) => typeof value === "function"
const merge = (a, b) => ({ ...a, ...b })

class ReduxToSingleStoreFacade {
  slices = {}
  computedReducers = {}

  store = configureStore({
    reducer: (state = {}) => state
  })

  injectModal(name) {
    const createdSlice = createSlice({
      name,
      initialState: {
        isOpen: false,
        payload: undefined
      },
      reducers: {
        update: (_, { payload }) => payload
      }
    })

    this.slices[name] = createdSlice

    Object.assign(this.computedReducers, {
      [createdSlice.name]: createdSlice.reducer
    })

    const nextReducers = combineReducers(this.computedReducers)
    this.store.replaceReducer(nextReducers)
  }

  getState(name) {
    const currentState = this.store.getState()[name]
    return currentState
  }

  setState(name, updater) {
    const action = this.slices[name].actions.update(updater)
    this.store.dispatch(action)
  }
}

const reduxStoreFacade = new ReduxToSingleStoreFacade()

class ModalStoreAdapter {
  _listeners = []

  constructor(params) {
    Object.assign(this, params)
    reduxStoreFacade.injectModal(this.name)
  }

  get state() {
    return reduxStoreFacade.getState(this.name)
  }

  subscribe() {}

  setState(updater) {
    const updatedResult = isFunction(updater)
      ? updater(this.state)
      : merge(this.state, updater)

    reduxStoreFacade.setState(updatedResult)
  }

  useStore() {}
}

class Modal extends ModalStoreAdapter {
  builder = new Builder(this)

  constructor(name) {
    super({ name })

    this.name = name
  }

  open(payload) {
    this.setState(prev => ({
      ...prev,
      payload,
      isOpen: true
    }))
  }

  close() {
    this.setState({
      isOpen: false
    })
  }
}

const testModal = new Modal("test")

const modalWithAppliedRules = testModal
  .builder.use(({ context, next }) => {
    return next({
      ctx: {
        newValue: "zxc",
        anotherCallback: () => {
          context.setState({ payload: { value: "value from anotherCallback" } })
        }
      }
    })
  })
  .builder.use(({ context, next }) => {
    return next({  })
  })

console.log(testModal.state)
console.log(modalWithAppliedRules.state)
