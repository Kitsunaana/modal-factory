export type EventType<Type extends string = string, Payload = unknown> = {
  payload: Payload
  type: Type
}

export type EventCreator<Type extends string, Payalod = any> = {
  (payload: Payalod): EventType<Type, Payalod>

  type: Type,
  
  check: (eventType: EventType) => eventType is EventType<Type, Payalod>
  withParams: <PayloadV2>() => EventCreator<Type, PayloadV2>
}

export type Listener<Type extends string = string, Payload = unknown> = 
  (arg: EventType<Type, Payload>) => void

export const createEvent = <Type extends string, Payload>(type: Type): EventCreator<Type, Payload> => {
  const creator = (payload: Payload) => ({
    payload,
    type,
  })

  creator.type = type

  creator.withParams = <PayloadV2>() => creator as unknown as EventCreator<Type, PayloadV2>

  creator.check = (eventType: EventType): eventType is EventType<Type, Payload> => (
    eventType.type === type
  )

  return creator
}

export class EventEmitter {
  private readonly listeners = new Map<string, Set<Listener>>

  public on<Type extends string, Payload>(
    eventCreator: EventCreator<Type, Payload>,
    callback: Listener<Type, Payload>
  ) {

  }

  public emit<Type extends string, Payload>(event: EventType<Type, Payload>) {

  }
}