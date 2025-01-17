ace.define(
  "ace/snippets/fsl.snippets",
  ["require", "exports", "module"],
  function (e, n, t) {
    t.exports =
      'snippet header\n\tmachine_name     : "";\n\tmachine_author   : "";\n\tmachine_license  : MIT;\n\tmachine_comment  : "";\n\tmachine_language : en;\n\tmachine_version  : 1.0.0;\n\tfsl_version      : 1.0.0;\n\tstart_states     : [];\n';
  }
),
  ace.define(
    "ace/snippets/fsl",
    ["require", "exports", "module", "ace/snippets/fsl.snippets"],
    function (e, n, t) {
      "use strict";
      (n.snippetText = e("./fsl.snippets")), (n.scope = "fsl");
    }
  ),
  ace.require(["ace/snippets/fsl"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
