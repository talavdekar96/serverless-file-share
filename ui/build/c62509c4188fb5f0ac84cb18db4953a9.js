ace.define(
  "ace/snippets/haml.snippets",
  ["require", "exports", "module"],
  function (t, e, n) {
    n.exports =
      "snippet t\n\t%table\n\t\t%tr\n\t\t\t%th\n\t\t\t\t${1:headers}\n\t\t%tr\n\t\t\t%td\n\t\t\t\t${2:headers}\nsnippet ul\n\t%ul\n\t\t%li\n\t\t\t${1:item}\n\t\t%li\nsnippet =rp\n\t= render :partial => '${1:partial}'\nsnippet =rpl\n\t= render :partial => '${1:partial}', :locals => {}\nsnippet =rpc\n\t= render :partial => '${1:partial}', :collection => @$1\n\n";
  }
),
  ace.define(
    "ace/snippets/haml",
    ["require", "exports", "module", "ace/snippets/haml.snippets"],
    function (t, e, n) {
      "use strict";
      (e.snippetText = t("./haml.snippets")), (e.scope = "haml");
    }
  ),
  ace.require(["ace/snippets/haml"], function (t) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = t);
  });
