ace.define(
  "ace/ext/command_bar",
  [
    "require",
    "exports",
    "module",
    "ace/tooltip",
    "ace/lib/event_emitter",
    "ace/lib/lang",
    "ace/lib/dom",
    "ace/lib/oop",
    "ace/lib/useragent",
  ],
  function (t, e, o) {
    var i =
        (this && this.__values) ||
        function (t) {
          var e = "function" === typeof Symbol && Symbol.iterator,
            o = e && t[e],
            i = 0;
          if (o) return o.call(t);
          if (t && "number" === typeof t.length)
            return {
              next: function () {
                return (
                  t && i >= t.length && (t = void 0),
                  { value: t && t[i++], done: !t }
                );
              },
            };
          throw new TypeError(
            e ? "Object is not iterable." : "Symbol.iterator is not defined."
          );
        },
      n = t("../tooltip").Tooltip,
      s = t("../lib/event_emitter").EventEmitter,
      r = t("../lib/lang"),
      a = t("../lib/dom"),
      h = t("../lib/oop"),
      l = t("../lib/useragent"),
      d = "command_bar_tooltip_button",
      c = "command_bar_button_value",
      p = "command_bar_button_caption",
      m = "command_bar_keybinding",
      u = "command_bar_tooltip",
      f = "MoreOptionsButton",
      g = function (t, e) {
        return e.row > t.row || (e.row === t.row && e.column > t.column)
          ? t
          : e;
      },
      v = {
        Ctrl: { mac: "^" },
        Option: { mac: "\u2325" },
        Command: { mac: "\u2318" },
        Cmd: { mac: "\u2318" },
        Shift: "\u21e7",
        Left: "\u2190",
        Right: "\u2192",
        Up: "\u2191",
        Down: "\u2193",
      },
      b = (function () {
        function t(t, e) {
          var o, s;
          (e = e || {}),
            (this.parentNode = t),
            (this.tooltip = new n(this.parentNode)),
            (this.moreOptions = new n(this.parentNode)),
            (this.maxElementsOnTooltip = e.maxElementsOnTooltip || 4),
            (this.$alwaysShow = e.alwaysShow || !1),
            (this.eventListeners = {}),
            (this.elements = {}),
            (this.commands = {}),
            (this.tooltipEl = a.buildDom(
              ["div", { class: u }],
              this.tooltip.getElement()
            )),
            (this.moreOptionsEl = a.buildDom(
              ["div", { class: u + " tooltip_more_options" }],
              this.moreOptions.getElement()
            )),
            (this.$showTooltipTimer = r.delayedCall(
              this.$showTooltip.bind(this),
              e.showDelay || 100
            )),
            (this.$hideTooltipTimer = r.delayedCall(
              this.$hideTooltip.bind(this),
              e.hideDelay || 100
            )),
            (this.$tooltipEnter = this.$tooltipEnter.bind(this)),
            (this.$onMouseMove = this.$onMouseMove.bind(this)),
            (this.$onChangeScroll = this.$onChangeScroll.bind(this)),
            (this.$onEditorChangeSession =
              this.$onEditorChangeSession.bind(this)),
            (this.$scheduleTooltipForHide =
              this.$scheduleTooltipForHide.bind(this)),
            (this.$preventMouseEvent = this.$preventMouseEvent.bind(this));
          try {
            for (
              var h = i(["mousedown", "mouseup", "click"]), l = h.next();
              !l.done;
              l = h.next()
            ) {
              var d = l.value;
              this.tooltip
                .getElement()
                .addEventListener(d, this.$preventMouseEvent),
                this.moreOptions
                  .getElement()
                  .addEventListener(d, this.$preventMouseEvent);
            }
          } catch (c) {
            o = { error: c };
          } finally {
            try {
              l && !l.done && (s = h.return) && s.call(h);
            } finally {
              if (o) throw o.error;
            }
          }
        }
        return (
          (t.prototype.registerCommand = function (t, e) {
            var o =
              Object.keys(this.commands).length < this.maxElementsOnTooltip;
            o ||
              this.elements[f] ||
              this.$createCommand(
                f,
                {
                  name: "\xb7\xb7\xb7",
                  exec: function () {
                    (this.$shouldHideMoreOptions = !1),
                      this.$setMoreOptionsVisibility(
                        !this.isMoreOptionsShown()
                      );
                  }.bind(this),
                  type: "checkbox",
                  getValue: function () {
                    return this.isMoreOptionsShown();
                  }.bind(this),
                  enabled: !0,
                },
                !0
              ),
              this.$createCommand(t, e, o),
              this.isShown() && this.updatePosition();
          }),
          (t.prototype.isShown = function () {
            return !!this.tooltip && this.tooltip.isOpen;
          }),
          (t.prototype.isMoreOptionsShown = function () {
            return !!this.moreOptions && this.moreOptions.isOpen;
          }),
          (t.prototype.getAlwaysShow = function () {
            return this.$alwaysShow;
          }),
          (t.prototype.setAlwaysShow = function (t) {
            (this.$alwaysShow = t),
              this.$updateOnHoverHandlers(!this.$alwaysShow),
              this._signal("alwaysShow", this.$alwaysShow);
          }),
          (t.prototype.attach = function (t) {
            !t ||
              (this.isShown() && this.editor === t) ||
              (this.detach(),
              (this.editor = t),
              this.editor.on("changeSession", this.$onEditorChangeSession),
              this.editor.session &&
                (this.editor.session.on(
                  "changeScrollLeft",
                  this.$onChangeScroll
                ),
                this.editor.session.on(
                  "changeScrollTop",
                  this.$onChangeScroll
                )),
              this.getAlwaysShow()
                ? this.$showTooltip()
                : this.$updateOnHoverHandlers(!0));
          }),
          (t.prototype.updatePosition = function () {
            if (this.editor) {
              var t,
                e = this.editor.renderer;
              if (
                (t = this.editor.selection.getAllRanges
                  ? this.editor.selection.getAllRanges()
                  : [this.editor.getSelectionRange()]).length
              ) {
                for (var o, i = g(t[0].start, t[0].end), n = 0; (o = t[n]); n++)
                  i = g(i, g(o.start, o.end));
                var s = e.$cursorLayer.getPixelPosition(i, !0),
                  r = this.tooltip.getElement(),
                  a = window.innerWidth,
                  h = window.innerHeight,
                  l = this.editor.container.getBoundingClientRect();
                (s.top += l.top - e.layerConfig.offset),
                  (s.left += l.left + e.gutterWidth - e.scrollLeft);
                var d =
                  s.top >= l.top &&
                  s.top <= l.bottom &&
                  s.left >= l.left + e.gutterWidth &&
                  s.left <= l.right;
                if (d || !this.isShown())
                  if (d && !this.isShown() && this.getAlwaysShow())
                    this.$showTooltip();
                  else {
                    var c = s.top - r.offsetHeight,
                      p = Math.min(a - r.offsetWidth, s.left);
                    if (
                      c >= 0 &&
                      c + r.offsetHeight <= h &&
                      p >= 0 &&
                      p + r.offsetWidth <= a
                    ) {
                      if (
                        (this.tooltip.setPosition(p, c),
                        this.isMoreOptionsShown())
                      ) {
                        (c += r.offsetHeight),
                          (p = this.elements[f].getBoundingClientRect().left);
                        var m = this.moreOptions.getElement();
                        h = window.innerHeight;
                        c + m.offsetHeight > h &&
                          (c -= r.offsetHeight + m.offsetHeight),
                          p + m.offsetWidth > a && (p = a - m.offsetWidth),
                          this.moreOptions.setPosition(p, c);
                      }
                    } else this.$hideTooltip();
                  }
                else this.$hideTooltip();
              }
            }
          }),
          (t.prototype.update = function () {
            Object.keys(this.elements).forEach(this.$updateElement.bind(this));
          }),
          (t.prototype.detach = function () {
            this.tooltip.hide(),
              this.moreOptions.hide(),
              this.$updateOnHoverHandlers(!1),
              this.editor &&
                (this.editor.off("changeSession", this.$onEditorChangeSession),
                this.editor.session &&
                  (this.editor.session.off(
                    "changeScrollLeft",
                    this.$onChangeScroll
                  ),
                  this.editor.session.off(
                    "changeScrollTop",
                    this.$onChangeScroll
                  ))),
              (this.$mouseInTooltip = !1),
              (this.editor = null);
          }),
          (t.prototype.destroy = function () {
            this.tooltip &&
              this.moreOptions &&
              (this.detach(),
              this.tooltip.destroy(),
              this.moreOptions.destroy()),
              (this.eventListeners = {}),
              (this.commands = {}),
              (this.elements = {}),
              (this.tooltip = this.moreOptions = this.parentNode = null);
          }),
          (t.prototype.$createCommand = function (t, e, o) {
            var i,
              n = o ? this.tooltipEl : this.moreOptionsEl,
              s = [],
              r = e.bindKey;
            r &&
              ("object" === typeof r && (r = l.isMac ? r.mac : r.win),
              (s = (s = (r = r.split("|")[0]).split("-")).map(function (t) {
                if (v[t]) {
                  if ("string" === typeof v[t]) return v[t];
                  if (l.isMac && v[t].mac) return v[t].mac;
                }
                return t;
              }))),
              o && e.iconCssClass
                ? (i = [
                    "div",
                    {
                      class: ["ace_icon_svg", e.iconCssClass].join(" "),
                      "aria-label": e.name + " (" + e.bindKey + ")",
                    },
                  ])
                : ((i = [
                    ["div", { class: c }],
                    ["div", { class: p }, e.name],
                  ]),
                  s.length &&
                    i.push([
                      "div",
                      { class: m },
                      s.map(function (t) {
                        return ["div", t];
                      }),
                    ])),
              a.buildDom(
                ["div", { class: [d, e.cssClass || ""].join(" "), ref: t }, i],
                n,
                this.elements
              ),
              (this.commands[t] = e);
            var h = function (o) {
              this.editor && this.editor.focus(),
                (this.$shouldHideMoreOptions = this.isMoreOptionsShown()),
                !this.elements[t].disabled && e.exec && e.exec(this.editor),
                this.$shouldHideMoreOptions &&
                  this.$setMoreOptionsVisibility(!1),
                this.update(),
                o.preventDefault();
            }.bind(this);
            (this.eventListeners[t] = h),
              this.elements[t].addEventListener("click", h.bind(this)),
              this.$updateElement(t);
          }),
          (t.prototype.$setMoreOptionsVisibility = function (t) {
            t
              ? (this.moreOptions.setTheme(this.editor.renderer.theme),
                this.moreOptions.setClassName(u + "_wrapper"),
                this.moreOptions.show(),
                this.update(),
                this.updatePosition())
              : this.moreOptions.hide();
          }),
          (t.prototype.$onEditorChangeSession = function (t) {
            t.oldSession &&
              (t.oldSession.off("changeScrollTop", this.$onChangeScroll),
              t.oldSession.off("changeScrollLeft", this.$onChangeScroll)),
              this.detach();
          }),
          (t.prototype.$onChangeScroll = function () {
            this.editor.renderer &&
              (this.isShown() || this.getAlwaysShow()) &&
              this.editor.renderer.once(
                "afterRender",
                this.updatePosition.bind(this)
              );
          }),
          (t.prototype.$onMouseMove = function (t) {
            if (!this.$mouseInTooltip) {
              var e = this.editor.getCursorPosition(),
                o = this.editor.renderer.textToScreenCoordinates(
                  e.row,
                  e.column
                ),
                i = this.editor.renderer.lineHeight;
              t.clientY >= o.pageY && t.clientY < o.pageY + i
                ? (this.isShown() ||
                    this.$showTooltipTimer.isPending() ||
                    this.$showTooltipTimer.delay(),
                  this.$hideTooltipTimer.isPending() &&
                    this.$hideTooltipTimer.cancel())
                : (this.isShown() &&
                    !this.$hideTooltipTimer.isPending() &&
                    this.$hideTooltipTimer.delay(),
                  this.$showTooltipTimer.isPending() &&
                    this.$showTooltipTimer.cancel());
            }
          }),
          (t.prototype.$preventMouseEvent = function (t) {
            this.editor && this.editor.focus(), t.preventDefault();
          }),
          (t.prototype.$scheduleTooltipForHide = function () {
            (this.$mouseInTooltip = !1),
              this.$showTooltipTimer.cancel(),
              this.$hideTooltipTimer.delay();
          }),
          (t.prototype.$tooltipEnter = function () {
            (this.$mouseInTooltip = !0),
              this.$showTooltipTimer.isPending() &&
                this.$showTooltipTimer.cancel(),
              this.$hideTooltipTimer.isPending() &&
                this.$hideTooltipTimer.cancel();
          }),
          (t.prototype.$updateOnHoverHandlers = function (t) {
            var e = this.tooltip.getElement(),
              o = this.moreOptions.getElement();
            t
              ? (this.editor &&
                  (this.editor.on("mousemove", this.$onMouseMove),
                  this.editor.renderer
                    .getMouseEventTarget()
                    .addEventListener(
                      "mouseout",
                      this.$scheduleTooltipForHide,
                      !0
                    )),
                e.addEventListener("mouseenter", this.$tooltipEnter),
                e.addEventListener("mouseleave", this.$scheduleTooltipForHide),
                o.addEventListener("mouseenter", this.$tooltipEnter),
                o.addEventListener("mouseleave", this.$scheduleTooltipForHide))
              : (this.editor &&
                  (this.editor.off("mousemove", this.$onMouseMove),
                  this.editor.renderer
                    .getMouseEventTarget()
                    .removeEventListener(
                      "mouseout",
                      this.$scheduleTooltipForHide,
                      !0
                    )),
                e.removeEventListener("mouseenter", this.$tooltipEnter),
                e.removeEventListener(
                  "mouseleave",
                  this.$scheduleTooltipForHide
                ),
                o.removeEventListener("mouseenter", this.$tooltipEnter),
                o.removeEventListener(
                  "mouseleave",
                  this.$scheduleTooltipForHide
                ));
          }),
          (t.prototype.$showTooltip = function () {
            this.isShown() ||
              (this.tooltip.setTheme(this.editor.renderer.theme),
              this.tooltip.setClassName(u + "_wrapper"),
              this.tooltip.show(),
              this.update(),
              this.updatePosition(),
              this._signal("show"));
          }),
          (t.prototype.$hideTooltip = function () {
            (this.$mouseInTooltip = !1),
              this.isShown() &&
                (this.moreOptions.hide(),
                this.tooltip.hide(),
                this._signal("hide"));
          }),
          (t.prototype.$updateElement = function (t) {
            var e = this.commands[t];
            if (e) {
              var o = this.elements[t],
                i = e.enabled;
              if (
                ("function" === typeof i && (i = i(this.editor)),
                "function" === typeof e.getValue)
              ) {
                var n = e.getValue(this.editor);
                if ("text" === e.type) o.textContent = n;
                else if ("checkbox" === e.type) {
                  var s = n ? a.addCssClass : a.removeCssClass,
                    r = o.parentElement === this.tooltipEl;
                  (o.ariaChecked = n),
                    r
                      ? s(o, "ace_selected")
                      : s((o = o.querySelector("." + c)), "ace_checkmark");
                }
              }
              i && o.disabled
                ? (a.removeCssClass(o, "ace_disabled"),
                  (o.ariaDisabled = o.disabled = !1),
                  o.removeAttribute("disabled"))
                : i ||
                  o.disabled ||
                  (a.addCssClass(o, "ace_disabled"),
                  (o.ariaDisabled = o.disabled = !0),
                  o.setAttribute("disabled", ""));
            }
          }),
          t
        );
      })();
    h.implement(b.prototype, s),
      a.importCssString(
        "\n.ace_tooltip."
          .concat(u, "_wrapper {\n    padding: 0;\n}\n\n.ace_tooltip .")
          .concat(
            u,
            " {\n    padding: 1px 5px;\n    display: flex;\n    pointer-events: auto;\n}\n\n.ace_tooltip ."
          )
          .concat(
            u,
            ".tooltip_more_options {\n    padding: 1px;\n    flex-direction: column;\n}\n\ndiv."
          )
          .concat(
            d,
            " {\n    display: inline-flex;\n    cursor: pointer;\n    margin: 1px;\n    border-radius: 2px;\n    padding: 2px 5px;\n    align-items: center;\n}\n\ndiv."
          )
          .concat(d, ".ace_selected,\ndiv.")
          .concat(
            d,
            ":hover:not(.ace_disabled) {\n    background-color: rgba(0, 0, 0, 0.1);\n}\n\ndiv."
          )
          .concat(
            d,
            ".ace_disabled {\n    color: #777;\n    pointer-events: none;\n}\n\ndiv."
          )
          .concat(
            d,
            " .ace_icon_svg {\n    height: 12px;\n    background-color: #000;\n}\n\ndiv."
          )
          .concat(
            d,
            ".ace_disabled .ace_icon_svg {\n    background-color: #777;\n}\n\n."
          )
          .concat(u, ".tooltip_more_options .")
          .concat(d, " {\n    display: flex;\n}\n\n.")
          .concat(u, ".")
          .concat(c, " {\n    display: none;\n}\n\n.")
          .concat(u, ".tooltip_more_options .")
          .concat(c, " {\n    display: inline-block;\n    width: 12px;\n}\n\n.")
          .concat(p, " {\n    display: inline-block;\n}\n\n.")
          .concat(
            m,
            " {\n    margin: 0 2px;\n    display: inline-block;\n    font-size: 8px;\n}\n\n."
          )
          .concat(u, ".tooltip_more_options .")
          .concat(m, " {\n    margin-left: auto;\n}\n\n.")
          .concat(
            m,
            " div {\n    display: inline-block;\n    min-width: 8px;\n    padding: 2px;\n    margin: 0 1px;\n    border-radius: 2px;\n    background-color: #ccc;\n    text-align: center;\n}\n\n.ace_dark.ace_tooltip ."
          )
          .concat(
            u,
            " {\n    background-color: #373737;\n    color: #eee;\n}\n\n.ace_dark div."
          )
          .concat(
            d,
            ".ace_disabled {\n    color: #979797;\n}\n\n.ace_dark div."
          )
          .concat(d, ".ace_selected,\n.ace_dark div.")
          .concat(
            d,
            ":hover:not(.ace_disabled) {\n    background-color: rgba(255, 255, 255, 0.1);\n}\n\n.ace_dark div."
          )
          .concat(
            d,
            " .ace_icon_svg {\n    background-color: #eee;\n}\n\n.ace_dark div."
          )
          .concat(
            d,
            ".ace_disabled .ace_icon_svg {\n    background-color: #979797;\n}\n\n.ace_dark ."
          )
          .concat(d, ".ace_disabled {\n    color: #979797;\n}\n\n.ace_dark .")
          .concat(
            m,
            " div {\n    background-color: #575757;\n}\n\n.ace_checkmark::before {\n    content: '\u2713';\n}\n"
          ),
        "commandbar.css",
        !1
      ),
      (e.CommandBarTooltip = b),
      (e.TOOLTIP_CLASS_NAME = u),
      (e.BUTTON_CLASS_NAME = d);
  }
),
  ace.require(["ace/ext/command_bar"], function (t) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = t);
  });
