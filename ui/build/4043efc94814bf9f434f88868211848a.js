ace.define(
  "ace/ext/whitespace",
  ["require", "exports", "module", "ace/lib/lang"],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/lang");
    (t.$detectIndentation = function (e, t) {
      for (
        var n = [], r = [], i = 0, o = 0, s = Math.min(e.length, 1e3), a = 0;
        a < s;
        a++
      ) {
        var c = e[a];
        if (/^\s*[^*+\-\s]/.test(c)) {
          if ("\t" == c[0]) i++, (o = -Number.MAX_VALUE);
          else {
            var g = c.match(/^ */)[0].length;
            if (g && "\t" != c[g]) {
              var l = g - o;
              !(l > 0) || o % l || g % l || (r[l] = (r[l] || 0) + 1),
                (n[g] = (n[g] || 0) + 1);
            }
            o = g;
          }
          for (; a < s && "\\" == c[c.length - 1]; ) c = e[a++];
        }
      }
      function h(e) {
        for (var t = 0, r = e; r < n.length; r += e) t += n[r] || 0;
        return t;
      }
      var u = r.reduce(function (e, t) {
          return e + t;
        }, 0),
        f = { score: 0, length: 0 },
        d = 0;
      for (a = 1; a < 12; a++) {
        var p = h(a);
        1 == a
          ? ((d = p), (p = n[1] ? 0.9 : 0.8), n.length || (p = 0))
          : (p /= d),
          r[a] && (p += r[a] / u),
          p > f.score && (f = { score: p, length: a });
      }
      if (f.score && f.score > 1.4) var v = f.length;
      return i > d + 1
        ? ((1 == v || d < i / 4 || f.score < 1.8) && (v = void 0),
          { ch: "\t", length: v })
        : d > i + 1
        ? { ch: " ", length: v }
        : void 0;
    }),
      (t.detectIndentation = function (e) {
        var n = e.getLines(0, 1e3),
          r = t.$detectIndentation(n) || {};
        return (
          r.ch && e.setUseSoftTabs(" " == r.ch),
          r.length && e.setTabSize(r.length),
          r
        );
      }),
      (t.trimTrailingSpace = function (e, t) {
        var n = e.getDocument(),
          r = n.getAllLines(),
          i = t && t.trimEmpty ? -1 : 0,
          o = [],
          s = -1;
        t &&
          t.keepCursorPosition &&
          (e.selection.rangeCount
            ? e.selection.rangeList.ranges.forEach(function (e, t, n) {
                var r = n[t + 1];
                (r && r.cursor.row == e.cursor.row) || o.push(e.cursor);
              })
            : o.push(e.selection.getCursor()),
          (s = 0));
        for (var a = o[s] && o[s].row, c = 0, g = r.length; c < g; c++) {
          var l = r[c],
            h = l.search(/\s+$/);
          c == a &&
            (h < o[s].column && h > i && (h = o[s].column),
            s++,
            (a = o[s] ? o[s].row : -1)),
            h > i && n.removeInLine(c, h, l.length);
        }
      }),
      (t.convertIndentation = function (e, t, n) {
        var i = e.getTabString()[0],
          o = e.getTabSize();
        n || (n = o), t || (t = i);
        for (
          var s = "\t" == t ? t : r.stringRepeat(t, n),
            a = e.doc,
            c = a.getAllLines(),
            g = {},
            l = {},
            h = 0,
            u = c.length;
          h < u;
          h++
        ) {
          var f = c[h].match(/^\s*/)[0];
          if (f) {
            var d = e.$getStringScreenWidth(f)[0],
              p = Math.floor(d / o),
              v = d % o,
              m = g[p] || (g[p] = r.stringRepeat(s, p));
            (m += l[v] || (l[v] = r.stringRepeat(" ", v))) != f &&
              (a.removeInLine(h, 0, f.length),
              a.insertInLine({ row: h, column: 0 }, m));
          }
        }
        e.setTabSize(n), e.setUseSoftTabs(" " == t);
      }),
      (t.$parseStringArg = function (e) {
        var t = {};
        /t/.test(e) ? (t.ch = "\t") : /s/.test(e) && (t.ch = " ");
        var n = e.match(/\d+/);
        return n && (t.length = parseInt(n[0], 10)), t;
      }),
      (t.$parseArg = function (e) {
        return e
          ? "string" == typeof e
            ? t.$parseStringArg(e)
            : "string" == typeof e.text
            ? t.$parseStringArg(e.text)
            : e
          : {};
      }),
      (t.commands = [
        {
          name: "detectIndentation",
          description: "Detect indentation from content",
          exec: function (e) {
            t.detectIndentation(e.session);
          },
        },
        {
          name: "trimTrailingSpace",
          description: "Trim trailing whitespace",
          exec: function (e, n) {
            t.trimTrailingSpace(e.session, n);
          },
        },
        {
          name: "convertIndentation",
          description: "Convert indentation to ...",
          exec: function (e, n) {
            var r = t.$parseArg(n);
            t.convertIndentation(e.session, r.ch, r.length);
          },
        },
        {
          name: "setIndentation",
          description: "Set indentation",
          exec: function (e, n) {
            var r = t.$parseArg(n);
            r.length && e.session.setTabSize(r.length),
              r.ch && e.session.setUseSoftTabs(" " == r.ch);
          },
        },
      ]);
  }
),
  ace.require(["ace/ext/whitespace"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
