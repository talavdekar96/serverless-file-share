ace.define(
  "ace/mode/textile_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var n = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        this.$rules = {
          start: [
            {
              token: function (e) {
                return "h" == e.charAt(0)
                  ? "markup.heading." + e.charAt(1)
                  : "markup.heading";
              },
              regex: "h1|h2|h3|h4|h5|h6|bq|p|bc|pre",
              next: "blocktag",
            },
            { token: "keyword", regex: "[\\*]+|[#]+" },
            { token: "text", regex: ".+" },
          ],
          blocktag: [
            { token: "keyword", regex: "\\. ", next: "start" },
            { token: "keyword", regex: "\\(", next: "blocktagproperties" },
          ],
          blocktagproperties: [
            { token: "keyword", regex: "\\)", next: "blocktag" },
            { token: "string", regex: "[a-zA-Z0-9\\-_]+" },
            { token: "keyword", regex: "#" },
          ],
        };
      };
    n.inherits(r, o), (t.TextileHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, i) {
      "use strict";
      var n = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var i = e.getLine(t).match(/^(\s*\})/);
            if (!i) return 0;
            var o = i[1].length,
              r = e.findMatchingBracket({ row: t, column: o });
            if (!r || r.row == t) return 0;
            var c = this.$getIndent(e.getLine(r.row));
            e.replace(new n(t, 0, t, o - 1), c);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
    }
  ),
  ace.define(
    "ace/mode/textile",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/textile_highlight_rules",
      "ace/mode/matching_brace_outdent",
    ],
    function (e, t, i) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./textile_highlight_rules").TextileHighlightRules,
        c = e("./matching_brace_outdent").MatchingBraceOutdent,
        u = function () {
          (this.HighlightRules = r),
            (this.$outdent = new c()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      n.inherits(u, o),
        function () {
          (this.type = "text"),
            (this.getNextLineIndent = function (e, t, i) {
              return "intag" == e ? i : "";
            }),
            (this.checkOutdent = function (e, t, i) {
              return this.$outdent.checkOutdent(t, i);
            }),
            (this.autoOutdent = function (e, t, i) {
              this.$outdent.autoOutdent(t, i);
            }),
            (this.$id = "ace/mode/textile"),
            (this.snippetFileId = "ace/snippets/textile");
        }.call(u.prototype),
        (t.Mode = u);
    }
  ),
  ace.require(["ace/mode/textile"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
