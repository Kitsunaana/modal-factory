import { expect, expectTypeOf, test } from 'vitest'

test('type', () => {
  expectTypeOf(1).toEqualTypeOf(2)
})
