ace.define(
  "ace/mode/puppet_highlight_rules",
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
      r = e("./text_highlight_rules").TextHighlightRules,
      o = function () {
        (this.$rules = {
          start: [
            {
              token: [
                "keyword.type.puppet",
                "constant.class.puppet",
                "keyword.inherits.puppet",
                "constant.class.puppet",
              ],
              regex:
                '^\\s*(class)(\\s+(?:[-_A-Za-z0-9".]+::)*[-_A-Za-z0-9".]+\\s*)(?:(inherits\\s*)(\\s+(?:[-_A-Za-z0-9".]+::)*[-_A-Za-z0-9".]+\\s*))?',
            },
            {
              token: [
                "storage.function.puppet",
                "name.function.puppet",
                "punctuation.lpar",
              ],
              regex: "(^\\s*define)(\\s+[a-zA-Z0-9_:]+\\s*)(\\()",
              push: [
                { token: "punctuation.rpar.puppet", regex: "\\)", next: "pop" },
                { include: "constants" },
                { include: "variable" },
                { include: "strings" },
                { include: "operators" },
                { defaultToken: "string" },
              ],
            },
            {
              token: ["language.support.class", "keyword.operator"],
              regex: "\\b([a-zA-Z_]+)(\\s+=>)",
            },
            {
              token: [
                "exported.resource.puppet",
                "keyword.name.resource.puppet",
                "paren.lparen",
              ],
              regex: "(\\@\\@)?(\\s*[a-zA-Z_]*)(\\s*\\{)",
            },
            {
              token: "qualified.variable.puppet",
              regex:
                "(\\$([a-z][a-z0-9_]*)?(::[a-z][a-z0-9_]*)*::[a-z0-9_][a-zA-Z0-9_]*)",
            },
            { token: "singleline.comment.puppet", regex: "#(.)*$" },
            {
              token: "multiline.comment.begin.puppet",
              regex: "^\\s*\\/\\*",
              push: "blockComment",
            },
            {
              token: "keyword.control.puppet",
              regex:
                "\\b(case|if|unless|else|elsif|in|default:|and|or)\\s+(?!::)",
            },
            {
              token: "keyword.control.puppet",
              regex:
                "\\b(import|default|inherits|include|require|contain|node|application|consumes|environment|site|function|produces)\\b",
            },
            {
              token: "support.function.puppet",
              regex:
                "\\b(lest|str2bool|escape|gsub|Timestamp|Timespan|with|alert|crit|debug|notice|sprintf|split|step|strftime|slice|shellquote|type|sha1|defined|scanf|reverse_each|regsubst|return|emerg|reduce|err|failed|fail|versioncmp|file|generate|then|info|realize|search|tag|tagged|template|epp|warning|hiera_include|each|assert_type|binary_file|create_resources|dig|digest|filter|lookup|find_file|fqdn_rand|hiera_array|hiera_hash|inline_epp|inline_template|map|match|md5|new|next)\\b",
            },
            {
              token: "constant.types.puppet",
              regex:
                "\\b(String|File|Package|Service|Class|Integer|Array|Catalogentry|Variant|Boolean|Undef|Number|Hash|Float|Numeric|NotUndef|Callable|Optional|Any|Regexp|Sensitive|Sensitive.new|Type|Resource|Default|Enum|Scalar|Collection|Data|Pattern|Tuple|Struct)\\b",
            },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { include: "variable" },
            { include: "constants" },
            { include: "strings" },
            { include: "operators" },
            {
              token: "regexp.begin.string.puppet",
              regex: "\\s*(\\/(\\S)+)\\/",
            },
          ],
          blockComment: [
            {
              regex: "\\*\\/",
              token: "multiline.comment.end.puppet",
              next: "pop",
            },
            { defaultToken: "comment" },
          ],
          constants: [
            {
              token: "constant.language.puppet",
              regex:
                "\\b(false|true|running|stopped|installed|purged|latest|file|directory|held|undef|present|absent|link|mounted|unmounted)\\b",
            },
          ],
          variable: [
            { token: "variable.puppet", regex: "(\\$[a-z0-9_{][a-zA-Z0-9_]*)" },
          ],
          strings: [
            {
              token: "punctuation.quote.puppet",
              regex: "'",
              push: [
                { token: "punctuation.quote.puppet", regex: "'", next: "pop" },
                { include: "escaped_chars" },
                { defaultToken: "string" },
              ],
            },
            {
              token: "punctuation.quote.puppet",
              regex: '"',
              push: [
                { token: "punctuation.quote.puppet", regex: '"', next: "pop" },
                { include: "escaped_chars" },
                { include: "variable" },
                { defaultToken: "string" },
              ],
            },
          ],
          escaped_chars: [
            { token: "constant.escaped_char.puppet", regex: "\\\\." },
          ],
          operators: [
            {
              token: "keyword.operator",
              regex:
                "\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|=|::|,",
            },
          ],
        }),
          this.normalizeRules();
      };
    i.inherits(o, r), (t.PuppetHighlightRules = o);
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
        r = e("../../range").Range,
        o = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      i.inherits(a, o),
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
              var r = this._getFoldWidgetBase(e, t, n);
              return !r && this.startRegionRe.test(i) ? "start" : r;
            }),
            (this.getFoldWidgetRange = function (e, t, n, i) {
              var r,
                o = e.getLine(n);
              if (this.startRegionRe.test(o))
                return this.getCommentRegionBlock(e, o, n);
              if ((r = o.match(this.foldingStartMarker))) {
                var a = r.index;
                if (r[1]) return this.openingBracketBlock(e, r[1], n, a);
                var s = e.getCommentFoldRange(n, a + r[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (i
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (r = o.match(this.foldingStopMarker))) {
                a = r.index + r[0].length;
                return r[1]
                  ? this.closingBracketBlock(e, r[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  i = n.search(/\S/),
                  o = t,
                  a = n.length,
                  s = (t += 1),
                  p = e.getLength();
                ++t < p;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (i > l) break;
                  var u = this.getFoldWidgetRange(e, "all", t);
                  if (u) {
                    if (u.start.row <= o) break;
                    if (u.isMultiLine()) t = u.end.row;
                    else if (i == l) break;
                  }
                  s = t;
                }
              }
              return new r(o, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var i = t.search(/\s*$/),
                  o = e.getLength(),
                  a = n,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  p = 1;
                ++n < o;

              ) {
                t = e.getLine(n);
                var l = s.exec(t);
                if (l && (l[1] ? p-- : p++, !p)) break;
              }
              if (n > a) return new r(a, i, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var i = e("../range").Range,
        r = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var r = n[1].length,
              o = e.findMatchingBracket({ row: t, column: r });
            if (!o || o.row == t) return 0;
            var a = this.$getIndent(e.getLine(o.row));
            e.replace(new i(t, 0, t, r - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(r.prototype),
        (t.MatchingBraceOutdent = r);
    }
  ),
  ace.define(
    "ace/mode/puppet",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/puppet_highlight_rules",
      "ace/mode/folding/cstyle",
      "ace/mode/matching_brace_outdent",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        r = e("./text").Mode,
        o = e("./puppet_highlight_rules").PuppetHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = e("./matching_brace_outdent").MatchingBraceOutdent,
        p = function () {
          r.call(this),
            (this.HighlightRules = o),
            (this.$outdent = new s()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new a());
        };
      i.inherits(p, r),
        function () {
          (this.lineCommentStart = "#"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/puppet");
        }.call(p.prototype),
        (t.Mode = p);
    }
  ),
  ace.require(["ace/mode/puppet"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
