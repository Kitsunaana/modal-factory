import { describe, expectTypeOf, test } from 'vitest'
import type { PayloadBrand, PayloadUnbrand } from '../interface'

type MockPayload = {
  zxc: string
  hard: {
    a: {
      b: "terminator"
    }
  }
}

const mockPayloadBrand = ({ } as PayloadBrand<MockPayload>)
const mockPayloadUnbrand = ({  } as PayloadUnbrand<PayloadBrand<MockPayload>>)

describe("Payload Brand/Unbrand", () => {
  test("Возвращаемый тип Brand совпадает с ожидаемым", () => {
    expectTypeOf(mockPayloadBrand).toEqualTypeOf<{
      __internal_name: "payload"
      zxc: string,
      hard: {
        a: {
          b: "terminator"
        }
      }
    }>()
  })

  test("Возвращаемый тип Brand НЕ совпадает с ожидаемым", () => {
    // @ts-expect-error
    expectTypeOf(mockPayloadBrand).toEqualTypeOf<{
      __internal_name: "payload"
      hard: {
        a: {}
      }
    }>()
  })

  test("Вытаскиваем тип из Brand", () => {
    expectTypeOf(mockPayloadUnbrand).not.toEqualTypeOf<{ __internal_name: "payload" }>()
  })

  test("Извлеченный тип из Unbrand соответствует ожидаемому", () => {
    expectTypeOf(mockPayloadUnbrand).toEqualTypeOf<MockPayload>()
  })
})