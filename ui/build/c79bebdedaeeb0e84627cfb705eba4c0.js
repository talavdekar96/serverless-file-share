ace.define(
  "ace/snippets/lua.snippets",
  ["require", "exports", "module"],
  function (e, n, t) {
    t.exports =
      "snippet #!\n\t#!/usr/bin/env lua\n\t$1\nsnippet local\n\tlocal ${1:x} = ${2:1}\nsnippet fun\n\tfunction ${1:fname}(${2:...})\n\t\t${3:-- body}\n\tend\nsnippet for\n\tfor ${1:i}=${2:1},${3:10} do\n\t\t${4:print(i)}\n\tend\nsnippet forp\n\tfor ${1:i},${2:v} in pairs(${3:table_name}) do\n\t   ${4:-- body}\n\tend\nsnippet fori\n\tfor ${1:i},${2:v} in ipairs(${3:table_name}) do\n\t   ${4:-- body}\n\tend\n";
  }
),
  ace.define(
    "ace/snippets/lua",
    ["require", "exports", "module", "ace/snippets/lua.snippets"],
    function (e, n, t) {
      "use strict";
      (n.snippetText = e("./lua.snippets")), (n.scope = "lua");
    }
  ),
  ace.require(["ace/snippets/lua"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
