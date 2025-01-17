ace.define(
  "ace/mode/bibtex_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      o = function () {
        (this.$rules = {
          start: [
            {
              token: "comment",
              regex: /@Comment\{/,
              stateName: "bibtexComment",
              push: [
                { token: "comment", regex: /}/, next: "pop" },
                { token: "comment", regex: /\{/, push: "bibtexComment" },
                { defaultToken: "comment" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "variable",
                "text",
                "keyword.operator",
              ],
              regex: /(@String)(\s*)(\{)(\s*)([a-zA-Z]*)(\s*)(=)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "variable",
                "text",
                "keyword.operator",
              ],
              regex: /(@String)(\s*)(\()(\s*)([a-zA-Z]*)(\s*)(=)/,
              push: [
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: ["keyword", "text", "paren.lparen"],
              regex: /(@preamble)(\s*)(\()/,
              push: [
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: ["keyword", "text", "paren.lparen"],
              regex: /(@preamble)(\s*)(\{)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "support.class",
              ],
              regex: /(@[a-zA-Z]+)(\s*)(\{)(\s*)([\w-]+)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                {
                  token: ["variable", "text", "keyword.operator"],
                  regex:
                    /([a-zA-Z0-9\!\$\&\*\+\-\.\/\:\;\<\>\?\[\]\^\_\`\|]+)(\s*)(=)/,
                  push: [
                    { token: "text", regex: /(?=[,}])/, next: "pop" },
                    { include: "#misc" },
                    { include: "#integer" },
                    { defaultToken: "text" },
                  ],
                },
                { token: "punctuation", regex: /,/ },
                { defaultToken: "text" },
              ],
            },
            { defaultToken: "comment" },
          ],
          "#integer": [{ token: "constant.numeric.bibtex", regex: /\d+/ }],
          "#misc": [
            { token: "string", regex: /"/, push: "#string_quotes" },
            { token: "paren.lparen", regex: /\{/, push: "#string_braces" },
            { token: "keyword.operator", regex: /#/ },
          ],
          "#string_braces": [
            { token: "paren.rparen", regex: /\}/, next: "pop" },
            { token: "invalid.illegal", regex: /@/ },
            { include: "#misc" },
            { defaultToken: "string" },
          ],
          "#string_quotes": [
            { token: "string", regex: /"/, next: "pop" },
            { include: "#misc" },
            { defaultToken: "string" },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(o, i), (t.BibTeXHighlightRules = o);
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
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        o = e("./fold_mode").FoldMode,
        s = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(s, o),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var i = this._getFoldWidgetBase(e, t, n);
              return !i && this.startRegionRe.test(r) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var i,
                o = e.getLine(n);
              if (this.startRegionRe.test(o))
                return this.getCommentRegionBlock(e, o, n);
              if ((i = o.match(this.foldingStartMarker))) {
                var s = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], n, s);
                var a = e.getCommentFoldRange(n, s + i[0].length, 1);
                return (
                  a &&
                    !a.isMultiLine() &&
                    (r
                      ? (a = this.getSectionRange(e, n))
                      : "all" != t && (a = null)),
                  a
                );
              }
              if ("markbegin" !== t && (i = o.match(this.foldingStopMarker))) {
                s = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  r = n.search(/\S/),
                  o = t,
                  s = n.length,
                  a = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var g = (n = e.getLine(t)).search(/\S/);
                if (-1 !== g) {
                  if (r > g) break;
                  var d = this.getFoldWidgetRange(e, "all", t);
                  if (d) {
                    if (d.start.row <= o) break;
                    if (d.isMultiLine()) t = d.end.row;
                    else if (r == g) break;
                  }
                  a = t;
                }
              }
              return new i(o, s, a, e.getLine(a).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var r = t.search(/\s*$/),
                  o = e.getLength(),
                  s = n,
                  a = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++n < o;

              ) {
                t = e.getLine(n);
                var g = a.exec(t);
                if (g && (g[1] ? l-- : l++, !l)) break;
              }
              if (n > s) return new i(s, r, n, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/bibtex",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/bibtex_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./text").Mode,
        o = e("./bibtex_highlight_rules").BibTeXHighlightRules,
        s = e("./folding/cstyle").FoldMode,
        a = function () {
          (this.HighlightRules = o), (this.foldingRules = new s());
        };
      r.inherits(a, i),
        function () {
          this.$id = "ace/mode/bibtex";
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.require(["ace/mode/bibtex"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
