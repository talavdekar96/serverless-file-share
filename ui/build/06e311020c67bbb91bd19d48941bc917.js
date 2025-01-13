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
    var i = e("./lib/dom"),
      o = e("./lib/oop"),
      r = e("./lib/event_emitter").EventEmitter,
      s = e("./lib/lang"),
      a = e("./range").Range,
      c = e("./range_list").RangeList,
      p = e("./keyboard/hash_handler").HashHandler,
      l = e("./tokenizer").Tokenizer,
      h = e("./clipboard"),
      u = {
        CURRENT_WORD: function (e) {
          return e.session.getTextRange(e.session.getWordRange());
        },
        SELECTION: function (e, t, n) {
          var i = e.session.getTextRange();
          return n ? i.replace(/\n\r?([ \t]*\S)/g, "\n" + n + "$1") : i;
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
    var f = (function () {
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
              /^\d+$/.test(e) ? [{ tabstopId: parseInt(e, 10) }] : [{ text: e }]
            );
          }
          function n(e) {
            return "(?:[^\\\\" + e + "]|\\\\.)";
          }
          var i = {
            regex: "/(" + n("/") + "+)/",
            onMatch: function (e, t, n) {
              var i = n[0];
              return (
                (i.fmtString = !0),
                (i.guard = e.slice(1, -1)),
                (i.flag = ""),
                ""
              );
            },
            next: "formatString",
          };
          return (
            (e.$tokenizer = new l({
              start: [
                {
                  regex: /\\./,
                  onMatch: function (e, t, n) {
                    var i = e[1];
                    return (
                      (("}" == i && n.length) || -1 != "`$\\".indexOf(i)) &&
                        (e = i),
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
                  onMatch: function (e, n, i) {
                    var o = t(e.substr(1));
                    return i.unshift(o[0]), o;
                  },
                  next: "snippetVar",
                },
                { regex: /\n/, token: "newline", merge: !1 },
              ],
              snippetVar: [
                {
                  regex: "\\|" + n("\\|") + "*\\|",
                  onMatch: function (e, t, n) {
                    var i = e
                      .slice(1, -1)
                      .replace(/\\[,|\\]|,/g, function (e) {
                        return 2 == e.length ? e[1] : "\0";
                      })
                      .split("\0")
                      .map(function (e) {
                        return { value: e };
                      });
                    return (n[0].choices = i), [i[0]];
                  },
                  next: "start",
                },
                i,
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
                    var i = e[1];
                    return (
                      ("}" == i && n.length) || -1 != "`$\\".indexOf(i)
                        ? (e = i)
                        : "n" == i
                        ? (e = "\n")
                        : "t" == i
                        ? (e = "\t")
                        : -1 != "ulULE".indexOf(i) &&
                          (e = { changeCase: i, local: i > "a" }),
                      [e]
                    );
                  },
                },
                {
                  regex: "/\\w*}",
                  onMatch: function (e, t, n) {
                    var i = n.shift();
                    return (
                      i && (i.flag = e.slice(1, -1)),
                      (this.next = i && i.tabstopId ? "start" : ""),
                      [i || e]
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
                    var i = { text: e.slice(2) };
                    return n.unshift(i), [i];
                  },
                  next: "formatStringVar",
                },
                { regex: /\n/, token: "newline", merge: !1 },
                {
                  regex: /}/,
                  onMatch: function (e, t, n) {
                    var i = n.shift();
                    return (
                      (this.next = i && i.tabstopId ? "start" : ""), [i || e]
                    );
                  },
                  next: "start",
                },
              ],
              formatStringVar: [
                {
                  regex: /:\/\w+}/,
                  onMatch: function (e, t, n) {
                    return (n[0].formatFunction = e.slice(2, -1)), [n.shift()];
                  },
                  next: "formatString",
                },
                i,
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
          if (((t = t.replace(/^TM_/, "")), !this.variables.hasOwnProperty(t)))
            return "";
          var i = this.variables[t];
          return (
            "function" == typeof i && (i = this.variables[t](e, t, n)),
            null == i ? "" : i
          );
        }),
        (e.prototype.tmStrFormat = function (e, t, n) {
          if (!t.fmt) return e;
          var i = t.flag || "",
            o = t.guard;
          o = new RegExp(o, i.replace(/[^gim]/g, ""));
          var r =
              "string" == typeof t.fmt
                ? this.tokenizeTmSnippet(t.fmt, "formatString")
                : t.fmt,
            s = this,
            a = e.replace(o, function () {
              var e = s.variables.__;
              s.variables.__ = [].slice.call(arguments);
              for (
                var t = s.resolveVariables(r, n), i = "E", o = 0;
                o < t.length;
                o++
              ) {
                var a = t[o];
                if ("object" == typeof a)
                  if (((t[o] = ""), a.changeCase && a.local)) {
                    var c = t[o + 1];
                    c &&
                      "string" == typeof c &&
                      ("u" == a.changeCase
                        ? (t[o] = c[0].toUpperCase())
                        : (t[o] = c[0].toLowerCase()),
                      (t[o + 1] = c.substr(1)));
                  } else a.changeCase && (i = a.changeCase);
                else
                  "U" == i
                    ? (t[o] = a.toUpperCase())
                    : "L" == i && (t[o] = a.toLowerCase());
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
          for (var n = [], i = "", o = !0, r = 0; r < e.length; r++) {
            var s = e[r];
            if ("string" != typeof s) {
              if (s) {
                if (((o = !1), s.fmtString)) {
                  var a = e.indexOf(s, r + 1);
                  -1 == a && (a = e.length),
                    (s.fmt = e.slice(r + 1, a)),
                    (r = a);
                }
                if (s.text) {
                  var c = this.getVariableValue(t, s.text, i) + "";
                  s.fmtString && (c = this.tmStrFormat(c, s, t)),
                    s.formatFunction && (c = this.tmFormatFunction(c, s, t)),
                    c && !s.ifEnd
                      ? (n.push(c), p(s))
                      : !c && s.ifEnd && p(s.ifEnd);
                } else
                  s.elseEnd
                    ? p(s.elseEnd)
                    : (null != s.tabstopId || null != s.changeCase) &&
                      n.push(s);
              }
            } else
              n.push(s),
                "\n" == s
                  ? ((o = !0), (i = ""))
                  : o && ((i = /^\t*/.exec(s)[0]), (o = /\S/.test(s)));
          }
          function p(t) {
            var n = e.indexOf(t, r + 1);
            -1 != n && (r = n);
          }
          return n;
        }),
        (e.prototype.getDisplayTextForSnippet = function (e, t) {
          return g.call(this, e, t).text;
        }),
        (e.prototype.insertSnippetForSelection = function (e, t, n) {
          void 0 === n && (n = {});
          var i = g.call(this, e, t, n),
            o = e.getSelectionRange();
          n.range && 0 === n.range.compareRange(o) && (o = n.range);
          var r = e.session.replace(o, i.text),
            s = new m(e),
            a = e.inVirtualSelectionMode && e.selection.index;
          s.addTabstops(i.tabstops, o.start, r, a);
        }),
        (e.prototype.insertSnippet = function (e, t, n) {
          void 0 === n && (n = {});
          var i = this;
          if (
            (!n.range ||
              n.range instanceof a ||
              (n.range = a.fromPoints(n.range.start, n.range.end)),
            e.inVirtualSelectionMode)
          )
            return i.insertSnippetForSelection(e, t, n);
          e.forEachSelection(
            function () {
              i.insertSnippetForSelection(e, t, n);
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
              i = e.session.getState(n.row);
            "object" === typeof i && (i = i[0]),
              i.substring &&
                ("js-" == i.substring(0, 3)
                  ? (t = "javascript")
                  : "css-" == i.substring(0, 4)
                  ? (t = "css")
                  : "php-" == i.substring(0, 4) && (t = "php"));
          }
          return t;
        }),
        (e.prototype.getActiveScopes = function (e) {
          var t = this.$getScope(e),
            n = [t],
            i = this.snippetMap;
          return (
            i[t] && i[t].includeScopes && n.push.apply(n, i[t].includeScopes),
            n.push("_"),
            n
          );
        }),
        (e.prototype.expandWithTab = function (e, t) {
          var n = this,
            i = e.forEachSelection(
              function () {
                return n.expandSnippetForSelection(e, t);
              },
              null,
              { keepOrder: !0 }
            );
          return i && e.tabstopManager && e.tabstopManager.tabNext(), i;
        }),
        (e.prototype.expandSnippetForSelection = function (e, t) {
          var n,
            i = e.getCursorPosition(),
            o = e.session.getLine(i.row),
            r = o.substring(0, i.column),
            s = o.substr(i.column),
            a = this.snippetMap;
          return (
            this.getActiveScopes(e).some(function (e) {
              var t = a[e];
              return t && (n = this.findMatchingSnippet(t, r, s)), !!n;
            }, this),
            !!n &&
              ((t && t.dryRun) ||
                (e.session.doc.removeInLine(
                  i.row,
                  i.column - n.replaceBefore.length,
                  i.column + n.replaceAfter.length
                ),
                (this.variables.M__ = n.matchBefore),
                (this.variables.T__ = n.matchAfter),
                this.insertSnippetForSelection(e, n.content),
                (this.variables.M__ = this.variables.T__ = null)),
              !0)
          );
        }),
        (e.prototype.findMatchingSnippet = function (e, t, n) {
          for (var i = e.length; i--; ) {
            var o = e[i];
            if (
              (!o.startRe || o.startRe.test(t)) &&
              (!o.endRe || o.endRe.test(n)) &&
              (o.startRe || o.endRe)
            )
              return (
                (o.matchBefore = o.startRe ? o.startRe.exec(t) : [""]),
                (o.matchAfter = o.endRe ? o.endRe.exec(n) : [""]),
                (o.replaceBefore = o.triggerRe ? o.triggerRe.exec(t)[0] : ""),
                (o.replaceAfter = o.endTriggerRe
                  ? o.endTriggerRe.exec(n)[0]
                  : ""),
                o
              );
          }
        }),
        (e.prototype.register = function (e, t) {
          var n = this.snippetMap,
            i = this.snippetNameMap,
            o = this;
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
              n[t] || ((n[t] = []), (i[t] = {}));
            var r = i[t];
            if (e.name) {
              var c = r[e.name];
              c && o.unregister(c), (r[e.name] = e);
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
            i = this.snippetNameMap;
          function o(e) {
            var o = i[e.scope || t];
            if (o && o[e.name]) {
              delete o[e.name];
              var r = n[e.scope || t],
                s = r && r.indexOf(e);
              s >= 0 && r.splice(s, 1);
            }
          }
          e.content ? o(e) : Array.isArray(e) && e.forEach(o);
        }),
        (e.prototype.parseSnippetFile = function (e) {
          e = e.replace(/\r/g, "");
          for (
            var t,
              n = [],
              i = {},
              o = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
            (t = o.exec(e));

          ) {
            if (t[1])
              try {
                (i = JSON.parse(t[1])), n.push(i);
              } catch (c) {}
            if (t[4])
              (i.content = t[4].replace(/^\t/gm, "")), n.push(i), (i = {});
            else {
              var r = t[2],
                s = t[3];
              if ("regex" == r) {
                var a = /\/((?:[^\/\\]|\\.)*)|$/g;
                (i.guard = a.exec(s)[1]),
                  (i.trigger = a.exec(s)[1]),
                  (i.endTrigger = a.exec(s)[1]),
                  (i.endGuard = a.exec(s)[1]);
              } else
                "snippet" == r
                  ? ((i.tabTrigger = s.match(/^\S*/)[0]),
                    i.name || (i.name = s))
                  : r && (i[r] = s);
            }
          }
          return n;
        }),
        (e.prototype.getSnippetByName = function (e, t) {
          var n,
            i = this.snippetNameMap;
          return (
            this.getActiveScopes(t).some(function (t) {
              var o = i[t];
              return o && (n = o[e]), !!n;
            }, this),
            n
          );
        }),
        e
      );
    })();
    o.implement(f.prototype, r);
    var g = function (e, t, n) {
        void 0 === n && (n = {});
        var i = e.getCursorPosition(),
          o = e.session.getLine(i.row),
          r = e.session.getTabString(),
          s = o.match(/^\s*/)[0];
        i.column < s.length && (s = s.slice(0, i.column)),
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
              i = c[n];
            if (
              (i ||
                (((i = c[n] = []).index = n), (i.value = ""), (i.parents = {})),
              -1 === i.indexOf(e))
            ) {
              e.choices && !i.choices && (i.choices = e.choices), i.push(e);
              var o = a.indexOf(e, t + 1);
              if (-1 !== o) {
                var r = a.slice(t + 1, o);
                r.some(function (e) {
                  return "object" === typeof e;
                }) && !i.value
                  ? (i.value = r)
                  : !r.length ||
                    (i.value && "string" === typeof i.value) ||
                    (i.value = r.join(""));
              }
            }
          }
        }),
          c.forEach(function (e) {
            e.length = 0;
          });
        var p = {};
        function l(e) {
          for (var t = [], n = 0; n < e.length; n++) {
            var i = e[n];
            if ("object" == typeof i) {
              if (p[i.tabstopId]) continue;
              i = t[e.lastIndexOf(i, n - 1)] || { tabstopId: i.tabstopId };
            }
            t[n] = i;
          }
          return t;
        }
        for (var h = 0; h < a.length; h++) {
          var u = a[h];
          if ("object" == typeof u) {
            var d = u.tabstopId,
              f = c[d],
              g = a.indexOf(u, h + 1);
            if (p[d])
              p[d] === u &&
                (delete p[d],
                Object.keys(p).forEach(function (e) {
                  f.parents[e] = !0;
                }));
            else {
              p[d] = u;
              var m = f.value;
              "string" !== typeof m
                ? (m = l(m))
                : u.fmt && (m = this.tmStrFormat(m, u, e)),
                a.splice.apply(a, [h + 1, Math.max(0, g - h)].concat(m, u)),
                -1 === f.indexOf(u) && f.push(u);
            }
          }
        }
        var v = 0,
          b = 0,
          x = "";
        return (
          a.forEach(function (e) {
            if ("string" === typeof e) {
              var t = e.split("\n");
              t.length > 1
                ? ((b = t[t.length - 1].length), (v += t.length - 1))
                : (b += e.length),
                (x += e);
            } else e && (e.start ? (e.end = { row: v, column: b }) : (e.start = { row: v, column: b }));
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
                i = n.parents || {},
                o = this.tabstops.slice(),
                r = 0;
              r < o.length;
              r++
            ) {
              var s = o[r],
                a = s == n || i[s.index];
              if (
                ((s.rangeList.$bias = a ? 0 : 1),
                "remove" == e.action && s !== n)
              ) {
                var c = s.parents && s.parents[n.index],
                  p = s.rangeList.pointIndex(e.start, c);
                p = p < 0 ? -p - 1 : p + 1;
                var l = s.rangeList.pointIndex(e.end, c);
                l = l < 0 ? -l - 1 : l - 1;
                for (
                  var h = s.rangeList.ranges.slice(p, l), u = 0;
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
                  i = n.getTextRange(e.firstNonLinked),
                  o = 0;
                o < e.length;
                o++
              ) {
                var r = e[o];
                if (r.linked) {
                  var s = r.original,
                    a = t.snippetManager.tmStrFormat(i, s, this.editor);
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
                  i = 0;
                i < this.ranges.length;
                i++
              )
                if (!this.ranges[i].linked) {
                  var o = this.ranges[i].contains(e.row, e.column),
                    r = n || this.ranges[i].contains(t.row, t.column);
                  if (o && r) return;
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
                var i = this.editor.multiSelect;
                i.toSingleRange(n);
                for (var o = 0; o < t.length; o++)
                  (t.hasLinkedRanges && t[o].linked) ||
                    i.addRange(t[o].clone(), !0);
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
            var i = this.useLink || !this.editor.getOption("enableMultiselect");
            if ((this.$openTabstops || (this.$openTabstops = []), !e[0])) {
              var o = a.fromPoints(n, n);
              b(o.start, t), b(o.end, t), (e[0] = [o]), (e[0].index = 0);
            }
            var r = [this.index + 1, 0],
              s = this.ranges;
            e.forEach(function (e, n) {
              for (
                var o = this.$openTabstops[n] || e, p = 0;
                p < e.length;
                p++
              ) {
                var l = e[p],
                  h = a.fromPoints(l.start, l.end || l.start);
                v(h.start, t),
                  v(h.end, t),
                  (h.original = l),
                  (h.tabstop = o),
                  s.push(h),
                  o != e ? o.unshift(h) : (o[p] = h),
                  l.fmtString || (o.firstNonLinked && i)
                    ? ((h.linked = !0), (o.hasLinkedRanges = !0))
                    : o.firstNonLinked || (o.firstNonLinked = h);
              }
              o.firstNonLinked || (o.hasLinkedRanges = !1),
                o === e && (r.push(o), (this.$openTabstops[n] = o)),
                this.addTabstopMarkers(o),
                (o.rangeList = o.rangeList || new c()),
                (o.rangeList.$bias = 0),
                o.rangeList.addList(o);
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
    (m.prototype.keyboardHandler = new p()),
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
    var v = function (e, t) {
        0 == e.row && (e.column += t.column), (e.row += t.row);
      },
      b = function (e, t) {
        e.row == t.row && (e.column -= t.column), (e.row -= t.row);
      };
    i.importCssString(
      "\n.ace_snippet-marker {\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    background: rgba(194, 193, 208, 0.09);\n    border: 1px dotted rgba(211, 208, 235, 0.62);\n    position: absolute;\n}",
      "snippets.css",
      !1
    ),
      (t.snippetManager = new f());
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
      var i = e("../virtual_renderer").VirtualRenderer,
        o = e("../editor").Editor,
        r = e("../range").Range,
        s = e("../lib/event"),
        a = e("../lib/lang"),
        c = e("../lib/dom"),
        p = e("../config").nls,
        l = function (e) {
          return "suggest-aria-id:".concat(e);
        },
        h = function (e) {
          var t = new i(e);
          t.$maxLines = 4;
          var n = new o(t);
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
              p("Autocomplete suggestions")
            ),
            n.renderer.textarea.setAttribute("aria-hidden", "true"),
            n.setOption("displayIndentGuides", !1),
            n.setOption("dragDelay", 150);
          var i,
            o = function () {};
          (n.focus = o),
            (n.$isFocused = !0),
            (n.renderer.$cursorLayer.restartTimer = o),
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
              if (i) {
                if (i.x != e.x || i.y != e.y) {
                  (i = e).scrollTop = n.renderer.scrollTop;
                  var t = i.getDocumentPosition().row;
                  u.start.row != t && (u.id || n.setRow(t), g(t));
                }
              } else i = e;
            }),
            n.renderer.on("beforeRender", function () {
              if (i && -1 != u.start.row) {
                i.$pos = null;
                var e = i.getDocumentPosition().row;
                u.id || n.setRow(e), g(e, !0);
              }
            }),
            n.renderer.on("afterRender", function () {
              var e = n.getRow(),
                t = n.renderer.$textLayer,
                i = t.element.childNodes[e - t.config.firstRow],
                o = document.activeElement;
              if (
                (i !== t.selectedNode &&
                  t.selectedNode &&
                  (c.removeCssClass(t.selectedNode, "ace_selected"),
                  o.removeAttribute("aria-activedescendant"),
                  t.selectedNode.removeAttribute("id")),
                (t.selectedNode = i),
                i)
              ) {
                c.addCssClass(i, "ace_selected");
                var r = l(e);
                (i.id = r),
                  t.element.setAttribute("aria-activedescendant", r),
                  o.setAttribute("aria-activedescendant", r),
                  i.setAttribute("role", "option"),
                  i.setAttribute("aria-label", n.getData(e).value),
                  i.setAttribute("aria-setsize", n.data.length),
                  i.setAttribute("aria-posinset", e + 1),
                  i.setAttribute("aria-describedby", "doc-tooltip");
              }
            });
          var f = function () {
              g(-1);
            },
            g = function (e, t) {
              e !== u.start.row &&
                ((u.start.row = u.end.row = e),
                t || n.session._emit("changeBackMarker"),
                n._emit("changeHoverMarker"));
            };
          (n.getHoveredRow = function () {
            return u.start.row;
          }),
            s.addListener(n.container, "mouseout", f),
            n.on("hide", f),
            n.on("changeSelection", f),
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
                i = [];
              if (!t) return i;
              "string" == typeof t && (t = { value: t });
              var o = t.caption || t.value || t.name;
              function r(e, n) {
                e &&
                  i.push({ type: (t.className || "") + (n || ""), value: e });
              }
              for (
                var s = o.toLowerCase(),
                  a = (n.filterText || "").toLowerCase(),
                  c = 0,
                  p = 0,
                  l = 0;
                l <= a.length;
                l++
              )
                if (l != p && (t.matchMask & (1 << l) || l == a.length)) {
                  var h = a.slice(p, l);
                  p = l;
                  var u = s.indexOf(h, c);
                  if (-1 == u) continue;
                  r(o.slice(c, u), ""),
                    (c = u + h.length),
                    r(o.slice(u, c), "completion-highlight");
                }
              return (
                r(o.slice(c, o.length), ""),
                i.push({ type: "completion-spacer", value: " " }),
                t.meta && i.push({ type: "completion-meta", value: t.meta }),
                t.message &&
                  i.push({ type: "completion-message", value: t.message }),
                i
              );
            }),
            (m.$updateOnChange = o),
            (m.start = o),
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
            (n.tryShow = function (e, t, o, r) {
              if (
                !r &&
                n.isOpen &&
                n.anchorPos &&
                n.anchor &&
                n.anchorPos.top === e.top &&
                n.anchorPos.left === e.left &&
                n.anchor === o
              )
                return !0;
              var s = this.container,
                a = window.innerHeight,
                c = window.innerWidth,
                p = this.renderer,
                l = p.$maxLines * t * 1.4,
                h = { top: 0, bottom: 0, left: 0 },
                u = a - e.top - 3 * this.$borderSize - t,
                d = e.top - 3 * this.$borderSize;
              o || (o = d <= u || u >= l ? "bottom" : "top"),
                "top" === o
                  ? ((h.bottom = e.top - this.$borderSize),
                    (h.top = h.bottom - l))
                  : "bottom" === o &&
                    ((h.top = e.top + t + this.$borderSize),
                    (h.bottom = h.top + l));
              var f = h.top >= 0 && h.bottom <= a;
              if (!r && !f) return !1;
              (p.$maxPixelHeight = f ? null : "top" === o ? d : u),
                "top" === o
                  ? ((s.style.top = ""),
                    (s.style.bottom = a - h.bottom + "px"),
                    (n.isTopdown = !1))
                  : ((s.style.top = h.top + "px"),
                    (s.style.bottom = ""),
                    (n.isTopdown = !0)),
                (s.style.display = "");
              var g = e.left;
              return (
                g + s.offsetWidth > c && (g = c - s.offsetWidth),
                (s.style.left = g + "px"),
                (s.style.right = ""),
                n.isOpen || ((n.isOpen = !0), this._signal("show"), (i = null)),
                (n.anchorPos = e),
                (n.anchor = o),
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
              return (
                this.$borderSize + this.renderer.$padding + this.$imageSize
              );
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
        (t.getAriaId = l);
    }
  ),
  ace.define(
    "ace/autocomplete/inline",
    ["require", "exports", "module", "ace/snippets"],
    function (e, t, n) {
      "use strict";
      var i = e("../snippets").snippetManager,
        o = (function () {
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
              var o = t.snippet
                ? i.getDisplayTextForSnippet(e, t.snippet)
                : t.value;
              return (
                !(!o || !o.startsWith(n)) &&
                ((this.editor = e),
                "" === (o = o.slice(n.length))
                  ? e.removeGhostText()
                  : e.setGhostText(o),
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
      t.AceInline = o;
    }
  ),
  ace.define(
    "ace/autocomplete/util",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      t.parForEach = function (e, t, n) {
        var i = 0,
          o = e.length;
        0 === o && n();
        for (var r = 0; r < o; r++)
          t(e[r], function (e, t) {
            ++i === o && n(e, t);
          });
      };
      var i = /[a-zA-Z_0-9\$\-\u00A2-\u2000\u2070-\uFFFF]/;
      (t.retrievePrecedingIdentifier = function (e, t, n) {
        n = n || i;
        for (var o = [], r = t - 1; r >= 0 && n.test(e[r]); r--) o.push(e[r]);
        return o.reverse().join("");
      }),
        (t.retrieveFollowingIdentifier = function (e, t, n) {
          n = n || i;
          for (var o = [], r = t; r < e.length && n.test(e[r]); r++)
            o.push(e[r]);
          return o;
        }),
        (t.getCompletionPrefix = function (e) {
          var t,
            n = e.getCursorPosition(),
            i = e.session.getLine(n.row);
          return (
            e.completers.forEach(
              function (e) {
                e.identifierRegexps &&
                  e.identifierRegexps.forEach(
                    function (e) {
                      !t &&
                        e &&
                        (t = this.retrievePrecedingIdentifier(i, n.column, e));
                    }.bind(this)
                  );
              }.bind(this)
            ),
            t || this.retrievePrecedingIdentifier(i, n.column)
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
      var i = e("./keyboard/hash_handler").HashHandler,
        o = e("./autocomplete/popup").AcePopup,
        r = e("./autocomplete/inline").AceInline,
        s = e("./autocomplete/popup").getAriaId,
        a = e("./autocomplete/util"),
        c = e("./lib/lang"),
        p = e("./lib/dom"),
        l = e("./snippets").snippetManager,
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
              (this.keyboardHandler = new i()),
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
                (this.popup = new o(
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
                i = t.$cursorLayer.getPixelPosition(this.base, !0);
              i.left -= this.popup.getTextLeftOffset();
              var o = e.container.getBoundingClientRect();
              (i.top += o.top - t.layerConfig.offset),
                (i.left += o.left - e.renderer.scrollLeft),
                (i.left += t.gutterWidth);
              var r = { top: i.top, left: i.left };
              t.$ghostText &&
                t.$ghostTextWidget &&
                this.base.row === t.$ghostText.position.row &&
                (r.top += t.$ghostTextWidget.el.offsetHeight),
                this.popup.tryShow(r, n, "bottom") ||
                  this.popup.tryShow(i, n, "top") ||
                  this.popup.show(i, n);
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
                i =
                  e.relatedTarget &&
                  this.tooltipNode &&
                  this.tooltipNode.contains(e.relatedTarget),
                o = this.popup && this.popup.container;
              t == n ||
                t.parentNode == o ||
                i ||
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
                i = this.getCompletionProvider().insertMatch(
                  this.editor,
                  e,
                  n.filterText,
                  t
                );
              return this.completions == n && this.detach(), i;
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
                this.completionProvider || (this.completionProvider = new f()),
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
                  (o = this.editor.session.getTextRange({
                    start: this.base,
                    end: n,
                  })) == this.completions.filterText
                )
                  return;
                return (
                  this.completions.setFilter(o),
                  this.completions.filtered.length
                    ? 1 != this.completions.filtered.length ||
                      this.completions.filtered[0].value != o ||
                      this.completions.filtered[0].snippet
                      ? void this.openPopup(this.editor, o, e)
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
                  (this.completions = new g(t.matches)),
                  this.openPopup(this.editor, "", e)
                );
              }
              var i = this.editor.getSession(),
                o =
                  ((n = this.editor.getCursorPosition()),
                  a.getCompletionPrefix(this.editor));
              (this.base = i.doc.createAnchor(n.row, n.column - o.length)),
                (this.base.$insertRight = !0);
              var r = { exactMatch: this.exactMatch };
              this.getCompletionProvider().provideCompletions(
                this.editor,
                r,
                function (t, n, i) {
                  var o = n.filtered,
                    r = a.getCompletionPrefix(this.editor);
                  if (i) {
                    if (!o.length) {
                      var s = !this.autoShown && this.emptyMessage;
                      if (
                        ("function" == typeof s && (s = this.emptyMessage(r)),
                        s)
                      ) {
                        var c = [{ caption: this.emptyMessage(r), value: "" }];
                        return (
                          (this.completions = new g(c)),
                          void this.openPopup(this.editor, r, e)
                        );
                      }
                      return this.detach();
                    }
                    if (1 == o.length && o[0].value == r && !o[0].snippet)
                      return this.detach();
                    if (this.autoInsert && !this.autoShown && 1 == o.length)
                      return this.insertMatch(o[0]);
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
                i = null;
              if (!n || !this.editor || !this.popup.isOpen)
                return this.hideDocTooltip();
              for (var o = this.editor.completers.length, r = 0; r < o; r++) {
                var s = this.editor.completers[r];
                if (s.getDocTooltip && n.completerId === s.id) {
                  i = s.getDocTooltip(n);
                  break;
                }
              }
              if (
                (i || "string" == typeof n || (i = n),
                "string" == typeof i && (i = { docText: i }),
                !i || (!i.docHTML && !i.docText))
              )
                return this.hideDocTooltip();
              this.showDocTooltip(i);
            }),
            (e.prototype.showDocTooltip = function (e) {
              this.tooltipNode ||
                ((this.tooltipNode = p.createElement("div")),
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
              var i = this.popup,
                o = i.container.getBoundingClientRect();
              (n.style.top = i.container.style.top),
                (n.style.bottom = i.container.style.bottom),
                (n.style.display = "block"),
                window.innerWidth - o.right < 320
                  ? o.left < 320
                    ? i.isTopdown
                      ? ((n.style.top = o.bottom + "px"),
                        (n.style.left = o.left + "px"),
                        (n.style.right = ""),
                        (n.style.bottom = ""))
                      : ((n.style.top =
                          i.container.offsetTop - n.offsetHeight + "px"),
                        (n.style.left = o.left + "px"),
                        (n.style.right = ""),
                        (n.style.bottom = ""))
                    : ((n.style.right = window.innerWidth - o.left + "px"),
                      (n.style.left = ""))
                  : ((n.style.left = o.right + 1 + "px"), (n.style.right = ""));
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
      var f = (function () {
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
                  var i;
                  i = e.selection.getAllRanges
                    ? e.selection.getAllRanges()
                    : [e.getSelectionRange()];
                  for (var o, r = 0; (o = i[r]); r++)
                    (o.start.column -= this.completions.filterText.length),
                      e.session.remove(o);
                }
                t.snippet
                  ? l.insertSnippet(e, t.snippet, { range: t.range })
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
                    var i = e.getSelectionRange();
                    0 === t.range.compareRange(i)
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
                i = e.getCursorPosition(),
                o = a.getCompletionPrefix(e),
                r = [];
              this.completers = e.completers;
              var s = e.completers.length;
              return (
                e.completers.forEach(function (c, p) {
                  c.getCompletions(e, n, i, o, function (n, i) {
                    !n && i && (r = r.concat(i)),
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
              var i = function (e) {
                  var i = e.prefix,
                    o = e.matches;
                  (this.completions = new g(o)),
                    t.exactMatch && (this.completions.exactMatch = !0),
                    t.ignoreCaption && (this.completions.ignoreCaption = !0),
                    this.completions.setFilter(i),
                    (e.finished || this.completions.filtered.length) &&
                      n(null, this.completions, e.finished);
                }.bind(this),
                o = !0,
                r = null;
              if (
                (this.gatherCompletions(
                  e,
                  function (e, t) {
                    this.active &&
                      (e && (n(e, [], !0), this.detach()),
                      0 === t.prefix.indexOf(t.prefix) && (o ? (r = t) : i(t)));
                  }.bind(this)
                ),
                (o = !1),
                r)
              ) {
                var s = r;
                (r = null), i(s);
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
        g = (function () {
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
                i = t.toUpperCase(),
                o = t.toLowerCase();
              e: for (var r, s = 0; (r = e[s]); s++) {
                var a =
                  (!this.ignoreCaption && r.caption) || r.value || r.snippet;
                if (a) {
                  var c,
                    p,
                    l = -1,
                    h = 0,
                    u = 0;
                  if (this.exactMatch) {
                    if (t !== a.substr(0, t.length)) continue e;
                  } else {
                    var d = a.toLowerCase().indexOf(o);
                    if (d > -1) u = d;
                    else
                      for (var f = 0; f < t.length; f++) {
                        var g = a.indexOf(o[f], l + 1),
                          m = a.indexOf(i[f], l + 1);
                        if ((c = g >= 0 && (m < 0 || g < m) ? g : m) < 0)
                          continue e;
                        (p = c - l - 1) > 0 &&
                          (-1 === l && (u += 10), (u += p), (h |= 1 << f)),
                          (l = c);
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
      (t.Autocomplete = d), (t.CompletionProvider = f), (t.FilteredList = g);
    }
  ),
  ace.define(
    "ace/autocomplete/text_completer",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      var i = e("../range").Range,
        o = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
      function r(e, t) {
        var n = (function (e, t) {
            return (
              e.getTextRange(i.fromPoints({ row: 0, column: 0 }, t)).split(o)
                .length - 1
            );
          })(e, t),
          r = e.getValue().split(o),
          s = Object.create(null),
          a = r[n];
        return (
          r.forEach(function (e, t) {
            if (e && e !== a) {
              var i = Math.abs(n - t),
                o = r.length - i;
              s[e] ? (s[e] = Math.max(o, s[e])) : (s[e] = o);
            }
          }),
          s
        );
      }
      t.getCompletions = function (e, t, n, i, o) {
        var s = r(t, n);
        o(
          null,
          Object.keys(s).map(function (e) {
            return { caption: e, value: e, score: s[e], meta: "local" };
          })
        );
      };
    }
  ),
  ace.define(
    "ace/ext/language_tools",
    [
      "require",
      "exports",
      "module",
      "ace/snippets",
      "ace/autocomplete",
      "ace/config",
      "ace/lib/lang",
      "ace/autocomplete/util",
      "ace/autocomplete/text_completer",
      "ace/editor",
      "ace/config",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../snippets").snippetManager,
        o = e("../autocomplete").Autocomplete,
        r = e("../config"),
        s = e("../lib/lang"),
        a = e("../autocomplete/util"),
        c = e("../autocomplete/text_completer"),
        p = {
          getCompletions: function (e, t, n, i, o) {
            if (t.$mode.completer)
              return t.$mode.completer.getCompletions(e, t, n, i, o);
            var r = e.session.getState(n.row),
              s = t.$mode.getCompletions(r, t, n, i);
            o(
              null,
              (s = s.map(function (e) {
                return (e.completerId = p.id), e;
              }))
            );
          },
          id: "keywordCompleter",
        },
        l = function (e) {
          var t = {};
          return e
            .replace(/\${(\d+)(:(.*?))?}/g, function (e, n, i, o) {
              return (t[n] = o || "");
            })
            .replace(/\$(\d+?)/g, function (e, n) {
              return t[n];
            });
        },
        h = {
          getCompletions: function (e, t, n, o, r) {
            var s = [],
              a = t.getTokenAt(n.row, n.column);
            a &&
            a.type.match(
              /(tag-name|tag-open|tag-whitespace|attribute-name|attribute-value)\.xml$/
            )
              ? s.push("html-tag")
              : (s = i.getActiveScopes(e));
            var c = i.snippetMap,
              p = [];
            s.forEach(function (e) {
              for (var t = c[e] || [], n = t.length; n--; ) {
                var i = t[n],
                  o = i.name || i.tabTrigger;
                o &&
                  p.push({
                    caption: o,
                    snippet: i.content,
                    meta:
                      i.tabTrigger && !i.name
                        ? i.tabTrigger + "\u21e5 "
                        : "snippet",
                    completerId: h.id,
                  });
              }
            }, this),
              r(null, p);
          },
          getDocTooltip: function (e) {
            e.snippet &&
              !e.docHTML &&
              (e.docHTML = [
                "<b>",
                s.escapeHTML(e.caption),
                "</b>",
                "<hr></hr>",
                s.escapeHTML(l(e.snippet)),
              ].join(""));
          },
          id: "snippetCompleter",
        },
        u = [h, c, p];
      (t.setCompleters = function (e) {
        (u.length = 0), e && u.push.apply(u, e);
      }),
        (t.addCompleter = function (e) {
          u.push(e);
        }),
        (t.textCompleter = c),
        (t.keyWordCompleter = p),
        (t.snippetCompleter = h);
      var d,
        f = {
          name: "expandSnippet",
          exec: function (e) {
            return i.expandWithTab(e);
          },
          bindKey: "Tab",
        },
        g = function (e, t) {
          m(t.session.$mode);
        },
        m = function e(t) {
          "string" == typeof t && (t = r.$modes[t]),
            t &&
              (i.files || (i.files = {}),
              v(t.$id, t.snippetFileId),
              t.modes && t.modes.forEach(e));
        },
        v = function (e, t) {
          t &&
            e &&
            !i.files[e] &&
            ((i.files[e] = {}),
            r.loadModule(t, function (t) {
              t &&
                ((i.files[e] = t),
                !t.snippets &&
                  t.snippetText &&
                  (t.snippets = i.parseSnippetFile(t.snippetText)),
                i.register(t.snippets || [], t.scope),
                t.includeScopes &&
                  ((i.snippetMap[t.scope].includeScopes = t.includeScopes),
                  t.includeScopes.forEach(function (e) {
                    m("ace/mode/" + e);
                  })));
            }));
        },
        b = function (e) {
          var t = e.editor,
            n = t.completer && t.completer.activated;
          if ("backspace" === e.command.name)
            n && !a.getCompletionPrefix(t) && t.completer.detach();
          else if ("insertstring" === e.command.name && !n) {
            d = e;
            var i = e.editor.$liveAutocompletionDelay;
            i ? x.delay(i) : y(e);
          }
        },
        x = s.delayedCall(function () {
          y(d);
        }, 0),
        y = function (e) {
          var t = e.editor,
            n = a.getCompletionPrefix(t),
            i = a.triggerAutocomplete(t);
          if ((n || i) && n.length >= t.$liveAutocompletionThreshold) {
            var r = o.for(t);
            (r.autoShown = !0), r.showPopup(t);
          }
        },
        T = e("../editor").Editor;
      e("../config").defineOptions(T.prototype, "editor", {
        enableBasicAutocompletion: {
          set: function (e) {
            e
              ? (this.completers ||
                  (this.completers = Array.isArray(e) ? e : u),
                this.commands.addCommand(o.startCommand))
              : this.commands.removeCommand(o.startCommand);
          },
          value: !1,
        },
        enableLiveAutocompletion: {
          set: function (e) {
            e
              ? (this.completers ||
                  (this.completers = Array.isArray(e) ? e : u),
                this.commands.on("afterExec", b))
              : this.commands.off("afterExec", b);
          },
          value: !1,
        },
        liveAutocompletionDelay: { initialValue: 0 },
        liveAutocompletionThreshold: { initialValue: 0 },
        enableSnippets: {
          set: function (e) {
            e
              ? (this.commands.addCommand(f),
                this.on("changeMode", g),
                g(0, this))
              : (this.commands.removeCommand(f), this.off("changeMode", g));
          },
          value: !1,
        },
      });
    }
  ),
  ace.require(["ace/ext/language_tools"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
