import { useSyncExternalStore } from "react"

type Listener = () => void

export class BaseStore<Store extends Record<string, unknown>> {
    constructor(public readonly store: Store) {
        this._subscribe = this._subscribe.bind(this)

        this.useStore = this.useStore.bind(this)
        this.setState = this.setState.bind(this)
    }

    private listeners = new Set<Listener>()

    private _subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => this.listeners.delete(listener)
    }

    public setState(updater: (store: Store) => Store) {
        Object.assign(this.store, updater(this.store))

        this.listeners.forEach((listener) => listener())
    }

    public useStore<T>(selector: (store: Store) => T) {
        return useSyncExternalStore(
            this._subscribe,
            () => selector(this.store),
            () => selector(this.store),
        )
    }
}

type CounterState = {
    count: number
}

export const counterStore = new BaseStore<CounterState>({
    count: 10
})

export const increment = () => (
    counterStore.setState(prev => ({
        count: ++prev.count
    }))
)
