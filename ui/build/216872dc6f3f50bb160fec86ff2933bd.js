ace.define(
  "ace/mode/fsl_highlight_rules",
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
      a = function () {
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
                { defaultToken: "comment.block.fsl" },
              ],
            },
            {
              token: "comment.line.fsl",
              regex: /\/\//,
              push: [
                { token: "comment.line.fsl", regex: /$/, next: "pop" },
                { defaultToken: "comment.line.fsl" },
              ],
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
              token: "constant.language.fslLanguage",
              regex:
                "(?:graph_layout|machine_name|machine_author|machine_license|machine_comment|machine_language|machine_version|machine_reference|npm_name|graph_layout|on_init|on_halt|on_end|on_terminate|on_finalize|on_transition|on_action|on_stochastic_action|on_legal|on_main|on_forced|on_validation|on_validation_failure|on_transition_refused|on_forced_transition_refused|on_action_refused|on_enter|on_exit|start_states|end_states|terminal_states|final_states|fsl_version)\\s*:",
            },
            {
              token: "keyword.control.transition.fslArrow",
              regex:
                /<->|<-|->|<=>|=>|<=|<~>|~>|<~|<-=>|<=->|<-~>|<~->|<=~>|<~=>/,
            },
            {
              token: "constant.numeric.fslProbability",
              regex: /[0-9]+%/,
              comment: "edge probability annotation",
            },
            {
              token: "constant.character.fslAction",
              regex: /\'[^']*\'/,
              comment: "action annotation",
            },
            {
              token: "string.quoted.double.fslLabel.doublequoted",
              regex: /\"[^"]*\"/,
              comment: "fsl label annotation",
            },
            {
              token: "entity.name.tag.fslLabel.atom",
              regex: /[a-zA-Z0-9_.+&()#@!?,]/,
              comment: "fsl label annotation",
            },
          ],
        }),
          this.normalizeRules();
      };
    (a.metaData = {
      fileTypes: ["fsl", "fsl_state"],
      name: "FSL",
      scopeName: "source.fsl",
    }),
      o.inherits(a, i),
      (t.FSLHighlightRules = a);
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
        a = e("./fold_mode").FoldMode,
        s = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(s, a),
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
                a = e.getLine(n);
              if (this.startRegionRe.test(a))
                return this.getCommentRegionBlock(e, a, n);
              if ((i = a.match(this.foldingStartMarker))) {
                var s = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], n, s);
                var r = e.getCommentFoldRange(n, s + i[0].length, 1);
                return (
                  r &&
                    !r.isMultiLine() &&
                    (o
                      ? (r = this.getSectionRange(e, n))
                      : "all" != t && (r = null)),
                  r
                );
              }
              if ("markbegin" !== t && (i = a.match(this.foldingStopMarker))) {
                s = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  a = t,
                  s = n.length,
                  r = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var c = (n = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (o > c) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= a) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (o == c) break;
                  }
                  r = t;
                }
              }
              return new i(a, s, r, e.getLine(r).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  a = e.getLength(),
                  s = n,
                  r = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++n < a;

              ) {
                t = e.getLine(n);
                var c = r.exec(t);
                if (c && (c[1] ? l-- : l++, !l)) break;
              }
              if (n > s) return new i(s, o, n, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/fsl",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/fsl_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        i = e("./text").Mode,
        a = e("./fsl_highlight_rules").FSLHighlightRules,
        s = e("./folding/cstyle").FoldMode,
        r = function () {
          (this.HighlightRules = a), (this.foldingRules = new s());
        };
      o.inherits(r, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/fsl"),
            (this.snippetFileId = "ace/snippets/fsl");
        }.call(r.prototype),
        (t.Mode = r);
    }
  ),
  ace.require(["ace/mode/fsl"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
