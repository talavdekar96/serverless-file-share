ace.define(
  "ace/mode/julia_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var o = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        (this.$rules = {
          start: [
            { include: "#function_decl" },
            { include: "#function_call" },
            { include: "#type_decl" },
            { include: "#keyword" },
            { include: "#operator" },
            { include: "#number" },
            { include: "#string" },
            { include: "#comment" },
          ],
          "#bracket": [
            {
              token: "keyword.bracket.julia",
              regex: "\\(|\\)|\\[|\\]|\\{|\\}|,",
            },
          ],
          "#comment": [
            {
              token: [
                "punctuation.definition.comment.julia",
                "comment.line.number-sign.julia",
              ],
              regex: "(#)(?!\\{)(.*$)",
            },
          ],
          "#function_call": [
            {
              token: ["support.function.julia", "text"],
              regex: "([a-zA-Z0-9_]+!?)([\\w\\xff-\\u218e\\u2455-\\uffff]*\\()",
            },
          ],
          "#function_decl": [
            {
              token: [
                "keyword.other.julia",
                "meta.function.julia",
                "entity.name.function.julia",
                "meta.function.julia",
                "text",
              ],
              regex:
                "(function|macro)(\\s*)([a-zA-Z0-9_\\{]+!?)([\\w\\xff-\\u218e\\u2455-\\uffff]*)([(\\\\{])",
            },
          ],
          "#keyword": [
            {
              token: "keyword.other.julia",
              regex:
                "\\b(?:function|type|immutable|macro|quote|abstract|bitstype|typealias|module|baremodule|new)\\b",
            },
            {
              token: "keyword.control.julia",
              regex:
                "\\b(?:if|else|elseif|while|for|in|begin|let|end|do|try|catch|finally|return|break|continue)\\b",
            },
            {
              token: "storage.modifier.variable.julia",
              regex:
                "\\b(?:global|local|const|export|import|importall|using)\\b",
            },
            {
              token: "variable.macro.julia",
              regex: "@[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b",
            },
          ],
          "#number": [
            {
              token: "constant.numeric.julia",
              regex:
                "\\b0(?:x|X)[0-9a-fA-F]*|(?:\\b[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:(?:e|E)(?:\\+|-)?[0-9]*)?(?:im)?|\\bInf(?:32)?\\b|\\bNaN(?:32)?\\b|\\btrue\\b|\\bfalse\\b",
            },
          ],
          "#operator": [
            {
              token: "keyword.operator.update.julia",
              regex:
                "=|:=|\\+=|-=|\\*=|/=|//=|\\.//=|\\.\\*=|\\\\=|\\.\\\\=|^=|\\.^=|%=|\\|=|&=|\\$=|<<=|>>=",
            },
            { token: "keyword.operator.ternary.julia", regex: "\\?|:" },
            { token: "keyword.operator.boolean.julia", regex: "\\|\\||&&|!" },
            { token: "keyword.operator.arrow.julia", regex: "->|<-|--\x3e" },
            {
              token: "keyword.operator.relation.julia",
              regex:
                ">|<|>=|<=|==|!=|\\.>|\\.<|\\.>=|\\.>=|\\.==|\\.!=|\\.=|\\.!|<:|:>",
            },
            { token: "keyword.operator.range.julia", regex: ":" },
            { token: "keyword.operator.shift.julia", regex: "<<|>>" },
            { token: "keyword.operator.bitwise.julia", regex: "\\||\\&|~" },
            {
              token: "keyword.operator.arithmetic.julia",
              regex:
                "\\+|-|\\*|\\.\\*|/|\\./|//|\\.//|%|\\.%|\\\\|\\.\\\\|\\^|\\.\\^",
            },
            { token: "keyword.operator.isa.julia", regex: "::" },
            {
              token: "keyword.operator.dots.julia",
              regex: "\\.(?=[a-zA-Z])|\\.\\.+",
            },
            {
              token: "keyword.operator.interpolation.julia",
              regex: "\\$#?(?=.)",
            },
            {
              token: ["variable", "keyword.operator.transposed-variable.julia"],
              regex: "([\\w\\xff-\\u218e\\u2455-\\uffff]+)((?:'|\\.')*\\.?')",
            },
            { token: "text", regex: "\\[|\\(" },
            {
              token: ["text", "keyword.operator.transposed-matrix.julia"],
              regex: "([\\]\\)])((?:'|\\.')*\\.?')",
            },
          ],
          "#string": [
            {
              token: "punctuation.definition.string.begin.julia",
              regex: "'",
              push: [
                {
                  token: "punctuation.definition.string.end.julia",
                  regex: "'",
                  next: "pop",
                },
                { include: "#string_escaped_char" },
                { defaultToken: "string.quoted.single.julia" },
              ],
            },
            {
              token: "punctuation.definition.string.begin.julia",
              regex: '"',
              push: [
                {
                  token: "punctuation.definition.string.end.julia",
                  regex: '"',
                  next: "pop",
                },
                { include: "#string_escaped_char" },
                { defaultToken: "string.quoted.double.julia" },
              ],
            },
            {
              token: "punctuation.definition.string.begin.julia",
              regex: '\\b[\\w\\xff-\\u218e\\u2455-\\uffff]+"',
              push: [
                {
                  token: "punctuation.definition.string.end.julia",
                  regex: '"[\\w\\xff-\\u218e\\u2455-\\uffff]*',
                  next: "pop",
                },
                { include: "#string_custom_escaped_char" },
                { defaultToken: "string.quoted.custom-double.julia" },
              ],
            },
            {
              token: "punctuation.definition.string.begin.julia",
              regex: "`",
              push: [
                {
                  token: "punctuation.definition.string.end.julia",
                  regex: "`",
                  next: "pop",
                },
                { include: "#string_escaped_char" },
                { defaultToken: "string.quoted.backtick.julia" },
              ],
            },
          ],
          "#string_custom_escaped_char": [
            { token: "constant.character.escape.julia", regex: '\\\\"' },
          ],
          "#string_escaped_char": [
            {
              token: "constant.character.escape.julia",
              regex:
                "\\\\(?:\\\\|[0-3]\\d{,2}|[4-7]\\d?|x[a-fA-F0-9]{,2}|u[a-fA-F0-9]{,4}|U[a-fA-F0-9]{,8}|.)",
            },
          ],
          "#type_decl": [
            {
              token: [
                "keyword.control.type.julia",
                "meta.type.julia",
                "entity.name.type.julia",
                "entity.other.inherited-class.julia",
                "punctuation.separator.inheritance.julia",
                "entity.other.inherited-class.julia",
              ],
              regex:
                "(type|immutable)(\\s+)([a-zA-Z0-9_]+)(?:(\\s*)(<:)(\\s*[.a-zA-Z0-9_:]+))?",
            },
            {
              token: ["other.typed-variable.julia", "support.type.julia"],
              regex: "([a-zA-Z0-9_]+)(::[a-zA-Z0-9_{}]+)",
            },
          ],
        }),
          this.normalizeRules();
      };
    (r.metaData = {
      fileTypes: ["jl"],
      firstLineMatch: "^#!.*\\bjulia\\s*$",
      foldingStartMarker:
        "^\\s*(?:if|while|for|begin|function|macro|module|baremodule|type|immutable|let)\\b(?!.*\\bend\\b).*$",
      foldingStopMarker: "^\\s*(?:end)\\b.*$",
      name: "Julia",
      scopeName: "source.julia",
    }),
      o.inherits(r, n),
      (t.JuliaHighlightRules = r);
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
    function (e, t, i) {
      "use strict";
      var o = e("../../lib/oop"),
        n = e("../../range").Range,
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
            (this.getFoldWidget = function (e, t, i) {
              var o = e.getLine(i);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              var n = this._getFoldWidgetBase(e, t, i);
              return !n && this.startRegionRe.test(o) ? "start" : n;
            }),
            (this.getFoldWidgetRange = function (e, t, i, o) {
              var n,
                r = e.getLine(i);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, i);
              if ((n = r.match(this.foldingStartMarker))) {
                var a = n.index;
                if (n[1]) return this.openingBracketBlock(e, n[1], i, a);
                var l = e.getCommentFoldRange(i, a + n[0].length, 1);
                return (
                  l &&
                    !l.isMultiLine() &&
                    (o
                      ? (l = this.getSectionRange(e, i))
                      : "all" != t && (l = null)),
                  l
                );
              }
              if ("markbegin" !== t && (n = r.match(this.foldingStopMarker))) {
                a = n.index + n[0].length;
                return n[1]
                  ? this.closingBracketBlock(e, n[1], i, a)
                  : e.getCommentFoldRange(i, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var i = e.getLine(t),
                  o = i.search(/\S/),
                  r = t,
                  a = i.length,
                  l = (t += 1),
                  u = e.getLength();
                ++t < u;

              ) {
                var s = (i = e.getLine(t)).search(/\S/);
                if (-1 !== s) {
                  if (o > s) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= r) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (o == s) break;
                  }
                  l = t;
                }
              }
              return new n(r, a, l, e.getLine(l).length);
            }),
            (this.getCommentRegionBlock = function (e, t, i) {
              for (
                var o = t.search(/\s*$/),
                  r = e.getLength(),
                  a = i,
                  l = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  u = 1;
                ++i < r;

              ) {
                t = e.getLine(i);
                var s = l.exec(t);
                if (s && (s[1] ? u-- : u++, !u)) break;
              }
              if (i > a) return new n(a, o, i, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/julia",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/julia_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, i) {
      "use strict";
      var o = e("../lib/oop"),
        n = e("./text").Mode,
        r = e("./julia_highlight_rules").JuliaHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        l = function () {
          (this.HighlightRules = r),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(l, n),
        function () {
          (this.lineCommentStart = "#"),
            (this.blockComment = ""),
            (this.$id = "ace/mode/julia");
        }.call(l.prototype),
        (t.Mode = l);
    }
  ),
  ace.require(["ace/mode/julia"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
