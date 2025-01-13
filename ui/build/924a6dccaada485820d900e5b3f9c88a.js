ace.define(
  "ace/mode/lucene_highlight_rules",
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
        this.$rules = {
          start: [
            {
              token: "constant.language.escape",
              regex: /\\[\-+&|!(){}\[\]^"~*?:\\]/,
            },
            { token: "constant.character.negation", regex: "\\-" },
            { token: "constant.character.interro", regex: "\\?" },
            { token: "constant.character.required", regex: "\\+" },
            { token: "constant.character.asterisk", regex: "\\*" },
            {
              token: "constant.character.proximity",
              regex: "~(?:0\\.[0-9]+|[0-9]+)?",
            },
            { token: "keyword.operator", regex: "(AND|OR|NOT|TO)\\b" },
            { token: "paren.lparen", regex: "[\\(\\{\\[]" },
            { token: "paren.rparen", regex: "[\\)\\}\\]]" },
            { token: "keyword.operator", regex: /[><=^]/ },
            { token: "constant.numeric", regex: /\d[\d.-]*/ },
            { token: "string", regex: /"(?:\\"|[^"])*"/ },
            {
              token: "keyword",
              regex: /(?:\\.|[^\s\-+&|!(){}\[\]^"~*?:\\])+:/,
              next: "maybeRegex",
            },
            { token: "term", regex: /\w+/ },
            { token: "text", regex: /\s+/ },
          ],
          maybeRegex: [
            { token: "text", regex: /\s+/ },
            { token: "string.regexp.start", regex: "/", next: "regex" },
            { regex: "", next: "start" },
          ],
          regex: [
            {
              token: "regexp.keyword.operator",
              regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
            },
            { token: "string.regexp.end", regex: "/[sxngimy]*", next: "start" },
            {
              token: "invalid",
              regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/,
            },
            {
              token: "constant.language.escape",
              regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/,
            },
            { token: "constant.language.escape", regex: "<d+-d+>|[~&@]" },
            { token: "constant.language.delimiter", regex: /\|/ },
            {
              token: "constant.language.escape",
              regex: /\[\^?/,
              next: "regex_character_class",
            },
            { token: "empty", regex: "$", next: "start" },
            { defaultToken: "string.regexp" },
          ],
          regex_character_class: [
            {
              token: "regexp.charclass.keyword.operator",
              regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
            },
            { token: "constant.language.escape", regex: "]", next: "regex" },
            { token: "constant.language.escape", regex: "-" },
            { token: "empty", regex: "$", next: "start" },
            { defaultToken: "string.regexp.characterclass" },
          ],
        };
      };
    n.inherits(a, o), (t.LuceneHighlightRules = a);
  }
),
  ace.define(
    "ace/mode/lucene",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/lucene_highlight_rules",
    ],
    function (e, t, r) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        a = e("./lucene_highlight_rules").LuceneHighlightRules,
        g = function () {
          (this.HighlightRules = a), (this.$behaviour = this.$defaultBehaviour);
        };
      n.inherits(g, o),
        function () {
          this.$id = "ace/mode/lucene";
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.require(["ace/mode/lucene"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
