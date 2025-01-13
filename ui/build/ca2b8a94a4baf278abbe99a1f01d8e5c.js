ace.define(
  "ace/mode/json_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var i = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        this.$rules = {
          start: [
            {
              token: "variable",
              regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)',
            },
            { token: "string", regex: '"', next: "string" },
            { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: "constant.language.boolean", regex: "(?:true|false)\\b" },
            { token: "text", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
            { token: "comment", regex: "\\/\\/.*$" },
            { token: "comment.start", regex: "\\/\\*", next: "comment" },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { token: "punctuation.operator", regex: /[,]/ },
            { token: "text", regex: "\\s+" },
          ],
          string: [
            {
              token: "constant.language.escape",
              regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/,
            },
            { token: "string", regex: '"|$', next: "start" },
            { defaultToken: "string" },
          ],
          comment: [
            { token: "comment.end", regex: "\\*\\/", next: "start" },
            { defaultToken: "comment" },
          ],
        };
      };
    i.inherits(r, o), (t.JsonHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/json5_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/json_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./json_highlight_rules").JsonHighlightRules,
        r = function () {
          o.call(this);
          var e = [
            {
              token: "variable",
              regex: /[a-zA-Z$_\u00a1-\uffff][\w$\u00a1-\uffff]*\s*(?=:)/,
            },
            {
              token: "variable",
              regex: /['](?:(?:\\.)|(?:[^'\\]))*?[']\s*(?=:)/,
            },
            { token: "constant.language.boolean", regex: /(?:null)\b/ },
            {
              token: "string",
              regex: /'/,
              next: [
                {
                  token: "constant.language.escape",
                  regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,
                  consumeLineEnd: !0,
                },
                { token: "string", regex: /'|$/, next: "start" },
                { defaultToken: "string" },
              ],
            },
            {
              token: "string",
              regex: /"(?![^"]*":)/,
              next: [
                {
                  token: "constant.language.escape",
                  regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,
                  consumeLineEnd: !0,
                },
                { token: "string", regex: /"|$/, next: "start" },
                { defaultToken: "string" },
              ],
            },
            { token: "constant.numeric", regex: /[+-]?(?:Infinity|NaN)\b/ },
          ];
          for (var t in this.$rules)
            this.$rules[t].unshift.apply(this.$rules[t], e);
          this.normalizeRules();
        };
      i.inherits(r, o), (t.Json5HighlightRules = r);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var i = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var o = n[1].length,
              r = e.findMatchingBracket({ row: t, column: o });
            if (!r || r.row == t) return 0;
            var s = this.$getIndent(e.getLine(r.row));
            e.replace(new i(t, 0, t, o - 1), s);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
    }
  ),
  ace.define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../../lib/oop"),
        o = e("../../range").Range,
        r = e("./fold_mode").FoldMode,
        s = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      i.inherits(s, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var i = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(i) &&
                !this.startRegionRe.test(i) &&
                !this.tripleStarBlockCommentRe.test(i)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, n);
              return !o && this.startRegionRe.test(i) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, n, i) {
              var o,
                r = e.getLine(n);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, n);
              if ((o = r.match(this.foldingStartMarker))) {
                var s = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], n, s);
                var a = e.getCommentFoldRange(n, s + o[0].length, 1);
                return (
                  a &&
                    !a.isMultiLine() &&
                    (i
                      ? (a = this.getSectionRange(e, n))
                      : "all" != t && (a = null)),
                  a
                );
              }
              if ("markbegin" !== t && (o = r.match(this.foldingStopMarker))) {
                s = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  i = n.search(/\S/),
                  r = t,
                  s = n.length,
                  a = (t += 1),
                  g = e.getLength();
                ++t < g;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (i > l) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= r) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (i == l) break;
                  }
                  a = t;
                }
              }
              return new o(r, s, a, e.getLine(a).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var i = t.search(/\s*$/),
                  r = e.getLength(),
                  s = n,
                  a = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  g = 1;
                ++n < r;

              ) {
                t = e.getLine(n);
                var l = a.exec(t);
                if (l && (l[1] ? g-- : g++, !g)) break;
              }
              if (n > s) return new o(s, i, n, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/json5",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/json5_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./json5_highlight_rules").Json5HighlightRules,
        s = e("./matching_brace_outdent").MatchingBraceOutdent,
        a = e("./folding/cstyle").FoldMode,
        g = function () {
          (this.HighlightRules = r),
            (this.$outdent = new s()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new a());
        };
      i.inherits(g, o),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/json5");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.require(["ace/mode/json5"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
