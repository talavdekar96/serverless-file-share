ace.define(
  "ace/mode/elm_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var o = e("../lib/oop"),
      r = e("./text_highlight_rules").TextHighlightRules,
      i = function () {
        var e = this.createKeywordMapper(
            {
              keyword:
                "as|case|class|data|default|deriving|do|else|export|foreign|hiding|jsevent|if|import|in|infix|infixl|infixr|instance|let|module|newtype|of|open|then|type|where|_|port|\u03bb",
            },
            "identifier"
          ),
          t = /\\(\d+|['"\\&trnbvf])/,
          n = /[a-z_]/.source,
          o = /[A-Z]/.source,
          r = /[a-z_A-Z0-9']/.source;
        (this.$rules = {
          start: [
            { token: "string.start", regex: '"', next: "string" },
            { token: "string.character", regex: "'(?:" + t.source + "|.)'?" },
            {
              regex:
                /0(?:[xX][0-9A-Fa-f]+|[oO][0-7]+)|\d+(\.\d+)?([eE][-+]?\d*)?/,
              token: "constant.numeric",
            },
            { token: "comment", regex: "--.*" },
            { token: "keyword", regex: /\.\.|\||:|=|\\|"|->|<-|\u2192/ },
            {
              token: "keyword.operator",
              regex: /[-!#$%&*+.\/<=>?@\\^|~:\u03BB\u2192]+/,
            },
            { token: "operator.punctuation", regex: /[,;`]/ },
            {
              regex: o + r + "+\\.?",
              token: function (e) {
                return "." == e[e.length - 1]
                  ? "entity.name.function"
                  : "constant.language";
              },
            },
            {
              regex: "^" + n + r + "+",
              token: function (e) {
                return "constant.language";
              },
            },
            { token: e, regex: "[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b" },
            {
              regex: "{-#?",
              token: "comment.start",
              onMatch: function (e, t, n) {
                return (
                  (this.next = 2 == e.length ? "blockComment" : "docComment"),
                  this.token
                );
              },
            },
            {
              token: "variable.language",
              regex: /\[markdown\|/,
              next: "markdown",
            },
            { token: "paren.lparen", regex: /[\[({]/ },
            { token: "paren.rparen", regex: /[\])}]/ },
          ],
          markdown: [
            { regex: /\|\]/, next: "start" },
            { defaultToken: "string" },
          ],
          blockComment: [
            { regex: "{-", token: "comment.start", push: "blockComment" },
            { regex: "-}", token: "comment.end", next: "pop" },
            { defaultToken: "comment" },
          ],
          docComment: [
            { regex: "{-", token: "comment.start", push: "docComment" },
            { regex: "-}", token: "comment.end", next: "pop" },
            { defaultToken: "doc.comment" },
          ],
          string: [
            { token: "constant.language.escape", regex: t },
            { token: "text", regex: /\\(\s|$)/, next: "stringGap" },
            { token: "string.end", regex: '"', next: "start" },
            { defaultToken: "string" },
          ],
          stringGap: [
            { token: "text", regex: /\\/, next: "string" },
            { token: "error", regex: "", next: "start" },
          ],
        }),
          this.normalizeRules();
      };
    o.inherits(i, r), (t.ElmHighlightRules = i);
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
      var o = e("../../lib/oop"),
        r = e("../../range").Range,
        i = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(a, i),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var o = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              var r = this._getFoldWidgetBase(e, t, n);
              return !r && this.startRegionRe.test(o) ? "start" : r;
            }),
            (this.getFoldWidgetRange = function (e, t, n, o) {
              var r,
                i = e.getLine(n);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
              if ((r = i.match(this.foldingStartMarker))) {
                var a = r.index;
                if (r[1]) return this.openingBracketBlock(e, r[1], n, a);
                var s = e.getCommentFoldRange(n, a + r[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (o
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (r = i.match(this.foldingStopMarker))) {
                a = r.index + r[0].length;
                return r[1]
                  ? this.closingBracketBlock(e, r[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  i = t,
                  a = n.length,
                  s = (t += 1),
                  g = e.getLength();
                ++t < g;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (o > l) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= i) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (o == l) break;
                  }
                  s = t;
                }
              }
              return new r(i, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  i = e.getLength(),
                  a = n,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  g = 1;
                ++n < i;

              ) {
                t = e.getLine(n);
                var l = s.exec(t);
                if (l && (l[1] ? g-- : g++, !g)) break;
              }
              if (n > a) return new r(a, o, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/elm",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/elm_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        i = e("./elm_highlight_rules").ElmHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = function () {
          (this.HighlightRules = i),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(s, r),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = { start: "{-", end: "-}", nestable: !0 }),
            (this.$id = "ace/mode/elm");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/elm"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
