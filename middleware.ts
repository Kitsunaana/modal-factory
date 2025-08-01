/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

import { BaseStore } from "../store"

export type ModalStore<Payload extends unknown> = {
    payload: Payload,
    isOpen: true
} | {
    payload?: Payload,
    isOpen: false
}

export type EventType<Type extends string = string, Value = unknown> = {
    type: Type
    payload: Value
}

export type ModalCreator<
    Type extends string = string, Payload extends unknown = unknown
> =
    BaseStore<ModalStore<Payload>> & {
        type: Type

        withParams: <PayloadV2>() => ModalCreator<Type, PayloadV2>

        open: (payload: Payload) => void
        close: () => void
    }

export type ModalCreatorWithBuilder<Context extends AnyModalCreator> =
    Context extends ModalCreator<infer Type, infer Payload>
    ? ModalCreator<Type, Payload> & Context & { builder: Builder<Context> }
    : never

type AnyModalCreator = ModalCreator<string, any>

// type DefaultReturnMiddleware = object
type DefaultReturnMiddleware = Record<string, any>
type RecordsMerge<Old, Add> = Omit<Old, keyof Add> & Add

type Builder<Context extends AnyModalCreator> = {
    use: <ConcatedContext extends DefaultReturnMiddleware>(
        middleware: (
            context: Context,
            next: <
                ExtendedContext extends DefaultReturnMiddleware
            >(data: {
                ctx: ExtendedContext,
                store?: any,
                payload?: any,
            }) => Context & ExtendedContext
        ) => ConcatedContext
    ) => ModalCreatorWithBuilder<Context & ConcatedContext>
}

class Modal<
    Type extends string = string, Payload extends unknown = unknown
> extends BaseStore<ModalStore<Payload>> implements ModalCreator<Type, Payload> {
    public builder: Builder<ModalCreator<Type, Payload>> = {
        use: (middleware) => {
            return {} as any
        }
    }

    constructor(public readonly type: Type) {
        super({
            isOpen: false,
            payload: undefined
        })
    }

    public withParams<PayloadV2>() {
        return this as unknown as ModalCreatorWithBuilder<ModalCreator<Type, PayloadV2>>
    }

    open(payload: Payload) { }

    close() { }
}

const createdModal = new Modal("test")
    .withParams<{ terminator: "zxc" }>()

type DefaultRecord<Payload extends unknown = unknown> = Record<string, Payload>

type NextFunction<Data extends DefaultRecord, Context extends AnyModalCreator> = (data: Data) => Context & Data

type Middleware<Context extends AnyModalCreator, NextData extends DefaultRecord> = (
    context: Context,
    next: NextFunction<NextData, Context>,
) => Context & NextData

type AnyMiddleware = Middleware<any, any>

type ComputedMiddlewaresResult<Tuple extends readonly AnyMiddleware[], ResultContext = KitModal> =
    Tuple extends [
        infer FirstMiddleware extends Middleware<any, any>,
        ...infer RestMiddlwares extends readonly AnyMiddleware[]
    ]
    ? ComputedMiddlewaresResult<RestMiddlwares, ResultContext & ReturnType<FirstMiddleware>>
    : ResultContext

type NonUndefined<T> = T extends undefined ? never : T

// ------------------------------ EXAMPLE ------------------------------
/**
 * Создание модального окна с возможностью изменение контекста с передачей 
 * функции прямо в builder.use с сохранением строгой типизации
 */
const kit = new Modal("test")
    .withParams<{ terminator: "zxc" }>()
    .builder.use((context, next) => {
        return next({
            ctx: {
                zxc: 1,
            }
        })
    })
    .builder.use((context, next) => {
        return next({
            ctx: {
                zxcAdded: context.zxc + 1
            }
        })
    })

console.log(kit.open({ terminator: "zxc" }))
console.log(kit.store.payload?.terminator)
// ------------------------------ EXAMPLE ------------------------------

// ------------------------------ EXAMPLE ------------------------------
/**
 * Возможность вынести middleware в отдельные функции с сохранением результата
 * предыдущего middleware
 */
type HumanAge = {
    age: number
}

const addAgeMiddleware: Middleware<typeof createdModal, HumanAge> = (context, next) => {
    return next({
        age: 10
    })
}

type HumanSurname = {
    surname: string
}

const addSurnameMiddleware: Middleware<ReturnType<typeof addAgeMiddleware>, HumanSurname> = (context, next) => {
    console.log(context.age)
    return next({
        surname: "Alex"
    })
}

createdModal
    .builder.use(addAgeMiddleware)
    .builder.use(addSurnameMiddleware)
// ------------------------------ EXAMPLE ------------------------------