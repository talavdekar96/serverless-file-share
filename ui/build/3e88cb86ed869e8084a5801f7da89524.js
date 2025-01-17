ace.define(
  "ace/autocomplete/popup",
  [
    "require",
    "exports",
    "module",
    "ace/virtual_renderer",
    "ace/editor",
    "ace/range",
    "ace/lib/event",
    "ace/lib/lang",
    "ace/lib/dom",
    "ace/config",
  ],
  function (e, t, n) {
    "use strict";
    var o = e("../virtual_renderer").VirtualRenderer,
      i = e("../editor").Editor,
      r = e("../range").Range,
      s = e("../lib/event"),
      a = e("../lib/lang"),
      c = e("../lib/dom"),
      l = e("../config").nls,
      p = function (e) {
        return "suggest-aria-id:".concat(e);
      },
      h = function (e) {
        var t = new o(e);
        t.$maxLines = 4;
        var n = new i(t);
        return (
          n.setHighlightActiveLine(!1),
          n.setShowPrintMargin(!1),
          n.renderer.setShowGutter(!1),
          n.renderer.setHighlightGutterLine(!1),
          (n.$mouseHandler.$focusTimeout = 0),
          (n.$highlightTagPending = !0),
          n
        );
      },
      u = function (e) {
        var t = c.createElement("div"),
          n = new h(t);
        e && e.appendChild(t),
          (t.style.display = "none"),
          (n.renderer.content.style.cursor = "default"),
          n.renderer.setStyle("ace_autocomplete"),
          n.renderer.$textLayer.element.setAttribute("role", "listbox"),
          n.renderer.$textLayer.element.setAttribute(
            "aria-label",
            l("Autocomplete suggestions")
          ),
          n.renderer.textarea.setAttribute("aria-hidden", "true"),
          n.setOption("displayIndentGuides", !1),
          n.setOption("dragDelay", 150);
        var o,
          i = function () {};
        (n.focus = i),
          (n.$isFocused = !0),
          (n.renderer.$cursorLayer.restartTimer = i),
          (n.renderer.$cursorLayer.element.style.opacity = 0),
          (n.renderer.$maxLines = 8),
          (n.renderer.$keepTextAreaAtCursor = !1),
          n.setHighlightActiveLine(!1),
          n.session.highlight(""),
          (n.session.$searchHighlight.clazz = "ace_highlight-marker"),
          n.on("mousedown", function (e) {
            var t = e.getDocumentPosition();
            n.selection.moveToPosition(t),
              (d.start.row = d.end.row = t.row),
              e.stop();
          });
        var u = new r(-1, 0, -1, 1 / 0),
          d = new r(-1, 0, -1, 1 / 0);
        (d.id = n.session.addMarker(d, "ace_active-line", "fullLine")),
          (n.setSelectOnHover = function (e) {
            e
              ? u.id && (n.session.removeMarker(u.id), (u.id = null))
              : (u.id = n.session.addMarker(u, "ace_line-hover", "fullLine"));
          }),
          n.setSelectOnHover(!1),
          n.on("mousemove", function (e) {
            if (o) {
              if (o.x != e.x || o.y != e.y) {
                (o = e).scrollTop = n.renderer.scrollTop;
                var t = o.getDocumentPosition().row;
                u.start.row != t && (u.id || n.setRow(t), f(t));
              }
            } else o = e;
          }),
          n.renderer.on("beforeRender", function () {
            if (o && -1 != u.start.row) {
              o.$pos = null;
              var e = o.getDocumentPosition().row;
              u.id || n.setRow(e), f(e, !0);
            }
          }),
          n.renderer.on("afterRender", function () {
            var e = n.getRow(),
              t = n.renderer.$textLayer,
              o = t.element.childNodes[e - t.config.firstRow],
              i = document.activeElement;
            if (
              (o !== t.selectedNode &&
                t.selectedNode &&
                (c.removeCssClass(t.selectedNode, "ace_selected"),
                i.removeAttribute("aria-activedescendant"),
                t.selectedNode.removeAttribute("id")),
              (t.selectedNode = o),
              o)
            ) {
              c.addCssClass(o, "ace_selected");
              var r = p(e);
              (o.id = r),
                t.element.setAttribute("aria-activedescendant", r),
                i.setAttribute("aria-activedescendant", r),
                o.setAttribute("role", "option"),
                o.setAttribute("aria-label", n.getData(e).value),
                o.setAttribute("aria-setsize", n.data.length),
                o.setAttribute("aria-posinset", e + 1),
                o.setAttribute("aria-describedby", "doc-tooltip");
            }
          });
        var g = function () {
            f(-1);
          },
          f = function (e, t) {
            e !== u.start.row &&
              ((u.start.row = u.end.row = e),
              t || n.session._emit("changeBackMarker"),
              n._emit("changeHoverMarker"));
          };
        (n.getHoveredRow = function () {
          return u.start.row;
        }),
          s.addListener(n.container, "mouseout", g),
          n.on("hide", g),
          n.on("changeSelection", g),
          (n.session.doc.getLength = function () {
            return n.data.length;
          }),
          (n.session.doc.getLine = function (e) {
            var t = n.data[e];
            return "string" == typeof t ? t : (t && t.value) || "";
          });
        var m = n.session.bgTokenizer;
        return (
          (m.$tokenizeRow = function (e) {
            var t = n.data[e],
              o = [];
            if (!t) return o;
            "string" == typeof t && (t = { value: t });
            var i = t.caption || t.value || t.name;
            function r(e, n) {
              e && o.push({ type: (t.className || "") + (n || ""), value: e });
            }
            for (
              var s = i.toLowerCase(),
                a = (n.filterText || "").toLowerCase(),
                c = 0,
                l = 0,
                p = 0;
              p <= a.length;
              p++
            )
              if (p != l && (t.matchMask & (1 << p) || p == a.length)) {
                var h = a.slice(l, p);
                l = p;
                var u = s.indexOf(h, c);
                if (-1 == u) continue;
                r(i.slice(c, u), ""),
                  (c = u + h.length),
                  r(i.slice(u, c), "completion-highlight");
              }
            return (
              r(i.slice(c, i.length), ""),
              o.push({ type: "completion-spacer", value: " " }),
              t.meta && o.push({ type: "completion-meta", value: t.meta }),
              t.message &&
                o.push({ type: "completion-message", value: t.message }),
              o
            );
          }),
          (m.$updateOnChange = i),
          (m.start = i),
          (n.session.$computeWidth = function () {
            return (this.screenWidth = 0);
          }),
          (n.isOpen = !1),
          (n.isTopdown = !1),
          (n.autoSelect = !0),
          (n.filterText = ""),
          (n.data = []),
          (n.setData = function (e, t) {
            (n.filterText = t || ""),
              n.setValue(a.stringRepeat("\n", e.length), -1),
              (n.data = e || []),
              n.setRow(0);
          }),
          (n.getData = function (e) {
            return n.data[e];
          }),
          (n.getRow = function () {
            return d.start.row;
          }),
          (n.setRow = function (e) {
            (e = Math.max(
              this.autoSelect ? 0 : -1,
              Math.min(this.data.length - 1, e)
            )),
              d.start.row != e &&
                (n.selection.clearSelection(),
                (d.start.row = d.end.row = e || 0),
                n.session._emit("changeBackMarker"),
                n.moveCursorTo(e || 0, 0),
                n.isOpen && n._signal("select"));
          }),
          n.on("changeSelection", function () {
            n.isOpen && n.setRow(n.selection.lead.row),
              n.renderer.scrollCursorIntoView();
          }),
          (n.hide = function () {
            (this.container.style.display = "none"),
              (n.anchorPos = null),
              (n.anchor = null),
              n.isOpen && ((n.isOpen = !1), this._signal("hide"));
          }),
          (n.tryShow = function (e, t, i, r) {
            if (
              !r &&
              n.isOpen &&
              n.anchorPos &&
              n.anchor &&
              n.anchorPos.top === e.top &&
              n.anchorPos.left === e.left &&
              n.anchor === i
            )
              return !0;
            var s = this.container,
              a = window.innerHeight,
              c = window.innerWidth,
              l = this.renderer,
              p = l.$maxLines * t * 1.4,
              h = { top: 0, bottom: 0, left: 0 },
              u = a - e.top - 3 * this.$borderSize - t,
              d = e.top - 3 * this.$borderSize;
            i || (i = d <= u || u >= p ? "bottom" : "top"),
              "top" === i
                ? ((h.bottom = e.top - this.$borderSize),
                  (h.top = h.bottom - p))
                : "bottom" === i &&
                  ((h.top = e.top + t + this.$borderSize),
                  (h.bottom = h.top + p));
            var g = h.top >= 0 && h.bottom <= a;
            if (!r && !g) return !1;
            (l.$maxPixelHeight = g ? null : "top" === i ? d : u),
              "top" === i
                ? ((s.style.top = ""),
                  (s.style.bottom = a - h.bottom + "px"),
                  (n.isTopdown = !1))
                : ((s.style.top = h.top + "px"),
                  (s.style.bottom = ""),
                  (n.isTopdown = !0)),
              (s.style.display = "");
            var f = e.left;
            return (
              f + s.offsetWidth > c && (f = c - s.offsetWidth),
              (s.style.left = f + "px"),
              (s.style.right = ""),
              n.isOpen || ((n.isOpen = !0), this._signal("show"), (o = null)),
              (n.anchorPos = e),
              (n.anchor = i),
              !0
            );
          }),
          (n.show = function (e, t, n) {
            this.tryShow(e, t, n ? "bottom" : void 0, !0);
          }),
          (n.goTo = function (e) {
            var t = this.getRow(),
              n = this.session.getLength() - 1;
            switch (e) {
              case "up":
                t = t <= 0 ? n : t - 1;
                break;
              case "down":
                t = t >= n ? -1 : t + 1;
                break;
              case "start":
                t = 0;
                break;
              case "end":
                t = n;
            }
            this.setRow(t);
          }),
          (n.getTextLeftOffset = function () {
            return this.$borderSize + this.renderer.$padding + this.$imageSize;
          }),
          (n.$imageSize = 0),
          (n.$borderSize = 1),
          n
        );
      };
    c.importCssString(
      "\n.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #CAD6FA;\n    z-index: 1;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #3a674e;\n}\n.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid #abbffe;\n    margin-top: -1px;\n    background: rgba(233,233,253,0.4);\n    position: absolute;\n    z-index: 2;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid rgba(109, 150, 13, 0.8);\n    background: rgba(58, 103, 78, 0.62);\n}\n.ace_completion-meta {\n    opacity: 0.5;\n    margin-left: 0.9em;\n}\n.ace_completion-message {\n    color: blue;\n}\n.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #2d69c7;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #93ca12;\n}\n.ace_editor.ace_autocomplete {\n    width: 300px;\n    z-index: 200000;\n    border: 1px lightgray solid;\n    position: fixed;\n    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\n    line-height: 1.4;\n    background: #fefefe;\n    color: #111;\n}\n.ace_dark.ace_editor.ace_autocomplete {\n    border: 1px #484747 solid;\n    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);\n    line-height: 1.4;\n    background: #25282c;\n    color: #c1c1c1;\n}\n.ace_autocomplete .ace_text-layer  {\n    width: calc(100% - 8px);\n}\n.ace_autocomplete .ace_line {\n    display: flex;\n    align-items: center;\n}\n.ace_autocomplete .ace_line > * {\n    min-width: 0;\n    flex: 0 0 auto;\n}\n.ace_autocomplete .ace_line .ace_ {\n    flex: 0 1 auto;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n.ace_autocomplete .ace_completion-spacer {\n    flex: 1;\n}\n",
      "autocompletion.css",
      !1
    ),
      (t.AcePopup = u),
      (t.$singleLineEditor = h),
      (t.getAriaId = p);
  }
),
  ace.define(
    "ace/snippets",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/lib/oop",
      "ace/lib/event_emitter",
      "ace/lib/lang",
      "ace/range",
      "ace/range_list",
      "ace/keyboard/hash_handler",
      "ace/tokenizer",
      "ace/clipboard",
      "ace/editor",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("./lib/dom"),
        i = e("./lib/oop"),
        r = e("./lib/event_emitter").EventEmitter,
        s = e("./lib/lang"),
        a = e("./range").Range,
        c = e("./range_list").RangeList,
        l = e("./keyboard/hash_handler").HashHandler,
        p = e("./tokenizer").Tokenizer,
        h = e("./clipboard"),
        u = {
          CURRENT_WORD: function (e) {
            return e.session.getTextRange(e.session.getWordRange());
          },
          SELECTION: function (e, t, n) {
            var o = e.session.getTextRange();
            return n ? o.replace(/\n\r?([ \t]*\S)/g, "\n" + n + "$1") : o;
          },
          CURRENT_LINE: function (e) {
            return e.session.getLine(e.getCursorPosition().row);
          },
          PREV_LINE: function (e) {
            return e.session.getLine(e.getCursorPosition().row - 1);
          },
          LINE_INDEX: function (e) {
            return e.getCursorPosition().row;
          },
          LINE_NUMBER: function (e) {
            return e.getCursorPosition().row + 1;
          },
          SOFT_TABS: function (e) {
            return e.session.getUseSoftTabs() ? "YES" : "NO";
          },
          TAB_SIZE: function (e) {
            return e.session.getTabSize();
          },
          CLIPBOARD: function (e) {
            return h.getText && h.getText();
          },
          FILENAME: function (e) {
            return /[^/\\]*$/.exec(this.FILEPATH(e))[0];
          },
          FILENAME_BASE: function (e) {
            return /[^/\\]*$/.exec(this.FILEPATH(e))[0].replace(/\.[^.]*$/, "");
          },
          DIRECTORY: function (e) {
            return this.FILEPATH(e).replace(/[^/\\]*$/, "");
          },
          FILEPATH: function (e) {
            return "/not implemented.txt";
          },
          WORKSPACE_NAME: function () {
            return "Unknown";
          },
          FULLNAME: function () {
            return "Unknown";
          },
          BLOCK_COMMENT_START: function (e) {
            var t = e.session.$mode || {};
            return (t.blockComment && t.blockComment.start) || "";
          },
          BLOCK_COMMENT_END: function (e) {
            var t = e.session.$mode || {};
            return (t.blockComment && t.blockComment.end) || "";
          },
          LINE_COMMENT: function (e) {
            return (e.session.$mode || {}).lineCommentStart || "";
          },
          CURRENT_YEAR: d.bind(null, { year: "numeric" }),
          CURRENT_YEAR_SHORT: d.bind(null, { year: "2-digit" }),
          CURRENT_MONTH: d.bind(null, { month: "numeric" }),
          CURRENT_MONTH_NAME: d.bind(null, { month: "long" }),
          CURRENT_MONTH_NAME_SHORT: d.bind(null, { month: "short" }),
          CURRENT_DATE: d.bind(null, { day: "2-digit" }),
          CURRENT_DAY_NAME: d.bind(null, { weekday: "long" }),
          CURRENT_DAY_NAME_SHORT: d.bind(null, { weekday: "short" }),
          CURRENT_HOUR: d.bind(null, { hour: "2-digit", hour12: !1 }),
          CURRENT_MINUTE: d.bind(null, { minute: "2-digit" }),
          CURRENT_SECOND: d.bind(null, { second: "2-digit" }),
        };
      function d(e) {
        var t = new Date().toLocaleString("en-us", e);
        return 1 == t.length ? "0" + t : t;
      }
      u.SELECTED_TEXT = u.SELECTION;
      var g = (function () {
        function e() {
          (this.snippetMap = {}),
            (this.snippetNameMap = {}),
            (this.variables = u);
        }
        return (
          (e.prototype.getTokenizer = function () {
            return e.$tokenizer || this.createTokenizer();
          }),
          (e.prototype.createTokenizer = function () {
            function t(e) {
              return (
                (e = e.substr(1)),
                /^\d+$/.test(e)
                  ? [{ tabstopId: parseInt(e, 10) }]
                  : [{ text: e }]
              );
            }
            function n(e) {
              return "(?:[^\\\\" + e + "]|\\\\.)";
            }
            var o = {
              regex: "/(" + n("/") + "+)/",
              onMatch: function (e, t, n) {
                var o = n[0];
                return (
                  (o.fmtString = !0),
                  (o.guard = e.slice(1, -1)),
                  (o.flag = ""),
                  ""
                );
              },
              next: "formatString",
            };
            return (
              (e.$tokenizer = new p({
                start: [
                  {
                    regex: /\\./,
                    onMatch: function (e, t, n) {
                      var o = e[1];
                      return (
                        (("}" == o && n.length) || -1 != "`$\\".indexOf(o)) &&
                          (e = o),
                        [e]
                      );
                    },
                  },
                  {
                    regex: /}/,
                    onMatch: function (e, t, n) {
                      return [n.length ? n.shift() : e];
                    },
                  },
                  { regex: /\$(?:\d+|\w+)/, onMatch: t },
                  {
                    regex: /\$\{[\dA-Z_a-z]+/,
                    onMatch: function (e, n, o) {
                      var i = t(e.substr(1));
                      return o.unshift(i[0]), i;
                    },
                    next: "snippetVar",
                  },
                  { regex: /\n/, token: "newline", merge: !1 },
                ],
                snippetVar: [
                  {
                    regex: "\\|" + n("\\|") + "*\\|",
                    onMatch: function (e, t, n) {
                      var o = e
                        .slice(1, -1)
                        .replace(/\\[,|\\]|,/g, function (e) {
                          return 2 == e.length ? e[1] : "\0";
                        })
                        .split("\0")
                        .map(function (e) {
                          return { value: e };
                        });
                      return (n[0].choices = o), [o[0]];
                    },
                    next: "start",
                  },
                  o,
                  { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" },
                ],
                formatString: [
                  {
                    regex: /:/,
                    onMatch: function (e, t, n) {
                      return n.length && n[0].expectElse
                        ? ((n[0].expectElse = !1),
                          (n[0].ifEnd = { elseEnd: n[0] }),
                          [n[0].ifEnd])
                        : ":";
                    },
                  },
                  {
                    regex: /\\./,
                    onMatch: function (e, t, n) {
                      var o = e[1];
                      return (
                        ("}" == o && n.length) || -1 != "`$\\".indexOf(o)
                          ? (e = o)
                          : "n" == o
                          ? (e = "\n")
                          : "t" == o
                          ? (e = "\t")
                          : -1 != "ulULE".indexOf(o) &&
                            (e = { changeCase: o, local: o > "a" }),
                        [e]
                      );
                    },
                  },
                  {
                    regex: "/\\w*}",
                    onMatch: function (e, t, n) {
                      var o = n.shift();
                      return (
                        o && (o.flag = e.slice(1, -1)),
                        (this.next = o && o.tabstopId ? "start" : ""),
                        [o || e]
                      );
                    },
                    next: "start",
                  },
                  {
                    regex: /\$(?:\d+|\w+)/,
                    onMatch: function (e, t, n) {
                      return [{ text: e.slice(1) }];
                    },
                  },
                  {
                    regex: /\${\w+/,
                    onMatch: function (e, t, n) {
                      var o = { text: e.slice(2) };
                      return n.unshift(o), [o];
                    },
                    next: "formatStringVar",
                  },
                  { regex: /\n/, token: "newline", merge: !1 },
                  {
                    regex: /}/,
                    onMatch: function (e, t, n) {
                      var o = n.shift();
                      return (
                        (this.next = o && o.tabstopId ? "start" : ""), [o || e]
                      );
                    },
                    next: "start",
                  },
                ],
                formatStringVar: [
                  {
                    regex: /:\/\w+}/,
                    onMatch: function (e, t, n) {
                      return (
                        (n[0].formatFunction = e.slice(2, -1)), [n.shift()]
                      );
                    },
                    next: "formatString",
                  },
                  o,
                  {
                    regex: /:[\?\-+]?/,
                    onMatch: function (e, t, n) {
                      "+" == e[1] && (n[0].ifEnd = n[0]),
                        "?" == e[1] && (n[0].expectElse = !0);
                    },
                    next: "formatString",
                  },
                  {
                    regex: "([^:}\\\\]|\\\\.)*:?",
                    token: "",
                    next: "formatString",
                  },
                ],
              })),
              e.$tokenizer
            );
          }),
          (e.prototype.tokenizeTmSnippet = function (e, t) {
            return this.getTokenizer()
              .getLineTokens(e, t)
              .tokens.map(function (e) {
                return e.value || e;
              });
          }),
          (e.prototype.getVariableValue = function (e, t, n) {
            if (/^\d+$/.test(t)) return (this.variables.__ || {})[t] || "";
            if (/^[A-Z]\d+$/.test(t))
              return (this.variables[t[0] + "__"] || {})[t.substr(1)] || "";
            if (
              ((t = t.replace(/^TM_/, "")), !this.variables.hasOwnProperty(t))
            )
              return "";
            var o = this.variables[t];
            return (
              "function" == typeof o && (o = this.variables[t](e, t, n)),
              null == o ? "" : o
            );
          }),
          (e.prototype.tmStrFormat = function (e, t, n) {
            if (!t.fmt) return e;
            var o = t.flag || "",
              i = t.guard;
            i = new RegExp(i, o.replace(/[^gim]/g, ""));
            var r =
                "string" == typeof t.fmt
                  ? this.tokenizeTmSnippet(t.fmt, "formatString")
                  : t.fmt,
              s = this,
              a = e.replace(i, function () {
                var e = s.variables.__;
                s.variables.__ = [].slice.call(arguments);
                for (
                  var t = s.resolveVariables(r, n), o = "E", i = 0;
                  i < t.length;
                  i++
                ) {
                  var a = t[i];
                  if ("object" == typeof a)
                    if (((t[i] = ""), a.changeCase && a.local)) {
                      var c = t[i + 1];
                      c &&
                        "string" == typeof c &&
                        ("u" == a.changeCase
                          ? (t[i] = c[0].toUpperCase())
                          : (t[i] = c[0].toLowerCase()),
                        (t[i + 1] = c.substr(1)));
                    } else a.changeCase && (o = a.changeCase);
                  else
                    "U" == o
                      ? (t[i] = a.toUpperCase())
                      : "L" == o && (t[i] = a.toLowerCase());
                }
                return (s.variables.__ = e), t.join("");
              });
            return a;
          }),
          (e.prototype.tmFormatFunction = function (e, t, n) {
            return "upcase" == t.formatFunction
              ? e.toUpperCase()
              : "downcase" == t.formatFunction
              ? e.toLowerCase()
              : e;
          }),
          (e.prototype.resolveVariables = function (e, t) {
            for (var n = [], o = "", i = !0, r = 0; r < e.length; r++) {
              var s = e[r];
              if ("string" != typeof s) {
                if (s) {
                  if (((i = !1), s.fmtString)) {
                    var a = e.indexOf(s, r + 1);
                    -1 == a && (a = e.length),
                      (s.fmt = e.slice(r + 1, a)),
                      (r = a);
                  }
                  if (s.text) {
                    var c = this.getVariableValue(t, s.text, o) + "";
                    s.fmtString && (c = this.tmStrFormat(c, s, t)),
                      s.formatFunction && (c = this.tmFormatFunction(c, s, t)),
                      c && !s.ifEnd
                        ? (n.push(c), l(s))
                        : !c && s.ifEnd && l(s.ifEnd);
                  } else
                    s.elseEnd
                      ? l(s.elseEnd)
                      : (null != s.tabstopId || null != s.changeCase) &&
                        n.push(s);
                }
              } else
                n.push(s),
                  "\n" == s
                    ? ((i = !0), (o = ""))
                    : i && ((o = /^\t*/.exec(s)[0]), (i = /\S/.test(s)));
            }
            function l(t) {
              var n = e.indexOf(t, r + 1);
              -1 != n && (r = n);
            }
            return n;
          }),
          (e.prototype.getDisplayTextForSnippet = function (e, t) {
            return f.call(this, e, t).text;
          }),
          (e.prototype.insertSnippetForSelection = function (e, t, n) {
            void 0 === n && (n = {});
            var o = f.call(this, e, t, n),
              i = e.getSelectionRange();
            n.range && 0 === n.range.compareRange(i) && (i = n.range);
            var r = e.session.replace(i, o.text),
              s = new m(e),
              a = e.inVirtualSelectionMode && e.selection.index;
            s.addTabstops(o.tabstops, i.start, r, a);
          }),
          (e.prototype.insertSnippet = function (e, t, n) {
            void 0 === n && (n = {});
            var o = this;
            if (
              (!n.range ||
                n.range instanceof a ||
                (n.range = a.fromPoints(n.range.start, n.range.end)),
              e.inVirtualSelectionMode)
            )
              return o.insertSnippetForSelection(e, t, n);
            e.forEachSelection(
              function () {
                o.insertSnippetForSelection(e, t, n);
              },
              null,
              { keepOrder: !0 }
            ),
              e.tabstopManager && e.tabstopManager.tabNext();
          }),
          (e.prototype.$getScope = function (e) {
            var t = e.session.$mode.$id || "";
            if ("html" === (t = t.split("/").pop()) || "php" === t) {
              "php" !== t || e.session.$mode.inlinePhp || (t = "html");
              var n = e.getCursorPosition(),
                o = e.session.getState(n.row);
              "object" === typeof o && (o = o[0]),
                o.substring &&
                  ("js-" == o.substring(0, 3)
                    ? (t = "javascript")
                    : "css-" == o.substring(0, 4)
                    ? (t = "css")
                    : "php-" == o.substring(0, 4) && (t = "php"));
            }
            return t;
          }),
          (e.prototype.getActiveScopes = function (e) {
            var t = this.$getScope(e),
              n = [t],
              o = this.snippetMap;
            return (
              o[t] && o[t].includeScopes && n.push.apply(n, o[t].includeScopes),
              n.push("_"),
              n
            );
          }),
          (e.prototype.expandWithTab = function (e, t) {
            var n = this,
              o = e.forEachSelection(
                function () {
                  return n.expandSnippetForSelection(e, t);
                },
                null,
                { keepOrder: !0 }
              );
            return o && e.tabstopManager && e.tabstopManager.tabNext(), o;
          }),
          (e.prototype.expandSnippetForSelection = function (e, t) {
            var n,
              o = e.getCursorPosition(),
              i = e.session.getLine(o.row),
              r = i.substring(0, o.column),
              s = i.substr(o.column),
              a = this.snippetMap;
            return (
              this.getActiveScopes(e).some(function (e) {
                var t = a[e];
                return t && (n = this.findMatchingSnippet(t, r, s)), !!n;
              }, this),
              !!n &&
                ((t && t.dryRun) ||
                  (e.session.doc.removeInLine(
                    o.row,
                    o.column - n.replaceBefore.length,
                    o.column + n.replaceAfter.length
                  ),
                  (this.variables.M__ = n.matchBefore),
                  (this.variables.T__ = n.matchAfter),
                  this.insertSnippetForSelection(e, n.content),
                  (this.variables.M__ = this.variables.T__ = null)),
                !0)
            );
          }),
          (e.prototype.findMatchingSnippet = function (e, t, n) {
            for (var o = e.length; o--; ) {
              var i = e[o];
              if (
                (!i.startRe || i.startRe.test(t)) &&
                (!i.endRe || i.endRe.test(n)) &&
                (i.startRe || i.endRe)
              )
                return (
                  (i.matchBefore = i.startRe ? i.startRe.exec(t) : [""]),
                  (i.matchAfter = i.endRe ? i.endRe.exec(n) : [""]),
                  (i.replaceBefore = i.triggerRe ? i.triggerRe.exec(t)[0] : ""),
                  (i.replaceAfter = i.endTriggerRe
                    ? i.endTriggerRe.exec(n)[0]
                    : ""),
                  i
                );
            }
          }),
          (e.prototype.register = function (e, t) {
            var n = this.snippetMap,
              o = this.snippetNameMap,
              i = this;
            function r(e) {
              return (
                e && !/^\^?\(.*\)\$?$|^\\b$/.test(e) && (e = "(?:" + e + ")"),
                e || ""
              );
            }
            function a(e, t, n) {
              return (
                (e = r(e)),
                (t = r(t)),
                n
                  ? (e = t + e) && "$" != e[e.length - 1] && (e += "$")
                  : (e += t) && "^" != e[0] && (e = "^" + e),
                new RegExp(e)
              );
            }
            function c(e) {
              e.scope || (e.scope = t || "_"),
                (t = e.scope),
                n[t] || ((n[t] = []), (o[t] = {}));
              var r = o[t];
              if (e.name) {
                var c = r[e.name];
                c && i.unregister(c), (r[e.name] = e);
              }
              n[t].push(e),
                e.prefix && (e.tabTrigger = e.prefix),
                !e.content &&
                  e.body &&
                  (e.content = Array.isArray(e.body)
                    ? e.body.join("\n")
                    : e.body),
                e.tabTrigger &&
                  !e.trigger &&
                  (!e.guard && /^\w/.test(e.tabTrigger) && (e.guard = "\\b"),
                  (e.trigger = s.escapeRegExp(e.tabTrigger))),
                (e.trigger || e.guard || e.endTrigger || e.endGuard) &&
                  ((e.startRe = a(e.trigger, e.guard, !0)),
                  (e.triggerRe = new RegExp(e.trigger)),
                  (e.endRe = a(e.endTrigger, e.endGuard, !0)),
                  (e.endTriggerRe = new RegExp(e.endTrigger)));
            }
            e || (e = []),
              Array.isArray(e)
                ? e.forEach(c)
                : Object.keys(e).forEach(function (t) {
                    c(e[t]);
                  }),
              this._signal("registerSnippets", { scope: t });
          }),
          (e.prototype.unregister = function (e, t) {
            var n = this.snippetMap,
              o = this.snippetNameMap;
            function i(e) {
              var i = o[e.scope || t];
              if (i && i[e.name]) {
                delete i[e.name];
                var r = n[e.scope || t],
                  s = r && r.indexOf(e);
                s >= 0 && r.splice(s, 1);
              }
            }
            e.content ? i(e) : Array.isArray(e) && e.forEach(i);
          }),
          (e.prototype.parseSnippetFile = function (e) {
            e = e.replace(/\r/g, "");
            for (
              var t,
                n = [],
                o = {},
                i = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
              (t = i.exec(e));

            ) {
              if (t[1])
                try {
                  (o = JSON.parse(t[1])), n.push(o);
                } catch (c) {}
              if (t[4])
                (o.content = t[4].replace(/^\t/gm, "")), n.push(o), (o = {});
              else {
                var r = t[2],
                  s = t[3];
                if ("regex" == r) {
                  var a = /\/((?:[^\/\\]|\\.)*)|$/g;
                  (o.guard = a.exec(s)[1]),
                    (o.trigger = a.exec(s)[1]),
                    (o.endTrigger = a.exec(s)[1]),
                    (o.endGuard = a.exec(s)[1]);
                } else
                  "snippet" == r
                    ? ((o.tabTrigger = s.match(/^\S*/)[0]),
                      o.name || (o.name = s))
                    : r && (o[r] = s);
              }
            }
            return n;
          }),
          (e.prototype.getSnippetByName = function (e, t) {
            var n,
              o = this.snippetNameMap;
            return (
              this.getActiveScopes(t).some(function (t) {
                var i = o[t];
                return i && (n = i[e]), !!n;
              }, this),
              n
            );
          }),
          e
        );
      })();
      i.implement(g.prototype, r);
      var f = function (e, t, n) {
          void 0 === n && (n = {});
          var o = e.getCursorPosition(),
            i = e.session.getLine(o.row),
            r = e.session.getTabString(),
            s = i.match(/^\s*/)[0];
          o.column < s.length && (s = s.slice(0, o.column)),
            (t = t.replace(/\r/g, ""));
          var a = this.tokenizeTmSnippet(t);
          a = (a = this.resolveVariables(a, e)).map(function (e) {
            return "\n" != e || n.excludeExtraIndent
              ? "string" == typeof e
                ? e.replace(/\t/g, r)
                : e
              : e + s;
          });
          var c = [];
          a.forEach(function (e, t) {
            if ("object" == typeof e) {
              var n = e.tabstopId,
                o = c[n];
              if (
                (o ||
                  (((o = c[n] = []).index = n),
                  (o.value = ""),
                  (o.parents = {})),
                -1 === o.indexOf(e))
              ) {
                e.choices && !o.choices && (o.choices = e.choices), o.push(e);
                var i = a.indexOf(e, t + 1);
                if (-1 !== i) {
                  var r = a.slice(t + 1, i);
                  r.some(function (e) {
                    return "object" === typeof e;
                  }) && !o.value
                    ? (o.value = r)
                    : !r.length ||
                      (o.value && "string" === typeof o.value) ||
                      (o.value = r.join(""));
                }
              }
            }
          }),
            c.forEach(function (e) {
              e.length = 0;
            });
          var l = {};
          function p(e) {
            for (var t = [], n = 0; n < e.length; n++) {
              var o = e[n];
              if ("object" == typeof o) {
                if (l[o.tabstopId]) continue;
                o = t[e.lastIndexOf(o, n - 1)] || { tabstopId: o.tabstopId };
              }
              t[n] = o;
            }
            return t;
          }
          for (var h = 0; h < a.length; h++) {
            var u = a[h];
            if ("object" == typeof u) {
              var d = u.tabstopId,
                g = c[d],
                f = a.indexOf(u, h + 1);
              if (l[d])
                l[d] === u &&
                  (delete l[d],
                  Object.keys(l).forEach(function (e) {
                    g.parents[e] = !0;
                  }));
              else {
                l[d] = u;
                var m = g.value;
                "string" !== typeof m
                  ? (m = p(m))
                  : u.fmt && (m = this.tmStrFormat(m, u, e)),
                  a.splice.apply(a, [h + 1, Math.max(0, f - h)].concat(m, u)),
                  -1 === g.indexOf(u) && g.push(u);
              }
            }
          }
          var b = 0,
            v = 0,
            x = "";
          return (
            a.forEach(function (e) {
              if ("string" === typeof e) {
                var t = e.split("\n");
                t.length > 1
                  ? ((v = t[t.length - 1].length), (b += t.length - 1))
                  : (v += e.length),
                  (x += e);
              } else e && (e.start ? (e.end = { row: b, column: v }) : (e.start = { row: b, column: v }));
            }),
            { text: x, tabstops: c, tokens: a }
          );
        },
        m = (function () {
          function e(e) {
            if (
              ((this.index = 0),
              (this.ranges = []),
              (this.tabstops = []),
              e.tabstopManager)
            )
              return e.tabstopManager;
            (e.tabstopManager = this),
              (this.$onChange = this.onChange.bind(this)),
              (this.$onChangeSelection = s.delayedCall(
                this.onChangeSelection.bind(this)
              ).schedule),
              (this.$onChangeSession = this.onChangeSession.bind(this)),
              (this.$onAfterExec = this.onAfterExec.bind(this)),
              this.attach(e);
          }
          return (
            (e.prototype.attach = function (e) {
              (this.$openTabstops = null),
                (this.selectedTabstop = null),
                (this.editor = e),
                (this.session = e.session),
                this.editor.on("change", this.$onChange),
                this.editor.on("changeSelection", this.$onChangeSelection),
                this.editor.on("changeSession", this.$onChangeSession),
                this.editor.commands.on("afterExec", this.$onAfterExec),
                this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
            }),
            (e.prototype.detach = function () {
              this.tabstops.forEach(this.removeTabstopMarkers, this),
                (this.ranges.length = 0),
                (this.tabstops.length = 0),
                (this.selectedTabstop = null),
                this.editor.off("change", this.$onChange),
                this.editor.off("changeSelection", this.$onChangeSelection),
                this.editor.off("changeSession", this.$onChangeSession),
                this.editor.commands.off("afterExec", this.$onAfterExec),
                this.editor.keyBinding.removeKeyboardHandler(
                  this.keyboardHandler
                ),
                (this.editor.tabstopManager = null),
                (this.session = null),
                (this.editor = null);
            }),
            (e.prototype.onChange = function (e) {
              for (
                var t = "r" == e.action[0],
                  n = this.selectedTabstop || {},
                  o = n.parents || {},
                  i = this.tabstops.slice(),
                  r = 0;
                r < i.length;
                r++
              ) {
                var s = i[r],
                  a = s == n || o[s.index];
                if (
                  ((s.rangeList.$bias = a ? 0 : 1),
                  "remove" == e.action && s !== n)
                ) {
                  var c = s.parents && s.parents[n.index],
                    l = s.rangeList.pointIndex(e.start, c);
                  l = l < 0 ? -l - 1 : l + 1;
                  var p = s.rangeList.pointIndex(e.end, c);
                  p = p < 0 ? -p - 1 : p - 1;
                  for (
                    var h = s.rangeList.ranges.slice(l, p), u = 0;
                    u < h.length;
                    u++
                  )
                    this.removeRange(h[u]);
                }
                s.rangeList.$onChange(e);
              }
              var d = this.session;
              this.$inChange ||
                !t ||
                1 != d.getLength() ||
                d.getValue() ||
                this.detach();
            }),
            (e.prototype.updateLinkedFields = function () {
              var e = this.selectedTabstop;
              if (e && e.hasLinkedRanges && e.firstNonLinked) {
                this.$inChange = !0;
                for (
                  var n = this.session,
                    o = n.getTextRange(e.firstNonLinked),
                    i = 0;
                  i < e.length;
                  i++
                ) {
                  var r = e[i];
                  if (r.linked) {
                    var s = r.original,
                      a = t.snippetManager.tmStrFormat(o, s, this.editor);
                    n.replace(r, a);
                  }
                }
                this.$inChange = !1;
              }
            }),
            (e.prototype.onAfterExec = function (e) {
              e.command && !e.command.readOnly && this.updateLinkedFields();
            }),
            (e.prototype.onChangeSelection = function () {
              if (this.editor) {
                for (
                  var e = this.editor.selection.lead,
                    t = this.editor.selection.anchor,
                    n = this.editor.selection.isEmpty(),
                    o = 0;
                  o < this.ranges.length;
                  o++
                )
                  if (!this.ranges[o].linked) {
                    var i = this.ranges[o].contains(e.row, e.column),
                      r = n || this.ranges[o].contains(t.row, t.column);
                    if (i && r) return;
                  }
                this.detach();
              }
            }),
            (e.prototype.onChangeSession = function () {
              this.detach();
            }),
            (e.prototype.tabNext = function (e) {
              var t = this.tabstops.length,
                n = this.index + (e || 1);
              (n = Math.min(Math.max(n, 1), t)) == t && (n = 0),
                this.selectTabstop(n),
                0 === n && this.detach();
            }),
            (e.prototype.selectTabstop = function (e) {
              this.$openTabstops = null;
              var t = this.tabstops[this.index];
              if (
                (t && this.addTabstopMarkers(t),
                (this.index = e),
                (t = this.tabstops[this.index]) && t.length)
              ) {
                this.selectedTabstop = t;
                var n = t.firstNonLinked || t;
                if (
                  (t.choices && (n.cursor = n.start),
                  this.editor.inVirtualSelectionMode)
                )
                  this.editor.selection.fromOrientedRange(n);
                else {
                  var o = this.editor.multiSelect;
                  o.toSingleRange(n);
                  for (var i = 0; i < t.length; i++)
                    (t.hasLinkedRanges && t[i].linked) ||
                      o.addRange(t[i].clone(), !0);
                }
                this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler),
                  this.selectedTabstop &&
                    this.selectedTabstop.choices &&
                    this.editor.execCommand("startAutocomplete", {
                      matches: this.selectedTabstop.choices,
                    });
              }
            }),
            (e.prototype.addTabstops = function (e, t, n) {
              var o =
                this.useLink || !this.editor.getOption("enableMultiselect");
              if ((this.$openTabstops || (this.$openTabstops = []), !e[0])) {
                var i = a.fromPoints(n, n);
                v(i.start, t), v(i.end, t), (e[0] = [i]), (e[0].index = 0);
              }
              var r = [this.index + 1, 0],
                s = this.ranges;
              e.forEach(function (e, n) {
                for (
                  var i = this.$openTabstops[n] || e, l = 0;
                  l < e.length;
                  l++
                ) {
                  var p = e[l],
                    h = a.fromPoints(p.start, p.end || p.start);
                  b(h.start, t),
                    b(h.end, t),
                    (h.original = p),
                    (h.tabstop = i),
                    s.push(h),
                    i != e ? i.unshift(h) : (i[l] = h),
                    p.fmtString || (i.firstNonLinked && o)
                      ? ((h.linked = !0), (i.hasLinkedRanges = !0))
                      : i.firstNonLinked || (i.firstNonLinked = h);
                }
                i.firstNonLinked || (i.hasLinkedRanges = !1),
                  i === e && (r.push(i), (this.$openTabstops[n] = i)),
                  this.addTabstopMarkers(i),
                  (i.rangeList = i.rangeList || new c()),
                  (i.rangeList.$bias = 0),
                  i.rangeList.addList(i);
              }, this),
                r.length > 2 &&
                  (this.tabstops.length && r.push(r.splice(2, 1)[0]),
                  this.tabstops.splice.apply(this.tabstops, r));
            }),
            (e.prototype.addTabstopMarkers = function (e) {
              var t = this.session;
              e.forEach(function (e) {
                e.markerId ||
                  (e.markerId = t.addMarker(e, "ace_snippet-marker", "text"));
              });
            }),
            (e.prototype.removeTabstopMarkers = function (e) {
              var t = this.session;
              e.forEach(function (e) {
                t.removeMarker(e.markerId), (e.markerId = null);
              });
            }),
            (e.prototype.removeRange = function (e) {
              var t = e.tabstop.indexOf(e);
              -1 != t && e.tabstop.splice(t, 1),
                -1 != (t = this.ranges.indexOf(e)) && this.ranges.splice(t, 1),
                -1 != (t = e.tabstop.rangeList.ranges.indexOf(e)) &&
                  e.tabstop.splice(t, 1),
                this.session.removeMarker(e.markerId),
                e.tabstop.length ||
                  (-1 != (t = this.tabstops.indexOf(e.tabstop)) &&
                    this.tabstops.splice(t, 1),
                  this.tabstops.length || this.detach());
            }),
            e
          );
        })();
      (m.prototype.keyboardHandler = new l()),
        m.prototype.keyboardHandler.bindKeys({
          Tab: function (e) {
            (t.snippetManager && t.snippetManager.expandWithTab(e)) ||
              (e.tabstopManager.tabNext(1), e.renderer.scrollCursorIntoView());
          },
          "Shift-Tab": function (e) {
            e.tabstopManager.tabNext(-1), e.renderer.scrollCursorIntoView();
          },
          Esc: function (e) {
            e.tabstopManager.detach();
          },
        });
      var b = function (e, t) {
          0 == e.row && (e.column += t.column), (e.row += t.row);
        },
        v = function (e, t) {
          e.row == t.row && (e.column -= t.column), (e.row -= t.row);
        };
      o.importCssString(
        "\n.ace_snippet-marker {\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    background: rgba(194, 193, 208, 0.09);\n    border: 1px dotted rgba(211, 208, 235, 0.62);\n    position: absolute;\n}",
        "snippets.css",
        !1
      ),
        (t.snippetManager = new g());
      var x = e("./editor").Editor;
      (function () {
        (this.insertSnippet = function (e, n) {
          return t.snippetManager.insertSnippet(this, e, n);
        }),
          (this.expandSnippet = function (e) {
            return t.snippetManager.expandWithTab(this, e);
          });
      }).call(x.prototype);
    }
  ),
  ace.define(
    "ace/autocomplete/inline",
    ["require", "exports", "module", "ace/snippets"],
    function (e, t, n) {
      "use strict";
      var o = e("../snippets").snippetManager,
        i = (function () {
          function e() {
            this.editor = null;
          }
          return (
            (e.prototype.show = function (e, t, n) {
              if (
                ((n = n || ""),
                e &&
                  this.editor &&
                  this.editor !== e &&
                  (this.hide(), (this.editor = null)),
                !e || !t)
              )
                return !1;
              var i = t.snippet
                ? o.getDisplayTextForSnippet(e, t.snippet)
                : t.value;
              return (
                !(!i || !i.startsWith(n)) &&
                ((this.editor = e),
                "" === (i = i.slice(n.length))
                  ? e.removeGhostText()
                  : e.setGhostText(i),
                !0)
              );
            }),
            (e.prototype.isOpen = function () {
              return !!this.editor && !!this.editor.renderer.$ghostText;
            }),
            (e.prototype.hide = function () {
              return !!this.editor && (this.editor.removeGhostText(), !0);
            }),
            (e.prototype.destroy = function () {
              this.hide(), (this.editor = null);
            }),
            e
          );
        })();
      t.AceInline = i;
    }
  ),
  ace.define(
    "ace/autocomplete/util",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      t.parForEach = function (e, t, n) {
        var o = 0,
          i = e.length;
        0 === i && n();
        for (var r = 0; r < i; r++)
          t(e[r], function (e, t) {
            ++o === i && n(e, t);
          });
      };
      var o = /[a-zA-Z_0-9\$\-\u00A2-\u2000\u2070-\uFFFF]/;
      (t.retrievePrecedingIdentifier = function (e, t, n) {
        n = n || o;
        for (var i = [], r = t - 1; r >= 0 && n.test(e[r]); r--) i.push(e[r]);
        return i.reverse().join("");
      }),
        (t.retrieveFollowingIdentifier = function (e, t, n) {
          n = n || o;
          for (var i = [], r = t; r < e.length && n.test(e[r]); r++)
            i.push(e[r]);
          return i;
        }),
        (t.getCompletionPrefix = function (e) {
          var t,
            n = e.getCursorPosition(),
            o = e.session.getLine(n.row);
          return (
            e.completers.forEach(
              function (e) {
                e.identifierRegexps &&
                  e.identifierRegexps.forEach(
                    function (e) {
                      !t &&
                        e &&
                        (t = this.retrievePrecedingIdentifier(o, n.column, e));
                    }.bind(this)
                  );
              }.bind(this)
            ),
            t || this.retrievePrecedingIdentifier(o, n.column)
          );
        }),
        (t.triggerAutocomplete = function (e) {
          var t = e.getCursorPosition(),
            n = e.session.getLine(t.row)[0 === t.column ? 0 : t.column - 1];
          return e.completers.some(function (e) {
            if (e.triggerCharacters && Array.isArray(e.triggerCharacters))
              return e.triggerCharacters.includes(n);
          });
        });
    }
  ),
  ace.define(
    "ace/autocomplete",
    [
      "require",
      "exports",
      "module",
      "ace/keyboard/hash_handler",
      "ace/autocomplete/popup",
      "ace/autocomplete/inline",
      "ace/autocomplete/popup",
      "ace/autocomplete/util",
      "ace/lib/lang",
      "ace/lib/dom",
      "ace/snippets",
      "ace/config",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("./keyboard/hash_handler").HashHandler,
        i = e("./autocomplete/popup").AcePopup,
        r = e("./autocomplete/inline").AceInline,
        s = e("./autocomplete/popup").getAriaId,
        a = e("./autocomplete/util"),
        c = e("./lib/lang"),
        l = e("./lib/dom"),
        p = e("./snippets").snippetManager,
        h = e("./config"),
        u = function (e, t) {
          t.completer && t.completer.destroy();
        },
        d = (function () {
          function e() {
            (this.autoInsert = !1),
              (this.autoSelect = !0),
              (this.autoShown = !1),
              (this.exactMatch = !1),
              (this.inlineEnabled = !1),
              (this.keyboardHandler = new o()),
              this.keyboardHandler.bindKeys(this.commands),
              (this.parentNode = null),
              (this.blurListener = this.blurListener.bind(this)),
              (this.changeListener = this.changeListener.bind(this)),
              (this.mousedownListener = this.mousedownListener.bind(this)),
              (this.mousewheelListener = this.mousewheelListener.bind(this)),
              (this.onLayoutChange = this.onLayoutChange.bind(this)),
              (this.changeTimer = c.delayedCall(
                function () {
                  this.updateCompletions(!0);
                }.bind(this)
              )),
              (this.tooltipTimer = c.delayedCall(
                this.updateDocTooltip.bind(this),
                50
              ));
          }
          return (
            (e.prototype.$init = function () {
              return (
                (this.popup = new i(
                  this.parentNode || document.body || document.documentElement
                )),
                this.popup.on(
                  "click",
                  function (e) {
                    this.insertMatch(), e.stop();
                  }.bind(this)
                ),
                (this.popup.focus = this.editor.focus.bind(this.editor)),
                this.popup.on("show", this.$onPopupChange.bind(this)),
                this.popup.on("hide", this.$onHidePopup.bind(this)),
                this.popup.on("select", this.$onPopupChange.bind(this)),
                this.popup.on(
                  "changeHoverMarker",
                  this.tooltipTimer.bind(null, null)
                ),
                this.popup
              );
            }),
            (e.prototype.$initInline = function () {
              if (this.inlineEnabled && !this.inlineRenderer)
                return (this.inlineRenderer = new r()), this.inlineRenderer;
            }),
            (e.prototype.getPopup = function () {
              return this.popup || this.$init();
            }),
            (e.prototype.$onHidePopup = function () {
              this.inlineRenderer && this.inlineRenderer.hide(),
                this.hideDocTooltip();
            }),
            (e.prototype.$onPopupChange = function (e) {
              if (this.inlineRenderer && this.inlineEnabled) {
                var t = e ? null : this.popup.getData(this.popup.getRow()),
                  n = a.getCompletionPrefix(this.editor);
                this.inlineRenderer.show(this.editor, t, n) ||
                  this.inlineRenderer.hide(),
                  this.$updatePopupPosition();
              }
              this.tooltipTimer.call(null, null);
            }),
            (e.prototype.observeLayoutChanges = function () {
              if (!this.$elements && this.editor) {
                window.addEventListener("resize", this.onLayoutChange, {
                  passive: !0,
                }),
                  window.addEventListener("wheel", this.mousewheelListener);
                for (var e = this.editor.container.parentNode, t = []; e; )
                  t.push(e),
                    e.addEventListener("scroll", this.onLayoutChange, {
                      passive: !0,
                    }),
                    (e = e.parentNode);
                this.$elements = t;
              }
            }),
            (e.prototype.unObserveLayoutChanges = function () {
              var e = this;
              window.removeEventListener("resize", this.onLayoutChange, {
                passive: !0,
              }),
                window.removeEventListener("wheel", this.mousewheelListener),
                this.$elements &&
                  this.$elements.forEach(function (t) {
                    t.removeEventListener("scroll", e.onLayoutChange, {
                      passive: !0,
                    });
                  }),
                (this.$elements = null);
            }),
            (e.prototype.onLayoutChange = function () {
              if (!this.popup.isOpen) return this.unObserveLayoutChanges();
              this.$updatePopupPosition(), this.updateDocTooltip();
            }),
            (e.prototype.$updatePopupPosition = function () {
              var e = this.editor,
                t = e.renderer,
                n = t.layerConfig.lineHeight,
                o = t.$cursorLayer.getPixelPosition(this.base, !0);
              o.left -= this.popup.getTextLeftOffset();
              var i = e.container.getBoundingClientRect();
              (o.top += i.top - t.layerConfig.offset),
                (o.left += i.left - e.renderer.scrollLeft),
                (o.left += t.gutterWidth);
              var r = { top: o.top, left: o.left };
              t.$ghostText &&
                t.$ghostTextWidget &&
                this.base.row === t.$ghostText.position.row &&
                (r.top += t.$ghostTextWidget.el.offsetHeight),
                this.popup.tryShow(r, n, "bottom") ||
                  this.popup.tryShow(o, n, "top") ||
                  this.popup.show(o, n);
            }),
            (e.prototype.openPopup = function (e, t, n) {
              this.popup || this.$init(),
                this.inlineEnabled &&
                  !this.inlineRenderer &&
                  this.$initInline(),
                (this.popup.autoSelect = this.autoSelect),
                this.popup.setData(
                  this.completions.filtered,
                  this.completions.filterText
                ),
                this.editor.textInput.setAriaOptions &&
                  this.editor.textInput.setAriaOptions({
                    activeDescendant: s(this.popup.getRow()),
                    inline: this.inlineEnabled,
                  }),
                e.keyBinding.addKeyboardHandler(this.keyboardHandler),
                this.popup.setRow(this.autoSelect ? 0 : -1),
                n
                  ? n && !t && this.detach()
                  : (this.popup.setTheme(e.getTheme()),
                    this.popup.setFontSize(e.getFontSize()),
                    this.$updatePopupPosition(),
                    this.tooltipNode && this.updateDocTooltip()),
                this.changeTimer.cancel(),
                this.observeLayoutChanges();
            }),
            (e.prototype.detach = function () {
              this.editor &&
                (this.editor.keyBinding.removeKeyboardHandler(
                  this.keyboardHandler
                ),
                this.editor.off("changeSelection", this.changeListener),
                this.editor.off("blur", this.blurListener),
                this.editor.off("mousedown", this.mousedownListener),
                this.editor.off("mousewheel", this.mousewheelListener)),
                this.changeTimer.cancel(),
                this.hideDocTooltip(),
                this.completionProvider && this.completionProvider.detach(),
                this.popup && this.popup.isOpen && this.popup.hide(),
                this.base && this.base.detach(),
                (this.activated = !1),
                (this.completionProvider = this.completions = this.base = null),
                this.unObserveLayoutChanges();
            }),
            (e.prototype.changeListener = function (e) {
              var t = this.editor.selection.lead;
              (t.row != this.base.row || t.column < this.base.column) &&
                this.detach(),
                this.activated ? this.changeTimer.schedule() : this.detach();
            }),
            (e.prototype.blurListener = function (e) {
              var t = document.activeElement,
                n = this.editor.textInput.getElement(),
                o =
                  e.relatedTarget &&
                  this.tooltipNode &&
                  this.tooltipNode.contains(e.relatedTarget),
                i = this.popup && this.popup.container;
              t == n ||
                t.parentNode == i ||
                o ||
                t == this.tooltipNode ||
                e.relatedTarget == n ||
                this.detach();
            }),
            (e.prototype.mousedownListener = function (e) {
              this.detach();
            }),
            (e.prototype.mousewheelListener = function (e) {
              this.detach();
            }),
            (e.prototype.goTo = function (e) {
              this.popup.goTo(e);
            }),
            (e.prototype.insertMatch = function (e, t) {
              if ((e || (e = this.popup.getData(this.popup.getRow())), !e))
                return !1;
              if ("" === e.value) return this.detach();
              var n = this.completions,
                o = this.getCompletionProvider().insertMatch(
                  this.editor,
                  e,
                  n.filterText,
                  t
                );
              return this.completions == n && this.detach(), o;
            }),
            (e.prototype.showPopup = function (e, t) {
              this.editor && this.detach(),
                (this.activated = !0),
                (this.editor = e),
                e.completer != this &&
                  (e.completer && e.completer.detach(), (e.completer = this)),
                e.on("changeSelection", this.changeListener),
                e.on("blur", this.blurListener),
                e.on("mousedown", this.mousedownListener),
                e.on("mousewheel", this.mousewheelListener),
                this.updateCompletions(!1, t);
            }),
            (e.prototype.getCompletionProvider = function () {
              return (
                this.completionProvider || (this.completionProvider = new g()),
                this.completionProvider
              );
            }),
            (e.prototype.gatherCompletions = function (e, t) {
              return this.getCompletionProvider().gatherCompletions(e, t);
            }),
            (e.prototype.updateCompletions = function (e, t) {
              if (e && this.base && this.completions) {
                var n = this.editor.getCursorPosition();
                if (
                  (i = this.editor.session.getTextRange({
                    start: this.base,
                    end: n,
                  })) == this.completions.filterText
                )
                  return;
                return (
                  this.completions.setFilter(i),
                  this.completions.filtered.length
                    ? 1 != this.completions.filtered.length ||
                      this.completions.filtered[0].value != i ||
                      this.completions.filtered[0].snippet
                      ? void this.openPopup(this.editor, i, e)
                      : this.detach()
                    : this.detach()
                );
              }
              if (t && t.matches) {
                n = this.editor.getSelectionRange().start;
                return (
                  (this.base = this.editor.session.doc.createAnchor(
                    n.row,
                    n.column
                  )),
                  (this.base.$insertRight = !0),
                  (this.completions = new f(t.matches)),
                  this.openPopup(this.editor, "", e)
                );
              }
              var o = this.editor.getSession(),
                i =
                  ((n = this.editor.getCursorPosition()),
                  a.getCompletionPrefix(this.editor));
              (this.base = o.doc.createAnchor(n.row, n.column - i.length)),
                (this.base.$insertRight = !0);
              var r = { exactMatch: this.exactMatch };
              this.getCompletionProvider().provideCompletions(
                this.editor,
                r,
                function (t, n, o) {
                  var i = n.filtered,
                    r = a.getCompletionPrefix(this.editor);
                  if (o) {
                    if (!i.length) {
                      var s = !this.autoShown && this.emptyMessage;
                      if (
                        ("function" == typeof s && (s = this.emptyMessage(r)),
                        s)
                      ) {
                        var c = [{ caption: this.emptyMessage(r), value: "" }];
                        return (
                          (this.completions = new f(c)),
                          void this.openPopup(this.editor, r, e)
                        );
                      }
                      return this.detach();
                    }
                    if (1 == i.length && i[0].value == r && !i[0].snippet)
                      return this.detach();
                    if (this.autoInsert && !this.autoShown && 1 == i.length)
                      return this.insertMatch(i[0]);
                  }
                  (this.completions = n), this.openPopup(this.editor, r, e);
                }.bind(this)
              );
            }),
            (e.prototype.cancelContextMenu = function () {
              this.editor.$mouseHandler.cancelContextMenu();
            }),
            (e.prototype.updateDocTooltip = function () {
              var e = this.popup,
                t = e.data,
                n = t && (t[e.getHoveredRow()] || t[e.getRow()]),
                o = null;
              if (!n || !this.editor || !this.popup.isOpen)
                return this.hideDocTooltip();
              for (var i = this.editor.completers.length, r = 0; r < i; r++) {
                var s = this.editor.completers[r];
                if (s.getDocTooltip && n.completerId === s.id) {
                  o = s.getDocTooltip(n);
                  break;
                }
              }
              if (
                (o || "string" == typeof n || (o = n),
                "string" == typeof o && (o = { docText: o }),
                !o || (!o.docHTML && !o.docText))
              )
                return this.hideDocTooltip();
              this.showDocTooltip(o);
            }),
            (e.prototype.showDocTooltip = function (e) {
              this.tooltipNode ||
                ((this.tooltipNode = l.createElement("div")),
                (this.tooltipNode.style.margin = 0),
                (this.tooltipNode.style.pointerEvents = "auto"),
                (this.tooltipNode.tabIndex = -1),
                (this.tooltipNode.onblur = this.blurListener.bind(this)),
                (this.tooltipNode.onclick = this.onTooltipClick.bind(this)),
                (this.tooltipNode.id = "doc-tooltip"),
                this.tooltipNode.setAttribute("role", "tooltip"));
              var t = this.editor.renderer.theme;
              this.tooltipNode.className =
                "ace_tooltip ace_doc-tooltip " +
                (t.isDark ? "ace_dark " : "") +
                (t.cssClass || "");
              var n = this.tooltipNode;
              e.docHTML
                ? (n.innerHTML = e.docHTML)
                : e.docText && (n.textContent = e.docText),
                n.parentNode ||
                  this.popup.container.appendChild(this.tooltipNode);
              var o = this.popup,
                i = o.container.getBoundingClientRect();
              (n.style.top = o.container.style.top),
                (n.style.bottom = o.container.style.bottom),
                (n.style.display = "block"),
                window.innerWidth - i.right < 320
                  ? i.left < 320
                    ? o.isTopdown
                      ? ((n.style.top = i.bottom + "px"),
                        (n.style.left = i.left + "px"),
                        (n.style.right = ""),
                        (n.style.bottom = ""))
                      : ((n.style.top =
                          o.container.offsetTop - n.offsetHeight + "px"),
                        (n.style.left = i.left + "px"),
                        (n.style.right = ""),
                        (n.style.bottom = ""))
                    : ((n.style.right = window.innerWidth - i.left + "px"),
                      (n.style.left = ""))
                  : ((n.style.left = i.right + 1 + "px"), (n.style.right = ""));
            }),
            (e.prototype.hideDocTooltip = function () {
              if ((this.tooltipTimer.cancel(), this.tooltipNode)) {
                var e = this.tooltipNode;
                this.editor.isFocused() ||
                  document.activeElement != e ||
                  this.editor.focus(),
                  (this.tooltipNode = null),
                  e.parentNode && e.parentNode.removeChild(e);
              }
            }),
            (e.prototype.onTooltipClick = function (e) {
              for (var t = e.target; t && t != this.tooltipNode; ) {
                if ("A" == t.nodeName && t.href) {
                  (t.rel = "noreferrer"), (t.target = "_blank");
                  break;
                }
                t = t.parentNode;
              }
            }),
            (e.prototype.destroy = function () {
              if ((this.detach(), this.popup)) {
                this.popup.destroy();
                var e = this.popup.container;
                e && e.parentNode && e.parentNode.removeChild(e);
              }
              this.editor &&
                this.editor.completer == this &&
                (this.editor.off("destroy", u), (this.editor.completer = null)),
                (this.inlineRenderer = this.popup = this.editor = null);
            }),
            e
          );
        })();
      (d.prototype.commands = {
        Up: function (e) {
          e.completer.goTo("up");
        },
        Down: function (e) {
          e.completer.goTo("down");
        },
        "Ctrl-Up|Ctrl-Home": function (e) {
          e.completer.goTo("start");
        },
        "Ctrl-Down|Ctrl-End": function (e) {
          e.completer.goTo("end");
        },
        Esc: function (e) {
          e.completer.detach();
        },
        Return: function (e) {
          return e.completer.insertMatch();
        },
        "Shift-Return": function (e) {
          e.completer.insertMatch(null, { deleteSuffix: !0 });
        },
        Tab: function (e) {
          var t = e.completer.insertMatch();
          if (t || e.tabstopManager) return t;
          e.completer.goTo("down");
        },
        PageUp: function (e) {
          e.completer.popup.gotoPageUp();
        },
        PageDown: function (e) {
          e.completer.popup.gotoPageDown();
        },
      }),
        (d.for = function (e) {
          return (
            e.completer instanceof d ||
              (e.completer && (e.completer.destroy(), (e.completer = null)),
              h.get("sharedPopups")
                ? (d.$sharedInstance || (d.$sharedInstance = new d()),
                  (e.completer = d.$sharedInstance))
                : ((e.completer = new d()), e.once("destroy", u))),
            e.completer
          );
        }),
        (d.startCommand = {
          name: "startAutocomplete",
          exec: function (e, t) {
            var n = d.for(e);
            (n.autoInsert = !1),
              (n.autoSelect = !0),
              (n.autoShown = !1),
              n.showPopup(e, t),
              n.cancelContextMenu();
          },
          bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space",
        });
      var g = (function () {
          function e() {
            this.active = !0;
          }
          return (
            (e.prototype.insertByIndex = function (e, t, n) {
              return (
                !(!this.completions || !this.completions.filtered) &&
                this.insertMatch(e, this.completions.filtered[t], n)
              );
            }),
            (e.prototype.insertMatch = function (e, t, n) {
              if (!t) return !1;
              if (
                (e.startOperation({ command: { name: "insertMatch" } }),
                t.completer && t.completer.insertMatch)
              )
                t.completer.insertMatch(e, t);
              else {
                if (!this.completions) return !1;
                if (this.completions.filterText && !t.range) {
                  var o;
                  o = e.selection.getAllRanges
                    ? e.selection.getAllRanges()
                    : [e.getSelectionRange()];
                  for (var i, r = 0; (i = o[r]); r++)
                    (i.start.column -= this.completions.filterText.length),
                      e.session.remove(i);
                }
                t.snippet
                  ? p.insertSnippet(e, t.snippet, { range: t.range })
                  : this.$insertString(e, t),
                  t.command &&
                    "startAutocomplete" === t.command &&
                    e.execCommand(t.command);
              }
              return e.endOperation(), !0;
            }),
            (e.prototype.$insertString = function (e, t) {
              var n = t.value || t;
              if (t.range) {
                if (e.inVirtualSelectionMode)
                  return e.session.replace(t.range, n);
                e.forEachSelection(
                  function () {
                    var o = e.getSelectionRange();
                    0 === t.range.compareRange(o)
                      ? e.session.replace(t.range, n)
                      : e.insert(n);
                  },
                  null,
                  { keepOrder: !0 }
                );
              } else e.execCommand("insertstring", n);
            }),
            (e.prototype.gatherCompletions = function (e, t) {
              var n = e.getSession(),
                o = e.getCursorPosition(),
                i = a.getCompletionPrefix(e),
                r = [];
              this.completers = e.completers;
              var s = e.completers.length;
              return (
                e.completers.forEach(function (c, l) {
                  c.getCompletions(e, n, o, i, function (n, o) {
                    !n && o && (r = r.concat(o)),
                      t(null, {
                        prefix: a.getCompletionPrefix(e),
                        matches: r,
                        finished: 0 === --s,
                      });
                  });
                }),
                !0
              );
            }),
            (e.prototype.provideCompletions = function (e, t, n) {
              var o = function (e) {
                  var o = e.prefix,
                    i = e.matches;
                  (this.completions = new f(i)),
                    t.exactMatch && (this.completions.exactMatch = !0),
                    t.ignoreCaption && (this.completions.ignoreCaption = !0),
                    this.completions.setFilter(o),
                    (e.finished || this.completions.filtered.length) &&
                      n(null, this.completions, e.finished);
                }.bind(this),
                i = !0,
                r = null;
              if (
                (this.gatherCompletions(
                  e,
                  function (e, t) {
                    this.active &&
                      (e && (n(e, [], !0), this.detach()),
                      0 === t.prefix.indexOf(t.prefix) && (i ? (r = t) : o(t)));
                  }.bind(this)
                ),
                (i = !1),
                r)
              ) {
                var s = r;
                (r = null), o(s);
              }
            }),
            (e.prototype.detach = function () {
              (this.active = !1),
                this.completers &&
                  this.completers.forEach(function (e) {
                    "function" === typeof e.cancel && e.cancel();
                  });
            }),
            e
          );
        })(),
        f = (function () {
          function e(e, t) {
            (this.all = e),
              (this.filtered = e),
              (this.filterText = t || ""),
              (this.exactMatch = !1),
              (this.ignoreCaption = !1);
          }
          return (
            (e.prototype.setFilter = function (e) {
              if (
                e.length > this.filterText &&
                0 === e.lastIndexOf(this.filterText, 0)
              )
                var t = this.filtered;
              else t = this.all;
              (this.filterText = e),
                (t = (t = this.filterCompletions(t, this.filterText)).sort(
                  function (e, t) {
                    return (
                      t.exactMatch - e.exactMatch ||
                      t.$score - e.$score ||
                      (e.caption || e.value).localeCompare(t.caption || t.value)
                    );
                  }
                ));
              var n = null;
              (t = t.filter(function (e) {
                var t = e.snippet || e.caption || e.value;
                return t !== n && ((n = t), !0);
              })),
                (this.filtered = t);
            }),
            (e.prototype.filterCompletions = function (e, t) {
              var n = [],
                o = t.toUpperCase(),
                i = t.toLowerCase();
              e: for (var r, s = 0; (r = e[s]); s++) {
                var a =
                  (!this.ignoreCaption && r.caption) || r.value || r.snippet;
                if (a) {
                  var c,
                    l,
                    p = -1,
                    h = 0,
                    u = 0;
                  if (this.exactMatch) {
                    if (t !== a.substr(0, t.length)) continue e;
                  } else {
                    var d = a.toLowerCase().indexOf(i);
                    if (d > -1) u = d;
                    else
                      for (var g = 0; g < t.length; g++) {
                        var f = a.indexOf(i[g], p + 1),
                          m = a.indexOf(o[g], p + 1);
                        if ((c = f >= 0 && (m < 0 || f < m) ? f : m) < 0)
                          continue e;
                        (l = c - p - 1) > 0 &&
                          (-1 === p && (u += 10), (u += l), (h |= 1 << g)),
                          (p = c);
                      }
                  }
                  (r.matchMask = h),
                    (r.exactMatch = u ? 0 : 1),
                    (r.$score = (r.score || 0) - u),
                    n.push(r);
                }
              }
              return n;
            }),
            e
          );
        })();
      (t.Autocomplete = d), (t.CompletionProvider = g), (t.FilteredList = f);
    }
  ),
  ace.define(
    "ace/ext/menu_tools/settings_menu.css",
    ["require", "exports", "module"],
    function (e, t, n) {
      n.exports =
        "#ace_settingsmenu, #kbshortcutmenu {\n    background-color: #F7F7F7;\n    color: black;\n    box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);\n    padding: 1em 0.5em 2em 1em;\n    overflow: auto;\n    position: absolute;\n    margin: 0;\n    bottom: 0;\n    right: 0;\n    top: 0;\n    z-index: 9991;\n    cursor: default;\n}\n\n.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {\n    box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);\n    background-color: rgba(255, 255, 255, 0.6);\n    color: black;\n}\n\n.ace_optionsMenuEntry:hover {\n    background-color: rgba(100, 100, 100, 0.1);\n    transition: all 0.3s\n}\n\n.ace_closeButton {\n    background: rgba(245, 146, 146, 0.5);\n    border: 1px solid #F48A8A;\n    border-radius: 50%;\n    padding: 7px;\n    position: absolute;\n    right: -8px;\n    top: -8px;\n    z-index: 100000;\n}\n.ace_closeButton{\n    background: rgba(245, 146, 146, 0.9);\n}\n.ace_optionsMenuKey {\n    color: darkslateblue;\n    font-weight: bold;\n}\n.ace_optionsMenuCommand {\n    color: darkcyan;\n    font-weight: normal;\n}\n.ace_optionsMenuEntry input, .ace_optionsMenuEntry button {\n    vertical-align: middle;\n}\n\n.ace_optionsMenuEntry button[ace_selected_button=true] {\n    background: #e7e7e7;\n    box-shadow: 1px 0px 2px 0px #adadad inset;\n    border-color: #adadad;\n}\n.ace_optionsMenuEntry button {\n    background: white;\n    border: 1px solid lightgray;\n    margin: 0px;\n}\n.ace_optionsMenuEntry button:hover{\n    background: #f0f0f0;\n}";
    }
  ),
  ace.define(
    "ace/ext/menu_tools/overlay_page",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/ext/menu_tools/settings_menu.css",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/dom"),
        i = e("./settings_menu.css");
      o.importCssString(i, "settings_menu.css", !1),
        (n.exports.overlayPage = function (e, t, n) {
          var o = document.createElement("div"),
            i = !1;
          function r(e) {
            27 === e.keyCode && s();
          }
          function s() {
            o &&
              (document.removeEventListener("keydown", r),
              o.parentNode.removeChild(o),
              e && e.focus(),
              (o = null),
              n && n());
          }
          return (
            (o.style.cssText =
              "margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; " +
              (e ? "background-color: rgba(0, 0, 0, 0.3);" : "")),
            o.addEventListener("click", function (e) {
              i || s();
            }),
            document.addEventListener("keydown", r),
            t.addEventListener("click", function (e) {
              e.stopPropagation();
            }),
            o.appendChild(t),
            document.body.appendChild(o),
            e && e.blur(),
            {
              close: s,
              setIgnoreFocusOut: function (e) {
                (i = e),
                  e &&
                    ((o.style.pointerEvents = "none"),
                    (t.style.pointerEvents = "auto"));
              },
            }
          );
        });
    }
  ),
  ace.define(
    "ace/ext/modelist",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      var o = [];
      var i = (function () {
          function e(e, t, n) {
            var o;
            (this.name = e),
              (this.caption = t),
              (this.mode = "ace/mode/" + e),
              (this.extensions = n),
              (o = /\^/.test(n)
                ? n.replace(/\|(\^)?/g, function (e, t) {
                    return "$|" + (t ? "^" : "^.*\\.");
                  }) + "$"
                : "^.*\\.(" + n + ")$"),
              (this.extRe = new RegExp(o, "gi"));
          }
          return (
            (e.prototype.supportsFile = function (e) {
              return e.match(this.extRe);
            }),
            e
          );
        })(),
        r = {
          ABAP: ["abap"],
          ABC: ["abc"],
          ActionScript: ["as"],
          ADA: ["ada|adb"],
          Alda: ["alda"],
          Apache_Conf: [
            "^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd",
          ],
          Apex: ["apex|cls|trigger|tgr"],
          AQL: ["aql"],
          AsciiDoc: ["asciidoc|adoc"],
          ASL: ["dsl|asl|asl.json"],
          Assembly_x86: ["asm|a"],
          AutoHotKey: ["ahk"],
          BatchFile: ["bat|cmd"],
          BibTeX: ["bib"],
          C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
          C9Search: ["c9search_results"],
          Cirru: ["cirru|cr"],
          Clojure: ["clj|cljs"],
          Cobol: ["CBL|COB"],
          coffee: ["coffee|cf|cson|^Cakefile"],
          ColdFusion: ["cfm|cfc"],
          Crystal: ["cr"],
          CSharp: ["cs"],
          Csound_Document: ["csd"],
          Csound_Orchestra: ["orc"],
          Csound_Score: ["sco"],
          CSS: ["css"],
          Curly: ["curly"],
          D: ["d|di"],
          Dart: ["dart"],
          Diff: ["diff|patch"],
          Dockerfile: ["^Dockerfile"],
          Dot: ["dot"],
          Drools: ["drl"],
          Edifact: ["edi"],
          Eiffel: ["e|ge"],
          EJS: ["ejs"],
          Elixir: ["ex|exs"],
          Elm: ["elm"],
          Erlang: ["erl|hrl"],
          Forth: ["frt|fs|ldr|fth|4th"],
          Fortran: ["f|f90"],
          FSharp: ["fsi|fs|ml|mli|fsx|fsscript"],
          FSL: ["fsl"],
          FTL: ["ftl"],
          Gcode: ["gcode"],
          Gherkin: ["feature"],
          Gitignore: ["^.gitignore"],
          Glsl: ["glsl|frag|vert"],
          Gobstones: ["gbs"],
          golang: ["go"],
          GraphQLSchema: ["gql"],
          Groovy: ["groovy"],
          HAML: ["haml"],
          Handlebars: ["hbs|handlebars|tpl|mustache"],
          Haskell: ["hs"],
          Haskell_Cabal: ["cabal"],
          haXe: ["hx"],
          Hjson: ["hjson"],
          HTML: ["html|htm|xhtml|vue|we|wpy"],
          HTML_Elixir: ["eex|html.eex"],
          HTML_Ruby: ["erb|rhtml|html.erb"],
          INI: ["ini|conf|cfg|prefs"],
          Io: ["io"],
          Ion: ["ion"],
          Jack: ["jack"],
          Jade: ["jade|pug"],
          Java: ["java"],
          JavaScript: ["js|jsm|jsx|cjs|mjs"],
          JEXL: ["jexl"],
          JSON: ["json"],
          JSON5: ["json5"],
          JSONiq: ["jq"],
          JSP: ["jsp"],
          JSSM: ["jssm|jssm_state"],
          JSX: ["jsx"],
          Julia: ["jl"],
          Kotlin: ["kt|kts"],
          LaTeX: ["tex|latex|ltx|bib"],
          Latte: ["latte"],
          LESS: ["less"],
          Liquid: ["liquid"],
          Lisp: ["lisp"],
          LiveScript: ["ls"],
          Log: ["log"],
          LogiQL: ["logic|lql"],
          Logtalk: ["lgt"],
          LSL: ["lsl"],
          Lua: ["lua"],
          LuaPage: ["lp"],
          Lucene: ["lucene"],
          Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
          Markdown: ["md|markdown"],
          Mask: ["mask"],
          MATLAB: ["matlab"],
          Maze: ["mz"],
          MediaWiki: ["wiki|mediawiki"],
          MEL: ["mel"],
          MIPS: ["s|asm"],
          MIXAL: ["mixal"],
          MUSHCode: ["mc|mush"],
          MySQL: ["mysql"],
          Nginx: ["nginx|conf"],
          Nim: ["nim"],
          Nix: ["nix"],
          NSIS: ["nsi|nsh"],
          Nunjucks: ["nunjucks|nunjs|nj|njk"],
          ObjectiveC: ["m|mm"],
          OCaml: ["ml|mli"],
          Odin: ["odin"],
          PartiQL: ["partiql|pql"],
          Pascal: ["pas|p"],
          Perl: ["pl|pm"],
          pgSQL: ["pgsql"],
          PHP: ["php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
          PHP_Laravel_blade: ["blade.php"],
          Pig: ["pig"],
          PLSQL: ["plsql"],
          Powershell: ["ps1"],
          Praat: ["praat|praatscript|psc|proc"],
          Prisma: ["prisma"],
          Prolog: ["plg|prolog"],
          Properties: ["properties"],
          Protobuf: ["proto"],
          Puppet: ["epp|pp"],
          Python: ["py"],
          QML: ["qml"],
          R: ["r"],
          Raku: ["raku|rakumod|rakutest|p6|pl6|pm6"],
          Razor: ["cshtml|asp"],
          RDoc: ["Rd"],
          Red: ["red|reds"],
          RHTML: ["Rhtml"],
          Robot: ["robot|resource"],
          RST: ["rst"],
          Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
          Rust: ["rs"],
          SaC: ["sac"],
          SASS: ["sass"],
          SCAD: ["scad"],
          Scala: ["scala|sbt"],
          Scheme: ["scm|sm|rkt|oak|scheme"],
          Scrypt: ["scrypt"],
          SCSS: ["scss"],
          SH: ["sh|bash|^.bashrc"],
          SJS: ["sjs"],
          Slim: ["slim|skim"],
          Smarty: ["smarty|tpl"],
          Smithy: ["smithy"],
          snippets: ["snippets"],
          Soy_Template: ["soy"],
          Space: ["space"],
          SPARQL: ["rq"],
          SQL: ["sql"],
          SQLServer: ["sqlserver"],
          Stylus: ["styl|stylus"],
          SVG: ["svg"],
          Swift: ["swift"],
          Tcl: ["tcl"],
          Terraform: ["tf", "tfvars", "terragrunt"],
          Tex: ["tex"],
          Text: ["txt"],
          Textile: ["textile"],
          Toml: ["toml"],
          TSX: ["tsx"],
          Turtle: ["ttl"],
          Twig: ["twig|swig"],
          Typescript: ["ts|typescript|str"],
          Vala: ["vala"],
          VBScript: ["vbs|vb"],
          Velocity: ["vm"],
          Verilog: ["v|vh|sv|svh"],
          VHDL: ["vhd|vhdl"],
          Visualforce: ["vfp|component|page"],
          Wollok: ["wlk|wpgm|wtest"],
          XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
          XQuery: ["xq"],
          YAML: ["yaml|yml"],
          Zeek: ["zeek|bro"],
          Django: ["html"],
        },
        s = {
          ObjectiveC: "Objective-C",
          CSharp: "C#",
          golang: "Go",
          C_Cpp: "C and C++",
          Csound_Document: "Csound Document",
          Csound_Orchestra: "Csound",
          Csound_Score: "Csound Score",
          coffee: "CoffeeScript",
          HTML_Ruby: "HTML (Ruby)",
          HTML_Elixir: "HTML (Elixir)",
          FTL: "FreeMarker",
          PHP_Laravel_blade: "PHP (Blade Template)",
          Perl6: "Perl 6",
          AutoHotKey: "AutoHotkey / AutoIt",
        },
        a = {};
      for (var c in r) {
        var l = r[c],
          p = (s[c] || c).replace(/_/g, " "),
          h = c.toLowerCase(),
          u = new i(h, p, l[0]);
        (a[h] = u), o.push(u);
      }
      n.exports = {
        getModeForPath: function (e) {
          for (
            var t = a.text, n = e.split(/[\/\\]/).pop(), i = 0;
            i < o.length;
            i++
          )
            if (o[i].supportsFile(n)) {
              t = o[i];
              break;
            }
          return t;
        },
        modes: o,
        modesByName: a,
      };
    }
  ),
  ace.define(
    "ace/ext/prompt",
    [
      "require",
      "exports",
      "module",
      "ace/config",
      "ace/range",
      "ace/lib/dom",
      "ace/autocomplete",
      "ace/autocomplete/popup",
      "ace/autocomplete/popup",
      "ace/undomanager",
      "ace/tokenizer",
      "ace/ext/menu_tools/overlay_page",
      "ace/ext/modelist",
    ],
    function (e, t, n) {
      "use strict";
      var o,
        i = e("../config").nls,
        r = e("../range").Range,
        s = e("../lib/dom"),
        a = e("../autocomplete").FilteredList,
        c = e("../autocomplete/popup").AcePopup,
        l = e("../autocomplete/popup").$singleLineEditor,
        p = e("../undomanager").UndoManager,
        h = e("../tokenizer").Tokenizer,
        u = e("./menu_tools/overlay_page").overlayPage,
        d = e("./modelist");
      function g(e, t, n, i) {
        if ("object" == typeof t) return g(e, "", t, n);
        if (o) {
          var r = o;
          if (((e = r.editor), r.close(), r.name && r.name == n.name)) return;
        }
        if (n.$type) return g[n.$type](e, i);
        var a = l();
        a.session.setUndoManager(new p());
        var d = s.buildDom([
            "div",
            {
              class:
                "ace_prompt_container" +
                (n.hasDescription ? " input-box-with-description" : ""),
            },
          ]),
          f = u(e, d, w);
        if (
          (d.appendChild(a.container),
          e &&
            ((e.cmdLine = a), a.setOption("fontSize", e.getOption("fontSize"))),
          t && a.setValue(t, 1),
          n.selection &&
            a.selection.setRange({
              start: a.session.doc.indexToPosition(n.selection[0]),
              end: a.session.doc.indexToPosition(n.selection[1]),
            }),
          n.getCompletions)
        ) {
          var m = new c();
          m.renderer.setStyle("ace_autocomplete_inline"),
            (m.container.style.display = "block"),
            (m.container.style.maxWidth = "600px"),
            (m.container.style.width = "100%"),
            (m.container.style.marginTop = "3px"),
            m.renderer.setScrollMargin(2, 2, 0, 0),
            (m.autoSelect = !1),
            (m.renderer.$maxLines = 15),
            m.setRow(-1),
            m.on("click", function (e) {
              var t = m.getData(m.getRow());
              t.error || (a.setValue(t.value || t.name || t), x(), e.stop());
            }),
            d.appendChild(m.container),
            C();
        }
        if (n.$rules) {
          var b = new h(n.$rules);
          a.session.bgTokenizer.setTokenizer(b);
        }
        if (
          (n.placeholder && a.setOption("placeholder", n.placeholder),
          n.hasDescription)
        ) {
          var v = s.buildDom(["div", { class: "ace_prompt_text_container" }]);
          s.buildDom(
            n.prompt || "Press 'Enter' to confirm or 'Escape' to cancel",
            v
          ),
            d.appendChild(v);
        }
        function x() {
          var e;
          e = m && m.getCursorPosition().row > 0 ? S() : a.getValue();
          var t = m ? m.getData(m.getRow()) : e;
          t &&
            !t.error &&
            (w(), n.onAccept && n.onAccept({ value: e, item: t }, a));
        }
        f.setIgnoreFocusOut(n.ignoreFocusOut);
        var y = {
          Enter: x,
          "Esc|Shift-Esc": function () {
            n.onCancel && n.onCancel(a.getValue(), a), w();
          },
        };
        function w() {
          f.close(), i && i(), (o = null);
        }
        function C() {
          if (n.getCompletions) {
            var e;
            n.getPrefix && (e = n.getPrefix(a));
            var t = n.getCompletions(a);
            m.setData(t, e), m.resize(!0);
          }
        }
        function S() {
          var e = m.getData(m.getRow());
          if (e && !e.error) return e.value || e.caption || e;
        }
        m &&
          Object.assign(y, {
            Up: function (e) {
              m.goTo("up"), S();
            },
            Down: function (e) {
              m.goTo("down"), S();
            },
            "Ctrl-Up|Ctrl-Home": function (e) {
              m.goTo("start"), S();
            },
            "Ctrl-Down|Ctrl-End": function (e) {
              m.goTo("end"), S();
            },
            Tab: function (e) {
              m.goTo("down"), S();
            },
            PageUp: function (e) {
              m.gotoPageUp(), S();
            },
            PageDown: function (e) {
              m.gotoPageDown(), S();
            },
          }),
          a.commands.bindKeys(y),
          a.on("input", function () {
            n.onInput && n.onInput(), C();
          }),
          a.resize(!0),
          m && m.resize(!0),
          a.focus(),
          (o = { close: w, name: n.name, editor: e });
      }
      (g.gotoLine = function (e, t) {
        var n;
        g(
          e,
          ":" +
            ((n = e.selection.toJSON()),
            Array.isArray(n) || (n = [n]),
            n
              .map(function (e) {
                var t = e.isBackwards ? e.start : e.end,
                  n = e.isBackwards ? e.end : e.start,
                  o = n.row + 1 + ":" + n.column;
                return (
                  n.row == t.row
                    ? n.column != t.column && (o += ">:" + t.column)
                    : (o += ">" + (t.row + 1) + ":" + t.column),
                  o
                );
              })
              .reverse()
              .join(", ")),
          {
            name: "gotoLine",
            selection: [1, Number.MAX_VALUE],
            onAccept: function (t) {
              var n = t.value,
                o = g.gotoLine._history;
              o || (g.gotoLine._history = o = []),
                -1 != o.indexOf(n) && o.splice(o.indexOf(n), 1),
                o.unshift(n),
                o.length > 20 && (o.length = 20);
              var i = e.getCursorPosition(),
                s = [];
              n
                .replace(/^:/, "")
                .split(/,/)
                .map(function (t) {
                  var n = t
                      .split(/([<>:+-]|c?\d+)|[^c\d<>:+-]+/)
                      .filter(Boolean),
                    o = 0;
                  function a() {
                    var t = n[o++];
                    if (t) {
                      if ("c" == t[0]) {
                        var r = parseInt(t.slice(1)) || 0;
                        return e.session.doc.indexToPosition(r);
                      }
                      var s = i.row,
                        a = 0;
                      return (
                        /\d/.test(t) && ((s = parseInt(t) - 1), (t = n[o++])),
                        ":" == t &&
                          ((t = n[o++]),
                          /\d/.test(t) && (a = parseInt(t) || 0)),
                        { row: s, column: a }
                      );
                    }
                  }
                  i = a();
                  var c = r.fromPoints(i, i);
                  ">" == n[o]
                    ? (o++, (c.end = a()))
                    : "<" == n[o] && (o++, (c.start = a())),
                    s.unshift(c);
                }),
                e.selection.fromJSON(s);
              var a = e.renderer.scrollTop;
              e.renderer.scrollSelectionIntoView(
                e.selection.anchor,
                e.selection.cursor,
                0.5
              ),
                e.renderer.animateScrolling(a);
            },
            history: function () {
              return g.gotoLine._history ? g.gotoLine._history : [];
            },
            getCompletions: function (t) {
              var n = t.getValue(),
                o = n.replace(/^:/, "").split(":"),
                i = Math.min(parseInt(o[0]) || 1, e.session.getLength()) - 1;
              return [n + "  " + e.session.getLine(i)].concat(this.history());
            },
            $rules: {
              start: [
                { regex: /\d+/, token: "string" },
                { regex: /[:,><+\-c]/, token: "keyword" },
              ],
            },
          }
        );
      }),
        (g.commands = function (e, t) {
          var n = (function (t) {
            var n = [],
              o = {};
            return (
              e.keyBinding.$handlers.forEach(function (e) {
                var i = e.platform,
                  r = e.byName;
                for (var s in r) {
                  var a = r[s].bindKey;
                  "string" !== typeof a && (a = (a && a[i]) || "");
                  var c = r[s],
                    l =
                      c.description ||
                      (c.name || "")
                        .replace(/^./, function (e) {
                          return e.toUpperCase(e);
                        })
                        .replace(/[a-z][A-Z]/g, function (e) {
                          return e[0] + " " + e[1].toLowerCase(e);
                        });
                  Array.isArray(c) || (c = [c]),
                    c.forEach(function (e) {
                      "string" != typeof e && (e = e.name),
                        t.find(function (t) {
                          return t === e;
                        }) ||
                          (o[e]
                            ? (o[e].key += "|" + a)
                            : ((o[e] = { key: a, command: e, description: l }),
                              n.push(o[e])));
                    });
                }
              }),
              n
            );
          })(["insertstring", "inserttext", "setIndentation", "paste"]);
          (n = n.map(function (e) {
            return { value: e.description, meta: e.key, command: e.command };
          })),
            g(e, "", {
              name: "commands",
              selection: [0, Number.MAX_VALUE],
              maxHistoryCount: 5,
              onAccept: function (t) {
                if (t.item) {
                  var n = t.item.command;
                  this.addToHistory(t.item), e.execCommand(n);
                }
              },
              addToHistory: function (e) {
                var t = this.history();
                t.unshift(e), delete e.message;
                for (var n = 1; n < t.length; n++)
                  if (t[n].command == e.command) {
                    t.splice(n, 1);
                    break;
                  }
                this.maxHistoryCount > 0 &&
                  t.length > this.maxHistoryCount &&
                  t.splice(t.length - 1, 1),
                  (g.commands.history = t);
              },
              history: function () {
                return g.commands.history || [];
              },
              getPrefix: function (e) {
                var t = e.getCursorPosition();
                return e.getValue().substring(0, t.column);
              },
              getCompletions: function (e) {
                function t(e, t) {
                  var n = JSON.parse(JSON.stringify(e));
                  return new a(n).filterCompletions(n, t);
                }
                var o = this.getPrefix(e),
                  r = t(this.history(), o),
                  s = (function (e, t) {
                    if (!t || !t.length) return e;
                    var n = [];
                    t.forEach(function (e) {
                      n.push(e.command);
                    });
                    var o = [];
                    return (
                      e.forEach(function (e) {
                        -1 === n.indexOf(e.command) && o.push(e);
                      }),
                      o
                    );
                  })(n, r);
                (s = t(s, o)),
                  r.length &&
                    s.length &&
                    ((r[0].message = i("Recently used")),
                    (s[0].message = i("Other commands")));
                var c = r.concat(s);
                return c.length > 0
                  ? c
                  : [{ value: i("No matching commands"), error: 1 }];
              },
            });
        }),
        (g.modes = function (e, t) {
          var n = d.modes;
          (n = n.map(function (e) {
            return { value: e.caption, mode: e.name };
          })),
            g(e, "", {
              name: "modes",
              selection: [0, Number.MAX_VALUE],
              onAccept: function (t) {
                if (t.item) {
                  var n = "ace/mode/" + t.item.mode;
                  e.session.setMode(n);
                }
              },
              getPrefix: function (e) {
                var t = e.getCursorPosition();
                return e.getValue().substring(0, t.column);
              },
              getCompletions: function (e) {
                var t = this.getPrefix(e),
                  o = (function (e, t) {
                    var n = JSON.parse(JSON.stringify(e));
                    return new a(n).filterCompletions(n, t);
                  })(n, t);
                return o.length > 0
                  ? o
                  : [
                      {
                        caption: "No mode matching",
                        value: "No mode matching",
                        error: 1,
                      },
                    ];
              },
            });
        }),
        s.importCssString(
          ".ace_prompt_container {\n    max-width: 603px;\n    width: 100%;\n    margin: 20px auto;\n    padding: 3px;\n    background: white;\n    border-radius: 2px;\n    box-shadow: 0px 2px 3px 0px #555;\n}",
          "promtp.css",
          !1
        ),
        (t.prompt = g);
    }
  ),
  ace.require(["ace/ext/prompt"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
