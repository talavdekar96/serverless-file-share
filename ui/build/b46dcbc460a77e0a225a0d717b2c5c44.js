ace.define(
  "ace/snippets/diff.snippets",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      '# DEP-3 (http://dep.debian.net/deps/dep3/) style patch header\nsnippet header DEP-3 style header\n\tDescription: ${1}\n\tOrigin: ${2:vendor|upstream|other}, ${3:url of the original patch}\n\tBug: ${4:url in upstream bugtracker}\n\tForwarded: ${5:no|not-needed|url}\n\tAuthor: ${6:`g:snips_author`}\n\tReviewed-by: ${7:name and email}\n\tLast-Update: ${8:`strftime("%Y-%m-%d")`}\n\tApplied-Upstream: ${9:upstream version|url|commit}\n\n';
  }
),
  ace.define(
    "ace/snippets/diff",
    ["require", "exports", "module", "ace/snippets/diff.snippets"],
    function (e, t, n) {
      "use strict";
      (t.snippetText = e("./diff.snippets")), (t.scope = "diff");
    }
  ),
  ace.require(["ace/snippets/diff"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
