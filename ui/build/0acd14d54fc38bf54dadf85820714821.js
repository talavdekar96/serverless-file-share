ace.define(
  "ace/mode/yaml_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      i = function () {
        (this.$rules = {
          start: [
            { token: "comment", regex: "#.*$" },
            { token: "list.markup", regex: /^(?:-{3}|\.{3})\s*(?=#|$)/ },
            { token: "list.markup", regex: /^\s*[\-?](?:$|\s)/ },
            { token: "constant", regex: "!![\\w//]+" },
            { token: "constant.language", regex: "[&\\*][a-zA-Z0-9-_]+" },
            {
              token: ["meta.tag", "keyword"],
              regex: /^(\s*\w[^\s:]*?)(:(?=\s|$))/,
            },
            {
              token: ["meta.tag", "keyword"],
              regex: /(\w[^\s:]*?)(\s*:(?=\s|$))/,
            },
            { token: "keyword.operator", regex: "<<\\w*:\\w*" },
            { token: "keyword.operator", regex: "-\\s*(?=[{])" },
            { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
            {
              token: "string",
              regex: /[|>][-+\d]*(?:$|\s+(?:$|#))/,
              onMatch: function (e, t, n, r) {
                r = r.replace(/ #.*/, "");
                var o = /^ *((:\s*)?-(\s*[^|>])?)?/
                    .exec(r)[0]
                    .replace(/\S\s*$/, "").length,
                  i = parseInt(/\d+[\s+-]*$/.exec(r));
                return (
                  i
                    ? ((o += i - 1), (this.next = "mlString"))
                    : (this.next = "mlStringPre"),
                  n.length
                    ? ((n[0] = this.next), (n[1] = o))
                    : (n.push(this.next), n.push(o)),
                  this.token
                );
              },
              next: "mlString",
            },
            { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
            {
              token: "constant.numeric",
              regex:
                /(\b|[+\-\.])[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)(?=[^\d-\w]|$)$/,
            },
            {
              token: "constant.numeric",
              regex: /[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/,
            },
            {
              token: "constant.language.boolean",
              regex: "\\b(?:true|false|TRUE|FALSE|True|False|yes|no)\\b",
            },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { token: "text", regex: /[^\s,:\[\]\{\}]+/ },
          ],
          mlStringPre: [
            { token: "indent", regex: /^ *$/ },
            {
              token: "indent",
              regex: /^ */,
              onMatch: function (e, t, n) {
                return (
                  n[1] >= e.length
                    ? ((this.next = "start"), n.shift(), n.shift())
                    : ((n[1] = e.length - 1), (this.next = n[0] = "mlString")),
                  this.token
                );
              },
              next: "mlString",
            },
            { defaultToken: "string" },
          ],
          mlString: [
            { token: "indent", regex: /^ *$/ },
            {
              token: "indent",
              regex: /^ */,
              onMatch: function (e, t, n) {
                return (
                  n[1] >= e.length
                    ? ((this.next = "start"), n.splice(0))
                    : (this.next = "mlString"),
                  this.token
                );
              },
              next: "mlString",
            },
            { token: "string", regex: ".+" },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(i, o), (t.YamlHighlightRules = i);
  }
),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var r = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var o = n[1].length,
              i = e.findMatchingBracket({ row: t, column: o });
            if (!i || i.row == t) return 0;
            var a = this.$getIndent(e.getLine(i.row));
            e.replace(new r(t, 0, t, o - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
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
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        o = e("./fold_mode").FoldMode,
        i = e("../../range").Range,
        a = (t.FoldMode = function () {});
      r.inherits(a, o),
        function () {
          (this.getFoldWidgetRange = function (e, t, n) {
            var r = this.indentationBlock(e, n);
            if (r) return r;
            var o = /\S/,
              a = e.getLine(n),
              s = a.search(o);
            if (-1 != s && "#" == a[s]) {
              for (
                var c = a.length, g = e.getLength(), l = n, u = n;
                ++n < g;

              ) {
                var h = (a = e.getLine(n)).search(o);
                if (-1 != h) {
                  if ("#" != a[h]) break;
                  u = n;
                }
              }
              if (u > l) {
                var d = e.getLine(u).length;
                return new i(l, c, u, d);
              }
            }
          }),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n),
                o = r.search(/\S/),
                i = e.getLine(n + 1),
                a = e.getLine(n - 1),
                s = a.search(/\S/),
                c = i.search(/\S/);
              if (-1 == o)
                return (
                  (e.foldWidgets[n - 1] = -1 != s && s < c ? "start" : ""), ""
                );
              if (-1 == s) {
                if (o == c && "#" == r[o] && "#" == i[o])
                  return (
                    (e.foldWidgets[n - 1] = ""),
                    (e.foldWidgets[n + 1] = ""),
                    "start"
                  );
              } else if (
                s == o &&
                "#" == r[o] &&
                "#" == a[o] &&
                -1 == e.getLine(n - 2).search(/\S/)
              )
                return (
                  (e.foldWidgets[n - 1] = "start"),
                  (e.foldWidgets[n + 1] = ""),
                  ""
                );
              return (
                (e.foldWidgets[n - 1] = -1 != s && s < o ? "start" : ""),
                o < c ? "start" : ""
              );
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/yaml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/yaml_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/coffee",
      "ace/worker/worker_client",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./text").Mode,
        i = e("./yaml_highlight_rules").YamlHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("./folding/coffee").FoldMode,
        c = e("../worker/worker_client").WorkerClient,
        g = function () {
          (this.HighlightRules = i),
            (this.$outdent = new a()),
            (this.foldingRules = new s()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      r.inherits(g, o),
        function () {
          (this.lineCommentStart = ["#"]),
            (this.getNextLineIndent = function (e, t, n) {
              var r = this.$getIndent(t);
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (r += n);
              return r;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.createWorker = function (e) {
              var t = new c(["ace"], "ace/mode/yaml_worker", "YamlWorker");
              return (
                t.attachToDocument(e.getDocument()),
                t.on("annotate", function (t) {
                  e.setAnnotations(t.data);
                }),
                t.on("terminate", function () {
                  e.clearAnnotations();
                }),
                t
              );
            }),
            (this.$id = "ace/mode/yaml");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.require(["ace/mode/yaml"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
