ace.define(
  "ace/mode/forth_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, o) {
    "use strict";
    var n = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        (this.$rules = {
          start: [{ include: "#forth" }],
          "#comment": [
            {
              token: "comment.line.double-dash.forth",
              regex: "(?:^|\\s)--\\s.*$",
              comment: "line comments for iForth",
            },
            {
              token: "comment.line.backslash.forth",
              regex: "(?:^|\\s)\\\\[\\s\\S]*$",
              comment: "ANSI line comment",
            },
            {
              token: "comment.line.backslash-g.forth",
              regex: "(?:^|\\s)\\\\[Gg] .*$",
              comment: "gForth line comment",
            },
            {
              token: "comment.block.forth",
              regex: "(?:^|\\s)\\(\\*(?=\\s|$)",
              push: [
                {
                  token: "comment.block.forth",
                  regex: "(?:^|\\s)\\*\\)(?=\\s|$)",
                  next: "pop",
                },
                { defaultToken: "comment.block.forth" },
              ],
              comment: "multiline comments for iForth",
            },
            {
              token: "comment.block.documentation.forth",
              regex: "\\bDOC\\b",
              caseInsensitive: !0,
              push: [
                {
                  token: "comment.block.documentation.forth",
                  regex: "\\bENDDOC\\b",
                  caseInsensitive: !0,
                  next: "pop",
                },
                { defaultToken: "comment.block.documentation.forth" },
              ],
              comment: "documentation comments for iForth",
            },
            {
              token: "comment.line.parentheses.forth",
              regex: "(?:^|\\s)\\.?\\( [^)]*\\)",
              comment: "ANSI line comment",
            },
          ],
          "#constant": [
            {
              token: "constant.language.forth",
              regex:
                "(?:^|\\s)(?:TRUE|FALSE|BL|PI|CELL|C/L|R/O|W/O|R/W)(?=\\s|$)",
              caseInsensitive: !0,
            },
            {
              token: "constant.numeric.forth",
              regex:
                "(?:^|\\s)[$#%]?[-+]?[0-9]+(?:\\.[0-9]*e-?[0-9]+|\\.?[0-9a-fA-F]*)(?=\\s|$)",
            },
            {
              token: "constant.character.forth",
              regex: "(?:^|\\s)(?:[&^]\\S|(?:\"|')\\S(?:\"|'))(?=\\s|$)",
            },
          ],
          "#forth": [
            { include: "#constant" },
            { include: "#comment" },
            { include: "#string" },
            { include: "#word" },
            { include: "#variable" },
            { include: "#storage" },
            { include: "#word-def" },
          ],
          "#storage": [
            {
              token: "storage.type.forth",
              regex:
                "(?:^|\\s)(?:2CONSTANT|2VARIABLE|ALIAS|CONSTANT|CREATE-INTERPRET/COMPILE[:]?|CREATE|DEFER|FCONSTANT|FIELD|FVARIABLE|USER|VALUE|VARIABLE|VOCABULARY)(?=\\s|$)",
              caseInsensitive: !0,
            },
          ],
          "#string": [
            {
              token: "string.quoted.double.forth",
              regex: '(ABORT" |BREAK" |\\." |C" |0"|S\\\\?" )([^"]+")',
              caseInsensitive: !0,
            },
            {
              token: "string.unquoted.forth",
              regex: "(?:INCLUDE|NEEDS|REQUIRE|USE)[ ]\\S+(?=\\s|$)",
              caseInsensitive: !0,
            },
          ],
          "#variable": [
            {
              token: "variable.language.forth",
              regex: "\\b(?:I|J)\\b",
              caseInsensitive: !0,
            },
          ],
          "#word": [
            {
              token: "keyword.control.immediate.forth",
              regex:
                "(?:^|\\s)\\[(?:\\?DO|\\+LOOP|AGAIN|BEGIN|DEFINED|DO|ELSE|ENDIF|FOR|IF|IFDEF|IFUNDEF|LOOP|NEXT|REPEAT|THEN|UNTIL|WHILE)\\](?=\\s|$)",
              caseInsensitive: !0,
            },
            {
              token: "keyword.other.immediate.forth",
              regex:
                "(?:^|\\s)(?:COMPILE-ONLY|IMMEDIATE|IS|RESTRICT|TO|WHAT'S|])(?=\\s|$)",
              caseInsensitive: !0,
            },
            {
              token: "keyword.control.compile-only.forth",
              regex:
                '(?:^|\\s)(?:-DO|\\-LOOP|\\?DO|\\?LEAVE|\\+DO|\\+LOOP|ABORT\\"|AGAIN|AHEAD|BEGIN|CASE|DO|ELSE|ENDCASE|ENDIF|ENDOF|ENDTRY\\-IFERROR|ENDTRY|FOR|IF|IFERROR|LEAVE|LOOP|NEXT|RECOVER|REPEAT|RESTORE|THEN|TRY|U\\-DO|U\\+DO|UNTIL|WHILE)(?=\\s|$)',
              caseInsensitive: !0,
            },
            {
              token: "keyword.other.compile-only.forth",
              regex:
                "(?:^|\\s)(?:\\?DUP-0=-IF|\\?DUP-IF|\\)|\\[|\\['\\]|\\[CHAR\\]|\\[COMPILE\\]|\\[IS\\]|\\[TO\\]|<COMPILATION|<INTERPRETATION|ASSERT\\(|ASSERT0\\(|ASSERT1\\(|ASSERT2\\(|ASSERT3\\(|COMPILATION>|DEFERS|DOES>|INTERPRETATION>|OF|POSTPONE)(?=\\s|$)",
              caseInsensitive: !0,
            },
            {
              token: "keyword.other.non-immediate.forth",
              regex:
                "(?:^|\\s)(?:'|<IS>|<TO>|CHAR|END-STRUCT|INCLUDE[D]?|LOAD|NEEDS|REQUIRE[D]?|REVISION|SEE|STRUCT|THRU|USE)(?=\\s|$)",
              caseInsensitive: !0,
            },
            {
              token: "keyword.other.warning.forth",
              regex: '(?:^|\\s)(?:~~|BREAK:|BREAK"|DBG)(?=\\s|$)',
              caseInsensitive: !0,
            },
          ],
          "#word-def": [
            {
              token: [
                "keyword.other.compile-only.forth",
                "keyword.other.compile-only.forth",
                "meta.block.forth",
                "entity.name.function.forth",
              ],
              regex: "(:NONAME)|(^:|\\s:)(\\s)(\\S+)(?=\\s|$)",
              caseInsensitive: !0,
              push: [
                {
                  token: "keyword.other.compile-only.forth",
                  regex: ";(?:CODE)?",
                  caseInsensitive: !0,
                  next: "pop",
                },
                { include: "#constant" },
                { include: "#comment" },
                { include: "#string" },
                { include: "#word" },
                { include: "#variable" },
                { include: "#storage" },
                { defaultToken: "meta.block.forth" },
              ],
            },
          ],
        }),
          this.normalizeRules();
      };
    (r.metaData = {
      fileTypes: ["frt", "fs", "ldr", "fth", "4th"],
      foldingStartMarker: "/\\*\\*|\\{\\s*$",
      foldingStopMarker: "\\*\\*/|^\\s*\\}",
      keyEquivalent: "^~F",
      name: "Forth",
      scopeName: "source.forth",
    }),
      n.inherits(r, i),
      (t.ForthHighlightRules = r);
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
      var n = e("../../lib/oop"),
        i = e("../../range").Range,
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
      n.inherits(s, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, o) {
              var n = e.getLine(o);
              if (
                this.singleLineBlockCommentRe.test(n) &&
                !this.startRegionRe.test(n) &&
                !this.tripleStarBlockCommentRe.test(n)
              )
                return "";
              var i = this._getFoldWidgetBase(e, t, o);
              return !i && this.startRegionRe.test(n) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, o, n) {
              var i,
                r = e.getLine(o);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, o);
              if ((i = r.match(this.foldingStartMarker))) {
                var s = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], o, s);
                var l = e.getCommentFoldRange(o, s + i[0].length, 1);
                return (
                  l &&
                    !l.isMultiLine() &&
                    (n
                      ? (l = this.getSectionRange(e, o))
                      : "all" != t && (l = null)),
                  l
                );
              }
              if ("markbegin" !== t && (i = r.match(this.foldingStopMarker))) {
                s = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], o, s)
                  : e.getCommentFoldRange(o, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var o = e.getLine(t),
                  n = o.search(/\S/),
                  r = t,
                  s = o.length,
                  l = (t += 1),
                  a = e.getLength();
                ++t < a;

              ) {
                var c = (o = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (n > c) break;
                  var h = this.getFoldWidgetRange(e, "all", t);
                  if (h) {
                    if (h.start.row <= r) break;
                    if (h.isMultiLine()) t = h.end.row;
                    else if (n == c) break;
                  }
                  l = t;
                }
              }
              return new i(r, s, l, e.getLine(l).length);
            }),
            (this.getCommentRegionBlock = function (e, t, o) {
              for (
                var n = t.search(/\s*$/),
                  r = e.getLength(),
                  s = o,
                  l = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  a = 1;
                ++o < r;

              ) {
                t = e.getLine(o);
                var c = l.exec(t);
                if (c && (c[1] ? a-- : a++, !a)) break;
              }
              if (o > s) return new i(s, n, o, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/forth",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/forth_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, o) {
      "use strict";
      var n = e("../lib/oop"),
        i = e("./text").Mode,
        r = e("./forth_highlight_rules").ForthHighlightRules,
        s = e("./folding/cstyle").FoldMode,
        l = function () {
          (this.HighlightRules = r),
            (this.foldingRules = new s()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      n.inherits(l, i),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = null),
            (this.$id = "ace/mode/forth");
        }.call(l.prototype),
        (t.Mode = l);
    }
  ),
  ace.require(["ace/mode/forth"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
