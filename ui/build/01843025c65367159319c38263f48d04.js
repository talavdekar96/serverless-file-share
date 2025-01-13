ace.define(
  "ace/mode/xml_highlight_rules",
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
      a = function e(t) {
        var n = "[_:a-zA-Z\xc0-\uffff][-_:.a-zA-Z0-9\xc0-\uffff]*";
        (this.$rules = {
          start: [
            {
              token: "string.cdata.xml",
              regex: "<\\!\\[CDATA\\[",
              next: "cdata",
            },
            {
              token: ["punctuation.instruction.xml", "keyword.instruction.xml"],
              regex: "(<\\?)(" + n + ")",
              next: "processing_instruction",
            },
            { token: "comment.start.xml", regex: "<\\!--", next: "comment" },
            {
              token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
              regex: "(<\\!)(DOCTYPE)(?=[\\s])",
              next: "doctype",
              caseInsensitive: !0,
            },
            { include: "tag" },
            { token: "text.end-tag-open.xml", regex: "</" },
            { token: "text.tag-open.xml", regex: "<" },
            { include: "reference" },
            { defaultToken: "text.xml" },
          ],
          processing_instruction: [
            {
              token: "entity.other.attribute-name.decl-attribute-name.xml",
              regex: n,
            },
            { token: "keyword.operator.decl-attribute-equals.xml", regex: "=" },
            { include: "whitespace" },
            { include: "string" },
            { token: "punctuation.xml-decl.xml", regex: "\\?>", next: "start" },
          ],
          doctype: [
            { include: "whitespace" },
            { include: "string" },
            { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
            { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
            {
              token: "punctuation.int-subset",
              regex: "\\[",
              push: "int_subset",
            },
          ],
          int_subset: [
            { token: "text.xml", regex: "\\s+" },
            { token: "punctuation.int-subset.xml", regex: "]", next: "pop" },
            {
              token: ["punctuation.markup-decl.xml", "keyword.markup-decl.xml"],
              regex: "(<\\!)(" + n + ")",
              push: [
                { token: "text", regex: "\\s+" },
                {
                  token: "punctuation.markup-decl.xml",
                  regex: ">",
                  next: "pop",
                },
                { include: "string" },
              ],
            },
          ],
          cdata: [
            { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
            { token: "text.xml", regex: "\\s+" },
            { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" },
          ],
          comment: [
            { token: "comment.end.xml", regex: "--\x3e", next: "start" },
            { defaultToken: "comment.xml" },
          ],
          reference: [
            {
              token: "constant.language.escape.reference.xml",
              regex:
                "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
            },
          ],
          attr_reference: [
            {
              token: "constant.language.escape.reference.attribute-value.xml",
              regex:
                "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
            },
          ],
          tag: [
            {
              token: [
                "meta.tag.punctuation.tag-open.xml",
                "meta.tag.punctuation.end-tag-open.xml",
                "meta.tag.tag-name.xml",
              ],
              regex: "(?:(<)|(</))((?:" + n + ":)?" + n + ")",
              next: [
                { include: "attributes" },
                {
                  token: "meta.tag.punctuation.tag-close.xml",
                  regex: "/?>",
                  next: "start",
                },
              ],
            },
          ],
          tag_whitespace: [{ token: "text.tag-whitespace.xml", regex: "\\s+" }],
          whitespace: [{ token: "text.whitespace.xml", regex: "\\s+" }],
          string: [
            {
              token: "string.xml",
              regex: "'",
              push: [
                { token: "string.xml", regex: "'", next: "pop" },
                { defaultToken: "string.xml" },
              ],
            },
            {
              token: "string.xml",
              regex: '"',
              push: [
                { token: "string.xml", regex: '"', next: "pop" },
                { defaultToken: "string.xml" },
              ],
            },
          ],
          attributes: [
            { token: "entity.other.attribute-name.xml", regex: n },
            { token: "keyword.operator.attribute-equals.xml", regex: "=" },
            { include: "tag_whitespace" },
            { include: "attribute_value" },
          ],
          attribute_value: [
            {
              token: "string.attribute-value.xml",
              regex: "'",
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: "'",
                  next: "pop",
                },
                { include: "attr_reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
            {
              token: "string.attribute-value.xml",
              regex: '"',
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: '"',
                  next: "pop",
                },
                { include: "attr_reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
          ],
        }),
          this.constructor === e && this.normalizeRules();
      };
    (function () {
      this.embedTagRules = function (e, t, n) {
        this.$rules.tag.unshift({
          token: [
            "meta.tag.punctuation.tag-open.xml",
            "meta.tag." + n + ".tag-name.xml",
          ],
          regex: "(<)(" + n + "(?=\\s|>|$))",
          next: [
            { include: "attributes" },
            {
              token: "meta.tag.punctuation.tag-close.xml",
              regex: "/?>",
              next: t + "start",
            },
          ],
        }),
          (this.$rules[n + "-end"] = [
            { include: "attributes" },
            {
              token: "meta.tag.punctuation.tag-close.xml",
              regex: "/?>",
              next: "start",
              onMatch: function (e, t, n) {
                return n.splice(0), this.token;
              },
            },
          ]),
          this.embedRules(e, t, [
            {
              token: [
                "meta.tag.punctuation.end-tag-open.xml",
                "meta.tag." + n + ".tag-name.xml",
              ],
              regex: "(</)(" + n + "(?=\\s|>|$))",
              next: n + "-end",
            },
            { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[" },
            { token: "string.cdata.xml", regex: "\\]\\]>" },
          ]);
      };
    }).call(o.prototype),
      r.inherits(a, o),
      (t.XmlHighlightRules = a);
  }
),
  ace.define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/token_iterator",
      "ace/lib/lang",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        o = e("../behaviour").Behaviour,
        a = e("../../token_iterator").TokenIterator;
      e("../../lib/lang");
      function i(e, t) {
        return e && e.type.lastIndexOf(t + ".xml") > -1;
      }
      var l = function () {
        this.add("string_dquotes", "insertion", function (e, t, n, r, o) {
          if ('"' == o || "'" == o) {
            var l = o,
              u = r.doc.getTextRange(n.getSelectionRange());
            if (
              "" !== u &&
              "'" !== u &&
              '"' != u &&
              n.getWrapBehavioursEnabled()
            )
              return { text: l + u + l, selection: !1 };
            var s = n.getCursorPosition(),
              g = r.doc.getLine(s.row).substring(s.column, s.column + 1),
              c = new a(r, s.row, s.column),
              m = c.getCurrentToken();
            if (g == l && (i(m, "attribute-value") || i(m, "string")))
              return { text: "", selection: [1, 1] };
            if ((m || (m = c.stepBackward()), !m)) return;
            for (; i(m, "tag-whitespace") || i(m, "whitespace"); )
              m = c.stepBackward();
            var x = !g || g.match(/\s/);
            if (
              (i(m, "attribute-equals") && (x || ">" == g)) ||
              (i(m, "decl-attribute-equals") && (x || "?" == g))
            )
              return { text: l + l, selection: [1, 1] };
          }
        }),
          this.add("string_dquotes", "deletion", function (e, t, n, r, o) {
            var a = r.doc.getTextRange(o);
            if (
              !o.isMultiLine() &&
              ('"' == a || "'" == a) &&
              r.doc
                .getLine(o.start.row)
                .substring(o.start.column + 1, o.start.column + 2) == a
            )
              return o.end.column++, o;
          }),
          this.add("autoclosing", "insertion", function (e, t, n, r, o) {
            if (">" == o) {
              var l = n.getSelectionRange().start,
                u = new a(r, l.row, l.column),
                s = u.getCurrentToken() || u.stepBackward();
              if (
                !s ||
                !(
                  i(s, "tag-name") ||
                  i(s, "tag-whitespace") ||
                  i(s, "attribute-name") ||
                  i(s, "attribute-equals") ||
                  i(s, "attribute-value")
                )
              )
                return;
              if (i(s, "reference.attribute-value")) return;
              if (i(s, "attribute-value")) {
                var g = u.getCurrentTokenColumn() + s.value.length;
                if (l.column < g) return;
                if (l.column == g) {
                  var c = u.stepForward();
                  if (c && i(c, "attribute-value")) return;
                  u.stepBackward();
                }
              }
              if (/^\s*>/.test(r.getLine(l.row).slice(l.column))) return;
              for (; !i(s, "tag-name"); )
                if ("<" == (s = u.stepBackward()).value) {
                  s = u.stepForward();
                  break;
                }
              var m = u.getCurrentTokenRow(),
                x = u.getCurrentTokenColumn();
              if (i(u.stepBackward(), "end-tag-open")) return;
              var d = s.value;
              if (
                (m == l.row && (d = d.substring(0, l.column - x)),
                this.voidElements.hasOwnProperty(d.toLowerCase()))
              )
                return;
              return { text: "></" + d + ">", selection: [1, 1] };
            }
          }),
          this.add("autoindent", "insertion", function (e, t, n, r, o) {
            if ("\n" == o) {
              var i = n.getCursorPosition(),
                l = r.getLine(i.row),
                u = new a(r, i.row, i.column),
                s = u.getCurrentToken();
              if (s && -1 !== s.type.indexOf("tag-close")) {
                if ("/>" == s.value) return;
                for (; s && -1 === s.type.indexOf("tag-name"); )
                  s = u.stepBackward();
                if (!s) return;
                var g = s.value,
                  c = u.getCurrentTokenRow();
                if (!(s = u.stepBackward()) || -1 !== s.type.indexOf("end-tag"))
                  return;
                if (this.voidElements && !this.voidElements[g]) {
                  var m = r.getTokenAt(i.row, i.column + 1),
                    x = ((l = r.getLine(c)), this.$getIndent(l)),
                    d = x + r.getTabString();
                  return m && "</" === m.value
                    ? {
                        text: "\n" + d + "\n" + x,
                        selection: [1, d.length, 1, d.length],
                      }
                    : { text: "\n" + d };
                }
              }
            }
          });
      };
      r.inherits(l, o), (t.XmlBehaviour = l);
    }
  ),
  ace.define(
    "ace/mode/folding/xml",
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
        o = e("../../range").Range,
        a = e("./fold_mode").FoldMode,
        i = (t.FoldMode = function (e, t) {
          a.call(this),
            (this.voidElements = e || {}),
            (this.optionalEndTags = r.mixin({}, this.voidElements)),
            t && r.mixin(this.optionalEndTags, t);
        });
      r.inherits(i, a);
      var l = function () {
        (this.tagName = ""),
          (this.closing = !1),
          (this.selfClosing = !1),
          (this.start = { row: 0, column: 0 }),
          (this.end = { row: 0, column: 0 });
      };
      function u(e, t) {
        return e.type.lastIndexOf(t + ".xml") > -1;
      }
      (function () {
        (this.getFoldWidget = function (e, t, n) {
          var r = this._getFirstTagInLine(e, n);
          return r
            ? r.closing || (!r.tagName && r.selfClosing)
              ? "markbeginend" === t
                ? "end"
                : ""
              : !r.tagName ||
                r.selfClosing ||
                this.voidElements.hasOwnProperty(r.tagName.toLowerCase()) ||
                this._findEndTagInLine(e, n, r.tagName, r.end.column)
              ? ""
              : "start"
            : this.getCommentFoldWidget(e, n);
        }),
          (this.getCommentFoldWidget = function (e, t) {
            return /comment/.test(e.getState(t)) && /<!-/.test(e.getLine(t))
              ? "start"
              : "";
          }),
          (this._getFirstTagInLine = function (e, t) {
            for (
              var n = e.getTokens(t), r = new l(), o = 0;
              o < n.length;
              o++
            ) {
              var a = n[o];
              if (u(a, "tag-open")) {
                if (
                  ((r.end.column = r.start.column + a.value.length),
                  (r.closing = u(a, "end-tag-open")),
                  !(a = n[++o]))
                )
                  return null;
                for (
                  r.tagName = a.value, r.end.column += a.value.length, o++;
                  o < n.length;
                  o++
                )
                  if (
                    ((a = n[o]),
                    (r.end.column += a.value.length),
                    u(a, "tag-close"))
                  ) {
                    r.selfClosing = "/>" == a.value;
                    break;
                  }
                return r;
              }
              if (u(a, "tag-close"))
                return (r.selfClosing = "/>" == a.value), r;
              r.start.column += a.value.length;
            }
            return null;
          }),
          (this._findEndTagInLine = function (e, t, n, r) {
            for (var o = e.getTokens(t), a = 0, i = 0; i < o.length; i++) {
              var l = o[i];
              if (
                !((a += l.value.length) < r) &&
                u(l, "end-tag-open") &&
                (l = o[i + 1]) &&
                l.value == n
              )
                return !0;
            }
            return !1;
          }),
          (this.getFoldWidgetRange = function (e, t, n) {
            var r = e.getMatchingTags({ row: n, column: 0 });
            return r
              ? new o(
                  r.openTag.end.row,
                  r.openTag.end.column,
                  r.closeTag.start.row,
                  r.closeTag.start.column
                )
              : this.getCommentFoldWidget(e, n) &&
                  e.getCommentFoldRange(n, e.getLine(n).length);
          });
      }).call(i.prototype);
    }
  ),
  ace.define(
    "ace/mode/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text",
      "ace/mode/xml_highlight_rules",
      "ace/mode/behaviour/xml",
      "ace/mode/folding/xml",
      "ace/worker/worker_client",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("../lib/lang"),
        a = e("./text").Mode,
        i = e("./xml_highlight_rules").XmlHighlightRules,
        l = e("./behaviour/xml").XmlBehaviour,
        u = e("./folding/xml").FoldMode,
        s = e("../worker/worker_client").WorkerClient,
        g = function () {
          (this.HighlightRules = i),
            (this.$behaviour = new l()),
            (this.foldingRules = new u());
        };
      r.inherits(g, a),
        function () {
          (this.voidElements = o.arrayToMap([])),
            (this.blockComment = { start: "\x3c!--", end: "--\x3e" }),
            (this.createWorker = function (e) {
              var t = new s(["ace"], "ace/mode/xml_worker", "Worker");
              return (
                t.attachToDocument(e.getDocument()),
                t.on("error", function (t) {
                  e.setAnnotations(t.data);
                }),
                t.on("terminate", function () {
                  e.clearAnnotations();
                }),
                t
              );
            }),
            (this.$id = "ace/mode/xml");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.require(["ace/mode/xml"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
