import * as core from '@actions/core'
import * as github from '@actions/github'
import {Config, Method} from './types'

async function run(): Promise<void> {
  const pullRequest = github.context.payload.pull_request
  if (pullRequest === undefined) {
    return core.error('No pull request found')
  }
  const conf = getConfig(pullRequest)
  core.info(`Run with config : ${JSON.stringify(conf)}`)
  const client = github.getOctokit(conf.token)
  const mergeResult = await client.rest.pulls.merge({
    owner: conf.owner,
    repo: conf.repo,
    pull_number: conf.pull_number,
    commit_title: conf.commit_title,
    commit_message: conf.commit_message,
    merge_method: conf.method
  })
  core.debug(`Merge result : ${mergeResult}`)
  //fail when not merged
  if (!mergeResult.data.merged) {
    return core.error(`Merge failed : ${mergeResult}`)
  }
  core.setOutput('commit', mergeResult.data.sha)
}

run()

function getOptionalInput(key: string, val: string): string {
  const input = core.getInput(key)
  if (input === '') {
    return val
  }
  return input
}

function getConfig(pullRequest: {number: number}): Config {
  const owner = getOptionalInput('owner', github.context.repo.owner)
  const repo = getOptionalInput('repo', github.context.repo.repo)
  const pull_number: number = +getOptionalInput(
    'pull_request',
    pullRequest.number.toString()
  )
  const token: string = core.getInput('token')
  const method: Method = getOptionalInput('method', 'merge') as Method
  const commit_title: string = core.getInput('commitTitle')
  const commit_message: string = core.getInput('message')
  const config: Config = {
    owner,
    repo,
    pull_number,
    token,
    method,
    commit_title,
    commit_message
  }
  if (config.commit_message === '') {
    config.commit_message = undefined
  }
  if (config.commit_title === '') {
    config.commit_title = undefined
  }
  return config
}
