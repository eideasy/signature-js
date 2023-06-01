# How to Contribute

## Repo
All work is done on [https://github.com/eideasy/eideasy-browser-client](https://github.com/eideasy/eideasy-browser-client).

## Semantic Versioning
eideasy-browser-client follows [semantic versioning](https://semver.org/)

## Branches
Make all pull requests directly against the [master branch](https://github.com/eideasy/eideasy-browser-client/tree/master).
Keep in mind that the master branch should always be in a releasable state as we might want to release a new minor version from the tip of the ``master`` at any time.

## Committing Changes
Commit messages should follow the [conventional commits](www.conventionalcommits.org) convention so that changelogs can be automatically generated.
We use [commitizen](https://github.com/commitizen/cz-cli) along with [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) to
make following the convention easier.

## Development Setup

### Prerequisites
- [Node.js v12.x](https://nodejs.org/en/)
- [Yarn v1.x](https://classic.yarnpkg.com/lang/en/)

### Setup Guide
1. Clone the repo: [https://github.com/eideasy/eideasy-browser-client](https://github.com/eideasy/eideasy-browser-client)
2. Open the cloned project in a new terminal window
3. Run ``yarn`` to install the dependencies
4. Run ``yarn build`` to create a production build
   For other available commands see: [package.json](https://github.com/eideasy/eideasy-browser-client/blob/master/package.json)

Alternatively, instead of step 4. you could also run ``yarn docs:dev``. There's a /demos subpage in docs which might
come in handy while developing this browser-client. So, every time you'll change something in the browser-client core,
docs get automatically rebuilt and you'll see the update in real-time.

## Bugs
We are using [GitHub Issues](https://github.com/eideasy/eideasy-browser-client/issues) to keep track of our public bugs.

## How to Get in Touch
- [Slack](https://join.slack.com/t/eideasypartners/shared_invite/zt-mjn4e6mb-TmjcSzyZf4hEc1qsBHOHdQ)
- By email: info@eideasy.com



### Misc Development notes
https://github.com/volta-cli/volta/issues/651

volta install yarn@2.4.0
yarn set version berry

https://yarnpkg.com/cli/run
yarn run --inspect-brk webpack
