import type { Slice } from "@reduxjs/toolkit";
import type { ProviderProps } from "react-redux";
export declare class ReduxStoreFacade {
    private readonly _slices;
    private readonly _reducers;
    private readonly _store;
    get ReduxModalProvider(): (props: Omit<ProviderProps, "store">) => import("react/jsx-runtime").JSX.Element;
    get rootStore(): import("@reduxjs/toolkit").EnhancedStore<any, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
        dispatch: import("redux-thunk").ThunkDispatch<any, undefined, import("redux").UnknownAction>;
    }>, import("redux").StoreEnhancer]>>;
    getSlice(name: string): Slice<any, import("@reduxjs/toolkit").SliceCaseReducers<any>, string, string, import("@reduxjs/toolkit").SliceSelectors<any>>;
    injectModal<Type extends string>(type: Type): void;
}
export declare const reduxStoreFacade: ReduxStoreFacade;
