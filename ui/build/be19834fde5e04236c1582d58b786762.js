ace.define(
  "ace/ext/elastic_tabstops_lite",
  ["require", "exports", "module", "ace/editor", "ace/config"],
  function (t, e, o) {
    "use strict";
    var s = (function () {
      function t(t) {
        this.$editor = t;
        var e = this,
          o = [],
          s = !1;
        (this.onAfterExec = function () {
          (s = !1), e.processRows(o), (o = []);
        }),
          (this.onExec = function () {
            s = !0;
          }),
          (this.onChange = function (t) {
            s &&
              (-1 == o.indexOf(t.start.row) && o.push(t.start.row),
              t.end.row != t.start.row && o.push(t.end.row));
          });
      }
      return (
        (t.prototype.processRows = function (t) {
          this.$inChange = !0;
          for (var e = [], o = 0, s = t.length; o < s; o++) {
            var i = t[o];
            if (!(e.indexOf(i) > -1))
              for (
                var n = this.$findCellWidthsForBlock(i),
                  r = this.$setBlockCellWidthsToMax(n.cellWidths),
                  a = n.firstRow,
                  h = 0,
                  c = r.length;
                h < c;
                h++
              ) {
                var l = r[h];
                e.push(a), this.$adjustRow(a, l), a++;
              }
          }
          this.$inChange = !1;
        }),
        (t.prototype.$findCellWidthsForBlock = function (t) {
          for (
            var e, o = [], s = t;
            s >= 0 && 0 != (e = this.$cellWidthsForRow(s)).length;

          )
            o.unshift(e), s--;
          var i = s + 1;
          s = t;
          for (
            var n = this.$editor.session.getLength();
            s < n - 1 && (s++, 0 != (e = this.$cellWidthsForRow(s)).length);

          )
            o.push(e);
          return { cellWidths: o, firstRow: i };
        }),
        (t.prototype.$cellWidthsForRow = function (t) {
          for (
            var e = this.$selectionColumnsForRow(t),
              o = [-1].concat(this.$tabsForRow(t)),
              s = o
                .map(function (t) {
                  return 0;
                })
                .slice(1),
              i = this.$editor.session.getLine(t),
              n = 0,
              r = o.length - 1;
            n < r;
            n++
          ) {
            var a = o[n] + 1,
              h = o[n + 1],
              c = this.$rightmostSelectionInCell(e, h),
              l = i.substring(a, h);
            s[n] = Math.max(l.replace(/\s+$/g, "").length, c - a);
          }
          return s;
        }),
        (t.prototype.$selectionColumnsForRow = function (t) {
          var e = [],
            o = this.$editor.getCursorPosition();
          return (
            this.$editor.session.getSelection().isEmpty() &&
              t == o.row &&
              e.push(o.column),
            e
          );
        }),
        (t.prototype.$setBlockCellWidthsToMax = function (t) {
          for (
            var e, o, s, i = !0, n = this.$izip_longest(t), r = 0, a = n.length;
            r < a;
            r++
          ) {
            var h = n[r];
            if (h.push) {
              h.push(NaN);
              for (var c = 0, l = h.length; c < l; c++) {
                var p = h[c];
                if ((i && ((e = c), (s = 0), (i = !1)), isNaN(p))) {
                  o = c;
                  for (var u = e; u < o; u++) t[u][r] = s;
                  i = !0;
                }
                s = Math.max(s, p);
              }
            } else console.error(h);
          }
          return t;
        }),
        (t.prototype.$rightmostSelectionInCell = function (t, e) {
          var o = 0;
          if (t.length) {
            for (var s = [], i = 0, n = t.length; i < n; i++)
              t[i] <= e ? s.push(i) : s.push(0);
            o = Math.max.apply(Math, s);
          }
          return o;
        }),
        (t.prototype.$tabsForRow = function (t) {
          for (
            var e, o = [], s = this.$editor.session.getLine(t), i = /\t/g;
            null != (e = i.exec(s));

          )
            o.push(e.index);
          return o;
        }),
        (t.prototype.$adjustRow = function (t, e) {
          var o = this.$tabsForRow(t);
          if (0 != o.length)
            for (
              var s = 0, i = -1, n = this.$izip(e, o), r = 0, a = n.length;
              r < a;
              r++
            ) {
              var h = n[r][0],
                c = n[r][1],
                l = (i += 1 + h) - (c += s);
              if (0 != l) {
                var p = this.$editor.session.getLine(t).substr(0, c),
                  u = p.replace(/\s*$/g, ""),
                  f = p.length - u.length;
                l > 0 &&
                  (this.$editor.session
                    .getDocument()
                    .insertInLine(
                      { row: t, column: c + 1 },
                      Array(l + 1).join(" ") + "\t"
                    ),
                  this.$editor.session.getDocument().removeInLine(t, c, c + 1),
                  (s += l)),
                  l < 0 &&
                    f >= -l &&
                    (this.$editor.session
                      .getDocument()
                      .removeInLine(t, c + l, c),
                    (s += l));
              }
            }
        }),
        (t.prototype.$izip_longest = function (t) {
          if (!t[0]) return [];
          for (var e = t[0].length, o = t.length, s = 1; s < o; s++) {
            var i = t[s].length;
            i > e && (e = i);
          }
          for (var n = [], r = 0; r < e; r++) {
            var a = [];
            for (s = 0; s < o; s++)
              "" === t[s][r] ? a.push(NaN) : a.push(t[s][r]);
            n.push(a);
          }
          return n;
        }),
        (t.prototype.$izip = function (t, e) {
          for (
            var o = t.length >= e.length ? e.length : t.length, s = [], i = 0;
            i < o;
            i++
          ) {
            var n = [t[i], e[i]];
            s.push(n);
          }
          return s;
        }),
        t
      );
    })();
    e.ElasticTabstopsLite = s;
    var i = t("../editor").Editor;
    t("../config").defineOptions(i.prototype, "editor", {
      useElasticTabstops: {
        set: function (t) {
          t
            ? (this.elasticTabstops || (this.elasticTabstops = new s(this)),
              this.commands.on("afterExec", this.elasticTabstops.onAfterExec),
              this.commands.on("exec", this.elasticTabstops.onExec),
              this.on("change", this.elasticTabstops.onChange))
            : this.elasticTabstops &&
              (this.commands.removeListener(
                "afterExec",
                this.elasticTabstops.onAfterExec
              ),
              this.commands.removeListener("exec", this.elasticTabstops.onExec),
              this.removeListener("change", this.elasticTabstops.onChange));
        },
      },
    });
  }
),
  ace.require(["ace/ext/elastic_tabstops_lite"], function (t) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = t);
  });
