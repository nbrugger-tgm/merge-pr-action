import {expect, test} from '@jest/globals'
import {getOptionalComputedInput, getOptionalInput} from '../src/config'

test('getOptional input should return optional when input is not present', () => {
  const out = getOptionalInput('no-key', 'someval')
  expect(out).toBe('someval')
})

test('getOptional computed input should return optional return value when input is not present', () => {
  let i = ''
  const out = getOptionalComputedInput('no-key', () => {
    i += 'A'
    return i
  })
  const out1 = getOptionalComputedInput('no-key1', () => {
    i += 'A'
    return i
  })
  const out2 = getOptionalComputedInput('no-key2', () => {
    i += 'A'
    return i
  })
  expect(out).toBe('A')
  expect(out1).toBe('AA')
  expect(out2).toBe('AAA')
  expect(i).toBe('AAA')
})
