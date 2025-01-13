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
    "ace/mode/odin_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var o =
          (this && this.__read) ||
          function (e, t) {
            var n = "function" === typeof Symbol && e[Symbol.iterator];
            if (!n) return e;
            var o,
              i,
              r = n.call(e),
              a = [];
            try {
              for (; (void 0 === t || t-- > 0) && !(o = r.next()).done; )
                a.push(o.value);
            } catch (c) {
              i = { error: c };
            } finally {
              try {
                o && !o.done && (n = r.return) && n.call(r);
              } finally {
                if (i) throw i.error;
              }
            }
            return a;
          },
        i =
          (this && this.__spreadArray) ||
          function (e, t, n) {
            if (n || 2 === arguments.length)
              for (var o, i = 0, r = t.length; i < r; i++)
                (!o && i in t) ||
                  (o || (o = Array.prototype.slice.call(t, 0, i)),
                  (o[i] = t[i]));
            return e.concat(o || Array.prototype.slice.call(t));
          },
        r = e("../lib/oop"),
        a = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        c = e("./text_highlight_rules").TextHighlightRules,
        s = function () {
          var e = function () {
              for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
              return e
                .reduce(function (e, t) {
                  return e.flatMap(function (e) {
                    return t.map(function (t) {
                      return [e, t].flat();
                    });
                  });
                })
                .map(function (e) {
                  return e.join("");
                });
            },
            t = i(
              i(
                i(
                  i(
                    [
                      "int",
                      "uint",
                      "uintptr",
                      "typeid",
                      "rawptr",
                      "string",
                      "cstring",
                      "i8",
                      "u8",
                      "any",
                      "byte",
                      "rune",
                      "bool",
                      "b8",
                      "b16",
                      "b32",
                      "b64",
                    ],
                    o(
                      e(["i", "u"], ["16", "32", "64", "128"], ["", "le", "be"])
                    ),
                    !1
                  ),
                  o(e(["f"], ["16", "32", "64"], ["", "le", "be"])),
                  !1
                ),
                o(e(["complex"], ["32", "64", "128"])),
                !1
              ),
              o(e(["quaternion"], ["64", "128", "256"])),
              !1
            ).join("|"),
            n = [
              "\\*",
              "/",
              "%",
              "%%",
              "<<",
              ">>",
              "&",
              "&~",
              "\\+",
              "\\-",
              "~",
              "\\|",
              ">",
              "<",
              "<=",
              ">=",
              "==",
              "!=",
            ]
              .concat(":")
              .map(function (e) {
                return e + "=";
              })
              .concat("=", ":=", "::", "->", "\\^", "&", ":")
              .join("|"),
            r = this.createKeywordMapper(
              {
                keyword:
                  "using|transmute|cast|distinct|opaque|where|struct|enum|union|bit_field|bit_set|if|when|else|do|switch|case|break|fallthrough|size_of|offset_of|type_info_if|typeid_of|type_of|align_of|or_return|or_else|inline|no_inline|import|package|foreign|defer|auto_cast|map|matrix|proc|for|continue|not_in|in",
                "constant.language": "nil|true|false",
                "support.function":
                  "new|cap|copy|panic|len|make|delete|append|free",
                "support.type": t,
              },
              ""
            ),
            c =
              "\\\\(?:[0-7]{3}|x\\h{2}|u{4}|U\\h{6}|[abfnrtv'\"\\\\])".replace(
                /\\h/g,
                "[a-fA-F\\d]"
              );
          (this.$rules = {
            start: [
              { token: "comment", regex: /\/\/.*$/ },
              a.getStartRule("doc-start"),
              { token: "comment.start", regex: "\\/\\*", next: "comment" },
              { token: "string", regex: /"(?:[^"\\]|\\.)*?"/ },
              { token: "string", regex: "`", next: "bqstring" },
              { token: "support.constant", regex: /#[a-z_]+/ },
              {
                token: "constant.numeric",
                regex:
                  "'(?:[^\\'\ud800-\udbff]|[\ud800-\udbff][\udc00-\udfff]|" +
                  c.replace('"', "") +
                  ")'",
              },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: [
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "keyword",
                ],
                regex: "([a-zA-Z_$][a-zA-Z0-9_$]*)(\\s+)(::)(\\s+)(proc)\\b",
              },
              {
                token: function (e) {
                  return "(" == e[e.length - 1]
                    ? [
                        {
                          type: r(e.slice(0, -1)) || "support.function",
                          value: e.slice(0, -1),
                        },
                        { type: "paren.lparen", value: e.slice(-1) },
                      ]
                    : r(e) || "identifier";
                },
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b\\(?",
              },
              { token: "keyword.operator", regex: n },
              { token: "punctuation.operator", regex: "\\?|\\,|\\;|\\." },
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
            this.embedRules(a, "doc-", [a.getEndRule("start")]);
        };
      r.inherits(s, c), (t.OdinHighlightRules = s);
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
                var c = e.getCommentFoldRange(n, a + i[0].length, 1);
                return (
                  c &&
                    !c.isMultiLine() &&
                    (o
                      ? (c = this.getSectionRange(e, n))
                      : "all" != t && (c = null)),
                  c
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
                  c = (t += 1),
                  s = e.getLength();
                ++t < s;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (o > l) break;
                  var u = this.getFoldWidgetRange(e, "all", t);
                  if (u) {
                    if (u.start.row <= r) break;
                    if (u.isMultiLine()) t = u.end.row;
                    else if (o == l) break;
                  }
                  c = t;
                }
              }
              return new i(r, a, c, e.getLine(c).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  r = e.getLength(),
                  a = n,
                  c = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  s = 1;
                ++n < r;

              ) {
                t = e.getLine(n);
                var l = c.exec(t);
                if (l && (l[1] ? s-- : s++, !s)) break;
              }
              if (n > a) return new i(a, o, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/odin",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/odin_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        r = e("./odin_highlight_rules").OdinHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        c = e("./folding/cstyle").FoldMode,
        s = function () {
          (this.HighlightRules = r),
            (this.$outdent = new a()),
            (this.foldingRules = new c()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(s, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                i = this.getTokenizer().getLineTokens(t, e).tokens;
              if (i.length && "comment" == i[i.length - 1].type) return o;
              "start" == e && t.match(/^.*[\{\(\[:]\s*$/) && (o += n);
              return o;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/odin");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/odin"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
