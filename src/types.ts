export type Method = 'squash' | 'merge' | 'rebase'
export interface Config {
  owner: string
  repo: string
  pull_number: number
  commit_title: string | undefined
  commit_message: string | undefined
  method: Method
  token: string
}
export interface PullRequest {
  head: {repo: {owner: {login: string}; name: string}}
  number: string
}
