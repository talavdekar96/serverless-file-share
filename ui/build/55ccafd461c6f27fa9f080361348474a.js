ace.define(
  "ace/snippets/makefile.snippets",
  ["require", "exports", "module"],
  function (e, t, i) {
    i.exports =
      "snippet ifeq\n\tifeq (${1:cond0},${2:cond1})\n\t\t${3:code}\n\tendif\n";
  }
),
  ace.define(
    "ace/snippets/makefile",
    ["require", "exports", "module", "ace/snippets/makefile.snippets"],
    function (e, t, i) {
      "use strict";
      (t.snippetText = e("./makefile.snippets")), (t.scope = "makefile");
    }
  ),
  ace.require(["ace/snippets/makefile"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
