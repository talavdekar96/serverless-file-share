ace.define(
  "ace/ext/statusbar",
  ["require", "exports", "module", "ace/lib/dom", "ace/lib/lang"],
  function (e, t, n) {
    "use strict";
    var a = e("../lib/dom"),
      o = e("../lib/lang"),
      i = (function () {
        function e(e, t) {
          (this.element = a.createElement("div")),
            (this.element.className = "ace_status-indicator"),
            (this.element.style.cssText = "display: inline-block;"),
            t.appendChild(this.element);
          var n = o
            .delayedCall(
              function () {
                this.updateStatus(e);
              }.bind(this)
            )
            .schedule.bind(null, 100);
          e.on("changeStatus", n),
            e.on("changeSelection", n),
            e.on("keyboardActivity", n);
        }
        return (
          (e.prototype.updateStatus = function (e) {
            var t = [];
            function n(e, n) {
              e && t.push(e, n || "|");
            }
            n(e.keyBinding.getStatusText(e)), e.commands.recording && n("REC");
            var a = e.selection,
              o = a.lead;
            if (!a.isEmpty()) {
              var i = e.getSelectionRange();
              n(
                "(" +
                  (i.end.row - i.start.row) +
                  ":" +
                  (i.end.column - i.start.column) +
                  ")",
                " "
              );
            }
            n(o.row + ":" + o.column, " "),
              a.rangeCount && n("[" + a.rangeCount + "]", " "),
              t.pop(),
              (this.element.textContent = t.join(""));
          }),
          e
        );
      })();
    t.StatusBar = i;
  }
),
  ace.require(["ace/ext/statusbar"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
