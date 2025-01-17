ace.define(
  "ace/mode/fsharp_highlight_rules",
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
        var e = this.createKeywordMapper(
            {
              variable: "this",
              keyword:
                "abstract|assert|base|begin|class|default|delegate|done|downcast|downto|elif|else|exception|extern|false|finally|function|global|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|open|or|override|private|public|rec|return|return!|select|static|struct|then|to|true|try|typeof|upcast|use|use!|val|void|when|while|with|yield|yield!|__SOURCE_DIRECTORY__|as|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile|and|do|end|for|fun|if|in|let|let!|new|not|null|of|endif",
              constant: "true|false",
            },
            "identifier"
          ),
          t =
            "(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))";
        (this.$rules = {
          start: [
            { token: "variable.classes", regex: "\\[\\<[.]*\\>\\]" },
            { token: "comment", regex: "//.*$" },
            {
              token: "comment.start",
              regex: /\(\*(?!\))/,
              push: "blockComment",
            },
            { token: "string", regex: "'.'" },
            {
              token: "string",
              regex: '"""',
              next: [
                {
                  token: "constant.language.escape",
                  regex: /\\./,
                  next: "qqstring",
                },
                { token: "string", regex: '"""', next: "start" },
                { defaultToken: "string" },
              ],
            },
            {
              token: "string",
              regex: '"',
              next: [
                {
                  token: "constant.language.escape",
                  regex: /\\./,
                  next: "qqstring",
                },
                { token: "string", regex: '"', next: "start" },
                { defaultToken: "string" },
              ],
            },
            {
              token: ["verbatim.string", "string"],
              regex: '(@?)(")',
              stateName: "qqstring",
              next: [
                { token: "constant.language.escape", regex: '""' },
                { token: "string", regex: '"', next: "start" },
                { defaultToken: "string" },
              ],
            },
            { token: "constant.float", regex: "(?:" + t + "|\\d+)[jJ]\\b" },
            { token: "constant.float", regex: t },
            {
              token: "constant.integer",
              regex:
                "(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b",
            },
            {
              token: ["keyword.type", "variable"],
              regex: "(type\\s)([a-zA-Z0-9_$-]*\\b)",
            },
            { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
            {
              token: "keyword.operator",
              regex:
                "\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|=|\\(\\*\\)",
            },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
          ],
          blockComment: [
            { regex: /\(\*\)/, token: "comment" },
            {
              regex: /\(\*(?!\))/,
              token: "comment.start",
              push: "blockComment",
            },
            { regex: /\*\)/, token: "comment.end", next: "pop" },
            { defaultToken: "comment" },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(i, o), (t.FSharpHighlightRules = i);
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
      var r = e("../../lib/oop"),
        o = e("../../range").Range,
        i = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(a, i),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, n);
              return !o && this.startRegionRe.test(r) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var o,
                i = e.getLine(n);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
              if ((o = i.match(this.foldingStartMarker))) {
                var a = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], n, a);
                var s = e.getCommentFoldRange(n, a + o[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (r
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (o = i.match(this.foldingStopMarker))) {
                a = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  r = n.search(/\S/),
                  i = t,
                  a = n.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var g = (n = e.getLine(t)).search(/\S/);
                if (-1 !== g) {
                  if (r > g) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= i) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (r == g) break;
                  }
                  s = t;
                }
              }
              return new o(i, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var r = t.search(/\s*$/),
                  i = e.getLength(),
                  a = n,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++n < i;

              ) {
                t = e.getLine(n);
                var g = s.exec(t);
                if (g && (g[1] ? l-- : l++, !l)) break;
              }
              if (n > a) return new o(a, r, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/fsharp",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/fsharp_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./text").Mode,
        i = e("./fsharp_highlight_rules").FSharpHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = function () {
          o.call(this),
            (this.HighlightRules = i),
            (this.foldingRules = new a());
        };
      r.inherits(s, o),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "(*", end: "*)", nestable: !0 }),
            (this.$id = "ace/mode/fsharp");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/fsharp"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
