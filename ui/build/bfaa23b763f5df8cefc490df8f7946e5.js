ace.define(
  "ace/mode/kotlin_highlight_rules",
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
      r = e("./text_highlight_rules").TextHighlightRules,
      i = function () {
        var e = (this.$keywords = this.createKeywordMapper(
          {
            "storage.modifier.kotlin":
              "var|val|public|private|protected|abstract|final|enum|open|attribute|annotation|override|inline|var|val|vararg|lazy|in|out|internal|data|tailrec|operator|infix|const|yield|typealias|typeof|sealed|inner|value|lateinit|external|suspend|noinline|crossinline|reified|expect|actual",
            keyword:
              "companion|class|object|interface|namespace|type|fun|constructor|if|else|while|for|do|return|when|where|break|continue|try|catch|finally|throw|in|is|as|assert|constructor",
            "constant.language.kotlin": "true|false|null|this|super",
            "entity.name.function.kotlin": "get|set",
          },
          "identifier"
        ));
        (this.$rules = {
          start: [
            { include: "#comments" },
            {
              token: [
                "text",
                "keyword.other.kotlin",
                "text",
                "entity.name.package.kotlin",
                "text",
              ],
              regex: /^(\s*)(package)\b(?:(\s*)([^ ;$]+)(\s*))?/,
            },
            { token: "comment", regex: /^\s*#!.*$/ },
            { include: "#imports" },
            { include: "#expressions" },
            { token: "string", regex: /@[a-zA-Z][a-zA-Z:]*\b/ },
            {
              token: [
                "keyword.other.kotlin",
                "text",
                "entity.name.variable.kotlin",
              ],
              regex: /\b(var|val)(\s+)([a-zA-Z_][\w]*)\b/,
            },
            {
              token: [
                "keyword.other.kotlin",
                "text",
                "entity.name.variable.kotlin",
                "paren.lparen",
              ],
              regex: /(fun)(\s+)(\w+)(\()/,
              push: [
                {
                  token: [
                    "variable.parameter.function.kotlin",
                    "text",
                    "keyword.operator",
                  ],
                  regex: /(\w+)(\s*)(:)/,
                },
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#comments" },
                { include: "#types" },
                { include: "#expressions" },
              ],
            },
            {
              token: ["text", "keyword", "text", "identifier"],
              regex: /^(\s*)(class)(\s*)([a-zA-Z]+)/,
              next: "#classes",
            },
            {
              token: ["identifier", "punctuaction"],
              regex: /([a-zA-Z_][\w]*)(<)/,
              push: [
                { include: "#generics" },
                { include: "#defaultTypes" },
                { token: "punctuation", regex: />/, next: "pop" },
              ],
            },
            { token: e, regex: /[a-zA-Z_][\w]*\b/ },
            { token: "paren.lparen", regex: /[{(\[]/ },
            { token: "paren.rparen", regex: /[})\]]/ },
          ],
          "#comments": [
            {
              token: "comment",
              regex: /\/\*/,
              push: [
                { token: "comment", regex: /\*\//, next: "pop" },
                { defaultToken: "comment" },
              ],
            },
            { token: ["text", "comment"], regex: /(\s*)(\/\/.*$)/ },
          ],
          "#constants": [
            {
              token: "constant.numeric.kotlin",
              regex:
                /\b(?:0(?:x|X)[0-9a-fA-F]*|(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:(?:e|E)(?:\+|-)?[0-9]+)?)(?:[LlFfUuDd]|UL|ul)?\b/,
            },
            { token: "constant.other.kotlin", regex: /\b[A-Z][A-Z0-9_]+\b/ },
          ],
          "#expressions": [
            { include: "#strings" },
            { include: "#constants" },
            { include: "#keywords" },
          ],
          "#imports": [
            {
              token: [
                "text",
                "keyword.other.kotlin",
                "text",
                "keyword.other.kotlin",
              ],
              regex: /^(\s*)(import)(\s+[^ $]+\s+)((?:as)?)/,
            },
          ],
          "#generics": [
            {
              token: "punctuation",
              regex: /</,
              push: [
                { token: "punctuation", regex: />/, next: "pop" },
                { token: "storage.type.generic.kotlin", regex: /\w+/ },
                { token: "keyword.operator", regex: /:/ },
                { token: "punctuation", regex: /,/ },
                { include: "#generics" },
              ],
            },
          ],
          "#classes": [
            { include: "#generics" },
            { token: "keyword", regex: /public|private|constructor/ },
            { token: "string", regex: /@[a-zA-Z][a-zA-Z:]*\b/ },
            { token: "text", regex: /(?=$|\(|{)/, next: "start" },
          ],
          "#keywords": [
            {
              token: "keyword.operator.kotlin",
              regex: /==|!=|===|!==|<=|>=|<|>|=>|->|::|\?:/,
            },
            { token: "keyword.operator.assignment.kotlin", regex: /=/ },
            {
              token: "keyword.operator.declaration.kotlin",
              regex: /:/,
              push: [
                { token: "text", regex: /(?=$|{|=|,)/, next: "pop" },
                { include: "#types" },
              ],
            },
            { token: "keyword.operator.dot.kotlin", regex: /\./ },
            {
              token: "keyword.operator.increment-decrement.kotlin",
              regex: /\-\-|\+\+/,
            },
            {
              token: "keyword.operator.arithmetic.kotlin",
              regex: /\-|\+|\*|\/|%/,
            },
            {
              token: "keyword.operator.arithmetic.assign.kotlin",
              regex: /\+=|\-=|\*=|\/=/,
            },
            { token: "keyword.operator.logical.kotlin", regex: /!|&&|\|\|/ },
            { token: "keyword.operator.range.kotlin", regex: /\.\./ },
            { token: "punctuation.kotlin", regex: /[;,]/ },
          ],
          "#types": [
            { include: "#defaultTypes" },
            {
              token: "paren.lparen",
              regex: /\(/,
              push: [
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#defaultTypes" },
                { token: "punctuation", regex: /,/ },
              ],
            },
            { include: "#generics" },
            { token: "keyword.operator.declaration.kotlin", regex: /->/ },
            { token: "paren.rparen", regex: /\)/ },
            {
              token: "keyword.operator.declaration.kotlin",
              regex: /:/,
              push: [
                { token: "text", regex: /(?=$|{|=|,)/, next: "pop" },
                { include: "#types" },
              ],
            },
          ],
          "#defaultTypes": [
            {
              token: "storage.type.buildin.kotlin",
              regex:
                /\b(Any|Unit|String|Int|Boolean|Char|Long|Double|Float|Short|Byte|dynamic|IntArray|BooleanArray|CharArray|LongArray|DoubleArray|FloatArray|ShortArray|ByteArray|Array|List|Map|Nothing|Enum|Throwable|Comparable)\b/,
            },
          ],
          "#strings": [
            {
              token: "string",
              regex: /"""/,
              push: [
                { token: "string", regex: /"""/, next: "pop" },
                {
                  token: "variable.parameter.template.kotlin",
                  regex: /\$\w+|\${[^}]+}/,
                },
                { token: "constant.character.escape.kotlin", regex: /\\./ },
                { defaultToken: "string" },
              ],
            },
            {
              token: "string",
              regex: /"/,
              push: [
                { token: "string", regex: /"/, next: "pop" },
                {
                  token: "variable.parameter.template.kotlin",
                  regex: /\$\w+|\$\{[^\}]+\}/,
                },
                { token: "constant.character.escape.kotlin", regex: /\\./ },
                { defaultToken: "string" },
              ],
            },
            {
              token: "string",
              regex: /'/,
              push: [
                { token: "string", regex: /'/, next: "pop" },
                { token: "constant.character.escape.kotlin", regex: /\\./ },
                { defaultToken: "string" },
              ],
            },
            {
              token: "string",
              regex: /`/,
              push: [
                { token: "string", regex: /`/, next: "pop" },
                { defaultToken: "string" },
              ],
            },
          ],
        }),
          this.normalizeRules();
      };
    (i.metaData = {
      fileTypes: ["kt", "kts"],
      name: "Kotlin",
      scopeName: "source.Kotlin",
    }),
      o.inherits(i, r),
      (t.KotlinHighlightRules = i);
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
        r = e("../../range").Range,
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
      o.inherits(a, i),
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
              var r = this._getFoldWidgetBase(e, t, n);
              return !r && this.startRegionRe.test(o) ? "start" : r;
            }),
            (this.getFoldWidgetRange = function (e, t, n, o) {
              var r,
                i = e.getLine(n);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
              if ((r = i.match(this.foldingStartMarker))) {
                var a = r.index;
                if (r[1]) return this.openingBracketBlock(e, r[1], n, a);
                var s = e.getCommentFoldRange(n, a + r[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (o
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (r = i.match(this.foldingStopMarker))) {
                a = r.index + r[0].length;
                return r[1]
                  ? this.closingBracketBlock(e, r[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  i = t,
                  a = n.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var g = (n = e.getLine(t)).search(/\S/);
                if (-1 !== g) {
                  if (o > g) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= i) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (o == g) break;
                  }
                  s = t;
                }
              }
              return new r(i, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
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
              if (n > a) return new r(a, o, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/kotlin",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/kotlin_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        i = e("./kotlin_highlight_rules").KotlinHighlightRules,
        a = e("./folding/cstyle").FoldMode,
        s = function () {
          (this.HighlightRules = i),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      o.inherits(s, r),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/kotlin");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/kotlin"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
