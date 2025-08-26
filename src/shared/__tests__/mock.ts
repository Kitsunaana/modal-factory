import type { Brand } from "../types"

export type TestBrand<T extends unknown> = Brand<T, "test">
export type TestData = { zxc: number }

export type TestObject = {
  callback: (param: TestBrand<TestData >) => void
  callbackV2: (param: TestData) => void

  callbackV3: (arg: number, param: TestBrand<TestData >) => void
  callbackV4: (arg: number, param: TestData) => void

  events: {
    callbackV3: (callback: (param: TestData) => boolean) => void
    callbackV4: (callback: (param: TestBrand<TestData>) => boolean) => void

    callbackV5: (callback: (param: { payload: TestBrand<TestData> }) => boolean) => void
    callbackV6: (callback: (param: {
      anyArg: TestBrand<{ zcc: 1 }>
      payload: TestBrand<TestData>

      callback: (param: TestBrand<TestData>) => void
    }) => boolean) => void

    callbackV9: (callback: (param: { payload: TestData }) => boolean) => void
  }

  array: [
    {
      newValue: {
        newArray: [
          callbackV5: (callback: (param: { payload: TestBrand<TestData> }) => boolean) => void,
          callbackV3: (callback: (param: TestData) => boolean) => void
        ]
      }
    }
  ]
}