# Github Dashboard

Simple dashboard to keep track of pull requests from configurable list of GitHub repositories.

## Configuration

Configuration lives in `src/config/config.json`. Generate a personal access token on GitHub with at least repo access and then update the value of `authToken` with the token that was generated. Also update `repositories` with list of repositories to watch for.

## Installation

```
$ yarn install
$ yarn run build
```

## Starting Application

```
$ yarn start
```