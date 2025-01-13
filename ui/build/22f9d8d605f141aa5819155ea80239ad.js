ace.define(
  "ace/mode/vhdl_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, r) {
    "use strict";
    var o = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      n = function () {
        var e = this.createKeywordMapper(
          {
            "keyword.operator":
              "abs|and|mod|nand|nor|not|rem|rol|ror|sla|sll|srasrl|xnor|xor",
            keyword:
              "access|after|alias|all|architecture|assert|attribute|begin|block|body|buffer|bus|case|component|configuration|context|disconnect|downto|else|elsif|end|entity|exit|file|for|force|function|generate|generic|group|guarded|if|impure|in|inertial|inout|is|label|library|linkage|literal|loop|map|new|next|of|on|or|open|others|out|package|parameter|port|postponed|procedure|process|protected|pure|range|record|register|reject|release|report|return|select|severity|shared|signal|subtype|then|to|transport|type|unaffected|units|until|use|variable|wait|when|while|with",
            "constant.language": "true|false|null",
            "storage.modifier": "array|constant",
            "storage.type":
              "bit|bit_vector|boolean|character|integer|line|natural|positive|real|register|signed|std_logic|std_logic_vector|string||text|time|unsigned",
          },
          "identifier",
          !0
        );
        this.$rules = {
          start: [
            { token: "comment", regex: "--.*$" },
            { token: "string", regex: '".*?"' },
            { token: "string", regex: "'.*?'" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: "keyword", regex: "\\s*(?:library|package|use)\\b" },
            { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
            {
              token: "keyword.operator",
              regex: "&|\\*|\\+|\\-|\\/|<|=|>|\\||=>|\\*\\*|:=|\\/=|>=|<=|<>",
            },
            { token: "punctuation.operator", regex: "\\'|\\:|\\,|\\;|\\." },
            { token: "paren.lparen", regex: "[[(]" },
            { token: "paren.rparen", regex: "[\\])]" },
            { token: "text", regex: "\\s+" },
          ],
        };
      };
    o.inherits(n, i), (t.VHDLHighlightRules = n);
  }
),
  ace.define(
    "ace/mode/vhdl",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/vhdl_highlight_rules",
    ],
    function (e, t, r) {
      "use strict";
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        n = e("./vhdl_highlight_rules").VHDLHighlightRules,
        a = function () {
          (this.HighlightRules = n), (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(a, i),
        function () {
          (this.lineCommentStart = "--"), (this.$id = "ace/mode/vhdl");
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.require(["ace/mode/vhdl"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
