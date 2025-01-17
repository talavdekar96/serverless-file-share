ace.define(
  "ace/ext/beautify",
  ["require", "exports", "module", "ace/token_iterator"],
  function (e, t, r) {
    "use strict";
    var a = e("../token_iterator").TokenIterator;
    function o(e, t) {
      return e.type.lastIndexOf(t + ".xml") > -1;
    }
    (t.singletonTags = [
      "area",
      "base",
      "br",
      "col",
      "command",
      "embed",
      "hr",
      "html",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]),
      (t.blockTags = [
        "article",
        "aside",
        "blockquote",
        "body",
        "div",
        "dl",
        "fieldset",
        "footer",
        "form",
        "head",
        "header",
        "html",
        "nav",
        "ol",
        "p",
        "script",
        "section",
        "style",
        "table",
        "tbody",
        "tfoot",
        "thead",
        "ul",
      ]),
      (t.formatOptions = { lineBreaksAfterCommasInCurlyBlock: !0 }),
      (t.beautify = function (e) {
        for (
          var r,
            s,
            n,
            i = new a(e, 0, 0),
            c = i.getCurrentToken(),
            l = e.getTabString(),
            u = t.singletonTags,
            m = t.blockTags,
            p = t.formatOptions || {},
            f = !1,
            y = !1,
            h = !1,
            d = "",
            g = "",
            b = "",
            k = 0,
            $ = 0,
            w = 0,
            x = 0,
            v = 0,
            T = 0,
            C = 0,
            R = 0,
            B = 0,
            O = !1,
            I = !1,
            q = !1,
            _ = !1,
            j = { 0: 0 },
            A = [],
            F = !1,
            S = function () {
              r &&
                r.value &&
                "string.regexp" !== r.type &&
                (r.value = r.value.replace(/^\s*/, ""));
            },
            K = function () {
              for (var e = d.length - 1; 0 != e && " " === d[e]; ) e -= 1;
              d = d.slice(0, e + 1);
            },
            L = function () {
              (d = d.trimRight()), (f = !1);
            };
          null !== c;

        ) {
          if (
            ((R = i.getCurrentTokenRow()),
            i.$rowTokens,
            (r = i.stepForward()),
            "undefined" !== typeof c)
          ) {
            if (
              ((g = c.value),
              (v = 0),
              (q = "style" === b || "ace/mode/css" === e.$modeId),
              o(c, "tag-open")
                ? ((I = !0),
                  r && (_ = -1 !== m.indexOf(r.value)),
                  "</" === g &&
                    (_ && !f && B < 1 && B++, q && (B = 1), (v = 1), (_ = !1)))
                : o(c, "tag-close")
                ? (I = !1)
                : o(c, "comment.start")
                ? (_ = !0)
                : o(c, "comment.end") && (_ = !1),
              I ||
                B ||
                "paren.rparen" !== c.type ||
                "}" !== c.value.substr(0, 1) ||
                B++,
              R !== s && ((B = R), s && (B -= s)),
              B)
            ) {
              for (L(); B > 0; B--) d += "\n";
              (f = !0),
                o(c, "comment") ||
                  c.type.match(/^(comment|string)$/) ||
                  (g = g.trimLeft());
            }
            if (g) {
              if (
                ("keyword" === c.type &&
                g.match(/^(if|else|elseif|for|foreach|while|switch)$/)
                  ? ((A[k] = g),
                    S(),
                    (h = !0),
                    g.match(/^(else|elseif)$/) &&
                      d.match(/\}[\s]*$/) &&
                      (L(), (y = !0)))
                  : "paren.lparen" === c.type
                  ? (S(),
                    "{" === g.substr(-1) && ((h = !0), (O = !1), I || (B = 1)),
                    "{" === g.substr(0, 1) &&
                      ((y = !0),
                      "[" !== d.substr(-1) && "[" === d.trimRight().substr(-1)
                        ? (L(), (y = !1))
                        : ")" === d.trimRight().substr(-1)
                        ? L()
                        : K()))
                  : "paren.rparen" === c.type
                  ? ((v = 1),
                    "}" === g.substr(0, 1) &&
                      ("case" === A[k - 1] && v++,
                      "{" === d.trimRight().substr(-1)
                        ? L()
                        : ((y = !0), q && (B += 2))),
                    "]" === g.substr(0, 1) &&
                      "}" !== d.substr(-1) &&
                      "}" === d.trimRight().substr(-1) &&
                      ((y = !1), x++, L()),
                    ")" === g.substr(0, 1) &&
                      "(" !== d.substr(-1) &&
                      "(" === d.trimRight().substr(-1) &&
                      ((y = !1), x++, L()),
                    K())
                  : ("keyword.operator" !== c.type && "keyword" !== c.type) ||
                    !g.match(
                      /^(=|==|===|!=|!==|&&|\|\||and|or|xor|\+=|.=|>|>=|<|<=|=>)$/
                    )
                  ? "punctuation.operator" === c.type && ";" === g
                    ? (L(), S(), (h = !0), q && B++)
                    : "punctuation.operator" === c.type && g.match(/^(:|,)$/)
                    ? (L(),
                      S(),
                      g.match(/^(,)$/) &&
                      C > 0 &&
                      0 === T &&
                      p.lineBreaksAfterCommasInCurlyBlock
                        ? B++
                        : ((h = !0), (f = !1)))
                    : "support.php_tag" !== c.type || "?>" !== g || f
                    ? o(c, "attribute-name") && d.substr(-1).match(/^\s$/)
                      ? (y = !0)
                      : o(c, "attribute-equals")
                      ? (K(), S())
                      : o(c, "tag-close")
                      ? (K(), "/>" === g && (y = !0))
                      : "keyword" === c.type &&
                        g.match(/^(case|default)$/) &&
                        F &&
                        (v = 1)
                    : (L(), (y = !0))
                  : (L(), S(), (y = !0), (h = !0)),
                f &&
                  (!c.type.match(/^(comment)$/) ||
                    g.substr(0, 1).match(/^[/#]$/)) &&
                  (!c.type.match(/^(string)$/) ||
                    g.substr(0, 1).match(/^['"@]$/)))
              ) {
                if (((x = w), k > $)) for (x++, n = k; n > $; n--) j[n] = x;
                else k < $ && (x = j[k]);
                for (
                  $ = k,
                    w = x,
                    v && (x -= v),
                    O && !T && (x++, (O = !1)),
                    n = 0;
                  n < x;
                  n++
                )
                  d += l;
              }
              if (
                ("keyword" === c.type && g.match(/^(case|default)$/)
                  ? !1 === F && ((A[k] = g), k++, (F = !0))
                  : "keyword" === c.type &&
                    g.match(/^(break)$/) &&
                    A[k - 1] &&
                    A[k - 1].match(/^(case|default)$/) &&
                    (k--, (F = !1)),
                "paren.lparen" === c.type &&
                  ((T += (g.match(/\(/g) || []).length),
                  (C += (g.match(/\{/g) || []).length),
                  (k += g.length)),
                "keyword" === c.type && g.match(/^(if|else|elseif|for|while)$/)
                  ? ((O = !0), (T = 0))
                  : !T && g.trim() && "comment" !== c.type && (O = !1),
                "paren.rparen" === c.type)
              )
                for (
                  T -= (g.match(/\)/g) || []).length,
                    C -= (g.match(/\}/g) || []).length,
                    n = 0;
                  n < g.length;
                  n++
                )
                  k--, "}" === g.substr(n, 1) && "case" === A[k] && k--;
              "text" == c.type && (g = g.replace(/\s+$/, " ")),
                y && !f && (K(), "\n" !== d.substr(-1) && (d += " ")),
                (d += g),
                h && (d += " "),
                (f = !1),
                (y = !1),
                (h = !1),
                ((o(c, "tag-close") && (_ || -1 !== m.indexOf(b))) ||
                  (o(c, "doctype") && ">" === g)) &&
                  (B = _ && r && "</" === r.value ? -1 : 1),
                r &&
                  -1 === u.indexOf(r.value) &&
                  (o(c, "tag-open") && "</" === g
                    ? k--
                    : o(c, "tag-open") && "<" === g
                    ? k++
                    : o(c, "tag-close") && "/>" === g && k--),
                o(c, "tag-name") && (b = g),
                (s = R);
            }
          }
          c = r;
        }
        (d = d.trim()), e.doc.setValue(d);
      }),
      (t.commands = [
        {
          name: "beautify",
          description: "Format selection (Beautify)",
          exec: function (e) {
            t.beautify(e.session);
          },
          bindKey: "Ctrl-Shift-B",
        },
      ]);
  }
),
  ace.require(["ace/ext/beautify"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
