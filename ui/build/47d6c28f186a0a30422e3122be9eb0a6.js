ace.define(
  "ace/snippets/razor.snippets",
  ["require", "exports", "module"],
  function (e, p, t) {
    t.exports = "snippet if\n(${1} == ${2}) {\n\t${3}\n}";
  }
),
  ace.define(
    "ace/snippets/razor",
    ["require", "exports", "module", "ace/snippets/razor.snippets"],
    function (e, p, t) {
      "use strict";
      (p.snippetText = e("./razor.snippets")), (p.scope = "razor");
    }
  ),
  ace.require(["ace/snippets/razor"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
