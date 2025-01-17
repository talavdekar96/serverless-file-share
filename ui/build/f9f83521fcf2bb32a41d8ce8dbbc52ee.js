ace.define(
  "ace/mode/ion_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var i = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      r = function () {
        var e = {
          token: this.createKeywordMapper(
            {
              "constant.language.bool.ion": "TRUE|FALSE",
              "constant.language.null.ion":
                "NULL.NULL|NULL.BOOL|NULL.INT|NULL.FLOAT|NULL.DECIMAL|NULL.TIMESTAMP|NULL.STRING|NULL.SYMBOL|NULL.BLOB|NULL.CLOB|NULL.STRUCT|NULL.LIST|NULL.SEXP|NULL",
            },
            "constant.other.symbol.identifier.ion",
            !0
          ),
          regex: "\\b\\w+(?:\\.\\w+)?\\b",
        };
        (this.$rules = {
          start: [{ include: "value" }],
          value: [
            { include: "whitespace" },
            { include: "comment" },
            { include: "annotation" },
            { include: "string" },
            { include: "number" },
            { include: "keywords" },
            { include: "symbol" },
            { include: "clob" },
            { include: "blob" },
            { include: "struct" },
            { include: "list" },
            { include: "sexp" },
          ],
          sexp: [
            {
              token: "punctuation.definition.sexp.begin.ion",
              regex: "\\(",
              push: [
                {
                  token: "punctuation.definition.sexp.end.ion",
                  regex: "\\)",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "storage.type.symbol.operator.ion",
                  regex:
                    "[\\!\\#\\%\\&\\*\\+\\-\\./\\;\\<\\=\\>\\?\\@\\^\\`\\|\\~]+",
                },
              ],
            },
          ],
          comment: [
            { token: "comment.line.ion", regex: "//[^\\n]*" },
            {
              token: "comment.block.ion",
              regex: "/\\*",
              push: [
                { token: "comment.block.ion", regex: "[*]/", next: "pop" },
                { token: "comment.block.ion", regex: "[^*/]+" },
                { token: "comment.block.ion", regex: "[*/]+" },
              ],
            },
          ],
          list: [
            {
              token: "punctuation.definition.list.begin.ion",
              regex: "\\[",
              push: [
                {
                  token: "punctuation.definition.list.end.ion",
                  regex: "\\]",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "punctuation.definition.list.separator.ion",
                  regex: ",",
                },
              ],
            },
          ],
          struct: [
            {
              token: "punctuation.definition.struct.begin.ion",
              regex: "\\{",
              push: [
                {
                  token: "punctuation.definition.struct.end.ion",
                  regex: "\\}",
                  next: "pop",
                },
                { include: "comment" },
                { include: "value" },
                {
                  token: "punctuation.definition.struct.separator.ion",
                  regex: ",|:",
                },
              ],
            },
          ],
          blob: [
            {
              token: [
                "punctuation.definition.blob.begin.ion",
                "string.other.blob.ion",
                "punctuation.definition.blob.end.ion",
              ],
              regex: '(\\{\\{)([^"]*)(\\}\\})',
            },
          ],
          clob: [
            {
              token: [
                "punctuation.definition.clob.begin.ion",
                "string.other.clob.ion",
                "punctuation.definition.clob.end.ion",
              ],
              regex: '(\\{\\{)("[^"]*")(\\}\\})',
            },
          ],
          symbol: [
            {
              token: "storage.type.symbol.quoted.ion",
              regex: "(['])((?:(?:\\\\')|(?:[^']))*?)(['])",
            },
            {
              token: "storage.type.symbol.identifier.ion",
              regex: "[\\$_a-zA-Z][\\$_a-zA-Z0-9]*",
            },
          ],
          number: [
            {
              token: "constant.numeric.timestamp.ion",
              regex:
                "\\d{4}(?:-\\d{2})?(?:-\\d{2})?T(?:\\d{2}:\\d{2})(?::\\d{2})?(?:\\.\\d+)?(?:Z|[-+]\\d{2}:\\d{2})?",
            },
            {
              token: "constant.numeric.timestamp.ion",
              regex: "\\d{4}-\\d{2}-\\d{2}T?",
            },
            {
              token: "constant.numeric.integer.binary.ion",
              regex: "-?0[bB][01](?:_?[01])*",
            },
            {
              token: "constant.numeric.integer.hex.ion",
              regex: "-?0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*",
            },
            {
              token: "constant.numeric.float.ion",
              regex:
                "-?(?:0|[1-9](?:_?\\d)*)(?:\\.(?:\\d(?:_?\\d)*)?)?(?:[eE][+-]?\\d+)",
            },
            {
              token: "constant.numeric.float.ion",
              regex: "(?:[-+]inf)|(?:nan)",
            },
            {
              token: "constant.numeric.decimal.ion",
              regex:
                "-?(?:0|[1-9](?:_?\\d)*)(?:(?:(?:\\.(?:\\d(?:_?\\d)*)?)(?:[dD][+-]?\\d+)|\\.(?:\\d(?:_?\\d)*)?)|(?:[dD][+-]?\\d+))",
            },
            {
              token: "constant.numeric.integer.ion",
              regex: "-?(?:0|[1-9](?:_?\\d)*)",
            },
          ],
          string: [
            {
              token: [
                "punctuation.definition.string.begin.ion",
                "string.quoted.double.ion",
                "punctuation.definition.string.end.ion",
              ],
              regex: '(["])((?:(?:\\\\")|(?:[^"]))*?)(["])',
            },
            {
              token: "punctuation.definition.string.begin.ion",
              regex: "'{3}",
              push: [
                {
                  token: "punctuation.definition.string.end.ion",
                  regex: "'{3}",
                  next: "pop",
                },
                { token: "string.quoted.triple.ion", regex: "(?:\\\\'|[^'])+" },
                { token: "string.quoted.triple.ion", regex: "'" },
              ],
            },
          ],
          annotation: [
            {
              token: [
                "variable.language.annotation.ion",
                "punctuation.definition.annotation.ion",
              ],
              regex: /('(?:[^'\\]|\\.)*')\s*(::)/,
            },
            {
              token: [
                "variable.language.annotation.ion",
                "punctuation.definition.annotation.ion",
              ],
              regex: "([\\$_a-zA-Z][\\$_a-zA-Z0-9]*)\\s*(::)",
            },
          ],
          whitespace: [{ token: "text.ion", regex: "\\s+" }],
        }),
          (this.$rules.keywords = [e]),
          this.normalizeRules();
      };
    i.inherits(r, o), (t.IonHighlightRules = r);
  }
),
  ace.define(
    "ace/mode/partiql_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
      "ace/mode/ion_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text_highlight_rules").TextHighlightRules,
        r = e("./ion_highlight_rules").IonHighlightRules,
        a = function () {
          var e = {
            token: this.createKeywordMapper(
              {
                "constant.language.partiql": "MISSING|FALSE|NULL|TRUE",
                "keyword.other.partiql":
                  "PIVOT|UNPIVOT|LIMIT|TUPLE|REMOVE|INDEX|CONFLICT|DO|NOTHING|RETURNING|MODIFIED|NEW|OLD|LET|ABSOLUTE|ACTION|ADD|ALL|ALLOCATE|ALTER|AND|ANY|ARE|AS|ASC|ASSERTION|AT|AUTHORIZATION|BEGIN|BETWEEN|BIT_LENGTH|BY|CASCADE|CASCADED|CASE|CATALOG|CHAR|CHARACTER_LENGTH|CHAR_LENGTH|CHECK|CLOSE|COLLATE|COLLATION|COLUMN|COMMIT|CONNECT|CONNECTION|CONSTRAINT|CONSTRAINTS|CONTINUE|CONVERT|CORRESPONDING|CREATE|CROSS|CURRENT|CURSOR|DEALLOCATE|DEC|DECLARE|DEFAULT|DEFERRABLE|DEFERRED|DELETE|DESC|DESCRIBE|DESCRIPTOR|DIAGNOSTICS|DISCONNECT|DISTINCT|DOMAIN|DROP|ELSE|END|END-EXEC|ESCAPE|EXCEPT|EXCEPTION|EXEC|EXECUTE|EXTERNAL|EXTRACT|FETCH|FIRST|FOR|FOREIGN|FOUND|FROM|FULL|GET|GLOBAL|GO|GOTO|GRANT|GROUP|HAVING|IDENTITY|IMMEDIATE|IN|INDICATOR|INITIALLY|INNER|INPUT|INSENSITIVE|INSERT|INTERSECT|INTERVAL|INTO|IS|ISOLATION|JOIN|KEY|LANGUAGE|LAST|LEFT|LEVEL|LIKE|LOCAL|LOWER|MATCH|MODULE|NAMES|NATIONAL|NATURAL|NCHAR|NEXT|NO|NOT|OCTET_LENGTH|OF|ON|ONLY|OPEN|OPTION|OR|ORDER|OUTER|OUTPUT|OVERLAPS|PAD|PARTIAL|POSITION|PRECISION|PREPARE|PRESERVE|PRIMARY|PRIOR|PRIVILEGES|PROCEDURE|PUBLIC|READ|REAL|REFERENCES|RELATIVE|RESTRICT|REVOKE|RIGHT|ROLLBACK|ROWS|SCHEMA|SCROLL|SECTION|SELECT|SESSION|SET|SIZE|SOME|SPACE|SQL|SQLCODE|SQLERROR|SQLSTATE|TABLE|TEMPORARY|THEN|TIME|TO|TRANSACTION|TRANSLATE|TRANSLATION|UNION|UNIQUE|UNKNOWN|UPDATE|UPPER|USAGE|USER|USING|VALUE|VALUES|VIEW|WHEN|WHENEVER|WHERE|WITH|WORK|WRITE|ZONE",
                "storage.type.partiql":
                  "BOOL|BOOLEAN|STRING|SYMBOL|CLOB|BLOB|STRUCT|LIST|SEXP|BAG|CHARACTER|DATE|DECIMAL|DOUBLE|FLOAT|INT|INTEGER|NUMERIC|SMALLINT|TIMESTAMP|VARCHAR|VARYING",
                "support.function.aggregation.partiql": "AVG|COUNT|MAX|MIN|SUM",
                "support.function.partiql":
                  "CAST|COALESCE|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|EXISTS|DATE_ADD|DATE_DIFF|NULLIF|SESSION_USER|SUBSTRING|SYSTEM_USER|TRIM",
              },
              "variable.language.identifier.partiql",
              !0
            ),
            regex: "\\b\\w+\\b",
          };
          (this.$rules = {
            start: [
              { include: "whitespace" },
              { include: "comment" },
              { include: "value" },
            ],
            value: [
              { include: "whitespace" },
              { include: "comment" },
              { include: "tuple_value" },
              { include: "collection_value" },
              { include: "scalar_value" },
            ],
            scalar_value: [
              { include: "string" },
              { include: "number" },
              { include: "keywords" },
              { include: "identifier" },
              { include: "embed-ion" },
              { include: "operator" },
              { include: "punctuation" },
            ],
            punctuation: [
              { token: "punctuation.partiql", regex: "[;:()\\[\\]\\{\\},.]" },
            ],
            operator: [
              {
                token: "keyword.operator.partiql",
                regex: "[+*/<>=~!@#%&|?^-]+",
              },
            ],
            identifier: [
              {
                token: "variable.language.identifier.quoted.partiql",
                regex: '(["])((?:(?:\\\\.)|(?:[^"\\\\]))*?)(["])',
              },
              {
                token: "variable.language.identifier.at.partiql",
                regex: "@\\w+",
              },
              {
                token: "variable.language.identifier.partiql",
                regex: "\\b\\w+(?:\\.\\w+)?\\b",
              },
            ],
            number: [
              {
                token: "constant.numeric.partiql",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
            ],
            string: [
              {
                token: [
                  "punctuation.definition.string.begin.partiql",
                  "string.quoted.single.partiql",
                  "punctuation.definition.string.end.partiql",
                ],
                regex: "(['])((?:(?:\\\\.)|(?:[^'\\\\]))*?)(['])",
              },
            ],
            collection_value: [
              { include: "array_value" },
              { include: "bag_value" },
            ],
            bag_value: [
              {
                token: "punctuation.definition.bag.begin.partiql",
                regex: "<<",
                push: [
                  {
                    token: "punctuation.definition.bag.end.partiql",
                    regex: ">>",
                    next: "pop",
                  },
                  { include: "comment" },
                  {
                    token: "punctuation.definition.bag.separator.partiql",
                    regex: ",",
                  },
                  { include: "value" },
                ],
              },
            ],
            comment: [
              { token: "comment.line.partiql", regex: "--.*" },
              {
                token: "comment.block.partiql",
                regex: "/\\*",
                push: "comment__1",
              },
            ],
            comment__1: [
              { token: "comment.block.partiql", regex: "[*]/", next: "pop" },
              { token: "comment.block.partiql", regex: "[^*/]+" },
              {
                token: "comment.block.partiql",
                regex: "/\\*",
                push: "comment__1",
              },
              { token: "comment.block.partiql", regex: "[*/]+" },
            ],
            array_value: [
              {
                token: "punctuation.definition.array.begin.partiql",
                regex: "\\[",
                push: [
                  {
                    token: "punctuation.definition.array.end.partiql",
                    regex: "\\]",
                    next: "pop",
                  },
                  { include: "comment" },
                  {
                    token: "punctuation.definition.array.separator.partiql",
                    regex: ",",
                  },
                  { include: "value" },
                ],
              },
            ],
            tuple_value: [
              {
                token: "punctuation.definition.tuple.begin.partiql",
                regex: "\\{",
                push: [
                  {
                    token: "punctuation.definition.tuple.end.partiql",
                    regex: "\\}",
                    next: "pop",
                  },
                  { include: "comment" },
                  {
                    token: "punctuation.definition.tuple.separator.partiql",
                    regex: ",|:",
                  },
                  { include: "value" },
                ],
              },
            ],
            whitespace: [{ token: "text.partiql", regex: "\\s+" }],
          }),
            (this.$rules.keywords = [e]),
            (this.$rules["embed-ion"] = [
              {
                token: "punctuation.definition.ion.begin.partiql",
                regex: "`",
                next: "ion-start",
              },
            ]),
            this.embedRules(r, "ion-", [
              {
                token: "punctuation.definition.ion.end.partiql",
                regex: "`",
                next: "start",
              },
            ]),
            this.normalizeRules();
        };
      i.inherits(a, o), (t.PartiqlHighlightRules = a);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var i = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var o = n[1].length,
              r = e.findMatchingBracket({ row: t, column: o });
            if (!r || r.row == t) return 0;
            var a = this.$getIndent(e.getLine(r.row));
            e.replace(new i(t, 0, t, o - 1), a);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
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
      var i = e("../../lib/oop"),
        o = e("../../range").Range,
        r = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      i.inherits(a, r),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var i = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(i) &&
                !this.startRegionRe.test(i) &&
                !this.tripleStarBlockCommentRe.test(i)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, n);
              return !o && this.startRegionRe.test(i) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, n, i) {
              var o,
                r = e.getLine(n);
              if (this.startRegionRe.test(r))
                return this.getCommentRegionBlock(e, r, n);
              if ((o = r.match(this.foldingStartMarker))) {
                var a = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], n, a);
                var l = e.getCommentFoldRange(n, a + o[0].length, 1);
                return (
                  l &&
                    !l.isMultiLine() &&
                    (i
                      ? (l = this.getSectionRange(e, n))
                      : "all" != t && (l = null)),
                  l
                );
              }
              if ("markbegin" !== t && (o = r.match(this.foldingStopMarker))) {
                a = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], n, a)
                  : e.getCommentFoldRange(n, a, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  i = n.search(/\S/),
                  r = t,
                  a = n.length,
                  l = (t += 1),
                  u = e.getLength();
                ++t < u;

              ) {
                var c = (n = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (i > c) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= r) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (i == c) break;
                  }
                  l = t;
                }
              }
              return new o(r, a, l, e.getLine(l).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var i = t.search(/\s*$/),
                  r = e.getLength(),
                  a = n,
                  l = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  u = 1;
                ++n < r;

              ) {
                t = e.getLine(n);
                var c = l.exec(t);
                if (c && (c[1] ? u-- : u++, !u)) break;
              }
              if (n > a) return new o(a, i, n, t.length);
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/partiql",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/partiql_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var i = e("../lib/oop"),
        o = e("./text").Mode,
        r = e("./partiql_highlight_rules").PartiqlHighlightRules,
        a = e("./matching_brace_outdent").MatchingBraceOutdent,
        l = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = r),
            (this.$outdent = new a()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new l());
        };
      i.inherits(u, o),
        function () {
          (this.lineCommentStart = "--"),
            (this.blockComment = { start: "/*", end: "*/", nestable: !0 }),
            (this.getNextLineIndent = function (e, t, n) {
              var i = this.$getIndent(t);
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (i += n);
              return i;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/partiql");
        }.call(u.prototype),
        (t.Mode = u);
    }
  ),
  ace.require(["ace/mode/partiql"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
