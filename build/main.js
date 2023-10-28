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

// node_modules/.pnpm/code-block-writer@12.0.0/node_modules/code-block-writer/esm/utils/string_utils.js
function escapeForWithinString(str, quoteKind) {
  return escapeChar(str, quoteKind).replace(newlineRegex, "\\$1");
}
function escapeChar(str, char) {
  if (char.length !== 1) {
    throw new Error(`Specified char must be one character long.`);
  }
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      result += "\\";
    }
    result += str[i];
  }
  return result;
}
function getStringFromStrOrFunc(strOrFunc) {
  return strOrFunc instanceof Function ? strOrFunc() : strOrFunc;
}
var newlineRegex;
var init_string_utils = __esm({
  "node_modules/.pnpm/code-block-writer@12.0.0/node_modules/code-block-writer/esm/utils/string_utils.js"() {
    newlineRegex = /(\r?\n)/g;
  }
});

// node_modules/.pnpm/code-block-writer@12.0.0/node_modules/code-block-writer/esm/mod.js
function isRegExStart(currentChar, pastChar, pastPastChar) {
  return pastChar === CHARS.FORWARD_SLASH && currentChar !== CHARS.FORWARD_SLASH && currentChar !== CHARS.ASTERISK && pastPastChar !== CHARS.ASTERISK && pastPastChar !== CHARS.FORWARD_SLASH;
}
function getIndentationText(useTabs, numberSpaces) {
  if (useTabs) {
    return "	";
  }
  return Array(numberSpaces + 1).join(" ");
}
function getSpacesAndTabsCount(str) {
  let spacesCount = 0;
  let tabsCount = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode === CHARS.SPACE) {
      spacesCount++;
    } else if (charCode === CHARS.TAB) {
      tabsCount++;
    }
  }
  return { spacesCount, tabsCount };
}
var CommentChar, CHARS, isCharToHandle, CodeBlockWriter;
var init_mod = __esm({
  "node_modules/.pnpm/code-block-writer@12.0.0/node_modules/code-block-writer/esm/mod.js"() {
    init_string_utils();
    (function(CommentChar2) {
      CommentChar2[CommentChar2["Line"] = 0] = "Line";
      CommentChar2[CommentChar2["Star"] = 1] = "Star";
    })(CommentChar || (CommentChar = {}));
    CHARS = {
      BACK_SLASH: "\\".charCodeAt(0),
      FORWARD_SLASH: "/".charCodeAt(0),
      NEW_LINE: "\n".charCodeAt(0),
      CARRIAGE_RETURN: "\r".charCodeAt(0),
      ASTERISK: "*".charCodeAt(0),
      DOUBLE_QUOTE: '"'.charCodeAt(0),
      SINGLE_QUOTE: "'".charCodeAt(0),
      BACK_TICK: "`".charCodeAt(0),
      OPEN_BRACE: "{".charCodeAt(0),
      CLOSE_BRACE: "}".charCodeAt(0),
      DOLLAR_SIGN: "$".charCodeAt(0),
      SPACE: " ".charCodeAt(0),
      TAB: "	".charCodeAt(0)
    };
    isCharToHandle = /* @__PURE__ */ new Set([
      CHARS.BACK_SLASH,
      CHARS.FORWARD_SLASH,
      CHARS.NEW_LINE,
      CHARS.CARRIAGE_RETURN,
      CHARS.ASTERISK,
      CHARS.DOUBLE_QUOTE,
      CHARS.SINGLE_QUOTE,
      CHARS.BACK_TICK,
      CHARS.OPEN_BRACE,
      CHARS.CLOSE_BRACE
    ]);
    CodeBlockWriter = class _CodeBlockWriter {
      /**
       * Constructor.
       * @param opts - Options for the writer.
       */
      constructor(opts = {}) {
        Object.defineProperty(this, "_indentationText", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_newLine", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_useTabs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_quoteChar", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_indentNumberOfSpaces", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_currentIndentation", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 0
        });
        Object.defineProperty(this, "_queuedIndentation", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_queuedOnlyIfNotBlock", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_length", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 0
        });
        Object.defineProperty(this, "_newLineOnNextWrite", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "_currentCommentChar", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_stringCharStack", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "_isInRegEx", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "_isOnFirstLineOfBlock", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "_texts", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        this._newLine = opts.newLine || "\n";
        this._useTabs = opts.useTabs || false;
        this._indentNumberOfSpaces = opts.indentNumberOfSpaces || 4;
        this._indentationText = getIndentationText(this._useTabs, this._indentNumberOfSpaces);
        this._quoteChar = opts.useSingleQuote ? "'" : `"`;
      }
      /**
       * Gets the options.
       */
      getOptions() {
        return {
          indentNumberOfSpaces: this._indentNumberOfSpaces,
          newLine: this._newLine,
          useTabs: this._useTabs,
          useSingleQuote: this._quoteChar === "'"
        };
      }
      queueIndentationLevel(countOrText) {
        this._queuedIndentation = this._getIndentationLevelFromArg(countOrText);
        this._queuedOnlyIfNotBlock = void 0;
        return this;
      }
      /**
       * Writes the text within the provided action with hanging indentation.
       * @param action - Action to perform with hanging indentation.
       */
      hangingIndent(action) {
        return this._withResetIndentation(() => this.queueIndentationLevel(this.getIndentationLevel() + 1), action);
      }
      /**
       * Writes the text within the provided action with hanging indentation unless writing a block.
       * @param action - Action to perform with hanging indentation unless a block is written.
       */
      hangingIndentUnlessBlock(action) {
        return this._withResetIndentation(() => {
          this.queueIndentationLevel(this.getIndentationLevel() + 1);
          this._queuedOnlyIfNotBlock = true;
        }, action);
      }
      setIndentationLevel(countOrText) {
        this._currentIndentation = this._getIndentationLevelFromArg(countOrText);
        return this;
      }
      withIndentationLevel(countOrText, action) {
        return this._withResetIndentation(() => this.setIndentationLevel(countOrText), action);
      }
      /** @internal */
      _withResetIndentation(setStateAction, writeAction) {
        const previousState = this._getIndentationState();
        setStateAction();
        try {
          writeAction();
        } finally {
          this._setIndentationState(previousState);
        }
        return this;
      }
      /**
       * Gets the current indentation level.
       */
      getIndentationLevel() {
        return this._currentIndentation;
      }
      /**
       * Writes a block using braces.
       * @param block - Write using the writer within this block.
       */
      block(block) {
        this._newLineIfNewLineOnNextWrite();
        if (this.getLength() > 0 && !this.isLastNewLine()) {
          this.spaceIfLastNot();
        }
        this.inlineBlock(block);
        this._newLineOnNextWrite = true;
        return this;
      }
      /**
       * Writes an inline block with braces.
       * @param block - Write using the writer within this block.
       */
      inlineBlock(block) {
        this._newLineIfNewLineOnNextWrite();
        this.write("{");
        this._indentBlockInternal(block);
        this.newLineIfLastNot().write("}");
        return this;
      }
      indent(timesOrBlock = 1) {
        if (typeof timesOrBlock === "number") {
          this._newLineIfNewLineOnNextWrite();
          return this.write(this._indentationText.repeat(timesOrBlock));
        } else {
          this._indentBlockInternal(timesOrBlock);
          if (!this.isLastNewLine()) {
            this._newLineOnNextWrite = true;
          }
          return this;
        }
      }
      /** @internal */
      _indentBlockInternal(block) {
        if (this.getLastChar() != null) {
          this.newLineIfLastNot();
        }
        this._currentIndentation++;
        this._isOnFirstLineOfBlock = true;
        if (block != null) {
          block();
        }
        this._isOnFirstLineOfBlock = false;
        this._currentIndentation = Math.max(0, this._currentIndentation - 1);
      }
      conditionalWriteLine(condition, strOrFunc) {
        if (condition) {
          this.writeLine(getStringFromStrOrFunc(strOrFunc));
        }
        return this;
      }
      /**
       * Writes a line of text.
       * @param text - String to write.
       */
      writeLine(text) {
        this._newLineIfNewLineOnNextWrite();
        if (this.getLastChar() != null) {
          this.newLineIfLastNot();
        }
        this._writeIndentingNewLines(text);
        this.newLine();
        return this;
      }
      /**
       * Writes a newline if the last line was not a newline.
       */
      newLineIfLastNot() {
        this._newLineIfNewLineOnNextWrite();
        if (!this.isLastNewLine()) {
          this.newLine();
        }
        return this;
      }
      /**
       * Writes a blank line if the last written text was not a blank line.
       */
      blankLineIfLastNot() {
        if (!this.isLastBlankLine()) {
          this.blankLine();
        }
        return this;
      }
      /**
       * Writes a blank line if the condition is true.
       * @param condition - Condition to evaluate.
       */
      conditionalBlankLine(condition) {
        if (condition) {
          this.blankLine();
        }
        return this;
      }
      /**
       * Writes a blank line.
       */
      blankLine() {
        return this.newLineIfLastNot().newLine();
      }
      /**
       * Writes a newline if the condition is true.
       * @param condition - Condition to evaluate.
       */
      conditionalNewLine(condition) {
        if (condition) {
          this.newLine();
        }
        return this;
      }
      /**
       * Writes a newline.
       */
      newLine() {
        this._newLineOnNextWrite = false;
        this._baseWriteNewline();
        return this;
      }
      quote(text) {
        this._newLineIfNewLineOnNextWrite();
        this._writeIndentingNewLines(text == null ? this._quoteChar : this._quoteChar + escapeForWithinString(text, this._quoteChar) + this._quoteChar);
        return this;
      }
      /**
       * Writes a space if the last character was not a space.
       */
      spaceIfLastNot() {
        this._newLineIfNewLineOnNextWrite();
        if (!this.isLastSpace()) {
          this._writeIndentingNewLines(" ");
        }
        return this;
      }
      /**
       * Writes a space.
       * @param times - Number of times to write a space.
       */
      space(times = 1) {
        this._newLineIfNewLineOnNextWrite();
        this._writeIndentingNewLines(" ".repeat(times));
        return this;
      }
      /**
       * Writes a tab if the last character was not a tab.
       */
      tabIfLastNot() {
        this._newLineIfNewLineOnNextWrite();
        if (!this.isLastTab()) {
          this._writeIndentingNewLines("	");
        }
        return this;
      }
      /**
       * Writes a tab.
       * @param times - Number of times to write a tab.
       */
      tab(times = 1) {
        this._newLineIfNewLineOnNextWrite();
        this._writeIndentingNewLines("	".repeat(times));
        return this;
      }
      conditionalWrite(condition, textOrFunc) {
        if (condition) {
          this.write(getStringFromStrOrFunc(textOrFunc));
        }
        return this;
      }
      /**
       * Writes the provided text.
       * @param text - Text to write.
       */
      write(text) {
        this._newLineIfNewLineOnNextWrite();
        this._writeIndentingNewLines(text);
        return this;
      }
      /**
       * Writes text to exit a comment if in a comment.
       */
      closeComment() {
        const commentChar = this._currentCommentChar;
        switch (commentChar) {
          case CommentChar.Line:
            this.newLine();
            break;
          case CommentChar.Star:
            if (!this.isLastNewLine()) {
              this.spaceIfLastNot();
            }
            this.write("*/");
            break;
          default: {
            const _assertUndefined = commentChar;
            break;
          }
        }
        return this;
      }
      /**
       * Inserts text at the provided position.
       *
       * This method is "unsafe" because it won't update the state of the writer unless
       * inserting at the end position. It is biased towards being fast at inserting closer
       * to the start or end, but slower to insert in the middle. Only use this if
       * absolutely necessary.
       * @param pos - Position to insert at.
       * @param text - Text to insert.
       */
      unsafeInsert(pos, text) {
        const textLength = this._length;
        const texts = this._texts;
        verifyInput();
        if (pos === textLength) {
          return this.write(text);
        }
        updateInternalArray();
        this._length += text.length;
        return this;
        function verifyInput() {
          if (pos < 0) {
            throw new Error(`Provided position of '${pos}' was less than zero.`);
          }
          if (pos > textLength) {
            throw new Error(`Provided position of '${pos}' was greater than the text length of '${textLength}'.`);
          }
        }
        function updateInternalArray() {
          const { index, localIndex } = getArrayIndexAndLocalIndex();
          if (localIndex === 0) {
            texts.splice(index, 0, text);
          } else if (localIndex === texts[index].length) {
            texts.splice(index + 1, 0, text);
          } else {
            const textItem = texts[index];
            const startText = textItem.substring(0, localIndex);
            const endText = textItem.substring(localIndex);
            texts.splice(index, 1, startText, text, endText);
          }
        }
        function getArrayIndexAndLocalIndex() {
          if (pos < textLength / 2) {
            let endPos = 0;
            for (let i = 0; i < texts.length; i++) {
              const textItem = texts[i];
              const startPos = endPos;
              endPos += textItem.length;
              if (endPos >= pos) {
                return { index: i, localIndex: pos - startPos };
              }
            }
          } else {
            let startPos = textLength;
            for (let i = texts.length - 1; i >= 0; i--) {
              const textItem = texts[i];
              startPos -= textItem.length;
              if (startPos <= pos) {
                return { index: i, localIndex: pos - startPos };
              }
            }
          }
          throw new Error("Unhandled situation inserting. This should never happen.");
        }
      }
      /**
       * Gets the length of the string in the writer.
       */
      getLength() {
        return this._length;
      }
      /**
       * Gets if the writer is currently in a comment.
       */
      isInComment() {
        return this._currentCommentChar !== void 0;
      }
      /**
       * Gets if the writer is currently at the start of the first line of the text, block, or indentation block.
       */
      isAtStartOfFirstLineOfBlock() {
        return this.isOnFirstLineOfBlock() && (this.isLastNewLine() || this.getLastChar() == null);
      }
      /**
       * Gets if the writer is currently on the first line of the text, block, or indentation block.
       */
      isOnFirstLineOfBlock() {
        return this._isOnFirstLineOfBlock;
      }
      /**
       * Gets if the writer is currently in a string.
       */
      isInString() {
        return this._stringCharStack.length > 0 && this._stringCharStack[this._stringCharStack.length - 1] !== CHARS.OPEN_BRACE;
      }
      /**
       * Gets if the last chars written were for a newline.
       */
      isLastNewLine() {
        const lastChar = this.getLastChar();
        return lastChar === "\n" || lastChar === "\r";
      }
      /**
       * Gets if the last chars written were for a blank line.
       */
      isLastBlankLine() {
        let foundCount = 0;
        for (let i = this._texts.length - 1; i >= 0; i--) {
          const currentText = this._texts[i];
          for (let j = currentText.length - 1; j >= 0; j--) {
            const currentChar = currentText.charCodeAt(j);
            if (currentChar === CHARS.NEW_LINE) {
              foundCount++;
              if (foundCount === 2) {
                return true;
              }
            } else if (currentChar !== CHARS.CARRIAGE_RETURN) {
              return false;
            }
          }
        }
        return false;
      }
      /**
       * Gets if the last char written was a space.
       */
      isLastSpace() {
        return this.getLastChar() === " ";
      }
      /**
       * Gets if the last char written was a tab.
       */
      isLastTab() {
        return this.getLastChar() === "	";
      }
      /**
       * Gets the last char written.
       */
      getLastChar() {
        const charCode = this._getLastCharCodeWithOffset(0);
        return charCode == null ? void 0 : String.fromCharCode(charCode);
      }
      /**
       * Gets if the writer ends with the provided text.
       * @param text - Text to check if the writer ends with the provided text.
       */
      endsWith(text) {
        const length = this._length;
        return this.iterateLastCharCodes((charCode, index) => {
          const offset = length - index;
          const textIndex = text.length - offset;
          if (text.charCodeAt(textIndex) !== charCode) {
            return false;
          }
          return textIndex === 0 ? true : void 0;
        }) || false;
      }
      /**
       * Iterates over the writer characters in reverse order. The iteration stops when a non-null or
       * undefined value is returned from the action. The returned value is then returned by the method.
       *
       * @remarks It is much more efficient to use this method rather than `#toString()` since `#toString()`
       * will combine the internal array into a string.
       */
      iterateLastChars(action) {
        return this.iterateLastCharCodes((charCode, index) => action(String.fromCharCode(charCode), index));
      }
      /**
       * Iterates over the writer character char codes in reverse order. The iteration stops when a non-null or
       * undefined value is returned from the action. The returned value is then returned by the method.
       *
       * @remarks It is much more efficient to use this method rather than `#toString()` since `#toString()`
       * will combine the internal array into a string. Additionally, this is slightly more efficient that
       * `iterateLastChars` as this won't allocate a string per character.
       */
      iterateLastCharCodes(action) {
        let index = this._length;
        for (let i = this._texts.length - 1; i >= 0; i--) {
          const currentText = this._texts[i];
          for (let j = currentText.length - 1; j >= 0; j--) {
            index--;
            const result = action(currentText.charCodeAt(j), index);
            if (result != null) {
              return result;
            }
          }
        }
        return void 0;
      }
      /**
       * Gets the writer's text.
       */
      toString() {
        if (this._texts.length > 1) {
          const text = this._texts.join("");
          this._texts.length = 0;
          this._texts.push(text);
        }
        return this._texts[0] || "";
      }
      /** @internal */
      _writeIndentingNewLines(text) {
        text = text || "";
        if (text.length === 0) {
          writeIndividual(this, "");
          return;
        }
        const items = text.split(_CodeBlockWriter._newLineRegEx);
        items.forEach((s, i) => {
          if (i > 0) {
            this._baseWriteNewline();
          }
          if (s.length === 0) {
            return;
          }
          writeIndividual(this, s);
        });
        function writeIndividual(writer, s) {
          if (!writer.isInString()) {
            const isAtStartOfLine = writer.isLastNewLine() || writer.getLastChar() == null;
            if (isAtStartOfLine) {
              writer._writeIndentation();
            }
          }
          writer._updateInternalState(s);
          writer._internalWrite(s);
        }
      }
      /** @internal */
      _baseWriteNewline() {
        if (this._currentCommentChar === CommentChar.Line) {
          this._currentCommentChar = void 0;
        }
        const lastStringCharOnStack = this._stringCharStack[this._stringCharStack.length - 1];
        if ((lastStringCharOnStack === CHARS.DOUBLE_QUOTE || lastStringCharOnStack === CHARS.SINGLE_QUOTE) && this._getLastCharCodeWithOffset(0) !== CHARS.BACK_SLASH) {
          this._stringCharStack.pop();
        }
        this._internalWrite(this._newLine);
        this._isOnFirstLineOfBlock = false;
        this._dequeueQueuedIndentation();
      }
      /** @internal */
      _dequeueQueuedIndentation() {
        if (this._queuedIndentation == null) {
          return;
        }
        if (this._queuedOnlyIfNotBlock && wasLastBlock(this)) {
          this._queuedIndentation = void 0;
          this._queuedOnlyIfNotBlock = void 0;
        } else {
          this._currentIndentation = this._queuedIndentation;
          this._queuedIndentation = void 0;
        }
        function wasLastBlock(writer) {
          let foundNewLine = false;
          return writer.iterateLastCharCodes((charCode) => {
            switch (charCode) {
              case CHARS.NEW_LINE:
                if (foundNewLine) {
                  return false;
                } else {
                  foundNewLine = true;
                }
                break;
              case CHARS.CARRIAGE_RETURN:
                return void 0;
              case CHARS.OPEN_BRACE:
                return true;
              default:
                return false;
            }
          });
        }
      }
      /** @internal */
      _updateInternalState(str) {
        for (let i = 0; i < str.length; i++) {
          const currentChar = str.charCodeAt(i);
          if (!isCharToHandle.has(currentChar)) {
            continue;
          }
          const pastChar = i === 0 ? this._getLastCharCodeWithOffset(0) : str.charCodeAt(i - 1);
          const pastPastChar = i === 0 ? this._getLastCharCodeWithOffset(1) : i === 1 ? this._getLastCharCodeWithOffset(0) : str.charCodeAt(i - 2);
          if (this._isInRegEx) {
            if (pastChar === CHARS.FORWARD_SLASH && pastPastChar !== CHARS.BACK_SLASH || pastChar === CHARS.NEW_LINE) {
              this._isInRegEx = false;
            } else {
              continue;
            }
          } else if (!this.isInString() && !this.isInComment() && isRegExStart(currentChar, pastChar, pastPastChar)) {
            this._isInRegEx = true;
            continue;
          }
          if (this._currentCommentChar == null && pastChar === CHARS.FORWARD_SLASH && currentChar === CHARS.FORWARD_SLASH) {
            this._currentCommentChar = CommentChar.Line;
          } else if (this._currentCommentChar == null && pastChar === CHARS.FORWARD_SLASH && currentChar === CHARS.ASTERISK) {
            this._currentCommentChar = CommentChar.Star;
          } else if (this._currentCommentChar === CommentChar.Star && pastChar === CHARS.ASTERISK && currentChar === CHARS.FORWARD_SLASH) {
            this._currentCommentChar = void 0;
          }
          if (this.isInComment()) {
            continue;
          }
          const lastStringCharOnStack = this._stringCharStack.length === 0 ? void 0 : this._stringCharStack[this._stringCharStack.length - 1];
          if (pastChar !== CHARS.BACK_SLASH && (currentChar === CHARS.DOUBLE_QUOTE || currentChar === CHARS.SINGLE_QUOTE || currentChar === CHARS.BACK_TICK)) {
            if (lastStringCharOnStack === currentChar) {
              this._stringCharStack.pop();
            } else if (lastStringCharOnStack === CHARS.OPEN_BRACE || lastStringCharOnStack === void 0) {
              this._stringCharStack.push(currentChar);
            }
          } else if (pastPastChar !== CHARS.BACK_SLASH && pastChar === CHARS.DOLLAR_SIGN && currentChar === CHARS.OPEN_BRACE && lastStringCharOnStack === CHARS.BACK_TICK) {
            this._stringCharStack.push(currentChar);
          } else if (currentChar === CHARS.CLOSE_BRACE && lastStringCharOnStack === CHARS.OPEN_BRACE) {
            this._stringCharStack.pop();
          }
        }
      }
      /** @internal - This is private, but exposed for testing. */
      _getLastCharCodeWithOffset(offset) {
        if (offset >= this._length || offset < 0) {
          return void 0;
        }
        for (let i = this._texts.length - 1; i >= 0; i--) {
          const currentText = this._texts[i];
          if (offset >= currentText.length) {
            offset -= currentText.length;
          } else {
            return currentText.charCodeAt(currentText.length - 1 - offset);
          }
        }
        return void 0;
      }
      /** @internal */
      _writeIndentation() {
        const flooredIndentation = Math.floor(this._currentIndentation);
        this._internalWrite(this._indentationText.repeat(flooredIndentation));
        const overflow = this._currentIndentation - flooredIndentation;
        if (this._useTabs) {
          if (overflow > 0.5) {
            this._internalWrite(this._indentationText);
          }
        } else {
          const portion = Math.round(this._indentationText.length * overflow);
          let text = "";
          for (let i = 0; i < portion; i++) {
            text += this._indentationText[i];
          }
          this._internalWrite(text);
        }
      }
      /** @internal */
      _newLineIfNewLineOnNextWrite() {
        if (!this._newLineOnNextWrite) {
          return;
        }
        this._newLineOnNextWrite = false;
        this.newLine();
      }
      /** @internal */
      _internalWrite(text) {
        if (text.length === 0) {
          return;
        }
        this._texts.push(text);
        this._length += text.length;
      }
      /** @internal */
      _getIndentationLevelFromArg(countOrText) {
        if (typeof countOrText === "number") {
          if (countOrText < 0) {
            throw new Error("Passed in indentation level should be greater than or equal to 0.");
          }
          return countOrText;
        } else if (typeof countOrText === "string") {
          if (!_CodeBlockWriter._spacesOrTabsRegEx.test(countOrText)) {
            throw new Error("Provided string must be empty or only contain spaces or tabs.");
          }
          const { spacesCount, tabsCount } = getSpacesAndTabsCount(countOrText);
          return tabsCount + spacesCount / this._indentNumberOfSpaces;
        } else {
          throw new Error("Argument provided must be a string or number.");
        }
      }
      /** @internal */
      _setIndentationState(state) {
        this._currentIndentation = state.current;
        this._queuedIndentation = state.queued;
        this._queuedOnlyIfNotBlock = state.queuedOnlyIfNotBlock;
      }
      /** @internal */
      _getIndentationState() {
        return {
          current: this._currentIndentation,
          queued: this._queuedIndentation,
          queuedOnlyIfNotBlock: this._queuedOnlyIfNotBlock
        };
      }
    };
    Object.defineProperty(CodeBlockWriter, "_newLineRegEx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /\r?\n/
    });
    Object.defineProperty(CodeBlockWriter, "_spacesOrTabsRegEx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /^[ \t]*$/
    });
  }
});

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
function generateNewWriter() {
  return new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2
  });
}
function generateGroupName(node) {
  const groupHasGenericName = /^Group\s\d+$/.test(node.name);
  if (!groupHasGenericName)
    return node.name;
  let childName = "";
  node.findAll((child) => {
    if (childName)
      return false;
    if (child.type === "TEXT")
      childName = child.name;
    return false;
  });
  return childName || node.name;
}
function normalizeString(str) {
  return str.trim().replace(/[^a-zA-Z0-9]/g, "_");
}
function matchElementThatNavigateOnClick(params) {
  const { mutableInteractiveNodes, node, parentFrame } = params;
  if (!("reactions" in node))
    return;
  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue;
    if (reaction.trigger.type !== "ON_CLICK")
      continue;
    if (!reaction.action)
      continue;
    if (reaction.action.type !== "NODE")
      continue;
    if (reaction.action.navigation !== "NAVIGATE")
      continue;
    if (!reaction.action.destinationId)
      continue;
    mutableInteractiveNodes.push({
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name
    });
    break;
  }
}
function matchElementThatNavigateOnDrag(params) {
  const { mutableInteractiveNodes, node, parentFrame } = params;
  if (!("reactions" in node))
    return;
  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue;
    if (reaction.trigger.type !== "ON_DRAG")
      continue;
    if (!reaction.action)
      continue;
    if (reaction.action.type !== "NODE")
      continue;
    if (reaction.action.navigation !== "NAVIGATE")
      continue;
    if (!reaction.action.destinationId)
      continue;
    mutableInteractiveNodes.push({
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name
    });
    break;
  }
}
function matchElementThatNavigateOnMouseEvent(params) {
  const { mutableInteractiveNodes, node, parentFrame } = params;
  if (!("reactions" in node))
    return;
  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue;
    if (reaction.trigger.type !== "MOUSE_ENTER" && reaction.trigger.type !== "MOUSE_LEAVE" && reaction.trigger.type !== "MOUSE_UP" && reaction.trigger.type !== "MOUSE_DOWN")
      continue;
    if (!reaction.action)
      continue;
    if (reaction.action.type !== "NODE")
      continue;
    if (reaction.action.navigation !== "NAVIGATE")
      continue;
    if (!reaction.action.destinationId)
      continue;
    const navigationNode = {
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name
    };
    if (reaction.trigger.delay > 0) {
      navigationNode.delay = reaction.trigger.delay * 1e3;
    }
    mutableInteractiveNodes.push(navigationNode);
  }
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_mod();
    init_types();
  }
});

// src/generators.ts
function createXStateV4StateMachineOptions(params) {
  const {
    writer,
    figmaAgnosticDescriptor: { simplifiedFrames, interactiveNodes, pageName }
  } = params;
  const firstFrame = simplifiedFrames[0];
  if (!firstFrame) {
    throw new Error("The document contains no frames.");
  }
  writer.block(() => {
    const machineId = normalizeString(pageName);
    writer.write("id:").space().quote().write(machineId).quote().write(",").newLine();
    writer.write("initial:").space().quote().write(normalizeString(firstFrame.name)).quote().write(",").newLine();
    writer.write("states:").block(() => {
      for (const simplifiedFrame of simplifiedFrames) {
        const frameStateId = normalizeString(simplifiedFrame.name);
        writer.write(frameStateId).write(":").inlineBlock(() => {
          const childNodesThatNavigate = interactiveNodes.filter(
            // TODO: support nested nodes
            (element) => element.parentFrameId === simplifiedFrame.id
          );
          const noMachineEvents = childNodesThatNavigate.length === 0;
          if (noMachineEvents) {
            writer.writeLine("type: 'final'");
            return;
          }
          const childNodesThatNavigateWithDelay = childNodesThatNavigate.filter(
            (node) => "delay" in node
          );
          const childNodesThatNavigateWithoutDelay = childNodesThatNavigate.filter(
            (node) => !("delay" in node)
          );
          const delayedEvents = childNodesThatNavigateWithDelay.map((childNodeThatNavigate) => {
            const eventName = normalizeString(
              `${childNodeThatNavigate.triggerType}_${childNodeThatNavigate.generatedName.toUpperCase()}`
            );
            const delay = (
              // @ts-expect-error TS does not kno the proper triggerType because types are not enough narrowed down in `childNodesThatNavigateWithDelay` definition
              childNodeThatNavigate.delay
            );
            const destinationFrame = simplifiedFrames.find(
              ({ id }) => childNodeThatNavigate.destinationFrameId === id
            );
            if (!destinationFrame)
              throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`);
            return {
              delay,
              eventName,
              destinationFrame,
              destinationStateName: `${eventName}_AFTER_${delay}`
            };
          });
          writer.write("on:").block(() => {
            for (const childNodeThatNavigate of childNodesThatNavigateWithoutDelay) {
              const destinationFrame = simplifiedFrames.find(
                ({ id }) => childNodeThatNavigate.destinationFrameId === id
              );
              if (!destinationFrame)
                throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`);
              const eventName = normalizeString(
                `${childNodeThatNavigate.triggerType}_${childNodeThatNavigate.generatedName.toUpperCase()}`
              );
              writer.write(eventName).write(":").space().quote();
              writer.write(normalizeString(destinationFrame.name)).quote();
              writer.write(",").newLine();
            }
            for (const delayedEvent of delayedEvents) {
              const { eventName, destinationStateName } = delayedEvent;
              writer.write(eventName).write(":").space().quote();
              writer.write(`#${frameStateId}.${destinationStateName}`).quote().write(",").newLine();
            }
          });
          if (childNodesThatNavigateWithoutDelay.length && childNodesThatNavigateWithDelay.length) {
            writer.write(",").newLine();
          }
          if (childNodesThatNavigateWithDelay.length) {
            writer.write("id:").space().quote().write(frameStateId).quote().write(",").newLine();
            writer.write("initial:").space().quote().write("idle").quote().write(",").newLine();
            writer.write("states:").block(() => {
              writer.write("idle:").inlineBlock(() => {
              }).write(",").newLine();
              for (const delayedEvent of delayedEvents) {
                const { destinationStateName, delay, destinationFrame } = delayedEvent;
                const destinationFrameName = `#${machineId}.${normalizeString(
                  destinationFrame.name
                )}`;
                writer.write(destinationStateName).write(":").inlineBlock(() => {
                  writer.write("after:").block(() => {
                    writer.write(delay.toString()).write(":").space().quote();
                    writer.write(destinationFrameName).quote().write(",").newLine();
                  });
                }).write(",").newLine();
              }
            });
          }
        }).write(",").newLine();
      }
    });
  });
  return writer;
}
function createXStateV4Machine(params) {
  createXStateV4StateMachineOptions(params);
}
var init_generators = __esm({
  "src/generators.ts"() {
    "use strict";
    init_utils();
  }
});

// src/traverse.ts
function traversePage(params) {
  const {
    figmaAgnosticDescriptor: {
      simplifiedFrames: mutableSimplifiedFrames,
      interactiveNodes: mutableInteractiveNodes
    }
  } = params;
  const { skipInvisibleInstanceChildren } = figma;
  figma.skipInvisibleInstanceChildren = true;
  let parentFrame;
  figma.currentPage.findAll((node) => {
    if (isFrame(node)) {
      mutableSimplifiedFrames.push({ id: node.id, name: node.name });
      parentFrame = node;
    }
    matchElementThatNavigateOnDrag({ mutableInteractiveNodes, node, parentFrame });
    matchElementThatNavigateOnClick({ mutableInteractiveNodes, node, parentFrame });
    matchElementThatNavigateOnMouseEvent({ mutableInteractiveNodes, node, parentFrame });
    return false;
  });
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildren;
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
  default: () => main
});
function main() {
  const figmaAgnosticDescriptor = {
    pageName: figma.currentPage.name,
    simplifiedFrames: [],
    interactiveNodes: []
  };
  traversePage({ figmaAgnosticDescriptor });
  const writer = generateNewWriter();
  const generatorOptions = {
    writer,
    figmaAgnosticDescriptor
  };
  console.log("generatorOptions", JSON.stringify(generatorOptions), null, 2);
  createXStateV4Machine(generatorOptions);
  console.log(writer.toString());
  figma.closePlugin("Hello, world!");
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_generators();
    init_traverse();
    init_utils();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
