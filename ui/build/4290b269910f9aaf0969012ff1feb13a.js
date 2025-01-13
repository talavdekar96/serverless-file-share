ace.define(
  "ace/mode/haskell_cabal_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var o = e("../lib/oop"),
      l = e("./text_highlight_rules").TextHighlightRules,
      n = function () {
        this.$rules = {
          start: [
            { token: "comment", regex: "^\\s*--.*$" },
            { token: ["keyword"], regex: /^(\s*\w.*?)(:(?:\s+|$))/ },
            { token: "constant.numeric", regex: /[\d_]+(?:(?:[\.\d_]*)?)/ },
            {
              token: "constant.language.boolean",
              regex: "(?:true|false|TRUE|FALSE|True|False|yes|no)\\b",
            },
            { token: "markup.heading", regex: /^(\w.*)$/ },
          ],
        };
      };
    o.inherits(n, l), (t.CabalHighlightRules = n);
  }
),
  ace.define(
    "ace/mode/folding/haskell_cabal",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (e, t, i) {
      "use strict";
      var o = e("../../lib/oop"),
        l = e("./fold_mode").FoldMode,
        n = e("../../range").Range,
        a = (t.FoldMode = function () {});
      o.inherits(a, l),
        function () {
          (this.isHeading = function (e, t) {
            var i = e.getTokens(t)[0];
            return (
              0 == t || (i && 0 === i.type.lastIndexOf("markup.heading", 0))
            );
          }),
            (this.getFoldWidget = function (e, t, i) {
              if (this.isHeading(e, i)) return "start";
              if ("markbeginend" === t && !/^\s*$/.test(e.getLine(i))) {
                for (
                  var o = e.getLength();
                  ++i < o && /^\s*$/.test(e.getLine(i));

                );
                if (i == o || this.isHeading(e, i)) return "end";
              }
              return "";
            }),
            (this.getFoldWidgetRange = function (e, t, i) {
              var o = e.getLine(i).length,
                l = e.getLength(),
                a = i,
                s = i;
              if (this.isHeading(e, i)) {
                for (; ++i < l; )
                  if (this.isHeading(e, i)) {
                    i--;
                    break;
                  }
                if ((s = i) > a)
                  for (; s > a && /^\s*$/.test(e.getLine(s)); ) s--;
                if (s > a) {
                  var r = e.getLine(s).length;
                  return new n(a, o, s, r);
                }
              } else if ("end" === this.getFoldWidget(e, t, i)) {
                for (
                  s = i, r = e.getLine(s).length;
                  --i >= 0 && !this.isHeading(e, i);

                );
                o = e.getLine(i).length;
                return new n(i, o, s, r);
              }
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/haskell_cabal",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/haskell_cabal_highlight_rules",
      "ace/mode/folding/haskell_cabal",
    ],
    function (e, t, i) {
      "use strict";
      var o = e("../lib/oop"),
        l = e("./text").Mode,
        n = e("./haskell_cabal_highlight_rules").CabalHighlightRules,
        a = e("./folding/haskell_cabal").FoldMode,
        s = function () {
          (this.HighlightRules = n),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(s, l),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = null),
            (this.$id = "ace/mode/haskell_cabal");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/haskell_cabal"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
