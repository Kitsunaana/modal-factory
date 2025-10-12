import type { AnyModalStore, BaseStoreImpl, CreateAdapterFn, Listener, Updater } from "./types";
export declare class BaseStore<Observable extends AnyModalStore> implements BaseStoreImpl<Observable> {
    store: Observable;
    constructor(store: Observable);
    get state(): any;
    _subscibe(listener: Listener): () => void;
    setState(updater: Updater<Observable>): void;
    useStore<T>(selector: (store: Observable) => T): T;
}
export declare const createNoopStoreAdapter: CreateAdapterFn;
