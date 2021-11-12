import {expect, test} from '@jest/globals'
import {getOptionalInput} from '../src/config'

test('getOptional input should return optional when input is not present', () => {
  const out = getOptionalInput('no-key', 'someval')
  expect(out).toBe('someval')
})
