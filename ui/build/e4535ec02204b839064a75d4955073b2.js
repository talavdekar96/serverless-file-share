ace.define(
  "ace/mode/doc_comment_highlight_rules",
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
      i = function e() {
        this.$rules = {
          start: [
            { token: "comment.doc.tag", regex: "@\\w+(?=\\s|$)" },
            e.getTagRule(),
            { defaultToken: "comment.doc", caseInsensitive: !0 },
          ],
        };
      };
    o.inherits(i, r),
      (i.getTagRule = function (e) {
        return {
          token: "comment.doc.tag.storage.type",
          regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
        };
      }),
      (i.getStartRule = function (e) {
        return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
      }),
      (i.getEndRule = function (e) {
        return { token: "comment.doc", regex: "\\*\\/", next: e };
      }),
      (t.DocCommentHighlightRules = i);
  }
),
  ace.define(
    "ace/mode/c_cpp_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        i = e("./text_highlight_rules").TextHighlightRules,
        s = (t.cFunctions =
          "hypot|hypotf|hypotl|sscanf|system|snprintf|scanf|scalbn|scalbnf|scalbnl|scalbln|scalblnf|scalblnl|sin|sinh|sinhf|sinhl|sinf|sinl|signal|signbit|strstr|strspn|strncpy|strncat|strncmp|strcspn|strchr|strcoll|strcpy|strcat|strcmp|strtoimax|strtod|strtoul|strtoull|strtoumax|strtok|strtof|strtol|strtold|strtoll|strerror|strpbrk|strftime|strlen|strrchr|strxfrm|sprintf|setjmp|setvbuf|setlocale|setbuf|sqrt|sqrtf|sqrtl|swscanf|swprintf|srand|nearbyint|nearbyintf|nearbyintl|nexttoward|nexttowardf|nexttowardl|nextafter|nextafterf|nextafterl|nan|nanf|nanl|csin|csinh|csinhf|csinhl|csinf|csinl|csqrt|csqrtf|csqrtl|ccos|ccosh|ccoshf|ccosf|ccosl|cimag|cimagf|cimagl|ctime|ctan|ctanh|ctanhf|ctanhl|ctanf|ctanl|cos|cosh|coshf|coshl|cosf|cosl|conj|conjf|conjl|copysign|copysignf|copysignl|cpow|cpowf|cpowl|cproj|cprojf|cprojl|ceil|ceilf|ceill|cexp|cexpf|cexpl|clock|clog|clogf|clogl|clearerr|casin|casinh|casinhf|casinhl|casinf|casinl|cacos|cacosh|cacoshf|cacoshl|cacosf|cacosl|catan|catanh|catanhf|catanhl|catanf|catanl|calloc|carg|cargf|cargl|cabs|cabsf|cabsl|creal|crealf|creall|cbrt|cbrtf|cbrtl|time|toupper|tolower|tan|tanh|tanhf|tanhl|tanf|tanl|trunc|truncf|truncl|tgamma|tgammaf|tgammal|tmpnam|tmpfile|isspace|isnormal|isnan|iscntrl|isinf|isdigit|isunordered|isupper|ispunct|isprint|isfinite|iswspace|iswcntrl|iswctype|iswdigit|iswupper|iswpunct|iswprint|iswlower|iswalnum|iswalpha|iswgraph|iswxdigit|iswblank|islower|isless|islessequal|islessgreater|isalnum|isalpha|isgreater|isgreaterequal|isgraph|isxdigit|isblank|ilogb|ilogbf|ilogbl|imaxdiv|imaxabs|div|difftime|_Exit|ungetc|ungetwc|pow|powf|powl|puts|putc|putchar|putwc|putwchar|perror|printf|erf|erfc|erfcf|erfcl|erff|erfl|exit|exp|exp2|exp2f|exp2l|expf|expl|expm1|expm1f|expm1l|vsscanf|vsnprintf|vscanf|vsprintf|vswscanf|vswprintf|vprintf|vfscanf|vfprintf|vfwscanf|vfwprintf|vwscanf|vwprintf|va_start|va_copy|va_end|va_arg|qsort|fscanf|fsetpos|fseek|fclose|ftell|fopen|fdim|fdimf|fdiml|fpclassify|fputs|fputc|fputws|fputwc|fprintf|feholdexcept|fesetenv|fesetexceptflag|fesetround|feclearexcept|fetestexcept|feof|feupdateenv|feraiseexcept|ferror|fegetenv|fegetexceptflag|fegetround|fflush|fwscanf|fwide|fwprintf|fwrite|floor|floorf|floorl|fabs|fabsf|fabsl|fgets|fgetc|fgetpos|fgetws|fgetwc|freopen|free|fread|frexp|frexpf|frexpl|fmin|fminf|fminl|fmod|fmodf|fmodl|fma|fmaf|fmal|fmax|fmaxf|fmaxl|ldiv|ldexp|ldexpf|ldexpl|longjmp|localtime|localeconv|log|log1p|log1pf|log1pl|log10|log10f|log10l|log2|log2f|log2l|logf|logl|logb|logbf|logbl|labs|lldiv|llabs|llrint|llrintf|llrintl|llround|llroundf|llroundl|lrint|lrintf|lrintl|lround|lroundf|lroundl|lgamma|lgammaf|lgammal|wscanf|wcsstr|wcsspn|wcsncpy|wcsncat|wcsncmp|wcscspn|wcschr|wcscoll|wcscpy|wcscat|wcscmp|wcstoimax|wcstod|wcstoul|wcstoull|wcstoumax|wcstok|wcstof|wcstol|wcstold|wcstoll|wcstombs|wcspbrk|wcsftime|wcslen|wcsrchr|wcsrtombs|wcsxfrm|wctob|wctomb|wcrtomb|wprintf|wmemset|wmemchr|wmemcpy|wmemcmp|wmemmove|assert|asctime|asin|asinh|asinhf|asinhl|asinf|asinl|acos|acosh|acoshf|acoshl|acosf|acosl|atoi|atof|atol|atoll|atexit|atan|atanh|atanhf|atanhl|atan2|atan2f|atan2l|atanf|atanl|abs|abort|gets|getc|getchar|getenv|getwc|getwchar|gmtime|rint|rintf|rintl|round|roundf|roundl|rename|realloc|rewind|remove|remquo|remquof|remquol|remainder|remainderf|remainderl|rand|raise|bsearch|btowc|modf|modff|modfl|memset|memchr|memcpy|memcmp|memmove|mktime|malloc|mbsinit|mbstowcs|mbsrtowcs|mbtowc|mblen|mbrtowc|mbrlen"),
        c = function (e) {
          var t = (this.$keywords = this.createKeywordMapper(
              Object.assign(
                {
                  "keyword.control":
                    "break|case|continue|default|do|else|for|goto|if|_Pragma|return|switch|while|catch|operator|try|throw|using",
                  "storage.type":
                    "asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|_Imaginary|int|int8_t|int16_t|int32_t|int64_t|long|short|signed|size_t|struct|typedef|uint8_t|uint16_t|uint32_t|uint64_t|union|unsigned|void|class|wchar_t|template|char16_t|char32_t",
                  "storage.modifier":
                    "const|extern|register|restrict|static|volatile|inline|private|protected|public|friend|explicit|virtual|export|mutable|typename|constexpr|new|delete|alignas|alignof|decltype|noexcept|thread_local",
                  "keyword.operator":
                    "and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eq|const_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace",
                  "variable.language": "this",
                  "constant.language": "NULL|true|false|TRUE|FALSE|nullptr",
                  "support.function.C99.c": s,
                },
                e
              ),
              "identifier"
            )),
            n =
              /\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/
                .source,
            o =
              "%" +
              /(\d+\$)?/.source +
              /[#0\- +']*/.source +
              /[,;:_]?/.source +
              /((-?\d+)|\*(-?\d+\$)?)?/.source +
              /(\.((-?\d+)|\*(-?\d+\$)?)?)?/.source +
              /(hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?/.source +
              /(\[[^"\]]+\]|[diouxXDOUeEfFgGaACcSspn%])/.source;
          (this.$rules = {
            start: [
              { token: "comment", regex: "//$", next: "start" },
              { token: "comment", regex: "//", next: "singleLineComment" },
              r.getStartRule("doc-start"),
              { token: "comment", regex: "\\/\\*", next: "comment" },
              { token: "string", regex: "'(?:" + n + "|.)?'" },
              {
                token: "string.start",
                regex: '"',
                stateName: "qqstring",
                next: [
                  { token: "string", regex: /\\\s*$/, next: "qqstring" },
                  { token: "constant.language.escape", regex: n },
                  { token: "constant.language.escape", regex: o },
                  { token: "string.end", regex: '"|$', next: "start" },
                  { defaultToken: "string" },
                ],
              },
              {
                token: "string.start",
                regex: 'R"\\(',
                stateName: "rawString",
                next: [
                  { token: "string.end", regex: '\\)"', next: "start" },
                  { defaultToken: "string" },
                ],
              },
              {
                token: "constant.numeric",
                regex: "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b",
              },
              {
                token: "constant.numeric",
                regex:
                  "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b",
              },
              {
                token: "keyword",
                regex: "#\\s*(?:include|import|pragma|line|define|undef)\\b",
                next: "directive",
              },
              {
                token: "keyword",
                regex: "#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b",
              },
              { token: t, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*" },
              {
                token: "keyword.operator",
                regex:
                  /--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/,
              },
              { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\." },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: "\\*\\/", next: "start" },
              { defaultToken: "comment" },
            ],
            singleLineComment: [
              { token: "comment", regex: /\\$/, next: "singleLineComment" },
              { token: "comment", regex: /$/, next: "start" },
              { defaultToken: "comment" },
            ],
            directive: [
              { token: "constant.other.multiline", regex: /\\/ },
              { token: "constant.other.multiline", regex: /.*\\/ },
              { token: "constant.other", regex: "\\s*<.+?>", next: "start" },
              {
                token: "constant.other",
                regex: '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
                next: "start",
              },
              {
                token: "constant.other",
                regex: "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                next: "start",
              },
              { token: "constant.other", regex: /[^\\\/]+/, next: "start" },
            ],
          }),
            this.embedRules(r, "doc-", [r.getEndRule("start")]),
            this.normalizeRules();
        };
      o.inherits(c, i), (t.c_cppHighlightRules = c);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var o = e("../range").Range,
        r = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var r = n[1].length,
              i = e.findMatchingBracket({ row: t, column: r });
            if (!i || i.row == t) return 0;
            var s = this.$getIndent(e.getLine(i.row));
            e.replace(new o(t, 0, t, r - 1), s);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(r.prototype),
        (t.MatchingBraceOutdent = r);
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
        s = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      o.inherits(s, i),
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
                var s = r.index;
                if (r[1]) return this.openingBracketBlock(e, r[1], n, s);
                var c = e.getCommentFoldRange(n, s + r[0].length, 1);
                return (
                  c &&
                    !c.isMultiLine() &&
                    (o
                      ? (c = this.getSectionRange(e, n))
                      : "all" != t && (c = null)),
                  c
                );
              }
              if ("markbegin" !== t && (r = i.match(this.foldingStopMarker))) {
                s = r.index + r[0].length;
                return r[1]
                  ? this.closingBracketBlock(e, r[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  i = t,
                  s = n.length,
                  c = (t += 1),
                  a = e.getLength();
                ++t < a;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (o > l) break;
                  var f = this.getFoldWidgetRange(e, "all", t);
                  if (f) {
                    if (f.start.row <= i) break;
                    if (f.isMultiLine()) t = f.end.row;
                    else if (o == l) break;
                  }
                  c = t;
                }
              }
              return new r(i, s, c, e.getLine(c).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  i = e.getLength(),
                  s = n,
                  c = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  a = 1;
                ++n < i;

              ) {
                t = e.getLine(n);
                var l = c.exec(t);
                if (l && (l[1] ? a-- : a++, !a)) break;
              }
              if (n > s) return new r(s, o, n, t.length);
            });
        }.call(s.prototype);
    }
  ),
  ace.define(
    "ace/mode/c_cpp",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/c_cpp_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        i = e("./c_cpp_highlight_rules").c_cppHighlightRules,
        s = e("./matching_brace_outdent").MatchingBraceOutdent,
        c = e("./folding/cstyle").FoldMode,
        a = function () {
          (this.HighlightRules = i),
            (this.$outdent = new s()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.foldingRules = new c());
        };
      o.inherits(a, r),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                r = this.getTokenizer().getLineTokens(t, e),
                i = r.tokens,
                s = r.state;
              if (i.length && "comment" == i[i.length - 1].type) return o;
              if ("start" == e) (c = t.match(/^.*[\{\(\[]\s*$/)) && (o += n);
              else if ("doc-start" == e) {
                if ("start" == s) return "";
                var c;
                (c = t.match(/^\s*(\/?)\*/)) &&
                  (c[1] && (o += " "), (o += "* "));
              }
              return o;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/c_cpp"),
            (this.snippetFileId = "ace/snippets/c_cpp");
        }.call(a.prototype),
        (t.Mode = a);
    }
  ),
  ace.define(
    "ace/mode/protobuf_highlight_rules",
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
          var e = this.createKeywordMapper(
            {
              "keyword.declaration.protobuf":
                "message|required|optional|repeated|package|import|option|enum",
              "support.type":
                "double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes",
            },
            "identifier"
          );
          (this.$rules = {
            start: [
              { token: "comment", regex: /\/\/.*$/ },
              { token: "comment", regex: /\/\*/, next: "comment" },
              { token: "constant", regex: "<[^>]+>" },
              { regex: "=", token: "keyword.operator.assignment.protobuf" },
              { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
              { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
            ],
            comment: [
              { token: "comment", regex: "\\*\\/", next: "start" },
              { defaultToken: "comment" },
            ],
          }),
            this.normalizeRules();
        };
      o.inherits(i, r), (t.ProtobufHighlightRules = i);
    }
  ),
  ace.define(
    "ace/mode/protobuf",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/c_cpp",
      "ace/mode/protobuf_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./c_cpp").Mode,
        i = e("./protobuf_highlight_rules").ProtobufHighlightRules,
        s = e("./folding/cstyle").FoldMode,
        c = function () {
          r.call(this),
            (this.foldingRules = new s()),
            (this.HighlightRules = i);
        };
      o.inherits(c, r),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/protobuf");
        }.call(c.prototype),
        (t.Mode = c);
    }
  ),
  ace.require(["ace/mode/protobuf"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
