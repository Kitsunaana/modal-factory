/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActionCreator } from "@shared/lib/redux/create-action"
import { EventCreator } from "./modal-state"

export type DefaultModalsTuple = readonly AnyEventCreator[]

export type ExtractCreatorByType<Modal extends DefaultModalsTuple, Type extends string> =
    Extract<Modal[number], { type: Type }>

export type ModalsTupleToMap<Modals extends DefaultModalsTuple> = {
    [Key in Modals[number]["type"]]: ExtractCreatorByType<Modals, Key>
}

export type Reducer<ModalsTuple extends DefaultModalsTuple, Action> = (
    state: ModalsTupleToMap<ModalsTuple>,
    action: Action
) => ModalsTupleToMap<ModalsTuple>

export type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type PayloadAction<Data = any, Type extends string = string> = {
    type: Type,
    payload: Data
}

export type AnyPayloadAction = PayloadAction<any, any>

export type PayloadActionFilter<Paylaod extends AnyPayloadAction | undefined> =
    Paylaod extends AnyPayloadAction
    ? Paylaod["payload"]
    : void

type DefaultSliceReducersMap = Record<
    string,
    (modals: ModalsTupleToMap<DefaultModalsTuple>, action: AnyPayloadAction) => any
>

type SliceReducerToPayloadAction<
    SliceReducer extends (state: any, action: AnyPayloadAction) => any
> = PayloadActionFilter<Parameters<SliceReducer>[1]>

type SliceReducersMapToActions<
    Name extends string,
    ReducersMap extends DefaultSliceReducersMap
> = Simplify<{
    [Key in keyof ReducersMap]: PayloadAction<
        SliceReducerToPayloadAction<ReducersMap[Key]>,
        `${Name}/${Key & string}`
    >
}[keyof ReducersMap]>

type SliceActionCreators<
    Name extends string,
    ReducersMap extends DefaultSliceReducersMap
> = Simplify<{
    [Key in keyof ReducersMap]: (
        ...args: SliceReducerToPayloadAction<ReducersMap[Key]> extends void
            ? []
            : [payload: SliceReducerToPayloadAction<ReducersMap[Key]>]
    ) => PayloadAction<
        SliceReducerToPayloadAction<ReducersMap[Key]>,
        `${Name}/${Key & string}`
    >
}>

type SliceSelectorsToSelectors<
    Name extends string,
    Modals extends DefaultModalsTuple,
    SelectorsMap extends Record<string, (state: ModalsTupleToMap<Modals>) => any>
> = Simplify<{
    [Key in keyof SelectorsMap]: (state: Simplify<Record<Name, ModalsTupleToMap<Modals>>>) => ReturnType<SelectorsMap[Key]>
}>

type CaseReducerBuilder<State, Actions = never> = {
    addCase: <Action extends ActionCreator<any, any>>(
        action: Action,
        reducer: (state: State, action: ReturnType<Action>) => State | void
    ) => CaseReducerBuilder<State, Actions | ReturnType<Action>>

    __actions: Actions
}

type AnyEventCreator = EventCreator<any, any>

type ReducerMapWithParam<ModalsTuple extends DefaultModalsTuple> = Record<
    string,
    (modals: ModalsTupleToMap<ModalsTuple>, action: AnyPayloadAction) => any
>

export function createModalModule<
    Name extends string,
    ModalsTuple extends DefaultModalsTuple,
    ReducersMap extends Record<
        string,
        (modals: ModalsTupleToMap<DefaultModalsTuple>, action: AnyPayloadAction) => any
    >,
    SelectorMap extends Record<string, (modals: ModalsTupleToMap<ModalsTuple>) => any> = Record<
        string,
        (modals: ModalsTupleToMap<ModalsTuple>) => any
    >,
    ExtraReducers = void
>({
    name,
    modals,
    reducers,
    selectors,
    extraReducers,
}: {
    name: Name
    modals: ModalsTuple,
    selectors?: SelectorMap
    reducers: ReducersMap & ReducerMapWithParam<ModalsTuple>
    extraReducers?: (builder: CaseReducerBuilder<ModalsTupleToMap<ModalsTuple>>) => ExtraReducers
}): {
    reducer: Reducer<
        ModalsTuple,
        | SliceReducersMapToActions<Name, ReducersMap>
        | ExtraReducers["__actions" & keyof ExtraReducers]
    >

    name: Name
    actions: SliceActionCreators<Name, ReducersMap>
    selectors: SliceSelectorsToSelectors<Name, ModalsTuple, SelectorMap>

    baseSelector: (modals: Record<Name, ModalsTupleToMap<ModalsTuple>>) => ModalsTupleToMap<ModalsTuple>

    dispatch: (action: AnyPayloadAction) => void
} {
    const modalsTupleToRecord = Object.fromEntries(
        modals.map((modal) => [modal.type, modal])
    )

    const dispatch = (action: AnyPayloadAction) => {
        const actionWithoutNS = action.type.split("/")[1]

        if (reducers[actionWithoutNS]) {
            reducers[actionWithoutNS](modalsTupleToRecord, action)
        }
    }

    return {
        name,
        dispatch,
        baseSelector: (state) => state[name],
        reducer: {} as any,
        selectors: {} as any,
        actions: Object.fromEntries(
            Object
                .entries(reducers)
                .map(([key]) => [
                    key,
                    (payload: any) => ({
                        type: `${name}/${key}`,
                        payload
                    })
                ])
        ) as any,
    }
}