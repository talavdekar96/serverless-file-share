ace.define(
  "ace/mode/ini_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, i, n) {
    "use strict";
    var t = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      a = "\\\\(?:[\\\\0abtrn;#=:]|x[a-fA-F\\d]{4})",
      l = function () {
        (this.$rules = {
          start: [
            {
              token: "punctuation.definition.comment.ini",
              regex: "#.*",
              push_: [
                {
                  token: "comment.line.number-sign.ini",
                  regex: "$|^",
                  next: "pop",
                },
                { defaultToken: "comment.line.number-sign.ini" },
              ],
            },
            {
              token: "punctuation.definition.comment.ini",
              regex: ";.*",
              push_: [
                {
                  token: "comment.line.semicolon.ini",
                  regex: "$|^",
                  next: "pop",
                },
                { defaultToken: "comment.line.semicolon.ini" },
              ],
            },
            {
              token: [
                "keyword.other.definition.ini",
                "text",
                "punctuation.separator.key-value.ini",
              ],
              regex: "\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)",
            },
            {
              token: [
                "punctuation.definition.entity.ini",
                "constant.section.group-title.ini",
                "punctuation.definition.entity.ini",
              ],
              regex: "^(\\[)(.*?)(\\])",
            },
            {
              token: "punctuation.definition.string.begin.ini",
              regex: "'",
              push: [
                {
                  token: "punctuation.definition.string.end.ini",
                  regex: "'",
                  next: "pop",
                },
                { token: "constant.language.escape", regex: a },
                { defaultToken: "string.quoted.single.ini" },
              ],
            },
            {
              token: "punctuation.definition.string.begin.ini",
              regex: '"',
              push: [
                { token: "constant.language.escape", regex: a },
                {
                  token: "punctuation.definition.string.end.ini",
                  regex: '"',
                  next: "pop",
                },
                { defaultToken: "string.quoted.double.ini" },
              ],
            },
          ],
        }),
          this.normalizeRules();
      };
    (l.metaData = {
      fileTypes: ["ini", "conf"],
      keyEquivalent: "^~I",
      name: "Ini",
      scopeName: "source.ini",
    }),
      t.inherits(l, o),
      (i.IniHighlightRules = l);
  }
),
  ace.define(
    "ace/mode/folding/ini",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, i, n) {
      "use strict";
      var t = e("../../lib/oop"),
        o = e("../../range").Range,
        a = e("./fold_mode").FoldMode,
        l = (i.FoldMode = function () {});
      t.inherits(l, a),
        function () {
          (this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/),
            (this.getFoldWidgetRange = function (e, i, n) {
              var t = this.foldingStartMarker,
                a = e.getLine(n),
                l = a.match(t);
              if (l) {
                for (
                  var r = l[1] + ".",
                    u = a.length,
                    s = e.getLength(),
                    g = n,
                    c = n;
                  ++n < s;

                )
                  if (((a = e.getLine(n)), !/^\s*$/.test(a))) {
                    if ((l = a.match(t)) && 0 !== l[1].lastIndexOf(r, 0)) break;
                    c = n;
                  }
                if (c > g) {
                  var d = e.getLine(c).length;
                  return new o(g, u, c, d);
                }
              }
            });
        }.call(l.prototype);
    }
  ),
  ace.define(
    "ace/mode/ini",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/ini_highlight_rules",
      "ace/mode/folding/ini",
    ],
    function (e, i, n) {
      "use strict";
      var t = e("../lib/oop"),
        o = e("./text").Mode,
        a = e("./ini_highlight_rules").IniHighlightRules,
        l = e("./folding/ini").FoldMode,
        r = function () {
          (this.HighlightRules = a),
            (this.foldingRules = new l()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      t.inherits(r, o),
        function () {
          (this.lineCommentStart = ";"),
            (this.blockComment = null),
            (this.$id = "ace/mode/ini");
        }.call(r.prototype),
        (i.Mode = r);
    }
  ),
  ace.require(["ace/mode/ini"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
