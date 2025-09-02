// import { createEvent, EventEmitter, type Listener } from "../kernel/event-bus/types"
// import { Modal } from "../kernel/modal-factory/implementation"
// import type { AnotherModalCreator, AnyModalCreator, AnyModalCreatorWithBuilder, BuildModalCreator, BuildModalCreatorWithoutBuilder, DeepMergePayloads, FindAllDifferentProperties, Middleware, ModalCreator, PayloadBrand, PayloadUnbrand } from "../kernel/modal-factory/interface"
// import type { ExtendAnyValue } from "../shared/extend-any-value"
// import type { AnyRecord, GetParameters, RecordsMerge } from "../shared/types"


// // --------------------------------- EXAMPLE ---------------------------------
// /**
//  * Возможность вынести middleware в отдельные функции с сохранением результата
//  * предыдущего middleware
//  */

// // ---------------------------------------------------------------------------
// /**
//  * 
//  * 
//  *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
//  * 
//  * 
//  */
// // ---------------------------------------------------------------------------
// type ExtendContext = { abc: string }
// type ExtendPayload = { zxc: string }

// /**
//  * Абстрактный, не зависит от других мидлваров, заранее указываем контекст и 
//  * payload которыми расширяем базовый общий контекст 
//  */
// const testV4: Modal.middleware<AnotherModalCreator, ExtendContext, ExtendPayload> = ({ context, next }) => {
//   const modifiedNext = next.extendPayload<ExtendPayload>()

//   modifiedNext.getContext().payload({ zxc: "" })

//   const result = modifiedNext({
//     ctx: {
//       abc: "s"
//     }
//   })

//   return result
// }

// testV4({} as any)      
// // ---------------------------------------------------------------------------
// /**
//  * 
//  * 
//  *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
//  * 
//  * 
//  */
// // ---------------------------------------------------------------------------
// type ExtendPayloadV2 = { data: { a: { b: "terminator" } } }

// type ExtendContextV2 = { 
//   anotherCallback: (data: Modal.payloadWithBrand<ReturnType<typeof testV4>>) => void 
// }

// const testV5: Modal.middleware<AnotherModalCreator, ExtendContextV2, ExtendPayloadV2> = ({ next }) => {
//   const modifiedNext = next.extendPayload<ExtendPayloadV2>()

//   return modifiedNext({
//     ctx: {
//       anotherCallback(data) {
//         data.zxc

//         modifiedNext
//           .getContext()
//           .payload({ 
//             data: { 
//               a: { 
//                 b: "terminator"
//               }
//             }
//           })

//         return data.zxc
//       },
//     } satisfies ExtendContextV2
//   })
// }
// // ---------------------------------------------------------------------------
// /**
//  * 
//  * 
//  *         ( *^-^)ρ(*╯^╰)         .·´¯`(>▂<)´¯`·.          /(ㄒoㄒ)/~~
//  * 
//  * 
//  */
// // ---------------------------------------------------------------------------
// const sharedEventBus = new EventEmitter()

// const addEventMiddleware = ({ context, next }: GetParameters<Modal.middleware<AnotherModalCreator, { a: 1 }>>) => {
//   const openEventName = `modal.open.${context.type}` as const
//   const closeEventName = `modal.close.${context.type}` as const

//   const openModalEvent = createEvent(openEventName)
//     .withParams<Modal.payloadWithBrand<typeof context>>()

//   const closeModalEvent = createEvent(closeEventName)

//   const handleOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
//     sharedEventBus.emit(openModalEvent(payload))
//     context.open(payload)
//   }

//   const handleClose = () => {
//     sharedEventBus.emit(closeModalEvent({}))
//     context.close()
//   }

//   const subscribeHandleOpen = <
//     Event extends Listener<typeof openEventName, Modal.payloadWithBrand<typeof context>>
//   >(callback: Event) => {
//     sharedEventBus.on(openModalEvent, callback)
//   }

//   const subscribeHandleClose = <Event extends Listener<typeof closeEventName>>(callback: Event) => {
//     sharedEventBus.on(closeModalEvent, callback)
//   }

//   const updatedContext = {
//     zxc: 1,
//     event: {
//       openModalEvent,
//       closeModalEvent,

//       handleOpen,
//       handleClose,

//       subscribeHandleOpen,
//       subscribeHandleClose,
//     },
//   }

//   const result = next({
//     ctx: updatedContext
//   })

//   return result
// }

// addEventMiddleware({} as any).event.subscribeHandleOpen(({ payload }) => {
//   payload
// })


// const middlewares = [testV4, testV5, addEventMiddleware] as const

// type AnyMiddleware = Middleware<AnyModalCreatorWithBuilder, any, any>

// type GetPayloadFromMiddleware<Fn extends AnyMiddleware> = 
//   Fn extends Middleware<any, any, infer Payload>
//     ? Payload
//     : never

// type GetAddedContextFromMiddleware<Fn extends AnyMiddleware> = 
//   Fn extends Middleware<any, infer AddedContext, any>
//     ? {} extends AddedContext
//       ? FindAllDifferentProperties<AnotherModalCreator, ReturnType<Fn>>
//       : AddedContext
//     : never

// type GetAllAddedContext<Middlewares extends readonly AnyMiddleware[], Result extends AnyRecord[] = []> = 
//   Middlewares extends readonly [infer First extends AnyMiddleware, ...infer Rest extends readonly AnyMiddleware[]]
//     ? GetAllAddedContext<
//         Rest,
//         [...Result, GetAddedContextFromMiddleware<First>]
//       >
//     : Result

// type GetAllPayload<Middlewares extends readonly AnyMiddleware[], Result extends AnyRecord[] = []> = 
//   Middlewares extends readonly [infer First extends AnyMiddleware, ...infer Rest extends readonly AnyMiddleware[]]
//     ? GetAllPayload<
//         Rest,
//         [...Result, GetPayloadFromMiddleware<First>]
//       >
//     : Result

// type DeepMergeRecords<T extends readonly {}[], R extends {} = {}> = 
//   T extends readonly [infer First extends {}, ...infer Rest extends readonly {}[]]
//     ? DeepMergeRecords<Rest, RecordsMerge<R, First>>
//     : R

// type R1 = GetAllAddedContext<typeof middlewares>
// type R3 = GetAllPayload<typeof middlewares>

// type FilterEmptyRecords<T extends readonly {}[], R extends readonly {}[] = []> = 
//   T extends readonly [infer First extends {}, ...infer Rest extends readonly {}[]]
//     ? {} extends PayloadUnbrand<First>
//       ? FilterEmptyRecords<Rest, R>
//       : FilterEmptyRecords<Rest, [...R, First]>
//     : R

// export type Simplify<T> = { [K in keyof T]: T[K] } & {}

// type E1 = FilterEmptyRecords<R3>["2"]

// type G1 = ModalCreator<"test-v1", PayloadBrand<{ age: number }>> & DeepMergeRecords<R1>
// type G2 = ModalCreator<"test-v2", PayloadBrand<{ age: number }>>

// // type G7 = FindAllDifferentProperties<AnotherModalCreator, ReturnType<typeof addEventMiddleware>>
// type G7 = GetAddedContextFromMiddleware<typeof addEventMiddleware>

// type R4 = BuildModalCreatorWithoutBuilder<
//   [G1],
//   R3
// >

// type E2 = Simplify<DeepMergePayloads<R3>>

// type J1 = R3[2]

// type R6 = DeepMergePayloads<R3>

// const r4 = ({} as R4)

// type FilterUnion<T extends {}> = T extends PayloadBrand<unknown> ? T : never

// r4.event.subscribeHandleOpen(({ payload }) => {
//   type G1 = Simplify<typeof payload>
//   type G2 = FilterUnion<Simplify<typeof payload>>

//   type G3 = ExtendAnyValue<
//     DeepMergePayloads<GetAllPayload<typeof middlewares>>,
//     {}
//   >

//   const p2 = ({} as G1)
//   // payload
// })

// r4.anotherCallback({
//   __internal_name: "payload",
//   zxc: "1",
//   data: {
//     a: {
//       b: "terminator"
//     }
//   }
// })

// // r4.

// type R2 = typeof testV5 extends AnyMiddleware 
//   ? [GetAddedContextFromMiddleware<typeof testV5>, GetPayloadFromMiddleware<typeof testV5>]
//   : 2