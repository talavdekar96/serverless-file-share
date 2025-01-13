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
  function (e, t, n) {
    "use strict";
    var r = e("../../lib/oop"),
      o = e("./fold_mode").FoldMode,
      i = e("../../range").Range,
      g = (t.FoldMode = function () {});
    r.inherits(g, o),
      function () {
        (this.getFoldWidgetRange = function (e, t, n) {
          var r = this.indentationBlock(e, n);
          if (r) return r;
          var o = /\S/,
            g = e.getLine(n),
            s = g.search(o);
          if (-1 != s && "#" == g[s]) {
            for (var a = g.length, x = e.getLength(), l = n, c = n; ++n < x; ) {
              var d = (g = e.getLine(n)).search(o);
              if (-1 != d) {
                if ("#" != g[d]) break;
                c = n;
              }
            }
            if (c > l) {
              var u = e.getLine(c).length;
              return new i(l, a, c, u);
            }
          }
        }),
          (this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n),
              o = r.search(/\S/),
              i = e.getLine(n + 1),
              g = e.getLine(n - 1),
              s = g.search(/\S/),
              a = i.search(/\S/);
            if (-1 == o)
              return (
                (e.foldWidgets[n - 1] = -1 != s && s < a ? "start" : ""), ""
              );
            if (-1 == s) {
              if (o == a && "#" == r[o] && "#" == i[o])
                return (
                  (e.foldWidgets[n - 1] = ""),
                  (e.foldWidgets[n + 1] = ""),
                  "start"
                );
            } else if (
              s == o &&
              "#" == r[o] &&
              "#" == g[o] &&
              -1 == e.getLine(n - 2).search(/\S/)
            )
              return (
                (e.foldWidgets[n - 1] = "start"),
                (e.foldWidgets[n + 1] = ""),
                ""
              );
            return (
              (e.foldWidgets[n - 1] = -1 != s && s < o ? "start" : ""),
              o < a ? "start" : ""
            );
          });
      }.call(g.prototype);
  }
),
  ace.define(
    "ace/mode/snippets",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/text_highlight_rules",
      "ace/mode/folding/coffee",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./text").Mode,
        i = e("./text_highlight_rules").TextHighlightRules,
        g = function () {
          var e =
            "SELECTION|CURRENT_WORD|SELECTED_TEXT|CURRENT_LINE|LINE_INDEX|LINE_NUMBER|SOFT_TABS|TAB_SIZE|FILENAME|FILEPATH|FULLNAME";
          this.$rules = {
            start: [
              { token: "constant.language.escape", regex: /\\[\$}`\\]/ },
              { token: "keyword", regex: "\\$(?:TM_)?(?:" + e + ")\\b" },
              { token: "variable", regex: "\\$\\w+" },
              {
                onMatch: function (e, t, n) {
                  return n[1] ? n[1]++ : n.unshift(t, 1), this.tokenName;
                },
                tokenName: "markup.list",
                regex: "\\${",
                next: "varDecl",
              },
              {
                onMatch: function (e, t, n) {
                  return n[1]
                    ? (n[1]--, n[1] || n.splice(0, 2), this.tokenName)
                    : "text";
                },
                tokenName: "markup.list",
                regex: "}",
              },
              { token: "doc.comment", regex: /^\${2}-{5,}$/ },
            ],
            varDecl: [
              { regex: /\d+\b/, token: "constant.numeric" },
              { token: "keyword", regex: "(?:TM_)?(?:" + e + ")\\b" },
              { token: "variable", regex: "\\w+" },
              { regex: /:/, token: "punctuation.operator", next: "start" },
              { regex: /\//, token: "string.regex", next: "regexp" },
              { regex: "", next: "start" },
            ],
            regexp: [
              { regex: /\\./, token: "escape" },
              { regex: /\[/, token: "regex.start", next: "charClass" },
              { regex: "/", token: "string.regex", next: "format" },
              { token: "string.regex", regex: "." },
            ],
            charClass: [
              { regex: "\\.", token: "escape" },
              { regex: "\\]", token: "regex.end", next: "regexp" },
              { token: "string.regex", regex: "." },
            ],
            format: [
              { regex: /\\[ulULE]/, token: "keyword" },
              { regex: /\$\d+/, token: "variable" },
              { regex: "/[gim]*:?", token: "string.regex", next: "start" },
              { token: "string", regex: "." },
            ],
          };
        };
      r.inherits(g, i), (t.SnippetHighlightRules = g);
      var s = function () {
        (this.$rules = {
          start: [
            { token: "text", regex: "^\\t", next: "sn-start" },
            { token: "invalid", regex: /^ \s*/ },
            { token: "comment", regex: /^#.*/ },
            {
              token: "constant.language.escape",
              regex: "^regex ",
              next: "regex",
            },
            {
              token: "constant.language.escape",
              regex:
                "^(trigger|endTrigger|name|snippet|guard|endGuard|tabTrigger|key)\\b",
            },
          ],
          regex: [
            { token: "text", regex: "\\." },
            { token: "keyword", regex: "/" },
            { token: "empty", regex: "$", next: "start" },
          ],
        }),
          this.embedRules(g, "sn-", [
            { token: "text", regex: "^\\t", next: "sn-start" },
            {
              onMatch: function (e, t, n) {
                return n.splice(n.length), this.tokenName;
              },
              tokenName: "text",
              regex: "^(?!\t)",
              next: "start",
            },
          ]);
      };
      r.inherits(s, i), (t.SnippetGroupHighlightRules = s);
      var a = e("./folding/coffee").FoldMode,
        x = function () {
          (this.HighlightRules = s),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      r.inherits(x, o),
        function () {
          (this.$indentWithTabs = !0),
            (this.lineCommentStart = "#"),
            (this.$id = "ace/mode/snippets"),
            (this.snippetFileId = "ace/snippets/snippets");
        }.call(x.prototype),
        (t.Mode = x);
    }
  ),
  ace.require(["ace/mode/snippets"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
