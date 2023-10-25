# Contributing



## Issues

If you want to raise an issue:
1. Please check the [README's roadmap](./README.md#roadmap) in advance, chances are we already
planned to work on what you need
1. Please check the [README's FAQ](./README.md#faq) in advance, chances are we are aware of your
needs but we chose not to work on them

## Features

First of all, open an issue to describe the feature you would like to build. This helps to avoid you
wasting your time in case something is not needed or we have a different vision about the topic 😊

## Development

### How the plugin works

If you start from [src/types.ts](./src/types.ts), and [src/main.ts](./src/main.ts) files, you can
see the plugin is split in two big steps:

1. A **traverser**: it goes through the content of the Figma document looking for all the useful
elements which influence the generated state machine (for instance: fragments, buttons, etc.). The
goal is to generate a **Figma-agnostic object descriptor** used later on to generate the state
machine. The object created by the traverser is logged in the console's devtools.

1. Some **generators**: they generate the state machine's code out of the Figma-agnostic object
descriptor. The generate machine is a string to be then copy-pasted in your own project, or in the
XState visualizer. In the future, more generators will be added.

### Tests

At the moment:
1. The traverser is not tested
2. The generators are unit tested
   1. Anyway, only the generated string is checked. At the moment, the string is not used to create
   a real XState state machine


### To do list

Here is an non-exhausting list of things to do on the project, prioritize by importance.

1. Cover more Figma's features (see the main [README](./README.md))
2. Create an issue template
3. Set up git hooks
4. Set up ESlint v9 and [Styleint](https://stylelint.io/)
5. Set up CI
6. Set up automatic releases


## Development guide

*This plugin is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/).*

### Pre-requisites

- [Node.js](https://nodejs.org) – v18
- [Figma desktop app](https://figma.com/downloads/)

### Build the plugin

To build the plugin:

```
$ npm run build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/`
directory containing the JavaScript bundle(s) for the plugin.

To watch for code changes and rebuild the plugin automatically:

```
$ npm run watch
```


### Development

Use `console.log` statements to inspect values in your code.

To open the developer console, search for and run `Open Console` via the Quick Actions search bar.

You can use one of the available [Figma files](./src/figma-files/) to play with the plugin.


### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console, search for and run `Open Console` via the Quick Actions search bar.

### Launch tests

```
$ npm test
```

## See also

- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)
