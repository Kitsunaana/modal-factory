import { AnyModalStore, BaseStoreImpl, CreateAdapterFn, Listener, Unsubscibe, Updater } from "@modal-factory/core";
import { ReduxStoreFacade } from "./facade";
export declare class ReduxToModalStoreAdapter<Store extends AnyModalStore, Type extends string> implements BaseStoreImpl<Store> {
    private readonly _type;
    private readonly _innerStore;
    constructor(_type: Type, _innerStore: ReduxStoreFacade);
    get state(): Store;
    _subscibe(listener: Listener): Unsubscibe;
    setState(updater: Updater<Store>): void;
    useStore<T>(selector: (store: Store) => T): T;
}
export declare const createReduxStoreAdapter: CreateAdapterFn;
