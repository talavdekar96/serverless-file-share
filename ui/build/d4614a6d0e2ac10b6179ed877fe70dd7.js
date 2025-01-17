ace.define(
  "ace/ext/menu_tools/settings_menu.css",
  ["require", "exports", "module"],
  function (e, n, o) {
    o.exports =
      "#ace_settingsmenu, #kbshortcutmenu {\n    background-color: #F7F7F7;\n    color: black;\n    box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);\n    padding: 1em 0.5em 2em 1em;\n    overflow: auto;\n    position: absolute;\n    margin: 0;\n    bottom: 0;\n    right: 0;\n    top: 0;\n    z-index: 9991;\n    cursor: default;\n}\n\n.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {\n    box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);\n    background-color: rgba(255, 255, 255, 0.6);\n    color: black;\n}\n\n.ace_optionsMenuEntry:hover {\n    background-color: rgba(100, 100, 100, 0.1);\n    transition: all 0.3s\n}\n\n.ace_closeButton {\n    background: rgba(245, 146, 146, 0.5);\n    border: 1px solid #F48A8A;\n    border-radius: 50%;\n    padding: 7px;\n    position: absolute;\n    right: -8px;\n    top: -8px;\n    z-index: 100000;\n}\n.ace_closeButton{\n    background: rgba(245, 146, 146, 0.9);\n}\n.ace_optionsMenuKey {\n    color: darkslateblue;\n    font-weight: bold;\n}\n.ace_optionsMenuCommand {\n    color: darkcyan;\n    font-weight: normal;\n}\n.ace_optionsMenuEntry input, .ace_optionsMenuEntry button {\n    vertical-align: middle;\n}\n\n.ace_optionsMenuEntry button[ace_selected_button=true] {\n    background: #e7e7e7;\n    box-shadow: 1px 0px 2px 0px #adadad inset;\n    border-color: #adadad;\n}\n.ace_optionsMenuEntry button {\n    background: white;\n    border: 1px solid lightgray;\n    margin: 0px;\n}\n.ace_optionsMenuEntry button:hover{\n    background: #f0f0f0;\n}";
  }
),
  ace.define(
    "ace/ext/menu_tools/overlay_page",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/ext/menu_tools/settings_menu.css",
    ],
    function (e, n, o) {
      "use strict";
      var t = e("../../lib/dom"),
        r = e("./settings_menu.css");
      t.importCssString(r, "settings_menu.css", !1),
        (o.exports.overlayPage = function (e, n, o) {
          var t = document.createElement("div"),
            r = !1;
          function a(e) {
            27 === e.keyCode && i();
          }
          function i() {
            t &&
              (document.removeEventListener("keydown", a),
              t.parentNode.removeChild(t),
              e && e.focus(),
              (t = null),
              o && o());
          }
          return (
            (t.style.cssText =
              "margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; " +
              (e ? "background-color: rgba(0, 0, 0, 0.3);" : "")),
            t.addEventListener("click", function (e) {
              r || i();
            }),
            document.addEventListener("keydown", a),
            n.addEventListener("click", function (e) {
              e.stopPropagation();
            }),
            t.appendChild(n),
            document.body.appendChild(t),
            e && e.blur(),
            {
              close: i,
              setIgnoreFocusOut: function (e) {
                (r = e),
                  e &&
                    ((t.style.pointerEvents = "none"),
                    (n.style.pointerEvents = "auto"));
              },
            }
          );
        });
    }
  ),
  ace.define(
    "ace/ext/menu_tools/get_editor_keyboard_shortcuts",
    ["require", "exports", "module", "ace/lib/keys"],
    function (e, n, o) {
      "use strict";
      var t = e("../../lib/keys");
      o.exports.getEditorKeybordShortcuts = function (e) {
        t.KEY_MODS;
        var n = [],
          o = {};
        return (
          e.keyBinding.$handlers.forEach(function (e) {
            var t = e.commandKeyBinding;
            for (var r in t) {
              var a = r.replace(/(^|-)\w/g, function (e) {
                  return e.toUpperCase();
                }),
                i = t[r];
              Array.isArray(i) || (i = [i]),
                i.forEach(function (e) {
                  "string" != typeof e && (e = e.name),
                    o[e]
                      ? (o[e].key += "|" + a)
                      : ((o[e] = { key: a, command: e }), n.push(o[e]));
                });
            }
          }),
          n
        );
      };
    }
  ),
  ace.define(
    "ace/ext/keybinding_menu",
    [
      "require",
      "exports",
      "module",
      "ace/editor",
      "ace/ext/menu_tools/overlay_page",
      "ace/ext/menu_tools/get_editor_keyboard_shortcuts",
    ],
    function (e, n, o) {
      "use strict";
      var t = e("../editor").Editor;
      o.exports.init = function (n) {
        (t.prototype.showKeyboardShortcuts = function () {
          !(function (n) {
            if (!document.getElementById("kbshortcutmenu")) {
              var o = e("./menu_tools/overlay_page").overlayPage,
                t = (0,
                e("./menu_tools/get_editor_keyboard_shortcuts")
                  .getEditorKeybordShortcuts)(n),
                r = document.createElement("div"),
                a = t.reduce(function (e, n) {
                  return (
                    e +
                    '<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">' +
                    n.command +
                    '</span> : <span class="ace_optionsMenuKey">' +
                    n.key +
                    "</span></div>"
                  );
                }, "");
              (r.id = "kbshortcutmenu"),
                (r.innerHTML = "<h1>Keyboard Shortcuts</h1>" + a + "</div>"),
                o(n, r);
            }
          })(this);
        }),
          n.commands.addCommands([
            {
              name: "showKeyboardShortcuts",
              bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
              exec: function (e, n) {
                e.showKeyboardShortcuts();
              },
            },
          ]);
      };
    }
  ),
  ace.require(["ace/ext/keybinding_menu"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
