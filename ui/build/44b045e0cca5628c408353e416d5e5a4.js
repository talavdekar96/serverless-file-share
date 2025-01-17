ace.define(
  "ace/snippets/maze.snippets",
  ["require", "exports", "module"],
  function (e, p, n) {
    n.exports =
      "snippet >\ndescription assignment\nscope maze\n\t-> ${1}= ${2}\n\nsnippet >\ndescription if\nscope maze\n\t-> IF ${2:**} THEN %${3:L} ELSE %${4:R}\n";
  }
),
  ace.define(
    "ace/snippets/maze",
    ["require", "exports", "module", "ace/snippets/maze.snippets"],
    function (e, p, n) {
      "use strict";
      (p.snippetText = e("./maze.snippets")), (p.scope = "maze");
    }
  ),
  ace.require(["ace/snippets/maze"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
