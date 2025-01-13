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
      a = (t.FoldMode = function (e) {
        e &&
          ((this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
          )),
          (this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
          )));
      });
    i.inherits(a, r),
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
              var a = o.index;
              if (o[1]) return this.openingBracketBlock(e, o[1], n, a);
              var s = e.getCommentFoldRange(n, a + o[0].length, 1);
              return (
                s &&
                  !s.isMultiLine() &&
                  (i
                    ? (s = this.getSectionRange(e, n))
                    : "all" != t && (s = null)),
                s
              );
            }
            if ("markbegin" !== t && (o = r.match(this.foldingStopMarker))) {
              a = o.index + o[0].length;
              return o[1]
                ? this.closingBracketBlock(e, o[1], n, a)
                : e.getCommentFoldRange(n, a, -1);
            }
          }),
          (this.getSectionRange = function (e, t) {
            for (
              var n = e.getLine(t),
                i = n.search(/\S/),
                r = t,
                a = n.length,
                s = (t += 1),
                g = e.getLength();
              ++t < g;

            ) {
              var c = (n = e.getLine(t)).search(/\S/);
              if (-1 !== c) {
                if (i > c) break;
                var l = this.getFoldWidgetRange(e, "all", t);
                if (l) {
                  if (l.start.row <= r) break;
                  if (l.isMultiLine()) t = l.end.row;
                  else if (i == c) break;
                }
                s = t;
              }
            }
            return new o(r, a, s, e.getLine(s).length);
          }),
          (this.getCommentRegionBlock = function (e, t, n) {
            for (
              var i = t.search(/\s*$/),
                r = e.getLength(),
                a = n,
                s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                g = 1;
              ++n < r;

            ) {
              t = e.getLine(n);
              var c = s.exec(t);
              if (c && (c[1] ? g-- : g++, !g)) break;
            }
            if (n > a) return new o(a, i, n, t.length);
          });
      }.call(a.prototype);
  }
),
  ace.define(
    "ace/mode/tcl_highlight_rules",
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
              { token: "comment", regex: "#.*\\\\$", next: "commentfollow" },
              { token: "comment", regex: "#.*$" },
              {
                token: "support.function",
                regex: "[\\\\]$",
                next: "splitlineStart",
              },
              { token: "text", regex: /\\(?:["{}\[\]$\\])/ },
              {
                token: "text",
                regex: "^|[^{][;][^}]|[/\r/]",
                next: "commandItem",
              },
              {
                token: "string",
                regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
              },
              { token: "string", regex: '[ ]*["]', next: "qqstring" },
              { token: "variable.instance", regex: "[$]", next: "variable" },
              {
                token: "support.function",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::",
              },
              { token: "identifier", regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              { token: "paren.lparen", regex: "[[{]", next: "commandItem" },
              { token: "paren.lparen", regex: "[(]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            commandItem: [
              { token: "comment", regex: "#.*\\\\$", next: "commentfollow" },
              { token: "comment", regex: "#.*$", next: "start" },
              {
                token: "string",
                regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
              },
              { token: "variable.instance", regex: "[$]", next: "variable" },
              {
                token: "support.function",
                regex: "(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])",
                next: "commandItem",
              },
              {
                token: "support.function",
                regex: "[a-zA-Z0-9_/]+(?:[:][:])",
                next: "commandItem",
              },
              {
                token: "support.function",
                regex: "(?:[:][:])",
                next: "commandItem",
              },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "paren.lparen", regex: "[[({]" },
              {
                token: "support.function",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::",
              },
              { token: "keyword", regex: "[a-zA-Z0-9_/]+", next: "start" },
            ],
            commentfollow: [
              { token: "comment", regex: ".*\\\\$", next: "commentfollow" },
              { token: "comment", regex: ".+", next: "start" },
            ],
            splitlineStart: [{ token: "text", regex: "^.", next: "start" }],
            variable: [
              {
                token: "variable.instance",
                regex: "[a-zA-Z_\\d]+(?:[(][a-zA-Z_\\d]+[)])?",
                next: "start",
              },
              {
                token: "variable.instance",
                regex: "{?[a-zA-Z_\\d]+}?",
                next: "start",
              },
            ],
            qqstring: [
              {
                token: "string",
                regex: '(?:[^\\\\]|\\\\.)*?["]',
                next: "start",
              },
              { token: "string", regex: ".+" },
            ],
          };
        };
      i.inherits(r, o), (t.TclHighlightRules = r);
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
            var a = this.$getIndent(e.getLine(r.row));
            e.replace(new i(t, 0, t, o - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
    }
  ),
  ace.define(
    "ace/mode/tcl",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/folding/cstyle",
      "ace/mode/tcl_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/range",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./folding/cstyle").FoldMode,
        a = e("./tcl_highlight_rules").TclHighlightRules,
        s = e("./matching_brace_outdent").MatchingBraceOutdent,
        g =
          (e("../range").Range,
          function () {
            (this.HighlightRules = a),
              (this.$outdent = new s()),
              (this.foldingRules = new r()),
              (this.$behaviour = this.$defaultBehaviour);
          });
      i.inherits(g, o),
        function () {
          (this.lineCommentStart = "#"),
            (this.getNextLineIndent = function (e, t, n) {
              var i = this.$getIndent(t),
                o = this.getTokenizer().getLineTokens(t, e).tokens;
              if (o.length && "comment" == o[o.length - 1].type) return i;
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (i += n);
              return i;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/tcl"),
            (this.snippetFileId = "ace/snippets/tcl");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.require(["ace/mode/tcl"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
