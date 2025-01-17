ace.define(
  "ace/mode/graphqlschema_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var r = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      o = function () {
        var e = this.createKeywordMapper(
          {
            keyword:
              "type|interface|union|enum|schema|input|implements|extends|scalar",
            "storage.type": "Int|Float|String|ID|Boolean",
          },
          "identifier"
        );
        (this.$rules = {
          start: [
            { token: "comment", regex: "#.*$" },
            { token: "paren.lparen", regex: /[\[({]/, next: "start" },
            { token: "paren.rparen", regex: /[\])}]/ },
            { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(o, n), (t.GraphQLSchemaHighlightRules = o);
  }
),
  ace.define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, i) {
      "use strict";
      var r = e("../../lib/oop"),
        n = e("../../range").Range,
        o = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(a, o),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, i) {
              var r = e.getLine(i);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var n = this._getFoldWidgetBase(e, t, i);
              return !n && this.startRegionRe.test(r) ? "start" : n;
            }),
            (this.getFoldWidgetRange = function (e, t, i, r) {
              var n,
                o = e.getLine(i);
              if (this.startRegionRe.test(o))
                return this.getCommentRegionBlock(e, o, i);
              if ((n = o.match(this.foldingStartMarker))) {
                var a = n.index;
                if (n[1]) return this.openingBracketBlock(e, n[1], i, a);
                var s = e.getCommentFoldRange(i, a + n[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (r
                      ? (s = this.getSectionRange(e, i))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (n = o.match(this.foldingStopMarker))) {
                a = n.index + n[0].length;
                return n[1]
                  ? this.closingBracketBlock(e, n[1], i, a)
                  : e.getCommentFoldRange(i, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var i = e.getLine(t),
                  r = i.search(/\S/),
                  o = t,
                  a = i.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var g = (i = e.getLine(t)).search(/\S/);
                if (-1 !== g) {
                  if (r > g) break;
                  var h = this.getFoldWidgetRange(e, "all", t);
                  if (h) {
                    if (h.start.row <= o) break;
                    if (h.isMultiLine()) t = h.end.row;
                    else if (r == g) break;
                  }
                  s = t;
                }
              }
              return new n(o, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, i) {
              for (
                var r = t.search(/\s*$/),
                  o = e.getLength(),
                  a = i,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++i < o;

              ) {
                t = e.getLine(i);
                var g = s.exec(t);
                if (g && (g[1] ? l-- : l++, !l)) break;
              }
              if (i > a) return new n(a, r, i, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/graphqlschema",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/graphqlschema_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, i) {
      "use strict";
      var r = e("../lib/oop"),
        n = e("./text").Mode,
        o = e("./graphqlschema_highlight_rules").GraphQLSchemaHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = function () {
          (this.HighlightRules = o), (this.foldingRules = new a());
        };
      r.inherits(s, n),
        function () {
          (this.lineCommentStart = "#"),
            (this.$id = "ace/mode/graphqlschema"),
            (this.snippetFileId = "ace/snippets/graphqlschema");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/graphqlschema"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
