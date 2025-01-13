ace.define(
  "ace/ext/hardwrap",
  ["require", "exports", "module", "ace/range", "ace/editor", "ace/config"],
  function (e, t, n) {
    "use strict";
    var r = e("../range").Range;
    function o(e, t) {
      for (
        var n = t.column || e.getOption("printMarginColumn"),
          o = 0 != t.allowMerge,
          i = Math.min(t.startRow, t.endRow),
          a = Math.max(t.startRow, t.endRow),
          s = e.session;
        i <= a;

      ) {
        var c = s.getLine(i);
        if (c.length > n) {
          if ((h = g(c, n, 5))) {
            var l = /^\s*/.exec(c)[0];
            s.replace(new r(i, h.start, i, h.end), "\n" + l);
          }
          a++;
        } else if (o && /\S/.test(c) && i != a) {
          var u = s.getLine(i + 1);
          if (u && /\S/.test(u)) {
            var h,
              d = c.replace(/\s+$/, ""),
              p = u.replace(/^\s+/, ""),
              f = d + " " + p;
            if (((h = g(f, n, 5)) && h.start > d.length) || f.length < n) {
              var m = new r(i, d.length, i + 1, u.length - p.length);
              s.replace(m, " "), i--, a--;
            } else
              d.length < c.length && s.remove(new r(i, d.length, i, c.length));
          }
        }
        i++;
      }
      function g(e, t, n) {
        if (!(e.length < t)) {
          var r = e.slice(0, t),
            o = e.slice(t),
            i = /^(?:(\s+)|(\S+)(\s+))/.exec(o),
            a = /(?:(\s+)|(\s+)(\S+))$/.exec(r),
            s = 0,
            c = 0;
          return (
            a && !a[2] && ((s = t - a[1].length), (c = t)),
            i && !i[2] && (s || (s = t), (c = t + i[1].length)),
            s
              ? { start: s, end: c }
              : a && a[2] && a.index > n
              ? { start: a.index, end: a.index + a[2].length }
              : i && i[2]
              ? { start: (s = t + i[2].length), end: s + i[3].length }
              : void 0
          );
        }
      }
    }
    function i(e) {
      if ("insertstring" == e.command.name && /\S/.test(e.args)) {
        var t = e.editor,
          n = t.selection.cursor;
        if (n.column <= t.renderer.$printMarginColumn) return;
        var r = t.session.$undoManager.$lastDelta;
        o(t, { startRow: n.row, endRow: n.row, allowMerge: !1 }),
          r != t.session.$undoManager.$lastDelta && t.session.markUndoGroup();
      }
    }
    var a = e("../editor").Editor;
    e("../config").defineOptions(a.prototype, "editor", {
      hardWrap: {
        set: function (e) {
          e
            ? this.commands.on("afterExec", i)
            : this.commands.off("afterExec", i);
        },
        value: !1,
      },
    }),
      (t.hardWrap = o);
  }
),
  ace.define(
    "ace/keyboard/vim",
    [
      "require",
      "exports",
      "module",
      "ace/range",
      "ace/lib/event_emitter",
      "ace/lib/dom",
      "ace/lib/oop",
      "ace/lib/keys",
      "ace/lib/event",
      "ace/search",
      "ace/lib/useragent",
      "ace/search_highlight",
      "ace/commands/multi_select_commands",
      "ace/mode/text",
      "ace/ext/hardwrap",
      "ace/multi_select",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../range").Range,
        o = e("../lib/event_emitter").EventEmitter,
        i = e("../lib/dom"),
        a = e("../lib/oop"),
        s = e("../lib/keys"),
        c = e("../lib/event"),
        l = e("../search").Search,
        u = e("../lib/useragent"),
        h = e("../search_highlight").SearchHighlight,
        d = e("../commands/multi_select_commands"),
        p = e("../mode/text").Mode.prototype.tokenRe,
        f = e("../ext/hardwrap").hardWrap;
      e("../multi_select");
      var m = function (e) {
        (this.ace = e),
          (this.state = {}),
          (this.marks = {}),
          (this.options = {}),
          (this.$uid = 0),
          (this.onChange = this.onChange.bind(this)),
          (this.onSelectionChange = this.onSelectionChange.bind(this)),
          (this.onBeforeEndOperation = this.onBeforeEndOperation.bind(this)),
          this.ace.on("change", this.onChange),
          this.ace.on("changeSelection", this.onSelectionChange),
          this.ace.on("beforeEndOperation", this.onBeforeEndOperation);
      };
      function g(e) {
        return { row: e.line, column: e.ch };
      }
      function v(e) {
        return new y(e.row, e.column);
      }
      (m.Pos = function (e, t) {
        if (!(this instanceof y)) return new y(e, t);
        (this.line = e), (this.ch = t);
      }),
        (m.defineOption = function (e, t, n) {}),
        (m.commands = {
          redo: function (e) {
            e.ace.redo();
          },
          undo: function (e) {
            e.ace.undo();
          },
          newlineAndIndent: function (e) {
            e.ace.insert("\n");
          },
          goLineLeft: function (e) {
            e.ace.selection.moveCursorLineStart();
          },
          goLineRight: function (e) {
            e.ace.selection.moveCursorLineEnd();
          },
        }),
        (m.keyMap = {}),
        (m.addClass = m.rmClass = function () {}),
        (m.e_stop = m.e_preventDefault = c.stopEvent),
        (m.keyName = function (e) {
          var t = s[e.keyCode] || e.key || "";
          return (
            1 == t.length && (t = t.toUpperCase()),
            (t =
              c.getModifierString(e).replace(/(^|-)\w/g, function (e) {
                return e.toUpperCase();
              }) + t)
          );
        }),
        (m.keyMap.default = function (e) {
          return function (t) {
            var n = t.ace.commands.commandKeyBinding[e.toLowerCase()];
            return n && !1 !== t.ace.execCommand(n);
          };
        }),
        (m.lookupKey = function e(t, n, r) {
          n || (n = "default"), "string" == typeof n && (n = m.keyMap[n]);
          var o = "function" == typeof n ? n(t) : n[t];
          if (!1 === o) return "nothing";
          if ("..." === o) return "multi";
          if (null != o && r(o)) return "handled";
          if (n.fallthrough) {
            if (!Array.isArray(n.fallthrough)) return e(t, n.fallthrough, r);
            for (var i = 0; i < n.fallthrough.length; i++) {
              var a = e(t, n.fallthrough[i], r);
              if (a) return a;
            }
          }
        }),
        (m.findMatchingTag = function (e, t) {
          return e.findMatchingTag(t);
        }),
        (m.findEnclosingTag = function (e, t) {}),
        (m.signal = function (e, t, n) {
          return e._signal(t, n);
        }),
        (m.on = c.addListener),
        (m.off = c.removeListener),
        (m.isWordChar = function (e) {
          return e < "\x7f" ? /^\w$/.test(e) : ((p.lastIndex = 0), p.test(e));
        }),
        function () {
          a.implement(m.prototype, o),
            (this.destroy = function () {
              this.ace.off("change", this.onChange),
                this.ace.off("changeSelection", this.onSelectionChange),
                this.ace.off("beforeEndOperation", this.onBeforeEndOperation),
                this.removeOverlay();
            }),
            (this.virtualSelectionMode = function () {
              return (
                this.ace.inVirtualSelectionMode && this.ace.selection.index
              );
            }),
            (this.onChange = function (e) {
              var t = { text: "i" == e.action[0] ? e.lines : [] },
                n = (this.curOp = this.curOp || {});
              n.changeHandlers ||
                (n.changeHandlers =
                  this._eventRegistry.change &&
                  this._eventRegistry.change.slice()),
                n.lastChange
                  ? (n.lastChange.next = n.lastChange = t)
                  : (n.lastChange = n.change = t),
                this.$updateMarkers(e);
            }),
            (this.onSelectionChange = function () {
              var e = (this.curOp = this.curOp || {});
              e.cursorActivityHandlers ||
                (e.cursorActivityHandlers =
                  this._eventRegistry.cursorActivity &&
                  this._eventRegistry.cursorActivity.slice()),
                (this.curOp.cursorActivity = !0),
                this.ace.inMultiSelectMode &&
                  this.ace.keyBinding.removeKeyboardHandler(d.keyboardHandler);
            }),
            (this.operation = function (e, t) {
              if ((!t && this.curOp) || (t && this.curOp && this.curOp.force))
                return e();
              if (
                ((!t && this.ace.curOp) ||
                  (this.curOp && this.onBeforeEndOperation()),
                !this.ace.curOp)
              ) {
                var n = this.ace.prevOp;
                this.ace.startOperation({
                  command: { name: "vim", scrollIntoView: "cursor" },
                });
              }
              var r = (this.curOp = this.curOp || {});
              this.curOp.force = t;
              var o = e();
              return (
                this.ace.curOp &&
                  "vim" == this.ace.curOp.command.name &&
                  (this.state.dialog &&
                    (this.ace.curOp.command.scrollIntoView =
                      this.ace.curOp.vimDialogScroll),
                  this.ace.endOperation(),
                  r.cursorActivity ||
                    r.lastChange ||
                    !n ||
                    (this.ace.prevOp = n)),
                (!t && this.ace.curOp) ||
                  (this.curOp && this.onBeforeEndOperation()),
                o
              );
            }),
            (this.onBeforeEndOperation = function () {
              var e = this.curOp;
              e &&
                (e.change && this.signal("change", e.change, e),
                e && e.cursorActivity && this.signal("cursorActivity", null, e),
                (this.curOp = null));
            }),
            (this.signal = function (e, t, n) {
              var r = n ? n[e + "Handlers"] : (this._eventRegistry || {})[e];
              if (r) {
                r = r.slice();
                for (var o = 0; o < r.length; o++) r[o](this, t);
              }
            }),
            (this.firstLine = function () {
              return 0;
            }),
            (this.lastLine = function () {
              return this.ace.session.getLength() - 1;
            }),
            (this.lineCount = function () {
              return this.ace.session.getLength();
            }),
            (this.setCursor = function (e, t) {
              "object" === typeof e && ((t = e.ch), (e = e.line));
              var n = !this.curOp && !this.ace.inVirtualSelectionMode;
              this.ace.inVirtualSelectionMode || this.ace.exitMultiSelectMode(),
                this.ace.session.unfold({ row: e, column: t }),
                this.ace.selection.moveTo(e, t),
                n &&
                  (this.ace.renderer.scrollCursorIntoView(),
                  this.ace.endOperation());
            }),
            (this.getCursor = function (e) {
              var t = this.ace.selection;
              return v(
                "anchor" == e
                  ? t.isEmpty()
                    ? t.lead
                    : t.anchor
                  : "head" != e && e
                  ? t.getRange()[e]
                  : t.lead
              );
            }),
            (this.listSelections = function (e) {
              var t = this.ace.multiSelect.rangeList.ranges;
              return !t.length || this.ace.inVirtualSelectionMode
                ? [
                    {
                      anchor: this.getCursor("anchor"),
                      head: this.getCursor("head"),
                    },
                  ]
                : t.map(function (e) {
                    return {
                      anchor: this.clipPos(
                        v(e.cursor == e.end ? e.start : e.end)
                      ),
                      head: this.clipPos(v(e.cursor)),
                    };
                  }, this);
            }),
            (this.setSelections = function (e, t) {
              var n = this.ace.multiSelect,
                o = e.map(function (e) {
                  var t = g(e.anchor),
                    n = g(e.head),
                    o =
                      r.comparePoints(t, n) < 0
                        ? new r.fromPoints(t, n)
                        : new r.fromPoints(n, t);
                  return (
                    (o.cursor = r.comparePoints(o.start, n) ? o.end : o.start),
                    o
                  );
                });
              if (this.ace.inVirtualSelectionMode)
                this.ace.selection.fromOrientedRange(o[0]);
              else {
                t ? o[t] && o.push(o.splice(t, 1)[0]) : (o = o.reverse()),
                  n.toSingleRange(o[0].clone());
                for (var i = this.ace.session, a = 0; a < o.length; a++) {
                  var s = i.$clipRangeToDocument(o[a]);
                  n.addRange(s);
                }
              }
            }),
            (this.setSelection = function (e, t, n) {
              var r = this.ace.selection;
              r.moveTo(e.line, e.ch),
                r.selectTo(t.line, t.ch),
                n && "*mouse" == n.origin && this.onBeforeEndOperation();
            }),
            (this.somethingSelected = function (e) {
              return !this.ace.selection.isEmpty();
            }),
            (this.clipPos = function (e) {
              return v(this.ace.session.$clipPositionToDocument(e.line, e.ch));
            }),
            (this.foldCode = function (e) {
              this.ace.session.$toggleFoldWidget(e.line, {});
            }),
            (this.markText = function (e) {
              return { clear: function () {}, find: function () {} };
            }),
            (this.$updateMarkers = function (e) {
              var t = "insert" == e.action,
                n = e.start,
                o = e.end,
                i = (o.row - n.row) * (t ? 1 : -1),
                a = (o.column - n.column) * (t ? 1 : -1);
              for (var s in (t && (o = n), this.marks)) {
                var c = this.marks[s],
                  l = r.comparePoints(c, n);
                if (!(l < 0)) {
                  if (0 === l && t) {
                    if (1 != c.bias) {
                      c.bias = -1;
                      continue;
                    }
                    l = 1;
                  }
                  var u = t ? l : r.comparePoints(c, o);
                  u > 0
                    ? ((c.row += i), (c.column += c.row == o.row ? a : 0))
                    : !t &&
                      u <= 0 &&
                      ((c.row = n.row),
                      (c.column = n.column),
                      0 === u && (c.bias = 1));
                }
              }
            });
          var e = function (e, t, n, r) {
            (this.cm = e),
              (this.id = t),
              (this.row = n),
              (this.column = r),
              (e.marks[this.id] = this);
          };
          (e.prototype.clear = function () {
            delete this.cm.marks[this.id];
          }),
            (e.prototype.find = function () {
              return v(this);
            }),
            (this.setBookmark = function (t, n) {
              var r = new e(this, this.$uid++, t.line, t.ch);
              return (
                (n && n.insertLeft) || (r.$insertRight = !0),
                (this.marks[r.id] = r),
                r
              );
            }),
            (this.moveH = function (e, t) {
              if ("char" == t) {
                var n = this.ace.selection;
                n.clearSelection(), n.moveCursorBy(0, e);
              }
            }),
            (this.findPosV = function (e, t, n, r) {
              if ("page" == n) {
                var o = this.ace.renderer.layerConfig;
                (t *= Math.floor(o.height / o.lineHeight)), (n = "line");
              }
              if ("line" == n) {
                var i = this.ace.session.documentToScreenPosition(e.line, e.ch);
                return (
                  null != r && (i.column = r),
                  (i.row += t),
                  (i.row = Math.min(
                    Math.max(0, i.row),
                    this.ace.session.getScreenLength() - 1
                  )),
                  v(this.ace.session.screenToDocumentPosition(i.row, i.column))
                );
              }
            }),
            (this.charCoords = function (e, t) {
              if ("div" == t || !t)
                return {
                  left: (r = this.ace.session.documentToScreenPosition(
                    e.line,
                    e.ch
                  )).column,
                  top: r.row,
                };
              if ("local" == t) {
                var n = this.ace.renderer,
                  r = this.ace.session.documentToScreenPosition(e.line, e.ch),
                  o = n.layerConfig.lineHeight,
                  i = n.layerConfig.characterWidth,
                  a = o * r.row;
                return { left: r.column * i, top: a, bottom: a + o };
              }
            }),
            (this.coordsChar = function (e, t) {
              var n = this.ace.renderer;
              if ("local" == t) {
                var r = Math.max(0, Math.floor(e.top / n.lineHeight)),
                  o = Math.max(0, Math.floor(e.left / n.characterWidth));
                return v(n.session.screenToDocumentPosition(r, o));
              }
              if ("div" == t) throw "not implemented";
            }),
            (this.getSearchCursor = function (e, t, n) {
              var r = !1,
                o = !1;
              e instanceof RegExp &&
                !e.global &&
                ((r = !e.ignoreCase), (e = e.source), (o = !0)),
                "\\n" == e && ((e = "\n"), (o = !1));
              var i = new l();
              void 0 == t.ch && (t.ch = Number.MAX_VALUE);
              var a = { row: t.line, column: t.ch },
                s = this,
                c = null;
              return {
                findNext: function () {
                  return this.find(!1);
                },
                findPrevious: function () {
                  return this.find(!0);
                },
                find: function (t) {
                  i.setOptions({
                    needle: e,
                    caseSensitive: r,
                    wrap: !1,
                    backwards: t,
                    regExp: o,
                    start: c || a,
                  });
                  var n = i.find(s.ace.session);
                  return (c = n) && [!c.isEmpty()];
                },
                from: function () {
                  return c && v(c.start);
                },
                to: function () {
                  return c && v(c.end);
                },
                replace: function (e) {
                  c && (c.end = s.ace.session.doc.replace(c, e));
                },
              };
            }),
            (this.scrollTo = function (e, t) {
              var n = this.ace.renderer,
                r = n.layerConfig,
                o = r.maxHeight;
              (o -= (n.$size.scrollerHeight - n.lineHeight) * n.$scrollPastEnd),
                null != t &&
                  this.ace.session.setScrollTop(Math.max(0, Math.min(t, o))),
                null != e &&
                  this.ace.session.setScrollLeft(
                    Math.max(0, Math.min(e, r.width))
                  );
            }),
            (this.scrollInfo = function () {
              return 0;
            }),
            (this.scrollIntoView = function (e, t) {
              if (e) {
                var n = this.ace.renderer,
                  r = { top: 0, bottom: t };
                n.scrollCursorIntoView(
                  g(e),
                  (2 * n.lineHeight) / n.$size.scrollerHeight,
                  r
                );
              }
            }),
            (this.getLine = function (e) {
              return this.ace.session.getLine(e);
            }),
            (this.getRange = function (e, t) {
              return this.ace.session.getTextRange(
                new r(e.line, e.ch, t.line, t.ch)
              );
            }),
            (this.replaceRange = function (e, t, n) {
              n || (n = t);
              var o = new r(t.line, t.ch, n.line, n.ch);
              return (
                this.ace.session.$clipRangeToDocument(o),
                this.ace.session.replace(o, e)
              );
            }),
            (this.replaceSelection = this.replaceSelections =
              function (e) {
                var t = this.ace.selection;
                if (this.ace.inVirtualSelectionMode)
                  this.ace.session.replace(t.getRange(), e[0] || "");
                else {
                  t.inVirtualSelectionMode = !0;
                  var n = t.rangeList.ranges;
                  n.length || (n = [this.ace.multiSelect.getRange()]);
                  for (var r = n.length; r--; )
                    this.ace.session.replace(n[r], e[r] || "");
                  t.inVirtualSelectionMode = !1;
                }
              }),
            (this.getSelection = function () {
              return this.ace.getSelectedText();
            }),
            (this.getSelections = function () {
              return this.listSelections().map(function (e) {
                return this.getRange(e.anchor, e.head);
              }, this);
            }),
            (this.getInputField = function () {
              return this.ace.textInput.getElement();
            }),
            (this.getWrapperElement = function () {
              return this.ace.container;
            });
          var t = {
            indentWithTabs: "useSoftTabs",
            indentUnit: "tabSize",
            tabSize: "tabSize",
            firstLineNumber: "firstLineNumber",
            readOnly: "readOnly",
          };
          (this.setOption = function (e, n) {
            switch (((this.state[e] = n), e)) {
              case "indentWithTabs":
                (e = t[e]), (n = !n);
                break;
              case "keyMap":
                return void (this.state.$keyMap = n);
              default:
                e = t[e];
            }
            e && this.ace.setOption(e, n);
          }),
            (this.getOption = function (e) {
              var n,
                r = t[e];
              switch ((r && (n = this.ace.getOption(r)), e)) {
                case "indentWithTabs":
                  return (e = t[e]), !n;
                case "keyMap":
                  return this.state.$keyMap || "vim";
              }
              return r ? n : this.state[e];
            }),
            (this.toggleOverwrite = function (e) {
              return (this.state.overwrite = e), this.ace.setOverwrite(e);
            }),
            (this.addOverlay = function (e) {
              if (!this.$searchHighlight || !this.$searchHighlight.session) {
                var t = new h(null, "ace_highlight-marker", "text"),
                  n = this.ace.session.addDynamicMarker(t);
                (t.id = n.id),
                  (t.session = this.ace.session),
                  (t.destroy = function (e) {
                    t.session.off("change", t.updateOnChange),
                      t.session.off("changeEditor", t.destroy),
                      t.session.removeMarker(t.id),
                      (t.session = null);
                  }),
                  (t.updateOnChange = function (e) {
                    var n = e.start.row;
                    n == e.end.row
                      ? (t.cache[n] = void 0)
                      : t.cache.splice(n, t.cache.length);
                  }),
                  t.session.on("changeEditor", t.destroy),
                  t.session.on("change", t.updateOnChange);
              }
              var r = new RegExp(e.query.source, "gmi");
              (this.$searchHighlight = e.highlight = t),
                this.$searchHighlight.setRegexp(r),
                this.ace.renderer.updateBackMarkers();
            }),
            (this.removeOverlay = function (e) {
              this.$searchHighlight &&
                this.$searchHighlight.session &&
                this.$searchHighlight.destroy();
            }),
            (this.getScrollInfo = function () {
              var e = this.ace.renderer,
                t = e.layerConfig;
              return {
                left: e.scrollLeft,
                top: e.scrollTop,
                height: t.maxHeight,
                width: t.width,
                clientHeight: t.height,
                clientWidth: t.width,
              };
            }),
            (this.getValue = function () {
              return this.ace.getValue();
            }),
            (this.setValue = function (e) {
              return this.ace.setValue(e, -1);
            }),
            (this.getTokenTypeAt = function (e) {
              var t = this.ace.session.getTokenAt(e.line, e.ch);
              return t && /comment|string/.test(t.type) ? "string" : "";
            }),
            (this.findMatchingBracket = function (e) {
              var t = this.ace.session.findMatchingBracket(g(e));
              return { to: t && v(t) };
            }),
            (this.findMatchingTag = function (e) {
              var t = this.ace.session.getMatchingTags(g(e));
              if (t)
                return {
                  open: { from: v(t.openTag.start), to: v(t.openTag.end) },
                  close: { from: v(t.closeTag.start), to: v(t.closeTag.end) },
                };
            }),
            (this.indentLine = function (e, t) {
              !0 === t
                ? this.ace.session.indentRows(e, e, "\t")
                : !1 === t && this.ace.session.outdentRows(new r(e, 0, e, 0));
            }),
            (this.indexFromPos = function (e) {
              return this.ace.session.doc.positionToIndex(g(e));
            }),
            (this.posFromIndex = function (e) {
              return v(this.ace.session.doc.indexToPosition(e));
            }),
            (this.focus = function (e) {
              return this.ace.textInput.focus();
            }),
            (this.blur = function (e) {
              return this.ace.blur();
            }),
            (this.defaultTextHeight = function (e) {
              return this.ace.renderer.layerConfig.lineHeight;
            }),
            (this.scanForBracket = function (e, t, n, r) {
              var o = r.bracketRegex.source,
                i = /paren|text|operator|tag/;
              if (1 == t)
                var a = this.ace.session.$findClosingBracket(
                  o.slice(1, 2),
                  g(e),
                  i
                );
              else
                a = this.ace.session.$findOpeningBracket(
                  o.slice(-2, -1),
                  { row: e.line, column: e.ch + 1 },
                  i
                );
              return a && { pos: v(a) };
            }),
            (this.refresh = function () {
              return this.ace.resize(!0);
            }),
            (this.getMode = function () {
              return { name: this.getOption("mode") };
            }),
            (this.execCommand = function (e) {
              return m.commands.hasOwnProperty(e)
                ? m.commands[e](this)
                : "indentAuto" == e
                ? this.ace.execCommand("autoindent")
                : void console.log(e + " is not implemented");
            }),
            (this.getLineNumber = function (e) {
              return e.row;
            }),
            (this.getLineHandle = function (e) {
              return { text: this.ace.session.getLine(e), row: e };
            });
        }.call(m.prototype),
        ((m.StringStream = function (e, t) {
          (this.pos = this.start = 0),
            (this.string = e),
            (this.tabSize = t || 8),
            (this.lastColumnPos = this.lastColumnValue = 0),
            (this.lineStart = 0);
        }).prototype = {
          eol: function () {
            return this.pos >= this.string.length;
          },
          sol: function () {
            return this.pos == this.lineStart;
          },
          peek: function () {
            return this.string.charAt(this.pos) || void 0;
          },
          next: function () {
            if (this.pos < this.string.length)
              return this.string.charAt(this.pos++);
          },
          eat: function (e) {
            var t = this.string.charAt(this.pos);
            if ("string" == typeof e) var n = t == e;
            else n = t && (e.test ? e.test(t) : e(t));
            if (n) return ++this.pos, t;
          },
          eatWhile: function (e) {
            for (var t = this.pos; this.eat(e); );
            return this.pos > t;
          },
          eatSpace: function () {
            for (
              var e = this.pos;
              /[\s\u00a0]/.test(this.string.charAt(this.pos));

            )
              ++this.pos;
            return this.pos > e;
          },
          skipToEnd: function () {
            this.pos = this.string.length;
          },
          skipTo: function (e) {
            var t = this.string.indexOf(e, this.pos);
            if (t > -1) return (this.pos = t), !0;
          },
          backUp: function (e) {
            this.pos -= e;
          },
          column: function () {
            throw "not implemented";
          },
          indentation: function () {
            throw "not implemented";
          },
          match: function (e, t, n) {
            if ("string" != typeof e) {
              var r = this.string.slice(this.pos).match(e);
              return r && r.index > 0
                ? null
                : (r && !1 !== t && (this.pos += r[0].length), r);
            }
            var o = function (e) {
              return n ? e.toLowerCase() : e;
            };
            if (o(this.string.substr(this.pos, e.length)) == o(e))
              return !1 !== t && (this.pos += e.length), !0;
          },
          current: function () {
            return this.string.slice(this.start, this.pos);
          },
          hideFirstChars: function (e, t) {
            this.lineStart += e;
            try {
              return t();
            } finally {
              this.lineStart -= e;
            }
          },
        }),
        (m.defineExtension = function (e, t) {
          m.prototype[e] = t;
        }),
        i.importCssString(
          ".normal-mode .ace_cursor{\n    border: none;\n    background-color: rgba(255,0,0,0.5);\n}\n.normal-mode .ace_hidden-cursors .ace_cursor{\n  background-color: transparent;\n  border: 1px solid red;\n  opacity: 0.7\n}\n.ace_dialog {\n  position: absolute;\n  left: 0; right: 0;\n  background: inherit;\n  z-index: 15;\n  padding: .1em .8em;\n  overflow: hidden;\n  color: inherit;\n}\n.ace_dialog-top {\n  border-bottom: 1px solid #444;\n  top: 0;\n}\n.ace_dialog-bottom {\n  border-top: 1px solid #444;\n  bottom: 0;\n}\n.ace_dialog input {\n  border: none;\n  outline: none;\n  background: transparent;\n  width: 20em;\n  color: inherit;\n  font-family: monospace;\n}",
          "vimMode",
          !1
        ),
        (function () {
          function e(e, t, n) {
            var r;
            return (
              ((r = e.ace.container.appendChild(
                document.createElement("div")
              )).className = n
                ? "ace_dialog ace_dialog-bottom"
                : "ace_dialog ace_dialog-top"),
              "string" == typeof t ? (r.innerHTML = t) : r.appendChild(t),
              r
            );
          }
          function t(e, t) {
            e.state.currentNotificationClose &&
              e.state.currentNotificationClose(),
              (e.state.currentNotificationClose = t);
          }
          m.defineExtension("openDialog", function (n, r, o) {
            if (!this.virtualSelectionMode()) {
              o || (o = {}), t(this, null);
              var i = e(this, n, o.bottom),
                a = !1,
                s = this;
              this.state.dialog = i;
              var c,
                l = i.getElementsByTagName("input")[0];
              return (
                l
                  ? (o.value &&
                      ((l.value = o.value),
                      !1 !== o.selectValueOnOpen && l.select()),
                    o.onInput &&
                      m.on(l, "input", function (e) {
                        o.onInput(e, l.value, u);
                      }),
                    o.onKeyUp &&
                      m.on(l, "keyup", function (e) {
                        o.onKeyUp(e, l.value, u);
                      }),
                    m.on(l, "keydown", function (e) {
                      (o && o.onKeyDown && o.onKeyDown(e, l.value, u)) ||
                        (13 == e.keyCode && r(l.value),
                        (27 == e.keyCode ||
                          (!1 !== o.closeOnEnter && 13 == e.keyCode)) &&
                          (m.e_stop(e), u()));
                    }),
                    !1 !== o.closeOnBlur && m.on(l, "blur", u),
                    l.focus())
                  : (c = i.getElementsByTagName("button")[0]) &&
                    (m.on(c, "click", function () {
                      u(), s.focus();
                    }),
                    !1 !== o.closeOnBlur && m.on(c, "blur", u),
                    c.focus()),
                u
              );
            }
            function u(e) {
              if ("string" == typeof e) l.value = e;
              else {
                if (a) return;
                if (e && "blur" == e.type && document.activeElement === l)
                  return;
                s.state.dialog == i && ((s.state.dialog = null), s.focus()),
                  (a = !0),
                  i.remove(),
                  o.onClose && o.onClose(i);
                var t = s;
                t.state.vim &&
                  ((t.state.vim.status = null),
                  t.ace._signal("changeStatus"),
                  t.ace.renderer.$loop.schedule(t.ace.renderer.CHANGE_CURSOR));
              }
            }
          }),
            m.defineExtension("openNotification", function (n, r) {
              if (!this.virtualSelectionMode()) {
                t(this, c);
                var o,
                  i = e(this, n, r && r.bottom),
                  a = !1,
                  s = r && "undefined" !== typeof r.duration ? r.duration : 5e3;
                return (
                  m.on(i, "click", function (e) {
                    m.e_preventDefault(e), c();
                  }),
                  s && (o = setTimeout(c, s)),
                  c
                );
              }
              function c() {
                a || ((a = !0), clearTimeout(o), i.remove());
              }
            });
        })();
      var y = m.Pos;
      function C(e, t) {
        var n = e.state.vim;
        if (!n || n.insertMode) return t.head;
        var r = n.sel.head;
        return r
          ? n.visualBlock && t.head.line != r.line
            ? void 0
            : t.from() != t.anchor ||
              t.empty() ||
              t.head.line != r.line ||
              t.head.ch == r.ch
            ? t.head
            : new y(t.head.line, t.head.ch - 1)
          : t.head;
      }
      function k(e, t, n) {
        if (t.line === n.line && t.ch >= n.ch - 1) {
          var r = e.getLine(t.line).charCodeAt(t.ch);
          55296 <= r && r <= 55551 && (n.ch += 1);
        }
        return { start: t, end: n };
      }
      var w = [
          { keys: "<Left>", type: "keyToKey", toKeys: "h" },
          { keys: "<Right>", type: "keyToKey", toKeys: "l" },
          { keys: "<Up>", type: "keyToKey", toKeys: "k" },
          { keys: "<Down>", type: "keyToKey", toKeys: "j" },
          { keys: "g<Up>", type: "keyToKey", toKeys: "gk" },
          { keys: "g<Down>", type: "keyToKey", toKeys: "gj" },
          { keys: "<Space>", type: "keyToKey", toKeys: "l" },
          { keys: "<BS>", type: "keyToKey", toKeys: "h", context: "normal" },
          { keys: "<Del>", type: "keyToKey", toKeys: "x", context: "normal" },
          { keys: "<C-Space>", type: "keyToKey", toKeys: "W" },
          { keys: "<C-BS>", type: "keyToKey", toKeys: "B", context: "normal" },
          { keys: "<S-Space>", type: "keyToKey", toKeys: "w" },
          { keys: "<S-BS>", type: "keyToKey", toKeys: "b", context: "normal" },
          { keys: "<C-n>", type: "keyToKey", toKeys: "j" },
          { keys: "<C-p>", type: "keyToKey", toKeys: "k" },
          { keys: "<C-[>", type: "keyToKey", toKeys: "<Esc>" },
          { keys: "<C-c>", type: "keyToKey", toKeys: "<Esc>" },
          {
            keys: "<C-[>",
            type: "keyToKey",
            toKeys: "<Esc>",
            context: "insert",
          },
          {
            keys: "<C-c>",
            type: "keyToKey",
            toKeys: "<Esc>",
            context: "insert",
          },
          { keys: "<C-Esc>", type: "keyToKey", toKeys: "<Esc>" },
          {
            keys: "<C-Esc>",
            type: "keyToKey",
            toKeys: "<Esc>",
            context: "insert",
          },
          { keys: "s", type: "keyToKey", toKeys: "cl", context: "normal" },
          { keys: "s", type: "keyToKey", toKeys: "c", context: "visual" },
          { keys: "S", type: "keyToKey", toKeys: "cc", context: "normal" },
          { keys: "S", type: "keyToKey", toKeys: "VdO", context: "visual" },
          { keys: "<Home>", type: "keyToKey", toKeys: "0" },
          { keys: "<End>", type: "keyToKey", toKeys: "$" },
          { keys: "<PageUp>", type: "keyToKey", toKeys: "<C-b>" },
          { keys: "<PageDown>", type: "keyToKey", toKeys: "<C-f>" },
          { keys: "<CR>", type: "keyToKey", toKeys: "j^", context: "normal" },
          { keys: "<Ins>", type: "keyToKey", toKeys: "i", context: "normal" },
          {
            keys: "<Ins>",
            type: "action",
            action: "toggleOverwrite",
            context: "insert",
          },
          {
            keys: "H",
            type: "motion",
            motion: "moveToTopLine",
            motionArgs: { linewise: !0, toJumplist: !0 },
          },
          {
            keys: "M",
            type: "motion",
            motion: "moveToMiddleLine",
            motionArgs: { linewise: !0, toJumplist: !0 },
          },
          {
            keys: "L",
            type: "motion",
            motion: "moveToBottomLine",
            motionArgs: { linewise: !0, toJumplist: !0 },
          },
          {
            keys: "h",
            type: "motion",
            motion: "moveByCharacters",
            motionArgs: { forward: !1 },
          },
          {
            keys: "l",
            type: "motion",
            motion: "moveByCharacters",
            motionArgs: { forward: !0 },
          },
          {
            keys: "j",
            type: "motion",
            motion: "moveByLines",
            motionArgs: { forward: !0, linewise: !0 },
          },
          {
            keys: "k",
            type: "motion",
            motion: "moveByLines",
            motionArgs: { forward: !1, linewise: !0 },
          },
          {
            keys: "gj",
            type: "motion",
            motion: "moveByDisplayLines",
            motionArgs: { forward: !0 },
          },
          {
            keys: "gk",
            type: "motion",
            motion: "moveByDisplayLines",
            motionArgs: { forward: !1 },
          },
          {
            keys: "w",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !0, wordEnd: !1 },
          },
          {
            keys: "W",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !0, wordEnd: !1, bigWord: !0 },
          },
          {
            keys: "e",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !0, wordEnd: !0, inclusive: !0 },
          },
          {
            keys: "E",
            type: "motion",
            motion: "moveByWords",
            motionArgs: {
              forward: !0,
              wordEnd: !0,
              bigWord: !0,
              inclusive: !0,
            },
          },
          {
            keys: "b",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !1, wordEnd: !1 },
          },
          {
            keys: "B",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !1, wordEnd: !1, bigWord: !0 },
          },
          {
            keys: "ge",
            type: "motion",
            motion: "moveByWords",
            motionArgs: { forward: !1, wordEnd: !0, inclusive: !0 },
          },
          {
            keys: "gE",
            type: "motion",
            motion: "moveByWords",
            motionArgs: {
              forward: !1,
              wordEnd: !0,
              bigWord: !0,
              inclusive: !0,
            },
          },
          {
            keys: "{",
            type: "motion",
            motion: "moveByParagraph",
            motionArgs: { forward: !1, toJumplist: !0 },
          },
          {
            keys: "}",
            type: "motion",
            motion: "moveByParagraph",
            motionArgs: { forward: !0, toJumplist: !0 },
          },
          {
            keys: "(",
            type: "motion",
            motion: "moveBySentence",
            motionArgs: { forward: !1 },
          },
          {
            keys: ")",
            type: "motion",
            motion: "moveBySentence",
            motionArgs: { forward: !0 },
          },
          {
            keys: "<C-f>",
            type: "motion",
            motion: "moveByPage",
            motionArgs: { forward: !0 },
          },
          {
            keys: "<C-b>",
            type: "motion",
            motion: "moveByPage",
            motionArgs: { forward: !1 },
          },
          {
            keys: "<C-d>",
            type: "motion",
            motion: "moveByScroll",
            motionArgs: { forward: !0, explicitRepeat: !0 },
          },
          {
            keys: "<C-u>",
            type: "motion",
            motion: "moveByScroll",
            motionArgs: { forward: !1, explicitRepeat: !0 },
          },
          {
            keys: "gg",
            type: "motion",
            motion: "moveToLineOrEdgeOfDocument",
            motionArgs: {
              forward: !1,
              explicitRepeat: !0,
              linewise: !0,
              toJumplist: !0,
            },
          },
          {
            keys: "G",
            type: "motion",
            motion: "moveToLineOrEdgeOfDocument",
            motionArgs: {
              forward: !0,
              explicitRepeat: !0,
              linewise: !0,
              toJumplist: !0,
            },
          },
          { keys: "g$", type: "motion", motion: "moveToEndOfDisplayLine" },
          { keys: "g^", type: "motion", motion: "moveToStartOfDisplayLine" },
          { keys: "g0", type: "motion", motion: "moveToStartOfDisplayLine" },
          { keys: "0", type: "motion", motion: "moveToStartOfLine" },
          {
            keys: "^",
            type: "motion",
            motion: "moveToFirstNonWhiteSpaceCharacter",
          },
          {
            keys: "+",
            type: "motion",
            motion: "moveByLines",
            motionArgs: { forward: !0, toFirstChar: !0 },
          },
          {
            keys: "-",
            type: "motion",
            motion: "moveByLines",
            motionArgs: { forward: !1, toFirstChar: !0 },
          },
          {
            keys: "_",
            type: "motion",
            motion: "moveByLines",
            motionArgs: { forward: !0, toFirstChar: !0, repeatOffset: -1 },
          },
          {
            keys: "$",
            type: "motion",
            motion: "moveToEol",
            motionArgs: { inclusive: !0 },
          },
          {
            keys: "%",
            type: "motion",
            motion: "moveToMatchedSymbol",
            motionArgs: { inclusive: !0, toJumplist: !0 },
          },
          {
            keys: "f<character>",
            type: "motion",
            motion: "moveToCharacter",
            motionArgs: { forward: !0, inclusive: !0 },
          },
          {
            keys: "F<character>",
            type: "motion",
            motion: "moveToCharacter",
            motionArgs: { forward: !1 },
          },
          {
            keys: "t<character>",
            type: "motion",
            motion: "moveTillCharacter",
            motionArgs: { forward: !0, inclusive: !0 },
          },
          {
            keys: "T<character>",
            type: "motion",
            motion: "moveTillCharacter",
            motionArgs: { forward: !1 },
          },
          {
            keys: ";",
            type: "motion",
            motion: "repeatLastCharacterSearch",
            motionArgs: { forward: !0 },
          },
          {
            keys: ",",
            type: "motion",
            motion: "repeatLastCharacterSearch",
            motionArgs: { forward: !1 },
          },
          {
            keys: "'<character>",
            type: "motion",
            motion: "goToMark",
            motionArgs: { toJumplist: !0, linewise: !0 },
          },
          {
            keys: "`<character>",
            type: "motion",
            motion: "goToMark",
            motionArgs: { toJumplist: !0 },
          },
          {
            keys: "]`",
            type: "motion",
            motion: "jumpToMark",
            motionArgs: { forward: !0 },
          },
          {
            keys: "[`",
            type: "motion",
            motion: "jumpToMark",
            motionArgs: { forward: !1 },
          },
          {
            keys: "]'",
            type: "motion",
            motion: "jumpToMark",
            motionArgs: { forward: !0, linewise: !0 },
          },
          {
            keys: "['",
            type: "motion",
            motion: "jumpToMark",
            motionArgs: { forward: !1, linewise: !0 },
          },
          {
            keys: "]p",
            type: "action",
            action: "paste",
            isEdit: !0,
            actionArgs: { after: !0, isEdit: !0, matchIndent: !0 },
          },
          {
            keys: "[p",
            type: "action",
            action: "paste",
            isEdit: !0,
            actionArgs: { after: !1, isEdit: !0, matchIndent: !0 },
          },
          {
            keys: "]<character>",
            type: "motion",
            motion: "moveToSymbol",
            motionArgs: { forward: !0, toJumplist: !0 },
          },
          {
            keys: "[<character>",
            type: "motion",
            motion: "moveToSymbol",
            motionArgs: { forward: !1, toJumplist: !0 },
          },
          { keys: "|", type: "motion", motion: "moveToColumn" },
          {
            keys: "o",
            type: "motion",
            motion: "moveToOtherHighlightedEnd",
            context: "visual",
          },
          {
            keys: "O",
            type: "motion",
            motion: "moveToOtherHighlightedEnd",
            motionArgs: { sameLine: !0 },
            context: "visual",
          },
          { keys: "d", type: "operator", operator: "delete" },
          { keys: "y", type: "operator", operator: "yank" },
          { keys: "c", type: "operator", operator: "change" },
          { keys: "=", type: "operator", operator: "indentAuto" },
          {
            keys: ">",
            type: "operator",
            operator: "indent",
            operatorArgs: { indentRight: !0 },
          },
          {
            keys: "<",
            type: "operator",
            operator: "indent",
            operatorArgs: { indentRight: !1 },
          },
          { keys: "g~", type: "operator", operator: "changeCase" },
          {
            keys: "gu",
            type: "operator",
            operator: "changeCase",
            operatorArgs: { toLower: !0 },
            isEdit: !0,
          },
          {
            keys: "gU",
            type: "operator",
            operator: "changeCase",
            operatorArgs: { toLower: !1 },
            isEdit: !0,
          },
          {
            keys: "n",
            type: "motion",
            motion: "findNext",
            motionArgs: { forward: !0, toJumplist: !0 },
          },
          {
            keys: "N",
            type: "motion",
            motion: "findNext",
            motionArgs: { forward: !1, toJumplist: !0 },
          },
          {
            keys: "gn",
            type: "motion",
            motion: "findAndSelectNextInclusive",
            motionArgs: { forward: !0 },
          },
          {
            keys: "gN",
            type: "motion",
            motion: "findAndSelectNextInclusive",
            motionArgs: { forward: !1 },
          },
          {
            keys: "x",
            type: "operatorMotion",
            operator: "delete",
            motion: "moveByCharacters",
            motionArgs: { forward: !0 },
            operatorMotionArgs: { visualLine: !1 },
          },
          {
            keys: "X",
            type: "operatorMotion",
            operator: "delete",
            motion: "moveByCharacters",
            motionArgs: { forward: !1 },
            operatorMotionArgs: { visualLine: !0 },
          },
          {
            keys: "D",
            type: "operatorMotion",
            operator: "delete",
            motion: "moveToEol",
            motionArgs: { inclusive: !0 },
            context: "normal",
          },
          {
            keys: "D",
            type: "operator",
            operator: "delete",
            operatorArgs: { linewise: !0 },
            context: "visual",
          },
          {
            keys: "Y",
            type: "operatorMotion",
            operator: "yank",
            motion: "expandToLine",
            motionArgs: { linewise: !0 },
            context: "normal",
          },
          {
            keys: "Y",
            type: "operator",
            operator: "yank",
            operatorArgs: { linewise: !0 },
            context: "visual",
          },
          {
            keys: "C",
            type: "operatorMotion",
            operator: "change",
            motion: "moveToEol",
            motionArgs: { inclusive: !0 },
            context: "normal",
          },
          {
            keys: "C",
            type: "operator",
            operator: "change",
            operatorArgs: { linewise: !0 },
            context: "visual",
          },
          {
            keys: "~",
            type: "operatorMotion",
            operator: "changeCase",
            motion: "moveByCharacters",
            motionArgs: { forward: !0 },
            operatorArgs: { shouldMoveCursor: !0 },
            context: "normal",
          },
          {
            keys: "~",
            type: "operator",
            operator: "changeCase",
            context: "visual",
          },
          {
            keys: "<C-u>",
            type: "operatorMotion",
            operator: "delete",
            motion: "moveToStartOfLine",
            context: "insert",
          },
          {
            keys: "<C-w>",
            type: "operatorMotion",
            operator: "delete",
            motion: "moveByWords",
            motionArgs: { forward: !1, wordEnd: !1 },
            context: "insert",
          },
          { keys: "<C-w>", type: "idle", context: "normal" },
          {
            keys: "<C-i>",
            type: "action",
            action: "jumpListWalk",
            actionArgs: { forward: !0 },
          },
          {
            keys: "<C-o>",
            type: "action",
            action: "jumpListWalk",
            actionArgs: { forward: !1 },
          },
          {
            keys: "<C-e>",
            type: "action",
            action: "scroll",
            actionArgs: { forward: !0, linewise: !0 },
          },
          {
            keys: "<C-y>",
            type: "action",
            action: "scroll",
            actionArgs: { forward: !1, linewise: !0 },
          },
          {
            keys: "a",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "charAfter" },
            context: "normal",
          },
          {
            keys: "A",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "eol" },
            context: "normal",
          },
          {
            keys: "A",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "endOfSelectedArea" },
            context: "visual",
          },
          {
            keys: "i",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "inplace" },
            context: "normal",
          },
          {
            keys: "gi",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "lastEdit" },
            context: "normal",
          },
          {
            keys: "I",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "firstNonBlank" },
            context: "normal",
          },
          {
            keys: "gI",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "bol" },
            context: "normal",
          },
          {
            keys: "I",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { insertAt: "startOfSelectedArea" },
            context: "visual",
          },
          {
            keys: "o",
            type: "action",
            action: "newLineAndEnterInsertMode",
            isEdit: !0,
            interlaceInsertRepeat: !0,
            actionArgs: { after: !0 },
            context: "normal",
          },
          {
            keys: "O",
            type: "action",
            action: "newLineAndEnterInsertMode",
            isEdit: !0,
            interlaceInsertRepeat: !0,
            actionArgs: { after: !1 },
            context: "normal",
          },
          { keys: "v", type: "action", action: "toggleVisualMode" },
          {
            keys: "V",
            type: "action",
            action: "toggleVisualMode",
            actionArgs: { linewise: !0 },
          },
          {
            keys: "<C-v>",
            type: "action",
            action: "toggleVisualMode",
            actionArgs: { blockwise: !0 },
          },
          {
            keys: "<C-q>",
            type: "action",
            action: "toggleVisualMode",
            actionArgs: { blockwise: !0 },
          },
          { keys: "gv", type: "action", action: "reselectLastSelection" },
          { keys: "J", type: "action", action: "joinLines", isEdit: !0 },
          {
            keys: "gJ",
            type: "action",
            action: "joinLines",
            actionArgs: { keepSpaces: !0 },
            isEdit: !0,
          },
          {
            keys: "p",
            type: "action",
            action: "paste",
            isEdit: !0,
            actionArgs: { after: !0, isEdit: !0 },
          },
          {
            keys: "P",
            type: "action",
            action: "paste",
            isEdit: !0,
            actionArgs: { after: !1, isEdit: !0 },
          },
          {
            keys: "r<character>",
            type: "action",
            action: "replace",
            isEdit: !0,
          },
          { keys: "@<character>", type: "action", action: "replayMacro" },
          {
            keys: "q<character>",
            type: "action",
            action: "enterMacroRecordMode",
          },
          {
            keys: "R",
            type: "action",
            action: "enterInsertMode",
            isEdit: !0,
            actionArgs: { replace: !0 },
            context: "normal",
          },
          {
            keys: "R",
            type: "operator",
            operator: "change",
            operatorArgs: { linewise: !0, fullLine: !0 },
            context: "visual",
            exitVisualBlock: !0,
          },
          { keys: "u", type: "action", action: "undo", context: "normal" },
          {
            keys: "u",
            type: "operator",
            operator: "changeCase",
            operatorArgs: { toLower: !0 },
            context: "visual",
            isEdit: !0,
          },
          {
            keys: "U",
            type: "operator",
            operator: "changeCase",
            operatorArgs: { toLower: !1 },
            context: "visual",
            isEdit: !0,
          },
          { keys: "<C-r>", type: "action", action: "redo" },
          { keys: "m<character>", type: "action", action: "setMark" },
          { keys: '"<character>', type: "action", action: "setRegister" },
          {
            keys: "zz",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "center" },
          },
          {
            keys: "z.",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "center" },
            motion: "moveToFirstNonWhiteSpaceCharacter",
          },
          {
            keys: "zt",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "top" },
          },
          {
            keys: "z<CR>",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "top" },
            motion: "moveToFirstNonWhiteSpaceCharacter",
          },
          {
            keys: "zb",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "bottom" },
          },
          {
            keys: "z-",
            type: "action",
            action: "scrollToCursor",
            actionArgs: { position: "bottom" },
            motion: "moveToFirstNonWhiteSpaceCharacter",
          },
          { keys: ".", type: "action", action: "repeatLastEdit" },
          {
            keys: "<C-a>",
            type: "action",
            action: "incrementNumberToken",
            isEdit: !0,
            actionArgs: { increase: !0, backtrack: !1 },
          },
          {
            keys: "<C-x>",
            type: "action",
            action: "incrementNumberToken",
            isEdit: !0,
            actionArgs: { increase: !1, backtrack: !1 },
          },
          {
            keys: "<C-t>",
            type: "action",
            action: "indent",
            actionArgs: { indentRight: !0 },
            context: "insert",
          },
          {
            keys: "<C-d>",
            type: "action",
            action: "indent",
            actionArgs: { indentRight: !1 },
            context: "insert",
          },
          {
            keys: "a<character>",
            type: "motion",
            motion: "textObjectManipulation",
          },
          {
            keys: "i<character>",
            type: "motion",
            motion: "textObjectManipulation",
            motionArgs: { textObjectInner: !0 },
          },
          {
            keys: "/",
            type: "search",
            searchArgs: { forward: !0, querySrc: "prompt", toJumplist: !0 },
          },
          {
            keys: "?",
            type: "search",
            searchArgs: { forward: !1, querySrc: "prompt", toJumplist: !0 },
          },
          {
            keys: "*",
            type: "search",
            searchArgs: {
              forward: !0,
              querySrc: "wordUnderCursor",
              wholeWordOnly: !0,
              toJumplist: !0,
            },
          },
          {
            keys: "#",
            type: "search",
            searchArgs: {
              forward: !1,
              querySrc: "wordUnderCursor",
              wholeWordOnly: !0,
              toJumplist: !0,
            },
          },
          {
            keys: "g*",
            type: "search",
            searchArgs: {
              forward: !0,
              querySrc: "wordUnderCursor",
              toJumplist: !0,
            },
          },
          {
            keys: "g#",
            type: "search",
            searchArgs: {
              forward: !1,
              querySrc: "wordUnderCursor",
              toJumplist: !0,
            },
          },
          { keys: ":", type: "ex" },
        ],
        x = w.length,
        S = [
          { name: "colorscheme", shortName: "colo" },
          { name: "map" },
          { name: "imap", shortName: "im" },
          { name: "nmap", shortName: "nm" },
          { name: "vmap", shortName: "vm" },
          { name: "unmap" },
          { name: "write", shortName: "w" },
          { name: "undo", shortName: "u" },
          { name: "redo", shortName: "red" },
          { name: "set", shortName: "se" },
          { name: "setlocal", shortName: "setl" },
          { name: "setglobal", shortName: "setg" },
          { name: "sort", shortName: "sor" },
          { name: "substitute", shortName: "s", possiblyAsync: !0 },
          { name: "nohlsearch", shortName: "noh" },
          { name: "yank", shortName: "y" },
          { name: "delmarks", shortName: "delm" },
          {
            name: "registers",
            shortName: "reg",
            excludeFromCommandHistory: !0,
          },
          { name: "vglobal", shortName: "v" },
          { name: "global", shortName: "g" },
        ];
      function M(e) {
        e.setOption("disableInput", !0),
          e.setOption("showCursorWhenSelecting", !1),
          m.signal(e, "vim-mode-change", { mode: "normal" }),
          e.on("cursorActivity", wt),
          re(e),
          m.on(e.getInputField(), "paste", R(e));
      }
      function A(e) {
        e.setOption("disableInput", !1),
          e.off("cursorActivity", wt),
          m.off(e.getInputField(), "paste", R(e)),
          (e.state.vim = null),
          at && clearTimeout(at);
      }
      function b(e, t) {
        this == m.keyMap.vim &&
          ((e.options.$customCursor = null),
          m.rmClass(e.getWrapperElement(), "cm-fat-cursor")),
          (t && t.attach == L) || A(e);
      }
      function L(e, t) {
        this == m.keyMap.vim &&
          (e.curOp && (e.curOp.selectionChanged = !0),
          (e.options.$customCursor = C),
          m.addClass(e.getWrapperElement(), "cm-fat-cursor")),
          (t && t.attach == L) || M(e);
      }
      function O(e, t) {
        if (t) {
          if (this[e]) return this[e];
          var n = (function (e) {
            if ("'" == e.charAt(0)) return e.charAt(1);
            var t = e.split(/-(?!$)/),
              n = t[t.length - 1];
            if (1 == t.length && 1 == t[0].length) return !1;
            if (2 == t.length && "Shift" == t[0] && 1 == n.length) return !1;
            for (var r = !1, o = 0; o < t.length; o++) {
              var i = t[o];
              i in T ? (t[o] = T[i]) : (r = !0), i in E && (t[o] = E[i]);
            }
            if (!r) return !1;
            W(n) && (t[t.length - 1] = n.toLowerCase());
            return "<" + t.join("-") + ">";
          })(e);
          if (!n) return !1;
          var r = ie.findKey(t, n);
          return "function" == typeof r && m.signal(t, "vim-keypress", n), r;
        }
      }
      m.defineOption("vimMode", !1, function (e, t, n) {
        t && "vim" != e.getOption("keyMap")
          ? e.setOption("keyMap", "vim")
          : !t &&
            n != m.Init &&
            /^vim/.test(e.getOption("keyMap")) &&
            e.setOption("keyMap", "default");
      });
      var T = {
          Shift: "S",
          Ctrl: "C",
          Alt: "A",
          Cmd: "D",
          Mod: "A",
          CapsLock: "",
        },
        E = { Enter: "CR", Backspace: "BS", Delete: "Del", Insert: "Ins" };
      function R(e) {
        var t = e.state.vim;
        return (
          t.onPasteFn ||
            (t.onPasteFn = function () {
              t.insertMode ||
                (e.setCursor(ye(e.getCursor(), 0, 1)),
                me.enterInsertMode(e, {}, t));
            }),
          t.onPasteFn
        );
      }
      var B = /[\d]/,
        I = [
          m.isWordChar,
          function (e) {
            return e && !m.isWordChar(e) && !/\s/.test(e);
          },
        ],
        K = [
          function (e) {
            return /\S/.test(e);
          },
        ];
      function P(e, t) {
        for (var n = [], r = e; r < e + t; r++) n.push(String.fromCharCode(r));
        return n;
      }
      var N,
        _ = P(65, 26),
        H = P(97, 26),
        $ = P(48, 10),
        D = [].concat(_, H, $, ["<", ">"]),
        V = [].concat(_, H, $, ["-", '"', ".", ":", "_", "/", "+"]);
      try {
        N = new RegExp("^[\\p{Lu}]$", "u");
      } catch (It) {
        N = /^[A-Z]$/;
      }
      function F(e, t) {
        return t >= e.firstLine() && t <= e.lastLine();
      }
      function j(e) {
        return /^[a-z]$/.test(e);
      }
      function W(e) {
        return N.test(e);
      }
      function U(e) {
        return /^\s*$/.test(e);
      }
      function z(e) {
        return -1 != ".?!".indexOf(e);
      }
      function J(e, t) {
        for (var n = 0; n < t.length; n++) if (t[n] == e) return !0;
        return !1;
      }
      var q = {};
      function Q(e, t, n, r, o) {
        if (void 0 === t && !o)
          throw Error("defaultValue is required unless callback is provided");
        if (
          (n || (n = "string"),
          (q[e] = { type: n, defaultValue: t, callback: o }),
          r)
        )
          for (var i = 0; i < r.length; i++) q[r[i]] = q[e];
        t && G(e, t);
      }
      function G(e, t, n, r) {
        var o = q[e],
          i = (r = r || {}).scope;
        if (!o) return new Error("Unknown option: " + e);
        if ("boolean" == o.type) {
          if (t && !0 !== t)
            return new Error("Invalid argument: " + e + "=" + t);
          !1 !== t && (t = !0);
        }
        o.callback
          ? ("local" !== i && o.callback(t, void 0),
            "global" !== i && n && o.callback(t, n))
          : ("local" !== i && (o.value = "boolean" == o.type ? !!t : t),
            "global" !== i && n && (n.state.vim.options[e] = { value: t }));
      }
      function X(e, t, n) {
        var r = q[e],
          o = (n = n || {}).scope;
        if (!r) return new Error("Unknown option: " + e);
        if (r.callback) {
          var i = t && r.callback(void 0, t);
          return "global" !== o && void 0 !== i
            ? i
            : "local" !== o
            ? r.callback()
            : void 0;
        }
        return (
          (i = "global" !== o && t && t.state.vim.options[e]) ||
          ("local" !== o && r) ||
          {}
        ).value;
      }
      Q("filetype", void 0, "string", ["ft"], function (e, t) {
        if (void 0 !== t) {
          if (void 0 === e) return "null" == (n = t.getOption("mode")) ? "" : n;
          var n = "" == e ? "null" : e;
          t.setOption("mode", n);
        }
      });
      var Z,
        Y,
        ee = function () {
          var e = 100,
            t = -1,
            n = 0,
            r = 0,
            o = new Array(e);
          function i(i, a) {
            (t += a) > n ? (t = n) : t < r && (t = r);
            var s = o[(e + t) % e];
            if (s && !s.find()) {
              var c,
                l = a > 0 ? 1 : -1,
                u = i.getCursor();
              do {
                if ((s = o[(e + (t += l)) % e]) && (c = s.find()) && !xe(u, c))
                  break;
              } while (t < n && t > r);
            }
            return s;
          }
          return {
            cachedCursor: void 0,
            add: function (i, a, s) {
              var c = o[t % e];
              function l(n) {
                var r = ++t % e,
                  a = o[r];
                a && a.clear(), (o[r] = i.setBookmark(n));
              }
              if (c) {
                var u = c.find();
                u && !xe(u, a) && l(a);
              } else l(a);
              l(s), (n = t), (r = t - e + 1) < 0 && (r = 0);
            },
            find: function (e, n) {
              var r = t,
                o = i(e, n);
              return (t = r), o && o.find();
            },
            move: i,
          };
        },
        te = function (e) {
          return e
            ? {
                changes: e.changes,
                expectCursorActivityForChange: e.expectCursorActivityForChange,
              }
            : { changes: [], expectCursorActivityForChange: !1 };
        };
      function ne() {
        (this.latestRegister = void 0),
          (this.isPlaying = !1),
          (this.isRecording = !1),
          (this.replaySearchQueries = []),
          (this.onRecordingDone = void 0),
          (this.lastInsertModeChanges = te());
      }
      function re(e) {
        return (
          e.state.vim ||
            (e.state.vim = {
              inputState: new ae(),
              lastEditInputState: void 0,
              lastEditActionCommand: void 0,
              lastHPos: -1,
              lastHSPos: -1,
              lastMotion: null,
              marks: {},
              insertMode: !1,
              insertModeRepeat: void 0,
              visualMode: !1,
              visualLine: !1,
              visualBlock: !1,
              lastSelection: null,
              lastPastedText: null,
              sel: {},
              options: {},
            }),
          e.state.vim
        );
      }
      function oe() {
        for (var e in ((Z = {
          searchQuery: null,
          searchIsReversed: !1,
          lastSubstituteReplacePart: void 0,
          jumpList: ee(),
          macroModeState: new ne(),
          lastCharacterSearch: {
            increment: 0,
            forward: !0,
            selectedCharacter: "",
          },
          registerController: new le({}),
          searchHistoryController: new ue(),
          exCommandHistoryController: new ue(),
        }),
        q)) {
          var t = q[e];
          t.value = t.defaultValue;
        }
      }
      ne.prototype = {
        exitMacroRecordMode: function () {
          var e = Z.macroModeState;
          e.onRecordingDone && e.onRecordingDone(),
            (e.onRecordingDone = void 0),
            (e.isRecording = !1);
        },
        enterMacroRecordMode: function (e, t) {
          var n = Z.registerController.getRegister(t);
          if (n) {
            if ((n.clear(), (this.latestRegister = t), e.openDialog)) {
              var r = nt(
                "span",
                { class: "cm-vim-message" },
                "recording @" + t
              );
              this.onRecordingDone = e.openDialog(r, null, { bottom: !0 });
            }
            this.isRecording = !0;
          }
        },
      };
      var ie = {
        enterVimMode: M,
        leaveVimMode: A,
        buildKeyMap: function () {},
        getRegisterController: function () {
          return Z.registerController;
        },
        resetVimGlobalState_: oe,
        getVimGlobalState_: function () {
          return Z;
        },
        maybeInitVimState_: re,
        suppressErrorLogging: !1,
        InsertModeKey: St,
        map: function (e, t, n) {
          gt.map(e, t, n);
        },
        unmap: function (e, t) {
          return gt.unmap(e, t);
        },
        noremap: function (e, t, n) {
          function r(e) {
            return e ? [e] : ["normal", "insert", "visual"];
          }
          for (var o = r(n), i = w.length, a = i - x; a < i && o.length; a++) {
            var s = w[a];
            if (
              s.keys == t &&
              (!n || !s.context || s.context === n) &&
              "ex" !== s.type.substr(0, 2) &&
              "key" !== s.type.substr(0, 3)
            ) {
              var c = {};
              for (var l in s) c[l] = s[l];
              (c.keys = e),
                n && !c.context && (c.context = n),
                this._mapCommand(c);
              var u = r(s.context);
              o = o.filter(function (e) {
                return -1 === u.indexOf(e);
              });
            }
          }
        },
        mapclear: function (e) {
          var t = w.length,
            n = x,
            r = w.slice(0, t - n);
          if (((w = w.slice(t - n)), e))
            for (var o = r.length - 1; o >= 0; o--) {
              var i = r[o];
              if (e !== i.context)
                if (i.context) this._mapCommand(i);
                else {
                  var a = ["normal", "insert", "visual"];
                  for (var s in a)
                    if (a[s] !== e) {
                      var c = {};
                      for (var l in i) c[l] = i[l];
                      (c.context = a[s]), this._mapCommand(c);
                    }
                }
            }
        },
        setOption: G,
        getOption: X,
        defineOption: Q,
        defineEx: function (e, t, n) {
          if (t) {
            if (0 !== e.indexOf(t))
              throw new Error(
                '(Vim.defineEx) "' +
                  t +
                  '" is not a prefix of "' +
                  e +
                  '", command not registered'
              );
          } else t = e;
          (mt[e] = n),
            (gt.commandMap_[t] = { name: e, shortName: t, type: "api" });
        },
        handleKey: function (e, t, n) {
          var r = this.findKey(e, t, n);
          if ("function" === typeof r) return r();
        },
        multiSelectHandleKey: Et,
        findKey: function (e, t, n) {
          var r,
            o = re(e);
          function i() {
            var r = Z.macroModeState;
            if (r.isRecording) {
              if ("q" == t) return r.exitMacroRecordMode(), se(e), !0;
              "mapping" != n &&
                (function (e, t) {
                  if (e.isPlaying) return;
                  var n = e.latestRegister,
                    r = Z.registerController.getRegister(n);
                  r && r.pushText(t);
                })(r, t);
            }
          }
          function a() {
            if ("<Esc>" == t) {
              if (o.visualMode) Pe(e);
              else {
                if (!o.insertMode) return;
                vt(e);
              }
              return se(e), !0;
            }
          }
          return !1 ===
            (r = o.insertMode
              ? (function () {
                  if (a()) return !0;
                  for (
                    var n = (o.inputState.keyBuffer =
                        o.inputState.keyBuffer + t),
                      r = 1 == t.length,
                      i = he.matchCommand(n, w, o.inputState, "insert");
                    n.length > 1 && "full" != i.type;

                  ) {
                    n = o.inputState.keyBuffer = n.slice(1);
                    var s = he.matchCommand(n, w, o.inputState, "insert");
                    "none" != s.type && (i = s);
                  }
                  if ("none" == i.type) return se(e), !1;
                  if ("partial" == i.type)
                    return (
                      Y && window.clearTimeout(Y),
                      (Y = window.setTimeout(function () {
                        o.insertMode && o.inputState.keyBuffer && se(e);
                      }, X("insertModeEscKeysTimeout"))),
                      !r
                    );
                  if ((Y && window.clearTimeout(Y), r)) {
                    for (var c = e.listSelections(), l = 0; l < c.length; l++) {
                      var u = c[l].head;
                      e.replaceRange(
                        "",
                        ye(u, 0, -(n.length - 1)),
                        u,
                        "+input"
                      );
                    }
                    Z.macroModeState.lastInsertModeChanges.changes.pop();
                  }
                  return se(e), i.command;
                })()
              : (function () {
                  if (i() || a()) return !0;
                  var n = (o.inputState.keyBuffer = o.inputState.keyBuffer + t);
                  if (/^[1-9]\d*$/.test(n)) return !0;
                  var r = /^(\d*)(.*)$/.exec(n);
                  if (!r) return se(e), !1;
                  var s = o.visualMode ? "visual" : "normal",
                    c = r[2] || r[1];
                  o.inputState.operatorShortcut &&
                    o.inputState.operatorShortcut.slice(-1) == c &&
                    (c = o.inputState.operatorShortcut);
                  var l = he.matchCommand(c, w, o.inputState, s);
                  return "none" == l.type
                    ? (se(e), !1)
                    : "partial" == l.type ||
                        ("clear" == l.type
                          ? (se(e), !0)
                          : ((o.inputState.keyBuffer = ""),
                            (r = /^(\d*)(.*)$/.exec(n))[1] &&
                              "0" != r[1] &&
                              o.inputState.pushRepeatDigit(r[1]),
                            l.command));
                })())
            ? void 0
            : !0 === r
            ? function () {
                return !0;
              }
            : function () {
                if ((!r.operator && !r.isEdit) || !e.getOption("readOnly"))
                  return e.operation(function () {
                    e.curOp.isVimOp = !0;
                    try {
                      "keyToKey" == r.type
                        ? (function (n) {
                            for (var r; n; )
                              (r = /<\w+-.+?>|<\w+>|./.exec(n)),
                                (t = r[0]),
                                (n = n.substring(r.index + t.length)),
                                ie.handleKey(e, t, "mapping");
                          })(r.toKeys)
                        : he.processCommand(e, o, r);
                    } catch (n) {
                      throw (
                        ((e.state.vim = void 0),
                        re(e),
                        ie.suppressErrorLogging || console.log(n),
                        n)
                      );
                    }
                    return !0;
                  });
              };
        },
        handleEx: function (e, t) {
          gt.processCommand(e, t);
        },
        defineMotion: function (e, t) {
          de[e] = t;
        },
        defineAction: function (e, t) {
          me[e] = t;
        },
        defineOperator: function (e, t) {
          fe[e] = t;
        },
        mapCommand: function (e, t, n, r, o) {
          var i = { keys: e, type: t };
          for (var a in ((i[t] = n), (i[t + "Args"] = r), o)) i[a] = o[a];
          yt(i);
        },
        _mapCommand: yt,
        defineRegister: function (e, t) {
          var n = Z.registerController.registers;
          if (!e || 1 != e.length)
            throw Error("Register name must be 1 character");
          (n[e] = t), V.push(e);
        },
        exitVisualMode: Pe,
        exitInsertMode: vt,
      };
      function ae() {
        (this.prefixRepeat = []),
          (this.motionRepeat = []),
          (this.operator = null),
          (this.operatorArgs = null),
          (this.motion = null),
          (this.motionArgs = null),
          (this.keyBuffer = []),
          (this.registerName = null);
      }
      function se(e, t) {
        (e.state.vim.inputState = new ae()), m.signal(e, "vim-command-done", t);
      }
      function ce(e, t, n) {
        this.clear(),
          (this.keyBuffer = [e || ""]),
          (this.insertModeChanges = []),
          (this.searchQueries = []),
          (this.linewise = !!t),
          (this.blockwise = !!n);
      }
      function le(e) {
        (this.registers = e),
          (this.unnamedRegister = e['"'] = new ce()),
          (e["."] = new ce()),
          (e[":"] = new ce()),
          (e["/"] = new ce()),
          (e["+"] = new ce());
      }
      function ue() {
        (this.historyBuffer = []),
          (this.iterator = 0),
          (this.initialPrefix = null);
      }
      (ae.prototype.pushRepeatDigit = function (e) {
        this.operator
          ? (this.motionRepeat = this.motionRepeat.concat(e))
          : (this.prefixRepeat = this.prefixRepeat.concat(e));
      }),
        (ae.prototype.getRepeat = function () {
          var e = 0;
          return (
            (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0) &&
              ((e = 1),
              this.prefixRepeat.length > 0 &&
                (e *= parseInt(this.prefixRepeat.join(""), 10)),
              this.motionRepeat.length > 0 &&
                (e *= parseInt(this.motionRepeat.join(""), 10))),
            e
          );
        }),
        (ce.prototype = {
          setText: function (e, t, n) {
            (this.keyBuffer = [e || ""]),
              (this.linewise = !!t),
              (this.blockwise = !!n);
          },
          pushText: function (e, t) {
            t &&
              (this.linewise || this.keyBuffer.push("\n"),
              (this.linewise = !0)),
              this.keyBuffer.push(e);
          },
          pushInsertModeChanges: function (e) {
            this.insertModeChanges.push(te(e));
          },
          pushSearchQuery: function (e) {
            this.searchQueries.push(e);
          },
          clear: function () {
            (this.keyBuffer = []),
              (this.insertModeChanges = []),
              (this.searchQueries = []),
              (this.linewise = !1);
          },
          toString: function () {
            return this.keyBuffer.join("");
          },
        }),
        (le.prototype = {
          pushText: function (e, t, n, r, o) {
            if ("_" !== e) {
              r && "\n" !== n.charAt(n.length - 1) && (n += "\n");
              var i = this.isValidRegister(e) ? this.getRegister(e) : null;
              if (i) {
                W(e) ? i.pushText(n, r) : i.setText(n, r, o),
                  "+" === e &&
                    "undefined" !== typeof navigator &&
                    "undefined" !== typeof navigator.clipboard &&
                    "function" === typeof navigator.clipboard.readText &&
                    navigator.clipboard.writeText(n),
                  this.unnamedRegister.setText(i.toString(), r);
              } else {
                switch (t) {
                  case "yank":
                    this.registers[0] = new ce(n, r, o);
                    break;
                  case "delete":
                  case "change":
                    -1 == n.indexOf("\n")
                      ? (this.registers["-"] = new ce(n, r))
                      : (this.shiftNumericRegisters_(),
                        (this.registers[1] = new ce(n, r)));
                }
                this.unnamedRegister.setText(n, r, o);
              }
            }
          },
          getRegister: function (e) {
            return this.isValidRegister(e)
              ? ((e = e.toLowerCase()),
                this.registers[e] || (this.registers[e] = new ce()),
                this.registers[e])
              : this.unnamedRegister;
          },
          isValidRegister: function (e) {
            return e && J(e, V);
          },
          shiftNumericRegisters_: function () {
            for (var e = 9; e >= 2; e--)
              this.registers[e] = this.getRegister("" + (e - 1));
          },
        }),
        (ue.prototype = {
          nextMatch: function (e, t) {
            var n = this.historyBuffer,
              r = t ? -1 : 1;
            null === this.initialPrefix && (this.initialPrefix = e);
            for (var o = this.iterator + r; t ? o >= 0 : o < n.length; o += r)
              for (var i = n[o], a = 0; a <= i.length; a++)
                if (this.initialPrefix == i.substring(0, a))
                  return (this.iterator = o), i;
            return o >= n.length
              ? ((this.iterator = n.length), this.initialPrefix)
              : o < 0
              ? e
              : void 0;
          },
          pushInput: function (e) {
            var t = this.historyBuffer.indexOf(e);
            t > -1 && this.historyBuffer.splice(t, 1),
              e.length && this.historyBuffer.push(e);
          },
          reset: function () {
            (this.initialPrefix = null),
              (this.iterator = this.historyBuffer.length);
          },
        });
      var he = {
          matchCommand: function (e, t, n, r) {
            var o,
              i = (function (e, t, n, r) {
                for (var o, i = [], a = [], s = 0; s < t.length; s++) {
                  var c = t[s];
                  ("insert" == n && "insert" != c.context) ||
                    (c.context && c.context != n) ||
                    (r.operator && "action" == c.type) ||
                    !(o = Ce(e, c.keys)) ||
                    ("partial" == o && i.push(c), "full" == o && a.push(c));
                }
                return { partial: i.length && i, full: a.length && a };
              })(e, t, r, n);
            if (!i.full && !i.partial) return { type: "none" };
            if (!i.full && i.partial) return { type: "partial" };
            for (var a = 0; a < i.full.length; a++) {
              var s = i.full[a];
              o || (o = s);
            }
            if ("<character>" == o.keys.slice(-11)) {
              var c = (function (e) {
                var t = /^.*(<[^>]+>)$/.exec(e),
                  n = t ? t[1] : e.slice(-1);
                if (n.length > 1)
                  switch (n) {
                    case "<CR>":
                      n = "\n";
                      break;
                    case "<Space>":
                      n = " ";
                      break;
                    default:
                      n = "";
                  }
                return n;
              })(e);
              if (!c || c.length > 1) return { type: "clear" };
              n.selectedCharacter = c;
            }
            return { type: "full", command: o };
          },
          processCommand: function (e, t, n) {
            switch (
              ((t.inputState.repeatOverride = n.repeatOverride), n.type)
            ) {
              case "motion":
                this.processMotion(e, t, n);
                break;
              case "operator":
                this.processOperator(e, t, n);
                break;
              case "operatorMotion":
                this.processOperatorMotion(e, t, n);
                break;
              case "action":
                this.processAction(e, t, n);
                break;
              case "search":
                this.processSearch(e, t, n);
                break;
              case "ex":
              case "keyToEx":
                this.processEx(e, t, n);
            }
          },
          processMotion: function (e, t, n) {
            (t.inputState.motion = n.motion),
              (t.inputState.motionArgs = ve(n.motionArgs)),
              this.evalInput(e, t);
          },
          processOperator: function (e, t, n) {
            var r = t.inputState;
            if (r.operator) {
              if (r.operator == n.operator)
                return (
                  (r.motion = "expandToLine"),
                  (r.motionArgs = { linewise: !0 }),
                  void this.evalInput(e, t)
                );
              se(e);
            }
            (r.operator = n.operator),
              (r.operatorArgs = ve(n.operatorArgs)),
              n.keys.length > 1 && (r.operatorShortcut = n.keys),
              n.exitVisualBlock && ((t.visualBlock = !1), Ie(e)),
              t.visualMode && this.evalInput(e, t);
          },
          processOperatorMotion: function (e, t, n) {
            var r = t.visualMode,
              o = ve(n.operatorMotionArgs);
            o && r && o.visualLine && (t.visualLine = !0),
              this.processOperator(e, t, n),
              r || this.processMotion(e, t, n);
          },
          processAction: function (e, t, n) {
            var r = t.inputState,
              o = r.getRepeat(),
              i = !!o,
              a = ve(n.actionArgs) || {};
            r.selectedCharacter && (a.selectedCharacter = r.selectedCharacter),
              n.operator && this.processOperator(e, t, n),
              n.motion && this.processMotion(e, t, n),
              (n.motion || n.operator) && this.evalInput(e, t),
              (a.repeat = o || 1),
              (a.repeatIsExplicit = i),
              (a.registerName = r.registerName),
              se(e),
              (t.lastMotion = null),
              n.isEdit && this.recordLastEdit(t, r, n),
              me[n.action](e, a, t);
          },
          processSearch: function (e, t, n) {
            if (e.getSearchCursor) {
              var r = n.searchArgs.forward,
                o = n.searchArgs.wholeWordOnly;
              Ge(e).setReversed(!r);
              var i = r ? "/" : "?",
                a = Ge(e).getQuery(),
                s = e.getScrollInfo();
              switch (n.searchArgs.querySrc) {
                case "prompt":
                  var c = Z.macroModeState;
                  if (c.isPlaying)
                    d((h = c.replaySearchQueries.shift()), !0, !1);
                  else
                    ot(e, {
                      onClose: function (e) {
                        d(e, !0, !0);
                        var t = Z.macroModeState;
                        t.isRecording &&
                          (function (e, t) {
                            if (!e.isPlaying) {
                              var n = e.latestRegister,
                                r = Z.registerController.getRegister(n);
                              r && r.pushSearchQuery && r.pushSearchQuery(t);
                            }
                          })(t, e);
                      },
                      prefix: i,
                      desc: "(JavaScript regexp)",
                      onKeyUp: function (t, n, o) {
                        var i,
                          a,
                          c,
                          l = m.keyName(t);
                        "Up" == l || "Down" == l
                          ? ((i = "Up" == l),
                            (a = t.target ? t.target.selectionEnd : 0),
                            o(
                              (n =
                                Z.searchHistoryController.nextMatch(n, i) || "")
                            ),
                            a &&
                              t.target &&
                              (t.target.selectionEnd = t.target.selectionStart =
                                Math.min(a, t.target.value.length)))
                          : "Left" != l &&
                            "Right" != l &&
                            "Ctrl" != l &&
                            "Alt" != l &&
                            "Shift" != l &&
                            Z.searchHistoryController.reset();
                        try {
                          c = it(e, n, !0, !0);
                        } catch (t) {}
                        c
                          ? e.scrollIntoView(ct(e, !r, c), 30)
                          : (lt(e), e.scrollTo(s.left, s.top));
                      },
                      onKeyDown: function (t, n, r) {
                        var o = m.keyName(t);
                        "Esc" == o ||
                        "Ctrl-C" == o ||
                        "Ctrl-[" == o ||
                        ("Backspace" == o && "" == n)
                          ? (Z.searchHistoryController.pushInput(n),
                            Z.searchHistoryController.reset(),
                            it(e, a),
                            lt(e),
                            e.scrollTo(s.left, s.top),
                            m.e_stop(t),
                            se(e),
                            r(),
                            e.focus())
                          : "Up" == o || "Down" == o
                          ? m.e_stop(t)
                          : "Ctrl-U" == o && (m.e_stop(t), r(""));
                      },
                    });
                  break;
                case "wordUnderCursor":
                  var l = _e(e, !1, !0, !1, !0),
                    u = !0;
                  if ((l || ((l = _e(e, !1, !0, !1, !1)), (u = !1)), !l))
                    return;
                  var h = e
                    .getLine(l.start.line)
                    .substring(l.start.ch, l.end.ch);
                  (h =
                    u && o
                      ? "\\b" + h + "\\b"
                      : h.replace(/([.?*+$\[\]\/\\(){}|\-])/g, "\\$1")),
                    (Z.jumpList.cachedCursor = e.getCursor()),
                    e.setCursor(l.start),
                    d(h, !0, !1);
              }
            }
            function d(r, o, i) {
              Z.searchHistoryController.pushInput(r),
                Z.searchHistoryController.reset();
              try {
                it(e, r, o, i);
              } catch (a) {
                return rt(e, "Invalid regex: " + r), void se(e);
              }
              he.processMotion(e, t, {
                type: "motion",
                motion: "findNext",
                motionArgs: {
                  forward: !0,
                  toJumplist: n.searchArgs.toJumplist,
                },
              });
            }
          },
          processEx: function (e, t, n) {
            function r(t) {
              Z.exCommandHistoryController.pushInput(t),
                Z.exCommandHistoryController.reset(),
                gt.processCommand(e, t),
                e.state.vim && se(e);
            }
            function o(t, n, r) {
              var o,
                i,
                a = m.keyName(t);
              ("Esc" == a ||
                "Ctrl-C" == a ||
                "Ctrl-[" == a ||
                ("Backspace" == a && "" == n)) &&
                (Z.exCommandHistoryController.pushInput(n),
                Z.exCommandHistoryController.reset(),
                m.e_stop(t),
                se(e),
                r(),
                e.focus()),
                "Up" == a || "Down" == a
                  ? (m.e_stop(t),
                    (o = "Up" == a),
                    (i = t.target ? t.target.selectionEnd : 0),
                    r((n = Z.exCommandHistoryController.nextMatch(n, o) || "")),
                    i &&
                      t.target &&
                      (t.target.selectionEnd = t.target.selectionStart =
                        Math.min(i, t.target.value.length)))
                  : "Ctrl-U" == a
                  ? (m.e_stop(t), r(""))
                  : "Left" != a &&
                    "Right" != a &&
                    "Ctrl" != a &&
                    "Alt" != a &&
                    "Shift" != a &&
                    Z.exCommandHistoryController.reset();
            }
            "keyToEx" == n.type
              ? gt.processCommand(e, n.exArgs.input)
              : t.visualMode
              ? ot(e, {
                  onClose: r,
                  prefix: ":",
                  value: "'<,'>",
                  onKeyDown: o,
                  selectValueOnOpen: !1,
                })
              : ot(e, { onClose: r, prefix: ":", onKeyDown: o });
          },
          evalInput: function (e, t) {
            var n,
              r,
              o,
              i = t.inputState,
              a = i.motion,
              s = i.motionArgs || {},
              c = i.operator,
              l = i.operatorArgs || {},
              u = i.registerName,
              h = t.sel,
              d = we(t.visualMode ? ge(e, h.head) : e.getCursor("head")),
              p = we(t.visualMode ? ge(e, h.anchor) : e.getCursor("anchor")),
              f = we(d),
              m = we(p);
            if (
              (c && this.recordLastEdit(t, i),
              (o =
                void 0 !== i.repeatOverride
                  ? i.repeatOverride
                  : i.getRepeat()) > 0 && s.explicitRepeat
                ? (s.repeatIsExplicit = !0)
                : (s.noRepeat || (!s.explicitRepeat && 0 === o)) &&
                  ((o = 1), (s.repeatIsExplicit = !1)),
              i.selectedCharacter &&
                (s.selectedCharacter = l.selectedCharacter =
                  i.selectedCharacter),
              (s.repeat = o),
              se(e),
              a)
            ) {
              var g = de[a](e, d, s, t, i);
              if (((t.lastMotion = de[a]), !g)) return;
              if (s.toJumplist) {
                c ||
                  null == e.ace.curOp ||
                  (e.ace.curOp.command.scrollIntoView = "center-animate");
                var v = Z.jumpList,
                  C = v.cachedCursor;
                C ? (He(e, C, g), delete v.cachedCursor) : He(e, d, g);
              }
              g instanceof Array ? ((r = g[0]), (n = g[1])) : (n = g),
                n || (n = we(d)),
                t.visualMode
                  ? ((t.visualBlock && n.ch === 1 / 0) || (n = ge(e, n, f)),
                    r && (r = ge(e, r)),
                    (r = r || m),
                    (h.anchor = r),
                    (h.head = n),
                    Ie(e),
                    Ue(e, t, "<", Se(r, n) ? r : n),
                    Ue(e, t, ">", Se(r, n) ? n : r))
                  : c ||
                    (e.ace.curOp &&
                      (e.ace.curOp.vimDialogScroll = "center-animate"),
                    (n = ge(e, n, f)),
                    e.setCursor(n.line, n.ch));
            }
            if (c) {
              if (l.lastSel) {
                r = m;
                var w = l.lastSel,
                  x = Math.abs(w.head.line - w.anchor.line),
                  S = Math.abs(w.head.ch - w.anchor.ch);
                (n = w.visualLine
                  ? new y(m.line + x, m.ch)
                  : w.visualBlock
                  ? new y(m.line + x, m.ch + S)
                  : w.head.line == w.anchor.line
                  ? new y(m.line, m.ch + S)
                  : new y(m.line + x, m.ch)),
                  (t.visualMode = !0),
                  (t.visualLine = w.visualLine),
                  (t.visualBlock = w.visualBlock),
                  (h = t.sel = { anchor: r, head: n }),
                  Ie(e);
              } else
                t.visualMode &&
                  (l.lastSel = {
                    anchor: we(h.anchor),
                    head: we(h.head),
                    visualBlock: t.visualBlock,
                    visualLine: t.visualLine,
                  });
              var M, A, b, L, O;
              if (t.visualMode) {
                if (
                  ((M = Me(h.head, h.anchor)),
                  (A = Ae(h.head, h.anchor)),
                  (b = t.visualLine || l.linewise),
                  (L = t.visualBlock ? "block" : b ? "line" : "char"),
                  (O = Ke(
                    e,
                    { anchor: (B = k(e, M, A)).start, head: B.end },
                    L
                  )),
                  b)
                ) {
                  var T = O.ranges;
                  if ("block" == L)
                    for (var E = 0; E < T.length; E++)
                      T[E].head.ch = Le(e, T[E].head.line);
                  else
                    "line" == L && (T[0].head = new y(T[0].head.line + 1, 0));
                }
              } else {
                if (((M = we(r || m)), Se((A = we(n || f)), M))) {
                  var R = M;
                  (M = A), (A = R);
                }
                (b = s.linewise || l.linewise)
                  ? (function (e, t, n) {
                      (t.ch = 0), (n.ch = 0), n.line++;
                    })(0, M, A)
                  : s.forward &&
                    (function (e, t, n) {
                      var r = e.getRange(t, n);
                      if (/\n\s*$/.test(r)) {
                        var o = r.split("\n");
                        o.pop();
                        for (
                          var i = o.pop();
                          o.length > 0 && i && U(i);
                          i = o.pop()
                        )
                          n.line--, (n.ch = 0);
                        i ? (n.line--, (n.ch = Le(e, n.line))) : (n.ch = 0);
                      }
                    })(e, M, A),
                  (L = "char");
                var B,
                  I = !s.inclusive || b;
                O = Ke(
                  e,
                  { anchor: (B = k(e, M, A)).start, head: B.end },
                  L,
                  I
                );
              }
              e.setSelections(O.ranges, O.primary),
                (t.lastMotion = null),
                (l.repeat = o),
                (l.registerName = u),
                (l.linewise = b);
              var K = fe[c](e, l, O.ranges, m, n);
              t.visualMode && Pe(e, null != K), K && e.setCursor(K);
            }
          },
          recordLastEdit: function (e, t, n) {
            var r = Z.macroModeState;
            r.isPlaying ||
              ((e.lastEditInputState = t),
              (e.lastEditActionCommand = n),
              (r.lastInsertModeChanges.changes = []),
              (r.lastInsertModeChanges.expectCursorActivityForChange = !1),
              (r.lastInsertModeChanges.visualBlock = e.visualBlock
                ? e.sel.head.line - e.sel.anchor.line
                : 0));
          },
        },
        de = {
          moveToTopLine: function (e, t, n) {
            var r = ht(e).top + n.repeat - 1;
            return new y(r, Ne(e.getLine(r)));
          },
          moveToMiddleLine: function (e) {
            var t = ht(e),
              n = Math.floor(0.5 * (t.top + t.bottom));
            return new y(n, Ne(e.getLine(n)));
          },
          moveToBottomLine: function (e, t, n) {
            var r = ht(e).bottom - n.repeat + 1;
            return new y(r, Ne(e.getLine(r)));
          },
          expandToLine: function (e, t, n) {
            return new y(t.line + n.repeat - 1, 1 / 0);
          },
          findNext: function (e, t, n) {
            var r = Ge(e),
              o = r.getQuery();
            if (o) {
              var i = !n.forward;
              return (
                (i = r.isReversed() ? !i : i), st(e, o), ct(e, i, o, n.repeat)
              );
            }
          },
          findAndSelectNextInclusive: function (e, t, n, r, o) {
            var i = Ge(e),
              a = i.getQuery();
            if (a) {
              var s = !n.forward,
                c = (function (e, t, n, r, o) {
                  void 0 === r && (r = 1);
                  return e.operation(function () {
                    var i = e.getCursor(),
                      a = e.getSearchCursor(n, i),
                      s = a.find(!t);
                    !o.visualMode && s && xe(a.from(), i) && a.find(!t);
                    for (var c = 0; c < r; c++)
                      if (
                        !(s = a.find(t)) &&
                        !(a = e.getSearchCursor(
                          n,
                          t ? new y(e.lastLine()) : new y(e.firstLine(), 0)
                        )).find(t)
                      )
                        return;
                    return [a.from(), a.to()];
                  });
                })(e, (s = i.isReversed() ? !s : s), a, n.repeat, r);
              if (c) {
                if (o.operator) return c;
                var l = c[0],
                  u = new y(c[1].line, c[1].ch - 1);
                if (r.visualMode) {
                  (r.visualLine || r.visualBlock) &&
                    ((r.visualLine = !1),
                    (r.visualBlock = !1),
                    m.signal(e, "vim-mode-change", {
                      mode: "visual",
                      subMode: "",
                    }));
                  var h = r.sel.anchor;
                  if (h)
                    return i.isReversed()
                      ? n.forward
                        ? [h, l]
                        : [h, u]
                      : n.forward
                      ? [h, u]
                      : [h, l];
                } else
                  (r.visualMode = !0),
                    (r.visualLine = !1),
                    (r.visualBlock = !1),
                    m.signal(e, "vim-mode-change", {
                      mode: "visual",
                      subMode: "",
                    });
                return s ? [u, l] : [l, u];
              }
            }
          },
          goToMark: function (e, t, n, r) {
            var o = dt(e, r, n.selectedCharacter);
            return o
              ? n.linewise
                ? { line: o.line, ch: Ne(e.getLine(o.line)) }
                : o
              : null;
          },
          moveToOtherHighlightedEnd: function (e, t, n, r) {
            if (r.visualBlock && n.sameLine) {
              var o = r.sel;
              return [
                ge(e, new y(o.anchor.line, o.head.ch)),
                ge(e, new y(o.head.line, o.anchor.ch)),
              ];
            }
            return [r.sel.head, r.sel.anchor];
          },
          jumpToMark: function (e, t, n, r) {
            for (var o = t, i = 0; i < n.repeat; i++) {
              var a = o;
              for (var s in r.marks)
                if (j(s)) {
                  var c = r.marks[s].find();
                  if (
                    !(n.forward ? Se(c, a) : Se(a, c)) &&
                    (!n.linewise || c.line != a.line)
                  ) {
                    var l = xe(a, o),
                      u = n.forward ? be(a, c, o) : be(o, c, a);
                    (l || u) && (o = c);
                  }
                }
            }
            return n.linewise && (o = new y(o.line, Ne(e.getLine(o.line)))), o;
          },
          moveByCharacters: function (e, t, n) {
            var r = t,
              o = n.repeat,
              i = n.forward ? r.ch + o : r.ch - o;
            return new y(r.line, i);
          },
          moveByLines: function (e, t, n, r) {
            var o = t,
              i = o.ch;
            switch (r.lastMotion) {
              case this.moveByLines:
              case this.moveByDisplayLines:
              case this.moveByScroll:
              case this.moveToColumn:
              case this.moveToEol:
                i = r.lastHPos;
                break;
              default:
                r.lastHPos = i;
            }
            var a = n.repeat + (n.repeatOffset || 0),
              s = n.forward ? o.line + a : o.line - a,
              c = e.firstLine(),
              l = e.lastLine();
            if (s < c && o.line == c) return this.moveToStartOfLine(e, t, n, r);
            if (s > l && o.line == l) return je(e, t, n, r, !0);
            var u = e.ace.session.getFoldLine(s);
            return (
              u &&
                (n.forward
                  ? s > u.start.row && (s = u.end.row + 1)
                  : (s = u.start.row)),
              n.toFirstChar && ((i = Ne(e.getLine(s))), (r.lastHPos = i)),
              (r.lastHSPos = e.charCoords(new y(s, i), "div").left),
              new y(s, i)
            );
          },
          moveByDisplayLines: function (e, t, n, r) {
            var o = t;
            switch (r.lastMotion) {
              case this.moveByDisplayLines:
              case this.moveByScroll:
              case this.moveByLines:
              case this.moveToColumn:
              case this.moveToEol:
                break;
              default:
                r.lastHSPos = e.charCoords(o, "div").left;
            }
            var i = n.repeat;
            if (
              (s = e.findPosV(o, n.forward ? i : -i, "line", r.lastHSPos))
                .hitSide
            )
              if (n.forward)
                var a = {
                    top: e.charCoords(s, "div").top + 8,
                    left: r.lastHSPos,
                  },
                  s = e.coordsChar(a, "div");
              else {
                var c = e.charCoords(new y(e.firstLine(), 0), "div");
                (c.left = r.lastHSPos), (s = e.coordsChar(c, "div"));
              }
            return (r.lastHPos = s.ch), s;
          },
          moveByPage: function (e, t, n) {
            var r = t,
              o = n.repeat;
            return e.findPosV(r, n.forward ? o : -o, "page");
          },
          moveByParagraph: function (e, t, n) {
            var r = n.forward ? 1 : -1;
            return Je(e, t, n.repeat, r);
          },
          moveBySentence: function (e, t, n) {
            var r = n.forward ? 1 : -1;
            return (function (e, t, n, r) {
              function o(e, t) {
                if (t.pos + t.dir < 0 || t.pos + t.dir >= t.line.length) {
                  if (((t.ln += t.dir), !F(e, t.ln)))
                    return (t.line = null), (t.ln = null), void (t.pos = null);
                  (t.line = e.getLine(t.ln)),
                    (t.pos = t.dir > 0 ? 0 : t.line.length - 1);
                } else t.pos += t.dir;
              }
              function i(e, t, n, r) {
                var i = "" === (l = e.getLine(t)),
                  a = { line: l, ln: t, pos: n, dir: r },
                  s = { ln: a.ln, pos: a.pos },
                  c = "" === a.line;
                for (o(e, a); null !== a.line; ) {
                  if (((s.ln = a.ln), (s.pos = a.pos), "" === a.line && !c))
                    return { ln: a.ln, pos: a.pos };
                  if (i && "" !== a.line && !U(a.line[a.pos]))
                    return { ln: a.ln, pos: a.pos };
                  !z(a.line[a.pos]) ||
                    i ||
                    (a.pos !== a.line.length - 1 && !U(a.line[a.pos + 1])) ||
                    (i = !0),
                    o(e, a);
                }
                var l = e.getLine(s.ln);
                s.pos = 0;
                for (var u = l.length - 1; u >= 0; --u)
                  if (!U(l[u])) {
                    s.pos = u;
                    break;
                  }
                return s;
              }
              function a(e, t, n, r) {
                var i = { line: (c = e.getLine(t)), ln: t, pos: n, dir: r },
                  a = { ln: i.ln, pos: null },
                  s = "" === i.line;
                for (o(e, i); null !== i.line; ) {
                  if ("" === i.line && !s)
                    return null !== a.pos ? a : { ln: i.ln, pos: i.pos };
                  if (
                    z(i.line[i.pos]) &&
                    null !== a.pos &&
                    (i.ln !== a.ln || i.pos + 1 !== a.pos)
                  )
                    return a;
                  "" === i.line ||
                    U(i.line[i.pos]) ||
                    ((s = !1), (a = { ln: i.ln, pos: i.pos })),
                    o(e, i);
                }
                var c = e.getLine(a.ln);
                a.pos = 0;
                for (var l = 0; l < c.length; ++l)
                  if (!U(c[l])) {
                    a.pos = l;
                    break;
                  }
                return a;
              }
              var s = { ln: t.line, pos: t.ch };
              for (; n > 0; )
                (s = r < 0 ? a(e, s.ln, s.pos, r) : i(e, s.ln, s.pos, r)), n--;
              return new y(s.ln, s.pos);
            })(e, t, n.repeat, r);
          },
          moveByScroll: function (e, t, n, r) {
            var o,
              i = e.getScrollInfo(),
              a = n.repeat;
            a || (a = i.clientHeight / (2 * e.defaultTextHeight()));
            var s = e.charCoords(t, "local");
            if (((n.repeat = a), !(o = de.moveByDisplayLines(e, t, n, r))))
              return null;
            var c = e.charCoords(o, "local");
            return e.scrollTo(null, i.top + c.top - s.top), o;
          },
          moveByWords: function (e, t, n) {
            return (function (e, t, n, r, o, i) {
              var a = we(t),
                s = [];
              ((r && !o) || (!r && o)) && n++;
              for (var c = !(r && o), l = 0; l < n; l++) {
                var u = Fe(e, t, r, i, c);
                if (!u) {
                  var h = Le(e, e.lastLine());
                  s.push(
                    r
                      ? { line: e.lastLine(), from: h, to: h }
                      : { line: 0, from: 0, to: 0 }
                  );
                  break;
                }
                s.push(u), (t = new y(u.line, r ? u.to - 1 : u.from));
              }
              var d = s.length != n,
                p = s[0],
                f = s.pop();
              return r && !o
                ? (d || (p.from == a.ch && p.line == a.line) || (f = s.pop()),
                  new y(f.line, f.from))
                : r && o
                ? new y(f.line, f.to - 1)
                : !r && o
                ? (d || (p.to == a.ch && p.line == a.line) || (f = s.pop()),
                  new y(f.line, f.to))
                : new y(f.line, f.from);
            })(e, t, n.repeat, !!n.forward, !!n.wordEnd, !!n.bigWord);
          },
          moveTillCharacter: function (e, t, n) {
            var r = We(e, n.repeat, n.forward, n.selectedCharacter),
              o = n.forward ? -1 : 1;
            return $e(o, n), r ? ((r.ch += o), r) : null;
          },
          moveToCharacter: function (e, t, n) {
            var r = n.repeat;
            return $e(0, n), We(e, r, n.forward, n.selectedCharacter) || t;
          },
          moveToSymbol: function (e, t, n) {
            return (
              (function (e, t, n, r) {
                var o = we(e.getCursor()),
                  i = n ? 1 : -1,
                  a = n ? e.lineCount() : -1,
                  s = o.ch,
                  c = o.line,
                  l = e.getLine(c),
                  u = {
                    lineText: l,
                    nextCh: l.charAt(s),
                    lastCh: null,
                    index: s,
                    symb: r,
                    reverseSymb: (n
                      ? { ")": "(", "}": "{" }
                      : { "(": ")", "{": "}" })[r],
                    forward: n,
                    depth: 0,
                    curMoveThrough: !1,
                  },
                  h = De[r];
                if (!h) return o;
                var d = Ve[h].init,
                  p = Ve[h].isComplete;
                d && d(u);
                for (; c !== a && t; ) {
                  if (
                    ((u.index += i),
                    (u.nextCh = u.lineText.charAt(u.index)),
                    !u.nextCh)
                  ) {
                    if (((c += i), (u.lineText = e.getLine(c) || ""), i > 0))
                      u.index = 0;
                    else {
                      var f = u.lineText.length;
                      u.index = f > 0 ? f - 1 : 0;
                    }
                    u.nextCh = u.lineText.charAt(u.index);
                  }
                  p(u) && ((o.line = c), (o.ch = u.index), t--);
                }
                if (u.nextCh || u.curMoveThrough) return new y(c, u.index);
                return o;
              })(e, n.repeat, n.forward, n.selectedCharacter) || t
            );
          },
          moveToColumn: function (e, t, n, r) {
            var o = n.repeat;
            return (
              (r.lastHPos = o - 1),
              (r.lastHSPos = e.charCoords(t, "div").left),
              (function (e, t) {
                var n = e.getCursor().line;
                return ge(e, new y(n, t - 1));
              })(e, o)
            );
          },
          moveToEol: function (e, t, n, r) {
            return je(e, t, n, r, !1);
          },
          moveToFirstNonWhiteSpaceCharacter: function (e, t) {
            var n = t;
            return new y(n.line, Ne(e.getLine(n.line)));
          },
          moveToMatchedSymbol: function (e, t) {
            for (
              var n, r = t, o = r.line, i = r.ch, a = e.getLine(o);
              i < a.length;
              i++
            )
              if ((n = a.charAt(i)) && -1 != "()[]{}".indexOf(n)) {
                var s = e.getTokenTypeAt(new y(o, i + 1));
                if ("string" !== s && "comment" !== s) break;
              }
            if (i < a.length) {
              var c = /[<>]/.test(a[i]) ? /[(){}[\]<>]/ : /[(){}[\]]/;
              return e.findMatchingBracket(new y(o, i + 1), { bracketRegex: c })
                .to;
            }
            return r;
          },
          moveToStartOfLine: function (e, t) {
            return new y(t.line, 0);
          },
          moveToLineOrEdgeOfDocument: function (e, t, n) {
            var r = n.forward ? e.lastLine() : e.firstLine();
            return (
              n.repeatIsExplicit &&
                (r = n.repeat - e.getOption("firstLineNumber")),
              new y(r, Ne(e.getLine(r)))
            );
          },
          moveToStartOfDisplayLine: function (e) {
            return e.execCommand("goLineLeft"), e.getCursor();
          },
          moveToEndOfDisplayLine: function (e) {
            e.execCommand("goLineRight");
            var t = e.getCursor();
            return "before" == t.sticky && t.ch--, t;
          },
          textObjectManipulation: function (e, t, n, r) {
            var o = n.selectedCharacter;
            "b" == o ? (o = "(") : "B" == o && (o = "{");
            var i,
              a = !n.textObjectInner;
            if (
              {
                "(": ")",
                ")": "(",
                "{": "}",
                "}": "{",
                "[": "]",
                "]": "[",
                "<": ">",
                ">": "<",
              }[o]
            )
              i = (function (e, t, n, r) {
                var o,
                  i,
                  a = t,
                  s = {
                    "(": /[()]/,
                    ")": /[()]/,
                    "[": /[[\]]/,
                    "]": /[[\]]/,
                    "{": /[{}]/,
                    "}": /[{}]/,
                    "<": /[<>]/,
                    ">": /[<>]/,
                  }[n],
                  c = {
                    "(": "(",
                    ")": "(",
                    "[": "[",
                    "]": "[",
                    "{": "{",
                    "}": "{",
                    "<": "<",
                    ">": "<",
                  }[n],
                  l = e.getLine(a.line).charAt(a.ch),
                  u = l === c ? 1 : 0;
                if (
                  ((o = e.scanForBracket(new y(a.line, a.ch + u), -1, void 0, {
                    bracketRegex: s,
                  })),
                  (i = e.scanForBracket(new y(a.line, a.ch + u), 1, void 0, {
                    bracketRegex: s,
                  })),
                  !o || !i)
                )
                  return { start: a, end: a };
                if (
                  ((o = o.pos),
                  (i = i.pos),
                  (o.line == i.line && o.ch > i.ch) || o.line > i.line)
                ) {
                  var h = o;
                  (o = i), (i = h);
                }
                r ? (i.ch += 1) : (o.ch += 1);
                return { start: o, end: i };
              })(e, t, o, a);
            else if ({ "'": !0, '"': !0, "`": !0 }[o])
              i = (function (e, t, n, r) {
                var o,
                  i,
                  a,
                  s,
                  c = we(t),
                  l = e.getLine(c.line),
                  u = l.split(""),
                  h = u.indexOf(n);
                c.ch < h
                  ? (c.ch = h)
                  : h < c.ch && u[c.ch] == n && ((i = c.ch), --c.ch);
                if (u[c.ch] != n || i)
                  for (a = c.ch; a > -1 && !o; a--) u[a] == n && (o = a + 1);
                else o = c.ch + 1;
                if (o && !i)
                  for (a = o, s = u.length; a < s && !i; a++)
                    u[a] == n && (i = a);
                if (!o || !i) return { start: c, end: c };
                r && (--o, ++i);
                return { start: new y(c.line, o), end: new y(c.line, i) };
              })(e, t, o, a);
            else if ("W" === o) i = _e(e, a, !0, !0);
            else if ("w" === o) i = _e(e, a, !0, !1);
            else if ("p" === o)
              if (
                ((i = Je(e, t, n.repeat, 0, a)),
                (n.linewise = !0),
                r.visualMode)
              )
                r.visualLine || (r.visualLine = !0);
              else {
                var s = r.inputState.operatorArgs;
                s && (s.linewise = !0), i.end.line--;
              }
            else if ("t" === o)
              i = (function (e, t, n) {
                var r = t;
                if (!m.findMatchingTag || !m.findEnclosingTag)
                  return { start: r, end: r };
                var o = m.findMatchingTag(e, t) || m.findEnclosingTag(e, t);
                if (!o || !o.open || !o.close) return { start: r, end: r };
                if (n) return { start: o.open.from, end: o.close.to };
                return { start: o.open.to, end: o.close.from };
              })(e, t, a);
            else {
              if ("s" !== o) return null;
              var c = e.getLine(t.line);
              t.ch > 0 && z(c[t.ch]) && (t.ch -= 1);
              var l = qe(e, t, n.repeat, 1, a),
                u = qe(e, t, n.repeat, -1, a);
              U(e.getLine(u.line)[u.ch]) &&
                U(e.getLine(l.line)[l.ch - 1]) &&
                (u = { line: u.line, ch: u.ch + 1 }),
                (i = { start: u, end: l });
            }
            return e.state.vim.visualMode
              ? (function (e, t, n) {
                  var r,
                    o = e.state.vim.sel,
                    i = o.head,
                    a = o.anchor;
                  Se(n, t) && ((r = n), (n = t), (t = r));
                  Se(i, a)
                    ? ((i = Me(t, i)), (a = Ae(a, n)))
                    : ((a = Me(t, a)),
                      -1 == (i = ye((i = Ae(i, n)), 0, -1)).ch &&
                        i.line != e.firstLine() &&
                        (i = new y(i.line - 1, Le(e, i.line - 1))));
                  return [a, i];
                })(e, i.start, i.end)
              : [i.start, i.end];
          },
          repeatLastCharacterSearch: function (e, t, n) {
            var r = Z.lastCharacterSearch,
              o = n.repeat,
              i = n.forward === r.forward,
              a = (r.increment ? 1 : 0) * (i ? -1 : 1);
            e.moveH(-a, "char"), (n.inclusive = !!i);
            var s = We(e, o, i, r.selectedCharacter);
            return s ? ((s.ch += a), s) : (e.moveH(a, "char"), t);
          },
        };
      function pe(e, t) {
        for (var n = [], r = 0; r < t; r++) n.push(e);
        return n;
      }
      var fe = {
        change: function (e, t, n) {
          var r,
            o,
            i = e.state.vim,
            a = n[0].anchor,
            s = n[0].head;
          if (i.visualMode)
            if (t.fullLine)
              (s.ch = Number.MAX_VALUE),
                s.line--,
                e.setSelection(a, s),
                (o = e.getSelection()),
                e.replaceSelection(""),
                (r = a);
            else {
              o = e.getSelection();
              var c = pe("", n.length);
              e.replaceSelections(c), (r = Me(n[0].head, n[0].anchor));
            }
          else {
            o = e.getRange(a, s);
            var l = i.lastEditInputState || {};
            if ("moveByWords" == l.motion && !U(o)) {
              var u = /\s+$/.exec(o);
              u &&
                l.motionArgs &&
                l.motionArgs.forward &&
                ((s = ye(s, 0, -u[0].length)), (o = o.slice(0, -u[0].length)));
            }
            var h = new y(a.line - 1, Number.MAX_VALUE),
              d = e.firstLine() == e.lastLine();
            s.line > e.lastLine() && t.linewise && !d
              ? e.replaceRange("", h, s)
              : e.replaceRange("", a, s),
              t.linewise &&
                (d || (e.setCursor(h), m.commands.newlineAndIndent(e)),
                (a.ch = Number.MAX_VALUE)),
              (r = a);
          }
          Z.registerController.pushText(
            t.registerName,
            "change",
            o,
            t.linewise,
            n.length > 1
          ),
            me.enterInsertMode(e, { head: r }, e.state.vim);
        },
        delete: function (e, t, n) {
          var r,
            o,
            i = e.state.vim;
          if (i.visualBlock) {
            o = e.getSelection();
            var a = pe("", n.length);
            e.replaceSelections(a), (r = Me(n[0].head, n[0].anchor));
          } else {
            var s = n[0].anchor,
              c = n[0].head;
            t.linewise &&
              c.line != e.firstLine() &&
              s.line == e.lastLine() &&
              s.line == c.line - 1 &&
              (s.line == e.firstLine()
                ? (s.ch = 0)
                : (s = new y(s.line - 1, Le(e, s.line - 1)))),
              (o = e.getRange(s, c)),
              e.replaceRange("", s, c),
              (r = s),
              t.linewise && (r = de.moveToFirstNonWhiteSpaceCharacter(e, s));
          }
          return (
            Z.registerController.pushText(
              t.registerName,
              "delete",
              o,
              t.linewise,
              i.visualBlock
            ),
            ge(e, r)
          );
        },
        indent: function (e, t, n) {
          var r = e.state.vim;
          if (e.indentMore)
            for (var o = r.visualMode ? t.repeat : 1, i = 0; i < o; i++)
              t.indentRight ? e.indentMore() : e.indentLess();
          else {
            var a = n[0].anchor.line,
              s = r.visualBlock ? n[n.length - 1].anchor.line : n[0].head.line;
            o = r.visualMode ? t.repeat : 1;
            t.linewise && s--;
            for (var c = a; c <= s; c++)
              for (i = 0; i < o; i++) e.indentLine(c, t.indentRight);
          }
          return de.moveToFirstNonWhiteSpaceCharacter(e, n[0].anchor);
        },
        indentAuto: function (e, t, n) {
          return (
            n.length > 1 && e.setSelection(n[0].anchor, n[n.length - 1].head),
            e.execCommand("indentAuto"),
            de.moveToFirstNonWhiteSpaceCharacter(e, n[0].anchor)
          );
        },
        changeCase: function (e, t, n, r, o) {
          for (
            var i = e.getSelections(), a = [], s = t.toLower, c = 0;
            c < i.length;
            c++
          ) {
            var l = i[c],
              u = "";
            if (!0 === s) u = l.toLowerCase();
            else if (!1 === s) u = l.toUpperCase();
            else
              for (var h = 0; h < l.length; h++) {
                var d = l.charAt(h);
                u += W(d) ? d.toLowerCase() : d.toUpperCase();
              }
            a.push(u);
          }
          return (
            e.replaceSelections(a),
            t.shouldMoveCursor
              ? o
              : !e.state.vim.visualMode &&
                t.linewise &&
                n[0].anchor.line + 1 == n[0].head.line
              ? de.moveToFirstNonWhiteSpaceCharacter(e, r)
              : t.linewise
              ? r
              : Me(n[0].anchor, n[0].head)
          );
        },
        yank: function (e, t, n, r) {
          var o = e.state.vim,
            i = e.getSelection(),
            a = o.visualMode
              ? Me(o.sel.anchor, o.sel.head, n[0].head, n[0].anchor)
              : r;
          return (
            Z.registerController.pushText(
              t.registerName,
              "yank",
              i,
              t.linewise,
              o.visualBlock
            ),
            a
          );
        },
      };
      var me = {
        jumpListWalk: function (e, t, n) {
          if (!n.visualMode) {
            var r = t.repeat,
              o = t.forward,
              i = Z.jumpList.move(e, o ? r : -r),
              a = i ? i.find() : void 0;
            (a = a || e.getCursor()),
              e.setCursor(a),
              (e.ace.curOp.command.scrollIntoView = "center-animate");
          }
        },
        scroll: function (e, t, n) {
          if (!n.visualMode) {
            var r = t.repeat || 1,
              o = e.defaultTextHeight(),
              i = e.getScrollInfo().top,
              a = o * r,
              s = t.forward ? i + a : i - a,
              c = we(e.getCursor()),
              l = e.charCoords(c, "local");
            if (t.forward)
              s > l.top
                ? ((c.line += (s - l.top) / o),
                  (c.line = Math.ceil(c.line)),
                  e.setCursor(c),
                  (l = e.charCoords(c, "local")),
                  e.scrollTo(null, l.top))
                : e.scrollTo(null, s);
            else {
              var u = s + e.getScrollInfo().clientHeight;
              u < l.bottom
                ? ((c.line -= (l.bottom - u) / o),
                  (c.line = Math.floor(c.line)),
                  e.setCursor(c),
                  (l = e.charCoords(c, "local")),
                  e.scrollTo(null, l.bottom - e.getScrollInfo().clientHeight))
                : e.scrollTo(null, s);
            }
          }
        },
        scrollToCursor: function (e, t) {
          var n = e.getCursor().line,
            r = e.charCoords(new y(n, 0), "local"),
            o = e.getScrollInfo().clientHeight,
            i = r.top;
          switch (t.position) {
            case "center":
              i = r.bottom - o / 2;
              break;
            case "bottom":
              var a = new y(n, e.getLine(n).length - 1);
              i = i - o + (e.charCoords(a, "local").bottom - i);
          }
          e.scrollTo(null, i);
        },
        replayMacro: function (e, t, n) {
          var r = t.selectedCharacter,
            o = t.repeat,
            i = Z.macroModeState;
          for (
            "@" == r ? (r = i.latestRegister) : (i.latestRegister = r);
            o--;

          )
            Ct(e, n, i, r);
        },
        enterMacroRecordMode: function (e, t) {
          var n = Z.macroModeState,
            r = t.selectedCharacter;
          Z.registerController.isValidRegister(r) &&
            n.enterMacroRecordMode(e, r);
        },
        toggleOverwrite: function (e) {
          e.state.overwrite
            ? (e.toggleOverwrite(!1),
              e.setOption("keyMap", "vim-insert"),
              m.signal(e, "vim-mode-change", { mode: "insert" }))
            : (e.toggleOverwrite(!0),
              e.setOption("keyMap", "vim-replace"),
              m.signal(e, "vim-mode-change", { mode: "replace" }));
        },
        enterInsertMode: function (e, t, n) {
          if (!e.getOption("readOnly")) {
            (n.insertMode = !0), (n.insertModeRepeat = (t && t.repeat) || 1);
            var r = t ? t.insertAt : null,
              o = n.sel,
              i = t.head || e.getCursor("head"),
              a = e.listSelections().length;
            if ("eol" == r) i = new y(i.line, Le(e, i.line));
            else if ("bol" == r) i = new y(i.line, 0);
            else if ("charAfter" == r) {
              i = k(e, i, ye(i, 0, 1)).end;
            } else if ("firstNonBlank" == r) {
              i = k(e, i, de.moveToFirstNonWhiteSpaceCharacter(e, i)).end;
            } else if ("startOfSelectedArea" == r) {
              if (!n.visualMode) return;
              n.visualBlock
                ? ((i = new y(
                    Math.min(o.head.line, o.anchor.line),
                    Math.min(o.head.ch, o.anchor.ch)
                  )),
                  (a = Math.abs(o.head.line - o.anchor.line) + 1))
                : (i =
                    o.head.line < o.anchor.line
                      ? o.head
                      : new y(o.anchor.line, 0));
            } else if ("endOfSelectedArea" == r) {
              if (!n.visualMode) return;
              n.visualBlock
                ? ((i = new y(
                    Math.min(o.head.line, o.anchor.line),
                    Math.max(o.head.ch, o.anchor.ch) + 1
                  )),
                  (a = Math.abs(o.head.line - o.anchor.line) + 1))
                : (i =
                    o.head.line >= o.anchor.line
                      ? ye(o.head, 0, 1)
                      : new y(o.anchor.line, 0));
            } else if ("inplace" == r) {
              if (n.visualMode) return;
            } else "lastEdit" == r && (i = pt(e) || i);
            e.setOption("disableInput", !1),
              t && t.replace
                ? (e.toggleOverwrite(!0),
                  e.setOption("keyMap", "vim-replace"),
                  m.signal(e, "vim-mode-change", { mode: "replace" }))
                : (e.toggleOverwrite(!1),
                  e.setOption("keyMap", "vim-insert"),
                  m.signal(e, "vim-mode-change", { mode: "insert" })),
              Z.macroModeState.isPlaying ||
                (e.on("change", kt), m.on(e.getInputField(), "keydown", Mt)),
              n.visualMode && Pe(e),
              Re(e, i, a);
          }
        },
        toggleVisualMode: function (e, t, n) {
          var r,
            o = t.repeat,
            i = e.getCursor();
          if (n.visualMode)
            n.visualLine ^ t.linewise || n.visualBlock ^ t.blockwise
              ? ((n.visualLine = !!t.linewise),
                (n.visualBlock = !!t.blockwise),
                m.signal(e, "vim-mode-change", {
                  mode: "visual",
                  subMode: n.visualLine
                    ? "linewise"
                    : n.visualBlock
                    ? "blockwise"
                    : "",
                }),
                Ie(e))
              : Pe(e);
          else {
            (n.visualMode = !0),
              (n.visualLine = !!t.linewise),
              (n.visualBlock = !!t.blockwise);
            var a = k(e, i, (r = ge(e, new y(i.line, i.ch + o - 1))));
            (n.sel = { anchor: a.start, head: a.end }),
              m.signal(e, "vim-mode-change", {
                mode: "visual",
                subMode: n.visualLine
                  ? "linewise"
                  : n.visualBlock
                  ? "blockwise"
                  : "",
              }),
              Ie(e),
              Ue(e, n, "<", Me(i, r)),
              Ue(e, n, ">", Ae(i, r));
          }
        },
        reselectLastSelection: function (e, t, n) {
          var r = n.lastSelection;
          if ((n.visualMode && Be(e, n), r)) {
            var o = r.anchorMark.find(),
              i = r.headMark.find();
            if (!o || !i) return;
            (n.sel = { anchor: o, head: i }),
              (n.visualMode = !0),
              (n.visualLine = r.visualLine),
              (n.visualBlock = r.visualBlock),
              Ie(e),
              Ue(e, n, "<", Me(o, i)),
              Ue(e, n, ">", Ae(o, i)),
              m.signal(e, "vim-mode-change", {
                mode: "visual",
                subMode: n.visualLine
                  ? "linewise"
                  : n.visualBlock
                  ? "blockwise"
                  : "",
              });
          }
        },
        joinLines: function (e, t, n) {
          var r, o;
          if (n.visualMode) {
            if (
              ((r = e.getCursor("anchor")), Se((o = e.getCursor("head")), r))
            ) {
              var i = o;
              (o = r), (r = i);
            }
            o.ch = Le(e, o.line) - 1;
          } else {
            var a = Math.max(t.repeat, 2);
            (r = e.getCursor()), (o = ge(e, new y(r.line + a - 1, 1 / 0)));
          }
          for (var s = 0, c = r.line; c < o.line; c++) {
            s = Le(e, r.line);
            var l = "",
              u = 0;
            if (!t.keepSpaces) {
              var h = e.getLine(r.line + 1);
              -1 == (u = h.search(/\S/)) ? (u = h.length) : (l = " ");
            }
            e.replaceRange(l, new y(r.line, s), new y(r.line + 1, u));
          }
          var d = ge(e, new y(r.line, s));
          n.visualMode && Pe(e, !1), e.setCursor(d);
        },
        newLineAndEnterInsertMode: function (e, t, n) {
          n.insertMode = !0;
          var r = we(e.getCursor());
          r.line !== e.firstLine() || t.after
            ? ((r.line = t.after ? r.line : r.line - 1),
              (r.ch = Le(e, r.line)),
              e.setCursor(r),
              (
                m.commands.newlineAndIndentContinueComment ||
                m.commands.newlineAndIndent
              )(e))
            : (e.replaceRange("\n", new y(e.firstLine(), 0)),
              e.setCursor(e.firstLine(), 0));
          this.enterInsertMode(e, { repeat: t.repeat }, n);
        },
        paste: function (e, t, n) {
          var r = this,
            o = Z.registerController.getRegister(t.registerName),
            i = function () {
              var i = o.toString();
              r.continuePaste(e, t, n, i, o);
            };
          "+" === t.registerName &&
          "undefined" !== typeof navigator &&
          "undefined" !== typeof navigator.clipboard &&
          "function" === typeof navigator.clipboard.readText
            ? navigator.clipboard.readText().then(
                function (i) {
                  r.continuePaste(e, t, n, i, o);
                },
                function () {
                  i();
                }
              )
            : i();
        },
        continuePaste: function (e, t, n, r, o) {
          var i = we(e.getCursor());
          if (r) {
            if (t.matchIndent) {
              var a = e.getOption("tabSize"),
                s = function (e) {
                  var t = e.split("\t").length - 1,
                    n = e.split(" ").length - 1;
                  return t * a + 1 * n;
                },
                c = e.getLine(e.getCursor().line),
                l = s(c.match(/^\s*/)[0]),
                u = r.replace(/\n$/, ""),
                h = r !== u,
                d = s(r.match(/^\s*/)[0]);
              r = u.replace(/^\s*/gm, function (t) {
                var n = l + (s(t) - d);
                if (n < 0) return "";
                if (e.getOption("indentWithTabs")) {
                  var r = Math.floor(n / a);
                  return Array(r + 1).join("\t");
                }
                return Array(n + 1).join(" ");
              });
              r += h ? "\n" : "";
            }
            if (t.repeat > 1) r = Array(t.repeat + 1).join(r);
            var p,
              f,
              m = o.linewise,
              g = o.blockwise;
            if (g) {
              (r = r.split("\n")), m && r.pop();
              for (var v = 0; v < r.length; v++) r[v] = "" == r[v] ? " " : r[v];
              (i.ch += t.after ? 1 : 0), (i.ch = Math.min(Le(e, i.line), i.ch));
            } else
              m
                ? n.visualMode
                  ? (r = n.visualLine
                      ? r.slice(0, -1)
                      : "\n" + r.slice(0, r.length - 1) + "\n")
                  : t.after
                  ? ((r = "\n" + r.slice(0, r.length - 1)),
                    (i.ch = Le(e, i.line)))
                  : (i.ch = 0)
                : (i.ch += t.after ? 1 : 0);
            if (n.visualMode) {
              var C;
              n.lastPastedText = r;
              var k = (function (e, t) {
                  var n = t.lastSelection,
                    r = function () {
                      var t = e.listSelections(),
                        n = t[0],
                        r = t[t.length - 1];
                      return [
                        Se(n.anchor, n.head) ? n.anchor : n.head,
                        Se(r.anchor, r.head) ? r.head : r.anchor,
                      ];
                    },
                    o = function () {
                      var t = e.getCursor(),
                        r = e.getCursor(),
                        o = n.visualBlock;
                      if (o) {
                        var i = o.width,
                          a = o.height;
                        r = new y(t.line + a, t.ch + i);
                        for (var s = [], c = t.line; c < r.line; c++) {
                          var l = {
                            anchor: new y(c, t.ch),
                            head: new y(c, r.ch),
                          };
                          s.push(l);
                        }
                        e.setSelections(s);
                      } else {
                        var u = n.anchorMark.find(),
                          h = n.headMark.find(),
                          d = h.line - u.line,
                          p = h.ch - u.ch;
                        (r = { line: r.line + d, ch: d ? r.ch : p + r.ch }),
                          n.visualLine &&
                            ((t = new y(t.line, 0)),
                            (r = new y(r.line, Le(e, r.line)))),
                          e.setSelection(t, r);
                      }
                      return [t, r];
                    };
                  return t.visualMode ? r() : o();
                })(e, n),
                w = k[0],
                x = k[1],
                S = e.getSelection(),
                M = e.listSelections(),
                A = new Array(M.length).join("1").split("1");
              n.lastSelection && (C = n.lastSelection.headMark.find()),
                Z.registerController.unnamedRegister.setText(S),
                g
                  ? (e.replaceSelections(A),
                    (x = new y(w.line + r.length - 1, w.ch)),
                    e.setCursor(w),
                    Ee(e, x),
                    e.replaceSelections(r),
                    (p = w))
                  : n.visualBlock
                  ? (e.replaceSelections(A),
                    e.setCursor(w),
                    e.replaceRange(r, w, w),
                    (p = w))
                  : (e.replaceRange(r, w, x),
                    (p = e.posFromIndex(e.indexFromPos(w) + r.length - 1))),
                C && (n.lastSelection.headMark = e.setBookmark(C)),
                m && (p.ch = 0);
            } else if (g) {
              e.setCursor(i);
              for (v = 0; v < r.length; v++) {
                var b = i.line + v;
                b > e.lastLine() && e.replaceRange("\n", new y(b, 0)),
                  Le(e, b) < i.ch && Te(e, b, i.ch);
              }
              e.setCursor(i),
                Ee(e, new y(i.line + r.length - 1, i.ch)),
                e.replaceSelections(r),
                (p = i);
            } else
              e.replaceRange(r, i),
                m && t.after
                  ? (p = new y(i.line + 1, Ne(e.getLine(i.line + 1))))
                  : m && !t.after
                  ? (p = new y(i.line, Ne(e.getLine(i.line))))
                  : !m && t.after
                  ? ((f = e.indexFromPos(i)),
                    (p = e.posFromIndex(f + r.length - 1)))
                  : ((f = e.indexFromPos(i)),
                    (p = e.posFromIndex(f + r.length)));
            n.visualMode && Pe(e, !1), e.setCursor(p);
          }
        },
        undo: function (e, t) {
          e.operation(function () {
            ke(e, m.commands.undo, t.repeat)(),
              e.setCursor(ge(e, e.getCursor("start")));
          });
        },
        redo: function (e, t) {
          ke(e, m.commands.redo, t.repeat)();
        },
        setRegister: function (e, t, n) {
          n.inputState.registerName = t.selectedCharacter;
        },
        setMark: function (e, t, n) {
          Ue(e, n, t.selectedCharacter, e.getCursor());
        },
        replace: function (e, t, n) {
          var r,
            o,
            i = t.selectedCharacter,
            a = e.getCursor(),
            s = e.listSelections();
          if (n.visualMode)
            (a = e.getCursor("start")), (o = e.getCursor("end"));
          else {
            var c = e.getLine(a.line);
            (r = a.ch + t.repeat) > c.length && (r = c.length),
              (o = new y(a.line, r));
          }
          var l = k(e, a, o);
          if (((a = l.start), (o = l.end), "\n" == i))
            n.visualMode || e.replaceRange("", a, o),
              (
                m.commands.newlineAndIndentContinueComment ||
                m.commands.newlineAndIndent
              )(e);
          else {
            var u = e.getRange(a, o);
            if (
              ((u = (u = u.replace(
                /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                i
              )).replace(/[^\n]/g, i)),
              n.visualBlock)
            ) {
              var h = new Array(e.getOption("tabSize") + 1).join(" ");
              (u = (u = (u = e.getSelection()).replace(
                /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                i
              ))
                .replace(/\t/g, h)
                .replace(/[^\n]/g, i)
                .split("\n")),
                e.replaceSelections(u);
            } else e.replaceRange(u, a, o);
            n.visualMode
              ? ((a = Se(s[0].anchor, s[0].head) ? s[0].anchor : s[0].head),
                e.setCursor(a),
                Pe(e, !1))
              : e.setCursor(ye(o, 0, -1));
          }
        },
        incrementNumberToken: function (e, t) {
          for (
            var n,
              r,
              o,
              i,
              a = e.getCursor(),
              s = e.getLine(a.line),
              c = /(-?)(?:(0x)([\da-f]+)|(0b|0|)(\d+))/gi;
            null !== (n = c.exec(s)) &&
            ((o = (r = n.index) + n[0].length), !(a.ch < o));

          );
          if ((t.backtrack || !(o <= a.ch)) && n) {
            var l = n[2] || n[4],
              u = n[3] || n[5],
              h = t.increase ? 1 : -1,
              d = { "0b": 2, 0: 8, "": 10, "0x": 16 }[l.toLowerCase()];
            i = (parseInt(n[1] + u, d) + h * t.repeat).toString(d);
            var p = l
              ? new Array(u.length - i.length + 1 + n[1].length).join("0")
              : "";
            i = "-" === i.charAt(0) ? "-" + l + p + i.substr(1) : l + p + i;
            var f = new y(a.line, r),
              m = new y(a.line, o);
            e.replaceRange(i, f, m),
              e.setCursor(new y(a.line, r + i.length - 1));
          }
        },
        repeatLastEdit: function (e, t, n) {
          if (n.lastEditInputState) {
            var r = t.repeat;
            r && t.repeatIsExplicit
              ? (n.lastEditInputState.repeatOverride = r)
              : (r = n.lastEditInputState.repeatOverride || r),
              At(e, n, r, !1);
          }
        },
        indent: function (e, t) {
          e.indentLine(e.getCursor().line, t.indentRight);
        },
        exitInsertMode: vt,
      };
      function ge(e, t, n) {
        var r = e.state.vim,
          o = r.insertMode || r.visualMode,
          i = Math.min(Math.max(e.firstLine(), t.line), e.lastLine()),
          a = e.getLine(i),
          s = a.length - 1 + !!o,
          c = Math.min(Math.max(0, t.ch), s),
          l = a.charCodeAt(c);
        if (56320 < l && l < 57343) {
          var u = 1;
          n && n.line == i && n.ch > c && (u = -1), (c += u) > s && (c -= 2);
        }
        return new y(i, c);
      }
      function ve(e) {
        var t = {};
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        return t;
      }
      function ye(e, t, n) {
        return (
          "object" === typeof t && ((n = t.ch), (t = t.line)),
          new y(e.line + t, e.ch + n)
        );
      }
      function Ce(e, t) {
        if ("<character>" == t.slice(-11)) {
          var n = t.length - 11,
            r = e.slice(0, n),
            o = t.slice(0, n);
          return r == o && e.length > n
            ? "full"
            : 0 == o.indexOf(r) && "partial";
        }
        return e == t ? "full" : 0 == t.indexOf(e) && "partial";
      }
      function ke(e, t, n) {
        return function () {
          for (var r = 0; r < n; r++) t(e);
        };
      }
      function we(e) {
        return new y(e.line, e.ch);
      }
      function xe(e, t) {
        return e.ch == t.ch && e.line == t.line;
      }
      function Se(e, t) {
        return e.line < t.line || (e.line == t.line && e.ch < t.ch);
      }
      function Me(e, t) {
        return (
          arguments.length > 2 &&
            (t = Me.apply(void 0, Array.prototype.slice.call(arguments, 1))),
          Se(e, t) ? e : t
        );
      }
      function Ae(e, t) {
        return (
          arguments.length > 2 &&
            (t = Ae.apply(void 0, Array.prototype.slice.call(arguments, 1))),
          Se(e, t) ? t : e
        );
      }
      function be(e, t, n) {
        var r = Se(e, t),
          o = Se(t, n);
        return r && o;
      }
      function Le(e, t) {
        return e.getLine(t).length;
      }
      function Oe(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
      }
      function Te(e, t, n) {
        var r = Le(e, t),
          o = new Array(n - r + 1).join(" ");
        e.setCursor(new y(t, r)), e.replaceRange(o, e.getCursor());
      }
      function Ee(e, t) {
        var n = [],
          r = e.listSelections(),
          o = we(e.clipPos(t)),
          i = !xe(t, o),
          a = (function (e, t, n) {
            for (var r = 0; r < e.length; r++) {
              var o = "head" != n && xe(e[r].anchor, t),
                i = "anchor" != n && xe(e[r].head, t);
              if (o || i) return r;
            }
            return -1;
          })(r, e.getCursor("head")),
          s = xe(r[a].head, r[a].anchor),
          c = r.length - 1,
          l = c - a > a ? c : 0,
          u = r[l].anchor,
          h = Math.min(u.line, o.line),
          d = Math.max(u.line, o.line),
          p = u.ch,
          f = o.ch,
          m = r[l].head.ch - p,
          g = f - p;
        m > 0 && g <= 0
          ? (p++, i || f--)
          : m < 0 && g >= 0
          ? (p--, s || f++)
          : m < 0 && -1 == g && (p--, f++);
        for (var v = h; v <= d; v++) {
          var C = { anchor: new y(v, p), head: new y(v, f) };
          n.push(C);
        }
        return e.setSelections(n), (t.ch = f), (u.ch = p), u;
      }
      function Re(e, t, n) {
        for (var r = [], o = 0; o < n; o++) {
          var i = ye(t, o, 0);
          r.push({ anchor: i, head: i });
        }
        e.setSelections(r, 0);
      }
      function Be(e, t) {
        var n = t.sel.anchor,
          r = t.sel.head;
        t.lastPastedText &&
          ((r = e.posFromIndex(e.indexFromPos(n) + t.lastPastedText.length)),
          (t.lastPastedText = null)),
          (t.lastSelection = {
            anchorMark: e.setBookmark(n),
            headMark: e.setBookmark(r),
            anchor: we(n),
            head: we(r),
            visualMode: t.visualMode,
            visualLine: t.visualLine,
            visualBlock: t.visualBlock,
          });
      }
      function Ie(e, t, n) {
        var r = e.state.vim,
          o = Ke(
            e,
            (t = t || r.sel),
            (n = n || r.visualLine ? "line" : r.visualBlock ? "block" : "char")
          );
        e.setSelections(o.ranges, o.primary);
      }
      function Ke(e, t, n, r) {
        var o = we(t.head),
          i = we(t.anchor);
        if ("char" == n) {
          var a = r || Se(t.head, t.anchor) ? 0 : 1,
            s = Se(t.head, t.anchor) ? 1 : 0;
          return (
            (o = ye(t.head, 0, a)),
            {
              ranges: [{ anchor: (i = ye(t.anchor, 0, s)), head: o }],
              primary: 0,
            }
          );
        }
        if ("line" == n) {
          if (Se(t.head, t.anchor)) (o.ch = 0), (i.ch = Le(e, i.line));
          else {
            i.ch = 0;
            var c = e.lastLine();
            o.line > c && (o.line = c), (o.ch = Le(e, o.line));
          }
          return { ranges: [{ anchor: i, head: o }], primary: 0 };
        }
        if ("block" == n) {
          var l = Math.min(i.line, o.line),
            u = i.ch,
            h = Math.max(i.line, o.line),
            d = o.ch;
          u < d ? (d += 1) : (u += 1);
          for (
            var p = h - l + 1, f = o.line == l ? 0 : p - 1, m = [], g = 0;
            g < p;
            g++
          )
            m.push({ anchor: new y(l + g, u), head: new y(l + g, d) });
          return { ranges: m, primary: f };
        }
      }
      function Pe(e, t) {
        var n = e.state.vim;
        !1 !== t && e.setCursor(ge(e, n.sel.head)),
          Be(e, n),
          (n.visualMode = !1),
          (n.visualLine = !1),
          (n.visualBlock = !1),
          n.insertMode || m.signal(e, "vim-mode-change", { mode: "normal" });
      }
      function Ne(e) {
        if (!e) return 0;
        var t = e.search(/\S/);
        return -1 == t ? e.length : t;
      }
      function _e(e, t, n, r, o) {
        for (
          var i = (function (e) {
              var t = e.getCursor("head");
              return (
                1 == e.getSelection().length &&
                  (t = Me(t, e.getCursor("anchor"))),
                t
              );
            })(e),
            a = e.getLine(i.line),
            s = i.ch,
            c = o ? I[0] : K[0];
          !c(a.charAt(s));

        )
          if (++s >= a.length) return null;
        r ? (c = K[0]) : (c = I[0])(a.charAt(s)) || (c = I[1]);
        for (var l = s, u = s; c(a.charAt(l)) && l < a.length; ) l++;
        for (; c(a.charAt(u)) && u >= 0; ) u--;
        if ((u++, t)) {
          for (var h = l; /\s/.test(a.charAt(l)) && l < a.length; ) l++;
          if (h == l) {
            for (var d = u; /\s/.test(a.charAt(u - 1)) && u > 0; ) u--;
            u || (u = d);
          }
        }
        return { start: new y(i.line, u), end: new y(i.line, l) };
      }
      function He(e, t, n) {
        xe(t, n) || Z.jumpList.add(e, t, n);
      }
      function $e(e, t) {
        (Z.lastCharacterSearch.increment = e),
          (Z.lastCharacterSearch.forward = t.forward),
          (Z.lastCharacterSearch.selectedCharacter = t.selectedCharacter);
      }
      var De = {
          "(": "bracket",
          ")": "bracket",
          "{": "bracket",
          "}": "bracket",
          "[": "section",
          "]": "section",
          "*": "comment",
          "/": "comment",
          m: "method",
          M: "method",
          "#": "preprocess",
        },
        Ve = {
          bracket: {
            isComplete: function (e) {
              if (e.nextCh === e.symb) {
                if ((e.depth++, e.depth >= 1)) return !0;
              } else e.nextCh === e.reverseSymb && e.depth--;
              return !1;
            },
          },
          section: {
            init: function (e) {
              (e.curMoveThrough = !0),
                (e.symb = (e.forward ? "]" : "[") === e.symb ? "{" : "}");
            },
            isComplete: function (e) {
              return 0 === e.index && e.nextCh === e.symb;
            },
          },
          comment: {
            isComplete: function (e) {
              var t = "*" === e.lastCh && "/" === e.nextCh;
              return (e.lastCh = e.nextCh), t;
            },
          },
          method: {
            init: function (e) {
              (e.symb = "m" === e.symb ? "{" : "}"),
                (e.reverseSymb = "{" === e.symb ? "}" : "{");
            },
            isComplete: function (e) {
              return e.nextCh === e.symb;
            },
          },
          preprocess: {
            init: function (e) {
              e.index = 0;
            },
            isComplete: function (e) {
              if ("#" === e.nextCh) {
                var t = e.lineText.match(/^#(\w+)/)[1];
                if ("endif" === t) {
                  if (e.forward && 0 === e.depth) return !0;
                  e.depth++;
                } else if ("if" === t) {
                  if (!e.forward && 0 === e.depth) return !0;
                  e.depth--;
                }
                if ("else" === t && 0 === e.depth) return !0;
              }
              return !1;
            },
          },
        };
      function Fe(e, t, n, r, o) {
        var i = t.line,
          a = t.ch,
          s = e.getLine(i),
          c = n ? 1 : -1,
          l = r ? K : I;
        if (o && "" == s) {
          if (((i += c), (s = e.getLine(i)), !F(e, i))) return null;
          a = n ? 0 : s.length;
        }
        for (;;) {
          if (o && "" == s) return { from: 0, to: 0, line: i };
          for (var u = c > 0 ? s.length : -1, h = u, d = u; a != u; ) {
            for (var p = !1, f = 0; f < l.length && !p; ++f)
              if (l[f](s.charAt(a))) {
                for (h = a; a != u && l[f](s.charAt(a)); ) a += c;
                if (
                  ((p = h != (d = a)), h == t.ch && i == t.line && d == h + c)
                )
                  continue;
                return {
                  from: Math.min(h, d + 1),
                  to: Math.max(h, d),
                  line: i,
                };
              }
            p || (a += c);
          }
          if (!F(e, (i += c))) return null;
          (s = e.getLine(i)), (a = c > 0 ? 0 : s.length);
        }
      }
      function je(e, t, n, r, o) {
        var i = new y(t.line + n.repeat - 1, 1 / 0),
          a = e.clipPos(i);
        return (
          a.ch--,
          o ||
            ((r.lastHPos = 1 / 0), (r.lastHSPos = e.charCoords(a, "div").left)),
          i
        );
      }
      function We(e, t, n, r) {
        for (var o, i = e.getCursor(), a = i.ch, s = 0; s < t; s++) {
          if (-1 == (o = ze(a, e.getLine(i.line), r, n, !0))) return null;
          a = o;
        }
        return new y(e.getCursor().line, o);
      }
      function Ue(e, t, n, r) {
        J(n, D) &&
          (t.marks[n] && t.marks[n].clear(), (t.marks[n] = e.setBookmark(r)));
      }
      function ze(e, t, n, r, o) {
        var i;
        return (
          r
            ? -1 == (i = t.indexOf(n, e + 1)) || o || (i -= 1)
            : -1 == (i = t.lastIndexOf(n, e - 1)) || o || (i += 1),
          i
        );
      }
      function Je(e, t, n, r, o) {
        var i,
          a = t.line,
          s = e.firstLine(),
          c = e.lastLine(),
          l = a;
        function u(t) {
          return !/\S/.test(e.getLine(t));
        }
        function h(e, t, n) {
          return n ? u(e) != u(e + t) : !u(e) && u(e + t);
        }
        function d(t) {
          r = r > 0 ? 1 : -1;
          var n = e.ace.session.getFoldLine(t);
          n &&
            t + r > n.start.row &&
            t + r < n.end.row &&
            (r = (r > 0 ? n.end.row : n.start.row) - t);
        }
        if (r) {
          for (; s <= l && l <= c && n > 0; ) d(l), h(l, r) && n--, (l += r);
          return new y(l, 0);
        }
        var p = e.state.vim;
        if (p.visualLine && h(a, 1, !0)) {
          var f = p.sel.anchor;
          h(f.line, -1, !0) && ((o && f.line == a) || (a += 1));
        }
        var m = u(a);
        for (l = a; l <= c && n; l++) h(l, 1, !0) && ((o && u(l) == m) || n--);
        for (
          i = new y(l, 0), l > c && !m ? (m = !0) : (o = !1), l = a;
          l > s && ((o && u(l) != m && l != a) || !h(l, -1, !0));
          l--
        );
        return { start: new y(l, 0), end: i };
      }
      function qe(e, t, n, r, o) {
        function i(e) {
          e.pos + e.dir < 0 || e.pos + e.dir >= e.line.length
            ? (e.line = null)
            : (e.pos += e.dir);
        }
        function a(e, t, n, r) {
          var a = { line: e.getLine(t), ln: t, pos: n, dir: r };
          if ("" === a.line) return { ln: a.ln, pos: a.pos };
          var s = a.pos;
          for (i(a); null !== a.line; ) {
            if (((s = a.pos), z(a.line[a.pos]))) {
              if (o) {
                for (i(a); null !== a.line && U(a.line[a.pos]); )
                  (s = a.pos), i(a);
                return { ln: a.ln, pos: s + 1 };
              }
              return { ln: a.ln, pos: a.pos + 1 };
            }
            i(a);
          }
          return { ln: a.ln, pos: s + 1 };
        }
        function s(e, t, n, r) {
          var a = e.getLine(t),
            s = { line: a, ln: t, pos: n, dir: r };
          if ("" === s.line) return { ln: s.ln, pos: s.pos };
          var c = s.pos;
          for (i(s); null !== s.line; ) {
            if (U(s.line[s.pos]) || z(s.line[s.pos])) {
              if (z(s.line[s.pos]))
                return o && U(s.line[s.pos + 1])
                  ? { ln: s.ln, pos: s.pos + 1 }
                  : { ln: s.ln, pos: c };
            } else c = s.pos;
            i(s);
          }
          return (
            (s.line = a),
            o && U(s.line[s.pos])
              ? { ln: s.ln, pos: s.pos }
              : { ln: s.ln, pos: c }
          );
        }
        for (var c = { ln: t.line, pos: t.ch }; n > 0; )
          (c = r < 0 ? s(e, c.ln, c.pos, r) : a(e, c.ln, c.pos, r)), n--;
        return new y(c.ln, c.pos);
      }
      function Qe() {}
      function Ge(e) {
        var t = e.state.vim;
        return t.searchState_ || (t.searchState_ = new Qe());
      }
      function Xe(e, t) {
        var n = Ze(e, t) || [];
        if (!n.length) return [];
        var r = [];
        if (0 === n[0]) {
          for (var o = 0; o < n.length; o++)
            "number" == typeof n[o] && r.push(e.substring(n[o] + 1, n[o + 1]));
          return r;
        }
      }
      function Ze(e, t) {
        t || (t = "/");
        for (var n = !1, r = [], o = 0; o < e.length; o++) {
          var i = e.charAt(o);
          n || i != t || r.push(o), (n = !n && "\\" == i);
        }
        return r;
      }
      Q("pcre", !0, "boolean"),
        (Qe.prototype = {
          getQuery: function () {
            return Z.query;
          },
          setQuery: function (e) {
            Z.query = e;
          },
          getOverlay: function () {
            return this.searchOverlay;
          },
          setOverlay: function (e) {
            this.searchOverlay = e;
          },
          isReversed: function () {
            return Z.isReversed;
          },
          setReversed: function (e) {
            Z.isReversed = e;
          },
          getScrollbarAnnotate: function () {
            return this.annotate;
          },
          setScrollbarAnnotate: function (e) {
            this.annotate = e;
          },
        });
      var Ye = { "\\n": "\n", "\\r": "\r", "\\t": "\t" };
      var et = {
        "\\/": "/",
        "\\\\": "\\",
        "\\n": "\n",
        "\\r": "\r",
        "\\t": "\t",
        "\\&": "&",
      };
      function tt(e, t, n) {
        if (
          (Z.registerController.getRegister("/").setText(e),
          e instanceof RegExp)
        )
          return e;
        var r,
          o,
          i = Ze(e, "/");
        i.length
          ? ((r = e.substring(0, i[0])),
            (o = -1 != e.substring(i[0]).indexOf("i")))
          : (r = e);
        return r
          ? (X("pcre") ||
              (r = (function (e) {
                for (var t = !1, n = [], r = -1; r < e.length; r++) {
                  var o = e.charAt(r) || "",
                    i = e.charAt(r + 1) || "",
                    a = i && -1 != "|(){".indexOf(i);
                  t
                    ? (("\\" === o && a) || n.push(o), (t = !1))
                    : "\\" === o
                    ? ((t = !0),
                      i && -1 != "}".indexOf(i) && (a = !0),
                      (a && "\\" !== i) || n.push(o))
                    : (n.push(o), a && "\\" !== i && n.push("\\"));
                }
                return n.join("");
              })(r)),
            n && (t = /^[^A-Z]*$/.test(r)),
            new RegExp(r, t || o ? "im" : "m"))
          : null;
      }
      function nt(e) {
        "string" === typeof e && (e = document.createElement(e));
        for (var t, n = 1; n < arguments.length; n++)
          if ((t = arguments[n]))
            if (
              ("object" !== typeof t && (t = document.createTextNode(t)),
              t.nodeType)
            )
              e.appendChild(t);
            else
              for (var r in t)
                Object.prototype.hasOwnProperty.call(t, r) &&
                  ("$" === r[0]
                    ? (e.style[r.slice(1)] = t[r])
                    : e.setAttribute(r, t[r]));
        return e;
      }
      function rt(e, t) {
        var n = nt(
          "div",
          { $color: "red", $whiteSpace: "pre", class: "cm-vim-message" },
          t
        );
        e.openNotification
          ? e.openNotification(n, { bottom: !0, duration: 5e3 })
          : alert(n.innerText);
      }
      function ot(e, t) {
        var n,
          r,
          o =
            ((n = t.prefix),
            (r = t.desc),
            nt(
              document.createDocumentFragment(),
              nt(
                "span",
                { $fontFamily: "monospace", $whiteSpace: "pre" },
                n,
                nt("input", {
                  type: "text",
                  autocorrect: "off",
                  autocapitalize: "off",
                  spellcheck: "false",
                })
              ),
              r && nt("span", { $color: "#888" }, r)
            ));
        if (e.openDialog)
          e.openDialog(o, t.onClose, {
            onKeyDown: t.onKeyDown,
            onKeyUp: t.onKeyUp,
            bottom: !0,
            selectValueOnOpen: !1,
            value: t.value,
          });
        else {
          var i = "";
          "string" != typeof t.prefix &&
            t.prefix &&
            (i += t.prefix.textContent),
            t.desc && (i += " " + t.desc),
            t.onClose(prompt(i, ""));
        }
      }
      function it(e, t, n, r) {
        if (t) {
          var o = Ge(e),
            i = tt(t, !!n, !!r);
          if (i)
            return (
              st(e, i),
              (function (e, t) {
                if (e instanceof RegExp && t instanceof RegExp) {
                  for (
                    var n = ["global", "multiline", "ignoreCase", "source"],
                      r = 0;
                    r < n.length;
                    r++
                  ) {
                    var o = n[r];
                    if (e[o] !== t[o]) return !1;
                  }
                  return !0;
                }
                return !1;
              })(i, o.getQuery()) || o.setQuery(i),
              i
            );
        }
      }
      var at = 0;
      function st(e, t) {
        clearTimeout(at),
          (at = setTimeout(function () {
            if (e.state.vim) {
              var n = Ge(e),
                r = n.getOverlay();
              (r && t == r.query) ||
                (r && e.removeOverlay(r),
                (r = (function (e) {
                  if ("^" == e.source.charAt(0)) var t = !0;
                  return {
                    token: function (n) {
                      if (!t || n.sol()) {
                        var r = n.match(e, !1);
                        if (r)
                          return 0 == r[0].length
                            ? (n.next(), "searching")
                            : n.sol() || (n.backUp(1), e.exec(n.next() + r[0]))
                            ? (n.match(e), "searching")
                            : (n.next(), null);
                        for (; !n.eol() && (n.next(), !n.match(e, !1)); );
                      } else n.skipToEnd();
                    },
                    query: e,
                  };
                })(t)),
                e.addOverlay(r),
                e.showMatchesOnScrollbar &&
                  (n.getScrollbarAnnotate() && n.getScrollbarAnnotate().clear(),
                  n.setScrollbarAnnotate(e.showMatchesOnScrollbar(t))),
                n.setOverlay(r));
            }
          }, 50));
      }
      function ct(e, t, n, r) {
        return (
          void 0 === r && (r = 1),
          e.operation(function () {
            for (
              var o = e.getCursor(), i = e.getSearchCursor(n, o), a = 0;
              a < r;
              a++
            ) {
              var s = i.find(t);
              if (0 == a && s && xe(i.from(), o)) {
                var c = t ? i.from() : i.to();
                (s = i.find(t)) &&
                  !s[0] &&
                  xe(i.from(), c) &&
                  e.getLine(c.line).length == c.ch &&
                  (s = i.find(t));
              }
              if (
                !s &&
                !(i = e.getSearchCursor(
                  n,
                  t ? new y(e.lastLine()) : new y(e.firstLine(), 0)
                )).find(t)
              )
                return;
            }
            return i.from();
          })
        );
      }
      function lt(e) {
        var t = Ge(e);
        e.removeOverlay(Ge(e).getOverlay()),
          t.setOverlay(null),
          t.getScrollbarAnnotate() &&
            (t.getScrollbarAnnotate().clear(), t.setScrollbarAnnotate(null));
      }
      function ut(e, t, n) {
        return (
          "number" != typeof e && (e = e.line),
          t instanceof Array
            ? J(e, t)
            : "number" == typeof n
            ? e >= t && e <= n
            : e == t
        );
      }
      function ht(e) {
        var t = e.ace.renderer;
        return {
          top: t.getFirstFullyVisibleRow(),
          bottom: t.getLastFullyVisibleRow(),
        };
      }
      function dt(e, t, n) {
        if ("'" == n || "`" == n) return Z.jumpList.find(e, -1) || new y(0, 0);
        if ("." == n) return pt(e);
        var r = t.marks[n];
        return r && r.find();
      }
      function pt(e) {
        var t = e.ace.session.$undoManager;
        if (t && t.$lastDelta) return v(t.$lastDelta.end);
      }
      var ft = function () {
        this.buildCommandMap_();
      };
      ft.prototype = {
        processCommand: function (e, t, n) {
          var r = this;
          e.operation(function () {
            (e.curOp.isVimOp = !0), r._processCommand(e, t, n);
          });
        },
        _processCommand: function (e, t, n) {
          var r = e.state.vim,
            o = Z.registerController.getRegister(":"),
            i = o.toString();
          r.visualMode && Pe(e);
          var a = new m.StringStream(t);
          o.setText(t);
          var s,
            c,
            l = n || {};
          l.input = t;
          try {
            this.parseInput_(e, a, l);
          } catch (h) {
            throw (rt(e, h.toString()), h);
          }
          if (l.commandName) {
            if ((s = this.matchCommand_(l.commandName))) {
              if (
                ((c = s.name),
                s.excludeFromCommandHistory && o.setText(i),
                this.parseCommandArgs_(a, l, s),
                "exToKey" == s.type)
              ) {
                for (var u = 0; u < s.toKeys.length; u++)
                  ie.handleKey(e, s.toKeys[u], "mapping");
                return;
              }
              if ("exToEx" == s.type)
                return void this.processCommand(e, s.toInput);
            }
          } else void 0 !== l.line && (c = "move");
          if (c)
            try {
              mt[c](e, l),
                (s && s.possiblyAsync) || !l.callback || l.callback();
            } catch (h) {
              throw (rt(e, h.toString()), h);
            }
          else rt(e, 'Not an editor command ":' + t + '"');
        },
        parseInput_: function (e, t, n) {
          t.eatWhile(":"),
            t.eat("%")
              ? ((n.line = e.firstLine()), (n.lineEnd = e.lastLine()))
              : ((n.line = this.parseLineSpec_(e, t)),
                void 0 !== n.line &&
                  t.eat(",") &&
                  (n.lineEnd = this.parseLineSpec_(e, t)));
          var r = t.match(/^(\w+|!!|@@|[!#&*<=>@~])/);
          return (n.commandName = r ? r[1] : t.match(/.*/)[0]), n;
        },
        parseLineSpec_: function (e, t) {
          var n = t.match(/^(\d+)/);
          if (n) return parseInt(n[1], 10) - 1;
          switch (t.next()) {
            case ".":
              return this.parseLineSpecOffset_(t, e.getCursor().line);
            case "$":
              return this.parseLineSpecOffset_(t, e.lastLine());
            case "'":
              var r = t.next(),
                o = dt(e, e.state.vim, r);
              if (!o) throw new Error("Mark not set");
              return this.parseLineSpecOffset_(t, o.line);
            case "-":
            case "+":
              return (
                t.backUp(1), this.parseLineSpecOffset_(t, e.getCursor().line)
              );
            default:
              return void t.backUp(1);
          }
        },
        parseLineSpecOffset_: function (e, t) {
          var n = e.match(/^([+-])?(\d+)/);
          if (n) {
            var r = parseInt(n[2], 10);
            "-" == n[1] ? (t -= r) : (t += r);
          }
          return t;
        },
        parseCommandArgs_: function (e, t, n) {
          if (!e.eol()) {
            t.argString = e.match(/.*/)[0];
            var r = n.argDelimiter || /\s+/,
              o = Oe(t.argString).split(r);
            o.length && o[0] && (t.args = o);
          }
        },
        matchCommand_: function (e) {
          for (var t = e.length; t > 0; t--) {
            var n = e.substring(0, t);
            if (this.commandMap_[n]) {
              var r = this.commandMap_[n];
              if (0 === r.name.indexOf(e)) return r;
            }
          }
          return null;
        },
        buildCommandMap_: function () {
          this.commandMap_ = {};
          for (var e = 0; e < S.length; e++) {
            var t = S[e],
              n = t.shortName || t.name;
            this.commandMap_[n] = t;
          }
        },
        map: function (e, t, n) {
          if (":" != e && ":" == e.charAt(0)) {
            if (n) throw Error("Mode not supported for ex mappings");
            var r = e.substring(1);
            ":" != t && ":" == t.charAt(0)
              ? (this.commandMap_[r] = {
                  name: r,
                  type: "exToEx",
                  toInput: t.substring(1),
                  user: !0,
                })
              : (this.commandMap_[r] = {
                  name: r,
                  type: "exToKey",
                  toKeys: t,
                  user: !0,
                });
          } else if (":" != t && ":" == t.charAt(0)) {
            var o = {
              keys: e,
              type: "keyToEx",
              exArgs: { input: t.substring(1) },
            };
            n && (o.context = n), w.unshift(o);
          } else {
            o = { keys: e, type: "keyToKey", toKeys: t };
            n && (o.context = n), w.unshift(o);
          }
        },
        unmap: function (e, t) {
          if (":" != e && ":" == e.charAt(0)) {
            if (t) throw Error("Mode not supported for ex mappings");
            var n = e.substring(1);
            if (this.commandMap_[n] && this.commandMap_[n].user)
              return delete this.commandMap_[n], !0;
          } else
            for (var r = e, o = 0; o < w.length; o++)
              if (r == w[o].keys && w[o].context === t)
                return w.splice(o, 1), !0;
        },
      };
      var mt = {
          colorscheme: function (e, t) {
            !t.args || t.args.length < 1
              ? rt(e, e.getOption("theme"))
              : e.setOption("theme", t.args[0]);
          },
          map: function (e, t, n) {
            var r = t.args;
            !r || r.length < 2
              ? e && rt(e, "Invalid mapping: " + t.input)
              : gt.map(r[0], r[1], n);
          },
          imap: function (e, t) {
            this.map(e, t, "insert");
          },
          nmap: function (e, t) {
            this.map(e, t, "normal");
          },
          vmap: function (e, t) {
            this.map(e, t, "visual");
          },
          unmap: function (e, t, n) {
            var r = t.args;
            (!r || r.length < 1 || !gt.unmap(r[0], n)) &&
              e &&
              rt(e, "No such mapping: " + t.input);
          },
          move: function (e, t) {
            he.processCommand(e, e.state.vim, {
              type: "motion",
              motion: "moveToLineOrEdgeOfDocument",
              motionArgs: { forward: !1, explicitRepeat: !0, linewise: !0 },
              repeatOverride: t.line + 1,
            });
          },
          set: function (e, t) {
            var n = t.args,
              r = t.setCfg || {};
            if (!n || n.length < 1) e && rt(e, "Invalid mapping: " + t.input);
            else {
              var o = n[0].split("="),
                i = o[0],
                a = o[1],
                s = !1;
              if ("?" == i.charAt(i.length - 1)) {
                if (a) throw Error("Trailing characters: " + t.argString);
                (i = i.substring(0, i.length - 1)), (s = !0);
              }
              void 0 === a &&
                "no" == i.substring(0, 2) &&
                ((i = i.substring(2)), (a = !1));
              var c = q[i] && "boolean" == q[i].type;
              if ((c && void 0 == a && (a = !0), (!c && void 0 === a) || s)) {
                var l = X(i, e, r);
                l instanceof Error
                  ? rt(e, l.message)
                  : rt(
                      e,
                      !0 === l || !1 === l
                        ? " " + (l ? "" : "no") + i
                        : "  " + i + "=" + l
                    );
              } else {
                var u = G(i, a, e, r);
                u instanceof Error && rt(e, u.message);
              }
            }
          },
          setlocal: function (e, t) {
            (t.setCfg = { scope: "local" }), this.set(e, t);
          },
          setglobal: function (e, t) {
            (t.setCfg = { scope: "global" }), this.set(e, t);
          },
          registers: function (e, t) {
            var n = t.args,
              r = Z.registerController.registers,
              o = "----------Registers----------\n\n";
            if (n) {
              n = n.join("");
              for (var i = 0; i < n.length; i++) {
                if (
                  ((a = n.charAt(i)), Z.registerController.isValidRegister(a))
                )
                  o += '"' + a + "    " + (r[a] || new ce()).toString() + "\n";
              }
            } else
              for (var a in r) {
                var s = r[a].toString();
                s.length && (o += '"' + a + "    " + s + "\n");
              }
            rt(e, o);
          },
          sort: function (e, t) {
            var n, r, o, i, a;
            var s = (function () {
              if (t.argString) {
                var e = new m.StringStream(t.argString);
                if ((e.eat("!") && (n = !0), e.eol())) return;
                if (!e.eatSpace()) return "Invalid arguments";
                var s = e.match(/([dinuox]+)?\s*(\/.+\/)?\s*/);
                if (!s && !e.eol()) return "Invalid arguments";
                if (s[1]) {
                  (r = -1 != s[1].indexOf("i")), (o = -1 != s[1].indexOf("u"));
                  var c =
                      -1 != s[1].indexOf("d") || (-1 != s[1].indexOf("n") && 1),
                    l = -1 != s[1].indexOf("x") && 1,
                    u = -1 != s[1].indexOf("o") && 1;
                  if (c + l + u > 1) return "Invalid arguments";
                  i = (c ? "decimal" : l && "hex") || (u && "octal");
                }
                s[2] &&
                  (a = new RegExp(
                    s[2].substr(1, s[2].length - 2),
                    r ? "i" : ""
                  ));
              }
            })();
            if (s) rt(e, s + ": " + t.argString);
            else {
              var c = t.line || e.firstLine(),
                l = t.lineEnd || t.line || e.lastLine();
              if (c != l) {
                var u = new y(c, 0),
                  h = new y(l, Le(e, l)),
                  d = e.getRange(u, h).split("\n"),
                  p =
                    a ||
                    ("decimal" == i
                      ? /(-?)([\d]+)/
                      : "hex" == i
                      ? /(-?)(?:0x)?([0-9a-f]+)/i
                      : "octal" == i
                      ? /([0-7]+)/
                      : null),
                  f =
                    "decimal" == i
                      ? 10
                      : "hex" == i
                      ? 16
                      : "octal" == i
                      ? 8
                      : null,
                  g = [],
                  v = [];
                if (i || a)
                  for (var C = 0; C < d.length; C++) {
                    var k = a ? d[C].match(a) : null;
                    k && "" != k[0]
                      ? g.push(k)
                      : !a && p.exec(d[C])
                      ? g.push(d[C])
                      : v.push(d[C]);
                  }
                else v = d;
                if (
                  (g.sort(
                    a
                      ? function (e, t) {
                          var o;
                          return (
                            n && ((o = e), (e = t), (t = o)),
                            r &&
                              ((e[0] = e[0].toLowerCase()),
                              (t[0] = t[0].toLowerCase())),
                            e[0] < t[0] ? -1 : 1
                          );
                        }
                      : S
                  ),
                  a)
                )
                  for (C = 0; C < g.length; C++) g[C] = g[C].input;
                else i || v.sort(S);
                if (((d = n ? g.concat(v) : v.concat(g)), o)) {
                  var w,
                    x = d;
                  d = [];
                  for (C = 0; C < x.length; C++)
                    x[C] != w && d.push(x[C]), (w = x[C]);
                }
                e.replaceRange(d.join("\n"), u, h);
              }
            }
            function S(e, t) {
              var o;
              n && ((o = e), (e = t), (t = o));
              r && ((e = e.toLowerCase()), (t = t.toLowerCase()));
              var a = i && p.exec(e),
                s = i && p.exec(t);
              return a
                ? (a = parseInt((a[1] + a[2]).toLowerCase(), f)) -
                    (s = parseInt((s[1] + s[2]).toLowerCase(), f))
                : e < t
                ? -1
                : 1;
            }
          },
          vglobal: function (e, t) {
            this.global(e, t);
          },
          global: function (e, t) {
            var n = t.argString;
            if (n) {
              var r,
                o = "v" === t.commandName[0],
                i = void 0 !== t.line ? t.line : e.firstLine(),
                a = t.lineEnd || t.line || e.lastLine(),
                s = (function (e) {
                  return Xe(e, "/");
                })(n),
                c = n;
              if (
                (s.length && ((c = s[0]), (r = s.slice(1, s.length).join("/"))),
                c)
              )
                try {
                  it(e, c, !0, !0);
                } catch (f) {
                  return void rt(e, "Invalid regex: " + c);
                }
              for (var l = Ge(e).getQuery(), u = [], h = i; h <= a; h++) {
                var d = e.getLineHandle(h);
                l.test(d.text) !== o && u.push(r ? d : d.text);
              }
              if (r) {
                var p = 0;
                !(function t() {
                  if (p < u.length) {
                    var n = u[p++],
                      o = e.getLineNumber(n);
                    if (null == o) return void t();
                    var i = o + 1 + r;
                    gt.processCommand(e, i, { callback: t });
                  }
                })();
              } else rt(e, u.join("\n"));
            } else rt(e, "Regular Expression missing from global");
          },
          substitute: function (e, t) {
            if (!e.getSearchCursor)
              throw new Error(
                "Search feature not available. Requires searchcursor.js or any other getSearchCursor implementation."
              );
            var n,
              r,
              o,
              i,
              a = t.argString,
              s = a ? Xe(a, a[0]) : [],
              c = "",
              l = !1,
              u = !1;
            if (s.length)
              (n = s[0]),
                X("pcre") && "" !== n && (n = new RegExp(n).source),
                void 0 !== (c = s[1]) &&
                  ((c = X("pcre")
                    ? (function (e) {
                        for (
                          var t = new m.StringStream(e), n = [];
                          !t.eol();

                        ) {
                          for (; t.peek() && "\\" != t.peek(); )
                            n.push(t.next());
                          var r = !1;
                          for (var o in et)
                            if (t.match(o, !0)) {
                              (r = !0), n.push(et[o]);
                              break;
                            }
                          r || n.push(t.next());
                        }
                        return n.join("");
                      })(c.replace(/([^\\])&/g, "$1$$&"))
                    : (function (e) {
                        for (var t, n = !1, r = [], o = -1; o < e.length; o++) {
                          var i = e.charAt(o) || "",
                            a = e.charAt(o + 1) || "";
                          Ye[i + a]
                            ? (r.push(Ye[i + a]), o++)
                            : n
                            ? (r.push(i), (n = !1))
                            : "\\" === i
                            ? ((n = !0),
                              (t = a),
                              B.test(t) || "$" === a
                                ? r.push("$")
                                : "/" !== a && "\\" !== a && r.push("\\"))
                            : ("$" === i && r.push("$"),
                              r.push(i),
                              "/" === a && r.push("\\"));
                        }
                        return r.join("");
                      })(c)),
                  (Z.lastSubstituteReplacePart = c)),
                (r = s[2] ? s[2].split(" ") : []);
            else if (a && a.length)
              return void rt(
                e,
                "Substitutions should be of the form :s/pattern/replace/"
              );
            if (
              (r &&
                ((o = r[0]),
                (i = parseInt(r[1])),
                o &&
                  (-1 != o.indexOf("c") && (l = !0),
                  -1 != o.indexOf("g") && (u = !0),
                  (n = X("pcre")
                    ? n + "/" + o
                    : n.replace(/\//g, "\\/") + "/" + o))),
              n)
            )
              try {
                it(e, n, !0, !0);
              } catch (v) {
                return void rt(e, "Invalid regex: " + n);
              }
            if (void 0 !== (c = c || Z.lastSubstituteReplacePart)) {
              var h = Ge(e).getQuery(),
                d = void 0 !== t.line ? t.line : e.getCursor().line,
                p = t.lineEnd || d;
              d == e.firstLine() && p == e.lastLine() && (p = 1 / 0),
                i && (p = (d = p) + i - 1);
              var f = ge(e, new y(d, 0)),
                g = e.getSearchCursor(h, f);
              !(function (e, t, n, r, o, i, a, s, c) {
                e.state.vim.exMode = !0;
                var l,
                  u,
                  h,
                  d = !1;
                function p() {
                  e.operation(function () {
                    for (; !d; ) f(), v();
                    y();
                  });
                }
                function f() {
                  var t = e.getRange(i.from(), i.to()).replace(a, s),
                    n = i.to().line;
                  i.replace(t), (u = i.to().line), (o += u - n), (h = u < n);
                }
                function g() {
                  var e = l && we(i.to()),
                    t = i.findNext();
                  return (
                    t && !t[0] && e && xe(i.from(), e) && (t = i.findNext()), t
                  );
                }
                function v() {
                  for (; g() && ut(i.from(), r, o); )
                    if (n || i.from().line != u || h)
                      return (
                        e.scrollIntoView(i.from(), 30),
                        e.setSelection(i.from(), i.to()),
                        (l = i.from()),
                        void (d = !1)
                      );
                  d = !0;
                }
                function y(t) {
                  if ((t && t(), e.focus(), l)) {
                    e.setCursor(l);
                    var n = e.state.vim;
                    (n.exMode = !1), (n.lastHPos = n.lastHSPos = l.ch);
                  }
                  c && c();
                }
                function C(t, n, r) {
                  switch ((m.e_stop(t), m.keyName(t))) {
                    case "Y":
                      f(), v();
                      break;
                    case "N":
                      v();
                      break;
                    case "A":
                      var o = c;
                      (c = void 0), e.operation(p), (c = o);
                      break;
                    case "L":
                      f();
                    case "Q":
                    case "Esc":
                    case "Ctrl-C":
                    case "Ctrl-[":
                      y(r);
                  }
                  return d && y(r), !0;
                }
                if ((v(), d)) return void rt(e, "No matches for " + a.source);
                if (!t) return p(), void (c && c());
                ot(e, {
                  prefix: nt(
                    "span",
                    "replace with ",
                    nt("strong", s),
                    " (y/n/a/q/l)"
                  ),
                  onKeyDown: C,
                });
              })(e, l, u, d, p, g, h, c, t.callback);
            } else rt(e, "No previous substitute regular expression");
          },
          redo: m.commands.redo,
          undo: m.commands.undo,
          write: function (e) {
            m.commands.save ? m.commands.save(e) : e.save && e.save();
          },
          nohlsearch: function (e) {
            lt(e);
          },
          yank: function (e) {
            var t = we(e.getCursor()).line,
              n = e.getLine(t);
            Z.registerController.pushText("0", "yank", n, !0, !0);
          },
          delmarks: function (e, t) {
            if (t.argString && Oe(t.argString))
              for (
                var n = e.state.vim, r = new m.StringStream(Oe(t.argString));
                !r.eol();

              ) {
                r.eatSpace();
                var o = r.pos;
                if (!r.match(/[a-zA-Z]/, !1))
                  return void rt(
                    e,
                    "Invalid argument: " + t.argString.substring(o)
                  );
                var i = r.next();
                if (r.match("-", !0)) {
                  if (!r.match(/[a-zA-Z]/, !1))
                    return void rt(
                      e,
                      "Invalid argument: " + t.argString.substring(o)
                    );
                  var a = i,
                    s = r.next();
                  if (!((j(a) && j(s)) || (W(a) && W(s))))
                    return void rt(e, "Invalid argument: " + a + "-");
                  var c = a.charCodeAt(0),
                    l = s.charCodeAt(0);
                  if (c >= l)
                    return void rt(
                      e,
                      "Invalid argument: " + t.argString.substring(o)
                    );
                  for (var u = 0; u <= l - c; u++) {
                    var h = String.fromCharCode(c + u);
                    delete n.marks[h];
                  }
                } else delete n.marks[i];
              }
            else rt(e, "Argument required");
          },
        },
        gt = new ft();
      function vt(e) {
        var t = e.state.vim,
          n = Z.macroModeState,
          r = Z.registerController.getRegister("."),
          o = n.isPlaying,
          i = n.lastInsertModeChanges;
        o || (e.off("change", kt), m.off(e.getInputField(), "keydown", Mt)),
          !o &&
            t.insertModeRepeat > 1 &&
            (At(e, t, t.insertModeRepeat - 1, !0),
            (t.lastEditInputState.repeatOverride = t.insertModeRepeat)),
          delete t.insertModeRepeat,
          (t.insertMode = !1),
          e.setCursor(e.getCursor().line, e.getCursor().ch - 1),
          e.setOption("keyMap", "vim"),
          e.setOption("disableInput", !0),
          e.toggleOverwrite(!1),
          r.setText(i.changes.join("")),
          m.signal(e, "vim-mode-change", { mode: "normal" }),
          n.isRecording &&
            (function (e) {
              if (e.isPlaying) return;
              var t = e.latestRegister,
                n = Z.registerController.getRegister(t);
              n &&
                n.pushInsertModeChanges &&
                n.pushInsertModeChanges(e.lastInsertModeChanges);
            })(n);
      }
      function yt(e) {
        w.unshift(e);
      }
      function Ct(e, t, n, r) {
        var o = Z.registerController.getRegister(r);
        if (":" == r)
          return (
            o.keyBuffer[0] && gt.processCommand(e, o.keyBuffer[0]),
            void (n.isPlaying = !1)
          );
        var i = o.keyBuffer,
          a = 0;
        (n.isPlaying = !0), (n.replaySearchQueries = o.searchQueries.slice(0));
        for (var s = 0; s < i.length; s++)
          for (var c, l, u = i[s]; u; )
            if (
              ((l = (c = /<\w+-.+?>|<\w+>|./.exec(u))[0]),
              (u = u.substring(c.index + l.length)),
              ie.handleKey(e, l, "macro"),
              t.insertMode)
            ) {
              var h = o.insertModeChanges[a++].changes;
              (Z.macroModeState.lastInsertModeChanges.changes = h),
                bt(e, h, 1),
                vt(e);
            }
        n.isPlaying = !1;
      }
      function kt(e, t) {
        var n = Z.macroModeState,
          r = n.lastInsertModeChanges;
        if (!n.isPlaying)
          for (; t; ) {
            if (((r.expectCursorActivityForChange = !0), r.ignoreCount > 1))
              r.ignoreCount--;
            else if (
              "+input" == t.origin ||
              "paste" == t.origin ||
              void 0 === t.origin
            ) {
              var o = e.listSelections().length;
              o > 1 && (r.ignoreCount = o);
              var i = t.text.join("\n");
              r.maybeReset && ((r.changes = []), (r.maybeReset = !1)),
                i &&
                  (e.state.overwrite && !/\n/.test(i)
                    ? r.changes.push([i])
                    : r.changes.push(i));
            }
            t = t.next;
          }
      }
      function wt(e) {
        var t = e.state.vim;
        if (t.insertMode) {
          var n = Z.macroModeState;
          if (n.isPlaying) return;
          var r = n.lastInsertModeChanges;
          r.expectCursorActivityForChange
            ? (r.expectCursorActivityForChange = !1)
            : (r.maybeReset = !0);
        } else e.curOp.isVimOp || xt(e, t);
      }
      function xt(e, t, n) {
        var r = e.getCursor("anchor"),
          o = e.getCursor("head");
        if (
          (t.visualMode && !e.somethingSelected()
            ? Pe(e, !1)
            : t.visualMode ||
              t.insertMode ||
              !e.somethingSelected() ||
              ((t.visualMode = !0),
              (t.visualLine = !1),
              m.signal(e, "vim-mode-change", { mode: "visual" })),
          t.visualMode)
        ) {
          var i = Se(o, r) ? 0 : -1,
            a = Se(o, r) ? -1 : 0;
          (o = ye(o, 0, i)),
            (r = ye(r, 0, a)),
            (t.sel = { anchor: r, head: o }),
            Ue(e, t, "<", Me(o, r)),
            Ue(e, t, ">", Ae(o, r));
        } else t.insertMode || n || (t.lastHPos = e.getCursor().ch);
      }
      function St(e) {
        this.keyName = e;
      }
      function Mt(e) {
        var t = Z.macroModeState.lastInsertModeChanges,
          n = m.keyName(e);
        n &&
          ((-1 == n.indexOf("Delete") && -1 == n.indexOf("Backspace")) ||
            m.lookupKey(n, "vim-insert", function () {
              return (
                t.maybeReset && ((t.changes = []), (t.maybeReset = !1)),
                t.changes.push(new St(n)),
                !0
              );
            }));
      }
      function At(e, t, n, r) {
        var o = Z.macroModeState;
        o.isPlaying = !0;
        var i = !!t.lastEditActionCommand,
          a = t.inputState;
        function s() {
          i
            ? he.processAction(e, t, t.lastEditActionCommand)
            : he.evalInput(e, t);
        }
        function c(n) {
          if (o.lastInsertModeChanges.changes.length > 0) {
            n = t.lastEditActionCommand ? n : 1;
            var r = o.lastInsertModeChanges;
            bt(e, r.changes, n);
          }
        }
        if (
          ((t.inputState = t.lastEditInputState),
          i && t.lastEditActionCommand.interlaceInsertRepeat)
        )
          for (var l = 0; l < n; l++) s(), c(1);
        else r || s(), c(n);
        (t.inputState = a), t.insertMode && !r && vt(e), (o.isPlaying = !1);
      }
      function bt(e, t, n) {
        function r(t) {
          return "string" == typeof t ? m.commands[t](e) : t(e), !0;
        }
        var o = e.getCursor("head"),
          i = Z.macroModeState.lastInsertModeChanges.visualBlock;
        i && (Re(e, o, i + 1), (n = e.listSelections().length), e.setCursor(o));
        for (var a = 0; a < n; a++) {
          i && e.setCursor(ye(o, a, 0));
          for (var s = 0; s < t.length; s++) {
            var c = t[s];
            if (c instanceof St) m.lookupKey(c.keyName, "vim-insert", r);
            else if ("string" == typeof c) e.replaceSelection(c);
            else {
              var l = e.getCursor(),
                u = ye(l, 0, c[0].length);
              e.replaceRange(c[0], l, u), e.setCursor(u);
            }
          }
        }
        i && e.setCursor(ye(o, 0, 1));
      }
      (m.keyMap.vim = { attach: L, detach: b, call: O }),
        Q("insertModeEscKeysTimeout", 200, "number"),
        (m.keyMap["vim-insert"] = {
          fallthrough: ["default"],
          attach: L,
          detach: b,
          call: O,
        }),
        (m.keyMap["vim-replace"] = {
          Backspace: "goCharLeft",
          fallthrough: ["vim-insert"],
          attach: L,
          detach: b,
          call: O,
        }),
        oe(),
        (m.Vim = ie);
      var Lt = {
        return: "CR",
        backspace: "BS",
        delete: "Del",
        esc: "Esc",
        left: "Left",
        right: "Right",
        up: "Up",
        down: "Down",
        space: "Space",
        insert: "Ins",
        home: "Home",
        end: "End",
        pageup: "PageUp",
        pagedown: "PageDown",
        enter: "CR",
      };
      var Ot = ie.handleKey.bind(ie);
      function Tt(e) {
        var t = new e.constructor();
        return (
          Object.keys(e).forEach(function (n) {
            var r = e[n];
            Array.isArray(r)
              ? (r = r.slice())
              : r &&
                "object" == typeof r &&
                r.constructor != Object &&
                (r = Tt(r)),
              (t[n] = r);
          }),
          e.sel &&
            (t.sel = {
              head: e.sel.head && we(e.sel.head),
              anchor: e.sel.anchor && we(e.sel.anchor),
            }),
          t
        );
      }
      function Et(e, t, n) {
        var r = !1,
          o = ie.maybeInitVimState_(e),
          i = o.visualBlock || o.wasInVisualBlock,
          a = e.ace.inMultiSelectMode;
        if (
          (o.wasInVisualBlock && !a
            ? (o.wasInVisualBlock = !1)
            : a && o.visualBlock && (o.wasInVisualBlock = !0),
          "<Esc>" != t || o.insertMode || o.visualMode || !a)
        )
          if (i || !a || e.ace.inVirtualSelectionMode)
            r = ie.handleKey(e, t, n);
          else {
            var s = Tt(o);
            e.operation(function () {
              e.ace.forEachSelection(function () {
                var o = e.ace.selection;
                e.state.vim.lastHPos =
                  null == o.$desiredColumn ? o.lead.column : o.$desiredColumn;
                var i = e.getCursor("head"),
                  a = e.getCursor("anchor"),
                  c = Se(i, a) ? 0 : -1,
                  l = Se(i, a) ? -1 : 0;
                (i = ye(i, 0, c)),
                  (a = ye(a, 0, l)),
                  (e.state.vim.sel.head = i),
                  (e.state.vim.sel.anchor = a),
                  (r = Ot(e, t, n)),
                  (o.$desiredColumn =
                    -1 == e.state.vim.lastHPos ? null : e.state.vim.lastHPos),
                  e.virtualSelectionMode() && (e.state.vim = Tt(s));
              }),
                e.curOp.cursorActivity && !r && (e.curOp.cursorActivity = !1);
            }, !0);
          }
        else e.ace.exitMultiSelectMode();
        return (
          !r ||
            o.visualMode ||
            o.insert ||
            o.visualMode == e.somethingSelected() ||
            xt(e, o, !0),
          r
        );
      }
      (ie.handleKey = function (e, t, n) {
        return e.operation(function () {
          return Ot(e, t, n);
        }, !0);
      }),
        (t.CodeMirror = m);
      var Rt = ie.maybeInitVimState_;
      function Bt(e, t) {
        t.off("beforeEndOperation", Bt);
        var n = t.state.cm.vimCmd;
        n && t.execCommand(n.exec ? n : n.name, n.args), (t.curOp = t.prevOp);
      }
      (t.handler = {
        $id: "ace/keyboard/vim",
        drawCursor: function (e, t, n, o, a) {
          var s = this.state.vim || {},
            c = n.characterWidth,
            l = n.lineHeight,
            u = t.top,
            h = t.left;
          s.insertMode ||
            (!(o.cursor
              ? r.comparePoints(o.cursor, o.start) <= 0
              : a.selection.isBackwards() || a.selection.isEmpty()) &&
              h > c &&
              (h -= c));
          !s.insertMode && s.status && (u += l /= 2),
            i.translate(e, h, u),
            i.setStyle(e.style, "width", c + "px"),
            i.setStyle(e.style, "height", l + "px");
        },
        $getDirectionForHighlight: function (e) {
          var t = e.state.cm;
          if (!Rt(t).insertMode)
            return (
              e.session.selection.isBackwards() || e.session.selection.isEmpty()
            );
        },
        handleKeyboard: function (e, t, n, r, o) {
          var i = e.editor,
            a = i.state.cm,
            s = Rt(a);
          if (-1 != r) {
            if (
              (s.insertMode ||
                (-1 == t
                  ? (n.charCodeAt(0) > 255 &&
                      e.inputKey &&
                      (n = e.inputKey) &&
                      4 == e.inputHash &&
                      (n = n.toUpperCase()),
                    (e.inputChar = n))
                  : 4 == t || 0 == t
                  ? e.inputKey == n && e.inputHash == t && e.inputChar
                    ? ((n = e.inputChar), (t = -1))
                    : ((e.inputChar = null),
                      (e.inputKey = n),
                      (e.inputHash = t))
                  : (e.inputChar = e.inputKey = null)),
              a.state.overwrite && s.insertMode && "backspace" == n && 0 == t)
            )
              return { command: "gotoleft" };
            if ("c" == n && 1 == t && !u.isMac && i.getCopyText())
              return (
                i.once("copy", function () {
                  s.insertMode
                    ? i.selection.clearSelection()
                    : a.operation(function () {
                        Pe(a);
                      });
                }),
                { command: "null", passEvent: !0 }
              );
            if (
              "esc" == n &&
              !s.insertMode &&
              !s.visualMode &&
              !a.ace.inMultiSelectMode
            ) {
              var c = Ge(a).getOverlay();
              c && a.removeOverlay(c);
            }
            if (-1 == t || 1 & t || (0 === t && n.length > 1)) {
              var l = s.insertMode,
                h = (function (e, t, n) {
                  t.length > 1 && "n" == t[0] && (t = t.replace("numpad", "")),
                    (t = Lt[t] || t);
                  var r = "";
                  return (
                    n.ctrlKey && (r += "C-"),
                    n.altKey && (r += "A-"),
                    (r || t.length > 1) && n.shiftKey && (r += "S-"),
                    (r += t).length > 1 && (r = "<" + r + ">"),
                    r
                  );
                })(0, n, o || {});
              null == s.status && (s.status = "");
              var d = Et(a, h, "user");
              if (
                ((s = Rt(a)),
                d && null != s.status
                  ? (s.status += h)
                  : null == s.status && (s.status = ""),
                a._signal("changeStatus"),
                !d && (-1 != t || l))
              )
                return;
              return { command: "null", passEvent: !d };
            }
          }
        },
        attach: function (e) {
          e.state || (e.state = {});
          var t = new m(e);
          function n() {
            var n = Rt(t).insertMode;
            t.ace.renderer.setStyle("normal-mode", !n),
              e.textInput.setCommandMode(!n),
              (e.renderer.$keepTextAreaAtCursor = n),
              (e.renderer.$blockCursor = !n);
          }
          (e.state.cm = t),
            (e.$vimModeHandler = this),
            m.keyMap.vim.attach(t),
            (Rt(t).status = null),
            t.on("vim-command-done", function () {
              t.virtualSelectionMode() ||
                ((Rt(t).status = null),
                t.ace._signal("changeStatus"),
                t.ace.session.markUndoGroup());
            }),
            t.on("changeStatus", function () {
              t.ace.renderer.updateCursor(), t.ace._signal("changeStatus");
            }),
            t.on("vim-mode-change", function () {
              t.virtualSelectionMode() || (n(), t._signal("changeStatus"));
            }),
            n(),
            (e.renderer.$cursorLayer.drawCursor = this.drawCursor.bind(t));
        },
        detach: function (e) {
          var t = e.state.cm;
          m.keyMap.vim.detach(t),
            t.destroy(),
            (e.state.cm = null),
            (e.$vimModeHandler = null),
            (e.renderer.$cursorLayer.drawCursor = null),
            e.renderer.setStyle("normal-mode", !1),
            e.textInput.setCommandMode(!1),
            (e.renderer.$keepTextAreaAtCursor = !0);
        },
        getStatusText: function (e) {
          var t = e.state.cm,
            n = Rt(t);
          if (n.insertMode) return "INSERT";
          var r = "";
          return (
            n.visualMode &&
              ((r += "VISUAL"),
              n.visualLine && (r += " LINE"),
              n.visualBlock && (r += " BLOCK")),
            n.status && (r += (r ? " " : "") + n.status),
            r
          );
        },
      }),
        ie.defineOption(
          {
            name: "wrap",
            set: function (e, t) {
              t && t.ace.setOption("wrap", e);
            },
            type: "boolean",
          },
          !1
        ),
        ie.defineEx("write", "w", function () {
          console.log(":write is not implemented");
        }),
        w.push(
          {
            keys: "zc",
            type: "action",
            action: "fold",
            actionArgs: { open: !1 },
          },
          {
            keys: "zC",
            type: "action",
            action: "fold",
            actionArgs: { open: !1, all: !0 },
          },
          {
            keys: "zo",
            type: "action",
            action: "fold",
            actionArgs: { open: !0 },
          },
          {
            keys: "zO",
            type: "action",
            action: "fold",
            actionArgs: { open: !0, all: !0 },
          },
          {
            keys: "za",
            type: "action",
            action: "fold",
            actionArgs: { toggle: !0 },
          },
          {
            keys: "zA",
            type: "action",
            action: "fold",
            actionArgs: { toggle: !0, all: !0 },
          },
          {
            keys: "zf",
            type: "action",
            action: "fold",
            actionArgs: { open: !0, all: !0 },
          },
          {
            keys: "zd",
            type: "action",
            action: "fold",
            actionArgs: { open: !0, all: !0 },
          },
          {
            keys: "<C-A-k>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "addCursorAbove" },
          },
          {
            keys: "<C-A-j>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "addCursorBelow" },
          },
          {
            keys: "<C-A-S-k>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "addCursorAboveSkipCurrent" },
          },
          {
            keys: "<C-A-S-j>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "addCursorBelowSkipCurrent" },
          },
          {
            keys: "<C-A-h>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "selectMoreBefore" },
          },
          {
            keys: "<C-A-l>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "selectMoreAfter" },
          },
          {
            keys: "<C-A-S-h>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "selectNextBefore" },
          },
          {
            keys: "<C-A-S-l>",
            type: "action",
            action: "aceCommand",
            actionArgs: { name: "selectNextAfter" },
          }
        ),
        w.push({ keys: "gq", type: "operator", operator: "hardWrap" }),
        ie.defineOperator("hardWrap", function (e, t, n, r, o) {
          var i = n[0].anchor.line,
            a = n[0].head.line;
          return (
            t.linewise && a--, f(e.ace, { startRow: i, endRow: a }), y(a, 0)
          );
        }),
        Q("textwidth", void 0, "number", ["tw"], function (e, t) {
          if (void 0 !== t) {
            if (void 0 === e) return t.ace.getOption("printMarginColumn");
            var n = Math.round(e);
            n > 1 && t.ace.setOption("printMarginColumn", n);
          }
        }),
        (me.aceCommand = function (e, t, n) {
          (e.vimCmd = t),
            e.ace.inVirtualSelectionMode
              ? e.ace.on("beforeEndOperation", Bt)
              : Bt(null, e.ace);
        }),
        (me.fold = function (e, t, n) {
          e.ace.execCommand(
            ["toggleFoldWidget", "toggleFoldWidget", "foldOther", "unfoldall"][
              (t.all ? 2 : 0) + (t.open ? 1 : 0)
            ]
          );
        }),
        (t.handler.defaultKeymap = w),
        (t.handler.actions = me),
        (t.Vim = ie);
    }
  ),
  ace.require(["ace/keyboard/vim"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
