ace.define(
  "ace/mode/pascal_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, o) {
    "use strict";
    var i = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        var e = this.createKeywordMapper(
          {
            "keyword.control":
              "absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor",
          },
          "identifier",
          !0
        );
        (this.$rules = {
          start: [
            {
              caseInsensitive: !0,
              token: [
                "variable",
                "text",
                "storage.type.prototype",
                "entity.name.function.prototype",
              ],
              regex:
                "\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))",
            },
            {
              caseInsensitive: !0,
              token: [
                "variable",
                "text",
                "storage.type.function",
                "entity.name.function",
              ],
              regex: "\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?",
            },
            { caseInsensitive: !0, token: e, regex: /\b[a-z_]+\b/ },
            {
              token: "constant.numeric",
              regex:
                "\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b",
            },
            { token: "punctuation.definition.comment", regex: "--.*$" },
            { token: "punctuation.definition.comment", regex: "//.*$" },
            {
              token: "punctuation.definition.comment",
              regex: "\\(\\*",
              push: [
                {
                  token: "punctuation.definition.comment",
                  regex: "\\*\\)",
                  next: "pop",
                },
                { defaultToken: "comment.block.one" },
              ],
            },
            {
              token: "punctuation.definition.comment",
              regex: "\\{",
              push: [
                {
                  token: "punctuation.definition.comment",
                  regex: "\\}",
                  next: "pop",
                },
                { defaultToken: "comment.block.two" },
              ],
            },
            {
              token: "punctuation.definition.string.begin",
              regex: '"',
              push: [
                { token: "constant.character.escape", regex: "\\\\." },
                {
                  token: "punctuation.definition.string.end",
                  regex: '"',
                  next: "pop",
                },
                { defaultToken: "string.quoted.double" },
              ],
            },
            {
              token: "punctuation.definition.string.begin",
              regex: "'",
              push: [
                { token: "constant.character.escape.apostrophe", regex: "''" },
                {
                  token: "punctuation.definition.string.end",
                  regex: "'",
                  next: "pop",
                },
                { defaultToken: "string.quoted.single" },
              ],
            },
            { token: "keyword.operator", regex: "[+\\-;,/*%]|:=|=" },
          ],
        }),
          this.normalizeRules();
      };
    i.inherits(r, n), (t.PascalHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/folding/coffee",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (e, t, o) {
      "use strict";
      var i = e("../../lib/oop"),
        n = e("./fold_mode").FoldMode,
        r = e("../../range").Range,
        a = (t.FoldMode = function () {});
      i.inherits(a, n),
        function () {
          (this.getFoldWidgetRange = function (e, t, o) {
            var i = this.indentationBlock(e, o);
            if (i) return i;
            var n = /\S/,
              a = e.getLine(o),
              s = a.search(n);
            if (-1 != s && "#" == a[s]) {
              for (
                var l = a.length, c = e.getLength(), d = o, u = o;
                ++o < c;

              ) {
                var g = (a = e.getLine(o)).search(n);
                if (-1 != g) {
                  if ("#" != a[g]) break;
                  u = o;
                }
              }
              if (u > d) {
                var f = e.getLine(u).length;
                return new r(d, l, u, f);
              }
            }
          }),
            (this.getFoldWidget = function (e, t, o) {
              var i = e.getLine(o),
                n = i.search(/\S/),
                r = e.getLine(o + 1),
                a = e.getLine(o - 1),
                s = a.search(/\S/),
                l = r.search(/\S/);
              if (-1 == n)
                return (
                  (e.foldWidgets[o - 1] = -1 != s && s < l ? "start" : ""), ""
                );
              if (-1 == s) {
                if (n == l && "#" == i[n] && "#" == r[n])
                  return (
                    (e.foldWidgets[o - 1] = ""),
                    (e.foldWidgets[o + 1] = ""),
                    "start"
                  );
              } else if (
                s == n &&
                "#" == i[n] &&
                "#" == a[n] &&
                -1 == e.getLine(o - 2).search(/\S/)
              )
                return (
                  (e.foldWidgets[o - 1] = "start"),
                  (e.foldWidgets[o + 1] = ""),
                  ""
                );
              return (
                (e.foldWidgets[o - 1] = -1 != s && s < n ? "start" : ""),
                n < l ? "start" : ""
              );
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/pascal",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/pascal_highlight_rules",
      "ace/mode/folding/coffee",
    ],
    function (e, t, o) {
      "use strict";
      var i = e("../lib/oop"),
        n = e("./text").Mode,
        r = e("./pascal_highlight_rules").PascalHighlightRules,
        a = e("./folding/coffee").FoldMode,
        s = function () {
          (this.HighlightRules = r),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      i.inherits(s, n),
        function () {
          (this.lineCommentStart = ["--", "//"]),
            (this.blockComment = [
              { start: "(*", end: "*)" },
              { start: "{", end: "}" },
            ]),
            (this.$id = "ace/mode/pascal");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/pascal"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
