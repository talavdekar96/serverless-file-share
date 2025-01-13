ace.define(
  "ace/mode/latex_highlight_rules",
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
      a = function () {
        (this.$rules = {
          start: [
            { token: "comment", regex: "%.*$" },
            {
              token: [
                "keyword",
                "lparen",
                "variable.parameter",
                "rparen",
                "lparen",
                "storage.type",
                "rparen",
              ],
              regex:
                "(\\\\(?:documentclass|usepackage|input))(?:(\\[)([^\\]]*)(\\]))?({)([^}]*)(})",
            },
            {
              token: ["keyword", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\(?:label|v?ref|cite(?:[^{]*)))(?:({)([^}]*)(}))?",
            },
            {
              token: ["storage.type", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\begin)({)(verbatim)(})",
              next: "verbatim",
            },
            {
              token: ["storage.type", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\begin)({)(lstlisting)(})",
              next: "lstlisting",
            },
            {
              token: ["storage.type", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\(?:begin|end))({)([\\w*]*)(})",
            },
            {
              token: "storage.type",
              regex: /\\verb\b\*?/,
              next: [
                {
                  token: ["keyword.operator", "string", "keyword.operator"],
                  regex: "(.)(.*?)(\\1|$)|",
                  next: "start",
                },
              ],
            },
            { token: "storage.type", regex: "\\\\[a-zA-Z]+" },
            { token: "lparen", regex: "[[({]" },
            { token: "rparen", regex: "[\\])}]" },
            { token: "constant.character.escape", regex: "\\\\[^a-zA-Z]?" },
            { token: "string", regex: "\\${1,2}", next: "equation" },
          ],
          equation: [
            { token: "comment", regex: "%.*$" },
            { token: "string", regex: "\\${1,2}", next: "start" },
            {
              token: "constant.character.escape",
              regex: "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)",
            },
            { token: "error", regex: "^\\s*$", next: "start" },
            { defaultToken: "string" },
          ],
          verbatim: [
            {
              token: ["storage.type", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\end)({)(verbatim)(})",
              next: "start",
            },
            { defaultToken: "text" },
          ],
          lstlisting: [
            {
              token: ["storage.type", "lparen", "variable.parameter", "rparen"],
              regex: "(\\\\end)({)(lstlisting)(})",
              next: "start",
            },
            { defaultToken: "text" },
          ],
        }),
          this.normalizeRules();
      };
    n.inherits(a, o), (t.LatexHighlightRules = a);
  }
),
  ace.define(
    "ace/mode/rdoc_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
      "ace/mode/latex_highlight_rules",
    ],
    function (e, t, r) {
      "use strict";
      var n = e("../lib/oop"),
        o = (e("../lib/lang"), e("./text_highlight_rules").TextHighlightRules),
        a =
          (e("./latex_highlight_rules"),
          function () {
            this.$rules = {
              start: [
                { token: "comment", regex: "%.*$" },
                { token: "text", regex: "\\\\[$&%#\\{\\}]" },
                {
                  token: "keyword",
                  regex:
                    "\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b",
                  next: "nospell",
                },
                {
                  token: "keyword",
                  regex: "\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])",
                },
                { token: "paren.keyword.operator", regex: "[[({]" },
                { token: "paren.keyword.operator", regex: "[\\])}]" },
                { token: "text", regex: "\\s+" },
              ],
              nospell: [
                { token: "comment", regex: "%.*$", next: "start" },
                { token: "nospell.text", regex: "\\\\[$&%#\\{\\}]" },
                {
                  token: "keyword",
                  regex:
                    "\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b",
                },
                {
                  token: "keyword",
                  regex: "\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])",
                  next: "start",
                },
                { token: "paren.keyword.operator", regex: "[[({]" },
                { token: "paren.keyword.operator", regex: "[\\])]" },
                { token: "paren.keyword.operator", regex: "}", next: "start" },
                { token: "nospell.text", regex: "\\s+" },
                { token: "nospell.text", regex: "\\w+" },
              ],
            };
          });
      n.inherits(a, o), (t.RDocHighlightRules = a);
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
              a = e.findMatchingBracket({ row: t, column: o });
            if (!a || a.row == t) return 0;
            var i = this.$getIndent(e.getLine(a.row));
            e.replace(new n(t, 0, t, o - 1), i);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
    }
  ),
  ace.define(
    "ace/mode/rdoc",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/rdoc_highlight_rules",
      "ace/mode/matching_brace_outdent",
    ],
    function (e, t, r) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        a = e("./rdoc_highlight_rules").RDocHighlightRules,
        i = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = function (e) {
          (this.HighlightRules = a),
            (this.$outdent = new i()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      n.inherits(s, o),
        function () {
          (this.getNextLineIndent = function (e, t, r) {
            return this.$getIndent(t);
          }),
            (this.$id = "ace/mode/rdoc");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/rdoc"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
