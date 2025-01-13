ace.define(
  "ace/mode/ion_highlight_rules",
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
        var e = {
          token: this.createKeywordMapper(
            {
              "constant.language.bool.ion": "TRUE|FALSE",
              "constant.language.null.ion":
                "NULL.NULL|NULL.BOOL|NULL.INT|NULL.FLOAT|NULL.DECIMAL|NULL.TIMESTAMP|NULL.STRING|NULL.SYMBOL|NULL.BLOB|NULL.CLOB|NULL.STRUCT|NULL.LIST|NULL.SEXP|NULL",
            },
            "constant.other.symbol.identifier.ion",
            !0
          ),
          regex: "\\b\\w+(?:\\.\\w+)?\\b",
        };
        (this.$rules = {
          start: [{ include: "value" }],
          value: [
            { include: "whitespace" },
            { include: "comment" },
            { include: "annotation" },
            { include: "string" },
            { include: "number" },
            { include: "keywords" },
            { include: "symbol" },
            { include: "clob" },
            { include: "blob" },
            { include: "struct" },
            { include: "list" },
            { include: "sexp" },
          ],
          sexp: [
            {
              token: "punctuation.definition.sexp.begin.ion",
              regex: "\\(",
              push: [
                {
                  token: "punctuation.definition.sexp.end.ion",
                  regex: "\\)",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "storage.type.symbol.operator.ion",
                  regex:
                    "[\\!\\#\\%\\&\\*\\+\\-\\./\\;\\<\\=\\>\\?\\@\\^\\`\\|\\~]+",
                },
              ],
            },
          ],
          comment: [
            { token: "comment.line.ion", regex: "//[^\\n]*" },
            {
              token: "comment.block.ion",
              regex: "/\\*",
              push: [
                { token: "comment.block.ion", regex: "[*]/", next: "pop" },
                { token: "comment.block.ion", regex: "[^*/]+" },
                { token: "comment.block.ion", regex: "[*/]+" },
              ],
            },
          ],
          list: [
            {
              token: "punctuation.definition.list.begin.ion",
              regex: "\\[",
              push: [
                {
                  token: "punctuation.definition.list.end.ion",
                  regex: "\\]",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "punctuation.definition.list.separator.ion",
                  regex: ",",
                },
              ],
            },
          ],
          struct: [
            {
              token: "punctuation.definition.struct.begin.ion",
              regex: "\\{",
              push: [
                {
                  token: "punctuation.definition.struct.end.ion",
                  regex: "\\}",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "punctuation.definition.struct.separator.ion",
                  regex: ",|:",
                },
              ],
            },
          ],
          blob: [
            {
              token: [
                "punctuation.definition.blob.begin.ion",
                "string.other.blob.ion",
                "punctuation.definition.blob.end.ion",
              ],
              regex: '(\\{\\{)([^"]*)(\\}\\})',
            },
          ],
          clob: [
            {
              token: [
                "punctuation.definition.clob.begin.ion",
                "string.other.clob.ion",
                "punctuation.definition.clob.end.ion",
              ],
              regex: '(\\{\\{)("[^"]*")(\\}\\})',
            },
          ],
          symbol: [
            {
              token: "storage.type.symbol.quoted.ion",
              regex: "(['])((?:(?:\\\\')|(?:[^']))*?)(['])",
            },
            {
              token: "storage.type.symbol.identifier.ion",
              regex: "[\\$_a-zA-Z][\\$_a-zA-Z0-9]*",
            },
          ],
          number: [
            {
              token: "constant.numeric.timestamp.ion",
              regex:
                "\\d{4}(?:-\\d{2})?(?:-\\d{2})?T(?:\\d{2}:\\d{2})(?::\\d{2})?(?:\\.\\d+)?(?:Z|[-+]\\d{2}:\\d{2})?",
            },
            {
              token: "constant.numeric.timestamp.ion",
              regex: "\\d{4}-\\d{2}-\\d{2}T?",
            },
            {
              token: "constant.numeric.integer.binary.ion",
              regex: "-?0[bB][01](?:_?[01])*",
            },
            {
              token: "constant.numeric.integer.hex.ion",
              regex: "-?0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*",
            },
            {
              token: "constant.numeric.float.ion",
              regex:
                "-?(?:0|[1-9](?:_?\\d)*)(?:\\.(?:\\d(?:_?\\d)*)?)?(?:[eE][+-]?\\d+)",
            },
            {
              token: "constant.numeric.float.ion",
              regex: "(?:[-+]inf)|(?:nan)",
            },
            {
              token: "constant.numeric.decimal.ion",
              regex:
                "-?(?:0|[1-9](?:_?\\d)*)(?:(?:(?:\\.(?:\\d(?:_?\\d)*)?)(?:[dD][+-]?\\d+)|\\.(?:\\d(?:_?\\d)*)?)|(?:[dD][+-]?\\d+))",
            },
            {
              token: "constant.numeric.integer.ion",
              regex: "-?(?:0|[1-9](?:_?\\d)*)",
            },
          ],
          string: [
            {
              token: [
                "punctuation.definition.string.begin.ion",
                "string.quoted.double.ion",
                "punctuation.definition.string.end.ion",
              ],
              regex: '(["])((?:(?:\\\\")|(?:[^"]))*?)(["])',
            },
            {
              token: "punctuation.definition.string.begin.ion",
              regex: "'{3}",
              push: [
                {
                  token: "punctuation.definition.string.end.ion",
                  regex: "'{3}",
                  next: "pop",
                },
                { token: "string.quoted.triple.ion", regex: "(?:\\\\'|[^'])+" },
                { token: "string.quoted.triple.ion", regex: "'" },
              ],
            },
          ],
          annotation: [
            {
              token: [
                "variable.language.annotation.ion",
                "punctuation.definition.annotation.ion",
              ],
              regex: /('(?:[^'\\]|\\.)*')\s*(::)/,
            },
            {
              token: [
                "variable.language.annotation.ion",
                "punctuation.definition.annotation.ion",
              ],
              regex: "([\\$_a-zA-Z][\\$_a-zA-Z0-9]*)\\s*(::)",
            },
          ],
          whitespace: [{ token: "text.ion", regex: "\\s+" }],
        }),
          (this.$rules.keywords = [e]),
          this.normalizeRules();
      };
    i.inherits(r, o), (t.IonHighlightRules = r);
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
                  c = e.getLength();
                ++t < c;

              ) {
                var u = (n = e.getLine(t)).search(/\S/);
                if (-1 !== u) {
                  if (i > u) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= r) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (i == u) break;
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
                  c = 1;
                ++n < r;

              ) {
                t = e.getLine(n);
                var u = s.exec(t);
                if (u && (u[1] ? c-- : c++, !c)) break;
              }
              if (n > a) return new o(a, i, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/ion",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/ion_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./ion_highlight_rules").IonHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("./folding/cstyle").FoldMode,
        c = function () {
          (this.HighlightRules = r),
            (this.$outdent = new a()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new s());
        };
      i.inherits(c, o),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.getNextLineIndent = function (e, t, n) {
              var i = this.$getIndent(t);
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (i += n);
              return i;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/ion");
        }.call(c.prototype),
        (t.Mode = c);
    }
  ),
  ace.require(["ace/mode/ion"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
