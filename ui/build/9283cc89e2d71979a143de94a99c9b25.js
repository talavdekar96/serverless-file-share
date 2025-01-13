ace.define(
  "ace/ext/spellcheck",
  ["require", "exports", "module", "ace/lib/event", "ace/editor", "ace/config"],
  function (e, t, n) {
    "use strict";
    var i = e("../lib/event");
    t.contextMenuHandler = function (e) {
      var t = e.target,
        n = t.textInput.getElement();
      if (t.selection.isEmpty()) {
        var o = t.getCursorPosition(),
          s = t.session.getWordRange(o.row, o.column),
          r = t.session.getTextRange(s);
        if (((t.session.tokenRe.lastIndex = 0), t.session.tokenRe.test(r))) {
          var c = r + " \x01\x01";
          (n.value = c),
            n.setSelectionRange(r.length, r.length + 1),
            n.setSelectionRange(0, 0),
            n.setSelectionRange(0, r.length);
          var l = !1;
          i.addListener(n, "keydown", function e() {
            i.removeListener(n, "keydown", e), (l = !0);
          }),
            t.textInput.setInputHandler(function (e) {
              if (e == c) return "";
              if (0 === e.lastIndexOf(c, 0)) return e.slice(c.length);
              if (e.substr(n.selectionEnd) == c) return e.slice(0, -c.length);
              if ("\x01\x01" == e.slice(-2)) {
                var i = e.slice(0, -2);
                if (" " == i.slice(-1))
                  return l
                    ? i.substring(0, n.selectionEnd)
                    : ((i = i.slice(0, -1)), t.session.replace(s, i), "");
              }
              return e;
            });
        }
      }
    };
    var o = e("../editor").Editor;
    e("../config").defineOptions(o.prototype, "editor", {
      spellcheck: {
        set: function (e) {
          (this.textInput.getElement().spellcheck = !!e),
            e
              ? this.on("nativecontextmenu", t.contextMenuHandler)
              : this.removeListener("nativecontextmenu", t.contextMenuHandler);
        },
        value: !0,
      },
    });
  }
),
  ace.require(["ace/ext/spellcheck"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
