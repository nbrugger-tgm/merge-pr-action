<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

## Merge PR

This action will merge your PR. It is just a wrapper for the ``octokit.rest.pulls.merge`` method.

This action does not aim to do a lot of automation, but give you atomic access to build your own YAML workflow.

## Inputs

| Name | Type | Description | Default Value |
|------|------|-------------|---------------|
| `owner` | string | The owner of the repository | current repo owner |
| `repo` | string | The name of the repository | current repo name |
| `pull_request` | number | The number of the pull request | The number from the event |
| `token` | string | The token to use for authentication | _required_ |
| `commit_message` | string | The commit message | the message that gh generates |
| `commit_title` | string | The commit title | the title that gh generates |
| `method` | string | The method to use for merging the pull request (merge, squash, rebase) | merge |

## Outputs

| Name | Description |
|------|------------|
| `commit` | The sha of the commit that was created |


## Example

```yaml
on:
  pull_request:
    type: labeled

jobs:
  merge:
    runs-on: ubuntu-latest
    if: event.label.name == 'ready for merge'
    steps:
      - name : merge
        uses : nbrugger-tgm/merge-pr-action@v0.1.0
        with :
          token: ${{ secrets.GITHUB_TOKEN }}
          method: squash
```
