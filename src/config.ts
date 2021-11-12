import * as core from '@actions/core'

export function getOptionalInput(key: string, val: string): string {
  const input = core.getInput(key)
  if (input === '') {
    return val
  }
  return input
}
