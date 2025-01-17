<p align="center">
  <picture>
    <source srcset="./common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
    <img src="./common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
  </picture>
</p>

# Kadena.js

Contains all public Kadena projects for the JavaScript ecosystem

See the respective docs in [\<placeholder docs>]()

# Contributing

Always open an issue to contribute

## Getting started

See [requirements](#requirements) to get started. After that come back here

- run `rush install` when you've cloned the project
- adding dependencies is done
  - with `rush add -p <package>` (add `--dev` if needed)
  - by adding it to the `package.json` and running `rush update` afterwards

If any issues occur, you can run `rush update --purge`

[Read more about Rush "New developer"](https://rushjs.io/pages/developer/new_developer/)

## Requirements

- node 16
- rushjs

See [installing perequisites](#installing-prerequisites)

## Installing prerequisites

### Install `node`

several options, here used `n`. Can also use `asdf` (generic version manager),
`nvm`, or installation with `brew` (discouraged)

```sh
# `n` node version manager
brew install n
n 16
```

### Install `rush`

```sh
pnpm install --global @microsoft/rush
```

Now go to [getting started](#getting-started)
