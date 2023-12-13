# 🚧 Figma to XState

A Figma plugin to convert a Figma prototype to an XState machine.

## Why?

I trust XState not only as a powerful development tool, but also for enabling pair programming
among engineers and Product stakeholders.

Product teams do not miss much edge cases when they design
features through flowcharts and also ease a flowchart-to-XState machine conversion process. At the
same time, I think a Figma prototype to XState machine convert tool can speed up the initial
conversion process, allowing later engineering rework the state machine with or without the designers.


## Roadmap

- [x] Export Figma's frames as XState's states
- [ ] Export Figma's interactions as XState's events
  - [x] Click
  - [x] Drag
  - [ ] Key
  - [x] Mouse enter/leave
  - [x] Mouse down/up (touch down/touch up)
    - [x] Delay for all the mouse events
    - [ ] Delays that override each other
  - [ ] Set variable
    - [ ] Support for variable collections
- [ ] Support nodes nested in other other nodes
- [ ] Export Figma's interactions actions as XState's events
  - [x] Navigate
  - [ ] Change to
  - [ ] Back
  - [ ] Set variable
  - [ ] Conditional
  - [x] Scroll to
  - [ ] Open link
  - [ ] Open overlay
  - [ ] Swap overlay
  - [ ] Close overlay
- [ ] Support for multiple prototypes in the same page
- [ ] Support for custom prototype starting points
- [ ] Export XState V5 machine




## FAQ

*Is an XState machine to Figma prototype conversion in the roadmap?*?

No, Figma's prototypes lacks most of the XState's functionalities.

*Is a two-way sync in the roadmap after the first export?*?

No, I think tracking what happened to the XState machine after it has been exported is too hard and
Figma's prototypes lacks most of the XState's functionalities.


### Install the plugin

1. In the Figma desktop app, open a Figma document.
2. Search for and run `Import plugin from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script.
