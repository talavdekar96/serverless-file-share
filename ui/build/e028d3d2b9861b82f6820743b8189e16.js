ace.define(
  "ace/mode/cobol_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, E, o) {
    "use strict";
    var T = e("../lib/oop"),
      t = e("./text_highlight_rules").TextHighlightRules,
      R = function () {
        var e = this.createKeywordMapper(
          {
            "support.function": "count|min|max|avg|sum|rank|now|coalesce|main",
            keyword:
              "ACCEPT|MERGE|SUM|ADD||MESSAGE|TABLE|ADVANCING|MODE|TAPE|AFTER|MULTIPLY|TEST|ALL|NEGATIVE|TEXT|ALPHABET|NEXT|THAN|ALSO|NO|THEN|ALTERNATE|NOT|THROUGH|AND|NUMBER|THRU|ANY|OCCURS|TIME|ARE|OF|TO|AREA|OFF|TOP||ASCENDING|OMITTED|TRUE|ASSIGN|ON|TYPE|AT|OPEN|UNIT|AUTHOR|OR|UNTIL|BEFORE|OTHER|UP|BLANK|OUTPUT|USE|BLOCK|PAGE|USING|BOTTOM|PERFORM|VALUE|BY|PIC|VALUES|CALL|PICTURE|WHEN|CANCEL|PLUS|WITH|CD|POINTER|WRITE|CHARACTER|POSITION||ZERO|CLOSE|POSITIVE|ZEROS|COLUMN|PROCEDURE|ZEROES|COMMA|PROGRAM|COMMON|PROGRAM-ID|COMMUNICATION|QUOTE|COMP|RANDOM|COMPUTE|READ|CONTAINS|RECEIVE|CONFIGURATION|RECORD|CONTINUE|REDEFINES|CONTROL|REFERENCE|COPY|REMAINDER|COUNT|REPLACE|DATA|REPORT|DATE|RESERVE|DAY|RESET|DELETE|RETURN|DESTINATION|REWIND|DISABLE|REWRITE|DISPLAY|RIGHT|DIVIDE|RUN|DOWN|SAME|ELSE|SEARCH|ENABLE|SECTION|END|SELECT|ENVIRONMENT|SENTENCE|EQUAL|SET|ERROR|SIGN|EXIT|SEQUENTIAL|EXTERNAL|SIZE|FLASE|SORT|FILE|SOURCE|LENGTH|SPACE|LESS|STANDARD|LIMIT|START|LINE|STOP|LOCK|STRING|LOW-VALUE|SUBTRACT",
            "constant.language": "true|false|null",
          },
          "identifier",
          !0
        );
        this.$rules = {
          start: [
            { token: "comment", regex: "\\*.*$" },
            { token: "string", regex: '".*?"' },
            { token: "string", regex: "'.*?'" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
            {
              token: "keyword.operator",
              regex:
                "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=",
            },
            { token: "paren.lparen", regex: "[\\(]" },
            { token: "paren.rparen", regex: "[\\)]" },
            { token: "text", regex: "\\s+" },
          ],
        };
      };
    T.inherits(R, t), (E.CobolHighlightRules = R);
  }
),
  ace.define(
    "ace/mode/cobol",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/cobol_highlight_rules",
    ],
    function (e, E, o) {
      "use strict";
      var T = e("../lib/oop"),
        t = e("./text").Mode,
        R = e("./cobol_highlight_rules").CobolHighlightRules,
        A = function () {
          (this.HighlightRules = R), (this.$behaviour = this.$defaultBehaviour);
        };
      T.inherits(A, t),
        function () {
          (this.lineCommentStart = "*"), (this.$id = "ace/mode/cobol");
        }.call(A.prototype),
        (E.Mode = A);
    }
  ),
  ace.require(["ace/mode/cobol"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
