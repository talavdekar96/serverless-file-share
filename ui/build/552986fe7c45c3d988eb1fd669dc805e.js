ace.define(
  "ace/mode/vbscript_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var s = e("../lib/oop"),
      r = e("./text_highlight_rules").TextHighlightRules,
      o = function () {
        var e = this.createKeywordMapper(
          {
            "keyword.control.asp":
              "If|Then|Else|ElseIf|End|While|Wend|For|To|Each|Case|Select|Return|Continue|Do|Until|Loop|Next|With|Exit|Function|Property|Type|Enum|Sub|IIf|Class",
            "storage.type.asp":
              "Dim|Call|Const|Redim|Set|Let|Get|New|Randomize|Option|Explicit|Preserve|Erase|Execute|ExecuteGlobal",
            "storage.modifier.asp": "Private|Public|Default",
            "keyword.operator.asp": "Mod|And|Not|Or|Xor|As|Eqv|Imp|Is",
            "constant.language.asp": "Empty|False|Nothing|Null|True",
            "variable.language.vb.asp": "Me",
            "support.class.vb.asp": "RegExp",
            "support.class.asp":
              "Application|ObjectContext|Request|Response|Server|Session",
            "support.class.collection.asp":
              "Contents|StaticObjects|ClientCertificate|Cookies|Form|QueryString|ServerVariables",
            "support.constant.asp":
              "TotalBytes|Buffer|CacheControl|Charset|ContentType|Expires|ExpiresAbsolute|IsClientConnected|PICS|Status|ScriptTimeout|CodePage|LCID|SessionID|Timeout",
            "support.function.asp":
              "Lock|Unlock|SetAbort|SetComplete|BinaryRead|AddHeader|AppendToLog|BinaryWrite|Clear|Flush|Redirect|Write|CreateObject|HTMLEncode|MapPath|URLEncode|Abandon|Convert|Regex",
            "support.function.event.asp":
              "Application_OnEnd|Application_OnStart|OnTransactionAbort|OnTransactionCommit|Session_OnEnd|Session_OnStart",
            "support.function.vb.asp":
              "Array|Add|Asc|Atn|CBool|CByte|CCur|CDate|CDbl|Chr|CInt|CLng|Conversions|Cos|CreateObject|CSng|CStr|Date|DateAdd|DateDiff|DatePart|DateSerial|DateValue|Day|Derived|Math|Escape|Eval|Exists|Exp|Filter|FormatCurrency|FormatDateTime|FormatNumber|FormatPercent|GetLocale|GetObject|GetRef|Hex|Hour|InputBox|InStr|InStrRev|Int|Fix|IsArray|IsDate|IsEmpty|IsNull|IsNumeric|IsObject|Item|Items|Join|Keys|LBound|LCase|Left|Len|LoadPicture|Log|LTrim|RTrim|Trim|Maths|Mid|Minute|Month|MonthName|MsgBox|Now|Oct|Remove|RemoveAll|Replace|RGB|Right|Rnd|Round|ScriptEngine|ScriptEngineBuildVersion|ScriptEngineMajorVersion|ScriptEngineMinorVersion|Second|SetLocale|Sgn|Sin|Space|Split|Sqr|StrComp|String|StrReverse|Tan|Time|Timer|TimeSerial|TimeValue|TypeName|UBound|UCase|Unescape|VarType|Weekday|WeekdayName|Year|AscB|AscW|ChrB|ChrW|InStrB|LeftB|LenB|MidB|RightB|Abs|GetUILanguage",
            "support.type.vb.asp":
              "vbTrue|vbFalse|vbCr|vbCrLf|vbFormFeed|vbLf|vbNewLine|vbNullChar|vbNullString|vbTab|vbVerticalTab|vbBinaryCompare|vbTextCompare|vbSunday|vbMonday|vbTuesday|vbWednesday|vbThursday|vbFriday|vbSaturday|vbUseSystemDayOfWeek|vbFirstJan1|vbFirstFourDays|vbFirstFullWeek|vbGeneralDate|vbLongDate|vbShortDate|vbLongTime|vbShortTime|vbObjectError|vbEmpty|vbNull|vbInteger|vbLong|vbSingle|vbDouble|vbCurrency|vbDate|vbString|vbObject|vbError|vbBoolean|vbVariant|vbDataObject|vbDecimal|vbByte|vbArray|vbOKOnly|vbOKCancel|vbAbortRetryIgnore|vbYesNoCancel|vbYesNo|vbRetryCancel|vbCritical|vbQuestion|vbExclamation|vbInformation|vbDefaultButton1|vbDefaultButton2|vbDefaultButton3|vbDefaultButton4|vbApplicationModal|vbSystemModal|vbOK|vbCancel|vbAbort|vbRetry|vbIgnore|vbYes|vbNo|vbUseDefault",
          },
          "identifier",
          !0
        );
        this.$rules = {
          start: [
            { token: ["meta.ending-space"], regex: "$" },
            { token: [null], regex: "^(?=\\t)", next: "state_3" },
            { token: [null], regex: "^(?= )", next: "state_4" },
            {
              token: [
                "text",
                "storage.type.function.asp",
                "text",
                "entity.name.function.asp",
                "text",
                "punctuation.definition.parameters.asp",
                "variable.parameter.function.asp",
                "punctuation.definition.parameters.asp",
              ],
              regex:
                "^(\\s*)(Function|Sub)(\\s+)([a-zA-Z_]\\w*)(\\s*)(\\()([^)]*)(\\))",
            },
            {
              token: "punctuation.definition.comment.asp",
              regex: "'|REM(?=\\s|$)",
              next: "comment",
              caseInsensitive: !0,
            },
            {
              token: "storage.type.asp",
              regex: "On\\s+Error\\s+(?:Resume\\s+Next|GoTo)\\b",
              caseInsensitive: !0,
            },
            {
              token: "punctuation.definition.string.begin.asp",
              regex: '"',
              next: "string",
            },
            {
              token: ["punctuation.definition.variable.asp"],
              regex: "(\\$)[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b\\s*",
            },
            {
              token: "constant.numeric.asp",
              regex:
                "-?\\b(?:(?:0(?:x|X)[0-9a-fA-F]*)|(?:(?:[0-9]+\\.?[0-9]*)|(?:\\.[0-9]+))(?:(?:e|E)(?:\\+|-)?[0-9]+)?)(?:L|l|UL|ul|u|U|F|f)?\\b",
            },
            { regex: "\\w+", token: e },
            {
              token: ["entity.name.function.asp"],
              regex:
                "(?:(\\b[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b)(?=\\(\\)?))",
            },
            {
              token: ["keyword.operator.asp"],
              regex: "\\-|\\+|\\*|\\/|\\>|\\<|\\=|\\&|\\\\|\\^",
            },
          ],
          state_3: [
            {
              token: ["meta.odd-tab.tabs", "meta.even-tab.tabs"],
              regex: "(\\t)(\\t)?",
            },
            { token: "meta.leading-space", regex: "(?=[^\\t])", next: "start" },
            { token: "meta.leading-space", regex: ".", next: "state_3" },
          ],
          state_4: [
            {
              token: ["meta.odd-tab.spaces", "meta.even-tab.spaces"],
              regex: "(  )(  )?",
            },
            { token: "meta.leading-space", regex: "(?=[^ ])", next: "start" },
            { defaultToken: "meta.leading-space" },
          ],
          comment: [
            { token: "comment.line.apostrophe.asp", regex: "$", next: "start" },
            { defaultToken: "comment.line.apostrophe.asp" },
          ],
          string: [
            { token: "constant.character.escape.apostrophe.asp", regex: '""' },
            { token: "string.quoted.double.asp", regex: '"', next: "start" },
            { defaultToken: "string.quoted.double.asp" },
          ],
        };
      };
    s.inherits(o, r), (t.VBScriptHighlightRules = o);
  }
),
  ace.define(
    "ace/mode/folding/vbscript",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
      "ace/token_iterator",
    ],
    function (e, t, n) {
      "use strict";
      var s = e("../../lib/oop"),
        r = e("./fold_mode").FoldMode,
        o = e("../../range").Range,
        a = e("../../token_iterator").TokenIterator,
        i = (t.FoldMode = function () {});
      s.inherits(i, r),
        function () {
          (this.indentKeywords = {
            class: 1,
            function: 1,
            sub: 1,
            if: 1,
            select: 1,
            do: 1,
            for: 1,
            while: 1,
            with: 1,
            property: 1,
            else: 1,
            elseif: 1,
            end: -1,
            loop: -1,
            next: -1,
            wend: -1,
          }),
            (this.foldingStartMarker =
              /(?:\s|^)(class|function|sub|if|select|do|for|while|with|property|else|elseif)\b/i),
            (this.foldingStopMarker = /\b(end|loop|next|wend)\b/i),
            (this.getFoldWidgetRange = function (e, t, n) {
              var s = e.getLine(n),
                r = this.foldingStartMarker.test(s),
                o = this.foldingStopMarker.test(s);
              if (r || o) {
                var a = o
                  ? this.foldingStopMarker.exec(s)
                  : this.foldingStartMarker.exec(s);
                if (a && a[1].toLowerCase()) {
                  var i = e.getTokenAt(n, a.index + 2).type;
                  if (
                    "keyword.control.asp" === i ||
                    "storage.type.function.asp" === i
                  )
                    return this.vbsBlock(e, n, a.index + 2);
                }
              }
            }),
            (this.getFoldWidget = function (e, t, n) {
              var s = e.getLine(n),
                r = this.foldingStartMarker.test(s),
                o = this.foldingStopMarker.test(s);
              if (r && !o) {
                var a = this.foldingStartMarker.exec(s),
                  i = a && a[1].toLowerCase();
                if (i) {
                  var c = e.getTokenAt(n, a.index + 2).type;
                  if (
                    "keyword.control.asp" == c ||
                    "storage.type.function.asp" == c
                  )
                    return "if" != i || /then\s*('|$)/i.test(s) ? "start" : "";
                }
              }
              return "";
            }),
            (this.vbsBlock = function (e, t, n, s) {
              var r = new a(e, t, n),
                i = {
                  class: 1,
                  function: 1,
                  sub: 1,
                  if: 1,
                  select: 1,
                  with: 1,
                  property: 1,
                  else: 1,
                  elseif: 1,
                },
                c = r.getCurrentToken();
              if (
                c &&
                ("keyword.control.asp" == c.type ||
                  "storage.type.function.asp" == c.type)
              ) {
                var l = c.value.toLowerCase(),
                  u = c.value.toLowerCase(),
                  p = [u],
                  d = this.indentKeywords[u];
                if (d) {
                  var g = r.getCurrentTokenRange();
                  switch (u) {
                    case "property":
                    case "sub":
                    case "function":
                    case "if":
                    case "select":
                    case "do":
                    case "for":
                    case "class":
                    case "while":
                    case "with":
                      var f = e.getLine(t);
                      if (/^\s*If\s+.*\s+Then(?!')\s+(?!')\S/i.test(f)) return;
                      var b = new RegExp("(?:^|\\s)" + u, "i"),
                        v =
                          /^\s*End\s(If|Sub|Select|Function|Class|With|Property)\s*/i.test(
                            f
                          );
                      if (!b.test(f) && !v) return;
                      if (v) {
                        s = r.getCurrentTokenRange();
                        (r.step = r.stepBackward),
                          r.step(),
                          r.step(),
                          (c = r.getCurrentToken()) &&
                            "end" == (u = c.value.toLowerCase()) &&
                            ((g = r.getCurrentTokenRange()),
                            (g = new o(
                              g.start.row,
                              g.start.column,
                              s.start.row,
                              s.end.column
                            ))),
                          (d = -1);
                      }
                      break;
                    case "end":
                      var h = r.getCurrentTokenPosition();
                      if (
                        ((g = r.getCurrentTokenRange()),
                        (r.step = r.stepForward),
                        r.step(),
                        r.step(),
                        (c = r.getCurrentToken()) &&
                          (u = c.value.toLowerCase()) in i)
                      ) {
                        l = u;
                        var m =
                          (T = r.getCurrentTokenPosition()).column + u.length;
                        g = new o(h.row, h.column, T.row, m);
                      }
                      (r.step = r.stepBackward), r.step(), r.step();
                  }
                  var k =
                      -1 === d ? e.getLine(t - 1).length : e.getLine(t).length,
                    y = t,
                    w = [];
                  for (
                    w.push(g),
                      r.step = -1 === d ? r.stepBackward : r.stepForward;
                    (c = r.step());

                  ) {
                    var x = null,
                      C = !1;
                    if (
                      "keyword.control.asp" == c.type ||
                      "storage.type.function.asp" == c.type
                    ) {
                      u = c.value.toLowerCase();
                      var S = d * this.indentKeywords[u];
                      switch (u) {
                        case "property":
                        case "sub":
                        case "function":
                        case "if":
                        case "select":
                        case "do":
                        case "for":
                        case "class":
                        case "while":
                        case "with":
                          f = e.getLine(r.getCurrentTokenRow());
                          /^\s*If\s+.*\s+Then(?!')\s+(?!')\S/i.test(f) &&
                            ((S = 0), (C = !0)),
                            (b = new RegExp("^\\s* end\\s+" + u, "i")).test(
                              f
                            ) && ((S = 0), (C = !0));
                          break;
                        case "elseif":
                        case "else":
                          (S = 0), "elseif" != l && (C = !0);
                      }
                      if (S > 0) p.unshift(u);
                      else if (S <= 0 && !1 === C) {
                        if ((p.shift(), !p.length)) {
                          switch (u) {
                            case "end":
                              h = r.getCurrentTokenPosition();
                              if (
                                ((x = r.getCurrentTokenRange()),
                                r.step(),
                                r.step(),
                                (c = r.getCurrentToken()))
                              )
                                if ((u = c.value.toLowerCase()) in i) {
                                  "else" == l || "elseif" == l
                                    ? "if" !== u && w.shift()
                                    : u != l && w.shift();
                                  var T;
                                  m =
                                    (T = r.getCurrentTokenPosition()).column +
                                    u.length;
                                  x = new o(h.row, h.column, T.row, m);
                                } else w.shift();
                              else w.shift();
                              (r.step = r.stepBackward),
                                r.step(),
                                r.step(),
                                (u = (c =
                                  r.getCurrentToken()).value.toLowerCase());
                              break;
                            case "select":
                            case "sub":
                            case "if":
                            case "function":
                            case "class":
                            case "with":
                            case "property":
                              u != l && w.shift();
                              break;
                            case "do":
                              "loop" != l && w.shift();
                              break;
                            case "loop":
                              "do" != l && w.shift();
                              break;
                            case "for":
                              "next" != l && w.shift();
                              break;
                            case "next":
                              "for" != l && w.shift();
                              break;
                            case "while":
                              "wend" != l && w.shift();
                              break;
                            case "wend":
                              "while" != l && w.shift();
                          }
                          break;
                        }
                        0 === S && p.unshift(u);
                      }
                    }
                  }
                  if (!c) return null;
                  if (s)
                    return x ? w.push(x) : w.push(r.getCurrentTokenRange()), w;
                  t = r.getCurrentTokenRow();
                  if (-1 === d) {
                    m = e.getLine(t).length;
                    return new o(t, m, y - 1, k);
                  }
                  return new o(y, k, t - 1, e.getLine(t - 1).length);
                }
              }
            });
        }.call(i.prototype);
    }
  ),
  ace.define(
    "ace/mode/vbscript",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/vbscript_highlight_rules",
      "ace/mode/folding/vbscript",
      "ace/range",
    ],
    function (e, t, n) {
      "use strict";
      var s = e("../lib/oop"),
        r = e("./text").Mode,
        o = e("./vbscript_highlight_rules").VBScriptHighlightRules,
        a = e("./folding/vbscript").FoldMode,
        i = e("../range").Range,
        c = function () {
          (this.HighlightRules = o),
            (this.foldingRules = new a()),
            (this.$behaviour = this.$defaultBehaviour),
            (this.indentKeywords = this.foldingRules.indentKeywords);
        };
      s.inherits(c, r),
        function () {
          this.lineCommentStart = ["'", "REM"];
          var e = ["else", "elseif", "end", "loop", "next", "wend"];
          (this.getNextLineIndent = function (e, t, n) {
            var s = this.$getIndent(t),
              r = 0,
              o = this.getTokenizer().getLineTokens(t, e).tokens;
            return (
              "start" == e &&
                (r = (function (e, t, n) {
                  for (var s = 0, r = 0; r < e.length; r++) {
                    var o = e[r];
                    if (
                      "keyword.control.asp" == o.type ||
                      "storage.type.function.asp" == o.type
                    ) {
                      var a = o.value.toLowerCase();
                      if (a in n)
                        switch (a) {
                          case "property":
                          case "sub":
                          case "function":
                          case "select":
                          case "do":
                          case "for":
                          case "class":
                          case "while":
                          case "with":
                          case "if":
                            var i = new RegExp("^\\s* end\\s+" + a, "i");
                            /^\s*If\s+.*\s+Then(?!')\s+(?!')\S/i.test(t) ||
                              i.test(t) ||
                              (s += n[a]);
                            break;
                          default:
                            s += n[a];
                        }
                    }
                  }
                  return s < 0 ? -1 : s > 0 ? 1 : 0;
                })(o, t, this.indentKeywords)),
              r > 0
                ? s + n
                : r < 0 &&
                  s.substr(s.length - n.length) == n &&
                  !this.checkOutdent(e, t, "\n")
                ? s.substr(0, s.length - n.length)
                : s
            );
          }),
            (this.checkOutdent = function (t, n, s) {
              if ("\n" != s && "\r" != s && "\r\n" != s) return !1;
              var r = this.getTokenizer().getLineTokens(n.trim(), t).tokens;
              if (!r || !r.length) return !1;
              var o = r[0].value.toLowerCase();
              return (
                ("keyword.control.asp" == r[0].type ||
                  "storage.type.function.asp" == r[0].type) &&
                -1 != e.indexOf(o)
              );
            }),
            (this.getMatching = function (e, t, n, s) {
              if (void 0 == t) {
                var r = e.selection.lead;
                (n = r.column), (t = r.row);
              }
              void 0 == s && (s = !0);
              var o = e.getTokenAt(t, n);
              if (o && o.value.toLowerCase() in this.indentKeywords)
                return this.foldingRules.vbsBlock(e, t, n, s);
            }),
            (this.autoOutdent = function (e, t, n) {
              var s = t.getLine(n).match(/^\s*/)[0].length;
              if (s && n) {
                var r = this.getMatching(t, n, s + 1, !1);
                if (r && r.start.row != n) {
                  var o = this.$getIndent(t.getLine(r.start.row));
                  o.length != s &&
                    (t.replace(new i(n, 0, n, s), o),
                    t.outdentRows(new i(n + 1, 0, n + 1, 0)));
                }
              }
            }),
            (this.$id = "ace/mode/vbscript");
        }.call(c.prototype),
        (t.Mode = c);
    }
  ),
  ace.require(["ace/mode/vbscript"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
