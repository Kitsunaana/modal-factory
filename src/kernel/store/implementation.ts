import type { AnyModalStore } from "../modal-factory/interface"
import type { BaseStoreImpl, Listener, Updater, UseStoreSelector } from "./interface"

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

  useStore(selector: UseStoreSelector<Observable>) {
    return {} as ReturnType<UseStoreSelector<Observable>>
  }
}