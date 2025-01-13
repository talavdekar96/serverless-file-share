ace.define(
  "ace/mode/doc_comment_highlight_rules",
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
      i = e("./text_highlight_rules").TextHighlightRules,
      r = function e() {
        this.$rules = {
          start: [
            { token: "comment.doc.tag", regex: "@\\w+(?=\\s|$)" },
            e.getTagRule(),
            { defaultToken: "comment.doc", caseInsensitive: !0 },
          ],
        };
      };
    o.inherits(r, i),
      (r.getTagRule = function (e) {
        return {
          token: "comment.doc.tag.storage.type",
          regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
        };
      }),
      (r.getStartRule = function (e) {
        return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
      }),
      (r.getEndRule = function (e) {
        return { token: "comment.doc", regex: "\\*\\/", next: e };
      }),
      (t.DocCommentHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/golang_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var o = e("../lib/oop"),
        i = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        r = e("./text_highlight_rules").TextHighlightRules,
        a = function () {
          var e = this.createKeywordMapper(
              {
                keyword:
                  "else|break|case|return|goto|if|const|select|continue|struct|default|switch|for|range|func|import|package|chan|defer|fallthrough|go|interface|map|range|select|type|var",
                "constant.language": "nil|true|false|iota",
                "support.function":
                  "new|close|cap|copy|panic|panicln|print|println|len|make|delete|real|recover|imag|append",
                "support.type":
                  "string|uint8|uint16|uint32|uint64|int8|int16|int32|int64|float32|float64|complex64|complex128|byte|rune|uint|int|uintptr|bool|error",
              },
              ""
            ),
            t =
              "\\\\(?:[0-7]{3}|x\\h{2}|u{4}|U\\h{6}|[abfnrtv'\"\\\\])".replace(
                /\\h/g,
                "[a-fA-F\\d]"
              );
          (this.$rules = {
            start: [
              { token: "comment", regex: "\\/\\/.*$" },
              i.getStartRule("doc-start"),
              { token: "comment.start", regex: "\\/\\*", next: "comment" },
              { token: "string", regex: /"(?:[^"\\]|\\.)*?"/ },
              { token: "string", regex: "`", next: "bqstring" },
              {
                token: "constant.numeric",
                regex:
                  "'(?:[^\\'\ud800-\udbff]|[\ud800-\udbff][\udc00-\udfff]|" +
                  t.replace('"', "") +
                  ")'",
              },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: ["keyword", "text", "entity.name.function"],
                regex: "(func)(\\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\\b",
              },
              {
                token: function (t) {
                  return "(" == t[t.length - 1]
                    ? [
                        {
                          type: e(t.slice(0, -1)) || "support.function",
                          value: t.slice(0, -1),
                        },
                        { type: "paren.lparen", value: t.slice(-1) },
                      ]
                    : e(t) || "identifier";
                },
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b\\(?",
              },
              {
                token: "keyword.operator",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=",
              },
              { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\." },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment.end", regex: "\\*\\/", next: "start" },
              { defaultToken: "comment" },
            ],
            bqstring: [
              { token: "string", regex: "`", next: "start" },
              { defaultToken: "string" },
            ],
          }),
            this.embedRules(i, "doc-", [i.getEndRule("start")]);
        };
      o.inherits(a, r), (t.GolangHighlightRules = a);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var o = e("../range").Range,
        i = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var i = n[1].length,
              r = e.findMatchingBracket({ row: t, column: i });
            if (!r || r.row == t) return 0;
            var a = this.$getIndent(e.getLine(r.row));
            e.replace(new o(t, 0, t, i - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(i.prototype),
        (t.MatchingBraceOutdent = i);
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
        i = e("../../range").Range,
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
      o.inherits(a, r),
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
              var i = this._getFoldWidgetBase(e, t, n);
              return !i && this.startRegionRe.test(o) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, n, o) {
              var i,
                r = e.getLine(n);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, n);
              if ((i = r.match(this.foldingStartMarker))) {
                var a = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], n, a);
                var g = e.getCommentFoldRange(n, a + i[0].length, 1);
                return (
                  g &&
                    !g.isMultiLine() &&
                    (o
                      ? (g = this.getSectionRange(e, n))
                      : "all" != t && (g = null)),
                  g
                );
              }
              if ("markbegin" !== t && (i = r.match(this.foldingStopMarker))) {
                a = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  r = t,
                  a = n.length,
                  g = (t += 1),
                  c = e.getLength();
                ++t < c;

              ) {
                var s = (n = e.getLine(t)).search(/\S/);
                if (-1 !== s) {
                  if (o > s) break;
                  var l = this.getFoldWidgetRange(e, "all", t);
                  if (l) {
                    if (l.start.row <= r) break;
                    if (l.isMultiLine()) t = l.end.row;
                    else if (o == s) break;
                  }
                  g = t;
                }
              }
              return new i(r, a, g, e.getLine(g).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  r = e.getLength(),
                  a = n,
                  g = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  c = 1;
                ++n < r;

              ) {
                t = e.getLine(n);
                var s = g.exec(t);
                if (s && (s[1] ? c-- : c++, !c)) break;
              }
              if (n > a) return new i(a, o, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/golang",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/golang_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        r = e("./golang_highlight_rules").GolangHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        g = e("./folding/cstyle").FoldMode,
        c = function () {
          (this.HighlightRules = r),
            (this.$outdent = new a()),
            (this.foldingRules = new g()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(c, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                i = this.getTokenizer().getLineTokens(t, e),
                r = i.tokens;
              i.state;
              if (r.length && "comment" == r[r.length - 1].type) return o;
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (o += n);
              return o;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/golang");
        }.call(c.prototype),
        (t.Mode = c);
    }
  ),
  ace.require(["ace/mode/golang"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
