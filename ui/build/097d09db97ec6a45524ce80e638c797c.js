ace.define(
  "ace/mode/cirru_highlight_rules",
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
        this.$rules = {
          start: [
            { token: "constant.numeric", regex: /[\d\.]+/ },
            { token: "comment.line.double-dash", regex: /--/, next: "comment" },
            { token: "storage.modifier", regex: /\(/ },
            { token: "storage.modifier", regex: /,/, next: "line" },
            {
              token: "support.function",
              regex: /[^\(\)"\s{}\[\]]+/,
              next: "line",
            },
            { token: "string.quoted.double", regex: /"/, next: "string" },
            { token: "storage.modifier", regex: /\)/ },
          ],
          comment: [
            {
              token: "comment.line.double-dash",
              regex: / +[^\n]+/,
              next: "start",
            },
          ],
          string: [
            { token: "string.quoted.double", regex: /"/, next: "line" },
            { token: "constant.character.escape", regex: /\\/, next: "escape" },
            { token: "string.quoted.double", regex: /[^\\"]+/ },
          ],
          escape: [
            { token: "constant.character.escape", regex: /./, next: "string" },
          ],
          line: [
            { token: "constant.numeric", regex: /[\d\.]+/ },
            { token: "markup.raw", regex: /^\s*/, next: "start" },
            { token: "storage.modifier", regex: /\$/, next: "start" },
            { token: "variable.parameter", regex: /[^\(\)"\s{}\[\]]+/ },
            { token: "storage.modifier", regex: /\(/, next: "start" },
            { token: "storage.modifier", regex: /\)/ },
            { token: "markup.raw", regex: /^ */, next: "start" },
            { token: "string.quoted.double", regex: /"/, next: "string" },
          ],
        };
      };
    o.inherits(n, i), (t.CirruHighlightRules = n);
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
    function (e, t, r) {
      "use strict";
      var o = e("../../lib/oop"),
        i = e("./fold_mode").FoldMode,
        n = e("../../range").Range,
        s = (t.FoldMode = function () {});
      o.inherits(s, i),
        function () {
          (this.getFoldWidgetRange = function (e, t, r) {
            var o = this.indentationBlock(e, r);
            if (o) return o;
            var i = /\S/,
              s = e.getLine(r),
              a = s.search(i);
            if (-1 != a && "#" == s[a]) {
              for (
                var g = s.length, d = e.getLength(), l = r, c = r;
                ++r < d;

              ) {
                var u = (s = e.getLine(r)).search(i);
                if (-1 != u) {
                  if ("#" != s[u]) break;
                  c = r;
                }
              }
              if (c > l) {
                var f = e.getLine(c).length;
                return new n(l, g, c, f);
              }
            }
          }),
            (this.getFoldWidget = function (e, t, r) {
              var o = e.getLine(r),
                i = o.search(/\S/),
                n = e.getLine(r + 1),
                s = e.getLine(r - 1),
                a = s.search(/\S/),
                g = n.search(/\S/);
              if (-1 == i)
                return (
                  (e.foldWidgets[r - 1] = -1 != a && a < g ? "start" : ""), ""
                );
              if (-1 == a) {
                if (i == g && "#" == o[i] && "#" == n[i])
                  return (
                    (e.foldWidgets[r - 1] = ""),
                    (e.foldWidgets[r + 1] = ""),
                    "start"
                  );
              } else if (
                a == i &&
                "#" == o[i] &&
                "#" == s[i] &&
                -1 == e.getLine(r - 2).search(/\S/)
              )
                return (
                  (e.foldWidgets[r - 1] = "start"),
                  (e.foldWidgets[r + 1] = ""),
                  ""
                );
              return (
                (e.foldWidgets[r - 1] = -1 != a && a < i ? "start" : ""),
                i < g ? "start" : ""
              );
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/cirru",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/cirru_highlight_rules",
      "ace/mode/folding/coffee",
    ],
    function (e, t, r) {
      "use strict";
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        n = e("./cirru_highlight_rules").CirruHighlightRules,
        s = e("./folding/coffee").FoldMode,
        a = function () {
          (this.HighlightRules = n),
            (this.foldingRules = new s()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(a, i),
        function () {
          (this.lineCommentStart = "--"), (this.$id = "ace/mode/cirru");
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.require(["ace/mode/cirru"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
