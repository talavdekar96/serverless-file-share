!(function (t) {
  if (
    ("undefined" == typeof t.window || !t.document) &&
    (!t.require || !t.define)
  ) {
    t.console ||
      ((t.console = function () {
        var t = Array.prototype.slice.call(arguments, 0);
        postMessage({ type: "log", data: t });
      }),
      (t.console.error =
        t.console.warn =
        t.console.log =
        t.console.trace =
          t.console)),
      (t.window = t),
      (t.ace = t),
      (t.onerror = function (t, e, n, r, s) {
        postMessage({
          type: "error",
          data: {
            message: t,
            data: s && s.data,
            file: e,
            line: n,
            col: r,
            stack: s && s.stack,
          },
        });
      }),
      (t.normalizeModule = function (e, n) {
        if (-1 !== n.indexOf("!")) {
          var r = n.split("!");
          return t.normalizeModule(e, r[0]) + "!" + t.normalizeModule(e, r[1]);
        }
        if ("." == n.charAt(0)) {
          var s = e.split("/").slice(0, -1).join("/");
          for (n = (s ? s + "/" : "") + n; -1 !== n.indexOf(".") && o != n; ) {
            var o = n;
            n = n
              .replace(/^\.\//, "")
              .replace(/\/\.\//, "/")
              .replace(/[^\/]+\/\.\.\//, "");
          }
        }
        return n;
      }),
      (t.require = function (e, n) {
        if ((n || ((n = e), (e = null)), !n.charAt))
          throw new Error(
            "worker.js require() accepts only (parentId, id) as arguments"
          );
        n = t.normalizeModule(e, n);
        var r = t.require.modules[n];
        if (r)
          return (
            r.initialized ||
              ((r.initialized = !0), (r.exports = r.factory().exports)),
            r.exports
          );
        if (!t.require.tlns) return console.log("unable to load " + n);
        var s = (function (t, e) {
          var n = t,
            r = "";
          for (; n; ) {
            var s = e[n];
            if ("string" == typeof s) return s + r;
            if (s)
              return s.location.replace(/\/*$/, "/") + (r || s.main || s.name);
            if (!1 === s) return "";
            var o = n.lastIndexOf("/");
            if (-1 === o) break;
            (r = n.substr(o) + r), (n = n.slice(0, o));
          }
          return t;
        })(n, t.require.tlns);
        return (
          ".js" != s.slice(-3) && (s += ".js"),
          (t.require.id = n),
          (t.require.modules[n] = {}),
          importScripts(s),
          t.require(e, n)
        );
      }),
      (t.require.modules = {}),
      (t.require.tlns = {}),
      (t.define = function (e, n, r) {
        if (
          (2 == arguments.length
            ? ((r = n), "string" != typeof e && ((n = e), (e = t.require.id)))
            : 1 == arguments.length && ((r = e), (n = []), (e = t.require.id)),
          "function" == typeof r)
        ) {
          n.length || (n = ["require", "exports", "module"]);
          var s = function (n) {
            return t.require(e, n);
          };
          t.require.modules[e] = {
            exports: {},
            factory: function () {
              var t = this,
                e = r.apply(
                  this,
                  n.slice(0, r.length).map(function (e) {
                    switch (e) {
                      case "require":
                        return s;
                      case "exports":
                        return t.exports;
                      case "module":
                        return t;
                      default:
                        return s(e);
                    }
                  })
                );
              return e && (t.exports = e), t;
            },
          };
        } else t.require.modules[e] = { exports: r, initialized: !0 };
      }),
      (t.define.amd = {}),
      (t.require.tlns = {}),
      (t.initBaseUrls = function (t) {
        for (var e in t) this.require.tlns[e] = t[e];
      }),
      (t.initSender = function () {
        var e = t.require("ace/lib/event_emitter").EventEmitter,
          n = t.require("ace/lib/oop"),
          r = function () {};
        return (
          function () {
            n.implement(this, e),
              (this.callback = function (t, e) {
                postMessage({ type: "call", id: e, data: t });
              }),
              (this.emit = function (t, e) {
                postMessage({ type: "event", name: t, data: e });
              });
          }.call(r.prototype),
          new r()
        );
      });
    var e = (t.main = null),
      n = (t.sender = null);
    t.onmessage = function (r) {
      var s = r.data;
      if (s.event && n) n._signal(s.event, s.data);
      else if (s.command)
        if (e[s.command]) e[s.command].apply(e, s.args);
        else {
          if (!t[s.command]) throw new Error("Unknown command:" + s.command);
          t[s.command].apply(t, s.args);
        }
      else if (s.init) {
        t.initBaseUrls(s.tlns), (n = t.sender = t.initSender());
        var o = this.require(s.module)[s.classname];
        e = t.main = new o(n);
      }
    };
  }
})(this),
  ace.define("ace/lib/oop", [], function (t, e, n) {
    "use strict";
    (e.inherits = function (t, e) {
      (t.super_ = e),
        (t.prototype = Object.create(e.prototype, {
          constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        }));
    }),
      (e.mixin = function (t, e) {
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (e.implement = function (t, n) {
        e.mixin(t, n);
      });
  }),
  ace.define("ace/apply_delta", [], function (t, e, n) {
    "use strict";
    e.applyDelta = function (t, e, n) {
      var r = e.start.row,
        s = e.start.column,
        o = t[r] || "";
      switch (e.action) {
        case "insert":
          if (1 === e.lines.length)
            t[r] = o.substring(0, s) + e.lines[0] + o.substring(s);
          else {
            var a = [r, 1].concat(e.lines);
            t.splice.apply(t, a),
              (t[r] = o.substring(0, s) + t[r]),
              (t[r + e.lines.length - 1] += o.substring(s));
          }
          break;
        case "remove":
          var i = e.end.column,
            _ = e.end.row;
          r === _
            ? (t[r] = o.substring(0, s) + o.substring(i))
            : t.splice(r, _ - r + 1, o.substring(0, s) + t[_].substring(i));
      }
    };
  }),
  ace.define("ace/lib/event_emitter", [], function (t, e, n) {
    "use strict";
    var r = {},
      s = function () {
        this.propagationStopped = !0;
      },
      o = function () {
        this.defaultPrevented = !0;
      };
    (r._emit = r._dispatchEvent =
      function (t, e) {
        this._eventRegistry || (this._eventRegistry = {}),
          this._defaultHandlers || (this._defaultHandlers = {});
        var n = this._eventRegistry[t] || [],
          r = this._defaultHandlers[t];
        if (n.length || r) {
          ("object" == typeof e && e) || (e = {}),
            e.type || (e.type = t),
            e.stopPropagation || (e.stopPropagation = s),
            e.preventDefault || (e.preventDefault = o),
            (n = n.slice());
          for (
            var a = 0;
            a < n.length && (n[a](e, this), !e.propagationStopped);
            a++
          );
          return r && !e.defaultPrevented ? r(e, this) : void 0;
        }
      }),
      (r._signal = function (t, e) {
        var n = (this._eventRegistry || {})[t];
        if (n) {
          n = n.slice();
          for (var r = 0; r < n.length; r++) n[r](e, this);
        }
      }),
      (r.once = function (t, e) {
        var n = this;
        if (
          (this.on(t, function r() {
            n.off(t, r), e.apply(null, arguments);
          }),
          !e)
        )
          return new Promise(function (t) {
            e = t;
          });
      }),
      (r.setDefaultHandler = function (t, e) {
        var n = this._defaultHandlers;
        if ((n || (n = this._defaultHandlers = { _disabled_: {} }), n[t])) {
          var r = n[t],
            s = n._disabled_[t];
          s || (n._disabled_[t] = s = []), s.push(r);
          var o = s.indexOf(e);
          -1 != o && s.splice(o, 1);
        }
        n[t] = e;
      }),
      (r.removeDefaultHandler = function (t, e) {
        var n = this._defaultHandlers;
        if (n) {
          var r = n._disabled_[t];
          if (n[t] == e) r && this.setDefaultHandler(t, r.pop());
          else if (r) {
            var s = r.indexOf(e);
            -1 != s && r.splice(s, 1);
          }
        }
      }),
      (r.on = r.addEventListener =
        function (t, e, n) {
          this._eventRegistry = this._eventRegistry || {};
          var r = this._eventRegistry[t];
          return (
            r || (r = this._eventRegistry[t] = []),
            -1 == r.indexOf(e) && r[n ? "unshift" : "push"](e),
            e
          );
        }),
      (r.off =
        r.removeListener =
        r.removeEventListener =
          function (t, e) {
            this._eventRegistry = this._eventRegistry || {};
            var n = this._eventRegistry[t];
            if (n) {
              var r = n.indexOf(e);
              -1 !== r && n.splice(r, 1);
            }
          }),
      (r.removeAllListeners = function (t) {
        t || (this._eventRegistry = this._defaultHandlers = void 0),
          this._eventRegistry && (this._eventRegistry[t] = void 0),
          this._defaultHandlers && (this._defaultHandlers[t] = void 0);
      }),
      (e.EventEmitter = r);
  }),
  ace.define("ace/range", [], function (t, e, n) {
    "use strict";
    var r = (function () {
      function t(t, e, n, r) {
        (this.start = { row: t, column: e }),
          (this.end = { row: n, column: r });
      }
      return (
        (t.prototype.isEqual = function (t) {
          return (
            this.start.row === t.start.row &&
            this.end.row === t.end.row &&
            this.start.column === t.start.column &&
            this.end.column === t.end.column
          );
        }),
        (t.prototype.toString = function () {
          return (
            "Range: [" +
            this.start.row +
            "/" +
            this.start.column +
            "] -> [" +
            this.end.row +
            "/" +
            this.end.column +
            "]"
          );
        }),
        (t.prototype.contains = function (t, e) {
          return 0 == this.compare(t, e);
        }),
        (t.prototype.compareRange = function (t) {
          var e,
            n = t.end,
            r = t.start;
          return 1 == (e = this.compare(n.row, n.column))
            ? 1 == (e = this.compare(r.row, r.column))
              ? 2
              : 0 == e
              ? 1
              : 0
            : -1 == e
            ? -2
            : -1 == (e = this.compare(r.row, r.column))
            ? -1
            : 1 == e
            ? 42
            : 0;
        }),
        (t.prototype.comparePoint = function (t) {
          return this.compare(t.row, t.column);
        }),
        (t.prototype.containsRange = function (t) {
          return (
            0 == this.comparePoint(t.start) && 0 == this.comparePoint(t.end)
          );
        }),
        (t.prototype.intersects = function (t) {
          var e = this.compareRange(t);
          return -1 == e || 0 == e || 1 == e;
        }),
        (t.prototype.isEnd = function (t, e) {
          return this.end.row == t && this.end.column == e;
        }),
        (t.prototype.isStart = function (t, e) {
          return this.start.row == t && this.start.column == e;
        }),
        (t.prototype.setStart = function (t, e) {
          "object" == typeof t
            ? ((this.start.column = t.column), (this.start.row = t.row))
            : ((this.start.row = t), (this.start.column = e));
        }),
        (t.prototype.setEnd = function (t, e) {
          "object" == typeof t
            ? ((this.end.column = t.column), (this.end.row = t.row))
            : ((this.end.row = t), (this.end.column = e));
        }),
        (t.prototype.inside = function (t, e) {
          return (
            0 == this.compare(t, e) && !this.isEnd(t, e) && !this.isStart(t, e)
          );
        }),
        (t.prototype.insideStart = function (t, e) {
          return 0 == this.compare(t, e) && !this.isEnd(t, e);
        }),
        (t.prototype.insideEnd = function (t, e) {
          return 0 == this.compare(t, e) && !this.isStart(t, e);
        }),
        (t.prototype.compare = function (t, e) {
          return this.isMultiLine() || t !== this.start.row
            ? t < this.start.row
              ? -1
              : t > this.end.row
              ? 1
              : this.start.row === t
              ? e >= this.start.column
                ? 0
                : -1
              : this.end.row === t
              ? e <= this.end.column
                ? 0
                : 1
              : 0
            : e < this.start.column
            ? -1
            : e > this.end.column
            ? 1
            : 0;
        }),
        (t.prototype.compareStart = function (t, e) {
          return this.start.row == t && this.start.column == e
            ? -1
            : this.compare(t, e);
        }),
        (t.prototype.compareEnd = function (t, e) {
          return this.end.row == t && this.end.column == e
            ? 1
            : this.compare(t, e);
        }),
        (t.prototype.compareInside = function (t, e) {
          return this.end.row == t && this.end.column == e
            ? 1
            : this.start.row == t && this.start.column == e
            ? -1
            : this.compare(t, e);
        }),
        (t.prototype.clipRows = function (e, n) {
          if (this.end.row > n) var r = { row: n + 1, column: 0 };
          else if (this.end.row < e) r = { row: e, column: 0 };
          if (this.start.row > n) var s = { row: n + 1, column: 0 };
          else if (this.start.row < e) s = { row: e, column: 0 };
          return t.fromPoints(s || this.start, r || this.end);
        }),
        (t.prototype.extend = function (e, n) {
          var r = this.compare(e, n);
          if (0 == r) return this;
          if (-1 == r) var s = { row: e, column: n };
          else var o = { row: e, column: n };
          return t.fromPoints(s || this.start, o || this.end);
        }),
        (t.prototype.isEmpty = function () {
          return (
            this.start.row === this.end.row &&
            this.start.column === this.end.column
          );
        }),
        (t.prototype.isMultiLine = function () {
          return this.start.row !== this.end.row;
        }),
        (t.prototype.clone = function () {
          return t.fromPoints(this.start, this.end);
        }),
        (t.prototype.collapseRows = function () {
          return 0 == this.end.column
            ? new t(
                this.start.row,
                0,
                Math.max(this.start.row, this.end.row - 1),
                0
              )
            : new t(this.start.row, 0, this.end.row, 0);
        }),
        (t.prototype.toScreenRange = function (e) {
          var n = e.documentToScreenPosition(this.start),
            r = e.documentToScreenPosition(this.end);
          return new t(n.row, n.column, r.row, r.column);
        }),
        (t.prototype.moveBy = function (t, e) {
          (this.start.row += t),
            (this.start.column += e),
            (this.end.row += t),
            (this.end.column += e);
        }),
        t
      );
    })();
    (r.fromPoints = function (t, e) {
      return new r(t.row, t.column, e.row, e.column);
    }),
      (r.comparePoints = function (t, e) {
        return t.row - e.row || t.column - e.column;
      }),
      (r.comparePoints = function (t, e) {
        return t.row - e.row || t.column - e.column;
      }),
      (e.Range = r);
  }),
  ace.define("ace/anchor", [], function (t, e, n) {
    "use strict";
    var r = t("./lib/oop"),
      s = t("./lib/event_emitter").EventEmitter,
      o = (function () {
        function t(t, e, n) {
          (this.$onChange = this.onChange.bind(this)),
            this.attach(t),
            "undefined" == typeof n
              ? this.setPosition(e.row, e.column)
              : this.setPosition(e, n);
        }
        return (
          (t.prototype.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column);
          }),
          (t.prototype.getDocument = function () {
            return this.document;
          }),
          (t.prototype.onChange = function (t) {
            if (
              (t.start.row != t.end.row || t.start.row == this.row) &&
              !(t.start.row > this.row)
            ) {
              var e = (function (t, e, n) {
                var r = "insert" == t.action,
                  s = (r ? 1 : -1) * (t.end.row - t.start.row),
                  o = (r ? 1 : -1) * (t.end.column - t.start.column),
                  i = t.start,
                  _ = r ? i : t.end;
                if (a(e, i, n)) return { row: e.row, column: e.column };
                if (a(_, e, !n))
                  return {
                    row: e.row + s,
                    column: e.column + (e.row == _.row ? o : 0),
                  };
                return { row: i.row, column: i.column };
              })(t, { row: this.row, column: this.column }, this.$insertRight);
              this.setPosition(e.row, e.column, !0);
            }
          }),
          (t.prototype.setPosition = function (t, e, n) {
            var r;
            if (
              ((r = n
                ? { row: t, column: e }
                : this.$clipPositionToDocument(t, e)),
              this.row != r.row || this.column != r.column)
            ) {
              var s = { row: this.row, column: this.column };
              (this.row = r.row),
                (this.column = r.column),
                this._signal("change", { old: s, value: r });
            }
          }),
          (t.prototype.detach = function () {
            this.document.off("change", this.$onChange);
          }),
          (t.prototype.attach = function (t) {
            (this.document = t || this.document),
              this.document.on("change", this.$onChange);
          }),
          (t.prototype.$clipPositionToDocument = function (t, e) {
            var n = {};
            return (
              t >= this.document.getLength()
                ? ((n.row = Math.max(0, this.document.getLength() - 1)),
                  (n.column = this.document.getLine(n.row).length))
                : t < 0
                ? ((n.row = 0), (n.column = 0))
                : ((n.row = t),
                  (n.column = Math.min(
                    this.document.getLine(n.row).length,
                    Math.max(0, e)
                  ))),
              e < 0 && (n.column = 0),
              n
            );
          }),
          t
        );
      })();
    function a(t, e, n) {
      var r = n ? t.column <= e.column : t.column < e.column;
      return t.row < e.row || (t.row == e.row && r);
    }
    (o.prototype.$insertRight = !1),
      r.implement(o.prototype, s),
      (e.Anchor = o);
  }),
  ace.define("ace/document", [], function (t, e, n) {
    "use strict";
    var r = t("./lib/oop"),
      s = t("./apply_delta").applyDelta,
      o = t("./lib/event_emitter").EventEmitter,
      a = t("./range").Range,
      i = t("./anchor").Anchor,
      _ = (function () {
        function t(t) {
          (this.$lines = [""]),
            0 === t.length
              ? (this.$lines = [""])
              : Array.isArray(t)
              ? this.insertMergedLines({ row: 0, column: 0 }, t)
              : this.insert({ row: 0, column: 0 }, t);
        }
        return (
          (t.prototype.setValue = function (t) {
            var e = this.getLength() - 1;
            this.remove(new a(0, 0, e, this.getLine(e).length)),
              this.insert({ row: 0, column: 0 }, t || "");
          }),
          (t.prototype.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
          }),
          (t.prototype.createAnchor = function (t, e) {
            return new i(this, t, e);
          }),
          (t.prototype.$detectNewLine = function (t) {
            var e = t.match(/^.*?(\r\n|\r|\n)/m);
            (this.$autoNewLine = e ? e[1] : "\n"),
              this._signal("changeNewLineMode");
          }),
          (t.prototype.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
              case "windows":
                return "\r\n";
              case "unix":
                return "\n";
              default:
                return this.$autoNewLine || "\n";
            }
          }),
          (t.prototype.setNewLineMode = function (t) {
            this.$newLineMode !== t &&
              ((this.$newLineMode = t), this._signal("changeNewLineMode"));
          }),
          (t.prototype.getNewLineMode = function () {
            return this.$newLineMode;
          }),
          (t.prototype.isNewLine = function (t) {
            return "\r\n" == t || "\r" == t || "\n" == t;
          }),
          (t.prototype.getLine = function (t) {
            return this.$lines[t] || "";
          }),
          (t.prototype.getLines = function (t, e) {
            return this.$lines.slice(t, e + 1);
          }),
          (t.prototype.getAllLines = function () {
            return this.getLines(0, this.getLength());
          }),
          (t.prototype.getLength = function () {
            return this.$lines.length;
          }),
          (t.prototype.getTextRange = function (t) {
            return this.getLinesForRange(t).join(this.getNewLineCharacter());
          }),
          (t.prototype.getLinesForRange = function (t) {
            var e;
            if (t.start.row === t.end.row)
              e = [
                this.getLine(t.start.row).substring(
                  t.start.column,
                  t.end.column
                ),
              ];
            else {
              (e = this.getLines(t.start.row, t.end.row))[0] = (
                e[0] || ""
              ).substring(t.start.column);
              var n = e.length - 1;
              t.end.row - t.start.row == n &&
                (e[n] = e[n].substring(0, t.end.column));
            }
            return e;
          }),
          (t.prototype.insertLines = function (t, e) {
            return (
              console.warn(
                "Use of document.insertLines is deprecated. Use the insertFullLines method instead."
              ),
              this.insertFullLines(t, e)
            );
          }),
          (t.prototype.removeLines = function (t, e) {
            return (
              console.warn(
                "Use of document.removeLines is deprecated. Use the removeFullLines method instead."
              ),
              this.removeFullLines(t, e)
            );
          }),
          (t.prototype.insertNewLine = function (t) {
            return (
              console.warn(
                "Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."
              ),
              this.insertMergedLines(t, ["", ""])
            );
          }),
          (t.prototype.insert = function (t, e) {
            return (
              this.getLength() <= 1 && this.$detectNewLine(e),
              this.insertMergedLines(t, this.$split(e))
            );
          }),
          (t.prototype.insertInLine = function (t, e) {
            var n = this.clippedPos(t.row, t.column),
              r = this.pos(t.row, t.column + e.length);
            return (
              this.applyDelta(
                { start: n, end: r, action: "insert", lines: [e] },
                !0
              ),
              this.clonePos(r)
            );
          }),
          (t.prototype.clippedPos = function (t, e) {
            var n = this.getLength();
            void 0 === t
              ? (t = n)
              : t < 0
              ? (t = 0)
              : t >= n && ((t = n - 1), (e = void 0));
            var r = this.getLine(t);
            return (
              void 0 == e && (e = r.length),
              { row: t, column: (e = Math.min(Math.max(e, 0), r.length)) }
            );
          }),
          (t.prototype.clonePos = function (t) {
            return { row: t.row, column: t.column };
          }),
          (t.prototype.pos = function (t, e) {
            return { row: t, column: e };
          }),
          (t.prototype.$clipPosition = function (t) {
            var e = this.getLength();
            return (
              t.row >= e
                ? ((t.row = Math.max(0, e - 1)),
                  (t.column = this.getLine(e - 1).length))
                : ((t.row = Math.max(0, t.row)),
                  (t.column = Math.min(
                    Math.max(t.column, 0),
                    this.getLine(t.row).length
                  ))),
              t
            );
          }),
          (t.prototype.insertFullLines = function (t, e) {
            var n = 0;
            (t = Math.min(Math.max(t, 0), this.getLength())) < this.getLength()
              ? ((e = e.concat([""])), (n = 0))
              : ((e = [""].concat(e)), t--, (n = this.$lines[t].length)),
              this.insertMergedLines({ row: t, column: n }, e);
          }),
          (t.prototype.insertMergedLines = function (t, e) {
            var n = this.clippedPos(t.row, t.column),
              r = {
                row: n.row + e.length - 1,
                column: (1 == e.length ? n.column : 0) + e[e.length - 1].length,
              };
            return (
              this.applyDelta({ start: n, end: r, action: "insert", lines: e }),
              this.clonePos(r)
            );
          }),
          (t.prototype.remove = function (t) {
            var e = this.clippedPos(t.start.row, t.start.column),
              n = this.clippedPos(t.end.row, t.end.column);
            return (
              this.applyDelta({
                start: e,
                end: n,
                action: "remove",
                lines: this.getLinesForRange({ start: e, end: n }),
              }),
              this.clonePos(e)
            );
          }),
          (t.prototype.removeInLine = function (t, e, n) {
            var r = this.clippedPos(t, e),
              s = this.clippedPos(t, n);
            return (
              this.applyDelta(
                {
                  start: r,
                  end: s,
                  action: "remove",
                  lines: this.getLinesForRange({ start: r, end: s }),
                },
                !0
              ),
              this.clonePos(r)
            );
          }),
          (t.prototype.removeFullLines = function (t, e) {
            t = Math.min(Math.max(0, t), this.getLength() - 1);
            var n =
                (e = Math.min(Math.max(0, e), this.getLength() - 1)) ==
                  this.getLength() - 1 && t > 0,
              r = e < this.getLength() - 1,
              s = n ? t - 1 : t,
              o = n ? this.getLine(s).length : 0,
              i = r ? e + 1 : e,
              _ = r ? 0 : this.getLine(i).length,
              T = new a(s, o, i, _),
              u = this.$lines.slice(t, e + 1);
            return (
              this.applyDelta({
                start: T.start,
                end: T.end,
                action: "remove",
                lines: this.getLinesForRange(T),
              }),
              u
            );
          }),
          (t.prototype.removeNewLine = function (t) {
            t < this.getLength() - 1 &&
              t >= 0 &&
              this.applyDelta({
                start: this.pos(t, this.getLine(t).length),
                end: this.pos(t + 1, 0),
                action: "remove",
                lines: ["", ""],
              });
          }),
          (t.prototype.replace = function (t, e) {
            return (
              t instanceof a || (t = a.fromPoints(t.start, t.end)),
              0 === e.length && t.isEmpty()
                ? t.start
                : e == this.getTextRange(t)
                ? t.end
                : (this.remove(t), e ? this.insert(t.start, e) : t.start)
            );
          }),
          (t.prototype.applyDeltas = function (t) {
            for (var e = 0; e < t.length; e++) this.applyDelta(t[e]);
          }),
          (t.prototype.revertDeltas = function (t) {
            for (var e = t.length - 1; e >= 0; e--) this.revertDelta(t[e]);
          }),
          (t.prototype.applyDelta = function (t, e) {
            var n = "insert" == t.action;
            (n
              ? t.lines.length <= 1 && !t.lines[0]
              : !a.comparePoints(t.start, t.end)) ||
              (n && t.lines.length > 2e4
                ? this.$splitAndapplyLargeDelta(t, 2e4)
                : (s(this.$lines, t, e), this._signal("change", t)));
          }),
          (t.prototype.$safeApplyDelta = function (t) {
            var e = this.$lines.length;
            (("remove" == t.action && t.start.row < e && t.end.row < e) ||
              ("insert" == t.action && t.start.row <= e)) &&
              this.applyDelta(t);
          }),
          (t.prototype.$splitAndapplyLargeDelta = function (t, e) {
            for (
              var n = t.lines,
                r = n.length - e + 1,
                s = t.start.row,
                o = t.start.column,
                a = 0,
                i = 0;
              a < r;
              a = i
            ) {
              i += e - 1;
              var _ = n.slice(a, i);
              _.push(""),
                this.applyDelta(
                  {
                    start: this.pos(s + a, o),
                    end: this.pos(s + i, (o = 0)),
                    action: t.action,
                    lines: _,
                  },
                  !0
                );
            }
            (t.lines = n.slice(a)),
              (t.start.row = s + a),
              (t.start.column = o),
              this.applyDelta(t, !0);
          }),
          (t.prototype.revertDelta = function (t) {
            this.$safeApplyDelta({
              start: this.clonePos(t.start),
              end: this.clonePos(t.end),
              action: "insert" == t.action ? "remove" : "insert",
              lines: t.lines.slice(),
            });
          }),
          (t.prototype.indexToPosition = function (t, e) {
            for (
              var n = this.$lines || this.getAllLines(),
                r = this.getNewLineCharacter().length,
                s = e || 0,
                o = n.length;
              s < o;
              s++
            )
              if ((t -= n[s].length + r) < 0)
                return { row: s, column: t + n[s].length + r };
            return { row: o - 1, column: t + n[o - 1].length + r };
          }),
          (t.prototype.positionToIndex = function (t, e) {
            for (
              var n = this.$lines || this.getAllLines(),
                r = this.getNewLineCharacter().length,
                s = 0,
                o = Math.min(t.row, n.length),
                a = e || 0;
              a < o;
              ++a
            )
              s += n[a].length + r;
            return s + t.column;
          }),
          (t.prototype.$split = function (t) {
            return t.split(/\r\n|\r|\n/);
          }),
          t
        );
      })();
    (_.prototype.$autoNewLine = ""),
      (_.prototype.$newLineMode = "auto"),
      r.implement(_.prototype, o),
      (e.Document = _);
  }),
  ace.define("ace/lib/lang", [], function (t, e, n) {
    "use strict";
    (e.last = function (t) {
      return t[t.length - 1];
    }),
      (e.stringReverse = function (t) {
        return t.split("").reverse().join("");
      }),
      (e.stringRepeat = function (t, e) {
        for (var n = ""; e > 0; ) 1 & e && (n += t), (e >>= 1) && (t += t);
        return n;
      });
    var r = /^\s\s*/,
      s = /\s\s*$/;
    (e.stringTrimLeft = function (t) {
      return t.replace(r, "");
    }),
      (e.stringTrimRight = function (t) {
        return t.replace(s, "");
      }),
      (e.copyObject = function (t) {
        var e = {};
        for (var n in t) e[n] = t[n];
        return e;
      }),
      (e.copyArray = function (t) {
        for (var e = [], n = 0, r = t.length; n < r; n++)
          t[n] && "object" == typeof t[n]
            ? (e[n] = this.copyObject(t[n]))
            : (e[n] = t[n]);
        return e;
      }),
      (e.deepCopy = function t(e) {
        if ("object" !== typeof e || !e) return e;
        var n;
        if (Array.isArray(e)) {
          n = [];
          for (var r = 0; r < e.length; r++) n[r] = t(e[r]);
          return n;
        }
        if ("[object Object]" !== Object.prototype.toString.call(e)) return e;
        for (var r in ((n = {}), e)) n[r] = t(e[r]);
        return n;
      }),
      (e.arrayToMap = function (t) {
        for (var e = {}, n = 0; n < t.length; n++) e[t[n]] = 1;
        return e;
      }),
      (e.createMap = function (t) {
        var e = Object.create(null);
        for (var n in t) e[n] = t[n];
        return e;
      }),
      (e.arrayRemove = function (t, e) {
        for (var n = 0; n <= t.length; n++) e === t[n] && t.splice(n, 1);
      }),
      (e.escapeRegExp = function (t) {
        return t.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      }),
      (e.escapeHTML = function (t) {
        return ("" + t)
          .replace(/&/g, "&#38;")
          .replace(/"/g, "&#34;")
          .replace(/'/g, "&#39;")
          .replace(/</g, "&#60;");
      }),
      (e.getMatchOffsets = function (t, e) {
        var n = [];
        return (
          t.replace(e, function (t) {
            n.push({
              offset: arguments[arguments.length - 2],
              length: t.length,
            });
          }),
          n
        );
      }),
      (e.deferredCall = function (t) {
        var e = null,
          n = function () {
            (e = null), t();
          },
          r = function t(r) {
            return t.cancel(), (e = setTimeout(n, r || 0)), t;
          };
        return (
          (r.schedule = r),
          (r.call = function () {
            return this.cancel(), t(), r;
          }),
          (r.cancel = function () {
            return clearTimeout(e), (e = null), r;
          }),
          (r.isPending = function () {
            return e;
          }),
          r
        );
      }),
      (e.delayedCall = function (t, e) {
        var n = null,
          r = function () {
            (n = null), t();
          },
          s = function (t) {
            null == n && (n = setTimeout(r, t || e));
          };
        return (
          (s.delay = function (t) {
            n && clearTimeout(n), (n = setTimeout(r, t || e));
          }),
          (s.schedule = s),
          (s.call = function () {
            this.cancel(), t();
          }),
          (s.cancel = function () {
            n && clearTimeout(n), (n = null);
          }),
          (s.isPending = function () {
            return n;
          }),
          s
        );
      });
  }),
  ace.define("ace/worker/mirror", [], function (t, e, n) {
    "use strict";
    var r = t("../document").Document,
      s = t("../lib/lang"),
      o = (e.Mirror = function (t) {
        this.sender = t;
        var e = (this.doc = new r("")),
          n = (this.deferredUpdate = s.delayedCall(this.onUpdate.bind(this))),
          o = this;
        t.on("change", function (t) {
          var r = t.data;
          if (r[0].start) e.applyDeltas(r);
          else
            for (var s = 0; s < r.length; s += 2) {
              var a, i;
              if (
                ("insert" ==
                (a = Array.isArray(r[s + 1])
                  ? { action: "insert", start: r[s], lines: r[s + 1] }
                  : { action: "remove", start: r[s], end: r[s + 1] }).action
                  ? a.start
                  : a.end
                ).row >= e.$lines.length
              )
                throw (
                  (((i = new Error("Invalid delta")).data = {
                    path: o.$path,
                    linesLength: e.$lines.length,
                    start: a.start,
                    end: a.end,
                  }),
                  i)
                );
              e.applyDelta(a, !0);
            }
          if (o.$timeout) return n.schedule(o.$timeout);
          o.onUpdate();
        });
      });
    (function () {
      (this.$timeout = 500),
        (this.setTimeout = function (t) {
          this.$timeout = t;
        }),
        (this.setValue = function (t) {
          this.doc.setValue(t), this.deferredUpdate.schedule(this.$timeout);
        }),
        (this.getValue = function (t) {
          this.sender.callback(this.doc.getValue(), t);
        }),
        (this.onUpdate = function () {}),
        (this.isPending = function () {
          return this.deferredUpdate.isPending();
        });
    }).call(o.prototype);
  }),
  ace.define("ace/mode/php/php", [], function (t, e, n) {
    var r = { Constants: {} };
    (r.Constants.T_THROW = 317),
      (r.Constants.T_INCLUDE = 272),
      (r.Constants.T_INCLUDE_ONCE = 273),
      (r.Constants.T_EVAL = 274),
      (r.Constants.T_REQUIRE = 275),
      (r.Constants.T_REQUIRE_ONCE = 276),
      (r.Constants.T_LOGICAL_OR = 277),
      (r.Constants.T_LOGICAL_XOR = 278),
      (r.Constants.T_LOGICAL_AND = 279),
      (r.Constants.T_PRINT = 280),
      (r.Constants.T_YIELD = 281),
      (r.Constants.T_DOUBLE_ARROW = 386),
      (r.Constants.T_YIELD_FROM = 282),
      (r.Constants.T_PLUS_EQUAL = 352),
      (r.Constants.T_MINUS_EQUAL = 353),
      (r.Constants.T_MUL_EQUAL = 354),
      (r.Constants.T_DIV_EQUAL = 355),
      (r.Constants.T_CONCAT_EQUAL = 356),
      (r.Constants.T_MOD_EQUAL = 357),
      (r.Constants.T_AND_EQUAL = 358),
      (r.Constants.T_OR_EQUAL = 359),
      (r.Constants.T_XOR_EQUAL = 360),
      (r.Constants.T_SL_EQUAL = 361),
      (r.Constants.T_SR_EQUAL = 362),
      (r.Constants.T_POW_EQUAL = 402),
      (r.Constants.T_COALESCE_EQUAL = 363),
      (r.Constants.T_COALESCE = 400),
      (r.Constants.T_BOOLEAN_OR = 364),
      (r.Constants.T_BOOLEAN_AND = 365),
      (r.Constants.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG = 404),
      (r.Constants.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG = 403),
      (r.Constants.T_IS_EQUAL = 366),
      (r.Constants.T_IS_NOT_EQUAL = 367),
      (r.Constants.T_IS_IDENTICAL = 368),
      (r.Constants.T_IS_NOT_IDENTICAL = 369),
      (r.Constants.T_SPACESHIP = 372),
      (r.Constants.T_IS_SMALLER_OR_EQUAL = 370),
      (r.Constants.T_IS_GREATER_OR_EQUAL = 371),
      (r.Constants.T_SL = 373),
      (r.Constants.T_SR = 374),
      (r.Constants.T_INSTANCEOF = 283),
      (r.Constants.T_INC = 375),
      (r.Constants.T_DEC = 376),
      (r.Constants.T_INT_CAST = 377),
      (r.Constants.T_DOUBLE_CAST = 378),
      (r.Constants.T_STRING_CAST = 379),
      (r.Constants.T_ARRAY_CAST = 380),
      (r.Constants.T_OBJECT_CAST = 381),
      (r.Constants.T_BOOL_CAST = 382),
      (r.Constants.T_UNSET_CAST = 383),
      (r.Constants.T_POW = 401),
      (r.Constants.T_NEW = 284),
      (r.Constants.T_CLONE = 285),
      (r.Constants.T_EXIT = 286),
      (r.Constants.T_IF = 287),
      (r.Constants.T_ELSEIF = 288),
      (r.Constants.T_ELSE = 289),
      (r.Constants.T_ENDIF = 290),
      (r.Constants.T_LNUMBER = 260),
      (r.Constants.T_DNUMBER = 261),
      (r.Constants.T_STRING = 262),
      (r.Constants.T_STRING_VARNAME = 270),
      (r.Constants.T_VARIABLE = 266),
      (r.Constants.T_NUM_STRING = 271),
      (r.Constants.T_INLINE_HTML = 267),
      (r.Constants.T_ENCAPSED_AND_WHITESPACE = 268),
      (r.Constants.T_CONSTANT_ENCAPSED_STRING = 269),
      (r.Constants.T_ECHO = 291),
      (r.Constants.T_DO = 292),
      (r.Constants.T_WHILE = 293),
      (r.Constants.T_ENDWHILE = 294),
      (r.Constants.T_FOR = 295),
      (r.Constants.T_ENDFOR = 296),
      (r.Constants.T_FOREACH = 297),
      (r.Constants.T_ENDFOREACH = 298),
      (r.Constants.T_DECLARE = 299),
      (r.Constants.T_ENDDECLARE = 300),
      (r.Constants.T_AS = 301),
      (r.Constants.T_SWITCH = 302),
      (r.Constants.T_MATCH = 306),
      (r.Constants.T_ENDSWITCH = 303),
      (r.Constants.T_CASE = 304),
      (r.Constants.T_DEFAULT = 305),
      (r.Constants.T_BREAK = 307),
      (r.Constants.T_CONTINUE = 308),
      (r.Constants.T_GOTO = 309),
      (r.Constants.T_FUNCTION = 310),
      (r.Constants.T_FN = 311),
      (r.Constants.T_CONST = 312),
      (r.Constants.T_RETURN = 313),
      (r.Constants.T_TRY = 314),
      (r.Constants.T_CATCH = 315),
      (r.Constants.T_FINALLY = 316),
      (r.Constants.T_THROW = 317),
      (r.Constants.T_USE = 318),
      (r.Constants.T_INSTEADOF = 319),
      (r.Constants.T_GLOBAL = 320),
      (r.Constants.T_STATIC = 321),
      (r.Constants.T_ABSTRACT = 322),
      (r.Constants.T_FINAL = 323),
      (r.Constants.T_PRIVATE = 324),
      (r.Constants.T_PROTECTED = 325),
      (r.Constants.T_PUBLIC = 326),
      (r.Constants.T_READONLY = 327),
      (r.Constants.T_VAR = 328),
      (r.Constants.T_UNSET = 329),
      (r.Constants.T_ISSET = 330),
      (r.Constants.T_EMPTY = 331),
      (r.Constants.T_HALT_COMPILER = 332),
      (r.Constants.T_CLASS = 333),
      (r.Constants.T_TRAIT = 334),
      (r.Constants.T_INTERFACE = 335),
      (r.Constants.T_ENUM = 336),
      (r.Constants.T_EXTENDS = 337),
      (r.Constants.T_IMPLEMENTS = 338),
      (r.Constants.T_OBJECT_OPERATOR = 384),
      (r.Constants.T_NULLSAFE_OBJECT_OPERATOR = 385),
      (r.Constants.T_DOUBLE_ARROW = 386),
      (r.Constants.T_LIST = 340),
      (r.Constants.T_ARRAY = 341),
      (r.Constants.T_CALLABLE = 342),
      (r.Constants.T_CLASS_C = 346),
      (r.Constants.T_TRAIT_C = 347),
      (r.Constants.T_METHOD_C = 348),
      (r.Constants.T_FUNC_C = 349),
      (r.Constants.T_LINE = 343),
      (r.Constants.T_FILE = 344),
      (r.Constants.T_START_HEREDOC = 393),
      (r.Constants.T_END_HEREDOC = 394),
      (r.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 395),
      (r.Constants.T_CURLY_OPEN = 396),
      (r.Constants.T_PAAMAYIM_NEKUDOTAYIM = 397),
      (r.Constants.T_NAMESPACE = 339),
      (r.Constants.T_NS_C = 350),
      (r.Constants.T_DIR = 345),
      (r.Constants.T_NS_SEPARATOR = 398),
      (r.Constants.T_ELLIPSIS = 399),
      (r.Constants.T_NAME_FULLY_QUALIFIED = 263),
      (r.Constants.T_NAME_QUALIFIED = 265),
      (r.Constants.T_NAME_RELATIVE = 264),
      (r.Constants.T_ATTRIBUTE = 351),
      (r.Constants.T_ENUM = 336),
      (r.Constants.T_BAD_CHARACTER = 405),
      (r.Constants.T_COMMENT = 387),
      (r.Constants.T_DOC_COMMENT = 388),
      (r.Constants.T_OPEN_TAG = 389),
      (r.Constants.T_OPEN_TAG_WITH_ECHO = 390),
      (r.Constants.T_CLOSE_TAG = 391),
      (r.Constants.T_WHITESPACE = 392),
      (r.Lexer = function (t, e) {
        var n,
          s,
          o = ["INITIAL"],
          a = 0,
          i = function (t) {
            o[a] = t;
          },
          _ = function (t) {
            o[++a] = t;
          },
          T = function () {
            --a;
          },
          u = void 0 === e || /^(on|true|1)$/i.test(e.short_open_tag),
          E = u
            ? /^(\<\?php(?:\r\n|[ \t\r\n])|<\?|\<script language\=('|")?php('|")?\>)/i
            : /^(\<\?php(?:\r\n|[ \t\r\n])|\<script language\=('|")?php('|")?\>)/i,
          p = u
            ? /[^<]*(?:<(?!\?|script language\=('|")?php('|")?\>)[^<]*)*/i
            : /[^<]*(?:<(?!\?=|\?php[ \t\r\n]|script language\=('|")?php('|")?\>)[^<]*)*/i,
          l = "[a-zA-Z_\\x7f-\\uffff][a-zA-Z0-9_\\x7f-\\uffff]*",
          C = function (t) {
            return (
              "[^" +
              t +
              "\\\\${]*(?:(?:\\\\[\\s\\S]|\\$(?!\\{|[a-zA-Z_\\x7f-\\uffff])|\\{(?!\\$))[^" +
              t +
              "\\\\${]*)*"
            );
          },
          A = [
            {
              value: r.Constants.T_VARIABLE,
              re: new RegExp("^\\$" + l + "(?=\\[)"),
              func: function () {
                _("VAR_OFFSET");
              },
            },
            {
              value: r.Constants.T_VARIABLE,
              re: new RegExp("^\\$" + l + "(?=->" + l + ")"),
              func: function () {
                _("LOOKING_FOR_PROPERTY");
              },
            },
            {
              value: r.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
              re: new RegExp("^\\$\\{(?=" + l + "[\\[}])"),
              func: function () {
                _("LOOKING_FOR_VARNAME");
              },
            },
            { value: r.Constants.T_VARIABLE, re: new RegExp("^\\$" + l) },
            {
              value: r.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
              re: /^\$\{/,
              func: function () {
                _("IN_SCRIPTING");
              },
            },
            {
              value: r.Constants.T_CURLY_OPEN,
              re: /^\{(?=\$)/,
              func: function () {
                _("IN_SCRIPTING");
              },
            },
          ],
          c = {
            INITIAL: [
              {
                value: r.Constants.T_OPEN_TAG_WITH_ECHO,
                re: /^<\?=/i,
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              {
                value: r.Constants.T_OPEN_TAG,
                re: E,
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              { value: r.Constants.T_INLINE_HTML, re: p },
            ],
            IN_SCRIPTING: [
              { value: r.Constants.T_WHITESPACE, re: /^[ \n\r\t]+/ },
              { value: r.Constants.T_ABSTRACT, re: /^abstract\b/i },
              { value: r.Constants.T_LOGICAL_AND, re: /^and\b/i },
              { value: r.Constants.T_ARRAY, re: /^array\b/i },
              { value: r.Constants.T_AS, re: /^as\b/i },
              { value: r.Constants.T_BREAK, re: /^break\b/i },
              { value: r.Constants.T_CALLABLE, re: /^callable\b/i },
              { value: r.Constants.T_CASE, re: /^case\b/i },
              { value: r.Constants.T_CATCH, re: /^catch\b/i },
              { value: r.Constants.T_CLASS, re: /^class\b/i },
              { value: r.Constants.T_CLONE, re: /^clone\b/i },
              { value: r.Constants.T_CONST, re: /^const\b/i },
              { value: r.Constants.T_CONTINUE, re: /^continue\b/i },
              { value: r.Constants.T_DECLARE, re: /^declare\b/i },
              { value: r.Constants.T_DEFAULT, re: /^default\b/i },
              { value: r.Constants.T_DO, re: /^do\b/i },
              { value: r.Constants.T_ECHO, re: /^echo\b/i },
              { value: r.Constants.T_ELSE, re: /^else\b/i },
              { value: r.Constants.T_ELSEIF, re: /^elseif\b/i },
              { value: r.Constants.T_ENUM, re: /^enum\b/i },
              { value: r.Constants.T_ENDDECLARE, re: /^enddeclare\b/i },
              { value: r.Constants.T_ENDFOR, re: /^endfor\b/i },
              { value: r.Constants.T_ENDFOREACH, re: /^endforeach\b/i },
              { value: r.Constants.T_ENDIF, re: /^endif\b/i },
              { value: r.Constants.T_ENDSWITCH, re: /^endswitch\b/i },
              { value: r.Constants.T_ENDWHILE, re: /^endwhile\b/i },
              { value: r.Constants.T_ENUM, re: /^enum\b/i },
              { value: r.Constants.T_EMPTY, re: /^empty\b/i },
              { value: r.Constants.T_EVAL, re: /^eval\b/i },
              { value: r.Constants.T_EXIT, re: /^(?:exit|die)\b/i },
              { value: r.Constants.T_EXTENDS, re: /^extends\b/i },
              { value: r.Constants.T_FINAL, re: /^final\b/i },
              { value: r.Constants.T_FINALLY, re: /^finally\b/i },
              { value: r.Constants.T_FN, re: /^fn\b/i },
              { value: r.Constants.T_FOR, re: /^for\b/i },
              { value: r.Constants.T_FOREACH, re: /^foreach\b/i },
              { value: r.Constants.T_FUNCTION, re: /^function\b/i },
              { value: r.Constants.T_GLOBAL, re: /^global\b/i },
              { value: r.Constants.T_GOTO, re: /^goto\b/i },
              { value: r.Constants.T_IF, re: /^if\b/i },
              { value: r.Constants.T_IMPLEMENTS, re: /^implements\b/i },
              { value: r.Constants.T_INCLUDE, re: /^include\b/i },
              { value: r.Constants.T_INCLUDE_ONCE, re: /^include_once\b/i },
              { value: r.Constants.T_INSTANCEOF, re: /^instanceof\b/i },
              { value: r.Constants.T_INSTEADOF, re: /^insteadof\b/i },
              { value: r.Constants.T_INTERFACE, re: /^interface\b/i },
              { value: r.Constants.T_ISSET, re: /^isset\b/i },
              { value: r.Constants.T_LIST, re: /^list\b/i },
              { value: r.Constants.T_MATCH, re: /^match\b/i },
              { value: r.Constants.T_NEW, re: /^new\b/i },
              { value: r.Constants.T_LOGICAL_OR, re: /^or\b/i },
              { value: r.Constants.T_PRINT, re: /^print\b/i },
              { value: r.Constants.T_PRIVATE, re: /^private\b/i },
              { value: r.Constants.T_PROTECTED, re: /^protected\b/i },
              { value: r.Constants.T_PUBLIC, re: /^public\b/i },
              { value: r.Constants.T_READONLY, re: /^readonly\b/i },
              { value: r.Constants.T_REQUIRE, re: /^require\b/i },
              { value: r.Constants.T_REQUIRE_ONCE, re: /^require_once\b/i },
              { value: r.Constants.T_STATIC, re: /^static\b/i },
              { value: r.Constants.T_SWITCH, re: /^switch\b/i },
              { value: r.Constants.T_THROW, re: /^throw\b/i },
              { value: r.Constants.T_TRAIT, re: /^trait\b/i },
              { value: r.Constants.T_TRY, re: /^try\b/i },
              { value: r.Constants.T_UNSET, re: /^unset\b/i },
              { value: r.Constants.T_USE, re: /^use\b/i },
              { value: r.Constants.T_VAR, re: /^var\b/i },
              { value: r.Constants.T_WHILE, re: /^while\b/i },
              { value: r.Constants.T_LOGICAL_XOR, re: /^xor\b/i },
              { value: r.Constants.T_YIELD_FROM, re: /^yield\s+from\b/i },
              { value: r.Constants.T_YIELD, re: /^yield\b/i },
              { value: r.Constants.T_RETURN, re: /^return\b/i },
              { value: r.Constants.T_METHOD_C, re: /^__METHOD__\b/i },
              { value: r.Constants.T_LINE, re: /^__LINE__\b/i },
              { value: r.Constants.T_FILE, re: /^__FILE__\b/i },
              { value: r.Constants.T_FUNC_C, re: /^__FUNCTION__\b/i },
              { value: r.Constants.T_NS_C, re: /^__NAMESPACE__\b/i },
              { value: r.Constants.T_TRAIT_C, re: /^__TRAIT__\b/i },
              { value: r.Constants.T_DIR, re: /^__DIR__\b/i },
              { value: r.Constants.T_CLASS_C, re: /^__CLASS__\b/i },
              { value: r.Constants.T_AND_EQUAL, re: /^&=/ },
              {
                value: r.Constants.T_ARRAY_CAST,
                re: /^\([ \t]*array[ \t]*\)/i,
              },
              {
                value: r.Constants.T_BOOL_CAST,
                re: /^\([ \t]*(?:bool|boolean)[ \t]*\)/i,
              },
              {
                value: r.Constants.T_DOUBLE_CAST,
                re: /^\([ \t]*(?:real|float|double)[ \t]*\)/i,
              },
              {
                value: r.Constants.T_INT_CAST,
                re: /^\([ \t]*(?:int|integer)[ \t]*\)/i,
              },
              {
                value: r.Constants.T_OBJECT_CAST,
                re: /^\([ \t]*object[ \t]*\)/i,
              },
              {
                value: r.Constants.T_STRING_CAST,
                re: /^\([ \t]*(?:binary|string)[ \t]*\)/i,
              },
              {
                value: r.Constants.T_UNSET_CAST,
                re: /^\([ \t]*unset[ \t]*\)/i,
              },
              { value: r.Constants.T_BOOLEAN_AND, re: /^&&/ },
              {
                value: r.Constants.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG,
                re: /^&(?=[$])/,
              },
              {
                value: r.Constants.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG,
                re: /^(&)(?=[^\$|^&])/,
              },
              { value: r.Constants.T_BOOLEAN_OR, re: /^\|\|/ },
              {
                value: r.Constants.T_CLOSE_TAG,
                re: /^(?:\?>|<\/script>)(\r\n|\r|\n)?/i,
                func: function () {
                  i("INITIAL");
                },
              },
              { value: r.Constants.T_DOUBLE_ARROW, re: /^=>/ },
              { value: r.Constants.T_PAAMAYIM_NEKUDOTAYIM, re: /^::/ },
              { value: r.Constants.T_INC, re: /^\+\+/ },
              { value: r.Constants.T_DEC, re: /^--/ },
              { value: r.Constants.T_CONCAT_EQUAL, re: /^\.=/ },
              { value: r.Constants.T_DIV_EQUAL, re: /^\/=/ },
              { value: r.Constants.T_XOR_EQUAL, re: /^\^=/ },
              { value: r.Constants.T_MUL_EQUAL, re: /^\*=/ },
              { value: r.Constants.T_MOD_EQUAL, re: /^%=/ },
              { value: r.Constants.T_SL_EQUAL, re: /^<<=/ },
              {
                value: r.Constants.T_START_HEREDOC,
                re: new RegExp(
                  "^[bB]?<<<[ \\t]*'(" + l + ")'(?:\\r\\n|\\r|\\n)"
                ),
                func: function (t) {
                  (n = t[1]), i("NOWDOC");
                },
              },
              {
                value: r.Constants.T_START_HEREDOC,
                re: new RegExp(
                  '^[bB]?<<<[ \\t]*("?)(' + l + ")\\1(?:\\r\\n|\\r|\\n)"
                ),
                func: function (t) {
                  (n = t[2]), (s = !0), i("HEREDOC");
                },
              },
              { value: r.Constants.T_SL, re: /^<</ },
              { value: r.Constants.T_SPACESHIP, re: /^<=>/ },
              { value: r.Constants.T_IS_SMALLER_OR_EQUAL, re: /^<=/ },
              { value: r.Constants.T_SR_EQUAL, re: /^>>=/ },
              { value: r.Constants.T_SR, re: /^>>/ },
              { value: r.Constants.T_IS_GREATER_OR_EQUAL, re: /^>=/ },
              { value: r.Constants.T_OR_EQUAL, re: /^\|=/ },
              { value: r.Constants.T_PLUS_EQUAL, re: /^\+=/ },
              { value: r.Constants.T_MINUS_EQUAL, re: /^-=/ },
              {
                value: r.Constants.T_OBJECT_OPERATOR,
                re: new RegExp("^->(?=[ \n\r\t]*" + l + ")"),
                func: function () {
                  _("LOOKING_FOR_PROPERTY");
                },
              },
              { value: r.Constants.T_OBJECT_OPERATOR, re: /^->/i },
              { value: r.Constants.T_ELLIPSIS, re: /^\.\.\./ },
              { value: r.Constants.T_POW_EQUAL, re: /^\*\*=/ },
              { value: r.Constants.T_POW, re: /^\*\*/ },
              { value: r.Constants.T_COALESCE_EQUAL, re: /^\?\?=/ },
              { value: r.Constants.T_COALESCE, re: /^\?\?/ },
              { value: r.Constants.T_NULLSAFE_OBJECT_OPERATOR, re: /^\?->/ },
              {
                value: r.Constants.T_NAME_FULLY_QUALIFIED,
                re: /^\\\w+(?:\\\w+)*/,
              },
              {
                value: r.Constants.T_NAME_QUALIFIED,
                re: /^\w+\\\w+(?:\\\w+)*/,
              },
              {
                value: r.Constants.T_NAME_RELATIVE,
                re: /^namespace\\\w+(?:\\\w+)*/,
              },
              { value: r.Constants.T_NAMESPACE, re: /^namespace\b/i },
              { value: r.Constants.T_ATTRIBUTE, re: /^#\[([\S\s]*?)]/ },
              { value: r.Constants.T_COMMENT, re: /^\/\*([\S\s]*?)(?:\*\/|$)/ },
              {
                value: r.Constants.T_COMMENT,
                re: /^(?:\/\/|#)[^\r\n?]*(?:\?(?!>)[^\r\n?]*)*(?:\r\n|\r|\n)?/,
              },
              { value: r.Constants.T_IS_IDENTICAL, re: /^===/ },
              { value: r.Constants.T_IS_EQUAL, re: /^==/ },
              { value: r.Constants.T_IS_NOT_IDENTICAL, re: /^!==/ },
              { value: r.Constants.T_IS_NOT_EQUAL, re: /^(!=|<>)/ },
              {
                value: r.Constants.T_DNUMBER,
                re: /^(?:[0-9]+\.[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/,
              },
              { value: r.Constants.T_DNUMBER, re: /^[0-9]+[eE][+-]?[0-9]+/ },
              {
                value: r.Constants.T_LNUMBER,
                re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i,
              },
              { value: r.Constants.T_VARIABLE, re: new RegExp("^\\$" + l) },
              {
                value: r.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: /^[bB]?'[^'\\]*(?:\\[\s\S][^'\\]*)*'/,
              },
              {
                value: r.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: new RegExp('^[bB]?"' + C('"') + '"'),
              },
              {
                value: -1,
                re: /^[bB]?"/,
                func: function () {
                  i("DOUBLE_QUOTES");
                },
              },
              {
                value: -1,
                re: /^`/,
                func: function () {
                  i("BACKTICKS");
                },
              },
              { value: r.Constants.T_NS_SEPARATOR, re: /^\\/ },
              {
                value: r.Constants.T_STRING,
                re: /^[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/,
              },
              {
                value: -1,
                re: /^\{/,
                func: function () {
                  _("IN_SCRIPTING");
                },
              },
              {
                value: -1,
                re: /^\}/,
                func: function () {
                  a > 0 && T();
                },
              },
              { value: -1, re: /^[\[\];:?()!.,><=+-/*|&@^%"'$~]/ },
            ],
            DOUBLE_QUOTES: A.concat([
              {
                value: -1,
                re: /^"/,
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              {
                value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
                re: new RegExp("^" + C('"')),
              },
            ]),
            BACKTICKS: A.concat([
              {
                value: -1,
                re: /^`/,
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              {
                value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
                re: new RegExp("^" + C("`")),
              },
            ]),
            VAR_OFFSET: [
              {
                value: -1,
                re: /^\]/,
                func: function () {
                  T();
                },
              },
              {
                value: r.Constants.T_NUM_STRING,
                re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i,
              },
              { value: r.Constants.T_VARIABLE, re: new RegExp("^\\$" + l) },
              { value: r.Constants.T_STRING, re: new RegExp("^" + l) },
              { value: -1, re: /^[;:,.\[()|^&+-/*=%!~$<>?@{}"`]/ },
            ],
            LOOKING_FOR_PROPERTY: [
              { value: r.Constants.T_OBJECT_OPERATOR, re: /^->/ },
              {
                value: r.Constants.T_STRING,
                re: new RegExp("^" + l),
                func: function () {
                  T();
                },
              },
              { value: r.Constants.T_WHITESPACE, re: /^[ \n\r\t]+/ },
            ],
            LOOKING_FOR_VARNAME: [
              {
                value: r.Constants.T_STRING_VARNAME,
                re: new RegExp("^" + l + "(?=[\\[}])"),
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
            ],
            NOWDOC: [
              {
                value: r.Constants.T_END_HEREDOC,
                matchFunc: function (t) {
                  var e = new RegExp("^" + n + "(?=;?[\\r\\n])");
                  return t.match(e) ? [t.substr(0, n.length)] : null;
                },
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              {
                value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
                matchFunc: function (t) {
                  var e = new RegExp("[\\r\\n]" + n + "(?=;?[\\r\\n])").exec(t),
                    r = e ? e.index + 1 : t.length;
                  return [t.substring(0, r)];
                },
              },
            ],
            HEREDOC: A.concat([
              {
                value: r.Constants.T_END_HEREDOC,
                matchFunc: function (t) {
                  if (!s) return null;
                  var e = new RegExp("^" + n + "(?=;?[\\r\\n])");
                  return t.match(e) ? [t.substr(0, n.length)] : null;
                },
                func: function () {
                  i("IN_SCRIPTING");
                },
              },
              {
                value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
                matchFunc: function (t) {
                  var e = t.length,
                    r = new RegExp("^" + C("")),
                    o = r.exec(t);
                  return (
                    o && (e = o[0].length),
                    (o = (r = new RegExp(
                      "([\\r\\n])" + n + "(?=;?[\\r\\n])"
                    )).exec(t.substring(0, e)))
                      ? ((e = o.index + 1), (s = !0))
                      : (s = !1),
                    0 == e ? null : [t.substring(0, e)]
                  );
                },
              },
            ]),
          },
          h = [],
          L = 1,
          N = !0;
        if (null === t) return h;
        for (
          "string" !== typeof t && (t = t.toString());
          t.length > 0 && !0 === N;

        ) {
          N = c[o[a]].some(function (e) {
            var n = void 0 !== e.matchFunc ? e.matchFunc(t) : t.match(e.re);
            if (null !== n) {
              if (0 == n[0].length) throw new Error("empty match");
              if ((void 0 !== e.func && e.func(n), -1 === e.value))
                h.push(n[0]);
              else {
                var r = n[0];
                h.push([parseInt(e.value, 10), r, L]),
                  (L += r.split("\n").length - 1);
              }
              return (t = t.substring(n[0].length)), !0;
            }
            return !1;
          });
        }
        return h;
      }),
      (r.Parser = function (t, e) {
        var n = this.yybase,
          s = this.yydefault,
          o = this.yycheck,
          a = this.yyaction,
          i = this.yylen,
          _ = this.yygbase,
          T = this.yygcheck,
          u = this.yyp,
          E = this.yygoto,
          p = this.yylhs,
          l = this.terminals,
          C = this.translate,
          A = this.yygdefault;
        (this.pos = -1),
          (this.line = 1),
          (this.tokenMap = this.createTokenMap()),
          (this.dropTokens = {}),
          (this.dropTokens[r.Constants.T_WHITESPACE] = 1),
          (this.dropTokens[r.Constants.T_OPEN_TAG] = 1);
        var c = [];
        t.forEach(function (t, e) {
          "object" === typeof t && t[0] === r.Constants.T_OPEN_TAG_WITH_ECHO
            ? (c.push([r.Constants.T_OPEN_TAG, t[1], t[2]]),
              c.push([r.Constants.T_ECHO, t[1], t[2]]))
            : c.push(t);
        }),
          (this.tokens = c);
        var h = this.TOKEN_NONE;
        (this.startAttributes = { startLine: 1 }), (this.endAttributes = {});
        var L,
          N,
          R = [this.startAttributes],
          O = 0,
          f = [O];
        for (this.yyastk = [], this.stackPos = 0; ; ) {
          if (0 === n[O]) L = s[O];
          else if (
            (h === this.TOKEN_NONE &&
              ((h =
                (N = this.getNextToken()) >= 0 && N < this.TOKEN_MAP_SIZE
                  ? C[N]
                  : this.TOKEN_INVALID),
              (R[this.stackPos] = this.startAttributes)),
            (((L = n[O] + h) >= 0 && L < this.YYLAST && o[L] === h) ||
              (O < this.YY2TBLSTATE &&
                (L = n[O + this.YYNLSTATES] + h) >= 0 &&
                L < this.YYLAST &&
                o[L] === h)) &&
              (L = a[L]) !== this.YYDEFAULT)
          )
            if (L > 0) {
              if (
                (++this.stackPos,
                (f[this.stackPos] = O = L),
                (this.yyastk[this.stackPos] = this.tokenValue),
                (R[this.stackPos] = this.startAttributes),
                (h = this.TOKEN_NONE),
                L < this.YYNLSTATES)
              )
                continue;
              L -= this.YYNLSTATES;
            } else L = -L;
          else L = s[O];
          for (;;) {
            if (0 === L) return this.yyval;
            if (L === this.YYUNEXPECTED) {
              if (!0 !== e) {
                for (var I = [], S = 0; S < this.TOKEN_MAP_SIZE; ++S)
                  if (
                    (((L = n[O] + S) >= 0 && L < this.YYLAST && o[L] == S) ||
                      (O < this.YY2TBLSTATE &&
                        (L = n[O + this.YYNLSTATES] + S) &&
                        L < this.YYLAST &&
                        o[L] == S)) &&
                    a[L] != this.YYUNEXPECTED
                  ) {
                    if (4 == I.length) {
                      I = [];
                      break;
                    }
                    I.push(this.terminals[S]);
                  }
                var P = "";
                throw (
                  (I.length && (P = ", expecting " + I.join(" or ")),
                  new r.ParseError(
                    "syntax error, unexpected " + l[h] + P,
                    this.startAttributes.startLine
                  ))
                );
              }
              return this.startAttributes.startLine;
            }
            for (var y in this.endAttributes)
              R[this.stackPos - i[L]][y] = this.endAttributes[y];
            if (
              ((this.stackPos -= i[L]),
              (O =
                (u = _[(L = p[L])] + f[this.stackPos]) >= 0 &&
                u < this.YYGLAST &&
                T[u] === L
                  ? E[u]
                  : A[L]),
              ++this.stackPos,
              (f[this.stackPos] = O),
              (this.yyastk[this.stackPos] = this.yyval),
              (R[this.stackPos] = this.startAttributes),
              O < this.YYNLSTATES)
            )
              break;
            L = O - this.YYNLSTATES;
          }
        }
      }),
      (r.ParseError = function (t, e) {
        (this.message = t), (this.line = e);
      }),
      (r.Parser.prototype.getNextToken = function () {
        var t, e;
        for (
          this.startAttributes = {}, this.endAttributes = {};
          void 0 !== this.tokens[++this.pos];

        ) {
          if ("string" === typeof (t = this.tokens[this.pos]))
            return (
              (this.startAttributes.startLine = this.line),
              (this.endAttributes.endLine = this.line),
              'b"' === t
                ? ((this.tokenValue = 'b"'), '"'.charCodeAt(0))
                : ((this.tokenValue = t), t.charCodeAt(0))
            );
          if (
            ((this.line += null === (e = t[1].match(/\n/g)) ? 0 : e.length),
            r.Constants.T_COMMENT === t[0])
          )
            Array.isArray(this.startAttributes.comments) ||
              (this.startAttributes.comments = []),
              this.startAttributes.comments.push({
                type: "comment",
                comment: t[1],
                line: t[2],
              });
          else if (r.Constants.T_ATTRIBUTE === t[0])
            (this.tokenValue = t[1]),
              (this.startAttributes.startLine = t[2]),
              (this.endAttributes.endLine = this.line);
          else if (r.Constants.T_DOC_COMMENT === t[0])
            this.startAttributes.comments.push(
              new PHPParser_Comment_Doc(t[1], t[2])
            );
          else if (void 0 === this.dropTokens[t[0]])
            return (
              (this.tokenValue = t[1]),
              (this.startAttributes.startLine = t[2]),
              (this.endAttributes.endLine = this.line),
              this.tokenMap[t[0]]
            );
        }
        return (this.startAttributes.startLine = this.line), 0;
      }),
      (r.Parser.prototype.tokenName = function (t) {
        var e = "UNKNOWN";
        return (
          [
            "T_THROW",
            "T_INCLUDE",
            "T_INCLUDE_ONCE",
            "T_EVAL",
            "T_REQUIRE",
            "T_REQUIRE_ONCE",
            "T_LOGICAL_OR",
            "T_LOGICAL_XOR",
            "T_LOGICAL_AND",
            "T_PRINT",
            "T_YIELD",
            "T_DOUBLE_ARROW",
            "T_YIELD_FROM",
            "T_PLUS_EQUAL",
            "T_MINUS_EQUAL",
            "T_MUL_EQUAL",
            "T_DIV_EQUAL",
            "T_CONCAT_EQUAL",
            "T_MOD_EQUAL",
            "T_AND_EQUAL",
            "T_OR_EQUAL",
            "T_XOR_EQUAL",
            "T_SL_EQUAL",
            "T_SR_EQUAL",
            "T_POW_EQUAL",
            "T_COALESCE_EQUAL",
            "T_COALESCE",
            "T_BOOLEAN_OR",
            "T_BOOLEAN_AND",
            "T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG",
            "T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG",
            "T_IS_EQUAL",
            "T_IS_NOT_EQUAL",
            "T_IS_IDENTICAL",
            "T_IS_NOT_IDENTICAL",
            "T_SPACESHIP",
            "T_IS_SMALLER_OR_EQUAL",
            "T_IS_GREATER_OR_EQUAL",
            "T_SL",
            "T_SR",
            "T_INSTANCEOF",
            "T_INC",
            "T_DEC",
            "T_INT_CAST",
            "T_DOUBLE_CAST",
            "T_STRING_CAST",
            "T_ARRAY_CAST",
            "T_OBJECT_CAST",
            "T_BOOL_CAST",
            "T_UNSET_CAST",
            "T_POW",
            "T_NEW",
            "T_CLONE",
            "T_EXIT",
            "T_IF",
            "T_ELSEIF",
            "T_ELSE",
            "T_ENDIF",
            "T_LNUMBER",
            "T_DNUMBER",
            "T_STRING",
            "T_STRING_VARNAME",
            "T_VARIABLE",
            "T_NUM_STRING",
            "T_INLINE_HTML",
            "T_ENCAPSED_AND_WHITESPACE",
            "T_CONSTANT_ENCAPSED_STRING",
            "T_ECHO",
            "T_DO",
            "T_WHILE",
            "T_ENDWHILE",
            "T_FOR",
            "T_ENDFOR",
            "T_FOREACH",
            "T_ENDFOREACH",
            "T_DECLARE",
            "T_ENDDECLARE",
            "T_AS",
            "T_SWITCH",
            "T_MATCH",
            "T_ENDSWITCH",
            "T_CASE",
            "T_DEFAULT",
            "T_BREAK",
            "T_CONTINUE",
            "T_GOTO",
            "T_FUNCTION",
            "T_FN",
            "T_CONST",
            "T_RETURN",
            "T_TRY",
            "T_CATCH",
            "T_FINALLY",
            "T_THROW",
            "T_USE",
            "T_INSTEADOF",
            "T_GLOBAL",
            "T_STATIC",
            "T_ABSTRACT",
            "T_FINAL",
            "T_PRIVATE",
            "T_PROTECTED",
            "T_PUBLIC",
            "T_READONLY",
            "T_VAR",
            "T_UNSET",
            "T_ISSET",
            "T_EMPTY",
            "T_HALT_COMPILER",
            "T_CLASS",
            "T_TRAIT",
            "T_INTERFACE",
            "T_ENUM",
            "T_EXTENDS",
            "T_IMPLEMENTS",
            "T_OBJECT_OPERATOR",
            "T_NULLSAFE_OBJECT_OPERATOR",
            "T_DOUBLE_ARROW",
            "T_LIST",
            "T_ARRAY",
            "T_CALLABLE",
            "T_CLASS_C",
            "T_TRAIT_C",
            "T_METHOD_C",
            "T_FUNC_C",
            "T_LINE",
            "T_FILE",
            "T_START_HEREDOC",
            "T_END_HEREDOC",
            "T_DOLLAR_OPEN_CURLY_BRACES",
            "T_CURLY_OPEN",
            "T_PAAMAYIM_NEKUDOTAYIM",
            "T_NAMESPACE",
            "T_NS_C",
            "T_DIR",
            "T_NS_SEPARATOR",
            "T_ELLIPSIS",
            "T_NAME_FULLY_QUALIFIED",
            "T_NAME_QUALIFIED",
            "T_NAME_RELATIVE",
            "T_ATTRIBUTE",
            "T_ENUM",
            "T_BAD_CHARACTER",
            "T_COMMENT",
            "T_DOC_COMMENT",
            "T_OPEN_TAG",
            "T_OPEN_TAG_WITH_ECHO",
            "T_CLOSE_TAG",
            "T_WHITESPACE",
          ].some(function (n) {
            return r.Constants[n] === t && ((e = n), !0);
          }),
          e
        );
      }),
      (r.Parser.prototype.createTokenMap = function () {
        var t,
          e,
          n = {};
        for (e = 256; e < 1e3; ++e)
          r.Constants.T_OPEN_TAG_WITH_ECHO === e
            ? (n[e] = r.Constants.T_ECHO)
            : r.Constants.T_CLOSE_TAG === e
            ? (n[e] = 59)
            : "UNKNOWN" !== (t = this.tokenName(e)) && (n[e] = this[t]);
        return n;
      }),
      (r.Parser.prototype.TOKEN_NONE = -1),
      (r.Parser.prototype.TOKEN_INVALID = 175),
      (r.Parser.prototype.TOKEN_MAP_SIZE = 403),
      (r.Parser.prototype.YYLAST = 1196),
      (r.Parser.prototype.YY2TBLSTATE = 420),
      (r.Parser.prototype.YYGLAST = 545),
      (r.Parser.prototype.YYNLSTATES = 710),
      (r.Parser.prototype.YYUNEXPECTED = 32767),
      (r.Parser.prototype.YYDEFAULT = -32766),
      (r.Parser.prototype.YYERRTOK = 256),
      (r.Parser.prototype.T_THROW = 257),
      (r.Parser.prototype.T_INCLUDE = 258),
      (r.Parser.prototype.T_INCLUDE_ONCE = 259),
      (r.Parser.prototype.T_EVAL = 260),
      (r.Parser.prototype.T_REQUIRE = 261),
      (r.Parser.prototype.T_REQUIRE_ONCE = 262),
      (r.Parser.prototype.T_LOGICAL_OR = 263),
      (r.Parser.prototype.T_LOGICAL_XOR = 264),
      (r.Parser.prototype.T_LOGICAL_AND = 265),
      (r.Parser.prototype.T_PRINT = 266),
      (r.Parser.prototype.T_YIELD = 267),
      (r.Parser.prototype.T_DOUBLE_ARROW = 268),
      (r.Parser.prototype.T_YIELD_FROM = 269),
      (r.Parser.prototype.T_PLUS_EQUAL = 270),
      (r.Parser.prototype.T_MINUS_EQUAL = 271),
      (r.Parser.prototype.T_MUL_EQUAL = 272),
      (r.Parser.prototype.T_DIV_EQUAL = 273),
      (r.Parser.prototype.T_CONCAT_EQUAL = 274),
      (r.Parser.prototype.T_MOD_EQUAL = 275),
      (r.Parser.prototype.T_AND_EQUAL = 276),
      (r.Parser.prototype.T_OR_EQUAL = 277),
      (r.Parser.prototype.T_XOR_EQUAL = 278),
      (r.Parser.prototype.T_SL_EQUAL = 279),
      (r.Parser.prototype.T_SR_EQUAL = 280),
      (r.Parser.prototype.T_POW_EQUAL = 281),
      (r.Parser.prototype.T_COALESCE_EQUAL = 282),
      (r.Parser.prototype.T_COALESCE = 283),
      (r.Parser.prototype.T_BOOLEAN_OR = 284),
      (r.Parser.prototype.T_BOOLEAN_AND = 285),
      (r.Parser.prototype.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG = 286),
      (r.Parser.prototype.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG = 287),
      (r.Parser.prototype.T_IS_EQUAL = 288),
      (r.Parser.prototype.T_IS_NOT_EQUAL = 289),
      (r.Parser.prototype.T_IS_IDENTICAL = 290),
      (r.Parser.prototype.T_IS_NOT_IDENTICAL = 291),
      (r.Parser.prototype.T_SPACESHIP = 292),
      (r.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 293),
      (r.Parser.prototype.T_IS_GREATER_OR_EQUAL = 294),
      (r.Parser.prototype.T_SL = 295),
      (r.Parser.prototype.T_SR = 296),
      (r.Parser.prototype.T_INSTANCEOF = 297),
      (r.Parser.prototype.T_INC = 298),
      (r.Parser.prototype.T_DEC = 299),
      (r.Parser.prototype.T_INT_CAST = 300),
      (r.Parser.prototype.T_DOUBLE_CAST = 301),
      (r.Parser.prototype.T_STRING_CAST = 302),
      (r.Parser.prototype.T_ARRAY_CAST = 303),
      (r.Parser.prototype.T_OBJECT_CAST = 304),
      (r.Parser.prototype.T_BOOL_CAST = 305),
      (r.Parser.prototype.T_UNSET_CAST = 306),
      (r.Parser.prototype.T_POW = 307),
      (r.Parser.prototype.T_NEW = 308),
      (r.Parser.prototype.T_CLONE = 309),
      (r.Parser.prototype.T_EXIT = 310),
      (r.Parser.prototype.T_IF = 311),
      (r.Parser.prototype.T_ELSEIF = 312),
      (r.Parser.prototype.T_ELSE = 313),
      (r.Parser.prototype.T_ENDIF = 314),
      (r.Parser.prototype.T_LNUMBER = 315),
      (r.Parser.prototype.T_DNUMBER = 316),
      (r.Parser.prototype.T_STRING = 317),
      (r.Parser.prototype.T_STRING_VARNAME = 318),
      (r.Parser.prototype.T_VARIABLE = 319),
      (r.Parser.prototype.T_NUM_STRING = 320),
      (r.Parser.prototype.T_INLINE_HTML = 321),
      (r.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 322),
      (r.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 323),
      (r.Parser.prototype.T_ECHO = 324),
      (r.Parser.prototype.T_DO = 325),
      (r.Parser.prototype.T_WHILE = 326),
      (r.Parser.prototype.T_ENDWHILE = 327),
      (r.Parser.prototype.T_FOR = 328),
      (r.Parser.prototype.T_ENDFOR = 329),
      (r.Parser.prototype.T_FOREACH = 330),
      (r.Parser.prototype.T_ENDFOREACH = 331),
      (r.Parser.prototype.T_DECLARE = 332),
      (r.Parser.prototype.T_ENDDECLARE = 333),
      (r.Parser.prototype.T_AS = 334),
      (r.Parser.prototype.T_SWITCH = 335),
      (r.Parser.prototype.T_MATCH = 336),
      (r.Parser.prototype.T_ENDSWITCH = 337),
      (r.Parser.prototype.T_CASE = 338),
      (r.Parser.prototype.T_DEFAULT = 339),
      (r.Parser.prototype.T_BREAK = 340),
      (r.Parser.prototype.T_CONTINUE = 341),
      (r.Parser.prototype.T_GOTO = 342),
      (r.Parser.prototype.T_FUNCTION = 343),
      (r.Parser.prototype.T_FN = 344),
      (r.Parser.prototype.T_CONST = 345),
      (r.Parser.prototype.T_RETURN = 346),
      (r.Parser.prototype.T_TRY = 347),
      (r.Parser.prototype.T_CATCH = 348),
      (r.Parser.prototype.T_FINALLY = 349),
      (r.Parser.prototype.T_USE = 350),
      (r.Parser.prototype.T_INSTEADOF = 351),
      (r.Parser.prototype.T_GLOBAL = 352),
      (r.Parser.prototype.T_STATIC = 353),
      (r.Parser.prototype.T_ABSTRACT = 354),
      (r.Parser.prototype.T_FINAL = 355),
      (r.Parser.prototype.T_PRIVATE = 356),
      (r.Parser.prototype.T_PROTECTED = 357),
      (r.Parser.prototype.T_PUBLIC = 358),
      (r.Parser.prototype.T_READONLY = 359),
      (r.Parser.prototype.T_VAR = 360),
      (r.Parser.prototype.T_UNSET = 361),
      (r.Parser.prototype.T_ISSET = 362),
      (r.Parser.prototype.T_EMPTY = 363),
      (r.Parser.prototype.T_HALT_COMPILER = 364),
      (r.Parser.prototype.T_CLASS = 365),
      (r.Parser.prototype.T_TRAIT = 366),
      (r.Parser.prototype.T_INTERFACE = 367),
      (r.Parser.prototype.T_ENUM = 368),
      (r.Parser.prototype.T_EXTENDS = 369),
      (r.Parser.prototype.T_IMPLEMENTS = 370),
      (r.Parser.prototype.T_OBJECT_OPERATOR = 371),
      (r.Parser.prototype.T_NULLSAFE_OBJECT_OPERATOR = 372),
      (r.Parser.prototype.T_LIST = 373),
      (r.Parser.prototype.T_ARRAY = 374),
      (r.Parser.prototype.T_CALLABLE = 375),
      (r.Parser.prototype.T_CLASS_C = 376),
      (r.Parser.prototype.T_TRAIT_C = 377),
      (r.Parser.prototype.T_METHOD_C = 378),
      (r.Parser.prototype.T_FUNC_C = 379),
      (r.Parser.prototype.T_LINE = 380),
      (r.Parser.prototype.T_FILE = 381),
      (r.Parser.prototype.T_START_HEREDOC = 382),
      (r.Parser.prototype.T_END_HEREDOC = 383),
      (r.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 384),
      (r.Parser.prototype.T_CURLY_OPEN = 385),
      (r.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 386),
      (r.Parser.prototype.T_NAMESPACE = 387),
      (r.Parser.prototype.T_NS_C = 388),
      (r.Parser.prototype.T_DIR = 389),
      (r.Parser.prototype.T_NS_SEPARATOR = 390),
      (r.Parser.prototype.T_ELLIPSIS = 391),
      (r.Parser.prototype.T_NAME_FULLY_QUALIFIED = 392),
      (r.Parser.prototype.T_NAME_QUALIFIED = 393),
      (r.Parser.prototype.T_NAME_RELATIVE = 394),
      (r.Parser.prototype.T_ATTRIBUTE = 395),
      (r.Parser.prototype.T_BAD_CHARACTER = 396),
      (r.Parser.prototype.T_COMMENT = 397),
      (r.Parser.prototype.T_DOC_COMMENT = 398),
      (r.Parser.prototype.T_OPEN_TAG = 399),
      (r.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 400),
      (r.Parser.prototype.T_CLOSE_TAG = 401),
      (r.Parser.prototype.T_WHITESPACE = 402),
      (r.Parser.prototype.terminals = [
        "EOF",
        "error",
        "T_THROW",
        "T_INCLUDE",
        "T_INCLUDE_ONCE",
        "T_EVAL",
        "T_REQUIRE",
        "T_REQUIRE_ONCE",
        "','",
        "T_LOGICAL_OR",
        "T_LOGICAL_XOR",
        "T_LOGICAL_AND",
        "T_PRINT",
        "T_YIELD",
        "T_DOUBLE_ARROW",
        "T_YIELD_FROM",
        "'='",
        "T_PLUS_EQUAL",
        "T_MINUS_EQUAL",
        "T_MUL_EQUAL",
        "T_DIV_EQUAL",
        "T_CONCAT_EQUAL",
        "T_MOD_EQUAL",
        "T_AND_EQUAL",
        "T_OR_EQUAL",
        "T_XOR_EQUAL",
        "T_SL_EQUAL",
        "T_SR_EQUAL",
        "T_POW_EQUAL",
        "T_COALESCE_EQUAL",
        "'?'",
        "':'",
        "T_COALESCE",
        "T_BOOLEAN_OR",
        "T_BOOLEAN_AND",
        "'|'",
        "'^'",
        "T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG",
        "T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG",
        "T_IS_EQUAL",
        "T_IS_NOT_EQUAL",
        "T_IS_IDENTICAL",
        "T_IS_NOT_IDENTICAL",
        "T_SPACESHIP",
        "'<'",
        "T_IS_SMALLER_OR_EQUAL",
        "'>'",
        "T_IS_GREATER_OR_EQUAL",
        "T_SL",
        "T_SR",
        "'+'",
        "'-'",
        "'.'",
        "'*'",
        "'/'",
        "'%'",
        "'!'",
        "T_INSTANCEOF",
        "'~'",
        "T_INC",
        "T_DEC",
        "T_INT_CAST",
        "T_DOUBLE_CAST",
        "T_STRING_CAST",
        "T_ARRAY_CAST",
        "T_OBJECT_CAST",
        "T_BOOL_CAST",
        "T_UNSET_CAST",
        "'@'",
        "T_POW",
        "'['",
        "T_NEW",
        "T_CLONE",
        "T_EXIT",
        "T_IF",
        "T_ELSEIF",
        "T_ELSE",
        "T_ENDIF",
        "T_LNUMBER",
        "T_DNUMBER",
        "T_STRING",
        "T_STRING_VARNAME",
        "T_VARIABLE",
        "T_NUM_STRING",
        "T_INLINE_HTML",
        "T_ENCAPSED_AND_WHITESPACE",
        "T_CONSTANT_ENCAPSED_STRING",
        "T_ECHO",
        "T_DO",
        "T_WHILE",
        "T_ENDWHILE",
        "T_FOR",
        "T_ENDFOR",
        "T_FOREACH",
        "T_ENDFOREACH",
        "T_DECLARE",
        "T_ENDDECLARE",
        "T_AS",
        "T_SWITCH",
        "T_MATCH",
        "T_ENDSWITCH",
        "T_CASE",
        "T_DEFAULT",
        "T_BREAK",
        "T_CONTINUE",
        "T_GOTO",
        "T_FUNCTION",
        "T_FN",
        "T_CONST",
        "T_RETURN",
        "T_TRY",
        "T_CATCH",
        "T_FINALLY",
        "T_USE",
        "T_INSTEADOF",
        "T_GLOBAL",
        "T_STATIC",
        "T_ABSTRACT",
        "T_FINAL",
        "T_PRIVATE",
        "T_PROTECTED",
        "T_PUBLIC",
        "T_READONLY",
        "T_VAR",
        "T_UNSET",
        "T_ISSET",
        "T_EMPTY",
        "T_HALT_COMPILER",
        "T_CLASS",
        "T_TRAIT",
        "T_INTERFACE",
        "T_ENUM",
        "T_EXTENDS",
        "T_IMPLEMENTS",
        "T_OBJECT_OPERATOR",
        "T_NULLSAFE_OBJECT_OPERATOR",
        "T_LIST",
        "T_ARRAY",
        "T_CALLABLE",
        "T_CLASS_C",
        "T_TRAIT_C",
        "T_METHOD_C",
        "T_FUNC_C",
        "T_LINE",
        "T_FILE",
        "T_START_HEREDOC",
        "T_END_HEREDOC",
        "T_DOLLAR_OPEN_CURLY_BRACES",
        "T_CURLY_OPEN",
        "T_PAAMAYIM_NEKUDOTAYIM",
        "T_NAMESPACE",
        "T_NS_C",
        "T_DIR",
        "T_NS_SEPARATOR",
        "T_ELLIPSIS",
        "T_NAME_FULLY_QUALIFIED",
        "T_NAME_QUALIFIED",
        "T_NAME_RELATIVE",
        "T_ATTRIBUTE",
        "';'",
        "']'",
        "'{'",
        "'}'",
        "'('",
        "')'",
        "'`'",
        "'\"'",
        "'$'",
        "T_BAD_CHARACTER",
        "T_COMMENT",
        "T_DOC_COMMENT",
        "T_OPEN_TAG",
        "T_OPEN_TAG_WITH_ECHO",
        "T_CLOSE_TAG",
        "T_WHITESPACE",
        "???",
      ]),
      (r.Parser.prototype.translate = [
        0, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 56, 166, 175, 167, 55, 175, 175, 163, 164, 53, 50,
        8, 51, 52, 54, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 31,
        159, 44, 16, 46, 30, 68, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 70, 175, 160, 36, 175, 165, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 161, 35, 162, 58, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175,
        175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 175, 1, 2, 3, 4,
        5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 45, 47, 48, 49,
        57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
        111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
        125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
        139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152,
        153, 154, 155, 156, 157, 158, 168, 169, 170, 171, 172, 173, 174,
      ]),
      (r.Parser.prototype.yyaction = [
        132, 133, 134, 569, 135, 136, 0, 722, 723, 724, 137, 37, 834, 911, 835,
        469, -32766, -32766, -32766, -32767, -32767, -32767, -32767, 101, 102,
        103, 104, 105, 1068, 1069, 1070, 1067, 1066, 1065, 1071, 716, 715,
        -32766, -32766, -32766, -32766, -32766, -32766, -32766, -32766, -32766,
        -32767, -32767, -32767, -32767, -32767, 545, 546, -32766, -32766, 725,
        -32766, -32766, -32766, 998, 999, 806, 922, 447, 448, 449, 370, 371, 2,
        267, 138, 396, 729, 730, 731, 732, 414, -32766, 420, -32766, -32766,
        -32766, -32766, -32766, 990, 733, 734, 735, 736, 737, 738, 739, 740,
        741, 742, 743, 763, 570, 764, 765, 766, 767, 755, 756, 336, 337, 758,
        759, 744, 745, 746, 748, 749, 750, 346, 790, 791, 792, 793, 794, 795,
        751, 752, 571, 572, 784, 775, 773, 774, 787, 770, 771, 283, 420, 573,
        574, 769, 575, 576, 577, 578, 579, 580, 598, -575, 470, 14, 798, 772,
        581, 582, -575, 139, -32766, -32766, -32766, 132, 133, 134, 569, 135,
        136, 1017, 722, 723, 724, 137, 37, 1060, -32766, -32766, -32766, 1303,
        696, -32766, 1304, -32766, -32766, -32766, -32766, -32766, -32766,
        -32766, 1068, 1069, 1070, 1067, 1066, 1065, 1071, -32766, 716, 715, 372,
        371, 1258, -32766, -32766, -32766, -572, 106, 107, 108, 414, 270, 891,
        -572, 240, 1193, 1192, 1194, 725, -32766, -32766, -32766, 1046, 109,
        -32766, -32766, -32766, -32766, 986, 985, 984, 987, 267, 138, 396, 729,
        730, 731, 732, 12, -32766, 420, -32766, -32766, -32766, -32766, 998,
        999, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 763, 570,
        764, 765, 766, 767, 755, 756, 336, 337, 758, 759, 744, 745, 746, 748,
        749, 750, 346, 790, 791, 792, 793, 794, 795, 751, 752, 571, 572, 784,
        775, 773, 774, 787, 770, 771, 881, 321, 573, 574, 769, 575, 576, 577,
        578, 579, 580, -32766, 82, 83, 84, -575, 772, 581, 582, -575, 148, 747,
        717, 718, 719, 720, 721, 1278, 722, 723, 724, 760, 761, 36, 1277, 85,
        86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102,
        103, 104, 105, 106, 107, 108, 996, 270, 150, -32766, -32766, -32766,
        455, 456, 81, 34, -264, -572, 1016, 109, 320, -572, 893, 725, 682, 803,
        128, 998, 999, 592, -32766, 1044, -32766, -32766, -32766, 809, 151, 726,
        727, 728, 729, 730, 731, 732, -88, 1198, 796, 278, -526, 283, -32766,
        -32766, -32766, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743,
        763, 786, 764, 765, 766, 767, 755, 756, 757, 785, 758, 759, 744, 745,
        746, 748, 749, 750, 789, 790, 791, 792, 793, 794, 795, 751, 752, 753,
        754, 784, 775, 773, 774, 787, 770, 771, 144, 804, 762, 768, 769, 776,
        777, 779, 778, 780, 781, -314, -526, -526, -193, -192, 772, 783, 782,
        49, 50, 51, 500, 52, 53, 239, 807, -526, -86, 54, 55, -111, 56, 996,
        253, -32766, -111, 800, -111, -526, 541, -532, -352, 300, -352, 304,
        -111, -111, -111, -111, -111, -111, -111, -111, 998, 999, 998, 999, 153,
        -32766, -32766, -32766, 1191, 807, 126, 306, 1293, 57, 58, 103, 104,
        105, -111, 59, 1218, 60, 246, 247, 61, 62, 63, 64, 65, 66, 67, 68, -525,
        27, 268, 69, 436, 501, -328, 808, -86, 1224, 1225, 502, 1189, 807, 1198,
        1230, 293, 1222, 41, 24, 503, 74, 504, 953, 505, 320, 506, 802, 154,
        507, 508, 279, 684, 280, 43, 44, 437, 367, 366, 891, 45, 509, 35, 249,
        -16, -566, 358, 332, 318, -566, 1198, 1193, 1192, 1194, -527, 510, 511,
        512, 333, -524, 1274, 48, 716, 715, -525, -525, 334, 513, 514, 807,
        1212, 1213, 1214, 1215, 1209, 1210, 292, 360, 284, -525, 285, -314,
        1216, 1211, -193, -192, 1193, 1192, 1194, 293, 891, -525, 364, -531, 70,
        807, 316, 317, 320, 31, 110, 111, 112, 113, 114, 115, 116, 117, 118,
        119, 120, 121, 122, -153, -153, -153, 638, 25, -527, -527, 687, 379,
        881, -524, -524, 296, 297, 891, -153, 432, -153, 807, -153, -527, -153,
        716, 715, 433, -524, 798, 363, -111, 1105, 1107, 365, -527, 434, 891,
        140, 435, -524, 954, 127, -524, 320, -111, -111, 688, 813, 381, -529,
        11, 834, 155, 835, 867, -111, -111, -111, -111, 47, 293, -32766, 881,
        654, 655, 74, 689, 1191, 1045, 320, 708, 149, 399, 157, -32766, -32766,
        -32766, 32, -32766, -79, -32766, 123, -32766, 716, 715, -32766, 893,
        891, 682, -153, -32766, -32766, -32766, 716, 715, 891, -32766, -32766,
        124, 881, 129, 74, -32766, 411, 130, 320, -524, -524, 143, 141, -75,
        -32766, 158, -529, -529, 320, 27, 691, 159, 881, 160, -524, 161, 294,
        295, 698, 368, 369, 807, -73, -32766, -72, 1222, -524, 373, 374, 1191,
        893, -71, 682, -529, 73, -70, -32766, -32766, -32766, -69, -32766, -68,
        -32766, 125, -32766, 630, 631, -32766, -67, -66, -47, -51, -32766,
        -32766, -32766, -18, 147, 271, -32766, -32766, 277, 697, 700, 881,
        -32766, 411, 890, 893, 146, 682, 282, 881, 907, -32766, 281, 513, 514,
        286, 1212, 1213, 1214, 1215, 1209, 1210, 326, 131, 145, 939, 287, 682,
        1216, 1211, 109, 270, -32766, 798, 807, -32766, 662, 639, 1191, 657, 72,
        675, 1075, 317, 320, -32766, -32766, -32766, 1305, -32766, 301, -32766,
        628, -32766, 431, 543, -32766, -32766, 923, 555, 924, -32766, -32766,
        -32766, 1229, 549, -32766, -32766, -32766, -4, 891, -490, 1191, -32766,
        411, 644, 893, 299, 682, -32766, -32766, -32766, -32766, -32766, 893,
        -32766, 682, -32766, 13, 1231, -32766, 452, 480, 645, 909, -32766,
        -32766, -32766, -32766, 658, -480, -32766, -32766, 0, 1191, 0, 0,
        -32766, 411, 0, 298, -32766, -32766, -32766, 305, -32766, -32766,
        -32766, 0, -32766, 0, 806, -32766, 0, 0, 0, 475, -32766, -32766, -32766,
        -32766, 0, 7, -32766, -32766, 16, 1191, 561, 596, -32766, 411, 1219,
        891, -32766, -32766, -32766, 362, -32766, -32766, -32766, 818, -32766,
        -267, 881, -32766, 39, 293, 0, 0, -32766, -32766, -32766, 40, 705, 706,
        -32766, -32766, 872, 963, 940, 947, -32766, 411, 937, 948, 365, 870,
        427, 891, 935, -32766, 1049, 291, 1244, 1052, 1053, -111, -111, 1050,
        1051, 1057, -560, 1262, 1296, 633, 0, 826, -111, -111, -111, -111, 33,
        315, -32766, 361, 683, 686, 690, 692, 1191, 693, 694, 695, 699, 685,
        320, -32766, -32766, -32766, 9, -32766, 702, -32766, 868, -32766, 881,
        1300, -32766, 893, 1302, 682, -4, -32766, -32766, -32766, 829, 828, 837,
        -32766, -32766, 916, -242, -242, -242, -32766, 411, 955, 365, 27, 836,
        1301, 915, 917, -32766, 914, 1177, 900, 910, -111, -111, 807, 881, 898,
        945, 1222, 946, 1299, 1256, 867, -111, -111, -111, -111, 1245, 1263,
        1269, 1272, -241, -241, -241, -558, -532, -531, 365, -530, 1, 28, 29,
        38, 42, 46, 71, 0, 75, -111, -111, 76, 77, 78, 79, 893, 80, 682, -242,
        867, -111, -111, -111, -111, 142, 152, 156, 245, 322, 347, 514, 348,
        1212, 1213, 1214, 1215, 1209, 1210, 349, 350, 351, 352, 353, 354, 1216,
        1211, 355, 356, 357, 359, 428, 893, -265, 682, -241, -264, 72, 0, 18,
        317, 320, 19, 20, 21, 23, 398, 471, 472, 479, 482, 483, 484, 485, 489,
        490, 491, 498, 669, 1202, 1145, 1220, 1019, 1018, 1181, -269, -103, 17,
        22, 26, 290, 397, 589, 593, 620, 674, 1149, 1197, 1146, 1275, 0, -494,
        1162, 0, 1223,
      ]),
      (r.Parser.prototype.yycheck = [
        2, 3, 4, 5, 6, 7, 0, 9, 10, 11, 12, 13, 106, 1, 108, 31, 9, 10, 11, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 116, 117, 118, 119, 120, 121, 122, 37,
        38, 30, 116, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 117, 118,
        9, 10, 57, 9, 10, 11, 137, 138, 155, 128, 129, 130, 131, 106, 107, 8,
        71, 72, 73, 74, 75, 76, 77, 116, 30, 80, 32, 33, 34, 35, 36, 1, 87, 88,
        89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
        105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
        119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132,
        133, 30, 80, 136, 137, 138, 139, 140, 141, 142, 143, 144, 51, 1, 161,
        101, 80, 150, 151, 152, 8, 154, 9, 10, 11, 2, 3, 4, 5, 6, 7, 164, 9, 10,
        11, 12, 13, 123, 9, 10, 11, 80, 161, 30, 83, 32, 33, 34, 35, 36, 37, 38,
        116, 117, 118, 119, 120, 121, 122, 30, 37, 38, 106, 107, 1, 9, 10, 11,
        1, 53, 54, 55, 116, 57, 1, 8, 14, 155, 156, 157, 57, 9, 10, 11, 162, 69,
        30, 116, 32, 33, 119, 120, 121, 122, 71, 72, 73, 74, 75, 76, 77, 8, 30,
        80, 32, 33, 34, 35, 137, 138, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
        112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
        126, 127, 128, 129, 130, 131, 132, 133, 84, 70, 136, 137, 138, 139, 140,
        141, 142, 143, 144, 9, 9, 10, 11, 160, 150, 151, 152, 164, 154, 2, 3, 4,
        5, 6, 7, 1, 9, 10, 11, 12, 13, 30, 8, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 116, 57,
        14, 9, 10, 11, 134, 135, 161, 8, 164, 160, 1, 69, 167, 164, 159, 57,
        161, 80, 8, 137, 138, 1, 30, 1, 32, 33, 34, 1, 14, 71, 72, 73, 74, 75,
        76, 77, 31, 1, 80, 30, 70, 30, 9, 10, 11, 87, 88, 89, 90, 91, 92, 93,
        94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
        109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
        123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 8, 156, 136, 137,
        138, 139, 140, 141, 142, 143, 144, 8, 134, 135, 8, 8, 150, 151, 152, 2,
        3, 4, 5, 6, 7, 97, 82, 149, 31, 12, 13, 101, 15, 116, 8, 116, 106, 80,
        108, 161, 85, 163, 106, 113, 108, 8, 116, 117, 118, 119, 120, 121, 122,
        123, 137, 138, 137, 138, 14, 9, 10, 11, 80, 82, 14, 8, 85, 50, 51, 50,
        51, 52, 128, 56, 1, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 70,
        71, 72, 73, 74, 162, 159, 97, 78, 79, 80, 116, 82, 1, 146, 158, 86, 87,
        88, 89, 163, 91, 31, 93, 167, 95, 156, 14, 98, 99, 35, 161, 37, 103,
        104, 105, 106, 107, 1, 109, 110, 147, 148, 31, 160, 115, 116, 8, 164, 1,
        155, 156, 157, 70, 124, 125, 126, 8, 70, 1, 70, 37, 38, 134, 135, 8,
        136, 137, 82, 139, 140, 141, 142, 143, 144, 145, 8, 35, 149, 37, 164,
        151, 152, 164, 164, 155, 156, 157, 158, 1, 161, 8, 163, 163, 82, 165,
        166, 167, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 75,
        76, 77, 75, 76, 134, 135, 31, 8, 84, 134, 135, 134, 135, 1, 90, 8, 92,
        82, 94, 149, 96, 37, 38, 8, 149, 80, 149, 128, 59, 60, 106, 161, 8, 1,
        161, 8, 161, 159, 161, 70, 167, 117, 118, 31, 8, 106, 70, 108, 106, 14,
        108, 127, 128, 129, 130, 131, 70, 158, 74, 84, 75, 76, 163, 31, 80, 159,
        167, 161, 101, 102, 14, 87, 88, 89, 14, 91, 31, 93, 16, 95, 37, 38, 98,
        159, 1, 161, 162, 103, 104, 105, 37, 38, 1, 109, 110, 16, 84, 16, 163,
        115, 116, 16, 167, 134, 135, 16, 161, 31, 124, 16, 134, 135, 167, 70,
        31, 16, 84, 16, 149, 16, 134, 135, 31, 106, 107, 82, 31, 74, 31, 86,
        161, 106, 107, 80, 159, 31, 161, 161, 154, 31, 87, 88, 89, 31, 91, 31,
        93, 161, 95, 111, 112, 98, 31, 31, 31, 31, 103, 104, 105, 31, 31, 31,
        109, 110, 31, 31, 31, 84, 115, 116, 31, 159, 31, 161, 37, 84, 38, 124,
        35, 136, 137, 35, 139, 140, 141, 142, 143, 144, 35, 31, 70, 159, 37,
        161, 151, 152, 69, 57, 74, 80, 82, 85, 77, 90, 80, 94, 163, 92, 82, 166,
        167, 87, 88, 89, 83, 91, 114, 93, 113, 95, 128, 85, 98, 116, 128, 153,
        128, 103, 104, 105, 146, 89, 74, 109, 110, 0, 1, 149, 80, 115, 116, 96,
        159, 133, 161, 87, 88, 89, 124, 91, 159, 93, 161, 95, 97, 146, 98, 97,
        97, 100, 154, 103, 104, 105, 74, 100, 149, 109, 110, -1, 80, -1, -1,
        115, 116, -1, 132, 87, 88, 89, 132, 91, 124, 93, -1, 95, -1, 155, 98,
        -1, -1, -1, 102, 103, 104, 105, 74, -1, 149, 109, 110, 149, 80, 81, 153,
        115, 116, 160, 1, 87, 88, 89, 149, 91, 124, 93, 160, 95, 164, 84, 98,
        159, 158, -1, -1, 103, 104, 105, 159, 159, 159, 109, 110, 159, 159, 159,
        159, 115, 116, 159, 159, 106, 159, 108, 1, 159, 124, 159, 113, 160, 159,
        159, 117, 118, 159, 159, 159, 163, 160, 160, 160, -1, 127, 128, 129,
        130, 131, 161, 161, 74, 161, 161, 161, 161, 161, 80, 161, 161, 161, 161,
        161, 167, 87, 88, 89, 150, 91, 162, 93, 162, 95, 84, 162, 98, 159, 162,
        161, 162, 103, 104, 105, 162, 162, 162, 109, 110, 162, 100, 101, 102,
        115, 116, 162, 106, 70, 162, 162, 162, 162, 124, 162, 162, 162, 162,
        117, 118, 82, 84, 162, 162, 86, 162, 162, 162, 127, 128, 129, 130, 131,
        162, 162, 162, 162, 100, 101, 102, 163, 163, 163, 106, 163, 163, 163,
        163, 163, 163, 163, 163, -1, 163, 117, 118, 163, 163, 163, 163, 159,
        163, 161, 162, 127, 128, 129, 130, 131, 163, 163, 163, 163, 163, 163,
        137, 163, 139, 140, 141, 142, 143, 144, 163, 163, 163, 163, 163, 163,
        151, 152, 163, 163, 163, 163, 163, 159, 164, 161, 162, 164, 163, -1,
        164, 166, 167, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164,
        164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164,
        164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, 164, -1,
        165, 165, -1, 166,
      ]),
      (r.Parser.prototype.yybase = [
        0, -2, 154, 565, 876, 948, 984, 514, 53, 398, 837, 307, 307, 67, 307,
        307, 307, 653, 724, 724, 732, 724, 616, 673, 204, 204, 204, 625, 625,
        625, 625, 694, 694, 831, 831, 863, 799, 765, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936, 936,
        936, 936, 936, 936, 936, 936, 936, 375, 519, 369, 701, 1017, 1023, 1019,
        1024, 1015, 1014, 1018, 1020, 1025, 911, 912, 782, 918, 919, 920, 921,
        1021, 841, 1016, 1022, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291,
        291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291,
        291, 291, 290, 491, 44, 382, 382, 382, 382, 382, 382, 382, 382, 382,
        382, 382, 382, 382, 382, 382, 382, 382, 382, 382, 382, 160, 160, 160,
        187, 684, 684, 341, 203, 610, 47, 985, 985, 985, 985, 985, 985, 985,
        985, 985, 985, 144, 144, 7, 7, 7, 7, 7, 371, -25, -25, -25, -25, 540,
        385, 102, 576, 358, 45, 377, 460, 460, 360, 231, 231, 231, 231, 231,
        231, -78, -78, -78, -78, -78, -66, 319, 457, -94, 396, 423, 586, 586,
        586, 586, 423, 423, 423, 423, 750, 1029, 423, 423, 423, 511, 516, 516,
        518, 147, 147, 147, 516, 583, 777, 422, 583, 422, 194, 92, 748, -40, 87,
        412, 748, 617, 627, 198, 143, 773, 658, 773, 1013, 757, 764, 717, 838,
        860, 1026, 800, 908, 806, 910, 219, 686, 1012, 1012, 1012, 1012, 1012,
        1012, 1012, 1012, 1012, 1012, 1012, 855, 552, 1013, 286, 855, 855, 855,
        552, 552, 552, 552, 552, 552, 552, 552, 552, 552, 679, 286, 568, 626,
        286, 794, 552, 375, 758, 375, 375, 375, 375, 958, 375, 375, 375, 375,
        375, 375, 970, 769, -16, 375, 519, 12, 12, 547, 83, 12, 12, 12, 12, 375,
        375, 375, 658, 781, 713, 666, 792, 448, 781, 781, 781, 438, 444, 193,
        447, 570, 523, 580, 760, 760, 767, 929, 929, 760, 759, 760, 767, 934,
        760, 929, 805, 359, 648, 577, 611, 656, 929, 478, 760, 760, 760, 760,
        665, 760, 467, 433, 760, 760, 785, 774, 789, 60, 929, 929, 929, 789,
        596, 751, 751, 751, 811, 812, 746, 771, 567, 498, 677, 348, 779, 771,
        771, 760, 640, 746, 771, 746, 771, 747, 771, 771, 771, 746, 771, 759,
        585, 771, 734, 668, 224, 771, 6, 935, 937, 354, 940, 932, 941, 979, 942,
        943, 851, 956, 933, 945, 931, 930, 780, 703, 720, 790, 729, 928, 768,
        768, 768, 925, 768, 768, 768, 768, 768, 768, 768, 768, 703, 788, 804,
        733, 783, 960, 722, 726, 725, 868, 1027, 1028, 737, 739, 958, 1006, 953,
        803, 730, 992, 967, 866, 848, 968, 969, 993, 1007, 1008, 871, 761, 874,
        880, 797, 971, 852, 768, 935, 943, 933, 945, 931, 930, 763, 762, 753,
        755, 749, 745, 736, 738, 770, 1009, 924, 835, 830, 970, 926, 703, 839,
        986, 847, 994, 995, 850, 801, 772, 840, 881, 972, 975, 976, 853, 1010,
        810, 989, 795, 996, 802, 882, 997, 998, 999, 1e3, 885, 854, 856, 857,
        815, 754, 980, 786, 891, 335, 787, 796, 978, 363, 957, 858, 894, 895,
        1001, 1002, 1003, 896, 954, 816, 990, 752, 991, 983, 817, 818, 485, 784,
        778, 541, 676, 897, 899, 900, 955, 775, 766, 821, 822, 1011, 901, 697,
        824, 740, 902, 1005, 742, 744, 756, 859, 793, 743, 798, 977, 776, 827,
        907, 829, 832, 833, 1004, 836, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 458, 458, 458, 458, 458,
        458, 307, 307, 307, 307, 0, 0, 307, 0, 0, 0, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458, 458,
        291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291,
        291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 291, 291, 291,
        291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 291,
        291, 291, 291, 291, 291, 291, 291, 291, 291, 291, 423, 423, 291, 291, 0,
        291, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 291, 291, 291,
        291, 291, 291, 291, 805, 147, 147, 147, 147, 423, 423, 423, 423, 423,
        -88, -88, 147, 147, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423,
        423, 423, 0, 0, 0, 286, 422, 0, 759, 759, 759, 759, 0, 0, 0, 0, 422,
        422, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 286, 422, 0, 286, 0, 759, 759,
        423, 805, 805, 314, 423, 0, 0, 0, 0, 286, 759, 286, 552, 422, 552, 552,
        12, 375, 314, 608, 608, 608, 608, 0, 658, 805, 805, 805, 805, 805, 805,
        805, 805, 805, 805, 805, 759, 0, 805, 0, 759, 759, 759, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 759, 0, 0, 929, 0, 0, 0, 0, 760, 0, 0, 0,
        0, 0, 0, 760, 934, 0, 0, 0, 0, 0, 0, 759, 0, 0, 0, 0, 0, 0, 0, 0, 768,
        801, 0, 801, 0, 768, 768, 768,
      ]),
      (r.Parser.prototype.yydefault = [
        3, 32767, 103, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 101, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 578, 578, 578, 578, 32767,
        32767, 246, 103, 32767, 32767, 454, 372, 372, 372, 32767, 32767, 522,
        522, 522, 522, 522, 522, 32767, 32767, 32767, 32767, 32767, 32767, 454,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 101, 32767, 32767, 32767, 37, 7, 8, 10, 11, 50, 17, 310,
        32767, 32767, 32767, 32767, 103, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 571, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 458, 437, 438, 440, 441, 371,
        523, 577, 313, 574, 370, 146, 325, 315, 234, 316, 250, 459, 251, 460,
        463, 464, 211, 279, 367, 150, 401, 455, 403, 453, 457, 402, 377, 382,
        383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 375, 376,
        456, 434, 433, 432, 399, 32767, 32767, 400, 404, 374, 407, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 103, 32767, 405, 406, 423,
        424, 421, 422, 425, 32767, 426, 427, 428, 429, 32767, 32767, 302, 32767,
        32767, 351, 349, 414, 415, 302, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 516, 431, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 103, 32767, 101, 518, 396, 398, 486, 409, 410, 408, 378, 32767,
        493, 32767, 103, 495, 32767, 32767, 32767, 112, 32767, 32767, 32767,
        517, 32767, 524, 524, 32767, 479, 101, 194, 32767, 194, 194, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 585, 479, 111, 111, 111, 111,
        111, 111, 111, 111, 111, 111, 111, 32767, 194, 111, 32767, 32767, 32767,
        101, 194, 194, 194, 194, 194, 194, 194, 194, 194, 194, 189, 32767, 260,
        262, 103, 539, 194, 32767, 498, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 491, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 479, 419, 139, 32767, 139, 524, 411, 412, 413, 481, 524,
        524, 524, 298, 281, 32767, 32767, 32767, 32767, 496, 496, 101, 101, 101,
        101, 491, 32767, 32767, 112, 100, 100, 100, 100, 100, 104, 102, 32767,
        32767, 32767, 32767, 100, 32767, 102, 102, 32767, 32767, 217, 208, 215,
        102, 32767, 543, 544, 215, 102, 219, 219, 219, 239, 239, 470, 304, 102,
        100, 102, 102, 196, 304, 304, 32767, 102, 470, 304, 470, 304, 198, 304,
        304, 304, 470, 304, 32767, 102, 304, 210, 100, 100, 304, 32767, 32767,
        32767, 481, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 511, 32767, 528, 541, 417,
        418, 420, 526, 442, 443, 444, 445, 446, 447, 448, 450, 573, 32767, 485,
        32767, 32767, 32767, 32767, 324, 583, 32767, 583, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 584, 32767, 524, 32767, 32767, 32767, 32767,
        416, 9, 76, 43, 44, 52, 58, 502, 503, 504, 505, 499, 500, 506, 501,
        32767, 32767, 507, 549, 32767, 32767, 525, 576, 32767, 32767, 32767,
        32767, 32767, 32767, 139, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 511, 32767, 137, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 524, 32767, 32767,
        32767, 300, 301, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 32767, 524, 32767, 32767,
        32767, 283, 284, 32767, 32767, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 32767, 32767, 278, 32767, 32767, 366, 32767,
        32767, 32767, 32767, 345, 32767, 32767, 32767, 32767, 32767, 32767,
        32767, 32767, 32767, 32767, 152, 152, 3, 3, 327, 152, 152, 152, 327,
        152, 327, 327, 327, 152, 152, 152, 152, 152, 152, 272, 184, 254, 257,
        239, 239, 152, 337, 152,
      ]),
      (r.Parser.prototype.yygoto = [
        194, 194, 670, 422, 643, 463, 1264, 1265, 1022, 416, 308, 309, 329, 563,
        314, 421, 330, 423, 622, 801, 678, 637, 586, 651, 652, 653, 165, 165,
        165, 165, 218, 195, 191, 191, 175, 177, 213, 191, 191, 191, 191, 191,
        192, 192, 192, 192, 192, 192, 186, 187, 188, 189, 190, 215, 213, 216,
        521, 522, 412, 523, 525, 526, 527, 528, 529, 530, 531, 532, 1091, 166,
        167, 168, 193, 169, 170, 171, 164, 172, 173, 174, 176, 212, 214, 217,
        235, 238, 241, 242, 244, 255, 256, 257, 258, 259, 260, 261, 263, 264,
        265, 266, 274, 275, 311, 312, 313, 417, 418, 419, 568, 219, 220, 221,
        222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 178, 234,
        179, 196, 197, 198, 236, 186, 187, 188, 189, 190, 215, 1091, 199, 180,
        181, 182, 200, 196, 183, 237, 201, 199, 163, 202, 203, 184, 204, 205,
        206, 185, 207, 208, 209, 210, 211, 323, 323, 323, 323, 827, 608, 608,
        824, 547, 538, 342, 1221, 1221, 1221, 1221, 1221, 1221, 1221, 1221,
        1221, 1221, 1239, 1239, 288, 288, 288, 288, 1239, 1239, 1239, 1239,
        1239, 1239, 1239, 1239, 1239, 1239, 388, 538, 547, 556, 557, 395, 566,
        588, 602, 603, 832, 825, 880, 875, 876, 889, 15, 833, 877, 830, 878,
        879, 831, 799, 251, 251, 883, 919, 992, 1e3, 1004, 1001, 1005, 1237,
        1237, 938, 1043, 1039, 1040, 1237, 1237, 1237, 1237, 1237, 1237, 1237,
        1237, 1237, 1237, 858, 248, 248, 248, 248, 250, 252, 533, 533, 533, 533,
        487, 590, 488, 1190, 1190, 997, 1190, 997, 494, 1290, 1290, 560, 997,
        997, 997, 997, 997, 997, 997, 997, 997, 997, 997, 997, 1261, 1261, 1290,
        1261, 340, 1190, 930, 402, 677, 1279, 1190, 1190, 1190, 1190, 959, 345,
        1190, 1190, 1190, 1271, 1271, 1271, 1271, 606, 640, 345, 345, 1273,
        1273, 1273, 1273, 820, 820, 805, 896, 884, 840, 885, 897, 345, 345, 5,
        345, 6, 1306, 384, 535, 535, 559, 535, 415, 852, 597, 1257, 839, 540,
        524, 524, 345, 1289, 1289, 642, 524, 524, 524, 524, 524, 524, 524, 524,
        524, 524, 445, 805, 1140, 805, 1289, 932, 932, 932, 932, 1063, 1064,
        445, 926, 933, 386, 390, 548, 587, 591, 1030, 1292, 331, 554, 1259,
        1259, 1030, 704, 621, 623, 823, 641, 1250, 319, 303, 660, 664, 973, 668,
        676, 969, 429, 553, 962, 936, 936, 934, 936, 703, 601, 537, 971, 966,
        343, 344, 663, 817, 595, 609, 612, 613, 614, 615, 634, 635, 636, 680,
        439, 1186, 845, 454, 454, 439, 439, 1266, 1267, 820, 901, 1079, 454,
        394, 539, 551, 1183, 605, 540, 539, 842, 551, 978, 272, 387, 618, 619,
        981, 536, 536, 844, 707, 646, 957, 567, 457, 458, 459, 838, 850, 254,
        254, 1297, 1298, 400, 401, 976, 976, 464, 649, 1182, 650, 1028, 404,
        405, 406, 1187, 661, 424, 1032, 407, 564, 600, 815, 338, 424, 854, 848,
        853, 841, 1027, 1031, 1009, 1002, 1006, 1003, 1007, 1185, 941, 1188,
        1247, 1248, 943, 0, 1074, 439, 439, 439, 439, 439, 439, 439, 439, 439,
        439, 439, 0, 468, 439, 585, 1056, 931, 681, 667, 667, 0, 495, 673, 1054,
        1171, 912, 0, 0, 1172, 1175, 913, 1176, 0, 0, 0, 0, 0, 0, 1072, 857,
      ]),
      (r.Parser.prototype.yygcheck = [
        42, 42, 72, 65, 65, 166, 166, 166, 119, 65, 65, 65, 65, 65, 65, 65, 65,
        65, 65, 7, 9, 84, 122, 84, 84, 84, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        23, 23, 23, 23, 15, 104, 104, 26, 75, 75, 93, 104, 104, 104, 104, 104,
        104, 104, 104, 104, 104, 160, 160, 24, 24, 24, 24, 160, 160, 160, 160,
        160, 160, 160, 160, 160, 160, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75,
        15, 27, 15, 15, 15, 15, 75, 15, 15, 15, 15, 15, 15, 6, 5, 5, 15, 87, 87,
        87, 87, 87, 87, 161, 161, 49, 15, 15, 15, 161, 161, 161, 161, 161, 161,
        161, 161, 161, 161, 45, 5, 5, 5, 5, 5, 5, 103, 103, 103, 103, 147, 103,
        147, 72, 72, 72, 72, 72, 147, 173, 173, 162, 72, 72, 72, 72, 72, 72, 72,
        72, 72, 72, 72, 72, 122, 122, 173, 122, 169, 72, 89, 89, 89, 171, 72,
        72, 72, 72, 99, 14, 72, 72, 72, 9, 9, 9, 9, 55, 55, 14, 14, 122, 122,
        122, 122, 22, 22, 12, 72, 64, 35, 64, 72, 14, 14, 46, 14, 46, 14, 61,
        19, 19, 100, 19, 13, 35, 13, 122, 35, 14, 163, 163, 14, 172, 172, 63,
        163, 163, 163, 163, 163, 163, 163, 163, 163, 163, 19, 12, 143, 12, 172,
        19, 19, 19, 19, 136, 136, 19, 19, 19, 58, 58, 58, 58, 58, 122, 172, 29,
        48, 122, 122, 122, 48, 48, 48, 25, 48, 14, 159, 159, 48, 48, 48, 48, 48,
        48, 109, 9, 25, 25, 25, 25, 25, 25, 9, 25, 25, 25, 93, 93, 14, 18, 79,
        79, 79, 79, 79, 79, 79, 79, 79, 79, 23, 20, 39, 141, 141, 23, 23, 168,
        168, 22, 17, 17, 141, 28, 9, 9, 152, 17, 14, 9, 37, 9, 17, 24, 9, 83,
        83, 106, 24, 24, 17, 95, 17, 17, 9, 9, 9, 9, 17, 9, 5, 5, 9, 9, 80, 80,
        103, 103, 149, 80, 17, 80, 121, 80, 80, 80, 20, 80, 113, 124, 80, 2, 2,
        20, 80, 113, 41, 9, 16, 16, 16, 16, 113, 113, 113, 113, 113, 14, 16, 20,
        20, 20, 92, -1, 139, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, -1, 82,
        23, 8, 8, 16, 8, 8, 8, -1, 8, 8, 8, 78, 78, -1, -1, 78, 78, 78, 78, -1,
        -1, -1, -1, -1, -1, 16, 16,
      ]),
      (r.Parser.prototype.yygbase = [
        0, 0, -203, 0, 0, 221, 208, 10, 512, 7, 0, 0, 24, 1, 5, -174, 47, -23,
        105, 61, 38, 0, -10, 158, 181, 379, 164, 205, 102, 84, 0, 0, 0, 0, 0,
        -43, 0, 107, 0, 104, 0, 54, -1, 0, 0, 235, -384, 0, -307, 210, 0, 0, 0,
        0, 0, 266, 0, 0, 324, 0, 0, 286, 0, 103, 298, -236, 0, 0, 0, 0, 0, 0,
        -6, 0, 0, -167, 0, 0, 129, 62, -14, 0, 53, -22, -669, 0, 0, -52, 0, -11,
        0, 0, 68, -299, 0, 52, 0, 0, 0, 262, 288, 0, 0, 227, -73, 0, 87, 0, 0,
        118, 0, 0, 0, 209, 0, 0, 0, 0, 0, 6, 0, 108, 15, 0, 46, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 91, 0, 0, 69, 0, 390, 0, 86, 0, 0, 0, -224, 0, 37, 0,
        0, 77, 0, 0, 0, 0, 0, 0, 70, -57, -8, 241, 99, 0, 0, -290, 0, 65, 257,
        0, 261, 39, -35, 0, 0,
      ]),
      (r.Parser.prototype.yygdefault = [
        -32768, 499, 711, 4, 712, 905, 788, 797, 583, 515, 679, 339, 610, 413,
        1255, 882, 1078, 565, 816, 1199, 1207, 446, 819, 324, 701, 864, 865,
        866, 391, 376, 382, 389, 632, 611, 481, 851, 442, 843, 473, 846, 441,
        855, 162, 410, 497, 859, 3, 861, 542, 892, 377, 869, 378, 656, 871, 550,
        873, 874, 385, 392, 393, 1083, 558, 607, 886, 243, 552, 887, 375, 888,
        895, 380, 383, 665, 453, 492, 486, 403, 1058, 594, 629, 450, 467, 617,
        616, 604, 466, 425, 408, 928, 474, 451, 942, 341, 950, 709, 1090, 624,
        476, 958, 625, 965, 968, 516, 517, 465, 980, 269, 983, 477, 1015, 647,
        648, 995, 626, 627, 1013, 460, 584, 1021, 443, 1029, 1243, 444, 1033,
        262, 1036, 276, 409, 426, 1041, 1042, 8, 1048, 671, 672, 10, 273, 496,
        1073, 666, 440, 1089, 430, 1159, 1161, 544, 478, 1179, 1178, 659, 493,
        1184, 1246, 438, 518, 461, 310, 519, 302, 327, 307, 534, 289, 328, 520,
        462, 1252, 1260, 325, 30, 1280, 1291, 335, 562, 599,
      ]),
      (r.Parser.prototype.yylhs = [
        0, 1, 3, 3, 2, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 9, 10, 11, 11, 11, 12,
        12, 13, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 21, 21, 22, 23, 23, 24,
        24, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 29, 29, 30, 30, 32, 34, 34, 28, 36,
        36, 33, 38, 38, 35, 35, 37, 37, 39, 39, 31, 40, 40, 41, 43, 44, 44, 45,
        46, 46, 48, 47, 47, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49,
        49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 25, 25, 68, 68, 71,
        71, 70, 69, 69, 62, 74, 74, 75, 75, 76, 76, 77, 77, 78, 78, 26, 26, 27,
        27, 27, 27, 86, 86, 88, 88, 81, 81, 81, 82, 82, 85, 85, 83, 83, 89, 90,
        90, 56, 56, 64, 64, 67, 67, 67, 66, 91, 91, 92, 57, 57, 57, 57, 93, 93,
        94, 94, 95, 95, 96, 97, 97, 98, 98, 99, 99, 54, 54, 50, 50, 101, 52, 52,
        102, 51, 51, 53, 53, 63, 63, 63, 63, 79, 79, 105, 105, 107, 107, 108,
        108, 108, 108, 106, 106, 106, 110, 110, 110, 110, 87, 87, 113, 113, 113,
        111, 111, 114, 114, 112, 112, 115, 115, 116, 116, 116, 116, 109, 109,
        80, 80, 80, 20, 20, 20, 118, 117, 117, 119, 119, 119, 119, 59, 120, 120,
        121, 60, 123, 123, 124, 124, 125, 125, 84, 126, 126, 126, 126, 126, 126,
        131, 131, 132, 132, 133, 133, 133, 133, 133, 134, 135, 135, 130, 130,
        127, 127, 129, 129, 137, 137, 136, 136, 136, 136, 136, 136, 136, 128,
        138, 138, 140, 139, 139, 61, 100, 141, 141, 55, 55, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 148,
        142, 142, 147, 147, 150, 151, 151, 152, 153, 153, 153, 19, 19, 72, 72,
        72, 72, 143, 143, 143, 143, 155, 155, 144, 144, 146, 146, 146, 149, 149,
        160, 160, 160, 160, 160, 160, 160, 160, 160, 161, 161, 104, 163, 163,
        163, 163, 145, 145, 145, 145, 145, 145, 145, 145, 58, 58, 158, 158, 158,
        158, 164, 164, 154, 154, 154, 165, 165, 165, 165, 165, 165, 73, 73, 65,
        65, 65, 65, 122, 122, 122, 122, 168, 167, 157, 157, 157, 157, 157, 157,
        157, 156, 156, 156, 166, 166, 166, 166, 103, 162, 170, 170, 169, 169,
        171, 171, 171, 171, 171, 171, 171, 171, 159, 159, 159, 159, 173, 174,
        172, 172, 172, 172, 172, 172, 172, 172, 175, 175, 175, 175,
      ]),
      (r.Parser.prototype.yylen = [
        1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 0, 1, 1, 2, 1, 3, 4, 1, 2, 0, 1, 1, 1, 1, 1, 3, 5, 4,
        3, 4, 2, 3, 1, 1, 7, 6, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 3, 1, 3, 1, 2, 2,
        3, 1, 3, 2, 3, 1, 3, 2, 0, 1, 1, 1, 1, 1, 3, 7, 10, 5, 7, 9, 5, 3, 3, 3,
        3, 3, 3, 1, 2, 5, 7, 9, 6, 5, 6, 3, 2, 1, 1, 1, 0, 2, 1, 3, 8, 0, 4, 2,
        1, 3, 0, 1, 0, 1, 0, 1, 3, 1, 8, 9, 8, 7, 6, 8, 0, 2, 0, 2, 1, 2, 2, 0,
        2, 0, 2, 0, 2, 2, 1, 3, 1, 4, 1, 4, 1, 1, 4, 2, 1, 3, 3, 3, 4, 4, 5, 0,
        2, 4, 3, 1, 1, 7, 0, 2, 1, 3, 3, 4, 1, 4, 0, 2, 5, 0, 2, 6, 0, 2, 0, 3,
        1, 2, 1, 1, 2, 0, 1, 3, 0, 2, 1, 1, 1, 1, 6, 8, 6, 1, 2, 1, 1, 1, 1, 1,
        1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 1, 1, 0, 1, 0, 2, 2, 2, 4, 3, 1, 1,
        3, 1, 2, 2, 3, 2, 3, 1, 1, 2, 3, 1, 1, 3, 2, 0, 1, 5, 5, 10, 3, 5, 1, 1,
        3, 0, 2, 4, 5, 4, 4, 4, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1,
        1, 1, 2, 1, 3, 1, 1, 3, 2, 2, 3, 1, 0, 1, 1, 3, 3, 3, 4, 1, 1, 2, 3, 3,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        5, 4, 3, 4, 4, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 2, 1, 2,
        4, 2, 2, 8, 9, 8, 9, 9, 10, 9, 10, 8, 3, 2, 0, 4, 2, 1, 3, 2, 2, 2, 4,
        1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0, 3, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 3, 3, 3, 4, 1, 1, 3, 1, 1, 1, 1, 1, 3, 2, 3, 0, 1, 1, 3, 1,
        1, 1, 1, 1, 3, 1, 1, 4, 4, 1, 4, 4, 0, 1, 1, 1, 3, 3, 1, 4, 2, 2, 1, 3,
        1, 4, 4, 3, 3, 3, 3, 1, 3, 1, 1, 3, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 1, 3,
        4, 3, 2, 0, 2, 2, 1, 2, 1, 1, 1, 4, 3, 3, 3, 3, 6, 3, 1, 1, 2, 1,
      ]),
      (e.PHP = r);
  }),
  ace.define("ace/mode/php_worker", [], function (t, e, n) {
    "use strict";
    var r = t("../lib/oop"),
      s = t("../worker/mirror").Mirror,
      o = t("./php/php").PHP,
      a = (e.PhpWorker = function (t) {
        s.call(this, t), this.setTimeout(500);
      });
    r.inherits(a, s),
      function () {
        (this.setOptions = function (t) {
          this.inlinePhp = t && t.inline;
        }),
          (this.onUpdate = function () {
            var t = this.doc.getValue(),
              e = [];
            this.inlinePhp && (t = "<?" + t + "?>");
            var n = o.Lexer(t, { short_open_tag: 1 });
            try {
              new o.Parser(n);
            } catch (r) {
              e.push({
                row: r.line - 1,
                column: null,
                text:
                  r.message.charAt(0).toUpperCase() + r.message.substring(1),
                type: "error",
              });
            }
            this.sender.emit("annotate", e);
          });
      }.call(a.prototype);
  });
