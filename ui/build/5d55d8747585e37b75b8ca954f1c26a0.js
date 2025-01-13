ace.define(
  "ace/theme/cloud9_night-css",
  ["require", "exports", "module"],
  function (n, c, e) {
    e.exports =
      ".ace-cloud9-night .ace_gutter {\n    background: #303130;\n    color: #eee\n}\n\n.ace-cloud9-night .ace_print-margin {\n    width: 1px;\n    background: #222\n}\n\n.ace-cloud9-night {\n    background-color: #181818;\n    color: #EBEBEB\n}\n\n.ace-cloud9-night .ace_cursor {\n    color: #9F9F9F\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_selection {\n    background: #424242\n}\n\n.ace-cloud9-night.ace_multiselect .ace_selection.ace_start {\n    box-shadow: 0 0 3px 0px #000000;\n    border-radius: 2px\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_step {\n    background: rgb(102, 82, 0)\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_bracket {\n    margin: -1px 0 0 -1px;\n    border: 1px solid #888888\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_highlight {\n    border: 1px solid rgb(110, 119, 0);\n    border-bottom: 0;\n    box-shadow: inset 0 -1px rgb(110, 119, 0);\n    margin: -1px 0 0 -1px;\n    background: rgba(255, 235, 0, 0.1);\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_active-line {\n    background: #292929\n}\n\n.ace-cloud9-night .ace_gutter-active-line {\n    background-color: #3D3D3D\n}\n\n.ace-cloud9-night .ace_stack {\n    background-color: rgb(66, 90, 44)\n}\n\n.ace-cloud9-night .ace_marker-layer .ace_selected-word {\n    border: 1px solid #888888\n}\n\n.ace-cloud9-night .ace_invisible {\n    color: #343434\n}\n\n.ace-cloud9-night .ace_keyword,\n.ace-cloud9-night .ace_meta,\n.ace-cloud9-night .ace_storage,\n.ace-cloud9-night .ace_storage.ace_type,\n.ace-cloud9-night .ace_support.ace_type {\n    color: #C397D8\n}\n\n.ace-cloud9-night .ace_keyword.ace_operator {\n    color: #70C0B1\n}\n\n.ace-cloud9-night .ace_constant.ace_character,\n.ace-cloud9-night .ace_constant.ace_language,\n.ace-cloud9-night .ace_constant.ace_numeric,\n.ace-cloud9-night .ace_keyword.ace_other.ace_unit,\n.ace-cloud9-night .ace_support.ace_constant,\n.ace-cloud9-night .ace_variable.ace_parameter {\n    color: #E78C45\n}\n\n.ace-cloud9-night .ace_constant.ace_other {\n    color: #EEEEEE\n}\n\n.ace-cloud9-night .ace_invalid {\n    color: #CED2CF;\n    background-color: #DF5F5F\n}\n\n.ace-cloud9-night .ace_invalid.ace_deprecated {\n    color: #CED2CF;\n    background-color: #B798BF\n}\n\n.ace-cloud9-night .ace_fold {\n    background-color: #7AA6DA;\n    border-color: #DEDEDE\n}\n\n.ace-cloud9-night .ace_entity.ace_name.ace_function,\n.ace-cloud9-night .ace_support.ace_function,\n.ace-cloud9-night .ace_variable:not(.ace_parameter),\n.ace-cloud9-night .ace_constant:not(.ace_numeric) {\n    color: #7AA6DA\n}\n\n.ace-cloud9-night .ace_support.ace_class,\n.ace-cloud9-night .ace_support.ace_type {\n    color: #E7C547\n}\n\n.ace-cloud9-night .ace_heading,\n.ace-cloud9-night .ace_markup.ace_heading,\n.ace-cloud9-night .ace_string {\n    color: #B9CA4A\n}\n\n.ace-cloud9-night .ace_entity.ace_name.ace_tag,\n.ace-cloud9-night .ace_entity.ace_other.ace_attribute-name,\n.ace-cloud9-night .ace_meta.ace_tag,\n.ace-cloud9-night .ace_string.ace_regexp,\n.ace-cloud9-night .ace_variable {\n    color: #D54E53\n}\n\n.ace-cloud9-night .ace_comment {\n    color: #969896\n}\n\n.ace-cloud9-night .ace_c9searchresults.ace_keyword {\n    color: #C2C280;\n}\n\n.ace-cloud9-night .ace_indent-guide {\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYFBXV/8PAAJoAXX4kT2EAAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-cloud9-night .ace_indent-guide-active {\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;\n}\n";
  }
),
  ace.define(
    "ace/theme/cloud9_night",
    [
      "require",
      "exports",
      "module",
      "ace/theme/cloud9_night-css",
      "ace/lib/dom",
    ],
    function (n, c, e) {
      (c.isDark = !0),
        (c.cssClass = "ace-cloud9-night"),
        (c.cssText = n("./cloud9_night-css")),
        n("../lib/dom").importCssString(c.cssText, c.cssClass);
    }
  ),
  ace.require(["ace/theme/cloud9_night"], function (n) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = n);
  });
