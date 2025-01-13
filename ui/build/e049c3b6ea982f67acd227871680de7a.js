ace.define(
  "ace/mode/batchfile_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, o) {
    "use strict";
    var i = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        (this.$rules = {
          start: [
            {
              token: "keyword.command.dosbatch",
              regex:
                "\\b(?:append|assoc|at|attrib|break|cacls|cd|chcp|chdir|chkdsk|chkntfs|cls|cmd|color|comp|compact|convert|copy|date|del|dir|diskcomp|diskcopy|doskey|echo|endlocal|erase|fc|find|findstr|format|ftype|graftabl|help|keyb|label|md|mkdir|mode|more|move|path|pause|popd|print|prompt|pushd|rd|recover|ren|rename|replace|restore|rmdir|set|setlocal|shift|sort|start|subst|time|title|tree|type|ver|verify|vol|xcopy)\\b",
              caseInsensitive: !0,
            },
            {
              token: "keyword.control.statement.dosbatch",
              regex: "\\b(?:goto|call|exit)\\b",
              caseInsensitive: !0,
            },
            {
              token: "keyword.control.conditional.if.dosbatch",
              regex:
                "\\bif\\s+not\\s+(?:exist|defined|errorlevel|cmdextversion)\\b",
              caseInsensitive: !0,
            },
            {
              token: "keyword.control.conditional.dosbatch",
              regex: "\\b(?:if|else)\\b",
              caseInsensitive: !0,
            },
            {
              token: "keyword.control.repeat.dosbatch",
              regex: "\\bfor\\b",
              caseInsensitive: !0,
            },
            {
              token: "keyword.operator.dosbatch",
              regex: "\\b(?:EQU|NEQ|LSS|LEQ|GTR|GEQ)\\b",
            },
            {
              token: ["doc.comment", "comment"],
              regex: "(?:^|\\b)(rem)($|\\s.*$)",
              caseInsensitive: !0,
            },
            { token: "comment.line.colons.dosbatch", regex: "::.*$" },
            { include: "variable" },
            {
              token: "punctuation.definition.string.begin.shell",
              regex: '"',
              push: [
                {
                  token: "punctuation.definition.string.end.shell",
                  regex: '"',
                  next: "pop",
                },
                { include: "variable" },
                { defaultToken: "string.quoted.double.dosbatch" },
              ],
            },
            { token: "keyword.operator.pipe.dosbatch", regex: "[|]" },
            {
              token: "keyword.operator.redirect.shell",
              regex: "&>|\\d*>&\\d*|\\d*(?:>>|>|<)|\\d*<&|\\d*<>",
            },
          ],
          variable: [
            { token: "constant.numeric", regex: "%%\\w+|%[*\\d]|%\\w+%" },
            { token: "constant.numeric", regex: "%~\\d+" },
            {
              token: ["markup.list", "constant.other", "markup.list"],
              regex: "(%)(\\w+)(%?)",
            },
          ],
        }),
          this.normalizeRules();
      };
    (r.metaData = {
      name: "Batch File",
      scopeName: "source.dosbatch",
      fileTypes: ["bat"],
    }),
      i.inherits(r, n),
      (t.BatchFileHighlightRules = r);
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
    function (e, t, o) {
      "use strict";
      var i = e("../../lib/oop"),
        n = e("../../range").Range,
        r = e("./fold_mode").FoldMode,
        s = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      i.inherits(s, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, o) {
              var i = e.getLine(o);
              if (
                this.singleLineBlockCommentRe.test(i) &&
                !this.startRegionRe.test(i) &&
                !this.tripleStarBlockCommentRe.test(i)
              )
                return "";
              var n = this._getFoldWidgetBase(e, t, o);
              return !n && this.startRegionRe.test(i) ? "start" : n;
            }),
            (this.getFoldWidgetRange = function (e, t, o, i) {
              var n,
                r = e.getLine(o);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, o);
              if ((n = r.match(this.foldingStartMarker))) {
                var s = n.index;
                if (n[1]) return this.openingBracketBlock(e, n[1], o, s);
                var a = e.getCommentFoldRange(o, s + n[0].length, 1);
                return (
                  a &&
                    !a.isMultiLine() &&
                    (i
                      ? (a = this.getSectionRange(e, o))
                      : "all" != t && (a = null)),
                  a
                );
              }
              if ("markbegin" !== t && (n = r.match(this.foldingStopMarker))) {
                s = n.index + n[0].length;
                return n[1]
                  ? this.closingBracketBlock(e, n[1], o, s)
                  : e.getCommentFoldRange(o, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var o = e.getLine(t),
                  i = o.search(/\S/),
                  r = t,
                  s = o.length,
                  a = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var c = (o = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (i > c) break;
                  var d = this.getFoldWidgetRange(e, "all", t);
                  if (d) {
                    if (d.start.row <= r) break;
                    if (d.isMultiLine()) t = d.end.row;
                    else if (i == c) break;
                  }
                  a = t;
                }
              }
              return new n(r, s, a, e.getLine(a).length);
            }),
            (this.getCommentRegionBlock = function (e, t, o) {
              for (
                var i = t.search(/\s*$/),
                  r = e.getLength(),
                  s = o,
                  a = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++o < r;

              ) {
                t = e.getLine(o);
                var c = a.exec(t);
                if (c && (c[1] ? l-- : l++, !l)) break;
              }
              if (o > s) return new n(s, i, o, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/batchfile",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/batchfile_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, o) {
      "use strict";
      var i = e("../lib/oop"),
        n = e("./text").Mode,
        r = e("./batchfile_highlight_rules").BatchFileHighlightRules,
        s = e("./folding/cstyle").FoldMode,
        a = function () {
          (this.HighlightRules = r),
            (this.foldingRules = new s()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      i.inherits(a, n),
        function () {
          (this.lineCommentStart = "::"),
            (this.blockComment = ""),
            (this.$id = "ace/mode/batchfile");
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.require(["ace/mode/batchfile"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
