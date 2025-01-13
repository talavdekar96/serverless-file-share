ace.define(
  "ace/mode/terraform_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, r) {
    "use strict";
    var n = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      i = function () {
        (this.$rules = {
          start: [
            {
              token: ["storage.function.terraform"],
              regex: "\\b(output|resource|data|variable|module|export)\\b",
            },
            {
              token: "variable.terraform",
              regex: "\\$\\s",
              push: [
                { token: "keyword.terraform", regex: "(-var-file|-var)" },
                { token: "variable.terraform", regex: "\\n|$", next: "pop" },
                { include: "strings" },
                { include: "variables" },
                { include: "operators" },
                { defaultToken: "text" },
              ],
            },
            {
              token: "language.support.class",
              regex:
                "\\b(timeouts|provider|connection|provisioner|lifecycleprovider|atlas)\\b",
            },
            { token: "singleline.comment.terraform", regex: "#.*$" },
            { token: "singleline.comment.terraform", regex: "//.*$" },
            {
              token: "multiline.comment.begin.terraform",
              regex: /\/\*/,
              push: "blockComment",
            },
            {
              token: "storage.function.terraform",
              regex: "^\\s*(locals|terraform)\\s*{",
            },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { include: "constants" },
            { include: "strings" },
            { include: "operators" },
            { include: "variables" },
          ],
          blockComment: [
            {
              regex: /\*\//,
              token: "multiline.comment.end.terraform",
              next: "pop",
            },
            { defaultToken: "comment" },
          ],
          constants: [
            {
              token: "constant.language.terraform",
              regex: "\\b(true|false|yes|no|on|off|EOF)\\b",
            },
            {
              token: "constant.numeric.terraform",
              regex:
                "(\\b([0-9]+)([kKmMgG]b?)?\\b)|(\\b(0x[0-9A-Fa-f]+)([kKmMgG]b?)?\\b)",
            },
          ],
          variables: [
            {
              token: ["variable.assignment.terraform", "keyword.operator"],
              regex: "\\b([a-zA-Z_]+)(\\s*=)",
            },
          ],
          interpolated_variables: [
            {
              token: "variable.terraform",
              regex: "\\b(var|self|count|path|local)\\b(?:\\.*[a-zA-Z_-]*)?",
            },
          ],
          strings: [
            {
              token: "punctuation.quote.terraform",
              regex: "'",
              push: [
                {
                  token: "punctuation.quote.terraform",
                  regex: "'",
                  next: "pop",
                },
                { include: "escaped_chars" },
                { defaultToken: "string" },
              ],
            },
            {
              token: "punctuation.quote.terraform",
              regex: '"',
              push: [
                {
                  token: "punctuation.quote.terraform",
                  regex: '"',
                  next: "pop",
                },
                { include: "interpolation" },
                { include: "escaped_chars" },
                { defaultToken: "string" },
              ],
            },
          ],
          escaped_chars: [
            { token: "constant.escaped_char.terraform", regex: "\\\\." },
          ],
          operators: [
            {
              token: "keyword.operator",
              regex: "\\?|:|==|!=|>|<|>=|<=|&&|\\|\\||!|%|&|\\*|\\+|\\-|/|=",
            },
          ],
          interpolation: [
            {
              token: "punctuation.interpolated.begin.terraform",
              regex: "\\$?\\$\\{",
              push: [
                {
                  token: "punctuation.interpolated.end.terraform",
                  regex: "\\}",
                  next: "pop",
                },
                { include: "interpolated_variables" },
                { include: "operators" },
                { include: "constants" },
                { include: "strings" },
                { include: "functions" },
                { include: "parenthesis" },
                { defaultToken: "punctuation" },
              ],
            },
          ],
          functions: [
            {
              token: "keyword.function.terraform",
              regex:
                "\\b(abs|basename|base64decode|base64encode|base64gzip|base64sha256|base64sha512|bcrypt|ceil|chomp|chunklist|cidrhost|cidrnetmask|cidrsubnet|coalesce|coalescelist|compact|concat|contains|dirname|distinct|element|file|floor|flatten|format|formatlist|indent|index|join|jsonencode|keys|length|list|log|lookup|lower|map|matchkeys|max|merge|min|md5|pathexpand|pow|replace|rsadecrypt|sha1|sha256|sha512|signum|slice|sort|split|substr|timestamp|timeadd|title|transpose|trimspace|upper|urlencode|uuid|values|zipmap)\\b",
            },
          ],
          parenthesis: [
            { token: "paren.lparen", regex: "\\[" },
            { token: "paren.rparen", regex: "\\]" },
          ],
        }),
          this.normalizeRules();
      };
    n.inherits(i, o), (t.TerraformHighlightRules = i);
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
    function (e, t, r) {
      "use strict";
      var n = e("../../lib/oop"),
        o = e("../../range").Range,
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
      n.inherits(a, i),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, r) {
              var n = e.getLine(r);
              if (
                this.singleLineBlockCommentRe.test(n) &&
                !this.startRegionRe.test(n) &&
                !this.tripleStarBlockCommentRe.test(n)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, r);
              return !o && this.startRegionRe.test(n) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, r, n) {
              var o,
                i = e.getLine(r);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, r);
              if ((o = i.match(this.foldingStartMarker))) {
                var a = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], r, a);
                var s = e.getCommentFoldRange(r, a + o[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (n
                      ? (s = this.getSectionRange(e, r))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (o = i.match(this.foldingStopMarker))) {
                a = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], r, a)
                  : e.getCommentFoldRange(r, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var r = e.getLine(t),
                  n = r.search(/\S/),
                  i = t,
                  a = r.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var c = (r = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (n > c) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= i) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (n == c) break;
                  }
                  s = t;
                }
              }
              return new o(i, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, r) {
              for (
                var n = t.search(/\s*$/),
                  i = e.getLength(),
                  a = r,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++r < i;

              ) {
                t = e.getLine(r);
                var c = s.exec(t);
                if (c && (c[1] ? l-- : l++, !l)) break;
              }
              if (r > a) return new o(a, n, r, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, r) {
      "use strict";
      var n = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var r = e.getLine(t).match(/^(\s*\})/);
            if (!r) return 0;
            var o = r[1].length,
              i = e.findMatchingBracket({ row: t, column: o });
            if (!i || i.row == t) return 0;
            var a = this.$getIndent(e.getLine(i.row));
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
    "ace/mode/terraform",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/terraform_highlight_rules",
      "ace/mode/folding/cstyle",
      "ace/mode/matching_brace_outdent",
    ],
    function (e, t, r) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        i = e("./terraform_highlight_rules").TerraformHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = e("./matching_brace_outdent").MatchingBraceOutdent,
        l = function () {
          o.call(this),
            (this.HighlightRules = i),
            (this.$outdent = new s()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new a());
        };
      n.inherits(l, o),
        function () {
          (this.lineCommentStart = ["#", "//"]),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/terraform");
        }.call(l.prototype),
        (t.Mode = l);
    }
  ),
  ace.require(["ace/mode/terraform"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
