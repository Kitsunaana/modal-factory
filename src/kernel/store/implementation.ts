import type { Simplify } from "../../shared/types"
import type { AnyModalStore } from "../modal-factory/interface"
import type { BaseStoreImpl, Listener, Updater, UseStoreSelector } from "./interface"

export class BaseStore<Observable extends AnyModalStore> implements BaseStoreImpl<Observable> {
  _listeners: Set<Listener> = new Set()

  constructor(public store: Observable) {}

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