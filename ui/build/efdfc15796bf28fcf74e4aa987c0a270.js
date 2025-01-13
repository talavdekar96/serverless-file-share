ace.define(
  "ace/occur",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/search",
    "ace/edit_session",
    "ace/search_highlight",
    "ace/lib/dom",
  ],
  function (e, n, t) {
    "use strict";
    var o =
        (this && this.__extends) ||
        (function () {
          var e = function (n, t) {
            return (
              (e =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, n) {
                    e.__proto__ = n;
                  }) ||
                function (e, n) {
                  for (var t in n)
                    Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
                }),
              e(n, t)
            );
          };
          return function (n, t) {
            if ("function" !== typeof t && null !== t)
              throw new TypeError(
                "Class extends value " +
                  String(t) +
                  " is not a constructor or null"
              );
            function o() {
              this.constructor = n;
            }
            e(n, t),
              (n.prototype =
                null === t
                  ? Object.create(t)
                  : ((o.prototype = t.prototype), new o()));
          };
        })(),
      r = e("./lib/oop"),
      a = e("./search").Search,
      i = e("./edit_session").EditSession,
      s = e("./search_highlight").SearchHighlight,
      c = (function (e) {
        function n() {
          return (null !== e && e.apply(this, arguments)) || this;
        }
        return (
          o(n, e),
          (n.prototype.enter = function (e, n) {
            if (!n.needle) return !1;
            var t = e.getCursorPosition();
            this.displayOccurContent(e, n);
            var o = this.originalToOccurPosition(e.session, t);
            return e.moveCursorToPosition(o), !0;
          }),
          (n.prototype.exit = function (e, n) {
            var t = n.translatePosition && e.getCursorPosition(),
              o = t && this.occurToOriginalPosition(e.session, t);
            return (
              this.displayOriginalContent(e), o && e.moveCursorToPosition(o), !0
            );
          }),
          (n.prototype.highlight = function (e, n) {
            (e.$occurHighlight =
              e.$occurHighlight ||
              e.addDynamicMarker(
                new s(null, "ace_occur-highlight", "text")
              )).setRegexp(n),
              e._emit("changeBackMarker");
          }),
          (n.prototype.displayOccurContent = function (e, n) {
            this.$originalSession = e.session;
            var t = this.matchingLines(e.session, n),
              o = t.map(function (e) {
                return e.content;
              }),
              r = new i(o.join("\n"));
            (r.$occur = this),
              (r.$occurMatchingLines = t),
              e.setSession(r),
              (this.$useEmacsStyleLineStart =
                this.$originalSession.$useEmacsStyleLineStart),
              (r.$useEmacsStyleLineStart = this.$useEmacsStyleLineStart),
              this.highlight(r, n.re),
              r._emit("changeBackMarker");
          }),
          (n.prototype.displayOriginalContent = function (e) {
            e.setSession(this.$originalSession),
              (this.$originalSession.$useEmacsStyleLineStart =
                this.$useEmacsStyleLineStart);
          }),
          (n.prototype.originalToOccurPosition = function (e, n) {
            var t = e.$occurMatchingLines,
              o = { row: 0, column: 0 };
            if (!t) return o;
            for (var r = 0; r < t.length; r++)
              if (t[r].row === n.row) return { row: r, column: n.column };
            return o;
          }),
          (n.prototype.occurToOriginalPosition = function (e, n) {
            var t = e.$occurMatchingLines;
            return t && t[n.row] ? { row: t[n.row].row, column: n.column } : n;
          }),
          (n.prototype.matchingLines = function (e, n) {
            if (((n = r.mixin({}, n)), !e || !n.needle)) return [];
            var t = new a();
            return (
              t.set(n),
              t.findAll(e).reduce(function (n, t) {
                var o = t.start.row,
                  r = n[n.length - 1];
                return r && r.row === o
                  ? n
                  : n.concat({ row: o, content: e.getLine(o) });
              }, [])
            );
          }),
          n
        );
      })(a);
    e("./lib/dom").importCssString(
      ".ace_occur-highlight {\n    border-radius: 4px;\n    background-color: rgba(87, 255, 8, 0.25);\n    position: absolute;\n    z-index: 4;\n    box-sizing: border-box;\n    box-shadow: 0 0 4px rgb(91, 255, 50);\n}\n.ace_dark .ace_occur-highlight {\n    background-color: rgb(80, 140, 85);\n    box-shadow: 0 0 4px rgb(60, 120, 70);\n}\n",
      "incremental-occur-highlighting",
      !1
    ),
      (n.Occur = c);
  }
),
  ace.define(
    "ace/commands/occur_commands",
    [
      "require",
      "exports",
      "module",
      "ace/config",
      "ace/occur",
      "ace/keyboard/hash_handler",
      "ace/lib/oop",
    ],
    function (e, n, t) {
      e("../config");
      var o = e("../occur").Occur,
        r = {
          name: "occur",
          exec: function (e, n) {
            var t = !!e.session.$occur;
            new o().enter(e, n) && !t && s.installIn(e);
          },
          readOnly: !0,
        },
        a = [
          {
            name: "occurexit",
            bindKey: "esc|Ctrl-G",
            exec: function (e) {
              var n = e.session.$occur;
              n && (n.exit(e, {}), e.session.$occur || s.uninstallFrom(e));
            },
            readOnly: !0,
          },
          {
            name: "occuraccept",
            bindKey: "enter",
            exec: function (e) {
              var n = e.session.$occur;
              n &&
                (n.exit(e, { translatePosition: !0 }),
                e.session.$occur || s.uninstallFrom(e));
            },
            readOnly: !0,
          },
        ],
        i = e("../keyboard/hash_handler").HashHandler;
      function s() {}
      e("../lib/oop").inherits(s, i),
        function () {
          (this.isOccurHandler = !0),
            (this.attach = function (e) {
              i.call(this, a, e.commands.platform), (this.$editor = e);
            });
          var e = this.handleKeyboard;
          this.handleKeyboard = function (n, t, o, r) {
            var a = e.call(this, n, t, o, r);
            return a && a.command ? a : void 0;
          };
        }.call(s.prototype),
        (s.installIn = function (e) {
          var n = new this();
          e.keyBinding.addKeyboardHandler(n), e.commands.addCommands(a);
        }),
        (s.uninstallFrom = function (e) {
          e.commands.removeCommands(a);
          var n = e.getKeyboardHandler();
          n.isOccurHandler && e.keyBinding.removeKeyboardHandler(n);
        }),
        (n.occurStartCommand = r);
    }
  ),
  ace.define(
    "ace/commands/incremental_search_commands",
    [
      "require",
      "exports",
      "module",
      "ace/config",
      "ace/lib/oop",
      "ace/keyboard/hash_handler",
      "ace/commands/occur_commands",
    ],
    function (e, n, t) {
      var o = e("../config"),
        r = e("../lib/oop"),
        a = e("../keyboard/hash_handler").HashHandler,
        i = e("./occur_commands").occurStartCommand;
      function s(e) {
        this.$iSearch = e;
      }
      (n.iSearchStartCommands = [
        {
          name: "iSearch",
          bindKey: { win: "Ctrl-F", mac: "Command-F" },
          exec: function (e, n) {
            o.loadModule(["core", "ace/incremental_search"], function (t) {
              var o = (t.iSearch = t.iSearch || new t.IncrementalSearch());
              o.activate(e, n.backwards), n.jumpToFirstMatch && o.next(n);
            });
          },
          readOnly: !0,
        },
        {
          name: "iSearchBackwards",
          exec: function (e, n) {
            e.execCommand("iSearch", { backwards: !0 });
          },
          readOnly: !0,
        },
        {
          name: "iSearchAndGo",
          bindKey: { win: "Ctrl-K", mac: "Command-G" },
          exec: function (e, n) {
            e.execCommand("iSearch", {
              jumpToFirstMatch: !0,
              useCurrentOrPrevSearch: !0,
            });
          },
          readOnly: !0,
        },
        {
          name: "iSearchBackwardsAndGo",
          bindKey: { win: "Ctrl-Shift-K", mac: "Command-Shift-G" },
          exec: function (e) {
            e.execCommand("iSearch", {
              jumpToFirstMatch: !0,
              backwards: !0,
              useCurrentOrPrevSearch: !0,
            });
          },
          readOnly: !0,
        },
      ]),
        (n.iSearchCommands = [
          {
            name: "restartSearch",
            bindKey: { win: "Ctrl-F", mac: "Command-F" },
            exec: function (e) {
              e.cancelSearch(!0);
            },
          },
          {
            name: "searchForward",
            bindKey: { win: "Ctrl-S|Ctrl-K", mac: "Ctrl-S|Command-G" },
            exec: function (e, n) {
              (n.useCurrentOrPrevSearch = !0), e.next(n);
            },
          },
          {
            name: "searchBackward",
            bindKey: {
              win: "Ctrl-R|Ctrl-Shift-K",
              mac: "Ctrl-R|Command-Shift-G",
            },
            exec: function (e, n) {
              (n.useCurrentOrPrevSearch = !0), (n.backwards = !0), e.next(n);
            },
          },
          {
            name: "extendSearchTerm",
            exec: function (e, n) {
              e.addString(n);
            },
          },
          {
            name: "extendSearchTermSpace",
            bindKey: "space",
            exec: function (e) {
              e.addString(" ");
            },
          },
          {
            name: "shrinkSearchTerm",
            bindKey: "backspace",
            exec: function (e) {
              e.removeChar();
            },
          },
          {
            name: "confirmSearch",
            bindKey: "return",
            exec: function (e) {
              e.deactivate();
            },
          },
          {
            name: "cancelSearch",
            bindKey: "esc|Ctrl-G",
            exec: function (e) {
              e.deactivate(!0);
            },
          },
          {
            name: "occurisearch",
            bindKey: "Ctrl-O",
            exec: function (e) {
              var n = r.mixin({}, e.$options);
              e.deactivate(), i.exec(e.$editor, n);
            },
          },
          {
            name: "yankNextWord",
            bindKey: "Ctrl-w",
            exec: function (e) {
              var n = e.$editor,
                t = n.selection.getRangeOfMovements(function (e) {
                  e.moveCursorWordRight();
                }),
                o = n.session.getTextRange(t);
              e.addString(o);
            },
          },
          {
            name: "yankNextChar",
            bindKey: "Ctrl-Alt-y",
            exec: function (e) {
              var n = e.$editor,
                t = n.selection.getRangeOfMovements(function (e) {
                  e.moveCursorRight();
                }),
                o = n.session.getTextRange(t);
              e.addString(o);
            },
          },
          {
            name: "recenterTopBottom",
            bindKey: "Ctrl-l",
            exec: function (e) {
              e.$editor.execCommand("recenterTopBottom");
            },
          },
          {
            name: "selectAllMatches",
            bindKey: "Ctrl-space",
            exec: function (e) {
              var n = e.$editor,
                t = n.session.$isearchHighlight,
                o =
                  t && t.cache
                    ? t.cache.reduce(function (e, n) {
                        return e.concat(n || []);
                      }, [])
                    : [];
              e.deactivate(!1),
                o.forEach(n.selection.addRange.bind(n.selection));
            },
          },
          {
            name: "searchAsRegExp",
            bindKey: "Alt-r",
            exec: function (e) {
              e.convertNeedleToRegExp();
            },
          },
        ].map(function (e) {
          return (
            (e.readOnly = !0),
            (e.isIncrementalSearchCommand = !0),
            (e.scrollIntoView = "animate-cursor"),
            e
          );
        })),
        r.inherits(s, a),
        function () {
          (this.attach = function (e) {
            var t = this.$iSearch;
            a.call(this, n.iSearchCommands, e.commands.platform),
              (this.$commandExecHandler = e.commands.on("exec", function (n) {
                if (!n.command.isIncrementalSearchCommand)
                  return t.deactivate();
                n.stopPropagation(), n.preventDefault();
                var o = e.session.getScrollTop(),
                  r = n.command.exec(t, n.args || {});
                return (
                  e.renderer.scrollCursorIntoView(null, 0.5),
                  e.renderer.animateScrolling(o),
                  r
                );
              }));
          }),
            (this.detach = function (e) {
              this.$commandExecHandler &&
                (e.commands.off("exec", this.$commandExecHandler),
                delete this.$commandExecHandler);
            });
          var e = this.handleKeyboard;
          this.handleKeyboard = function (n, t, o, r) {
            if (((1 === t || 8 === t) && "v" === o) || (1 === t && "y" === o))
              return null;
            var a = e.call(this, n, t, o, r);
            if (a && a.command) return a;
            if (-1 == t) {
              var i = this.commands.extendSearchTerm;
              if (i) return { command: i, args: o };
            }
            return !1;
          };
        }.call(s.prototype),
        (n.IncrementalSearchKeyboardHandler = s);
    }
  ),
  ace.define(
    "ace/incremental_search",
    [
      "require",
      "exports",
      "module",
      "ace/range",
      "ace/search",
      "ace/search_highlight",
      "ace/commands/incremental_search_commands",
      "ace/lib/dom",
      "ace/commands/command_manager",
      "ace/editor",
      "ace/config",
    ],
    function (e, n, t) {
      "use strict";
      var o =
          (this && this.__extends) ||
          (function () {
            var e = function (n, t) {
              return (
                (e =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, n) {
                      e.__proto__ = n;
                    }) ||
                  function (e, n) {
                    for (var t in n)
                      Object.prototype.hasOwnProperty.call(n, t) &&
                        (e[t] = n[t]);
                  }),
                e(n, t)
              );
            };
            return function (n, t) {
              if ("function" !== typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null"
                );
              function o() {
                this.constructor = n;
              }
              e(n, t),
                (n.prototype =
                  null === t
                    ? Object.create(t)
                    : ((o.prototype = t.prototype), new o()));
            };
          })(),
        r = e("./range").Range,
        a = e("./search").Search,
        i = e("./search_highlight").SearchHighlight,
        s = e("./commands/incremental_search_commands"),
        c = s.IncrementalSearchKeyboardHandler;
      function l(e) {
        return e instanceof RegExp;
      }
      function d(e) {
        var n = String(e),
          t = n.indexOf("/"),
          o = n.lastIndexOf("/");
        return { expression: n.slice(t + 1, o), flags: n.slice(o + 1) };
      }
      function u(e, n) {
        try {
          return new RegExp(e, n);
        } catch (t) {
          return e;
        }
      }
      function m(e) {
        return u(e.expression, e.flags);
      }
      var h = (function (e) {
        function n() {
          var n = e.call(this) || this;
          return (
            (n.$options = { wrap: !1, skipCurrent: !1 }),
            (n.$keyboardHandler = new c(n)),
            n
          );
        }
        return (
          o(n, e),
          (n.prototype.activate = function (e, n) {
            (this.$editor = e),
              (this.$startPos = this.$currentPos = e.getCursorPosition()),
              (this.$options.needle = ""),
              (this.$options.backwards = n),
              e.keyBinding.addKeyboardHandler(this.$keyboardHandler),
              (this.$originalEditorOnPaste = e.onPaste),
              (e.onPaste = this.onPaste.bind(this)),
              (this.$mousedownHandler = e.on(
                "mousedown",
                this.onMouseDown.bind(this)
              )),
              this.selectionFix(e),
              this.statusMessage(!0);
          }),
          (n.prototype.deactivate = function (e) {
            this.cancelSearch(e);
            var n = this.$editor;
            n.keyBinding.removeKeyboardHandler(this.$keyboardHandler),
              this.$mousedownHandler &&
                (n.off("mousedown", this.$mousedownHandler),
                delete this.$mousedownHandler),
              (n.onPaste = this.$originalEditorOnPaste),
              this.message("");
          }),
          (n.prototype.selectionFix = function (e) {
            e.selection.isEmpty() &&
              !e.session.$emacsMark &&
              e.clearSelection();
          }),
          (n.prototype.highlight = function (e) {
            var n = this.$editor.session;
            (n.$isearchHighlight =
              n.$isearchHighlight ||
              n.addDynamicMarker(
                new i(null, "ace_isearch-result", "text")
              )).setRegexp(e),
              n._emit("changeBackMarker");
          }),
          (n.prototype.cancelSearch = function (e) {
            var n = this.$editor;
            return (
              (this.$prevNeedle = this.$options.needle),
              (this.$options.needle = ""),
              e
                ? (n.moveCursorToPosition(this.$startPos),
                  (this.$currentPos = this.$startPos))
                : n.pushEmacsMark && n.pushEmacsMark(this.$startPos, !1),
              this.highlight(null),
              r.fromPoints(this.$currentPos, this.$currentPos)
            );
          }),
          (n.prototype.highlightAndFindWithNeedle = function (e, n) {
            if (!this.$editor) return null;
            var t = this.$options;
            if (
              (n && (t.needle = n.call(this, t.needle || "") || ""),
              0 === t.needle.length)
            )
              return this.statusMessage(!0), this.cancelSearch(!0);
            t.start = this.$currentPos;
            var o = this.$editor.session,
              a = this.find(o),
              i = this.$editor.emacsMark
                ? !!this.$editor.emacsMark()
                : !this.$editor.selection.isEmpty();
            return (
              a &&
                (t.backwards && (a = r.fromPoints(a.end, a.start)),
                this.$editor.selection.setRange(
                  r.fromPoints(i ? this.$startPos : a.end, a.end)
                ),
                e && (this.$currentPos = a.end),
                this.highlight(t.re)),
              this.statusMessage(a),
              a
            );
          }),
          (n.prototype.addString = function (e) {
            return this.highlightAndFindWithNeedle(!1, function (n) {
              if (!l(n)) return n + e;
              var t = d(n);
              return (t.expression += e), m(t);
            });
          }),
          (n.prototype.removeChar = function (e) {
            return this.highlightAndFindWithNeedle(!1, function (e) {
              if (!l(e)) return e.substring(0, e.length - 1);
              var n = d(e);
              return (
                (n.expression = n.expression.substring(
                  0,
                  n.expression.length - 1
                )),
                m(n)
              );
            });
          }),
          (n.prototype.next = function (e) {
            return (
              (e = e || {}),
              (this.$options.backwards = !!e.backwards),
              (this.$currentPos = this.$editor.getCursorPosition()),
              this.highlightAndFindWithNeedle(!0, function (n) {
                return e.useCurrentOrPrevSearch && 0 === n.length
                  ? this.$prevNeedle || ""
                  : n;
              })
            );
          }),
          (n.prototype.onMouseDown = function (e) {
            return this.deactivate(), !0;
          }),
          (n.prototype.onPaste = function (e) {
            this.addString(e);
          }),
          (n.prototype.convertNeedleToRegExp = function () {
            return this.highlightAndFindWithNeedle(!1, function (e) {
              return l(e) ? e : u(e, "ig");
            });
          }),
          (n.prototype.convertNeedleToString = function () {
            return this.highlightAndFindWithNeedle(!1, function (e) {
              return l(e) ? d(e).expression : e;
            });
          }),
          (n.prototype.statusMessage = function (e) {
            var n = this.$options,
              t = "";
            (t += n.backwards ? "reverse-" : ""),
              (t += "isearch: " + n.needle),
              (t += e ? "" : " (not found)"),
              this.message(t);
          }),
          (n.prototype.message = function (e) {
            this.$editor.showCommandLine &&
              (this.$editor.showCommandLine(e), this.$editor.focus());
          }),
          n
        );
      })(a);
      (n.IncrementalSearch = h),
        e("./lib/dom").importCssString(
          "\n.ace_marker-layer .ace_isearch-result {\n  position: absolute;\n  z-index: 6;\n  box-sizing: border-box;\n}\ndiv.ace_isearch-result {\n  border-radius: 4px;\n  background-color: rgba(255, 200, 0, 0.5);\n  box-shadow: 0 0 4px rgb(255, 200, 0);\n}\n.ace_dark div.ace_isearch-result {\n  background-color: rgb(100, 110, 160);\n  box-shadow: 0 0 4px rgb(80, 90, 140);\n}",
          "incremental-search-highlighting",
          !1
        );
      var g = e("./commands/command_manager");
      (function () {
        this.setupIncrementalSearch = function (e, n) {
          if (this.usesIncrementalSearch != n) {
            this.usesIncrementalSearch = n;
            var t = s.iSearchStartCommands;
            this[n ? "addCommands" : "removeCommands"](t);
          }
        };
      }).call(g.CommandManager.prototype);
      var p = e("./editor").Editor;
      e("./config").defineOptions(p.prototype, "editor", {
        useIncrementalSearch: {
          set: function (e) {
            this.keyBinding.$handlers.forEach(function (n) {
              n.setupIncrementalSearch && n.setupIncrementalSearch(this, e);
            }),
              this._emit("incrementalSearchSettingChanged", { isEnabled: e });
          },
        },
      });
    }
  ),
  ace.define(
    "ace/keyboard/emacs",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/incremental_search",
      "ace/commands/incremental_search_commands",
      "ace/keyboard/hash_handler",
      "ace/lib/keys",
    ],
    function (e, n, t) {
      "use strict";
      var o = e("../lib/dom");
      e("../incremental_search");
      var r,
        a,
        i = e("../commands/incremental_search_commands"),
        s = e("./hash_handler").HashHandler;
      (n.handler = new s()),
        (n.handler.isEmacs = !0),
        (n.handler.$id = "ace/keyboard/emacs"),
        o.importCssString(
          "\n.emacs-mode .ace_cursor{\n    border: 1px rgba(50,250,50,0.8) solid!important;\n    box-sizing: border-box!important;\n    background-color: rgba(0,250,0,0.9);\n    opacity: 0.5;\n}\n.emacs-mode .ace_hidden-cursors .ace_cursor{\n    opacity: 1;\n    background-color: transparent;\n}\n.emacs-mode .ace_overwrite-cursors .ace_cursor {\n    opacity: 1;\n    background-color: transparent;\n    border-width: 0 0 2px 2px !important;\n}\n.emacs-mode .ace_text-layer {\n    z-index: 4\n}\n.emacs-mode .ace_cursor-layer {\n    z-index: 2\n}",
          "emacsMode"
        ),
        (n.handler.attach = function (e) {
          (r = e.session.$selectLongWords),
            (e.session.$selectLongWords = !0),
            (a = e.session.$useEmacsStyleLineStart),
            (e.session.$useEmacsStyleLineStart = !0),
            (e.session.$emacsMark = null),
            (e.session.$emacsMarkRing = e.session.$emacsMarkRing || []),
            (e.emacsMark = function () {
              return this.session.$emacsMark;
            }),
            (e.setEmacsMark = function (e) {
              this.session.$emacsMark = e;
            }),
            (e.pushEmacsMark = function (e, n) {
              var t = this.session.$emacsMark;
              t && this.session.$emacsMarkRing.push(t),
                !e || n
                  ? this.setEmacsMark(e)
                  : this.session.$emacsMarkRing.push(e);
            }),
            (e.popEmacsMark = function () {
              var e = this.emacsMark();
              return e
                ? (this.setEmacsMark(null), e)
                : this.session.$emacsMarkRing.pop();
            }),
            (e.getLastEmacsMark = function (e) {
              return (
                this.session.$emacsMark ||
                this.session.$emacsMarkRing.slice(-1)[0]
              );
            }),
            (e.emacsMarkForSelection = function (e) {
              var n = this.selection,
                t = this.multiSelect
                  ? this.multiSelect.getAllRanges().length
                  : 1,
                o = n.index || 0,
                r = this.session.$emacsMarkRing,
                a = r.length - (t - o),
                i = r[a] || n.anchor;
              return (
                e && r.splice(a, 1, "row" in e && "column" in e ? e : void 0), i
              );
            }),
            e.on("click", l),
            e.on("changeSession", c),
            (e.renderer.$blockCursor = !0),
            e.setStyle("emacs-mode"),
            e.commands.addCommands(m),
            (n.handler.platform = e.commands.platform),
            (e.$emacsModeHandler = this),
            e.on("copy", this.onCopy),
            e.on("paste", this.onPaste);
        }),
        (n.handler.detach = function (e) {
          (e.renderer.$blockCursor = !1),
            (e.session.$selectLongWords = r),
            (e.session.$useEmacsStyleLineStart = a),
            e.off("click", l),
            e.off("changeSession", c),
            e.unsetStyle("emacs-mode"),
            e.commands.removeCommands(m),
            e.off("copy", this.onCopy),
            e.off("paste", this.onPaste),
            (e.$emacsModeHandler = null);
        });
      var c = function (e) {
          e.oldSession &&
            ((e.oldSession.$selectLongWords = r),
            (e.oldSession.$useEmacsStyleLineStart = a)),
            (r = e.session.$selectLongWords),
            (e.session.$selectLongWords = !0),
            (a = e.session.$useEmacsStyleLineStart),
            (e.session.$useEmacsStyleLineStart = !0),
            e.session.hasOwnProperty("$emacsMark") ||
              (e.session.$emacsMark = null),
            e.session.hasOwnProperty("$emacsMarkRing") ||
              (e.session.$emacsMarkRing = []);
        },
        l = function (e) {
          e.editor.session.$emacsMark = null;
        },
        d = e("../lib/keys").KEY_MODS,
        u = { C: "ctrl", S: "shift", M: "alt", CMD: "command" };
      [
        "C-S-M-CMD",
        "S-M-CMD",
        "C-M-CMD",
        "C-S-CMD",
        "C-S-M",
        "M-CMD",
        "S-CMD",
        "S-M",
        "C-CMD",
        "C-M",
        "C-S",
        "CMD",
        "M",
        "S",
        "C",
      ].forEach(function (e) {
        var n = 0;
        e.split("-").forEach(function (e) {
          n |= d[u[e]];
        }),
          (u[n] = e.toLowerCase() + "-");
      }),
        (n.handler.onCopy = function (e, t) {
          t.$handlesEmacsOnCopy ||
            ((t.$handlesEmacsOnCopy = !0),
            n.handler.commands.killRingSave.exec(t),
            (t.$handlesEmacsOnCopy = !1));
        }),
        (n.handler.onPaste = function (e, n) {
          n.pushEmacsMark(n.getCursorPosition());
        }),
        (n.handler.bindKey = function (e, n) {
          if (("object" == typeof e && (e = e[this.platform]), e)) {
            var t = this.commandKeyBinding;
            e.split("|").forEach(function (e) {
              (e = e.toLowerCase()),
                (t[e] = n),
                e
                  .split(" ")
                  .slice(0, -1)
                  .reduce(function (e, n, t) {
                    var o = e[t - 1] ? e[t - 1] + " " : "";
                    return e.concat([o + n]);
                  }, [])
                  .forEach(function (e) {
                    t[e] || (t[e] = "null");
                  });
            }, this);
          }
        }),
        (n.handler.getStatusText = function (e, n) {
          var t = "";
          return (
            n.count && (t += n.count), n.keyChain && (t += " " + n.keyChain), t
          );
        }),
        (n.handler.handleKeyboard = function (e, n, t, o) {
          if (-1 !== o) {
            var r = e.editor;
            if (
              (r._signal("changeStatus"),
              -1 == n && (r.pushEmacsMark(), e.count))
            ) {
              var a = new Array(e.count + 1).join(t);
              return (e.count = null), { command: "insertstring", args: a };
            }
            var i = u[n];
            if ("c-" == i || e.count)
              if (
                "number" === typeof (l = parseInt(t[t.length - 1])) &&
                !isNaN(l)
              )
                return (
                  (e.count = Math.max(e.count, 0) || 0),
                  (e.count = 10 * e.count + l),
                  { command: "null" }
                );
            i && (t = i + t), e.keyChain && (t = e.keyChain += " " + t);
            var s = this.commandKeyBinding[t];
            if (((e.keyChain = "null" == s ? t : ""), s)) {
              if ("null" === s) return { command: "null" };
              if ("universalArgument" === s)
                return (e.count = -4), { command: "null" };
              var c;
              if (
                ("string" !== typeof s &&
                  ((c = s.args),
                  s.command && (s = s.command),
                  "goorselect" === s &&
                    ((s = r.emacsMark() ? c[1] : c[0]), (c = null))),
                "string" !== typeof s ||
                  (("insertstring" !== s &&
                    "splitline" !== s &&
                    "togglecomment" !== s) ||
                    r.pushEmacsMark(),
                  (s = this.commands[s] || r.commands.commands[s])))
              ) {
                if (
                  (s.readOnly || s.isYank || (e.lastCommand = null),
                  !s.readOnly && r.emacsMark() && r.setEmacsMark(null),
                  e.count)
                ) {
                  var l = e.count;
                  if (((e.count = 0), !s || !s.handlesCount))
                    return {
                      args: c,
                      command: {
                        exec: function (e, n) {
                          for (var t = 0; t < l; t++) s.exec(e, n);
                        },
                        multiSelectAction: s.multiSelectAction,
                      },
                    };
                  c || (c = {}), "object" === typeof c && (c.count = l);
                }
                return { command: s, args: c };
              }
            }
          }
        }),
        (n.emacsKeys = {
          "Up|C-p": { command: "goorselect", args: ["golineup", "selectup"] },
          "Down|C-n": {
            command: "goorselect",
            args: ["golinedown", "selectdown"],
          },
          "Left|C-b": {
            command: "goorselect",
            args: ["gotoleft", "selectleft"],
          },
          "Right|C-f": {
            command: "goorselect",
            args: ["gotoright", "selectright"],
          },
          "C-Left|M-b": {
            command: "goorselect",
            args: ["gotowordleft", "selectwordleft"],
          },
          "C-Right|M-f": {
            command: "goorselect",
            args: ["gotowordright", "selectwordright"],
          },
          "Home|C-a": {
            command: "goorselect",
            args: ["gotolinestart", "selecttolinestart"],
          },
          "End|C-e": {
            command: "goorselect",
            args: ["gotolineend", "selecttolineend"],
          },
          "C-Home|S-M-,": {
            command: "goorselect",
            args: ["gotostart", "selecttostart"],
          },
          "C-End|S-M-.": {
            command: "goorselect",
            args: ["gotoend", "selecttoend"],
          },
          "S-Up|S-C-p": "selectup",
          "S-Down|S-C-n": "selectdown",
          "S-Left|S-C-b": "selectleft",
          "S-Right|S-C-f": "selectright",
          "S-C-Left|S-M-b": "selectwordleft",
          "S-C-Right|S-M-f": "selectwordright",
          "S-Home|S-C-a": "selecttolinestart",
          "S-End|S-C-e": "selecttolineend",
          "S-C-Home": "selecttostart",
          "S-C-End": "selecttoend",
          "C-l": "recenterTopBottom",
          "M-s": "centerselection",
          "M-g": "gotoline",
          "C-x C-p": "selectall",
          "C-Down": {
            command: "goorselect",
            args: ["gotopagedown", "selectpagedown"],
          },
          "C-Up": {
            command: "goorselect",
            args: ["gotopageup", "selectpageup"],
          },
          "PageDown|C-v": {
            command: "goorselect",
            args: ["gotopagedown", "selectpagedown"],
          },
          "PageUp|M-v": {
            command: "goorselect",
            args: ["gotopageup", "selectpageup"],
          },
          "S-C-Down": "selectpagedown",
          "S-C-Up": "selectpageup",
          "C-s": "iSearch",
          "C-r": "iSearchBackwards",
          "M-C-s": "findnext",
          "M-C-r": "findprevious",
          "S-M-5": "replace",
          Backspace: "backspace",
          "Delete|C-d": "del",
          "Return|C-m": { command: "insertstring", args: "\n" },
          "C-o": "splitline",
          "M-d|C-Delete": { command: "killWord", args: "right" },
          "C-Backspace|M-Backspace|M-Delete": {
            command: "killWord",
            args: "left",
          },
          "C-k": "killLine",
          "C-y|S-Delete": "yank",
          "M-y": "yankRotate",
          "C-g": "keyboardQuit",
          "C-w|C-S-W": "killRegion",
          "M-w": "killRingSave",
          "C-Space": "setMark",
          "C-x C-x": "exchangePointAndMark",
          "C-t": "transposeletters",
          "M-u": "touppercase",
          "M-l": "tolowercase",
          "M-/": "autocomplete",
          "C-u": "universalArgument",
          "M-;": "togglecomment",
          "C-/|C-x u|S-C--|C-z": "undo",
          "S-C-/|S-C-x u|C--|S-C-z": "redo",
          "C-x r": "selectRectangularRegion",
          "M-x": { command: "focusCommandLine", args: "M-x " },
        }),
        n.handler.bindKeys(n.emacsKeys),
        n.handler.addCommands({
          recenterTopBottom: function (e) {
            var n = e.renderer,
              t = n.$cursorLayer.getPixelPosition(),
              o = n.$size.scrollerHeight - n.lineHeight,
              r = n.scrollTop;
            (r =
              Math.abs(t.top - r) < 2
                ? t.top - o
                : Math.abs(t.top - r - 0.5 * o) < 2
                ? t.top
                : t.top - 0.5 * o),
              e.session.setScrollTop(r);
          },
          selectRectangularRegion: function (e) {
            e.multiSelect.toggleBlockSelection();
          },
          setMark: {
            exec: function (e, n) {
              if (n && n.count)
                return (
                  e.inMultiSelectMode ? e.forEachSelection(i) : i(), void i()
                );
              var t = e.emacsMark(),
                o = e.selection.getAllRanges(),
                r = o.map(function (e) {
                  return { row: e.start.row, column: e.start.column };
                }),
                a = o.every(function (e) {
                  return e.isEmpty();
                });
              if (t || !a)
                return (
                  e.inMultiSelectMode
                    ? e.forEachSelection({ exec: e.clearSelection.bind(e) })
                    : e.clearSelection(),
                  void (t && e.pushEmacsMark(null))
                );
              if (!t)
                return (
                  r.forEach(function (n) {
                    e.pushEmacsMark(n);
                  }),
                  void e.setEmacsMark(r[r.length - 1])
                );
              function i() {
                var n = e.popEmacsMark();
                n && e.moveCursorToPosition(n);
              }
            },
            readOnly: !0,
            handlesCount: !0,
          },
          exchangePointAndMark: {
            exec: function (e, n) {
              var t = e.selection;
              if (n.count || t.isEmpty())
                if (n.count) {
                  var o = { row: t.lead.row, column: t.lead.column };
                  t.clearSelection(),
                    t.moveCursorToPosition(e.emacsMarkForSelection(o));
                } else t.selectToPosition(e.emacsMarkForSelection());
              else t.setSelectionRange(t.getRange(), !t.isBackwards());
            },
            readOnly: !0,
            handlesCount: !0,
            multiSelectAction: "forEach",
          },
          killWord: {
            exec: function (e, t) {
              e.clearSelection(),
                "left" == t
                  ? e.selection.selectWordLeft()
                  : e.selection.selectWordRight();
              var o = e.getSelectionRange(),
                r = e.session.getTextRange(o);
              n.killRing.add(r), e.session.remove(o), e.clearSelection();
            },
            multiSelectAction: "forEach",
          },
          killLine: function (e) {
            e.pushEmacsMark(null), e.clearSelection();
            var t = e.getSelectionRange(),
              o = e.session.getLine(t.start.row);
            (t.end.column = o.length), (o = o.substr(t.start.column));
            var r = e.session.getFoldLine(t.start.row);
            r && t.end.row != r.end.row && ((t.end.row = r.end.row), (o = "x")),
              /^\s*$/.test(o) &&
                (t.end.row++,
                (o = e.session.getLine(t.end.row)),
                (t.end.column = /^\s*$/.test(o) ? o.length : 0));
            var a = e.session.getTextRange(t);
            e.prevOp.command == this ? n.killRing.append(a) : n.killRing.add(a),
              e.session.remove(t),
              e.clearSelection();
          },
          yank: function (e) {
            e.onPaste(n.killRing.get() || ""),
              (e.keyBinding.$data.lastCommand = "yank");
          },
          yankRotate: function (e) {
            "yank" == e.keyBinding.$data.lastCommand &&
              (e.undo(),
              e.session.$emacsMarkRing.pop(),
              e.onPaste(n.killRing.rotate()),
              (e.keyBinding.$data.lastCommand = "yank"));
          },
          killRegion: {
            exec: function (e) {
              n.killRing.add(e.getCopyText()),
                e.commands.byName.cut.exec(e),
                e.setEmacsMark(null);
            },
            readOnly: !0,
            multiSelectAction: "forEach",
          },
          killRingSave: {
            exec: function (e) {
              e.$handlesEmacsOnCopy = !0;
              var t = e.session.$emacsMarkRing.slice(),
                o = [];
              n.killRing.add(e.getCopyText()),
                setTimeout(function () {
                  function n() {
                    var n = e.selection,
                      t = n.getRange(),
                      r = n.isBackwards() ? t.end : t.start;
                    o.push({ row: r.row, column: r.column }),
                      n.clearSelection();
                  }
                  (e.$handlesEmacsOnCopy = !1),
                    e.inMultiSelectMode ? e.forEachSelection({ exec: n }) : n(),
                    e.setEmacsMark(null),
                    (e.session.$emacsMarkRing = t.concat(o.reverse()));
                }, 0);
            },
            readOnly: !0,
          },
          keyboardQuit: function (e) {
            e.selection.clearSelection(),
              e.setEmacsMark(null),
              (e.keyBinding.$data.count = null);
          },
          focusCommandLine: function (e, n) {
            e.showCommandLine && e.showCommandLine(n);
          },
        }),
        n.handler.addCommands(i.iSearchStartCommands);
      var m = n.handler.commands;
      (m.yank.isYank = !0),
        (m.yankRotate.isYank = !0),
        (n.killRing = {
          $data: [],
          add: function (e) {
            e && this.$data.push(e),
              this.$data.length > 30 && this.$data.shift();
          },
          append: function (e) {
            var n = this.$data.length - 1,
              t = this.$data[n] || "";
            e && (t += e), t && (this.$data[n] = t);
          },
          get: function (e) {
            return (
              (e = e || 1),
              this.$data
                .slice(this.$data.length - e, this.$data.length)
                .reverse()
                .join("\n")
            );
          },
          pop: function () {
            return this.$data.length > 1 && this.$data.pop(), this.get();
          },
          rotate: function () {
            return this.$data.unshift(this.$data.pop()), this.get();
          },
        });
    }
  ),
  ace.require(["ace/keyboard/emacs"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
