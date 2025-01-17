ace.define(
  "ace/ext/code_lens",
  [
    "require",
    "exports",
    "module",
    "ace/line_widgets",
    "ace/lib/event",
    "ace/lib/lang",
    "ace/lib/dom",
    "ace/editor",
    "ace/config",
  ],
  function (e, n, o) {
    "use strict";
    var t = e("../line_widgets").LineWidgets,
      r = e("../lib/event"),
      i = e("../lib/lang"),
      s = e("../lib/dom");
    function a(e, n) {
      if (
        e & n.CHANGE_LINES ||
        e & n.CHANGE_FULL ||
        e & n.CHANGE_SCROLL ||
        e & n.CHANGE_TEXT
      ) {
        var o = n.session,
          t = n.session.lineWidgets,
          r = n.$textLayer,
          i = r.$lenses;
        if (t) {
          var a = n.$textLayer.$lines.cells,
            c = n.layerConfig,
            d = n.$padding;
          i || (i = r.$lenses = []);
          for (var l = 0, u = 0; u < a.length; u++) {
            var f = a[u].row,
              g = t[f],
              p = g && g.lenses;
            if (p && p.length) {
              var L = i[l];
              L ||
                (L = i[l] =
                  s.buildDom(["div", { class: "ace_codeLens" }], n.container)),
                (L.style.height = c.lineHeight + "px"),
                l++;
              for (var v = 0; v < p.length; v++) {
                var h = L.childNodes[2 * v];
                h ||
                  (0 != v && L.appendChild(s.createTextNode("\xa0|\xa0")),
                  (h = s.buildDom(["a"], L))),
                  (h.textContent = p[v].title),
                  (h.lensCommand = p[v]);
              }
              for (; L.childNodes.length > 2 * v - 1; ) L.lastChild.remove();
              var m =
                n.$cursorLayer.getPixelPosition({ row: f, column: 0 }, !0).top -
                c.lineHeight * g.rowsAbove -
                c.offset;
              L.style.top = m + "px";
              var C = n.gutterWidth,
                $ = o.getLine(f).search(/\S|$/);
              -1 == $ && ($ = 0),
                (C += $ * c.characterWidth),
                (L.style.paddingLeft = d + C + "px");
            }
          }
          for (; l < i.length; ) i.pop().remove();
        } else
          i &&
            (function (e) {
              var n = e.$textLayer,
                o = n.$lenses;
              o &&
                o.forEach(function (e) {
                  e.remove();
                }),
                (n.$lenses = null);
            })(n);
      }
    }
    function c(e) {
      (e.codeLensProviders = []),
        e.renderer.on("afterRender", a),
        e.$codeLensClickHandler ||
          ((e.$codeLensClickHandler = function (n) {
            var o = n.target.lensCommand;
            o &&
              (e.execCommand(o.id, o.arguments), e._emit("codeLensClick", n));
          }),
          r.addListener(e.container, "click", e.$codeLensClickHandler, e)),
        (e.$updateLenses = function () {
          var o = e.session;
          if (o) {
            o.widgetManager ||
              ((o.widgetManager = new t(o)), o.widgetManager.attach(e));
            var r = e.codeLensProviders.length,
              i = [];
            e.codeLensProviders.forEach(function (t) {
              t.provideCodeLenses(o, function (t, s) {
                t ||
                  (s.forEach(function (e) {
                    i.push(e);
                  }),
                  0 == --r &&
                    (function () {
                      var t = o.selection.cursor,
                        r = o.documentToScreenRow(t),
                        s = o.getScrollTop(),
                        a = n.setLenses(o, i),
                        c = o.$undoManager && o.$undoManager.$lastDelta;
                      if (c && "remove" == c.action && c.lines.length > 1)
                        return;
                      var d = o.documentToScreenRow(t),
                        l = e.renderer.layerConfig.lineHeight,
                        u = o.getScrollTop() + (d - r) * l;
                      0 == a && s < l / 4 && s > -l / 4 && (u = -l);
                      o.setScrollTop(u);
                    })());
              });
            });
          }
        });
      var o = i.delayedCall(e.$updateLenses);
      (e.$updateLensesOnInput = function () {
        o.delay(250);
      }),
        e.on("input", e.$updateLensesOnInput);
    }
    (n.setLenses = function (e, n) {
      var o = Number.MAX_VALUE;
      return (
        (function (e) {
          if (e.lineWidgets) {
            var n = e.widgetManager;
            e.lineWidgets.forEach(function (e) {
              e && e.lenses && n.removeLineWidget(e);
            });
          }
        })(e),
        n &&
          n.forEach(function (n) {
            var t = n.start.row,
              r = n.start.column,
              i = e.lineWidgets && e.lineWidgets[t];
            (i && i.lenses) ||
              (i = e.widgetManager.$registerLineWidget({
                rowCount: 1,
                rowsAbove: 1,
                row: t,
                column: r,
                lenses: [],
              })),
              i.lenses.push(n.command),
              t < o && (o = t);
          }),
        e._emit("changeFold", { data: { start: { row: o } } }),
        o
      );
    }),
      (n.registerCodeLensProvider = function (e, n) {
        e.setOption("enableCodeLens", !0),
          e.codeLensProviders.push(n),
          e.$updateLensesOnInput();
      }),
      (n.clear = function (e) {
        n.setLenses(e, null);
      });
    var d = e("../editor").Editor;
    e("../config").defineOptions(d.prototype, "editor", {
      enableCodeLens: {
        set: function (e) {
          var n;
          e
            ? c(this)
            : ((n = this).off("input", n.$updateLensesOnInput),
              n.renderer.off("afterRender", a),
              n.$codeLensClickHandler &&
                n.container.removeEventListener(
                  "click",
                  n.$codeLensClickHandler
                ));
        },
      },
    }),
      s.importCssString(
        "\n.ace_codeLens {\n    position: absolute;\n    color: #aaa;\n    font-size: 88%;\n    background: inherit;\n    width: 100%;\n    display: flex;\n    align-items: flex-end;\n    pointer-events: none;\n}\n.ace_codeLens > a {\n    cursor: pointer;\n    pointer-events: auto;\n}\n.ace_codeLens > a:hover {\n    color: #0000ff;\n    text-decoration: underline;\n}\n.ace_dark > .ace_codeLens > a:hover {\n    color: #4e94ce;\n}\n",
        "codelense.css",
        !1
      );
  }
),
  ace.require(["ace/ext/code_lens"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
