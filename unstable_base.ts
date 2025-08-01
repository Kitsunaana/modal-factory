import { BaseStore } from "."

export type EventType<Type extends string = string, Value = unknown> = {
    type: Type
    payload: Value
}

type WithAnimationParams = {
    duration: number
}

type UiOptions = WithAnimationParams & {
    isOpening: boolean
    isClosing: boolean
}

export type ModalStore<Value = unknown> = UiOptions & {
    isOpen: boolean,
    payload: Value
}

export type EventCreator<Type extends string = string, Value = unknown, WithAnimation = false> = Pick<
    BaseStore<ModalStore<Value>>,
    "setState" | "useStore" | "store"
> & {
    (value: Value): EventType<Type, Value>

    type: Type
    uiOptions: WithAnimation extends true ? UiOptions : Partial<UiOptions>

    withParams: <Value2>() => EventCreator<Type, Value2, WithAnimation>
    withAnimation: (params: WithAnimationParams) => EventCreator<Type, Value, true>

    setPayload: (payload: Value) => void
    open: (payload: Value) => void

    closeAsync: () => Promise<void>
    close: () => void
}

export type AnyEventCreator = EventCreator<string, any>

type Builder<Context extends AnyEventCreator> = {
    context: Context

    use: (callback: (context: Context, next: () => void) => void) => void
}

type CreateModal<Type extends string = string, Value = unknown, WithAnimation = false> = {
    (key: Type): EventCreator<Type, Value, WithAnimation>

    builder: Builder<EventCreator<Type, Value, WithAnimation> & AnyEventCreator>
}

export const createModal = <
    Type extends string = string,
    Value = void,
    WithAnimation = true
>(key: Type) => {
    const creator = (value: Value) => ({
        payload: value,
        type: key,
    }) as unknown as EventCreator<Type, Value, WithAnimation>

    creator.type = key

    creator.withParams = <Value2,>() => creator as unknown as EventCreator<Type, Value2, WithAnimation>

    const modalStore = new BaseStore<ModalStore<Value>>({
        payload: undefined as Value,
        isOpen: false,
        duration: 0,

        isClosing: false,
        isOpening: false,
    })

    creator.store = modalStore.store

    creator.setState = modalStore.setState
    creator.useStore = modalStore.useStore

    creator.uiOptions = {
        duration: 0
    }

    const getDuration = () => creator.uiOptions.duration

    creator.withAnimation = (params: WithAnimationParams) => {
        creator.uiOptions = {
            ...creator.uiOptions,
            ...params
        }

        return creator as unknown as EventCreator<Type, Value, true>
    }

    creator.open = (payload: Value) => {
        creator.setState(() => ({
            duration: getDuration(),
            isOpen: true,
            payload,

            isClosing: false,
            isOpening: true
        }))

        requestAnimationFrame(() => {
            creator.setState((prev) => ({
                ...prev,
                isOpening: false
            }))
        })
    }

    creator.closeAsync = () => {
        creator.setState(prev => ({
            ...prev,
            isClosing: true
        }))

        return new Promise((resolve) => {
            setTimeout(() => {
                creator.setState((prev) => ({
                    ...prev,
                    isOpen: false,
                    isClosing: false
                }))

                resolve(undefined)
            }, creator.uiOptions.duration)
        })
    }

    creator.close = () => {
        creator.setState((prev) => ({
            ...prev,
            payload: undefined as Value,
            isOpen: false,

            isClosing: true,
            isOpening: false
        }))
    }

    creator.setPayload = (payload: Value) => {
        creator.setState((prev) => ({
            ...prev,
            payload
        }))
    }

    return creator as unknown as EventCreator<Type, Value, WithAnimation>
}

// test.useStore(store => store)

