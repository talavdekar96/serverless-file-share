ace.define(
  "ace/mode/diff_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, i, t) {
    "use strict";
    var o = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        this.$rules = {
          start: [
            {
              regex: "^(?:\\*{15}|={67}|-{3}|\\+{3})$",
              token: "punctuation.definition.separator.diff",
              name: "keyword",
            },
            {
              regex: "^(@@)(\\s*.+?\\s*)(@@)(.*)$",
              token: [
                "constant",
                "constant.numeric",
                "constant",
                "comment.doc.tag",
              ],
            },
            {
              regex: "^(\\d+)([,\\d]+)(a|d|c)(\\d+)([,\\d]+)(.*)$",
              token: [
                "constant.numeric",
                "punctuation.definition.range.diff",
                "constant.function",
                "constant.numeric",
                "punctuation.definition.range.diff",
                "invalid",
              ],
              name: "meta.",
            },
            {
              regex: "^(\\-{3}|\\+{3}|\\*{3})( .+)$",
              token: ["constant.numeric", "meta.tag"],
            },
            {
              regex: "^([!+>])(.*?)(\\s*)$",
              token: ["support.constant", "text", "invalid"],
            },
            {
              regex: "^([<\\-])(.*?)(\\s*)$",
              token: ["support.function", "string", "invalid"],
            },
            {
              regex: "^(diff)(\\s+--\\w+)?(.+?)( .+)?$",
              token: ["variable", "variable", "keyword", "variable"],
            },
            { regex: "^Index.+$", token: "variable" },
            { regex: "^\\s+$", token: "text" },
            { regex: "\\s*$", token: "invalid" },
            { defaultToken: "invisible", caseInsensitive: !0 },
          ],
        };
      };
    o.inherits(r, n), (i.DiffHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/folding/diff",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (e, i, t) {
      "use strict";
      var o = e("../../lib/oop"),
        n = e("./fold_mode").FoldMode,
        r = e("../../range").Range,
        a = (i.FoldMode = function (e, i) {
          (this.regExpList = e),
            (this.flag = i),
            (this.foldingStartMarker = RegExp(
              "^(" + e.join("|") + ")",
              this.flag
            ));
        });
      o.inherits(a, n),
        function () {
          this.getFoldWidgetRange = function (e, i, t) {
            for (
              var o = e.getLine(t),
                n = { row: t, column: o.length },
                a = this.regExpList,
                d = 1;
              d <= a.length;
              d++
            ) {
              var f = RegExp("^(" + a.slice(0, d).join("|") + ")", this.flag);
              if (f.test(o)) break;
            }
            for (
              var s = e.getLength();
              ++t < s && ((o = e.getLine(t)), !f.test(o));

            );
            if (t != n.row + 1) return new r(n.row, n.column, t - 1, o.length);
          };
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/diff",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/diff_highlight_rules",
      "ace/mode/folding/diff",
    ],
    function (e, i, t) {
      "use strict";
      var o = e("../lib/oop"),
        n = e("./text").Mode,
        r = e("./diff_highlight_rules").DiffHighlightRules,
        a = e("./folding/diff").FoldMode,
        d = function () {
          (this.HighlightRules = r),
            (this.foldingRules = new a(["diff", "@@|\\*{5}"], "i"));
        };
      o.inherits(d, n),
        function () {
          (this.$id = "ace/mode/diff"),
            (this.snippetFileId = "ace/snippets/diff");
        }.call(d.prototype),
        (i.Mode = d);
    }
  ),
  ace.require(["ace/mode/diff"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
