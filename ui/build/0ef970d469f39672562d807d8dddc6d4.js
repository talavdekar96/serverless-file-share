ace.define(
  "ace/snippets/csound_document.snippets",
  ["require", "exports", "module"],
  function (e, n, t) {
    t.exports =
      "# <CsoundSynthesizer>\nsnippet synth\n\t<CsoundSynthesizer>\n\t<CsInstruments>\n\t${1}\n\t</CsInstruments>\n\t<CsScore>\n\te\n\t</CsScore>\n\t</CsoundSynthesizer>\n";
  }
),
  ace.define(
    "ace/snippets/csound_document",
    ["require", "exports", "module", "ace/snippets/csound_document.snippets"],
    function (e, n, t) {
      "use strict";
      (n.snippetText = e("./csound_document.snippets")),
        (n.scope = "csound_document");
    }
  ),
  ace.require(["ace/snippets/csound_document"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
