import * as core from '@actions/core'
import * as github from '@actions/github'
import {Config, Method} from './types'
import {getOptionalComputedInput} from './config'

async function run(): Promise<void> {
  const conf = getConfig()
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
    core.error(`Merge failed : ${mergeResult}`)
    return
  } else {
    core.info(`Merge seems successfull! Result ${mergeResult}`)
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

function getConfig(): Config {
  const owner = getOptionalInput('owner', github.context.repo.owner)
  const repo = getOptionalInput('repo', github.context.repo.repo)
  let pull_number: number
  let pullRequest = null
  if (
    github.context.eventName === 'pull_request' ||
    github.context.eventName === 'pull_request_target'
  ) {
    pull_number = +getOptionalComputedInput('pull_request', () => {
      pullRequest = github.context.payload.pull_request
      if (pullRequest === undefined) {
        throw new Error('Could not get pull_request from event!')
      }
      return pullRequest.number.toString()
    })
  } else {
    if (core.getInput('pull_request') === '') {
      core.error(
        "Couldn't get default pr number" +
          " because this action was not triggered by 'pull_request' or 'pull_request_target' event." +
          " When using any other event 'pull_request' input is required"
      )
      throw new Error('Could not fall back to pull_request from event!')
    } else pull_number = +core.getInput('pull_request')
  }
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
