ace.define(
  "ace/mode/c9search_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/lib/lang",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("../lib/lang"),
      o = e("./text_highlight_rules").TextHighlightRules;
    var a = function () {
      (this.$rules = {
        start: [
          {
            tokenNames: [
              "c9searchresults.constant.numeric",
              "c9searchresults.text",
              "c9searchresults.text",
              "c9searchresults.keyword",
            ],
            regex: /(^\s+[0-9]+)(:)(\d*\s?)([^\r\n]+)/,
            onMatch: function (e, t, n) {
              var r = this.splitRegex.exec(e),
                i = this.tokenNames,
                o = [
                  { type: i[0], value: r[1] },
                  { type: i[1], value: r[2] },
                ];
              r[3] &&
                (" " == r[3]
                  ? (o[1] = { type: i[1], value: r[2] + " " })
                  : o.push({ type: i[1], value: r[3] }));
              var a,
                s = n[1],
                c = r[4],
                u = 0;
              if (s && s.exec)
                for (s.lastIndex = 0; (a = s.exec(c)); ) {
                  var h = c.substring(u, a.index);
                  if (
                    ((u = s.lastIndex),
                    h && o.push({ type: i[2], value: h }),
                    a[0])
                  )
                    o.push({ type: i[3], value: a[0] });
                  else if (!h) break;
                }
              return (
                u < c.length && o.push({ type: i[2], value: c.substr(u) }), o
              );
            },
          },
          {
            regex: "^Searching for [^\\r\\n]*$",
            onMatch: function (e, t, n) {
              var r,
                o,
                a = e.split("\x01");
              if (a.length < 3) return "text";
              var s = 0,
                c = [
                  { value: a[s++] + "'", type: "text" },
                  { value: (o = a[s++]), type: "text" },
                  { value: "'" + a[s++], type: "text" },
                ];
              for (
                " in" !== a[2] &&
                  c.push(
                    { value: "'" + a[s++] + "'", type: "text" },
                    { value: a[s++], type: "text" }
                  ),
                  c.push({ value: " " + a[s++] + " ", type: "text" }),
                  a[s + 1]
                    ? ((r = a[s + 1]),
                      c.push({ value: "(" + a[s + 1] + ")", type: "text" }),
                      (s += 1))
                    : (s -= 1);
                s++ < a.length;

              )
                a[s] && c.push({ value: a[s], type: "text" });
              o &&
                (/regex/.test(r) || (o = i.escapeRegExp(o)),
                /whole/.test(r) && (o = "\\b" + o + "\\b"));
              var u =
                o &&
                (function (e, t) {
                  try {
                    return new RegExp(e, t);
                  } catch (n) {}
                })("(" + o + ")", / sensitive/.test(r) ? "g" : "ig");
              return u && ((n[0] = t), (n[1] = u)), c;
            },
          },
          { regex: "^(?=Found \\d+ matches)", token: "text", next: "numbers" },
          { token: "string", regex: "^\\S:?[^:]+", next: "numbers" },
        ],
        numbers: [
          { regex: "\\d+", token: "constant.numeric" },
          { regex: "$", token: "text", next: "start" },
        ],
      }),
        this.normalizeRules();
    };
    r.inherits(a, o), (t.C9SearchHighlightRules = a);
  }
),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var r = e("../range").Range,
        i = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var i = n[1].length,
              o = e.findMatchingBracket({ row: t, column: i });
            if (!o || o.row == t) return 0;
            var a = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, i - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(i.prototype),
        (t.MatchingBraceOutdent = i);
    }
  ),
  ace.define(
    "ace/mode/folding/c9search",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        o = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function () {});
      r.inherits(a, o),
        function () {
          (this.foldingStartMarker = /^(\S.*:|Searching for.*)$/),
            (this.foldingStopMarker = /^(\s+|Found.*)$/),
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = e.doc.getAllLines(n),
                o = r[n],
                a = /^(Found.*|Searching for.*)$/,
                s = a.test(o) ? a : /^(\S.*:|\s*)$/,
                c = n,
                u = n;
              if (this.foldingStartMarker.test(o)) {
                for (
                  var h = n + 1, l = e.getLength();
                  h < l && !s.test(r[h]);
                  h++
                );
                u = h;
              } else if (this.foldingStopMarker.test(o)) {
                for (h = n - 1; h >= 0 && ((o = r[h]), !s.test(o)); h--);
                c = h;
              }
              if (c != u) {
                var d = o.length;
                return (
                  s === a && (d = o.search(/\(Found[^)]+\)$|$/)),
                  new i(c, d, u, 0)
                );
              }
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/c9search",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/c9search_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/c9search",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./text").Mode,
        o = e("./c9search_highlight_rules").C9SearchHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("./folding/c9search").FoldMode,
        c = function () {
          (this.HighlightRules = o),
            (this.$outdent = new a()),
            (this.foldingRules = new s());
        };
      r.inherits(c, i),
        function () {
          (this.getNextLineIndent = function (e, t, n) {
            return this.$getIndent(t);
          }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/c9search");
        }.call(c.prototype),
        (t.Mode = c);
    }
  ),
  ace.require(["ace/mode/c9search"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
