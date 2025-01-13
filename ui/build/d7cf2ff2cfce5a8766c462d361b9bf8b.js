ace.define(
  "ace/mode/jssm_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var o = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      s = function () {
        (this.$rules = {
          start: [
            {
              token: "punctuation.definition.comment.mn",
              regex: /\/\*/,
              push: [
                {
                  token: "punctuation.definition.comment.mn",
                  regex: /\*\//,
                  next: "pop",
                },
                { defaultToken: "comment.block.jssm" },
              ],
              comment: "block comment",
            },
            {
              token: "comment.line.jssm",
              regex: /\/\//,
              push: [
                { token: "comment.line.jssm", regex: /$/, next: "pop" },
                { defaultToken: "comment.line.jssm" },
              ],
              comment: "block comment",
            },
            {
              token: "entity.name.function",
              regex: /\${/,
              push: [
                { token: "entity.name.function", regex: /}/, next: "pop" },
                { defaultToken: "keyword.other" },
              ],
              comment: "js outcalls",
            },
            {
              token: "constant.numeric",
              regex: /[0-9]*\.[0-9]*\.[0-9]*/,
              comment: "semver",
            },
            {
              token: "constant.language.jssmLanguage",
              regex: /graph_layout\s*:/,
              comment: "jssm language tokens",
            },
            {
              token: "constant.language.jssmLanguage",
              regex: /machine_name\s*:/,
              comment: "jssm language tokens",
            },
            {
              token: "constant.language.jssmLanguage",
              regex: /machine_version\s*:/,
              comment: "jssm language tokens",
            },
            {
              token: "constant.language.jssmLanguage",
              regex: /jssm_version\s*:/,
              comment: "jssm language tokens",
            },
            {
              token: "keyword.control.transition.jssmArrow.legal_legal",
              regex: /<->/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.legal_none",
              regex: /<-/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.none_legal",
              regex: /->/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.main_main",
              regex: /<=>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.none_main",
              regex: /=>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.main_none",
              regex: /<=/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.forced_forced",
              regex: /<~>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.none_forced",
              regex: /~>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.forced_none",
              regex: /<~/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.legal_main",
              regex: /<-=>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.main_legal",
              regex: /<=->/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.legal_forced",
              regex: /<-~>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.forced_legal",
              regex: /<~->/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.main_forced",
              regex: /<=~>/,
              comment: "transitions",
            },
            {
              token: "keyword.control.transition.jssmArrow.forced_main",
              regex: /<~=>/,
              comment: "transitions",
            },
            {
              token: "constant.numeric.jssmProbability",
              regex: /[0-9]+%/,
              comment: "edge probability annotation",
            },
            {
              token: "constant.character.jssmAction",
              regex: /\'[^']*\'/,
              comment: "action annotation",
            },
            {
              token: "entity.name.tag.jssmLabel.doublequoted",
              regex: /\"[^"]*\"/,
              comment: "jssm label annotation",
            },
            {
              token: "entity.name.tag.jssmLabel.atom",
              regex: /[a-zA-Z0-9_.+&()#@!?,]/,
              comment: "jssm label annotation",
            },
          ],
        }),
          this.normalizeRules();
      };
    (s.metaData = {
      fileTypes: ["jssm", "jssm_state"],
      name: "JSSM",
      scopeName: "source.jssm",
    }),
      o.inherits(s, i),
      (t.JSSMHighlightRules = s);
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
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./fold_mode").FoldMode,
        r = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(r, s),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var o = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              var i = this._getFoldWidgetBase(e, t, n);
              return !i && this.startRegionRe.test(o) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, n, o) {
              var i,
                s = e.getLine(n);
              if (this.startRegionRe.test(s))
                return this.getCommentRegionBlock(e, s, n);
              if ((i = s.match(this.foldingStartMarker))) {
                var r = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], n, r);
                var a = e.getCommentFoldRange(n, r + i[0].length, 1);
                return (
                  a &&
                    !a.isMultiLine() &&
                    (o
                      ? (a = this.getSectionRange(e, n))
                      : "all" != t && (a = null)),
                  a
                );
              }
              if ("markbegin" !== t && (i = s.match(this.foldingStopMarker))) {
                r = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, r)
                  : e.getCommentFoldRange(n, r, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  s = t,
                  r = n.length,
                  a = (t += 1),
                  m = e.getLength();
                ++t < m;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (o > l) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= s) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (o == l) break;
                  }
                  a = t;
                }
              }
              return new i(s, r, a, e.getLine(a).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  s = e.getLength(),
                  r = n,
                  a = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  m = 1;
                ++n < s;

              ) {
                t = e.getLine(n);
                var l = a.exec(t);
                if (l && (l[1] ? m-- : m++, !m)) break;
              }
              if (n > r) return new i(r, o, n, t.length);
            });
        }.call(r.prototype);
    }
  ),
  ace.define(
    "ace/mode/jssm",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/jssm_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./jssm_highlight_rules").JSSMHighlightRules,
        r = e("./folding/cstyle").FoldMode,
        a = function () {
          (this.HighlightRules = s), (this.foldingRules = new r());
        };
      o.inherits(a, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/jssm");
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.require(["ace/mode/jssm"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
