ace.define(
  "ace/mode/pig_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, i) {
    "use strict";
    var o = e("../lib/oop"),
      n = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        (this.$rules = {
          start: [
            {
              token: "comment.block.pig",
              regex: /\/\*/,
              push: [
                { token: "comment.block.pig", regex: /\*\//, next: "pop" },
                { defaultToken: "comment.block.pig" },
              ],
            },
            { token: "comment.line.double-dash.asciidoc", regex: /--.*$/ },
            {
              token: "keyword.control.pig",
              regex:
                /\b(?:ASSERT|LOAD|STORE|DUMP|FILTER|DISTINCT|FOREACH|GENERATE|STREAM|JOIN|COGROUP|GROUP|CROSS|ORDER|LIMIT|UNION|SPLIT|DESCRIBE|EXPLAIN|ILLUSTRATE|AS|BY|INTO|USING|LIMIT|PARALLEL|OUTER|INNER|DEFAULT|LEFT|SAMPLE|RANK|CUBE|ALL|KILL|QUIT|MAPREDUCE|ASC|DESC|THROUGH|SHIP|CACHE|DECLARE|CASE|WHEN|THEN|END|IN|PARTITION|FULL|IMPORT|IF|ONSCHEMA|INPUT|OUTPUT)\b/,
              caseInsensitive: !0,
            },
            {
              token: "storage.datatypes.pig",
              regex:
                /\b(?:int|long|float|double|chararray|bytearray|boolean|datetime|biginteger|bigdecimal|tuple|bag|map)\b/,
              caseInsensitive: !0,
            },
            {
              token: "support.function.storage.pig",
              regex:
                /\b(?:PigStorage|BinStorage|BinaryStorage|PigDump|HBaseStorage|JsonLoader|JsonStorage|AvroStorage|TextLoader|PigStreaming|TrevniStorage|AccumuloStorage)\b/,
            },
            {
              token: "support.function.udf.pig",
              regex:
                /\b(?:DIFF|TOBAG|TOMAP|TOP|TOTUPLE|RANDOM|FLATTEN|flatten|CUBE|ROLLUP|IsEmpty|ARITY|PluckTuple|SUBTRACT|BagToString)\b/,
            },
            {
              token: "support.function.udf.math.pig",
              regex:
                /\b(?:ABS|ACOS|ASIN|ATAN|CBRT|CEIL|COS|COSH|EXP|FLOOR|LOG|LOG10|ROUND|ROUND_TO|SIN|SINH|SQRT|TAN|TANH|AVG|COUNT|COUNT_STAR|MAX|MIN|SUM|COR|COV)\b/,
            },
            {
              token: "support.function.udf.string.pig",
              regex:
                /\b(?:CONCAT|INDEXOF|LAST_INDEX_OF|LCFIRST|LOWER|REGEX_EXTRACT|REGEX_EXTRACT_ALL|REPLACE|SIZE|STRSPLIT|SUBSTRING|TOKENIZE|TRIM|UCFIRST|UPPER|LTRIM|RTRIM|ENDSWITH|STARTSWITH|TRIM)\b/,
            },
            {
              token: "support.function.udf.datetime.pig",
              regex:
                /\b(?:AddDuration|CurrentTime|DaysBetween|GetDay|GetHour|GetMilliSecond|GetMinute|GetMonth|GetSecond|GetWeek|GetWeekYear|GetYear|HoursBetween|MilliSecondsBetween|MinutesBetween|MonthsBetween|SecondsBetween|SubtractDuration|ToDate|WeeksBetween|YearsBetween|ToMilliSeconds|ToString|ToUnixTime)\b/,
            },
            {
              token: "support.function.command.pig",
              regex:
                /\b(?:cat|cd|copyFromLocal|copyToLocal|cp|ls|mkdir|mv|pwd|rm)\b/,
            },
            { token: "variable.pig", regex: /\$[a_zA-Z0-9_]+/ },
            {
              token: "constant.language.pig",
              regex: /\b(?:NULL|true|false|stdin|stdout|stderr)\b/,
              caseInsensitive: !0,
            },
            { token: "constant.numeric.pig", regex: /\b\d+(?:\.\d+)?\b/ },
            {
              token: "keyword.operator.comparison.pig",
              regex: /!=|==|<|>|<=|>=|\b(?:MATCHES|IS|OR|AND|NOT)\b/,
              caseInsensitive: !0,
            },
            {
              token: "keyword.operator.arithmetic.pig",
              regex: /\+|\-|\*|\/|\%|\?|:|::|\.\.|#/,
            },
            {
              token: "string.quoted.double.pig",
              regex: /"/,
              push: [
                { token: "string.quoted.double.pig", regex: /"/, next: "pop" },
                { token: "constant.character.escape.pig", regex: /\\./ },
                { defaultToken: "string.quoted.double.pig" },
              ],
            },
            {
              token: "string.quoted.single.pig",
              regex: /'/,
              push: [
                { token: "string.quoted.single.pig", regex: /'/, next: "pop" },
                { token: "constant.character.escape.pig", regex: /\\./ },
                { defaultToken: "string.quoted.single.pig" },
              ],
            },
            {
              todo: {
                token: [
                  "text",
                  "keyword.parameter.pig",
                  "text",
                  "storage.type.parameter.pig",
                ],
                regex: /^(\s*)(set)(\s+)(\S+)/,
                caseInsensitive: !0,
                push: [
                  { token: "text", regex: /$/, next: "pop" },
                  { include: "$self" },
                ],
              },
            },
            {
              token: [
                "text",
                "keyword.alias.pig",
                "text",
                "storage.type.alias.pig",
              ],
              regex: /(\s*)(DEFINE|DECLARE|REGISTER)(\s+)(\S+)/,
              caseInsensitive: !0,
              push: [{ token: "text", regex: /;?$/, next: "pop" }],
            },
          ],
        }),
          this.normalizeRules();
      };
    (r.metaData = { fileTypes: ["pig"], name: "Pig", scopeName: "source.pig" }),
      o.inherits(r, n),
      (t.PigHighlightRules = r);
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
      var o = e("../../lib/oop"),
        n = e("../../range").Range,
        r = e("./fold_mode").FoldMode,
        g = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(g, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, i) {
              var o = e.getLine(i);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              var n = this._getFoldWidgetBase(e, t, i);
              return !n && this.startRegionRe.test(o) ? "start" : n;
            }),
            (this.getFoldWidgetRange = function (e, t, i, o) {
              var n,
                r = e.getLine(i);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, i);
              if ((n = r.match(this.foldingStartMarker))) {
                var g = n.index;
                if (n[1]) return this.openingBracketBlock(e, n[1], i, g);
                var s = e.getCommentFoldRange(i, g + n[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (o
                      ? (s = this.getSectionRange(e, i))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (n = r.match(this.foldingStopMarker))) {
                g = n.index + n[0].length;
                return n[1]
                  ? this.closingBracketBlock(e, n[1], i, g)
                  : e.getCommentFoldRange(i, g, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var i = e.getLine(t),
                  o = i.search(/\S/),
                  r = t,
                  g = i.length,
                  s = (t += 1),
                  a = e.getLength();
                ++t < a;

              ) {
                var l = (i = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (o > l) break;
                  var c = this.getFoldWidgetRange(e, "all", t);
                  if (c) {
                    if (c.start.row <= r) break;
                    if (c.isMultiLine()) t = c.end.row;
                    else if (o == l) break;
                  }
                  s = t;
                }
              }
              return new n(r, g, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, i) {
              for (
                var o = t.search(/\s*$/),
                  r = e.getLength(),
                  g = i,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  a = 1;
                ++i < r;

              ) {
                t = e.getLine(i);
                var l = s.exec(t);
                if (l && (l[1] ? a-- : a++, !a)) break;
              }
              if (i > g) return new n(g, o, i, t.length);
            });
        }.call(g.prototype);
    }
  ),
  ace.define(
    "ace/mode/pig",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/pig_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, i) {
      "use strict";
      var o = e("../lib/oop"),
        n = e("./text").Mode,
        r = e("./pig_highlight_rules").PigHighlightRules,
        g = e("./folding/cstyle").FoldMode,
        s = function () {
          (this.HighlightRules = r), (this.foldingRules = new g());
        };
      o.inherits(s, n),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/pig");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/pig"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
