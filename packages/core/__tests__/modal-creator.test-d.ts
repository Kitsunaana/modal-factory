import { describe, expectTypeOf, test } from 'vitest'
import type { ModalStoreWhenIsNotOpened, ModalStoreWhenIsOpened } from '../src'

type MockPayload = {
  zxc: string
  hard: {
    a: {
      b: "terminator"
    }
  }
}

describe("ModalCreator", () => {
  test("Состояние стора, когда isOpen true", () => {
    const modalStoreWhenIsOpenTrue = ({} as ModalStoreWhenIsOpened<MockPayload>)

    expectTypeOf(modalStoreWhenIsOpenTrue)
      .toHaveProperty("isOpen")
      .toEqualTypeOf<true>()
    
    expectTypeOf(modalStoreWhenIsOpenTrue)
      .toHaveProperty("payload")
      .toEqualTypeOf<MockPayload>()

    expectTypeOf(modalStoreWhenIsOpenTrue).toEqualTypeOf<{
      isOpen: true,
      payload: MockPayload
    }>()
  })

  test("Состояние стора, когда isOpen false", () => {
    const modalStoreWhenIsOpenFalse = ({} as ModalStoreWhenIsNotOpened<MockPayload>)

    expectTypeOf(modalStoreWhenIsOpenFalse)
      .toHaveProperty("isOpen")
      .toEqualTypeOf<false>()
    
    expectTypeOf(modalStoreWhenIsOpenFalse)
      .toHaveProperty("payload")
      .toEqualTypeOf<MockPayload | undefined>()

    expectTypeOf(modalStoreWhenIsOpenFalse).toEqualTypeOf<{
      isOpen: false,
      payload?: MockPayload
    }>()
  })
})