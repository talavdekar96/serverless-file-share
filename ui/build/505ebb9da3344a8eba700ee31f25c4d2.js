ace.define(
  "ace/ext/hardwrap",
  ["require", "exports", "module", "ace/range", "ace/editor", "ace/config"],
  function (e, t, n) {
    "use strict";
    var r = e("../range").Range;
    function a(e, t) {
      for (
        var n = t.column || e.getOption("printMarginColumn"),
          a = 0 != t.allowMerge,
          o = Math.min(t.startRow, t.endRow),
          s = Math.max(t.startRow, t.endRow),
          i = e.session;
        o <= s;

      ) {
        var l = i.getLine(o);
        if (l.length > n) {
          if ((g = m(l, n, 5))) {
            var c = /^\s*/.exec(l)[0];
            i.replace(new r(o, g.start, o, g.end), "\n" + c);
          }
          s++;
        } else if (a && /\S/.test(l) && o != s) {
          var d = i.getLine(o + 1);
          if (d && /\S/.test(d)) {
            var g,
              f = l.replace(/\s+$/, ""),
              h = d.replace(/^\s+/, ""),
              u = f + " " + h;
            if (((g = m(u, n, 5)) && g.start > f.length) || u.length < n) {
              var p = new r(o, f.length, o + 1, d.length - h.length);
              i.replace(p, " "), o--, s--;
            } else
              f.length < l.length && i.remove(new r(o, f.length, o, l.length));
          }
        }
        o++;
      }
      function m(e, t, n) {
        if (!(e.length < t)) {
          var r = e.slice(0, t),
            a = e.slice(t),
            o = /^(?:(\s+)|(\S+)(\s+))/.exec(a),
            s = /(?:(\s+)|(\s+)(\S+))$/.exec(r),
            i = 0,
            l = 0;
          return (
            s && !s[2] && ((i = t - s[1].length), (l = t)),
            o && !o[2] && (i || (i = t), (l = t + o[1].length)),
            i
              ? { start: i, end: l }
              : s && s[2] && s.index > n
              ? { start: s.index, end: s.index + s[2].length }
              : o && o[2]
              ? { start: (i = t + o[2].length), end: i + o[3].length }
              : void 0
          );
        }
      }
    }
    function o(e) {
      if ("insertstring" == e.command.name && /\S/.test(e.args)) {
        var t = e.editor,
          n = t.selection.cursor;
        if (n.column <= t.renderer.$printMarginColumn) return;
        var r = t.session.$undoManager.$lastDelta;
        a(t, { startRow: n.row, endRow: n.row, allowMerge: !1 }),
          r != t.session.$undoManager.$lastDelta && t.session.markUndoGroup();
      }
    }
    var s = e("../editor").Editor;
    e("../config").defineOptions(s.prototype, "editor", {
      hardWrap: {
        set: function (e) {
          e
            ? this.commands.on("afterExec", o)
            : this.commands.off("afterExec", o);
        },
        value: !1,
      },
    }),
      (t.hardWrap = a);
  }
),
  ace.require(["ace/ext/hardwrap"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
