ace.define(
  "ace/ext/themelist",
  ["require", "exports", "module"],
  function (r, e, o) {
    "use strict";
    (e.themesByName = {}),
      (e.themes = [
        ["Chrome"],
        ["Clouds"],
        ["Crimson Editor"],
        ["Dawn"],
        ["Dreamweaver"],
        ["Eclipse"],
        ["GitHub"],
        ["IPlastic"],
        ["Solarized Light"],
        ["TextMate"],
        ["Tomorrow"],
        ["XCode"],
        ["Kuroir"],
        ["KatzenMilch"],
        ["SQL Server", "sqlserver", "light"],
        ["Ambiance", "ambiance", "dark"],
        ["Chaos", "chaos", "dark"],
        ["Clouds Midnight", "clouds_midnight", "dark"],
        ["Dracula", "", "dark"],
        ["Cobalt", "cobalt", "dark"],
        ["Gruvbox", "gruvbox", "dark"],
        ["Green on Black", "gob", "dark"],
        ["idle Fingers", "idle_fingers", "dark"],
        ["krTheme", "kr_theme", "dark"],
        ["Merbivore", "merbivore", "dark"],
        ["Merbivore Soft", "merbivore_soft", "dark"],
        ["Mono Industrial", "mono_industrial", "dark"],
        ["Monokai", "monokai", "dark"],
        ["Nord Dark", "nord_dark", "dark"],
        ["One Dark", "one_dark", "dark"],
        ["Pastel on dark", "pastel_on_dark", "dark"],
        ["Solarized Dark", "solarized_dark", "dark"],
        ["Terminal", "terminal", "dark"],
        ["Tomorrow Night", "tomorrow_night", "dark"],
        ["Tomorrow Night Blue", "tomorrow_night_blue", "dark"],
        ["Tomorrow Night Bright", "tomorrow_night_bright", "dark"],
        ["Tomorrow Night 80s", "tomorrow_night_eighties", "dark"],
        ["Twilight", "twilight", "dark"],
        ["Vibrant Ink", "vibrant_ink", "dark"],
        ["GitHub Dark", "github_dark", "dark"],
      ].map(function (r) {
        var o = r[1] || r[0].replace(/ /g, "_").toLowerCase(),
          a = {
            caption: r[0],
            theme: "ace/theme/" + o,
            isDark: "dark" == r[2],
            name: o,
          };
        return (e.themesByName[o] = a), a;
      }));
  }
),
  ace.require(["ace/ext/themelist"], function (r) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = r);
  });
