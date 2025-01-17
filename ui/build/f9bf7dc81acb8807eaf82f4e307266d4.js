ace.define(
  "ace/mode/rst_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/lib/lang",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, o) {
    "use strict";
    var n = e("../lib/oop"),
      r = (e("../lib/lang"), e("./text_highlight_rules").TextHighlightRules),
      x = function () {
        var e = "markup.heading",
          t = "markup.heading",
          o = "constant",
          n = "keyword.operator",
          r = "string",
          x = "markup.underline.list",
          i = "markup.bold",
          g = "markup.italic",
          l = "support.function",
          s = "comment",
          k = "(^|\\s|[\"'(<\\[{\\-/:])",
          a = "(?:$|(?=\\s|[\\\\.,;!?\\-/:\"')>\\]}]))";
        this.$rules = {
          start: [
            {
              token: e,
              regex: "(^)([\\=\\-`:\\.'\"~\\^_\\*\\+#])(\\2{2,}\\s*$)",
            },
            {
              token: ["text", n, l],
              regex: "(^\\s*\\.\\. )([^: ]+::)(.*$)",
              next: "codeblock",
            },
            { token: n, regex: "::$", next: "codeblock" },
            { token: [r, x], regex: "(^\\.\\. _[^:]+:)(.*$)" },
            { token: [r, x], regex: "(^__ )(https?://.*$)" },
            { token: r, regex: "^\\.\\. \\[[^\\]]+\\] " },
            { token: s, regex: "^\\.\\. .*$", next: "comment" },
            { token: t, regex: "^\\s*[\\*\\+-] " },
            {
              token: t,
              regex: "^\\s*(?:[A-Za-z]|[0-9]+|[ivxlcdmIVXLCDM]+)\\. ",
            },
            {
              token: t,
              regex: "^\\s*\\(?(?:[A-Za-z]|[0-9]+|[ivxlcdmIVXLCDM]+)\\) ",
            },
            { token: o, regex: "^={2,}(?: +={2,})+$" },
            { token: o, regex: "^\\+-{2,}(?:\\+-{2,})+\\+$" },
            { token: o, regex: "^\\+={2,}(?:\\+={2,})+\\+$" },
            { token: ["text", l], regex: k + "(``)(?=\\S)", next: "code" },
            { token: ["text", i], regex: k + "(\\*\\*)(?=\\S)", next: "bold" },
            { token: ["text", g], regex: k + "(\\*)(?=\\S)", next: "italic" },
            { token: r, regex: "\\|[\\w\\-]+?\\|" },
            { token: r, regex: ":[\\w-:]+:`\\S", next: "entity" },
            { token: ["text", r], regex: k + "(_`)(?=\\S)", next: "entity" },
            { token: r, regex: "_[A-Za-z0-9\\-]+?" },
            { token: ["text", x], regex: k + "(`)(?=\\S)", next: "link" },
            { token: x, regex: "[A-Za-z0-9\\-]+?__?" },
            { token: x, regex: "\\[[^\\]]+?\\]_" },
            { token: x, regex: "https?://\\S+" },
            { token: o, regex: "\\|" },
          ],
          codeblock: [
            { token: l, regex: "^ +.+$", next: "codeblock" },
            { token: l, regex: "^$", next: "codeblock" },
            { token: "empty", regex: "", next: "start" },
          ],
          code: [
            { token: l, regex: "\\S``" + a, next: "start" },
            { defaultToken: l },
          ],
          bold: [
            { token: i, regex: "\\S\\*\\*" + a, next: "start" },
            { defaultToken: i },
          ],
          italic: [
            { token: g, regex: "\\S\\*" + a, next: "start" },
            { defaultToken: g },
          ],
          entity: [
            { token: r, regex: "\\S`" + a, next: "start" },
            { defaultToken: r },
          ],
          link: [
            { token: x, regex: "\\S`__?" + a, next: "start" },
            { defaultToken: x },
          ],
          comment: [
            { token: s, regex: "^ +.+$", next: "comment" },
            { token: s, regex: "^$", next: "comment" },
            { token: "empty", regex: "", next: "start" },
          ],
        };
      };
    n.inherits(x, r), (t.RSTHighlightRules = x);
  }
),
  ace.define(
    "ace/mode/rst",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/rst_highlight_rules",
    ],
    function (e, t, o) {
      "use strict";
      var n = e("../lib/oop"),
        r = e("./text").Mode,
        x = e("./rst_highlight_rules").RSTHighlightRules,
        i = function () {
          this.HighlightRules = x;
        };
      n.inherits(i, r),
        function () {
          (this.type = "text"),
            (this.$id = "ace/mode/rst"),
            (this.snippetFileId = "ace/snippets/rst");
        }.call(i.prototype),
        (t.Mode = i);
    }
  ),
  ace.require(["ace/mode/rst"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
