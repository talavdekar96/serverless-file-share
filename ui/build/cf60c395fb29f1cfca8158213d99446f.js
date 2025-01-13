ace.define(
  "ace/mode/smithy_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var n = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        (this.$rules = {
          start: [
            { include: "#comment" },
            {
              token: [
                "meta.keyword.statement.smithy",
                "variable.other.smithy",
                "text",
                "keyword.operator.smithy",
              ],
              regex: /^(\$)(\s+.+)(\s*)(=)/,
            },
            {
              token: [
                "keyword.statement.smithy",
                "text",
                "entity.name.type.namespace.smithy",
              ],
              regex: /^(namespace)(\s+)([A-Z-a-z0-9_\.#$-]+)/,
            },
            {
              token: [
                "keyword.statement.smithy",
                "text",
                "keyword.statement.smithy",
                "text",
                "entity.name.type.smithy",
              ],
              regex: /^(use)(\s+)(shape|trait)(\s+)([A-Z-a-z0-9_\.#$-]+)\b/,
            },
            {
              token: [
                "keyword.statement.smithy",
                "variable.other.smithy",
                "text",
                "keyword.operator.smithy",
              ],
              regex: /^(metadata)(\s+.+)(\s*)(=)/,
            },
            {
              token: [
                "keyword.statement.smithy",
                "text",
                "entity.name.type.smithy",
              ],
              regex:
                /^(apply|byte|short|integer|long|float|double|bigInteger|bigDecimal|boolean|blob|string|timestamp|service|resource|trait|list|map|set|structure|union|document)(\s+)([A-Z-a-z0-9_\.#$-]+)\b/,
            },
            {
              token: [
                "keyword.operator.smithy",
                "text",
                "entity.name.type.smithy",
                "text",
                "text",
                "support.function.smithy",
                "text",
                "text",
                "support.function.smithy",
              ],
              regex:
                /^(operation)(\s+)([A-Z-a-z0-9_\.#$-]+)(\(.*\))(?:(\s*)(->)(\s*[A-Z-a-z0-9_\.#$-]+))?(?:(\s+)(errors))?/,
            },
            { include: "#trait" },
            {
              token: [
                "support.type.property-name.smithy",
                "punctuation.separator.dictionary.pair.smithy",
              ],
              regex: /([A-Z-a-z0-9_\.#$-]+)(:)/,
            },
            { include: "#value" },
            { token: "keyword.other.smithy", regex: /\->/ },
          ],
          "#comment": [
            { include: "#doc_comment" },
            { include: "#line_comment" },
          ],
          "#doc_comment": [
            { token: "comment.block.documentation.smithy", regex: /\/\/\/.*/ },
          ],
          "#line_comment": [
            { token: "comment.line.double-slash.smithy", regex: /\/\/.*/ },
          ],
          "#trait": [
            {
              token: [
                "punctuation.definition.annotation.smithy",
                "storage.type.annotation.smithy",
              ],
              regex: /(@)([0-9a-zA-Z\.#-]+)/,
            },
            {
              token: [
                "punctuation.definition.annotation.smithy",
                "punctuation.definition.object.end.smithy",
                "meta.structure.smithy",
              ],
              regex: /(@)([0-9a-zA-Z\.#-]+)(\()/,
              push: [
                {
                  token: "punctuation.definition.object.end.smithy",
                  regex: /\)/,
                  next: "pop",
                },
                { include: "#value" },
                { include: "#object_inner" },
                { defaultToken: "meta.structure.smithy" },
              ],
            },
          ],
          "#value": [
            { include: "#constant" },
            { include: "#number" },
            { include: "#string" },
            { include: "#array" },
            { include: "#object" },
          ],
          "#array": [
            {
              token: "punctuation.definition.array.begin.smithy",
              regex: /\[/,
              push: [
                {
                  token: "punctuation.definition.array.end.smithy",
                  regex: /\]/,
                  next: "pop",
                },
                { include: "#comment" },
                { include: "#value" },
                { token: "punctuation.separator.array.smithy", regex: /,/ },
                {
                  token: "invalid.illegal.expected-array-separator.smithy",
                  regex: /[^\s\]]/,
                },
                { defaultToken: "meta.structure.array.smithy" },
              ],
            },
          ],
          "#constant": [
            {
              token: "constant.language.smithy",
              regex: /\b(?:true|false|null)\b/,
            },
          ],
          "#number": [
            {
              token: "constant.numeric.smithy",
              regex: /-?(?:0|[1-9]\d*)(?:(?:\.\d+)?(?:[eE][+-]?\d+)?)?/,
            },
          ],
          "#object": [
            {
              token: "punctuation.definition.dictionary.begin.smithy",
              regex: /\{/,
              push: [
                {
                  token: "punctuation.definition.dictionary.end.smithy",
                  regex: /\}/,
                  next: "pop",
                },
                { include: "#trait" },
                { include: "#object_inner" },
                { defaultToken: "meta.structure.dictionary.smithy" },
              ],
            },
          ],
          "#object_inner": [
            { include: "#comment" },
            { include: "#string_key" },
            {
              token: "punctuation.separator.dictionary.key-value.smithy",
              regex: /:/,
              push: [
                {
                  token: "punctuation.separator.dictionary.pair.smithy",
                  regex: /,|(?=\})/,
                  next: "pop",
                },
                { include: "#value" },
                {
                  token: "invalid.illegal.expected-dictionary-separator.smithy",
                  regex: /[^\s,]/,
                },
                { defaultToken: "meta.structure.dictionary.value.smithy" },
              ],
            },
            {
              token: "invalid.illegal.expected-dictionary-separator.smithy",
              regex: /[^\s\}]/,
            },
          ],
          "#string_key": [
            { include: "#identifier_key" },
            { include: "#dquote_key" },
            { include: "#squote_key" },
          ],
          "#identifier_key": [
            {
              token: "support.type.property-name.smithy",
              regex: /[A-Z-a-z0-9_\.#$-]+/,
            },
          ],
          "#dquote_key": [{ include: "#dquote" }],
          "#squote_key": [{ include: "#squote" }],
          "#string": [
            { include: "#textblock" },
            { include: "#dquote" },
            { include: "#squote" },
            { include: "#identifier" },
          ],
          "#textblock": [
            {
              token: "punctuation.definition.string.begin.smithy",
              regex: /"""/,
              push: [
                {
                  token: "punctuation.definition.string.end.smithy",
                  regex: /"""/,
                  next: "pop",
                },
                { token: "constant.character.escape.smithy", regex: /\\./ },
                { defaultToken: "string.quoted.double.smithy" },
              ],
            },
          ],
          "#dquote": [
            {
              token: "punctuation.definition.string.begin.smithy",
              regex: /"/,
              push: [
                {
                  token: "punctuation.definition.string.end.smithy",
                  regex: /"/,
                  next: "pop",
                },
                { token: "constant.character.escape.smithy", regex: /\\./ },
                { defaultToken: "string.quoted.double.smithy" },
              ],
            },
          ],
          "#squote": [
            {
              token: "punctuation.definition.string.begin.smithy",
              regex: /'/,
              push: [
                {
                  token: "punctuation.definition.string.end.smithy",
                  regex: /'/,
                  next: "pop",
                },
                { token: "constant.character.escape.smithy", regex: /\\./ },
                { defaultToken: "string.quoted.single.smithy" },
              ],
            },
          ],
          "#identifier": [
            {
              token: "storage.type.smithy",
              regex: /[A-Z-a-z_][A-Z-a-z0-9_\.#$-]*/,
            },
          ],
        }),
          this.normalizeRules();
      };
    (r.metaData = {
      name: "Smithy",
      fileTypes: ["smithy"],
      scopeName: "source.smithy",
      foldingStartMarker: "(\\{|\\[)\\s*",
      foldingStopMarker: "\\s*(\\}|\\])",
    }),
      n.inherits(r, o),
      (t.SmithyHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, i) {
      "use strict";
      var n = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var i = e.getLine(t).match(/^(\s*\})/);
            if (!i) return 0;
            var o = i[1].length,
              r = e.findMatchingBracket({ row: t, column: o });
            if (!r || r.row == t) return 0;
            var a = this.$getIndent(e.getLine(r.row));
            e.replace(new n(t, 0, t, o - 1), a);
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
    function (e, t, i) {
      "use strict";
      var n = e("../../lib/oop"),
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
      n.inherits(a, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, i) {
              var n = e.getLine(i);
              if (
                this.singleLineBlockCommentRe.test(n) &&
                !this.startRegionRe.test(n) &&
                !this.tripleStarBlockCommentRe.test(n)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, i);
              return !o && this.startRegionRe.test(n) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, i, n) {
              var o,
                r = e.getLine(i);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, i);
              if ((o = r.match(this.foldingStartMarker))) {
                var a = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], i, a);
                var s = e.getCommentFoldRange(i, a + o[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (n
                      ? (s = this.getSectionRange(e, i))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (o = r.match(this.foldingStopMarker))) {
                a = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], i, a)
                  : e.getCommentFoldRange(i, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var i = e.getLine(t),
                  n = i.search(/\S/),
                  r = t,
                  a = i.length,
                  s = (t += 1),
                  u = e.getLength();
                ++t < u;

              ) {
                var c = (i = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (n > c) break;
                  var d = this.getFoldWidgetRange(e, "all", t);
                  if (d) {
                    if (d.start.row <= r) break;
                    if (d.isMultiLine()) t = d.end.row;
                    else if (n == c) break;
                  }
                  s = t;
                }
              }
              return new o(r, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, i) {
              for (
                var n = t.search(/\s*$/),
                  r = e.getLength(),
                  a = i,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  u = 1;
                ++i < r;

              ) {
                t = e.getLine(i);
                var c = s.exec(t);
                if (c && (c[1] ? u-- : u++, !u)) break;
              }
              if (i > a) return new o(a, n, i, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/smithy",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/smithy_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, i) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./smithy_highlight_rules").SmithyHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = r),
            (this.$outdent = new a()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new s());
        };
      n.inherits(u, o),
        function () {
          (this.lineCommentStart = "//"),
            (this.$quotes = { '"': '"' }),
            (this.checkOutdent = function (e, t, i) {
              return this.$outdent.checkOutdent(t, i);
            }),
            (this.autoOutdent = function (e, t, i) {
              this.$outdent.autoOutdent(t, i);
            }),
            (this.$id = "ace/mode/smithy");
        }.call(u.prototype),
        (t.Mode = u);
    }
  ),
  ace.require(["ace/mode/smithy"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
