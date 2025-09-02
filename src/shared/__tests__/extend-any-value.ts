import type { ExtendAnyValue } from "../extend-any-value"
import type { TestObject } from "./mock"

type R1 = ExtendAnyValue<TestObject, { newValue: "terminator" }>

const r1 = ({} as R1)

// @ts-expect-error
r1.callback({}) // done

// @ts-expect-error
r1.callbackV2({}) // done

// @ts-expect-error
r1.callbackV3(1, {}) // done

// @ts-expect-error
r1.callbackV4(1, {}) // done

r1.events.callbackV3(({ zxc }) => true) // done
r1.events.callbackV4(({  }) => true) // done
r1.events.callbackV5(({ payload: {  } }) => true) // done
r1.events.callbackV6(({
  anyArg,
  payload,
  callback,
}) => {
  anyArg.newValue
  anyArg.zcc

  payload.newValue
  payload.zxc

  callback({
    __internal_name: "test",
    newValue: "terminator",
    zxc: 1
  })

  return false
}) // done

r1.array[0].newValue.newArray[0](({ payload: {  } }) => true) // done
r1.array[0].newValue.newArray[1](({ zxc }) => true) // done
