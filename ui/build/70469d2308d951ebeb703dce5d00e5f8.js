ace.define(
  "ace/snippets/textile.snippets",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      '# Jekyll post header\nsnippet header\n\t---\n\ttitle: ${1:title}\n\tlayout: post\n\tdate: ${2:date} ${3:hour:minute:second} -05:00\n\t---\n\n# Image\nsnippet img\n\t!${1:url}(${2:title}):${3:link}!\n\n# Table\nsnippet |\n\t|${1}|${2}\n\n# Link\nsnippet link\n\t"${1:link text}":${2:url}\n\n# Acronym\nsnippet (\n\t(${1:Expand acronym})${2}\n\n# Footnote\nsnippet fn\n\t[${1:ref number}] ${3}\n\n\tfn$1. ${2:footnote}\n\t\n';
  }
),
  ace.define(
    "ace/snippets/textile",
    ["require", "exports", "module", "ace/snippets/textile.snippets"],
    function (e, t, n) {
      "use strict";
      (t.snippetText = e("./textile.snippets")), (t.scope = "textile");
    }
  ),
  ace.require(["ace/snippets/textile"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
