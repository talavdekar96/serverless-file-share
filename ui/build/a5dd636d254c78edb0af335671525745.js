ace.define(
  "ace/theme/textmate",
  ["require", "exports", "module", "ace/theme/textmate-css", "ace/lib/dom"],
  function (e, t, s) {
    "use strict";
    (t.isDark = !1),
      (t.cssClass = "ace-tm"),
      (t.cssText = e("./textmate-css")),
      (t.$id = "ace/theme/textmate"),
      e("../lib/dom").importCssString(t.cssText, t.cssClass, !1);
  }
),
  ace.require(["ace/theme/textmate"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
