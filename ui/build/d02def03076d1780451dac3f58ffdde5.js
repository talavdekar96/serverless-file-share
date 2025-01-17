ace.define(
  "ace/ext/linking",
  ["require", "exports", "module", "ace/editor", "ace/config"],
  function (e, o, i) {
    var n = e("../editor").Editor;
    function t(e) {
      var i = e.editor;
      if (e.getAccelKey()) {
        i = e.editor;
        var n = e.getDocumentPosition(),
          t = i.session.getTokenAt(n.row, n.column);
        o.previousLinkingHover &&
          o.previousLinkingHover != t &&
          i._emit("linkHoverOut"),
          i._emit("linkHover", { position: n, token: t }),
          (o.previousLinkingHover = t);
      } else
        o.previousLinkingHover &&
          (i._emit("linkHoverOut"), (o.previousLinkingHover = !1));
    }
    function r(e) {
      var o = e.getAccelKey();
      if (0 == e.getButton() && o) {
        var i = e.editor,
          n = e.getDocumentPosition(),
          t = i.session.getTokenAt(n.row, n.column);
        i._emit("linkClick", { position: n, token: t });
      }
    }
    e("../config").defineOptions(n.prototype, "editor", {
      enableLinking: {
        set: function (e) {
          e
            ? (this.on("click", r), this.on("mousemove", t))
            : (this.off("click", r), this.off("mousemove", t));
        },
        value: !1,
      },
    }),
      (o.previousLinkingHover = !1);
  }
),
  ace.require(["ace/ext/linking"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
