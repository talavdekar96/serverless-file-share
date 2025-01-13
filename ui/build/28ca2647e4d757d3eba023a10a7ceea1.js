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
  function (e, t, i) {
    "use strict";
    var o = e("./lib/dom"),
      n = e("./lib/oop"),
      r = e("./lib/event_emitter").EventEmitter,
      s = e("./lib/lang"),
      a = e("./range").Range,
      c = e("./range_list").RangeList,
      l = e("./keyboard/hash_handler").HashHandler,
      p = e("./tokenizer").Tokenizer,
      h = e("./clipboard"),
      d = {
        CURRENT_WORD: function (e) {
          return e.session.getTextRange(e.session.getWordRange());
        },
        SELECTION: function (e, t, i) {
          var o = e.session.getTextRange();
          return i ? o.replace(/\n\r?([ \t]*\S)/g, "\n" + i + "$1") : o;
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
        CURRENT_YEAR: u.bind(null, { year: "numeric" }),
        CURRENT_YEAR_SHORT: u.bind(null, { year: "2-digit" }),
        CURRENT_MONTH: u.bind(null, { month: "numeric" }),
        CURRENT_MONTH_NAME: u.bind(null, { month: "long" }),
        CURRENT_MONTH_NAME_SHORT: u.bind(null, { month: "short" }),
        CURRENT_DATE: u.bind(null, { day: "2-digit" }),
        CURRENT_DAY_NAME: u.bind(null, { weekday: "long" }),
        CURRENT_DAY_NAME_SHORT: u.bind(null, { weekday: "short" }),
        CURRENT_HOUR: u.bind(null, { hour: "2-digit", hour12: !1 }),
        CURRENT_MINUTE: u.bind(null, { minute: "2-digit" }),
        CURRENT_SECOND: u.bind(null, { second: "2-digit" }),
      };
    function u(e) {
      var t = new Date().toLocaleString("en-us", e);
      return 1 == t.length ? "0" + t : t;
    }
    d.SELECTED_TEXT = d.SELECTION;
    var m = (function () {
      function e() {
        (this.snippetMap = {}),
          (this.snippetNameMap = {}),
          (this.variables = d);
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
          function i(e) {
            return "(?:[^\\\\" + e + "]|\\\\.)";
          }
          var o = {
            regex: "/(" + i("/") + "+)/",
            onMatch: function (e, t, i) {
              var o = i[0];
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
                  onMatch: function (e, t, i) {
                    var o = e[1];
                    return (
                      (("}" == o && i.length) || -1 != "`$\\".indexOf(o)) &&
                        (e = o),
                      [e]
                    );
                  },
                },
                {
                  regex: /}/,
                  onMatch: function (e, t, i) {
                    return [i.length ? i.shift() : e];
                  },
                },
                { regex: /\$(?:\d+|\w+)/, onMatch: t },
                {
                  regex: /\$\{[\dA-Z_a-z]+/,
                  onMatch: function (e, i, o) {
                    var n = t(e.substr(1));
                    return o.unshift(n[0]), n;
                  },
                  next: "snippetVar",
                },
                { regex: /\n/, token: "newline", merge: !1 },
              ],
              snippetVar: [
                {
                  regex: "\\|" + i("\\|") + "*\\|",
                  onMatch: function (e, t, i) {
                    var o = e
                      .slice(1, -1)
                      .replace(/\\[,|\\]|,/g, function (e) {
                        return 2 == e.length ? e[1] : "\0";
                      })
                      .split("\0")
                      .map(function (e) {
                        return { value: e };
                      });
                    return (i[0].choices = o), [o[0]];
                  },
                  next: "start",
                },
                o,
                { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" },
              ],
              formatString: [
                {
                  regex: /:/,
                  onMatch: function (e, t, i) {
                    return i.length && i[0].expectElse
                      ? ((i[0].expectElse = !1),
                        (i[0].ifEnd = { elseEnd: i[0] }),
                        [i[0].ifEnd])
                      : ":";
                  },
                },
                {
                  regex: /\\./,
                  onMatch: function (e, t, i) {
                    var o = e[1];
                    return (
                      ("}" == o && i.length) || -1 != "`$\\".indexOf(o)
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
                  onMatch: function (e, t, i) {
                    var o = i.shift();
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
                  onMatch: function (e, t, i) {
                    return [{ text: e.slice(1) }];
                  },
                },
                {
                  regex: /\${\w+/,
                  onMatch: function (e, t, i) {
                    var o = { text: e.slice(2) };
                    return i.unshift(o), [o];
                  },
                  next: "formatStringVar",
                },
                { regex: /\n/, token: "newline", merge: !1 },
                {
                  regex: /}/,
                  onMatch: function (e, t, i) {
                    var o = i.shift();
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
                  onMatch: function (e, t, i) {
                    return (i[0].formatFunction = e.slice(2, -1)), [i.shift()];
                  },
                  next: "formatString",
                },
                o,
                {
                  regex: /:[\?\-+]?/,
                  onMatch: function (e, t, i) {
                    "+" == e[1] && (i[0].ifEnd = i[0]),
                      "?" == e[1] && (i[0].expectElse = !0);
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
        (e.prototype.getVariableValue = function (e, t, i) {
          if (/^\d+$/.test(t)) return (this.variables.__ || {})[t] || "";
          if (/^[A-Z]\d+$/.test(t))
            return (this.variables[t[0] + "__"] || {})[t.substr(1)] || "";
          if (((t = t.replace(/^TM_/, "")), !this.variables.hasOwnProperty(t)))
            return "";
          var o = this.variables[t];
          return (
            "function" == typeof o && (o = this.variables[t](e, t, i)),
            null == o ? "" : o
          );
        }),
        (e.prototype.tmStrFormat = function (e, t, i) {
          if (!t.fmt) return e;
          var o = t.flag || "",
            n = t.guard;
          n = new RegExp(n, o.replace(/[^gim]/g, ""));
          var r =
              "string" == typeof t.fmt
                ? this.tokenizeTmSnippet(t.fmt, "formatString")
                : t.fmt,
            s = this,
            a = e.replace(n, function () {
              var e = s.variables.__;
              s.variables.__ = [].slice.call(arguments);
              for (
                var t = s.resolveVariables(r, i), o = "E", n = 0;
                n < t.length;
                n++
              ) {
                var a = t[n];
                if ("object" == typeof a)
                  if (((t[n] = ""), a.changeCase && a.local)) {
                    var c = t[n + 1];
                    c &&
                      "string" == typeof c &&
                      ("u" == a.changeCase
                        ? (t[n] = c[0].toUpperCase())
                        : (t[n] = c[0].toLowerCase()),
                      (t[n + 1] = c.substr(1)));
                  } else a.changeCase && (o = a.changeCase);
                else
                  "U" == o
                    ? (t[n] = a.toUpperCase())
                    : "L" == o && (t[n] = a.toLowerCase());
              }
              return (s.variables.__ = e), t.join("");
            });
          return a;
        }),
        (e.prototype.tmFormatFunction = function (e, t, i) {
          return "upcase" == t.formatFunction
            ? e.toUpperCase()
            : "downcase" == t.formatFunction
            ? e.toLowerCase()
            : e;
        }),
        (e.prototype.resolveVariables = function (e, t) {
          for (var i = [], o = "", n = !0, r = 0; r < e.length; r++) {
            var s = e[r];
            if ("string" != typeof s) {
              if (s) {
                if (((n = !1), s.fmtString)) {
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
                      ? (i.push(c), l(s))
                      : !c && s.ifEnd && l(s.ifEnd);
                } else
                  s.elseEnd
                    ? l(s.elseEnd)
                    : (null != s.tabstopId || null != s.changeCase) &&
                      i.push(s);
              }
            } else
              i.push(s),
                "\n" == s
                  ? ((n = !0), (o = ""))
                  : n && ((o = /^\t*/.exec(s)[0]), (n = /\S/.test(s)));
          }
          function l(t) {
            var i = e.indexOf(t, r + 1);
            -1 != i && (r = i);
          }
          return i;
        }),
        (e.prototype.getDisplayTextForSnippet = function (e, t) {
          return g.call(this, e, t).text;
        }),
        (e.prototype.insertSnippetForSelection = function (e, t, i) {
          void 0 === i && (i = {});
          var o = g.call(this, e, t, i),
            n = e.getSelectionRange();
          i.range && 0 === i.range.compareRange(n) && (n = i.range);
          var r = e.session.replace(n, o.text),
            s = new f(e),
            a = e.inVirtualSelectionMode && e.selection.index;
          s.addTabstops(o.tabstops, n.start, r, a);
        }),
        (e.prototype.insertSnippet = function (e, t, i) {
          void 0 === i && (i = {});
          var o = this;
          if (
            (!i.range ||
              i.range instanceof a ||
              (i.range = a.fromPoints(i.range.start, i.range.end)),
            e.inVirtualSelectionMode)
          )
            return o.insertSnippetForSelection(e, t, i);
          e.forEachSelection(
            function () {
              o.insertSnippetForSelection(e, t, i);
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
            var i = e.getCursorPosition(),
              o = e.session.getState(i.row);
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
            i = [t],
            o = this.snippetMap;
          return (
            o[t] && o[t].includeScopes && i.push.apply(i, o[t].includeScopes),
            i.push("_"),
            i
          );
        }),
        (e.prototype.expandWithTab = function (e, t) {
          var i = this,
            o = e.forEachSelection(
              function () {
                return i.expandSnippetForSelection(e, t);
              },
              null,
              { keepOrder: !0 }
            );
          return o && e.tabstopManager && e.tabstopManager.tabNext(), o;
        }),
        (e.prototype.expandSnippetForSelection = function (e, t) {
          var i,
            o = e.getCursorPosition(),
            n = e.session.getLine(o.row),
            r = n.substring(0, o.column),
            s = n.substr(o.column),
            a = this.snippetMap;
          return (
            this.getActiveScopes(e).some(function (e) {
              var t = a[e];
              return t && (i = this.findMatchingSnippet(t, r, s)), !!i;
            }, this),
            !!i &&
              ((t && t.dryRun) ||
                (e.session.doc.removeInLine(
                  o.row,
                  o.column - i.replaceBefore.length,
                  o.column + i.replaceAfter.length
                ),
                (this.variables.M__ = i.matchBefore),
                (this.variables.T__ = i.matchAfter),
                this.insertSnippetForSelection(e, i.content),
                (this.variables.M__ = this.variables.T__ = null)),
              !0)
          );
        }),
        (e.prototype.findMatchingSnippet = function (e, t, i) {
          for (var o = e.length; o--; ) {
            var n = e[o];
            if (
              (!n.startRe || n.startRe.test(t)) &&
              (!n.endRe || n.endRe.test(i)) &&
              (n.startRe || n.endRe)
            )
              return (
                (n.matchBefore = n.startRe ? n.startRe.exec(t) : [""]),
                (n.matchAfter = n.endRe ? n.endRe.exec(i) : [""]),
                (n.replaceBefore = n.triggerRe ? n.triggerRe.exec(t)[0] : ""),
                (n.replaceAfter = n.endTriggerRe
                  ? n.endTriggerRe.exec(i)[0]
                  : ""),
                n
              );
          }
        }),
        (e.prototype.register = function (e, t) {
          var i = this.snippetMap,
            o = this.snippetNameMap,
            n = this;
          function r(e) {
            return (
              e && !/^\^?\(.*\)\$?$|^\\b$/.test(e) && (e = "(?:" + e + ")"),
              e || ""
            );
          }
          function a(e, t, i) {
            return (
              (e = r(e)),
              (t = r(t)),
              i
                ? (e = t + e) && "$" != e[e.length - 1] && (e += "$")
                : (e += t) && "^" != e[0] && (e = "^" + e),
              new RegExp(e)
            );
          }
          function c(e) {
            e.scope || (e.scope = t || "_"),
              (t = e.scope),
              i[t] || ((i[t] = []), (o[t] = {}));
            var r = o[t];
            if (e.name) {
              var c = r[e.name];
              c && n.unregister(c), (r[e.name] = e);
            }
            i[t].push(e),
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
          var i = this.snippetMap,
            o = this.snippetNameMap;
          function n(e) {
            var n = o[e.scope || t];
            if (n && n[e.name]) {
              delete n[e.name];
              var r = i[e.scope || t],
                s = r && r.indexOf(e);
              s >= 0 && r.splice(s, 1);
            }
          }
          e.content ? n(e) : Array.isArray(e) && e.forEach(n);
        }),
        (e.prototype.parseSnippetFile = function (e) {
          e = e.replace(/\r/g, "");
          for (
            var t,
              i = [],
              o = {},
              n = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
            (t = n.exec(e));

          ) {
            if (t[1])
              try {
                (o = JSON.parse(t[1])), i.push(o);
              } catch (c) {}
            if (t[4])
              (o.content = t[4].replace(/^\t/gm, "")), i.push(o), (o = {});
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
          return i;
        }),
        (e.prototype.getSnippetByName = function (e, t) {
          var i,
            o = this.snippetNameMap;
          return (
            this.getActiveScopes(t).some(function (t) {
              var n = o[t];
              return n && (i = n[e]), !!i;
            }, this),
            i
          );
        }),
        e
      );
    })();
    n.implement(m.prototype, r);
    var g = function (e, t, i) {
        void 0 === i && (i = {});
        var o = e.getCursorPosition(),
          n = e.session.getLine(o.row),
          r = e.session.getTabString(),
          s = n.match(/^\s*/)[0];
        o.column < s.length && (s = s.slice(0, o.column)),
          (t = t.replace(/\r/g, ""));
        var a = this.tokenizeTmSnippet(t);
        a = (a = this.resolveVariables(a, e)).map(function (e) {
          return "\n" != e || i.excludeExtraIndent
            ? "string" == typeof e
              ? e.replace(/\t/g, r)
              : e
            : e + s;
        });
        var c = [];
        a.forEach(function (e, t) {
          if ("object" == typeof e) {
            var i = e.tabstopId,
              o = c[i];
            if (
              (o ||
                (((o = c[i] = []).index = i), (o.value = ""), (o.parents = {})),
              -1 === o.indexOf(e))
            ) {
              e.choices && !o.choices && (o.choices = e.choices), o.push(e);
              var n = a.indexOf(e, t + 1);
              if (-1 !== n) {
                var r = a.slice(t + 1, n);
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
          for (var t = [], i = 0; i < e.length; i++) {
            var o = e[i];
            if ("object" == typeof o) {
              if (l[o.tabstopId]) continue;
              o = t[e.lastIndexOf(o, i - 1)] || { tabstopId: o.tabstopId };
            }
            t[i] = o;
          }
          return t;
        }
        for (var h = 0; h < a.length; h++) {
          var d = a[h];
          if ("object" == typeof d) {
            var u = d.tabstopId,
              m = c[u],
              g = a.indexOf(d, h + 1);
            if (l[u])
              l[u] === d &&
                (delete l[u],
                Object.keys(l).forEach(function (e) {
                  m.parents[e] = !0;
                }));
            else {
              l[u] = d;
              var f = m.value;
              "string" !== typeof f
                ? (f = p(f))
                : d.fmt && (f = this.tmStrFormat(f, d, e)),
                a.splice.apply(a, [h + 1, Math.max(0, g - h)].concat(f, d)),
                -1 === m.indexOf(d) && m.push(d);
            }
          }
        }
        var b = 0,
          v = 0,
          y = "";
        return (
          a.forEach(function (e) {
            if ("string" === typeof e) {
              var t = e.split("\n");
              t.length > 1
                ? ((v = t[t.length - 1].length), (b += t.length - 1))
                : (v += e.length),
                (y += e);
            } else e && (e.start ? (e.end = { row: b, column: v }) : (e.start = { row: b, column: v }));
          }),
          { text: y, tabstops: c, tokens: a }
        );
      },
      f = (function () {
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
                i = this.selectedTabstop || {},
                o = i.parents || {},
                n = this.tabstops.slice(),
                r = 0;
              r < n.length;
              r++
            ) {
              var s = n[r],
                a = s == i || o[s.index];
              if (
                ((s.rangeList.$bias = a ? 0 : 1),
                "remove" == e.action && s !== i)
              ) {
                var c = s.parents && s.parents[i.index],
                  l = s.rangeList.pointIndex(e.start, c);
                l = l < 0 ? -l - 1 : l + 1;
                var p = s.rangeList.pointIndex(e.end, c);
                p = p < 0 ? -p - 1 : p - 1;
                for (
                  var h = s.rangeList.ranges.slice(l, p), d = 0;
                  d < h.length;
                  d++
                )
                  this.removeRange(h[d]);
              }
              s.rangeList.$onChange(e);
            }
            var u = this.session;
            this.$inChange ||
              !t ||
              1 != u.getLength() ||
              u.getValue() ||
              this.detach();
          }),
          (e.prototype.updateLinkedFields = function () {
            var e = this.selectedTabstop;
            if (e && e.hasLinkedRanges && e.firstNonLinked) {
              this.$inChange = !0;
              for (
                var i = this.session,
                  o = i.getTextRange(e.firstNonLinked),
                  n = 0;
                n < e.length;
                n++
              ) {
                var r = e[n];
                if (r.linked) {
                  var s = r.original,
                    a = t.snippetManager.tmStrFormat(o, s, this.editor);
                  i.replace(r, a);
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
                  i = this.editor.selection.isEmpty(),
                  o = 0;
                o < this.ranges.length;
                o++
              )
                if (!this.ranges[o].linked) {
                  var n = this.ranges[o].contains(e.row, e.column),
                    r = i || this.ranges[o].contains(t.row, t.column);
                  if (n && r) return;
                }
              this.detach();
            }
          }),
          (e.prototype.onChangeSession = function () {
            this.detach();
          }),
          (e.prototype.tabNext = function (e) {
            var t = this.tabstops.length,
              i = this.index + (e || 1);
            (i = Math.min(Math.max(i, 1), t)) == t && (i = 0),
              this.selectTabstop(i),
              0 === i && this.detach();
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
              var i = t.firstNonLinked || t;
              if (
                (t.choices && (i.cursor = i.start),
                this.editor.inVirtualSelectionMode)
              )
                this.editor.selection.fromOrientedRange(i);
              else {
                var o = this.editor.multiSelect;
                o.toSingleRange(i);
                for (var n = 0; n < t.length; n++)
                  (t.hasLinkedRanges && t[n].linked) ||
                    o.addRange(t[n].clone(), !0);
              }
              this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler),
                this.selectedTabstop &&
                  this.selectedTabstop.choices &&
                  this.editor.execCommand("startAutocomplete", {
                    matches: this.selectedTabstop.choices,
                  });
            }
          }),
          (e.prototype.addTabstops = function (e, t, i) {
            var o = this.useLink || !this.editor.getOption("enableMultiselect");
            if ((this.$openTabstops || (this.$openTabstops = []), !e[0])) {
              var n = a.fromPoints(i, i);
              v(n.start, t), v(n.end, t), (e[0] = [n]), (e[0].index = 0);
            }
            var r = [this.index + 1, 0],
              s = this.ranges;
            e.forEach(function (e, i) {
              for (
                var n = this.$openTabstops[i] || e, l = 0;
                l < e.length;
                l++
              ) {
                var p = e[l],
                  h = a.fromPoints(p.start, p.end || p.start);
                b(h.start, t),
                  b(h.end, t),
                  (h.original = p),
                  (h.tabstop = n),
                  s.push(h),
                  n != e ? n.unshift(h) : (n[l] = h),
                  p.fmtString || (n.firstNonLinked && o)
                    ? ((h.linked = !0), (n.hasLinkedRanges = !0))
                    : n.firstNonLinked || (n.firstNonLinked = h);
              }
              n.firstNonLinked || (n.hasLinkedRanges = !1),
                n === e && (r.push(n), (this.$openTabstops[i] = n)),
                this.addTabstopMarkers(n),
                (n.rangeList = n.rangeList || new c()),
                (n.rangeList.$bias = 0),
                n.rangeList.addList(n);
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
    (f.prototype.keyboardHandler = new l()),
      f.prototype.keyboardHandler.bindKeys({
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
      (t.snippetManager = new m());
    var y = e("./editor").Editor;
    (function () {
      (this.insertSnippet = function (e, i) {
        return t.snippetManager.insertSnippet(this, e, i);
      }),
        (this.expandSnippet = function (e) {
          return t.snippetManager.expandWithTab(this, e);
        });
    }).call(y.prototype);
  }
),
  ace.define(
    "ace/autocomplete/inline",
    ["require", "exports", "module", "ace/snippets"],
    function (e, t, i) {
      "use strict";
      var o = e("../snippets").snippetManager,
        n = (function () {
          function e() {
            this.editor = null;
          }
          return (
            (e.prototype.show = function (e, t, i) {
              if (
                ((i = i || ""),
                e &&
                  this.editor &&
                  this.editor !== e &&
                  (this.hide(), (this.editor = null)),
                !e || !t)
              )
                return !1;
              var n = t.snippet
                ? o.getDisplayTextForSnippet(e, t.snippet)
                : t.value;
              return (
                !(!n || !n.startsWith(i)) &&
                ((this.editor = e),
                "" === (n = n.slice(i.length))
                  ? e.removeGhostText()
                  : e.setGhostText(n),
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
      t.AceInline = n;
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
    function (e, t, i) {
      "use strict";
      var o = e("../virtual_renderer").VirtualRenderer,
        n = e("../editor").Editor,
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
          var i = new n(t);
          return (
            i.setHighlightActiveLine(!1),
            i.setShowPrintMargin(!1),
            i.renderer.setShowGutter(!1),
            i.renderer.setHighlightGutterLine(!1),
            (i.$mouseHandler.$focusTimeout = 0),
            (i.$highlightTagPending = !0),
            i
          );
        },
        d = function (e) {
          var t = c.createElement("div"),
            i = new h(t);
          e && e.appendChild(t),
            (t.style.display = "none"),
            (i.renderer.content.style.cursor = "default"),
            i.renderer.setStyle("ace_autocomplete"),
            i.renderer.$textLayer.element.setAttribute("role", "listbox"),
            i.renderer.$textLayer.element.setAttribute(
              "aria-label",
              l("Autocomplete suggestions")
            ),
            i.renderer.textarea.setAttribute("aria-hidden", "true"),
            i.setOption("displayIndentGuides", !1),
            i.setOption("dragDelay", 150);
          var o,
            n = function () {};
          (i.focus = n),
            (i.$isFocused = !0),
            (i.renderer.$cursorLayer.restartTimer = n),
            (i.renderer.$cursorLayer.element.style.opacity = 0),
            (i.renderer.$maxLines = 8),
            (i.renderer.$keepTextAreaAtCursor = !1),
            i.setHighlightActiveLine(!1),
            i.session.highlight(""),
            (i.session.$searchHighlight.clazz = "ace_highlight-marker"),
            i.on("mousedown", function (e) {
              var t = e.getDocumentPosition();
              i.selection.moveToPosition(t),
                (u.start.row = u.end.row = t.row),
                e.stop();
            });
          var d = new r(-1, 0, -1, 1 / 0),
            u = new r(-1, 0, -1, 1 / 0);
          (u.id = i.session.addMarker(u, "ace_active-line", "fullLine")),
            (i.setSelectOnHover = function (e) {
              e
                ? d.id && (i.session.removeMarker(d.id), (d.id = null))
                : (d.id = i.session.addMarker(d, "ace_line-hover", "fullLine"));
            }),
            i.setSelectOnHover(!1),
            i.on("mousemove", function (e) {
              if (o) {
                if (o.x != e.x || o.y != e.y) {
                  (o = e).scrollTop = i.renderer.scrollTop;
                  var t = o.getDocumentPosition().row;
                  d.start.row != t && (d.id || i.setRow(t), g(t));
                }
              } else o = e;
            }),
            i.renderer.on("beforeRender", function () {
              if (o && -1 != d.start.row) {
                o.$pos = null;
                var e = o.getDocumentPosition().row;
                d.id || i.setRow(e), g(e, !0);
              }
            }),
            i.renderer.on("afterRender", function () {
              var e = i.getRow(),
                t = i.renderer.$textLayer,
                o = t.element.childNodes[e - t.config.firstRow],
                n = document.activeElement;
              if (
                (o !== t.selectedNode &&
                  t.selectedNode &&
                  (c.removeCssClass(t.selectedNode, "ace_selected"),
                  n.removeAttribute("aria-activedescendant"),
                  t.selectedNode.removeAttribute("id")),
                (t.selectedNode = o),
                o)
              ) {
                c.addCssClass(o, "ace_selected");
                var r = p(e);
                (o.id = r),
                  t.element.setAttribute("aria-activedescendant", r),
                  n.setAttribute("aria-activedescendant", r),
                  o.setAttribute("role", "option"),
                  o.setAttribute("aria-label", i.getData(e).value),
                  o.setAttribute("aria-setsize", i.data.length),
                  o.setAttribute("aria-posinset", e + 1),
                  o.setAttribute("aria-describedby", "doc-tooltip");
              }
            });
          var m = function () {
              g(-1);
            },
            g = function (e, t) {
              e !== d.start.row &&
                ((d.start.row = d.end.row = e),
                t || i.session._emit("changeBackMarker"),
                i._emit("changeHoverMarker"));
            };
          (i.getHoveredRow = function () {
            return d.start.row;
          }),
            s.addListener(i.container, "mouseout", m),
            i.on("hide", m),
            i.on("changeSelection", m),
            (i.session.doc.getLength = function () {
              return i.data.length;
            }),
            (i.session.doc.getLine = function (e) {
              var t = i.data[e];
              return "string" == typeof t ? t : (t && t.value) || "";
            });
          var f = i.session.bgTokenizer;
          return (
            (f.$tokenizeRow = function (e) {
              var t = i.data[e],
                o = [];
              if (!t) return o;
              "string" == typeof t && (t = { value: t });
              var n = t.caption || t.value || t.name;
              function r(e, i) {
                e &&
                  o.push({ type: (t.className || "") + (i || ""), value: e });
              }
              for (
                var s = n.toLowerCase(),
                  a = (i.filterText || "").toLowerCase(),
                  c = 0,
                  l = 0,
                  p = 0;
                p <= a.length;
                p++
              )
                if (p != l && (t.matchMask & (1 << p) || p == a.length)) {
                  var h = a.slice(l, p);
                  l = p;
                  var d = s.indexOf(h, c);
                  if (-1 == d) continue;
                  r(n.slice(c, d), ""),
                    (c = d + h.length),
                    r(n.slice(d, c), "completion-highlight");
                }
              return (
                r(n.slice(c, n.length), ""),
                o.push({ type: "completion-spacer", value: " " }),
                t.meta && o.push({ type: "completion-meta", value: t.meta }),
                t.message &&
                  o.push({ type: "completion-message", value: t.message }),
                o
              );
            }),
            (f.$updateOnChange = n),
            (f.start = n),
            (i.session.$computeWidth = function () {
              return (this.screenWidth = 0);
            }),
            (i.isOpen = !1),
            (i.isTopdown = !1),
            (i.autoSelect = !0),
            (i.filterText = ""),
            (i.data = []),
            (i.setData = function (e, t) {
              (i.filterText = t || ""),
                i.setValue(a.stringRepeat("\n", e.length), -1),
                (i.data = e || []),
                i.setRow(0);
            }),
            (i.getData = function (e) {
              return i.data[e];
            }),
            (i.getRow = function () {
              return u.start.row;
            }),
            (i.setRow = function (e) {
              (e = Math.max(
                this.autoSelect ? 0 : -1,
                Math.min(this.data.length - 1, e)
              )),
                u.start.row != e &&
                  (i.selection.clearSelection(),
                  (u.start.row = u.end.row = e || 0),
                  i.session._emit("changeBackMarker"),
                  i.moveCursorTo(e || 0, 0),
                  i.isOpen && i._signal("select"));
            }),
            i.on("changeSelection", function () {
              i.isOpen && i.setRow(i.selection.lead.row),
                i.renderer.scrollCursorIntoView();
            }),
            (i.hide = function () {
              (this.container.style.display = "none"),
                (i.anchorPos = null),
                (i.anchor = null),
                i.isOpen && ((i.isOpen = !1), this._signal("hide"));
            }),
            (i.tryShow = function (e, t, n, r) {
              if (
                !r &&
                i.isOpen &&
                i.anchorPos &&
                i.anchor &&
                i.anchorPos.top === e.top &&
                i.anchorPos.left === e.left &&
                i.anchor === n
              )
                return !0;
              var s = this.container,
                a = window.innerHeight,
                c = window.innerWidth,
                l = this.renderer,
                p = l.$maxLines * t * 1.4,
                h = { top: 0, bottom: 0, left: 0 },
                d = a - e.top - 3 * this.$borderSize - t,
                u = e.top - 3 * this.$borderSize;
              n || (n = u <= d || d >= p ? "bottom" : "top"),
                "top" === n
                  ? ((h.bottom = e.top - this.$borderSize),
                    (h.top = h.bottom - p))
                  : "bottom" === n &&
                    ((h.top = e.top + t + this.$borderSize),
                    (h.bottom = h.top + p));
              var m = h.top >= 0 && h.bottom <= a;
              if (!r && !m) return !1;
              (l.$maxPixelHeight = m ? null : "top" === n ? u : d),
                "top" === n
                  ? ((s.style.top = ""),
                    (s.style.bottom = a - h.bottom + "px"),
                    (i.isTopdown = !1))
                  : ((s.style.top = h.top + "px"),
                    (s.style.bottom = ""),
                    (i.isTopdown = !0)),
                (s.style.display = "");
              var g = e.left;
              return (
                g + s.offsetWidth > c && (g = c - s.offsetWidth),
                (s.style.left = g + "px"),
                (s.style.right = ""),
                i.isOpen || ((i.isOpen = !0), this._signal("show"), (o = null)),
                (i.anchorPos = e),
                (i.anchor = n),
                !0
              );
            }),
            (i.show = function (e, t, i) {
              this.tryShow(e, t, i ? "bottom" : void 0, !0);
            }),
            (i.goTo = function (e) {
              var t = this.getRow(),
                i = this.session.getLength() - 1;
              switch (e) {
                case "up":
                  t = t <= 0 ? i : t - 1;
                  break;
                case "down":
                  t = t >= i ? -1 : t + 1;
                  break;
                case "start":
                  t = 0;
                  break;
                case "end":
                  t = i;
              }
              this.setRow(t);
            }),
            (i.getTextLeftOffset = function () {
              return (
                this.$borderSize + this.renderer.$padding + this.$imageSize
              );
            }),
            (i.$imageSize = 0),
            (i.$borderSize = 1),
            i
          );
        };
      c.importCssString(
        "\n.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #CAD6FA;\n    z-index: 1;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #3a674e;\n}\n.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid #abbffe;\n    margin-top: -1px;\n    background: rgba(233,233,253,0.4);\n    position: absolute;\n    z-index: 2;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid rgba(109, 150, 13, 0.8);\n    background: rgba(58, 103, 78, 0.62);\n}\n.ace_completion-meta {\n    opacity: 0.5;\n    margin-left: 0.9em;\n}\n.ace_completion-message {\n    color: blue;\n}\n.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #2d69c7;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #93ca12;\n}\n.ace_editor.ace_autocomplete {\n    width: 300px;\n    z-index: 200000;\n    border: 1px lightgray solid;\n    position: fixed;\n    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\n    line-height: 1.4;\n    background: #fefefe;\n    color: #111;\n}\n.ace_dark.ace_editor.ace_autocomplete {\n    border: 1px #484747 solid;\n    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);\n    line-height: 1.4;\n    background: #25282c;\n    color: #c1c1c1;\n}\n.ace_autocomplete .ace_text-layer  {\n    width: calc(100% - 8px);\n}\n.ace_autocomplete .ace_line {\n    display: flex;\n    align-items: center;\n}\n.ace_autocomplete .ace_line > * {\n    min-width: 0;\n    flex: 0 0 auto;\n}\n.ace_autocomplete .ace_line .ace_ {\n    flex: 0 1 auto;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n.ace_autocomplete .ace_completion-spacer {\n    flex: 1;\n}\n",
        "autocompletion.css",
        !1
      ),
        (t.AcePopup = d),
        (t.$singleLineEditor = h),
        (t.getAriaId = p);
    }
  ),
  ace.define(
    "ace/autocomplete/util",
    ["require", "exports", "module"],
    function (e, t, i) {
      "use strict";
      t.parForEach = function (e, t, i) {
        var o = 0,
          n = e.length;
        0 === n && i();
        for (var r = 0; r < n; r++)
          t(e[r], function (e, t) {
            ++o === n && i(e, t);
          });
      };
      var o = /[a-zA-Z_0-9\$\-\u00A2-\u2000\u2070-\uFFFF]/;
      (t.retrievePrecedingIdentifier = function (e, t, i) {
        i = i || o;
        for (var n = [], r = t - 1; r >= 0 && i.test(e[r]); r--) n.push(e[r]);
        return n.reverse().join("");
      }),
        (t.retrieveFollowingIdentifier = function (e, t, i) {
          i = i || o;
          for (var n = [], r = t; r < e.length && i.test(e[r]); r++)
            n.push(e[r]);
          return n;
        }),
        (t.getCompletionPrefix = function (e) {
          var t,
            i = e.getCursorPosition(),
            o = e.session.getLine(i.row);
          return (
            e.completers.forEach(
              function (e) {
                e.identifierRegexps &&
                  e.identifierRegexps.forEach(
                    function (e) {
                      !t &&
                        e &&
                        (t = this.retrievePrecedingIdentifier(o, i.column, e));
                    }.bind(this)
                  );
              }.bind(this)
            ),
            t || this.retrievePrecedingIdentifier(o, i.column)
          );
        }),
        (t.triggerAutocomplete = function (e) {
          var t = e.getCursorPosition(),
            i = e.session.getLine(t.row)[0 === t.column ? 0 : t.column - 1];
          return e.completers.some(function (e) {
            if (e.triggerCharacters && Array.isArray(e.triggerCharacters))
              return e.triggerCharacters.includes(i);
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
    function (e, t, i) {
      "use strict";
      var o = e("./keyboard/hash_handler").HashHandler,
        n = e("./autocomplete/popup").AcePopup,
        r = e("./autocomplete/inline").AceInline,
        s = e("./autocomplete/popup").getAriaId,
        a = e("./autocomplete/util"),
        c = e("./lib/lang"),
        l = e("./lib/dom"),
        p = e("./snippets").snippetManager,
        h = e("./config"),
        d = function (e, t) {
          t.completer && t.completer.destroy();
        },
        u = (function () {
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
                (this.popup = new n(
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
                  i = a.getCompletionPrefix(this.editor);
                this.inlineRenderer.show(this.editor, t, i) ||
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
                i = t.layerConfig.lineHeight,
                o = t.$cursorLayer.getPixelPosition(this.base, !0);
              o.left -= this.popup.getTextLeftOffset();
              var n = e.container.getBoundingClientRect();
              (o.top += n.top - t.layerConfig.offset),
                (o.left += n.left - e.renderer.scrollLeft),
                (o.left += t.gutterWidth);
              var r = { top: o.top, left: o.left };
              t.$ghostText &&
                t.$ghostTextWidget &&
                this.base.row === t.$ghostText.position.row &&
                (r.top += t.$ghostTextWidget.el.offsetHeight),
                this.popup.tryShow(r, i, "bottom") ||
                  this.popup.tryShow(o, i, "top") ||
                  this.popup.show(o, i);
            }),
            (e.prototype.openPopup = function (e, t, i) {
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
                i
                  ? i && !t && this.detach()
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
                i = this.editor.textInput.getElement(),
                o =
                  e.relatedTarget &&
                  this.tooltipNode &&
                  this.tooltipNode.contains(e.relatedTarget),
                n = this.popup && this.popup.container;
              t == i ||
                t.parentNode == n ||
                o ||
                t == this.tooltipNode ||
                e.relatedTarget == i ||
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
              var i = this.completions,
                o = this.getCompletionProvider().insertMatch(
                  this.editor,
                  e,
                  i.filterText,
                  t
                );
              return this.completions == i && this.detach(), o;
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
                this.completionProvider || (this.completionProvider = new m()),
                this.completionProvider
              );
            }),
            (e.prototype.gatherCompletions = function (e, t) {
              return this.getCompletionProvider().gatherCompletions(e, t);
            }),
            (e.prototype.updateCompletions = function (e, t) {
              if (e && this.base && this.completions) {
                var i = this.editor.getCursorPosition();
                if (
                  (n = this.editor.session.getTextRange({
                    start: this.base,
                    end: i,
                  })) == this.completions.filterText
                )
                  return;
                return (
                  this.completions.setFilter(n),
                  this.completions.filtered.length
                    ? 1 != this.completions.filtered.length ||
                      this.completions.filtered[0].value != n ||
                      this.completions.filtered[0].snippet
                      ? void this.openPopup(this.editor, n, e)
                      : this.detach()
                    : this.detach()
                );
              }
              if (t && t.matches) {
                i = this.editor.getSelectionRange().start;
                return (
                  (this.base = this.editor.session.doc.createAnchor(
                    i.row,
                    i.column
                  )),
                  (this.base.$insertRight = !0),
                  (this.completions = new g(t.matches)),
                  this.openPopup(this.editor, "", e)
                );
              }
              var o = this.editor.getSession(),
                n =
                  ((i = this.editor.getCursorPosition()),
                  a.getCompletionPrefix(this.editor));
              (this.base = o.doc.createAnchor(i.row, i.column - n.length)),
                (this.base.$insertRight = !0);
              var r = { exactMatch: this.exactMatch };
              this.getCompletionProvider().provideCompletions(
                this.editor,
                r,
                function (t, i, o) {
                  var n = i.filtered,
                    r = a.getCompletionPrefix(this.editor);
                  if (o) {
                    if (!n.length) {
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
                    if (1 == n.length && n[0].value == r && !n[0].snippet)
                      return this.detach();
                    if (this.autoInsert && !this.autoShown && 1 == n.length)
                      return this.insertMatch(n[0]);
                  }
                  (this.completions = i), this.openPopup(this.editor, r, e);
                }.bind(this)
              );
            }),
            (e.prototype.cancelContextMenu = function () {
              this.editor.$mouseHandler.cancelContextMenu();
            }),
            (e.prototype.updateDocTooltip = function () {
              var e = this.popup,
                t = e.data,
                i = t && (t[e.getHoveredRow()] || t[e.getRow()]),
                o = null;
              if (!i || !this.editor || !this.popup.isOpen)
                return this.hideDocTooltip();
              for (var n = this.editor.completers.length, r = 0; r < n; r++) {
                var s = this.editor.completers[r];
                if (s.getDocTooltip && i.completerId === s.id) {
                  o = s.getDocTooltip(i);
                  break;
                }
              }
              if (
                (o || "string" == typeof i || (o = i),
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
              var i = this.tooltipNode;
              e.docHTML
                ? (i.innerHTML = e.docHTML)
                : e.docText && (i.textContent = e.docText),
                i.parentNode ||
                  this.popup.container.appendChild(this.tooltipNode);
              var o = this.popup,
                n = o.container.getBoundingClientRect();
              (i.style.top = o.container.style.top),
                (i.style.bottom = o.container.style.bottom),
                (i.style.display = "block"),
                window.innerWidth - n.right < 320
                  ? n.left < 320
                    ? o.isTopdown
                      ? ((i.style.top = n.bottom + "px"),
                        (i.style.left = n.left + "px"),
                        (i.style.right = ""),
                        (i.style.bottom = ""))
                      : ((i.style.top =
                          o.container.offsetTop - i.offsetHeight + "px"),
                        (i.style.left = n.left + "px"),
                        (i.style.right = ""),
                        (i.style.bottom = ""))
                    : ((i.style.right = window.innerWidth - n.left + "px"),
                      (i.style.left = ""))
                  : ((i.style.left = n.right + 1 + "px"), (i.style.right = ""));
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
                (this.editor.off("destroy", d), (this.editor.completer = null)),
                (this.inlineRenderer = this.popup = this.editor = null);
            }),
            e
          );
        })();
      (u.prototype.commands = {
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
        (u.for = function (e) {
          return (
            e.completer instanceof u ||
              (e.completer && (e.completer.destroy(), (e.completer = null)),
              h.get("sharedPopups")
                ? (u.$sharedInstance || (u.$sharedInstance = new u()),
                  (e.completer = u.$sharedInstance))
                : ((e.completer = new u()), e.once("destroy", d))),
            e.completer
          );
        }),
        (u.startCommand = {
          name: "startAutocomplete",
          exec: function (e, t) {
            var i = u.for(e);
            (i.autoInsert = !1),
              (i.autoSelect = !0),
              (i.autoShown = !1),
              i.showPopup(e, t),
              i.cancelContextMenu();
          },
          bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space",
        });
      var m = (function () {
          function e() {
            this.active = !0;
          }
          return (
            (e.prototype.insertByIndex = function (e, t, i) {
              return (
                !(!this.completions || !this.completions.filtered) &&
                this.insertMatch(e, this.completions.filtered[t], i)
              );
            }),
            (e.prototype.insertMatch = function (e, t, i) {
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
                  for (var n, r = 0; (n = o[r]); r++)
                    (n.start.column -= this.completions.filterText.length),
                      e.session.remove(n);
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
              var i = t.value || t;
              if (t.range) {
                if (e.inVirtualSelectionMode)
                  return e.session.replace(t.range, i);
                e.forEachSelection(
                  function () {
                    var o = e.getSelectionRange();
                    0 === t.range.compareRange(o)
                      ? e.session.replace(t.range, i)
                      : e.insert(i);
                  },
                  null,
                  { keepOrder: !0 }
                );
              } else e.execCommand("insertstring", i);
            }),
            (e.prototype.gatherCompletions = function (e, t) {
              var i = e.getSession(),
                o = e.getCursorPosition(),
                n = a.getCompletionPrefix(e),
                r = [];
              this.completers = e.completers;
              var s = e.completers.length;
              return (
                e.completers.forEach(function (c, l) {
                  c.getCompletions(e, i, o, n, function (i, o) {
                    !i && o && (r = r.concat(o)),
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
            (e.prototype.provideCompletions = function (e, t, i) {
              var o = function (e) {
                  var o = e.prefix,
                    n = e.matches;
                  (this.completions = new g(n)),
                    t.exactMatch && (this.completions.exactMatch = !0),
                    t.ignoreCaption && (this.completions.ignoreCaption = !0),
                    this.completions.setFilter(o),
                    (e.finished || this.completions.filtered.length) &&
                      i(null, this.completions, e.finished);
                }.bind(this),
                n = !0,
                r = null;
              if (
                (this.gatherCompletions(
                  e,
                  function (e, t) {
                    this.active &&
                      (e && (i(e, [], !0), this.detach()),
                      0 === t.prefix.indexOf(t.prefix) && (n ? (r = t) : o(t)));
                  }.bind(this)
                ),
                (n = !1),
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
              var i = null;
              (t = t.filter(function (e) {
                var t = e.snippet || e.caption || e.value;
                return t !== i && ((i = t), !0);
              })),
                (this.filtered = t);
            }),
            (e.prototype.filterCompletions = function (e, t) {
              var i = [],
                o = t.toUpperCase(),
                n = t.toLowerCase();
              e: for (var r, s = 0; (r = e[s]); s++) {
                var a =
                  (!this.ignoreCaption && r.caption) || r.value || r.snippet;
                if (a) {
                  var c,
                    l,
                    p = -1,
                    h = 0,
                    d = 0;
                  if (this.exactMatch) {
                    if (t !== a.substr(0, t.length)) continue e;
                  } else {
                    var u = a.toLowerCase().indexOf(n);
                    if (u > -1) d = u;
                    else
                      for (var m = 0; m < t.length; m++) {
                        var g = a.indexOf(n[m], p + 1),
                          f = a.indexOf(o[m], p + 1);
                        if ((c = g >= 0 && (f < 0 || g < f) ? g : f) < 0)
                          continue e;
                        (l = c - p - 1) > 0 &&
                          (-1 === p && (d += 10), (d += l), (h |= 1 << m)),
                          (p = c);
                      }
                  }
                  (r.matchMask = h),
                    (r.exactMatch = d ? 0 : 1),
                    (r.$score = (r.score || 0) - d),
                    i.push(r);
                }
              }
              return i;
            }),
            e
          );
        })();
      (t.Autocomplete = u), (t.CompletionProvider = m), (t.FilteredList = g);
    }
  ),
  ace.define(
    "ace/ext/command_bar",
    [
      "require",
      "exports",
      "module",
      "ace/tooltip",
      "ace/lib/event_emitter",
      "ace/lib/lang",
      "ace/lib/dom",
      "ace/lib/oop",
      "ace/lib/useragent",
    ],
    function (e, t, i) {
      var o =
          (this && this.__values) ||
          function (e) {
            var t = "function" === typeof Symbol && Symbol.iterator,
              i = t && e[t],
              o = 0;
            if (i) return i.call(e);
            if (e && "number" === typeof e.length)
              return {
                next: function () {
                  return (
                    e && o >= e.length && (e = void 0),
                    { value: e && e[o++], done: !e }
                  );
                },
              };
            throw new TypeError(
              t ? "Object is not iterable." : "Symbol.iterator is not defined."
            );
          },
        n = e("../tooltip").Tooltip,
        r = e("../lib/event_emitter").EventEmitter,
        s = e("../lib/lang"),
        a = e("../lib/dom"),
        c = e("../lib/oop"),
        l = e("../lib/useragent"),
        p = "command_bar_tooltip_button",
        h = "command_bar_button_value",
        d = "command_bar_button_caption",
        u = "command_bar_keybinding",
        m = "command_bar_tooltip",
        g = "MoreOptionsButton",
        f = function (e, t) {
          return t.row > e.row || (t.row === e.row && t.column > e.column)
            ? e
            : t;
        },
        b = {
          Ctrl: { mac: "^" },
          Option: { mac: "\u2325" },
          Command: { mac: "\u2318" },
          Cmd: { mac: "\u2318" },
          Shift: "\u21e7",
          Left: "\u2190",
          Right: "\u2192",
          Up: "\u2191",
          Down: "\u2193",
        },
        v = (function () {
          function e(e, t) {
            var i, r;
            (t = t || {}),
              (this.parentNode = e),
              (this.tooltip = new n(this.parentNode)),
              (this.moreOptions = new n(this.parentNode)),
              (this.maxElementsOnTooltip = t.maxElementsOnTooltip || 4),
              (this.$alwaysShow = t.alwaysShow || !1),
              (this.eventListeners = {}),
              (this.elements = {}),
              (this.commands = {}),
              (this.tooltipEl = a.buildDom(
                ["div", { class: m }],
                this.tooltip.getElement()
              )),
              (this.moreOptionsEl = a.buildDom(
                ["div", { class: m + " tooltip_more_options" }],
                this.moreOptions.getElement()
              )),
              (this.$showTooltipTimer = s.delayedCall(
                this.$showTooltip.bind(this),
                t.showDelay || 100
              )),
              (this.$hideTooltipTimer = s.delayedCall(
                this.$hideTooltip.bind(this),
                t.hideDelay || 100
              )),
              (this.$tooltipEnter = this.$tooltipEnter.bind(this)),
              (this.$onMouseMove = this.$onMouseMove.bind(this)),
              (this.$onChangeScroll = this.$onChangeScroll.bind(this)),
              (this.$onEditorChangeSession =
                this.$onEditorChangeSession.bind(this)),
              (this.$scheduleTooltipForHide =
                this.$scheduleTooltipForHide.bind(this)),
              (this.$preventMouseEvent = this.$preventMouseEvent.bind(this));
            try {
              for (
                var c = o(["mousedown", "mouseup", "click"]), l = c.next();
                !l.done;
                l = c.next()
              ) {
                var p = l.value;
                this.tooltip
                  .getElement()
                  .addEventListener(p, this.$preventMouseEvent),
                  this.moreOptions
                    .getElement()
                    .addEventListener(p, this.$preventMouseEvent);
              }
            } catch (h) {
              i = { error: h };
            } finally {
              try {
                l && !l.done && (r = c.return) && r.call(c);
              } finally {
                if (i) throw i.error;
              }
            }
          }
          return (
            (e.prototype.registerCommand = function (e, t) {
              var i =
                Object.keys(this.commands).length < this.maxElementsOnTooltip;
              i ||
                this.elements[g] ||
                this.$createCommand(
                  g,
                  {
                    name: "\xb7\xb7\xb7",
                    exec: function () {
                      (this.$shouldHideMoreOptions = !1),
                        this.$setMoreOptionsVisibility(
                          !this.isMoreOptionsShown()
                        );
                    }.bind(this),
                    type: "checkbox",
                    getValue: function () {
                      return this.isMoreOptionsShown();
                    }.bind(this),
                    enabled: !0,
                  },
                  !0
                ),
                this.$createCommand(e, t, i),
                this.isShown() && this.updatePosition();
            }),
            (e.prototype.isShown = function () {
              return !!this.tooltip && this.tooltip.isOpen;
            }),
            (e.prototype.isMoreOptionsShown = function () {
              return !!this.moreOptions && this.moreOptions.isOpen;
            }),
            (e.prototype.getAlwaysShow = function () {
              return this.$alwaysShow;
            }),
            (e.prototype.setAlwaysShow = function (e) {
              (this.$alwaysShow = e),
                this.$updateOnHoverHandlers(!this.$alwaysShow),
                this._signal("alwaysShow", this.$alwaysShow);
            }),
            (e.prototype.attach = function (e) {
              !e ||
                (this.isShown() && this.editor === e) ||
                (this.detach(),
                (this.editor = e),
                this.editor.on("changeSession", this.$onEditorChangeSession),
                this.editor.session &&
                  (this.editor.session.on(
                    "changeScrollLeft",
                    this.$onChangeScroll
                  ),
                  this.editor.session.on(
                    "changeScrollTop",
                    this.$onChangeScroll
                  )),
                this.getAlwaysShow()
                  ? this.$showTooltip()
                  : this.$updateOnHoverHandlers(!0));
            }),
            (e.prototype.updatePosition = function () {
              if (this.editor) {
                var e,
                  t = this.editor.renderer;
                if (
                  (e = this.editor.selection.getAllRanges
                    ? this.editor.selection.getAllRanges()
                    : [this.editor.getSelectionRange()]).length
                ) {
                  for (
                    var i, o = f(e[0].start, e[0].end), n = 0;
                    (i = e[n]);
                    n++
                  )
                    o = f(o, f(i.start, i.end));
                  var r = t.$cursorLayer.getPixelPosition(o, !0),
                    s = this.tooltip.getElement(),
                    a = window.innerWidth,
                    c = window.innerHeight,
                    l = this.editor.container.getBoundingClientRect();
                  (r.top += l.top - t.layerConfig.offset),
                    (r.left += l.left + t.gutterWidth - t.scrollLeft);
                  var p =
                    r.top >= l.top &&
                    r.top <= l.bottom &&
                    r.left >= l.left + t.gutterWidth &&
                    r.left <= l.right;
                  if (p || !this.isShown())
                    if (p && !this.isShown() && this.getAlwaysShow())
                      this.$showTooltip();
                    else {
                      var h = r.top - s.offsetHeight,
                        d = Math.min(a - s.offsetWidth, r.left);
                      if (
                        h >= 0 &&
                        h + s.offsetHeight <= c &&
                        d >= 0 &&
                        d + s.offsetWidth <= a
                      ) {
                        if (
                          (this.tooltip.setPosition(d, h),
                          this.isMoreOptionsShown())
                        ) {
                          (h += s.offsetHeight),
                            (d = this.elements[g].getBoundingClientRect().left);
                          var u = this.moreOptions.getElement();
                          c = window.innerHeight;
                          h + u.offsetHeight > c &&
                            (h -= s.offsetHeight + u.offsetHeight),
                            d + u.offsetWidth > a && (d = a - u.offsetWidth),
                            this.moreOptions.setPosition(d, h);
                        }
                      } else this.$hideTooltip();
                    }
                  else this.$hideTooltip();
                }
              }
            }),
            (e.prototype.update = function () {
              Object.keys(this.elements).forEach(
                this.$updateElement.bind(this)
              );
            }),
            (e.prototype.detach = function () {
              this.tooltip.hide(),
                this.moreOptions.hide(),
                this.$updateOnHoverHandlers(!1),
                this.editor &&
                  (this.editor.off(
                    "changeSession",
                    this.$onEditorChangeSession
                  ),
                  this.editor.session &&
                    (this.editor.session.off(
                      "changeScrollLeft",
                      this.$onChangeScroll
                    ),
                    this.editor.session.off(
                      "changeScrollTop",
                      this.$onChangeScroll
                    ))),
                (this.$mouseInTooltip = !1),
                (this.editor = null);
            }),
            (e.prototype.destroy = function () {
              this.tooltip &&
                this.moreOptions &&
                (this.detach(),
                this.tooltip.destroy(),
                this.moreOptions.destroy()),
                (this.eventListeners = {}),
                (this.commands = {}),
                (this.elements = {}),
                (this.tooltip = this.moreOptions = this.parentNode = null);
            }),
            (e.prototype.$createCommand = function (e, t, i) {
              var o,
                n = i ? this.tooltipEl : this.moreOptionsEl,
                r = [],
                s = t.bindKey;
              s &&
                ("object" === typeof s && (s = l.isMac ? s.mac : s.win),
                (r = (r = (s = s.split("|")[0]).split("-")).map(function (e) {
                  if (b[e]) {
                    if ("string" === typeof b[e]) return b[e];
                    if (l.isMac && b[e].mac) return b[e].mac;
                  }
                  return e;
                }))),
                i && t.iconCssClass
                  ? (o = [
                      "div",
                      {
                        class: ["ace_icon_svg", t.iconCssClass].join(" "),
                        "aria-label": t.name + " (" + t.bindKey + ")",
                      },
                    ])
                  : ((o = [
                      ["div", { class: h }],
                      ["div", { class: d }, t.name],
                    ]),
                    r.length &&
                      o.push([
                        "div",
                        { class: u },
                        r.map(function (e) {
                          return ["div", e];
                        }),
                      ])),
                a.buildDom(
                  [
                    "div",
                    { class: [p, t.cssClass || ""].join(" "), ref: e },
                    o,
                  ],
                  n,
                  this.elements
                ),
                (this.commands[e] = t);
              var c = function (i) {
                this.editor && this.editor.focus(),
                  (this.$shouldHideMoreOptions = this.isMoreOptionsShown()),
                  !this.elements[e].disabled && t.exec && t.exec(this.editor),
                  this.$shouldHideMoreOptions &&
                    this.$setMoreOptionsVisibility(!1),
                  this.update(),
                  i.preventDefault();
              }.bind(this);
              (this.eventListeners[e] = c),
                this.elements[e].addEventListener("click", c.bind(this)),
                this.$updateElement(e);
            }),
            (e.prototype.$setMoreOptionsVisibility = function (e) {
              e
                ? (this.moreOptions.setTheme(this.editor.renderer.theme),
                  this.moreOptions.setClassName(m + "_wrapper"),
                  this.moreOptions.show(),
                  this.update(),
                  this.updatePosition())
                : this.moreOptions.hide();
            }),
            (e.prototype.$onEditorChangeSession = function (e) {
              e.oldSession &&
                (e.oldSession.off("changeScrollTop", this.$onChangeScroll),
                e.oldSession.off("changeScrollLeft", this.$onChangeScroll)),
                this.detach();
            }),
            (e.prototype.$onChangeScroll = function () {
              this.editor.renderer &&
                (this.isShown() || this.getAlwaysShow()) &&
                this.editor.renderer.once(
                  "afterRender",
                  this.updatePosition.bind(this)
                );
            }),
            (e.prototype.$onMouseMove = function (e) {
              if (!this.$mouseInTooltip) {
                var t = this.editor.getCursorPosition(),
                  i = this.editor.renderer.textToScreenCoordinates(
                    t.row,
                    t.column
                  ),
                  o = this.editor.renderer.lineHeight;
                e.clientY >= i.pageY && e.clientY < i.pageY + o
                  ? (this.isShown() ||
                      this.$showTooltipTimer.isPending() ||
                      this.$showTooltipTimer.delay(),
                    this.$hideTooltipTimer.isPending() &&
                      this.$hideTooltipTimer.cancel())
                  : (this.isShown() &&
                      !this.$hideTooltipTimer.isPending() &&
                      this.$hideTooltipTimer.delay(),
                    this.$showTooltipTimer.isPending() &&
                      this.$showTooltipTimer.cancel());
              }
            }),
            (e.prototype.$preventMouseEvent = function (e) {
              this.editor && this.editor.focus(), e.preventDefault();
            }),
            (e.prototype.$scheduleTooltipForHide = function () {
              (this.$mouseInTooltip = !1),
                this.$showTooltipTimer.cancel(),
                this.$hideTooltipTimer.delay();
            }),
            (e.prototype.$tooltipEnter = function () {
              (this.$mouseInTooltip = !0),
                this.$showTooltipTimer.isPending() &&
                  this.$showTooltipTimer.cancel(),
                this.$hideTooltipTimer.isPending() &&
                  this.$hideTooltipTimer.cancel();
            }),
            (e.prototype.$updateOnHoverHandlers = function (e) {
              var t = this.tooltip.getElement(),
                i = this.moreOptions.getElement();
              e
                ? (this.editor &&
                    (this.editor.on("mousemove", this.$onMouseMove),
                    this.editor.renderer
                      .getMouseEventTarget()
                      .addEventListener(
                        "mouseout",
                        this.$scheduleTooltipForHide,
                        !0
                      )),
                  t.addEventListener("mouseenter", this.$tooltipEnter),
                  t.addEventListener(
                    "mouseleave",
                    this.$scheduleTooltipForHide
                  ),
                  i.addEventListener("mouseenter", this.$tooltipEnter),
                  i.addEventListener(
                    "mouseleave",
                    this.$scheduleTooltipForHide
                  ))
                : (this.editor &&
                    (this.editor.off("mousemove", this.$onMouseMove),
                    this.editor.renderer
                      .getMouseEventTarget()
                      .removeEventListener(
                        "mouseout",
                        this.$scheduleTooltipForHide,
                        !0
                      )),
                  t.removeEventListener("mouseenter", this.$tooltipEnter),
                  t.removeEventListener(
                    "mouseleave",
                    this.$scheduleTooltipForHide
                  ),
                  i.removeEventListener("mouseenter", this.$tooltipEnter),
                  i.removeEventListener(
                    "mouseleave",
                    this.$scheduleTooltipForHide
                  ));
            }),
            (e.prototype.$showTooltip = function () {
              this.isShown() ||
                (this.tooltip.setTheme(this.editor.renderer.theme),
                this.tooltip.setClassName(m + "_wrapper"),
                this.tooltip.show(),
                this.update(),
                this.updatePosition(),
                this._signal("show"));
            }),
            (e.prototype.$hideTooltip = function () {
              (this.$mouseInTooltip = !1),
                this.isShown() &&
                  (this.moreOptions.hide(),
                  this.tooltip.hide(),
                  this._signal("hide"));
            }),
            (e.prototype.$updateElement = function (e) {
              var t = this.commands[e];
              if (t) {
                var i = this.elements[e],
                  o = t.enabled;
                if (
                  ("function" === typeof o && (o = o(this.editor)),
                  "function" === typeof t.getValue)
                ) {
                  var n = t.getValue(this.editor);
                  if ("text" === t.type) i.textContent = n;
                  else if ("checkbox" === t.type) {
                    var r = n ? a.addCssClass : a.removeCssClass,
                      s = i.parentElement === this.tooltipEl;
                    (i.ariaChecked = n),
                      s
                        ? r(i, "ace_selected")
                        : r((i = i.querySelector("." + h)), "ace_checkmark");
                  }
                }
                o && i.disabled
                  ? (a.removeCssClass(i, "ace_disabled"),
                    (i.ariaDisabled = i.disabled = !1),
                    i.removeAttribute("disabled"))
                  : o ||
                    i.disabled ||
                    (a.addCssClass(i, "ace_disabled"),
                    (i.ariaDisabled = i.disabled = !0),
                    i.setAttribute("disabled", ""));
              }
            }),
            e
          );
        })();
      c.implement(v.prototype, r),
        a.importCssString(
          "\n.ace_tooltip."
            .concat(m, "_wrapper {\n    padding: 0;\n}\n\n.ace_tooltip .")
            .concat(
              m,
              " {\n    padding: 1px 5px;\n    display: flex;\n    pointer-events: auto;\n}\n\n.ace_tooltip ."
            )
            .concat(
              m,
              ".tooltip_more_options {\n    padding: 1px;\n    flex-direction: column;\n}\n\ndiv."
            )
            .concat(
              p,
              " {\n    display: inline-flex;\n    cursor: pointer;\n    margin: 1px;\n    border-radius: 2px;\n    padding: 2px 5px;\n    align-items: center;\n}\n\ndiv."
            )
            .concat(p, ".ace_selected,\ndiv.")
            .concat(
              p,
              ":hover:not(.ace_disabled) {\n    background-color: rgba(0, 0, 0, 0.1);\n}\n\ndiv."
            )
            .concat(
              p,
              ".ace_disabled {\n    color: #777;\n    pointer-events: none;\n}\n\ndiv."
            )
            .concat(
              p,
              " .ace_icon_svg {\n    height: 12px;\n    background-color: #000;\n}\n\ndiv."
            )
            .concat(
              p,
              ".ace_disabled .ace_icon_svg {\n    background-color: #777;\n}\n\n."
            )
            .concat(m, ".tooltip_more_options .")
            .concat(p, " {\n    display: flex;\n}\n\n.")
            .concat(m, ".")
            .concat(h, " {\n    display: none;\n}\n\n.")
            .concat(m, ".tooltip_more_options .")
            .concat(
              h,
              " {\n    display: inline-block;\n    width: 12px;\n}\n\n."
            )
            .concat(d, " {\n    display: inline-block;\n}\n\n.")
            .concat(
              u,
              " {\n    margin: 0 2px;\n    display: inline-block;\n    font-size: 8px;\n}\n\n."
            )
            .concat(m, ".tooltip_more_options .")
            .concat(u, " {\n    margin-left: auto;\n}\n\n.")
            .concat(
              u,
              " div {\n    display: inline-block;\n    min-width: 8px;\n    padding: 2px;\n    margin: 0 1px;\n    border-radius: 2px;\n    background-color: #ccc;\n    text-align: center;\n}\n\n.ace_dark.ace_tooltip ."
            )
            .concat(
              m,
              " {\n    background-color: #373737;\n    color: #eee;\n}\n\n.ace_dark div."
            )
            .concat(
              p,
              ".ace_disabled {\n    color: #979797;\n}\n\n.ace_dark div."
            )
            .concat(p, ".ace_selected,\n.ace_dark div.")
            .concat(
              p,
              ":hover:not(.ace_disabled) {\n    background-color: rgba(255, 255, 255, 0.1);\n}\n\n.ace_dark div."
            )
            .concat(
              p,
              " .ace_icon_svg {\n    background-color: #eee;\n}\n\n.ace_dark div."
            )
            .concat(
              p,
              ".ace_disabled .ace_icon_svg {\n    background-color: #979797;\n}\n\n.ace_dark ."
            )
            .concat(p, ".ace_disabled {\n    color: #979797;\n}\n\n.ace_dark .")
            .concat(
              u,
              " div {\n    background-color: #575757;\n}\n\n.ace_checkmark::before {\n    content: '\u2713';\n}\n"
            ),
          "commandbar.css",
          !1
        ),
        (t.CommandBarTooltip = v),
        (t.TOOLTIP_CLASS_NAME = m),
        (t.BUTTON_CLASS_NAME = p);
    }
  ),
  ace.define(
    "ace/autocomplete/text_completer",
    ["require", "exports", "module", "ace/range"],
    function (e, t, i) {
      var o = e("../range").Range,
        n = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
      function r(e, t) {
        var i = (function (e, t) {
            return (
              e.getTextRange(o.fromPoints({ row: 0, column: 0 }, t)).split(n)
                .length - 1
            );
          })(e, t),
          r = e.getValue().split(n),
          s = Object.create(null),
          a = r[i];
        return (
          r.forEach(function (e, t) {
            if (e && e !== a) {
              var o = Math.abs(i - t),
                n = r.length - o;
              s[e] ? (s[e] = Math.max(n, s[e])) : (s[e] = n);
            }
          }),
          s
        );
      }
      t.getCompletions = function (e, t, i, o, n) {
        var s = r(t, i);
        n(
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
    function (e, t, i) {
      "use strict";
      var o = e("../snippets").snippetManager,
        n = e("../autocomplete").Autocomplete,
        r = e("../config"),
        s = e("../lib/lang"),
        a = e("../autocomplete/util"),
        c = e("../autocomplete/text_completer"),
        l = {
          getCompletions: function (e, t, i, o, n) {
            if (t.$mode.completer)
              return t.$mode.completer.getCompletions(e, t, i, o, n);
            var r = e.session.getState(i.row),
              s = t.$mode.getCompletions(r, t, i, o);
            n(
              null,
              (s = s.map(function (e) {
                return (e.completerId = l.id), e;
              }))
            );
          },
          id: "keywordCompleter",
        },
        p = function (e) {
          var t = {};
          return e
            .replace(/\${(\d+)(:(.*?))?}/g, function (e, i, o, n) {
              return (t[i] = n || "");
            })
            .replace(/\$(\d+?)/g, function (e, i) {
              return t[i];
            });
        },
        h = {
          getCompletions: function (e, t, i, n, r) {
            var s = [],
              a = t.getTokenAt(i.row, i.column);
            a &&
            a.type.match(
              /(tag-name|tag-open|tag-whitespace|attribute-name|attribute-value)\.xml$/
            )
              ? s.push("html-tag")
              : (s = o.getActiveScopes(e));
            var c = o.snippetMap,
              l = [];
            s.forEach(function (e) {
              for (var t = c[e] || [], i = t.length; i--; ) {
                var o = t[i],
                  n = o.name || o.tabTrigger;
                n &&
                  l.push({
                    caption: n,
                    snippet: o.content,
                    meta:
                      o.tabTrigger && !o.name
                        ? o.tabTrigger + "\u21e5 "
                        : "snippet",
                    completerId: h.id,
                  });
              }
            }, this),
              r(null, l);
          },
          getDocTooltip: function (e) {
            e.snippet &&
              !e.docHTML &&
              (e.docHTML = [
                "<b>",
                s.escapeHTML(e.caption),
                "</b>",
                "<hr></hr>",
                s.escapeHTML(p(e.snippet)),
              ].join(""));
          },
          id: "snippetCompleter",
        },
        d = [h, c, l];
      (t.setCompleters = function (e) {
        (d.length = 0), e && d.push.apply(d, e);
      }),
        (t.addCompleter = function (e) {
          d.push(e);
        }),
        (t.textCompleter = c),
        (t.keyWordCompleter = l),
        (t.snippetCompleter = h);
      var u,
        m = {
          name: "expandSnippet",
          exec: function (e) {
            return o.expandWithTab(e);
          },
          bindKey: "Tab",
        },
        g = function (e, t) {
          f(t.session.$mode);
        },
        f = function e(t) {
          "string" == typeof t && (t = r.$modes[t]),
            t &&
              (o.files || (o.files = {}),
              b(t.$id, t.snippetFileId),
              t.modes && t.modes.forEach(e));
        },
        b = function (e, t) {
          t &&
            e &&
            !o.files[e] &&
            ((o.files[e] = {}),
            r.loadModule(t, function (t) {
              t &&
                ((o.files[e] = t),
                !t.snippets &&
                  t.snippetText &&
                  (t.snippets = o.parseSnippetFile(t.snippetText)),
                o.register(t.snippets || [], t.scope),
                t.includeScopes &&
                  ((o.snippetMap[t.scope].includeScopes = t.includeScopes),
                  t.includeScopes.forEach(function (e) {
                    f("ace/mode/" + e);
                  })));
            }));
        },
        v = function (e) {
          var t = e.editor,
            i = t.completer && t.completer.activated;
          if ("backspace" === e.command.name)
            i && !a.getCompletionPrefix(t) && t.completer.detach();
          else if ("insertstring" === e.command.name && !i) {
            u = e;
            var o = e.editor.$liveAutocompletionDelay;
            o ? y.delay(o) : x(e);
          }
        },
        y = s.delayedCall(function () {
          x(u);
        }, 0),
        x = function (e) {
          var t = e.editor,
            i = a.getCompletionPrefix(t),
            o = a.triggerAutocomplete(t);
          if ((i || o) && i.length >= t.$liveAutocompletionThreshold) {
            var r = n.for(t);
            (r.autoShown = !0), r.showPopup(t);
          }
        },
        w = e("../editor").Editor;
      e("../config").defineOptions(w.prototype, "editor", {
        enableBasicAutocompletion: {
          set: function (e) {
            e
              ? (this.completers ||
                  (this.completers = Array.isArray(e) ? e : d),
                this.commands.addCommand(n.startCommand))
              : this.commands.removeCommand(n.startCommand);
          },
          value: !1,
        },
        enableLiveAutocompletion: {
          set: function (e) {
            e
              ? (this.completers ||
                  (this.completers = Array.isArray(e) ? e : d),
                this.commands.on("afterExec", v))
              : this.commands.off("afterExec", v);
          },
          value: !1,
        },
        liveAutocompletionDelay: { initialValue: 0 },
        liveAutocompletionThreshold: { initialValue: 0 },
        enableSnippets: {
          set: function (e) {
            e
              ? (this.commands.addCommand(m),
                this.on("changeMode", g),
                g(0, this))
              : (this.commands.removeCommand(m), this.off("changeMode", g));
          },
          value: !1,
        },
      });
    }
  ),
  ace.define(
    "ace/ext/inline_autocomplete",
    [
      "require",
      "exports",
      "module",
      "ace/keyboard/hash_handler",
      "ace/autocomplete/inline",
      "ace/autocomplete",
      "ace/autocomplete",
      "ace/editor",
      "ace/autocomplete/util",
      "ace/lib/dom",
      "ace/lib/lang",
      "ace/ext/command_bar",
      "ace/ext/command_bar",
      "ace/ext/language_tools",
      "ace/ext/language_tools",
      "ace/ext/language_tools",
      "ace/config",
    ],
    function (e, t, i) {
      "use strict";
      var o = e("../keyboard/hash_handler").HashHandler,
        n = e("../autocomplete/inline").AceInline,
        r = e("../autocomplete").FilteredList,
        s = e("../autocomplete").CompletionProvider,
        a = e("../editor").Editor,
        c = e("../autocomplete/util"),
        l = e("../lib/dom"),
        p = e("../lib/lang"),
        h = e("./command_bar").CommandBarTooltip,
        d = e("./command_bar").BUTTON_CLASS_NAME,
        u = e("./language_tools").snippetCompleter,
        m = e("./language_tools").textCompleter,
        g = e("./language_tools").keyWordCompleter,
        f = function (e, t) {
          t.completer && t.completer.destroy();
        },
        b = (function () {
          function e(e) {
            (this.editor = e),
              (this.keyboardHandler = new o(this.commands)),
              (this.$index = -1),
              (this.blurListener = this.blurListener.bind(this)),
              (this.changeListener = this.changeListener.bind(this)),
              (this.changeTimer = p.delayedCall(
                function () {
                  this.updateCompletions();
                }.bind(this)
              ));
          }
          return (
            (e.prototype.getInlineRenderer = function () {
              return (
                this.inlineRenderer || (this.inlineRenderer = new n()),
                this.inlineRenderer
              );
            }),
            (e.prototype.getInlineTooltip = function () {
              return (
                this.inlineTooltip ||
                  (this.inlineTooltip = e.createInlineTooltip(
                    document.body || document.documentElement
                  )),
                this.inlineTooltip
              );
            }),
            (e.prototype.show = function (e) {
              (this.activated = !0),
                this.editor.completer !== this &&
                  (this.editor.completer && this.editor.completer.detach(),
                  (this.editor.completer = this)),
                this.editor.on("changeSelection", this.changeListener),
                this.editor.on("blur", this.blurListener),
                this.updateCompletions(e);
            }),
            (e.prototype.$open = function () {
              this.editor.textInput.setAriaOptions &&
                this.editor.textInput.setAriaOptions({}),
                this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler),
                this.getInlineTooltip().attach(this.editor),
                -1 === this.$index ? this.setIndex(0) : this.$showCompletion(),
                this.changeTimer.cancel();
            }),
            (e.prototype.insertMatch = function () {
              var e = this.getCompletionProvider().insertByIndex(
                this.editor,
                this.$index
              );
              return this.detach(), e;
            }),
            (e.prototype.changeListener = function (e) {
              var t = this.editor.selection.lead;
              (t.row != this.base.row || t.column < this.base.column) &&
                this.detach(),
                this.activated ? this.changeTimer.schedule() : this.detach();
            }),
            (e.prototype.blurListener = function (e) {
              this.detach();
            }),
            (e.prototype.goTo = function (e) {
              if (this.completions && this.completions.filtered) {
                var t = this.completions.filtered.length;
                switch (e.toLowerCase()) {
                  case "prev":
                    this.setIndex((this.$index - 1 + t) % t);
                    break;
                  case "next":
                    this.setIndex((this.$index + 1 + t) % t);
                    break;
                  case "first":
                    this.setIndex(0);
                    break;
                  case "last":
                    this.setIndex(this.completions.filtered.length - 1);
                }
              }
            }),
            (e.prototype.getLength = function () {
              return this.completions && this.completions.filtered
                ? this.completions.filtered.length
                : 0;
            }),
            (e.prototype.getData = function (e) {
              return void 0 == e || null === e
                ? this.completions.filtered[this.$index]
                : this.completions.filtered[e];
            }),
            (e.prototype.getIndex = function () {
              return this.$index;
            }),
            (e.prototype.isOpen = function () {
              return this.$index >= 0;
            }),
            (e.prototype.setIndex = function (e) {
              if (this.completions && this.completions.filtered) {
                var t = Math.max(
                  -1,
                  Math.min(this.completions.filtered.length - 1, e)
                );
                t !== this.$index &&
                  ((this.$index = t), this.$showCompletion());
              }
            }),
            (e.prototype.getCompletionProvider = function () {
              return (
                this.completionProvider || (this.completionProvider = new s()),
                this.completionProvider
              );
            }),
            (e.prototype.$showCompletion = function () {
              this.getInlineRenderer().show(
                this.editor,
                this.completions.filtered[this.$index],
                this.completions.filterText
              ) || this.getInlineRenderer().hide(),
                this.inlineTooltip &&
                  this.inlineTooltip.isShown() &&
                  this.inlineTooltip.update();
            }),
            (e.prototype.$updatePrefix = function () {
              var e = this.editor.getCursorPosition(),
                t = this.editor.session.getTextRange({
                  start: this.base,
                  end: e,
                });
              return (
                this.completions.setFilter(t),
                this.completions.filtered.length &&
                (1 != this.completions.filtered.length ||
                  this.completions.filtered[0].value != t ||
                  this.completions.filtered[0].snippet)
                  ? (this.$open(this.editor, t), t)
                  : this.detach()
              );
            }),
            (e.prototype.updateCompletions = function (e) {
              var t = "";
              if (e && e.matches) {
                var i = this.editor.getSelectionRange().start;
                return (
                  (this.base = this.editor.session.doc.createAnchor(
                    i.row,
                    i.column
                  )),
                  (this.base.$insertRight = !0),
                  (this.completions = new r(e.matches)),
                  this.$open(this.editor, "")
                );
              }
              this.base && this.completions && (t = this.$updatePrefix());
              var o = this.editor.getSession();
              (i = this.editor.getCursorPosition()),
                (t = c.getCompletionPrefix(this.editor));
              (this.base = o.doc.createAnchor(i.row, i.column - t.length)),
                (this.base.$insertRight = !0);
              e = { exactMatch: !0, ignoreCaption: !0 };
              this.getCompletionProvider().provideCompletions(
                this.editor,
                e,
                function (e, t, i) {
                  var o = t.filtered,
                    n = c.getCompletionPrefix(this.editor);
                  if (i) {
                    if (!o.length) return this.detach();
                    if (1 == o.length && o[0].value == n && !o[0].snippet)
                      return this.detach();
                  }
                  (this.completions = t), this.$open(this.editor, n);
                }.bind(this)
              );
            }),
            (e.prototype.detach = function () {
              this.editor &&
                (this.editor.keyBinding.removeKeyboardHandler(
                  this.keyboardHandler
                ),
                this.editor.off("changeSelection", this.changeListener),
                this.editor.off("blur", this.blurListener)),
                this.changeTimer.cancel(),
                this.inlineTooltip && this.inlineTooltip.detach(),
                this.setIndex(-1),
                this.completionProvider && this.completionProvider.detach(),
                this.inlineRenderer &&
                  this.inlineRenderer.isOpen() &&
                  this.inlineRenderer.hide(),
                this.base && this.base.detach(),
                (this.activated = !1),
                (this.completionProvider = this.completions = this.base = null);
            }),
            (e.prototype.destroy = function () {
              this.detach(),
                this.inlineRenderer && this.inlineRenderer.destroy(),
                this.inlineTooltip && this.inlineTooltip.destroy(),
                this.editor &&
                  this.editor.completer == this &&
                  (this.editor.off("destroy", f),
                  (this.editor.completer = null)),
                (this.inlineTooltip = this.editor = this.inlineRenderer = null);
            }),
            e
          );
        })();
      (b.prototype.commands = {
        Previous: {
          bindKey: "Alt-[",
          name: "Previous",
          exec: function (e) {
            e.completer.goTo("prev");
          },
        },
        Next: {
          bindKey: "Alt-]",
          name: "Next",
          exec: function (e) {
            e.completer.goTo("next");
          },
        },
        Accept: {
          bindKey: { win: "Tab|Ctrl-Right", mac: "Tab|Cmd-Right" },
          name: "Accept",
          exec: function (e) {
            return e.completer.insertMatch();
          },
        },
        Close: {
          bindKey: "Esc",
          name: "Close",
          exec: function (e) {
            e.completer.detach();
          },
        },
      }),
        (b.for = function (e) {
          return (
            e.completer instanceof b ||
              (e.completer && (e.completer.destroy(), (e.completer = null)),
              (e.completer = new b(e)),
              e.once("destroy", f)),
            e.completer
          );
        }),
        (b.startCommand = {
          name: "startInlineAutocomplete",
          exec: function (e, t) {
            b.for(e).show(t);
          },
          bindKey: { win: "Alt-C", mac: "Option-C" },
        });
      var v = [u, m, g];
      e("../config").defineOptions(a.prototype, "editor", {
        enableInlineAutocompletion: {
          set: function (e) {
            e
              ? (this.completers ||
                  (this.completers = Array.isArray(e) ? e : v),
                this.commands.addCommand(b.startCommand))
              : this.commands.removeCommand(b.startCommand);
          },
          value: !1,
        },
      }),
        (b.createInlineTooltip = function (e) {
          var t = new h(e);
          return (
            t.registerCommand(
              "Previous",
              Object.assign({}, b.prototype.commands.Previous, {
                enabled: !0,
                type: "button",
                iconCssClass: "ace_arrow_rotated",
              })
            ),
            t.registerCommand("Position", {
              enabled: !1,
              getValue: function (e) {
                return e
                  ? [e.completer.getIndex() + 1, e.completer.getLength()].join(
                      "/"
                    )
                  : "";
              },
              type: "text",
              cssClass: "completion_position",
            }),
            t.registerCommand(
              "Next",
              Object.assign({}, b.prototype.commands.Next, {
                enabled: !0,
                type: "button",
                iconCssClass: "ace_arrow",
              })
            ),
            t.registerCommand(
              "Accept",
              Object.assign({}, b.prototype.commands.Accept, {
                enabled: function (e) {
                  return !!e && e.completer.getIndex() >= 0;
                },
                type: "button",
              })
            ),
            t.registerCommand("ShowTooltip", {
              name: "Always Show Tooltip",
              exec: function () {
                t.setAlwaysShow(!t.getAlwaysShow());
              },
              enabled: !0,
              getValue: function () {
                return t.getAlwaysShow();
              },
              type: "checkbox",
            }),
            t
          );
        }),
        l.importCssString(
          '\n\n.ace_icon_svg.ace_arrow,\n.ace_icon_svg.ace_arrow_rotated {\n    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUuODM3MDEgMTVMNC41ODc1MSAxMy43MTU1TDEwLjE0NjggOEw0LjU4NzUxIDIuMjg0NDZMNS44MzcwMSAxTDEyLjY0NjUgOEw1LjgzNzAxIDE1WiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=");\n}\n\n.ace_icon_svg.ace_arrow_rotated {\n    transform: rotate(180deg);\n}\n\ndiv.'.concat(
            d,
            ".completion_position {\n    padding: 0;\n}\n"
          ),
          "inlineautocomplete.css",
          !1
        ),
        (t.InlineAutocomplete = b);
    }
  ),
  ace.require(["ace/ext/inline_autocomplete"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
