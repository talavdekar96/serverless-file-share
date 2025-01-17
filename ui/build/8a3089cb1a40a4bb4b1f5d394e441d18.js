ace.define(
  "ace/mode/plsql_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, r) {
    "use strict";
    var n = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      i = function () {
        var e = this.createKeywordMapper(
          {
            "support.function":
              "abs|acos|add_months|ascii|asciistr|asin|atan|atan2|avg|bfilename|bin_to_num|bitand|cardinality|case|cast|ceil|chartorowid|chr|coalesce|compose|concat|convert|corr|cos|cosh|count|covar_pop|covar_samp|cume_dist|current_date|current_timestamp|dbtimezone|decode|decompose|dense_rank|dump|empty_blob|empty_clob|exp|extract|first_value|floor|from_tz|greatest|group_id|hextoraw|initcap|instr|instr2|instr4|instrb|instrc|lag|last_day|last_value|lead|least|length|length2|length4|lengthb|lengthc|listagg|ln|lnnvl|localtimestamp|log|lower|lpad|ltrim|max|median|min|mod|months_between|nanvl|nchr|new_time|next_day|nth_value|nullif|numtodsinterval|numtoyminterval|nvl|nvl2|power|rank|rawtohex|regexp_count|regexp_instr|regexp_replace|regexp_substr|remainder|replace|round|rownum|rpad|rtrim|sessiontimezone|sign|sin|sinh|soundex|sqrt|stddev|substr|sum|sys_context|sysdate|systimestamp|tan|tanh|to_char|to_clob|to_date|to_dsinterval|to_lob|to_multi_byte|to_nclob|to_number|to_single_byte|to_timestamp|to_timestamp_tz|to_yminterval|translate|trim|trunc|tz_offset|uid|upper|user|userenv|var_pop|var_samp|variance|vsize",
            keyword:
              "all|alter|and|any|array|arrow|as|asc|at|begin|between|by|case|check|clusters|cluster|colauth|columns|compress|connect|crash|create|cross|current|database|declare|default|delete|desc|distinct|drop|else|end|exception|exclusive|exists|fetch|form|for|foreign|from|goto|grant|group|having|identified|if|in|inner|indexes|index|insert|intersect|into|is|join|key|left|like|lock|minus|mode|natural|nocompress|not|nowait|null|of|on|option|or|order,overlaps|outer|primary|prior|procedure|public|range|record|references|resource|revoke|right|select|share|size|sql|start|subtype|tabauth|table|then|to|type|union|unique|update|use|values|view|views|when|where|with",
            "constant.language": "true|false",
            "storage.type":
              "char|nchar|nvarchar2|varchar2|long|raw|number|numeric|float|dec|decimal|integer|int|smallint|real|double|precision|date|timestamp|interval|year|day|bfile|blob|clob|nclob|rowid|urowid",
          },
          "identifier",
          !0
        );
        (this.$rules = {
          start: [
            { token: "comment", regex: "--.*$" },
            { token: "comment", start: "/\\*", end: "\\*/" },
            { token: "string", regex: '".*?"' },
            { token: "string", regex: "'.*?'" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
            {
              token: "keyword.operator",
              regex:
                "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=",
            },
            { token: "paren.lparen", regex: "[\\(]" },
            { token: "paren.rparen", regex: "[\\)]" },
            { token: "text", regex: "\\s+" },
          ],
        }),
          this.normalizeRules();
      };
    n.inherits(i, o), (t.plsqlHighlightRules = i);
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
    function (e, t, r) {
      "use strict";
      var n = e("../../lib/oop"),
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
      n.inherits(a, i),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, r) {
              var n = e.getLine(r);
              if (
                this.singleLineBlockCommentRe.test(n) &&
                !this.startRegionRe.test(n) &&
                !this.tripleStarBlockCommentRe.test(n)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, r);
              return !o && this.startRegionRe.test(n) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, r, n) {
              var o,
                i = e.getLine(r);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, r);
              if ((o = i.match(this.foldingStartMarker))) {
                var a = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], r, a);
                var s = e.getCommentFoldRange(r, a + o[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (n
                      ? (s = this.getSectionRange(e, r))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (o = i.match(this.foldingStopMarker))) {
                a = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], r, a)
                  : e.getCommentFoldRange(r, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var r = e.getLine(t),
                  n = r.search(/\S/),
                  i = t,
                  a = r.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var c = (r = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (n > c) break;
                  var d = this.getFoldWidgetRange(e, "all", t);
                  if (d) {
                    if (d.start.row <= i) break;
                    if (d.isMultiLine()) t = d.end.row;
                    else if (n == c) break;
                  }
                  s = t;
                }
              }
              return new o(i, a, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, r) {
              for (
                var n = t.search(/\s*$/),
                  i = e.getLength(),
                  a = r,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++r < i;

              ) {
                t = e.getLine(r);
                var c = s.exec(t);
                if (c && (c[1] ? l-- : l++, !l)) break;
              }
              if (r > a) return new o(a, n, r, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/folding/sql",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/cstyle"],
    function (e, t, r) {
      "use strict";
      var n = e("../../lib/oop"),
        o = e("./cstyle").FoldMode,
        i = (t.FoldMode = function () {});
      n.inherits(i, o), function () {}.call(i.prototype);
    }
  ),
  ace.define(
    "ace/mode/plsql",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/plsql_highlight_rules",
      "ace/mode/folding/sql",
    ],
    function (e, t, r) {
      "use strict";
      var n = e("../lib/oop"),
        o = e("./text").Mode,
        i = e("./plsql_highlight_rules").plsqlHighlightRules,
        a = e("./folding/sql").FoldMode,
        s = function () {
          (this.HighlightRules = i), (this.foldingRules = new a());
        };
      n.inherits(s, o),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/plsql");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/plsql"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
