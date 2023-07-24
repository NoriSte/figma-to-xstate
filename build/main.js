var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types.ts
function isFrame(node) {
  return node.type === "FRAME";
}
function isGroup(node) {
  return node.type === "GROUP";
}
var init_types = __esm({
  "src/types.ts"() {
    "use strict";
  }
});

// src/utils.ts
function generateGroupName(node) {
  const groupHasGenericName = /^Group\s\d+$/.test(node.name);
  if (!groupHasGenericName)
    return node.name;
  let childName = "";
  node.findAll((child) => {
    if (childName)
      return false;
    console.log(child.type, child.name);
    if (child.type === "TEXT")
      childName = child.name;
    return false;
  });
  return childName || node.name;
}
function normalizeString(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}
function matchElementThatNavigateOnClick(mutableElementsThatNavigate, node, parentFrame) {
  if (!("reactions" in node))
    return;
  for (const reaction of node.reactions) {
    if (!reaction.action)
      continue;
    if (reaction.action.type !== "NODE")
      continue;
    if (reaction.action.navigation !== "NAVIGATE")
      continue;
    if (!reaction.action.destinationId)
      continue;
    mutableElementsThatNavigate.push({
      node,
      destinationFrameId: reaction.action.destinationId,
      parentFrame,
      name: isGroup(node) ? generateGroupName(node) : node.name
    });
    break;
  }
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_types();
  }
});

// src/generators.ts
function createXStateV4StateMachineOptions(params) {
  const { frames, elementsThatNavigate } = params;
  const firstFrame = frames[0];
  if (!firstFrame) {
    console.error("The document contains no frame.");
    return;
  }
  let code = `{
  id: '${normalizeString(figma.currentPage.name)}',
  initial: '${normalizeString(firstFrame.name)}',
  states: {`;
  for (const frame of frames) {
    const elementsThatNavigateInFrame = elementsThatNavigate.filter(
      (element) => element.parentFrame.id === frame.id
    );
    if (elementsThatNavigateInFrame.length > 0) {
      code += `
      ${normalizeString(frame.name)}: {
      on: {

  `;
      for (const elementThatNavigateInFrame of elementsThatNavigateInFrame) {
        const destinationFrame = frames.find(
          ({ id }) => elementThatNavigateInFrame.destinationFrameId === id
        );
        if (!destinationFrame)
          throw new Error(`Frame ${elementThatNavigateInFrame.destinationFrameId} not found`);
        code += `

  ${normalizeString(
          `CLICK_ON_${elementThatNavigateInFrame.name.toUpperCase()}`
        )}: '${normalizeString(destinationFrame.name)}',

  `;
      }
      code += `
    },
  },
  `;
    } else {
      code += `
    ${normalizeString(frame.name)}: {
      // This frame does not contain anything that navigates to other frames
    },
      `;
    }
  }
  code += `
  },
}
`;
  return code;
}
function createXStateV4VizCode(params) {
  let code = `
// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const ${figma.currentPage.name}Machine = Machine(${createXStateV4StateMachineOptions(params)})
  `;
  return code;
}
var init_generators = __esm({
  "src/generators.ts"() {
    "use strict";
    init_utils();
  }
});

// src/traverse.ts
function traversePage(params) {
  const { mutableFrames, mutableElementsThatNavigate } = params;
  const skipInvisibleInstanceChildrenBackup = figma.skipInvisibleInstanceChildren;
  figma.skipInvisibleInstanceChildren = true;
  let lastFrame;
  figma.currentPage.findAll((node) => {
    if (isFrame(node)) {
      mutableFrames.push(node);
      lastFrame = node;
    }
    matchElementThatNavigateOnClick(mutableElementsThatNavigate, node, lastFrame);
    return false;
  });
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup;
}
var init_traverse = __esm({
  "src/traverse.ts"() {
    "use strict";
    init_types();
    init_utils();
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  const frames = [];
  const elementsThatNavigate = [];
  traversePage({
    mutableFrames: frames,
    mutableElementsThatNavigate: elementsThatNavigate
  });
  console.log({ frames, elementsThatNavigate });
  const code = createXStateV4VizCode({
    frames,
    elementsThatNavigate
  });
  console.log(code);
  figma.closePlugin("Hello, mondo!");
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_generators();
    init_traverse();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
