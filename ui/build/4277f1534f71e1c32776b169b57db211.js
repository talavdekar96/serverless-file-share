ace.define(
  "ace/snippets/rst.snippets",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      "# rst\n\nsnippet :\n\t:${1:field name}: ${2:field body}\nsnippet *\n\t*${1:Emphasis}*\nsnippet **\n\t**${1:Strong emphasis}**\nsnippet _\n\t\\`${1:hyperlink-name}\\`_\n\t.. _\\`$1\\`: ${2:link-block}\nsnippet =\n\t${1:Title}\n\t=====${2:=}\n\t${3}\nsnippet -\n\t${1:Title}\n\t-----${2:-}\n\t${3}\nsnippet cont:\n\t.. contents::\n\t\n";
  }
),
  ace.define(
    "ace/snippets/rst",
    ["require", "exports", "module", "ace/snippets/rst.snippets"],
    function (e, t, n) {
      "use strict";
      (t.snippetText = e("./rst.snippets")), (t.scope = "rst");
    }
  ),
  ace.require(["ace/snippets/rst"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
