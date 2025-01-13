!(function (e) {
  if (
    ("undefined" == typeof e.window || !e.document) &&
    (!e.require || !e.define)
  ) {
    e.console ||
      ((e.console = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        postMessage({ type: "log", data: e });
      }),
      (e.console.error =
        e.console.warn =
        e.console.log =
        e.console.trace =
          e.console)),
      (e.window = e),
      (e.ace = e),
      (e.onerror = function (e, t, n, r, o) {
        postMessage({
          type: "error",
          data: {
            message: e,
            data: o && o.data,
            file: t,
            line: n,
            col: r,
            stack: o && o.stack,
          },
        });
      }),
      (e.normalizeModule = function (t, n) {
        if (-1 !== n.indexOf("!")) {
          var r = n.split("!");
          return e.normalizeModule(t, r[0]) + "!" + e.normalizeModule(t, r[1]);
        }
        if ("." == n.charAt(0)) {
          var o = t.split("/").slice(0, -1).join("/");
          for (n = (o ? o + "/" : "") + n; -1 !== n.indexOf(".") && i != n; ) {
            var i = n;
            n = n
              .replace(/^\.\//, "")
              .replace(/\/\.\//, "/")
              .replace(/[^\/]+\/\.\.\//, "");
          }
        }
        return n;
      }),
      (e.require = function (t, n) {
        if ((n || ((n = t), (t = null)), !n.charAt))
          throw new Error(
            "worker.js require() accepts only (parentId, id) as arguments"
          );
        n = e.normalizeModule(t, n);
        var r = e.require.modules[n];
        if (r)
          return (
            r.initialized ||
              ((r.initialized = !0), (r.exports = r.factory().exports)),
            r.exports
          );
        if (!e.require.tlns) return console.log("unable to load " + n);
        var o = (function (e, t) {
          var n = e,
            r = "";
          for (; n; ) {
            var o = t[n];
            if ("string" == typeof o) return o + r;
            if (o)
              return o.location.replace(/\/*$/, "/") + (r || o.main || o.name);
            if (!1 === o) return "";
            var i = n.lastIndexOf("/");
            if (-1 === i) break;
            (r = n.substr(i) + r), (n = n.slice(0, i));
          }
          return e;
        })(n, e.require.tlns);
        return (
          ".js" != o.slice(-3) && (o += ".js"),
          (e.require.id = n),
          (e.require.modules[n] = {}),
          importScripts(o),
          e.require(t, n)
        );
      }),
      (e.require.modules = {}),
      (e.require.tlns = {}),
      (e.define = function (t, n, r) {
        if (
          (2 == arguments.length
            ? ((r = n), "string" != typeof t && ((n = t), (t = e.require.id)))
            : 1 == arguments.length && ((r = t), (n = []), (t = e.require.id)),
          "function" == typeof r)
        ) {
          n.length || (n = ["require", "exports", "module"]);
          var o = function (n) {
            return e.require(t, n);
          };
          e.require.modules[t] = {
            exports: {},
            factory: function () {
              var e = this,
                t = r.apply(
                  this,
                  n.slice(0, r.length).map(function (t) {
                    switch (t) {
                      case "require":
                        return o;
                      case "exports":
                        return e.exports;
                      case "module":
                        return e;
                      default:
                        return o(t);
                    }
                  })
                );
              return t && (e.exports = t), e;
            },
          };
        } else e.require.modules[t] = { exports: r, initialized: !0 };
      }),
      (e.define.amd = {}),
      (e.require.tlns = {}),
      (e.initBaseUrls = function (e) {
        for (var t in e) this.require.tlns[t] = e[t];
      }),
      (e.initSender = function () {
        var t = e.require("ace/lib/event_emitter").EventEmitter,
          n = e.require("ace/lib/oop"),
          r = function () {};
        return (
          function () {
            n.implement(this, t),
              (this.callback = function (e, t) {
                postMessage({ type: "call", id: t, data: e });
              }),
              (this.emit = function (e, t) {
                postMessage({ type: "event", name: e, data: t });
              });
          }.call(r.prototype),
          new r()
        );
      });
    var t = (e.main = null),
      n = (e.sender = null);
    e.onmessage = function (r) {
      var o = r.data;
      if (o.event && n) n._signal(o.event, o.data);
      else if (o.command)
        if (t[o.command]) t[o.command].apply(t, o.args);
        else {
          if (!e[o.command]) throw new Error("Unknown command:" + o.command);
          e[o.command].apply(e, o.args);
        }
      else if (o.init) {
        e.initBaseUrls(o.tlns), (n = e.sender = e.initSender());
        var i = this.require(o.module)[o.classname];
        t = e.main = new i(n);
      }
    };
  }
})(this),
  ace.define("ace/lib/oop", [], function (e, t, n) {
    "use strict";
    (t.inherits = function (e, t) {
      (e.super_ = t),
        (e.prototype = Object.create(t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        }));
    }),
      (t.mixin = function (e, t) {
        for (var n in t) e[n] = t[n];
        return e;
      }),
      (t.implement = function (e, n) {
        t.mixin(e, n);
      });
  }),
  ace.define("ace/apply_delta", [], function (e, t, n) {
    "use strict";
    t.applyDelta = function (e, t, n) {
      var r = t.start.row,
        o = t.start.column,
        i = e[r] || "";
      switch (t.action) {
        case "insert":
          if (1 === t.lines.length)
            e[r] = i.substring(0, o) + t.lines[0] + i.substring(o);
          else {
            var a = [r, 1].concat(t.lines);
            e.splice.apply(e, a),
              (e[r] = i.substring(0, o) + e[r]),
              (e[r + t.lines.length - 1] += i.substring(o));
          }
          break;
        case "remove":
          var s = t.end.column,
            c = t.end.row;
          r === c
            ? (e[r] = i.substring(0, o) + i.substring(s))
            : e.splice(r, c - r + 1, i.substring(0, o) + e[c].substring(s));
      }
    };
  }),
  ace.define("ace/lib/event_emitter", [], function (e, t, n) {
    "use strict";
    var r = {},
      o = function () {
        this.propagationStopped = !0;
      },
      i = function () {
        this.defaultPrevented = !0;
      };
    (r._emit = r._dispatchEvent =
      function (e, t) {
        this._eventRegistry || (this._eventRegistry = {}),
          this._defaultHandlers || (this._defaultHandlers = {});
        var n = this._eventRegistry[e] || [],
          r = this._defaultHandlers[e];
        if (n.length || r) {
          ("object" == typeof t && t) || (t = {}),
            t.type || (t.type = e),
            t.stopPropagation || (t.stopPropagation = o),
            t.preventDefault || (t.preventDefault = i),
            (n = n.slice());
          for (
            var a = 0;
            a < n.length && (n[a](t, this), !t.propagationStopped);
            a++
          );
          return r && !t.defaultPrevented ? r(t, this) : void 0;
        }
      }),
      (r._signal = function (e, t) {
        var n = (this._eventRegistry || {})[e];
        if (n) {
          n = n.slice();
          for (var r = 0; r < n.length; r++) n[r](t, this);
        }
      }),
      (r.once = function (e, t) {
        var n = this;
        if (
          (this.on(e, function r() {
            n.off(e, r), t.apply(null, arguments);
          }),
          !t)
        )
          return new Promise(function (e) {
            t = e;
          });
      }),
      (r.setDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        if ((n || (n = this._defaultHandlers = { _disabled_: {} }), n[e])) {
          var r = n[e],
            o = n._disabled_[e];
          o || (n._disabled_[e] = o = []), o.push(r);
          var i = o.indexOf(t);
          -1 != i && o.splice(i, 1);
        }
        n[e] = t;
      }),
      (r.removeDefaultHandler = function (e, t) {
        var n = this._defaultHandlers;
        if (n) {
          var r = n._disabled_[e];
          if (n[e] == t) r && this.setDefaultHandler(e, r.pop());
          else if (r) {
            var o = r.indexOf(t);
            -1 != o && r.splice(o, 1);
          }
        }
      }),
      (r.on = r.addEventListener =
        function (e, t, n) {
          this._eventRegistry = this._eventRegistry || {};
          var r = this._eventRegistry[e];
          return (
            r || (r = this._eventRegistry[e] = []),
            -1 == r.indexOf(t) && r[n ? "unshift" : "push"](t),
            t
          );
        }),
      (r.off =
        r.removeListener =
        r.removeEventListener =
          function (e, t) {
            this._eventRegistry = this._eventRegistry || {};
            var n = this._eventRegistry[e];
            if (n) {
              var r = n.indexOf(t);
              -1 !== r && n.splice(r, 1);
            }
          }),
      (r.removeAllListeners = function (e) {
        e || (this._eventRegistry = this._defaultHandlers = void 0),
          this._eventRegistry && (this._eventRegistry[e] = void 0),
          this._defaultHandlers && (this._defaultHandlers[e] = void 0);
      }),
      (t.EventEmitter = r);
  }),
  ace.define("ace/range", [], function (e, t, n) {
    "use strict";
    var r = (function () {
      function e(e, t, n, r) {
        (this.start = { row: e, column: t }),
          (this.end = { row: n, column: r });
      }
      return (
        (e.prototype.isEqual = function (e) {
          return (
            this.start.row === e.start.row &&
            this.end.row === e.end.row &&
            this.start.column === e.start.column &&
            this.end.column === e.end.column
          );
        }),
        (e.prototype.toString = function () {
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
        (e.prototype.contains = function (e, t) {
          return 0 == this.compare(e, t);
        }),
        (e.prototype.compareRange = function (e) {
          var t,
            n = e.end,
            r = e.start;
          return 1 == (t = this.compare(n.row, n.column))
            ? 1 == (t = this.compare(r.row, r.column))
              ? 2
              : 0 == t
              ? 1
              : 0
            : -1 == t
            ? -2
            : -1 == (t = this.compare(r.row, r.column))
            ? -1
            : 1 == t
            ? 42
            : 0;
        }),
        (e.prototype.comparePoint = function (e) {
          return this.compare(e.row, e.column);
        }),
        (e.prototype.containsRange = function (e) {
          return (
            0 == this.comparePoint(e.start) && 0 == this.comparePoint(e.end)
          );
        }),
        (e.prototype.intersects = function (e) {
          var t = this.compareRange(e);
          return -1 == t || 0 == t || 1 == t;
        }),
        (e.prototype.isEnd = function (e, t) {
          return this.end.row == e && this.end.column == t;
        }),
        (e.prototype.isStart = function (e, t) {
          return this.start.row == e && this.start.column == t;
        }),
        (e.prototype.setStart = function (e, t) {
          "object" == typeof e
            ? ((this.start.column = e.column), (this.start.row = e.row))
            : ((this.start.row = e), (this.start.column = t));
        }),
        (e.prototype.setEnd = function (e, t) {
          "object" == typeof e
            ? ((this.end.column = e.column), (this.end.row = e.row))
            : ((this.end.row = e), (this.end.column = t));
        }),
        (e.prototype.inside = function (e, t) {
          return (
            0 == this.compare(e, t) && !this.isEnd(e, t) && !this.isStart(e, t)
          );
        }),
        (e.prototype.insideStart = function (e, t) {
          return 0 == this.compare(e, t) && !this.isEnd(e, t);
        }),
        (e.prototype.insideEnd = function (e, t) {
          return 0 == this.compare(e, t) && !this.isStart(e, t);
        }),
        (e.prototype.compare = function (e, t) {
          return this.isMultiLine() || e !== this.start.row
            ? e < this.start.row
              ? -1
              : e > this.end.row
              ? 1
              : this.start.row === e
              ? t >= this.start.column
                ? 0
                : -1
              : this.end.row === e
              ? t <= this.end.column
                ? 0
                : 1
              : 0
            : t < this.start.column
            ? -1
            : t > this.end.column
            ? 1
            : 0;
        }),
        (e.prototype.compareStart = function (e, t) {
          return this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (e.prototype.compareEnd = function (e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.compare(e, t);
        }),
        (e.prototype.compareInside = function (e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (e.prototype.clipRows = function (t, n) {
          if (this.end.row > n) var r = { row: n + 1, column: 0 };
          else if (this.end.row < t) r = { row: t, column: 0 };
          if (this.start.row > n) var o = { row: n + 1, column: 0 };
          else if (this.start.row < t) o = { row: t, column: 0 };
          return e.fromPoints(o || this.start, r || this.end);
        }),
        (e.prototype.extend = function (t, n) {
          var r = this.compare(t, n);
          if (0 == r) return this;
          if (-1 == r) var o = { row: t, column: n };
          else var i = { row: t, column: n };
          return e.fromPoints(o || this.start, i || this.end);
        }),
        (e.prototype.isEmpty = function () {
          return (
            this.start.row === this.end.row &&
            this.start.column === this.end.column
          );
        }),
        (e.prototype.isMultiLine = function () {
          return this.start.row !== this.end.row;
        }),
        (e.prototype.clone = function () {
          return e.fromPoints(this.start, this.end);
        }),
        (e.prototype.collapseRows = function () {
          return 0 == this.end.column
            ? new e(
                this.start.row,
                0,
                Math.max(this.start.row, this.end.row - 1),
                0
              )
            : new e(this.start.row, 0, this.end.row, 0);
        }),
        (e.prototype.toScreenRange = function (t) {
          var n = t.documentToScreenPosition(this.start),
            r = t.documentToScreenPosition(this.end);
          return new e(n.row, n.column, r.row, r.column);
        }),
        (e.prototype.moveBy = function (e, t) {
          (this.start.row += e),
            (this.start.column += t),
            (this.end.row += e),
            (this.end.column += t);
        }),
        e
      );
    })();
    (r.fromPoints = function (e, t) {
      return new r(e.row, e.column, t.row, t.column);
    }),
      (r.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (r.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (t.Range = r);
  }),
  ace.define("ace/anchor", [], function (e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      o = e("./lib/event_emitter").EventEmitter,
      i = (function () {
        function e(e, t, n) {
          (this.$onChange = this.onChange.bind(this)),
            this.attach(e),
            "undefined" == typeof n
              ? this.setPosition(t.row, t.column)
              : this.setPosition(t, n);
        }
        return (
          (e.prototype.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column);
          }),
          (e.prototype.getDocument = function () {
            return this.document;
          }),
          (e.prototype.onChange = function (e) {
            if (
              (e.start.row != e.end.row || e.start.row == this.row) &&
              !(e.start.row > this.row)
            ) {
              var t = (function (e, t, n) {
                var r = "insert" == e.action,
                  o = (r ? 1 : -1) * (e.end.row - e.start.row),
                  i = (r ? 1 : -1) * (e.end.column - e.start.column),
                  s = e.start,
                  c = r ? s : e.end;
                if (a(t, s, n)) return { row: t.row, column: t.column };
                if (a(c, t, !n))
                  return {
                    row: t.row + o,
                    column: t.column + (t.row == c.row ? i : 0),
                  };
                return { row: s.row, column: s.column };
              })(e, { row: this.row, column: this.column }, this.$insertRight);
              this.setPosition(t.row, t.column, !0);
            }
          }),
          (e.prototype.setPosition = function (e, t, n) {
            var r;
            if (
              ((r = n
                ? { row: e, column: t }
                : this.$clipPositionToDocument(e, t)),
              this.row != r.row || this.column != r.column)
            ) {
              var o = { row: this.row, column: this.column };
              (this.row = r.row),
                (this.column = r.column),
                this._signal("change", { old: o, value: r });
            }
          }),
          (e.prototype.detach = function () {
            this.document.off("change", this.$onChange);
          }),
          (e.prototype.attach = function (e) {
            (this.document = e || this.document),
              this.document.on("change", this.$onChange);
          }),
          (e.prototype.$clipPositionToDocument = function (e, t) {
            var n = {};
            return (
              e >= this.document.getLength()
                ? ((n.row = Math.max(0, this.document.getLength() - 1)),
                  (n.column = this.document.getLine(n.row).length))
                : e < 0
                ? ((n.row = 0), (n.column = 0))
                : ((n.row = e),
                  (n.column = Math.min(
                    this.document.getLine(n.row).length,
                    Math.max(0, t)
                  ))),
              t < 0 && (n.column = 0),
              n
            );
          }),
          e
        );
      })();
    function a(e, t, n) {
      var r = n ? e.column <= t.column : e.column < t.column;
      return e.row < t.row || (e.row == t.row && r);
    }
    (i.prototype.$insertRight = !1),
      r.implement(i.prototype, o),
      (t.Anchor = i);
  }),
  ace.define("ace/document", [], function (e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      o = e("./apply_delta").applyDelta,
      i = e("./lib/event_emitter").EventEmitter,
      a = e("./range").Range,
      s = e("./anchor").Anchor,
      c = (function () {
        function e(e) {
          (this.$lines = [""]),
            0 === e.length
              ? (this.$lines = [""])
              : Array.isArray(e)
              ? this.insertMergedLines({ row: 0, column: 0 }, e)
              : this.insert({ row: 0, column: 0 }, e);
        }
        return (
          (e.prototype.setValue = function (e) {
            var t = this.getLength() - 1;
            this.remove(new a(0, 0, t, this.getLine(t).length)),
              this.insert({ row: 0, column: 0 }, e || "");
          }),
          (e.prototype.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
          }),
          (e.prototype.createAnchor = function (e, t) {
            return new s(this, e, t);
          }),
          (e.prototype.$detectNewLine = function (e) {
            var t = e.match(/^.*?(\r\n|\r|\n)/m);
            (this.$autoNewLine = t ? t[1] : "\n"),
              this._signal("changeNewLineMode");
          }),
          (e.prototype.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
              case "windows":
                return "\r\n";
              case "unix":
                return "\n";
              default:
                return this.$autoNewLine || "\n";
            }
          }),
          (e.prototype.setNewLineMode = function (e) {
            this.$newLineMode !== e &&
              ((this.$newLineMode = e), this._signal("changeNewLineMode"));
          }),
          (e.prototype.getNewLineMode = function () {
            return this.$newLineMode;
          }),
          (e.prototype.isNewLine = function (e) {
            return "\r\n" == e || "\r" == e || "\n" == e;
          }),
          (e.prototype.getLine = function (e) {
            return this.$lines[e] || "";
          }),
          (e.prototype.getLines = function (e, t) {
            return this.$lines.slice(e, t + 1);
          }),
          (e.prototype.getAllLines = function () {
            return this.getLines(0, this.getLength());
          }),
          (e.prototype.getLength = function () {
            return this.$lines.length;
          }),
          (e.prototype.getTextRange = function (e) {
            return this.getLinesForRange(e).join(this.getNewLineCharacter());
          }),
          (e.prototype.getLinesForRange = function (e) {
            var t;
            if (e.start.row === e.end.row)
              t = [
                this.getLine(e.start.row).substring(
                  e.start.column,
                  e.end.column
                ),
              ];
            else {
              (t = this.getLines(e.start.row, e.end.row))[0] = (
                t[0] || ""
              ).substring(e.start.column);
              var n = t.length - 1;
              e.end.row - e.start.row == n &&
                (t[n] = t[n].substring(0, e.end.column));
            }
            return t;
          }),
          (e.prototype.insertLines = function (e, t) {
            return (
              console.warn(
                "Use of document.insertLines is deprecated. Use the insertFullLines method instead."
              ),
              this.insertFullLines(e, t)
            );
          }),
          (e.prototype.removeLines = function (e, t) {
            return (
              console.warn(
                "Use of document.removeLines is deprecated. Use the removeFullLines method instead."
              ),
              this.removeFullLines(e, t)
            );
          }),
          (e.prototype.insertNewLine = function (e) {
            return (
              console.warn(
                "Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."
              ),
              this.insertMergedLines(e, ["", ""])
            );
          }),
          (e.prototype.insert = function (e, t) {
            return (
              this.getLength() <= 1 && this.$detectNewLine(t),
              this.insertMergedLines(e, this.$split(t))
            );
          }),
          (e.prototype.insertInLine = function (e, t) {
            var n = this.clippedPos(e.row, e.column),
              r = this.pos(e.row, e.column + t.length);
            return (
              this.applyDelta(
                { start: n, end: r, action: "insert", lines: [t] },
                !0
              ),
              this.clonePos(r)
            );
          }),
          (e.prototype.clippedPos = function (e, t) {
            var n = this.getLength();
            void 0 === e
              ? (e = n)
              : e < 0
              ? (e = 0)
              : e >= n && ((e = n - 1), (t = void 0));
            var r = this.getLine(e);
            return (
              void 0 == t && (t = r.length),
              { row: e, column: (t = Math.min(Math.max(t, 0), r.length)) }
            );
          }),
          (e.prototype.clonePos = function (e) {
            return { row: e.row, column: e.column };
          }),
          (e.prototype.pos = function (e, t) {
            return { row: e, column: t };
          }),
          (e.prototype.$clipPosition = function (e) {
            var t = this.getLength();
            return (
              e.row >= t
                ? ((e.row = Math.max(0, t - 1)),
                  (e.column = this.getLine(t - 1).length))
                : ((e.row = Math.max(0, e.row)),
                  (e.column = Math.min(
                    Math.max(e.column, 0),
                    this.getLine(e.row).length
                  ))),
              e
            );
          }),
          (e.prototype.insertFullLines = function (e, t) {
            var n = 0;
            (e = Math.min(Math.max(e, 0), this.getLength())) < this.getLength()
              ? ((t = t.concat([""])), (n = 0))
              : ((t = [""].concat(t)), e--, (n = this.$lines[e].length)),
              this.insertMergedLines({ row: e, column: n }, t);
          }),
          (e.prototype.insertMergedLines = function (e, t) {
            var n = this.clippedPos(e.row, e.column),
              r = {
                row: n.row + t.length - 1,
                column: (1 == t.length ? n.column : 0) + t[t.length - 1].length,
              };
            return (
              this.applyDelta({ start: n, end: r, action: "insert", lines: t }),
              this.clonePos(r)
            );
          }),
          (e.prototype.remove = function (e) {
            var t = this.clippedPos(e.start.row, e.start.column),
              n = this.clippedPos(e.end.row, e.end.column);
            return (
              this.applyDelta({
                start: t,
                end: n,
                action: "remove",
                lines: this.getLinesForRange({ start: t, end: n }),
              }),
              this.clonePos(t)
            );
          }),
          (e.prototype.removeInLine = function (e, t, n) {
            var r = this.clippedPos(e, t),
              o = this.clippedPos(e, n);
            return (
              this.applyDelta(
                {
                  start: r,
                  end: o,
                  action: "remove",
                  lines: this.getLinesForRange({ start: r, end: o }),
                },
                !0
              ),
              this.clonePos(r)
            );
          }),
          (e.prototype.removeFullLines = function (e, t) {
            e = Math.min(Math.max(0, e), this.getLength() - 1);
            var n =
                (t = Math.min(Math.max(0, t), this.getLength() - 1)) ==
                  this.getLength() - 1 && e > 0,
              r = t < this.getLength() - 1,
              o = n ? e - 1 : e,
              i = n ? this.getLine(o).length : 0,
              s = r ? t + 1 : t,
              c = r ? 0 : this.getLine(s).length,
              u = new a(o, i, s, c),
              l = this.$lines.slice(e, t + 1);
            return (
              this.applyDelta({
                start: u.start,
                end: u.end,
                action: "remove",
                lines: this.getLinesForRange(u),
              }),
              l
            );
          }),
          (e.prototype.removeNewLine = function (e) {
            e < this.getLength() - 1 &&
              e >= 0 &&
              this.applyDelta({
                start: this.pos(e, this.getLine(e).length),
                end: this.pos(e + 1, 0),
                action: "remove",
                lines: ["", ""],
              });
          }),
          (e.prototype.replace = function (e, t) {
            return (
              e instanceof a || (e = a.fromPoints(e.start, e.end)),
              0 === t.length && e.isEmpty()
                ? e.start
                : t == this.getTextRange(e)
                ? e.end
                : (this.remove(e), t ? this.insert(e.start, t) : e.start)
            );
          }),
          (e.prototype.applyDeltas = function (e) {
            for (var t = 0; t < e.length; t++) this.applyDelta(e[t]);
          }),
          (e.prototype.revertDeltas = function (e) {
            for (var t = e.length - 1; t >= 0; t--) this.revertDelta(e[t]);
          }),
          (e.prototype.applyDelta = function (e, t) {
            var n = "insert" == e.action;
            (n
              ? e.lines.length <= 1 && !e.lines[0]
              : !a.comparePoints(e.start, e.end)) ||
              (n && e.lines.length > 2e4
                ? this.$splitAndapplyLargeDelta(e, 2e4)
                : (o(this.$lines, e, t), this._signal("change", e)));
          }),
          (e.prototype.$safeApplyDelta = function (e) {
            var t = this.$lines.length;
            (("remove" == e.action && e.start.row < t && e.end.row < t) ||
              ("insert" == e.action && e.start.row <= t)) &&
              this.applyDelta(e);
          }),
          (e.prototype.$splitAndapplyLargeDelta = function (e, t) {
            for (
              var n = e.lines,
                r = n.length - t + 1,
                o = e.start.row,
                i = e.start.column,
                a = 0,
                s = 0;
              a < r;
              a = s
            ) {
              s += t - 1;
              var c = n.slice(a, s);
              c.push(""),
                this.applyDelta(
                  {
                    start: this.pos(o + a, i),
                    end: this.pos(o + s, (i = 0)),
                    action: e.action,
                    lines: c,
                  },
                  !0
                );
            }
            (e.lines = n.slice(a)),
              (e.start.row = o + a),
              (e.start.column = i),
              this.applyDelta(e, !0);
          }),
          (e.prototype.revertDelta = function (e) {
            this.$safeApplyDelta({
              start: this.clonePos(e.start),
              end: this.clonePos(e.end),
              action: "insert" == e.action ? "remove" : "insert",
              lines: e.lines.slice(),
            });
          }),
          (e.prototype.indexToPosition = function (e, t) {
            for (
              var n = this.$lines || this.getAllLines(),
                r = this.getNewLineCharacter().length,
                o = t || 0,
                i = n.length;
              o < i;
              o++
            )
              if ((e -= n[o].length + r) < 0)
                return { row: o, column: e + n[o].length + r };
            return { row: i - 1, column: e + n[i - 1].length + r };
          }),
          (e.prototype.positionToIndex = function (e, t) {
            for (
              var n = this.$lines || this.getAllLines(),
                r = this.getNewLineCharacter().length,
                o = 0,
                i = Math.min(e.row, n.length),
                a = t || 0;
              a < i;
              ++a
            )
              o += n[a].length + r;
            return o + e.column;
          }),
          (e.prototype.$split = function (e) {
            return e.split(/\r\n|\r|\n/);
          }),
          e
        );
      })();
    (c.prototype.$autoNewLine = ""),
      (c.prototype.$newLineMode = "auto"),
      r.implement(c.prototype, i),
      (t.Document = c);
  }),
  ace.define("ace/lib/lang", [], function (e, t, n) {
    "use strict";
    (t.last = function (e) {
      return e[e.length - 1];
    }),
      (t.stringReverse = function (e) {
        return e.split("").reverse().join("");
      }),
      (t.stringRepeat = function (e, t) {
        for (var n = ""; t > 0; ) 1 & t && (n += e), (t >>= 1) && (e += e);
        return n;
      });
    var r = /^\s\s*/,
      o = /\s\s*$/;
    (t.stringTrimLeft = function (e) {
      return e.replace(r, "");
    }),
      (t.stringTrimRight = function (e) {
        return e.replace(o, "");
      }),
      (t.copyObject = function (e) {
        var t = {};
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.copyArray = function (e) {
        for (var t = [], n = 0, r = e.length; n < r; n++)
          e[n] && "object" == typeof e[n]
            ? (t[n] = this.copyObject(e[n]))
            : (t[n] = e[n]);
        return t;
      }),
      (t.deepCopy = function e(t) {
        if ("object" !== typeof t || !t) return t;
        var n;
        if (Array.isArray(t)) {
          n = [];
          for (var r = 0; r < t.length; r++) n[r] = e(t[r]);
          return n;
        }
        if ("[object Object]" !== Object.prototype.toString.call(t)) return t;
        for (var r in ((n = {}), t)) n[r] = e(t[r]);
        return n;
      }),
      (t.arrayToMap = function (e) {
        for (var t = {}, n = 0; n < e.length; n++) t[e[n]] = 1;
        return t;
      }),
      (t.createMap = function (e) {
        var t = Object.create(null);
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.arrayRemove = function (e, t) {
        for (var n = 0; n <= e.length; n++) t === e[n] && e.splice(n, 1);
      }),
      (t.escapeRegExp = function (e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      }),
      (t.escapeHTML = function (e) {
        return ("" + e)
          .replace(/&/g, "&#38;")
          .replace(/"/g, "&#34;")
          .replace(/'/g, "&#39;")
          .replace(/</g, "&#60;");
      }),
      (t.getMatchOffsets = function (e, t) {
        var n = [];
        return (
          e.replace(t, function (e) {
            n.push({
              offset: arguments[arguments.length - 2],
              length: e.length,
            });
          }),
          n
        );
      }),
      (t.deferredCall = function (e) {
        var t = null,
          n = function () {
            (t = null), e();
          },
          r = function e(r) {
            return e.cancel(), (t = setTimeout(n, r || 0)), e;
          };
        return (
          (r.schedule = r),
          (r.call = function () {
            return this.cancel(), e(), r;
          }),
          (r.cancel = function () {
            return clearTimeout(t), (t = null), r;
          }),
          (r.isPending = function () {
            return t;
          }),
          r
        );
      }),
      (t.delayedCall = function (e, t) {
        var n = null,
          r = function () {
            (n = null), e();
          },
          o = function (e) {
            null == n && (n = setTimeout(r, e || t));
          };
        return (
          (o.delay = function (e) {
            n && clearTimeout(n), (n = setTimeout(r, e || t));
          }),
          (o.schedule = o),
          (o.call = function () {
            this.cancel(), e();
          }),
          (o.cancel = function () {
            n && clearTimeout(n), (n = null);
          }),
          (o.isPending = function () {
            return n;
          }),
          o
        );
      });
  }),
  ace.define("ace/worker/mirror", [], function (e, t, n) {
    "use strict";
    var r = e("../document").Document,
      o = e("../lib/lang"),
      i = (t.Mirror = function (e) {
        this.sender = e;
        var t = (this.doc = new r("")),
          n = (this.deferredUpdate = o.delayedCall(this.onUpdate.bind(this))),
          i = this;
        e.on("change", function (e) {
          var r = e.data;
          if (r[0].start) t.applyDeltas(r);
          else
            for (var o = 0; o < r.length; o += 2) {
              var a, s;
              if (
                ("insert" ==
                (a = Array.isArray(r[o + 1])
                  ? { action: "insert", start: r[o], lines: r[o + 1] }
                  : { action: "remove", start: r[o], end: r[o + 1] }).action
                  ? a.start
                  : a.end
                ).row >= t.$lines.length
              )
                throw (
                  (((s = new Error("Invalid delta")).data = {
                    path: i.$path,
                    linesLength: t.$lines.length,
                    start: a.start,
                    end: a.end,
                  }),
                  s)
                );
              t.applyDelta(a, !0);
            }
          if (i.$timeout) return n.schedule(i.$timeout);
          i.onUpdate();
        });
      });
    (function () {
      (this.$timeout = 500),
        (this.setTimeout = function (e) {
          this.$timeout = e;
        }),
        (this.setValue = function (e) {
          this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout);
        }),
        (this.getValue = function (e) {
          this.sender.callback(this.doc.getValue(), e);
        }),
        (this.onUpdate = function () {}),
        (this.isPending = function () {
          return this.deferredUpdate.isPending();
        });
    }).call(i.prototype);
  }),
  ace.define("ace/mode/lua/luaparse", [], function (e, t, n) {
    !(function (e) {
      "use strict";
      var t, n, r, o, i;
      e.version = "0.3.1";
      var a = (e.defaultOptions = {
        wait: !1,
        comments: !0,
        scope: !1,
        locations: !1,
        ranges: !1,
        onCreateNode: null,
        onCreateScope: null,
        onDestroyScope: null,
        onLocalDeclaration: null,
        luaVersion: "5.3",
        encodingMode: "none",
      });
      function s(e, t) {
        return (
          (t = t || 0),
          e < 128
            ? String.fromCharCode(e)
            : e < 2048
            ? String.fromCharCode(192 | t | (e >> 6), 128 | t | (63 & e))
            : e < 65536
            ? String.fromCharCode(
                224 | t | (e >> 12),
                128 | t | ((e >> 6) & 63),
                128 | t | (63 & e)
              )
            : e < 1114112
            ? String.fromCharCode(
                240 | t | (e >> 18),
                128 | t | ((e >> 12) & 63),
                128 | t | ((e >> 6) & 63),
                128 | t | (63 & e)
              )
            : null
        );
      }
      function c(e, t) {
        for (var n = e.toString(16); n.length < t; ) n = "0" + n;
        return n;
      }
      function u(e) {
        return function (t) {
          var n = e.exec(t);
          if (!n) return t;
          F(null, b.invalidCodeUnit, c(n[0].charCodeAt(0), 4).toUpperCase());
        };
      }
      var l = {
          "pseudo-latin1": {
            fixup: u(/[^\x00-\xff]/),
            encodeByte: function (e) {
              return null === e ? "" : String.fromCharCode(e);
            },
            encodeUTF8: function (e) {
              return s(e);
            },
          },
          "x-user-defined": {
            fixup: u(/[^\x00-\x7f\uf780-\uf7ff]/),
            encodeByte: function (e) {
              return null === e
                ? ""
                : e >= 128
                ? String.fromCharCode(63232 | e)
                : String.fromCharCode(e);
            },
            encodeUTF8: function (e) {
              return s(e, 63232);
            },
          },
          none: {
            discardStrings: !0,
            fixup: function (e) {
              return e;
            },
            encodeByte: function (e) {
              return "";
            },
            encodeUTF8: function (e) {
              return "";
            },
          },
        },
        p = 1,
        f = 2,
        h = 4,
        d = 8,
        m = 16,
        g = 32,
        v = 64,
        y = 128,
        w = 256;
      e.tokenTypes = {
        EOF: p,
        StringLiteral: f,
        Keyword: h,
        Identifier: d,
        NumericLiteral: m,
        Punctuator: g,
        BooleanLiteral: v,
        NilLiteral: y,
        VarargLiteral: w,
      };
      var b = (e.errors = {
          unexpected: "unexpected %1 '%2' near '%3'",
          unexpectedEOF: "unexpected symbol near '<eof>'",
          expected: "'%1' expected near '%2'",
          expectedToken: "%1 expected near '%2'",
          unfinishedString: "unfinished string near '%1'",
          malformedNumber: "malformed number near '%1'",
          decimalEscapeTooLarge: "decimal escape too large near '%1'",
          invalidEscape: "invalid escape sequence near '%1'",
          hexadecimalDigitExpected: "hexadecimal digit expected near '%1'",
          braceExpected: "missing '%1' near '%2'",
          tooLargeCodepoint: "UTF-8 value too large near '%1'",
          unfinishedLongString:
            "unfinished long string (starting at line %1) near '%2'",
          unfinishedLongComment:
            "unfinished long comment (starting at line %1) near '%2'",
          ambiguousSyntax:
            "ambiguous syntax (function call x new statement) near '%1'",
          noLoopToBreak: "no loop to break near '%1'",
          labelAlreadyDefined: "label '%1' already defined on line %2",
          labelNotVisible: "no visible label '%1' for <goto>",
          gotoJumpInLocalScope: "<goto %1> jumps into the scope of local '%2'",
          cannotUseVararg:
            "cannot use '...' outside a vararg function near '%1'",
          invalidCodeUnit:
            "code unit U+%1 is not allowed in the current encoding mode",
        }),
        x = (e.ast = {
          labelStatement: function (e) {
            return { type: "LabelStatement", label: e };
          },
          breakStatement: function () {
            return { type: "BreakStatement" };
          },
          gotoStatement: function (e) {
            return { type: "GotoStatement", label: e };
          },
          returnStatement: function (e) {
            return { type: "ReturnStatement", arguments: e };
          },
          ifStatement: function (e) {
            return { type: "IfStatement", clauses: e };
          },
          ifClause: function (e, t) {
            return { type: "IfClause", condition: e, body: t };
          },
          elseifClause: function (e, t) {
            return { type: "ElseifClause", condition: e, body: t };
          },
          elseClause: function (e) {
            return { type: "ElseClause", body: e };
          },
          whileStatement: function (e, t) {
            return { type: "WhileStatement", condition: e, body: t };
          },
          doStatement: function (e) {
            return { type: "DoStatement", body: e };
          },
          repeatStatement: function (e, t) {
            return { type: "RepeatStatement", condition: e, body: t };
          },
          localStatement: function (e, t) {
            return { type: "LocalStatement", variables: e, init: t };
          },
          assignmentStatement: function (e, t) {
            return { type: "AssignmentStatement", variables: e, init: t };
          },
          callStatement: function (e) {
            return { type: "CallStatement", expression: e };
          },
          functionStatement: function (e, t, n, r) {
            return {
              type: "FunctionDeclaration",
              identifier: e,
              isLocal: n,
              parameters: t,
              body: r,
            };
          },
          forNumericStatement: function (e, t, n, r, o) {
            return {
              type: "ForNumericStatement",
              variable: e,
              start: t,
              end: n,
              step: r,
              body: o,
            };
          },
          forGenericStatement: function (e, t, n) {
            return {
              type: "ForGenericStatement",
              variables: e,
              iterators: t,
              body: n,
            };
          },
          chunk: function (e) {
            return { type: "Chunk", body: e };
          },
          identifier: function (e) {
            return { type: "Identifier", name: e };
          },
          literal: function (e, t, n) {
            return {
              type: (e =
                e === f
                  ? "StringLiteral"
                  : e === m
                  ? "NumericLiteral"
                  : e === v
                  ? "BooleanLiteral"
                  : e === y
                  ? "NilLiteral"
                  : "VarargLiteral"),
              value: t,
              raw: n,
            };
          },
          tableKey: function (e, t) {
            return { type: "TableKey", key: e, value: t };
          },
          tableKeyString: function (e, t) {
            return { type: "TableKeyString", key: e, value: t };
          },
          tableValue: function (e) {
            return { type: "TableValue", value: e };
          },
          tableConstructorExpression: function (e) {
            return { type: "TableConstructorExpression", fields: e };
          },
          binaryExpression: function (e, t, n) {
            return {
              type:
                "and" === e || "or" === e
                  ? "LogicalExpression"
                  : "BinaryExpression",
              operator: e,
              left: t,
              right: n,
            };
          },
          unaryExpression: function (e, t) {
            return { type: "UnaryExpression", operator: e, argument: t };
          },
          memberExpression: function (e, t, n) {
            return {
              type: "MemberExpression",
              indexer: t,
              identifier: n,
              base: e,
            };
          },
          indexExpression: function (e, t) {
            return { type: "IndexExpression", base: e, index: t };
          },
          callExpression: function (e, t) {
            return { type: "CallExpression", base: e, arguments: t };
          },
          tableCallExpression: function (e, t) {
            return { type: "TableCallExpression", base: e, arguments: t };
          },
          stringCallExpression: function (e, t) {
            return { type: "StringCallExpression", base: e, argument: t };
          },
          comment: function (e, t) {
            return { type: "Comment", value: e, raw: t };
          },
        });
      function L(e) {
        if (Ee) {
          var t = Ae.pop();
          t.complete(), t.bless(e);
        }
        return n.onCreateNode && n.onCreateNode(e), e;
      }
      var S = Array.prototype.slice,
        C =
          (Object.prototype.toString,
          function (e, t) {
            for (var n = 0, r = e.length; n < r; ++n) if (e[n] === t) return n;
            return -1;
          });
      function E(e, t, n) {
        for (var r = 0, o = e.length; r < o; ++r) if (e[r][t] === n) return r;
        return -1;
      }
      function A(e) {
        var t = S.call(arguments, 1);
        return (
          (e = e.replace(/%(\d)/g, function (e, n) {
            return "" + t[n - 1] || "";
          })),
          e
        );
      }
      Array.prototype.indexOf &&
        (C = function (e, t) {
          return e.indexOf(t);
        });
      var k,
        D,
        P,
        M,
        O,
        $,
        _,
        N,
        T,
        R,
        j,
        U = function (e) {
          for (
            var t, n, r = S.call(arguments, 1), o = 0, i = r.length;
            o < i;
            ++o
          )
            for (n in (t = r[o]))
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          return e;
        };
      function I(e) {
        return Object.create
          ? Object.create(e, {
              line: { writable: !0, value: e.line },
              index: { writable: !0, value: e.index },
              column: { writable: !0, value: e.column },
            })
          : e;
      }
      function F(e) {
        var t,
          n,
          r = A.apply(null, S.call(arguments, 1));
        throw (
          (null === e || "undefined" === typeof e.line
            ? ((n = k - N + 1),
              ((t = I(new SyntaxError(A("[%1:%2] %3", _, n, r)))).index = k),
              (t.line = _),
              (t.column = n))
            : ((n = e.range[0] - e.lineStart),
              ((t = I(new SyntaxError(A("[%1:%2] %3", e.line, n, r)))).line =
                e.line),
              (t.index = e.range[0]),
              (t.column = n)),
          t)
        );
      }
      function q(e) {
        var n = t.slice(e.range[0], e.range[1]);
        return n || e.value;
      }
      function V(e, t) {
        F(t, b.expectedToken, e, q(t));
      }
      function G(e) {
        var t = q(M);
        if ("undefined" !== typeof e.type) {
          var n;
          switch (e.type) {
            case f:
              n = "string";
              break;
            case h:
              n = "keyword";
              break;
            case d:
              n = "identifier";
              break;
            case m:
              n = "number";
              break;
            case g:
              n = "symbol";
              break;
            case v:
              n = "boolean";
              break;
            case y:
              return F(e, b.unexpected, "symbol", "nil", t);
            case p:
              return F(e, b.unexpectedEOF);
          }
          return F(e, b.unexpected, n, q(e), t);
        }
        return F(e, b.unexpected, "symbol", e, t);
      }
      function B() {
        for (z(); 45 === t.charCodeAt(k) && 45 === t.charCodeAt(k + 1); )
          ie(), z();
        if (k >= r)
          return {
            type: p,
            value: "<eof>",
            line: _,
            lineStart: N,
            range: [k, k],
          };
        var e = t.charCodeAt(k),
          n = t.charCodeAt(k + 1);
        if ((($ = k), de(e))) return K();
        switch (e) {
          case 39:
          case 34:
            return X();
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
            return Y();
          case 46:
            return fe(n)
              ? Y()
              : 46 === n
              ? 46 === t.charCodeAt(k + 2)
                ? J()
                : W("..")
              : W(".");
          case 61:
            return W(61 === n ? "==" : "=");
          case 62:
            return o.bitwiseOperators && 62 === n
              ? W(">>")
              : W(61 === n ? ">=" : ">");
          case 60:
            return o.bitwiseOperators && 60 === n
              ? W("<<")
              : W(61 === n ? "<=" : "<");
          case 126:
            if (61 === n) return W("~=");
            if (!o.bitwiseOperators) break;
            return W("~");
          case 58:
            return o.labels && 58 === n ? W("::") : W(":");
          case 91:
            return 91 === n || 61 === n ? Q() : W("[");
          case 47:
            return o.integerDivision && 47 === n ? W("//") : W("/");
          case 38:
          case 124:
            if (!o.bitwiseOperators) break;
          case 42:
          case 94:
          case 37:
          case 44:
          case 123:
          case 125:
          case 93:
          case 40:
          case 41:
          case 59:
          case 35:
          case 45:
          case 43:
            return W(t.charAt(k));
        }
        return G(t.charAt(k));
      }
      function H() {
        var e = t.charCodeAt(k),
          n = t.charCodeAt(k + 1);
        return (
          !!pe(e) &&
          (10 === e && 13 === n && ++k,
          13 === e && 10 === n && ++k,
          ++_,
          (N = ++k),
          !0)
        );
      }
      function z() {
        for (; k < r; )
          if (le(t.charCodeAt(k))) ++k;
          else if (!H()) break;
      }
      function K() {
        for (var e, n; me(t.charCodeAt(++k)); );
        return (
          ge((e = i.fixup(t.slice($, k))))
            ? (n = h)
            : "true" === e || "false" === e
            ? ((n = v), (e = "true" === e))
            : "nil" === e
            ? ((n = y), (e = null))
            : (n = d),
          { type: n, value: e, line: _, lineStart: N, range: [$, k] }
        );
      }
      function W(e) {
        return (
          (k += e.length),
          { type: g, value: e, line: _, lineStart: N, range: [$, k] }
        );
      }
      function J() {
        return {
          type: w,
          value: "...",
          line: _,
          lineStart: N,
          range: [$, (k += 3)],
        };
      }
      function X() {
        for (
          var e,
            n = t.charCodeAt(k++),
            o = _,
            a = N,
            s = k,
            c = i.discardStrings ? null : "";
          n !== (e = t.charCodeAt(k++));

        )
          if (
            ((k > r || pe(e)) &&
              ((c += t.slice(s, k - 1)),
              F(null, b.unfinishedString, t.slice($, k - 1))),
            92 === e)
          ) {
            if (!i.discardStrings) {
              var u = t.slice(s, k - 1);
              c += i.fixup(u);
            }
            var l = oe();
            i.discardStrings || (c += l), (s = k);
          }
        return (
          i.discardStrings ||
            ((c += i.encodeByte(null)), (c += i.fixup(t.slice(s, k - 1)))),
          {
            type: f,
            value: c,
            line: o,
            lineStart: a,
            lastLine: _,
            lastLineStart: N,
            range: [$, k],
          }
        );
      }
      function Q() {
        var e = _,
          t = N,
          n = ae(!1);
        return (
          !1 === n && F(D, b.expected, "[", q(D)),
          {
            type: f,
            value: i.discardStrings ? null : i.fixup(n),
            line: e,
            lineStart: t,
            lastLine: _,
            lastLineStart: N,
            range: [$, k],
          }
        );
      }
      function Y() {
        var e = t.charAt(k),
          n = t.charAt(k + 1),
          r = "0" === e && "xX".indexOf(n || null) >= 0 ? te() : ne(),
          o = Z();
        return (
          ee() &&
            (o || r.hasFractionPart) &&
            F(null, b.malformedNumber, t.slice($, k)),
          { type: m, value: r.value, line: _, lineStart: N, range: [$, k] }
        );
      }
      function Z() {
        if (o.imaginaryNumbers)
          return "iI".indexOf(t.charAt(k) || null) >= 0 && (++k, !0);
      }
      function ee() {
        if (o.integerSuffixes)
          if ("uU".indexOf(t.charAt(k) || null) >= 0)
            if ((++k, "lL".indexOf(t.charAt(k) || null) >= 0)) {
              if ((++k, "lL".indexOf(t.charAt(k) || null) >= 0))
                return ++k, "ULL";
              F(null, b.malformedNumber, t.slice($, k));
            } else F(null, b.malformedNumber, t.slice($, k));
          else if ("lL".indexOf(t.charAt(k) || null) >= 0) {
            if ((++k, "lL".indexOf(t.charAt(k) || null) >= 0)) return ++k, "LL";
            F(null, b.malformedNumber, t.slice($, k));
          }
      }
      function te() {
        var e,
          n,
          r,
          o,
          i = 0,
          a = 1,
          s = 1;
        for (
          o = k += 2,
            he(t.charCodeAt(k)) || F(null, b.malformedNumber, t.slice($, k));
          he(t.charCodeAt(k));

        )
          ++k;
        e = parseInt(t.slice(o, k), 16);
        var c = !1;
        if ("." === t.charAt(k)) {
          for (c = !0, n = ++k; he(t.charCodeAt(k)); ) ++k;
          (i = t.slice(n, k)),
            (i = n === k ? 0 : parseInt(i, 16) / Math.pow(16, k - n));
        }
        var u = !1;
        if ("pP".indexOf(t.charAt(k) || null) >= 0) {
          for (
            u = !0,
              ++k,
              "+-".indexOf(t.charAt(k) || null) >= 0 &&
                (s = "+" === t.charAt(k++) ? 1 : -1),
              r = k,
              fe(t.charCodeAt(k)) || F(null, b.malformedNumber, t.slice($, k));
            fe(t.charCodeAt(k));

          )
            ++k;
          (a = t.slice(r, k)), (a = Math.pow(2, a * s));
        }
        return { value: (e + i) * a, hasFractionPart: c || u };
      }
      function ne() {
        for (; fe(t.charCodeAt(k)); ) ++k;
        var e = !1;
        if ("." === t.charAt(k)) for (e = !0, ++k; fe(t.charCodeAt(k)); ) ++k;
        var n = !1;
        if ("eE".indexOf(t.charAt(k) || null) >= 0)
          for (
            n = !0,
              ++k,
              "+-".indexOf(t.charAt(k) || null) >= 0 && ++k,
              fe(t.charCodeAt(k)) || F(null, b.malformedNumber, t.slice($, k));
            fe(t.charCodeAt(k));

          )
            ++k;
        return { value: parseFloat(t.slice($, k)), hasFractionPart: e || n };
      }
      function re() {
        var e = k++;
        for (
          "{" !== t.charAt(k++) &&
            F(null, b.braceExpected, "{", "\\" + t.slice(e, k)),
            he(t.charCodeAt(k)) ||
              F(null, b.hexadecimalDigitExpected, "\\" + t.slice(e, k));
          48 === t.charCodeAt(k);

        )
          ++k;
        for (var n = k; he(t.charCodeAt(k)); )
          ++k - n > 6 && F(null, b.tooLargeCodepoint, "\\" + t.slice(e, k));
        var r = t.charAt(k++);
        "}" !== r &&
          ('"' === r || "'" === r
            ? F(null, b.braceExpected, "}", "\\" + t.slice(e, k--))
            : F(null, b.hexadecimalDigitExpected, "\\" + t.slice(e, k)));
        var o = parseInt(t.slice(n, k - 1) || "0", 16),
          a = "\\" + t.slice(e, k);
        return (
          o > 1114111 && F(null, b.tooLargeCodepoint, a), i.encodeUTF8(o, a)
        );
      }
      function oe() {
        var e = k;
        switch (t.charAt(k)) {
          case "a":
            return ++k, "\x07";
          case "n":
            return ++k, "\n";
          case "r":
            return ++k, "\r";
          case "t":
            return ++k, "\t";
          case "v":
            return ++k, "\v";
          case "b":
            return ++k, "\b";
          case "f":
            return ++k, "\f";
          case "\r":
          case "\n":
            return H(), "\n";
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            for (; fe(t.charCodeAt(k)) && k - e < 3; ) ++k;
            var n = t.slice(e, k),
              r = parseInt(n, 10);
            return (
              r > 255 && F(null, b.decimalEscapeTooLarge, "\\" + r),
              i.encodeByte(r, "\\" + n)
            );
          case "z":
            if (o.skipWhitespaceEscape) return ++k, z(), "";
            break;
          case "x":
            if (o.hexEscapes) {
              if (he(t.charCodeAt(k + 1)) && he(t.charCodeAt(k + 2)))
                return (
                  (k += 3),
                  i.encodeByte(
                    parseInt(t.slice(e + 1, k), 16),
                    "\\" + t.slice(e, k)
                  )
                );
              F(null, b.hexadecimalDigitExpected, "\\" + t.slice(e, k + 2));
            }
            break;
          case "u":
            if (o.unicodeEscapes) return re();
            break;
          case "\\":
          case '"':
          case "'":
            return t.charAt(k++);
        }
        return (
          o.strictEscapes && F(null, b.invalidEscape, "\\" + t.slice(e, k + 1)),
          t.charAt(k++)
        );
      }
      function ie() {
        ($ = k), (k += 2);
        var e = t.charAt(k),
          o = "",
          i = !1,
          a = k,
          s = N,
          c = _;
        if (("[" === e && (!1 === (o = ae(!0)) ? (o = e) : (i = !0)), !i)) {
          for (; k < r && !pe(t.charCodeAt(k)); ) ++k;
          n.comments && (o = t.slice(a, k));
        }
        if (n.comments) {
          var u = x.comment(o, t.slice($, k));
          n.locations &&
            (u.loc = {
              start: { line: c, column: $ - s },
              end: { line: _, column: k - N },
            }),
            n.ranges && (u.range = [$, k]),
            n.onCreateNode && n.onCreateNode(u),
            O.push(u);
        }
      }
      function ae(e) {
        var n,
          o = 0,
          i = "",
          a = !1,
          s = _;
        for (++k; "=" === t.charAt(k + o); ) ++o;
        if ("[" !== t.charAt(k + o)) return !1;
        for (k += o + 1, pe(t.charCodeAt(k)) && H(), n = k; k < r; ) {
          for (; pe(t.charCodeAt(k)); ) H();
          if ("]" === t.charAt(k++)) {
            a = !0;
            for (var c = 0; c < o; ++c) "=" !== t.charAt(k + c) && (a = !1);
            "]" !== t.charAt(k + o) && (a = !1);
          }
          if (a) return (i += t.slice(n, k - 1)), (k += o + 1), i;
        }
        F(
          null,
          e ? b.unfinishedLongComment : b.unfinishedLongString,
          s,
          "<eof>"
        );
      }
      function se() {
        (P = D), (D = M), (M = B());
      }
      function ce(e) {
        return e === D.value && (se(), !0);
      }
      function ue(e) {
        e === D.value ? se() : F(D, b.expected, e, q(D));
      }
      function le(e) {
        return 9 === e || 32 === e || 11 === e || 12 === e;
      }
      function pe(e) {
        return 10 === e || 13 === e;
      }
      function fe(e) {
        return e >= 48 && e <= 57;
      }
      function he(e) {
        return (
          (e >= 48 && e <= 57) || (e >= 97 && e <= 102) || (e >= 65 && e <= 70)
        );
      }
      function de(e) {
        return (
          (e >= 65 && e <= 90) ||
          (e >= 97 && e <= 122) ||
          95 === e ||
          !!(o.extendedIdentifiers && e >= 128)
        );
      }
      function me(e) {
        return (
          (e >= 65 && e <= 90) ||
          (e >= 97 && e <= 122) ||
          95 === e ||
          (e >= 48 && e <= 57) ||
          !!(o.extendedIdentifiers && e >= 128)
        );
      }
      function ge(e) {
        switch (e.length) {
          case 2:
            return "do" === e || "if" === e || "in" === e || "or" === e;
          case 3:
            return "and" === e || "end" === e || "for" === e || "not" === e;
          case 4:
            return (
              "else" === e ||
              "then" === e ||
              (!(!o.labels || o.contextualGoto) && "goto" === e)
            );
          case 5:
            return (
              "break" === e || "local" === e || "until" === e || "while" === e
            );
          case 6:
            return "elseif" === e || "repeat" === e || "return" === e;
          case 8:
            return "function" === e;
        }
        return !1;
      }
      function ve(e) {
        return g === e.type
          ? "#-~".indexOf(e.value) >= 0
          : h === e.type && "not" === e.value;
      }
      function ye(e) {
        if (p === e.type) return !0;
        if (h !== e.type) return !1;
        switch (e.value) {
          case "else":
          case "elseif":
          case "end":
          case "until":
            return !0;
          default:
            return !1;
        }
      }
      function we() {
        var e = T[R++].slice();
        T.push(e), n.onCreateScope && n.onCreateScope();
      }
      function be() {
        T.pop(), --R, n.onDestroyScope && n.onDestroyScope();
      }
      function xe(e) {
        n.onLocalDeclaration && n.onLocalDeclaration(e),
          -1 === C(T[R], e) && T[R].push(e);
      }
      function Le(e) {
        xe(e.name), Se(e, !0);
      }
      function Se(e, t) {
        t || -1 !== E(j, "name", e.name) || j.push(e), (e.isLocal = t);
      }
      function Ce(e) {
        return -1 !== C(T[R], e);
      }
      Object.assign && (U = Object.assign),
        (e.SyntaxError = SyntaxError),
        (e.lex = B);
      var Ee,
        Ae = [];
      function ke() {
        return new De(D);
      }
      function De(e) {
        n.locations &&
          (this.loc = {
            start: { line: e.line, column: e.range[0] - e.lineStart },
            end: { line: 0, column: 0 },
          }),
          n.ranges && (this.range = [e.range[0], 0]);
      }
      function Pe() {
        Ee && Ae.push(ke());
      }
      function Me(e) {
        Ee && Ae.push(e);
      }
      function Oe() {
        (this.scopes = []), (this.pendingGotos = []);
      }
      function $e() {
        (this.level = 0), (this.loopLevels = []);
      }
      function _e() {
        return o.labels ? new Oe() : new $e();
      }
      function Ne() {
        se(), Pe(), n.scope && we();
        var e = _e();
        (e.allowVararg = !0), e.pushScope();
        var t = Te(e);
        return (
          e.popScope(),
          n.scope && be(),
          p !== D.type && G(D),
          Ee && !t.length && (P = D),
          L(x.chunk(t))
        );
      }
      function Te(e) {
        for (var t, n = []; !ye(D); ) {
          if (
            "return" === D.value ||
            (!o.relaxedBreak && "break" === D.value)
          ) {
            n.push(Re(e));
            break;
          }
          (t = Re(e)), ce(";"), t && n.push(t);
        }
        return n;
      }
      function Re(e) {
        if ((Pe(), g === D.type && ce("::"))) return je(e);
        if (!o.emptyStatement || !ce(";")) {
          if ((e.raiseDeferredErrors(), h === D.type))
            switch (D.value) {
              case "local":
                return se(), ze(e);
              case "if":
                return se(), Be(e);
              case "return":
                return se(), Ge(e);
              case "function":
                return se(), Je(Xe());
              case "while":
                return se(), qe(e);
              case "for":
                return se(), He(e);
              case "repeat":
                return se(), Ve(e);
              case "break":
                return (
                  se(), e.isInLoop() || F(D, b.noLoopToBreak, D.value), Ue()
                );
              case "do":
                return se(), Fe(e);
              case "goto":
                return se(), Ie(e);
            }
          return o.contextualGoto &&
            D.type === d &&
            "goto" === D.value &&
            M.type === d &&
            "goto" !== M.value
            ? (se(), Ie(e))
            : (Ee && Ae.pop(), Ke(e));
        }
        Ee && Ae.pop();
      }
      function je(e) {
        var t = D,
          r = We();
        return (
          n.scope && (xe("::" + t.value + "::"), Se(r, !0)),
          ue("::"),
          e.addLabel(t.value, t),
          L(x.labelStatement(r))
        );
      }
      function Ue() {
        return L(x.breakStatement());
      }
      function Ie(e) {
        var t = D.value,
          n = P,
          r = We();
        return e.addGoto(t, n), L(x.gotoStatement(r));
      }
      function Fe(e) {
        n.scope && we(), e.pushScope();
        var t = Te(e);
        return e.popScope(), n.scope && be(), ue("end"), L(x.doStatement(t));
      }
      function qe(e) {
        var t = Ze(e);
        ue("do"), n.scope && we(), e.pushScope(!0);
        var r = Te(e);
        return (
          e.popScope(), n.scope && be(), ue("end"), L(x.whileStatement(t, r))
        );
      }
      function Ve(e) {
        n.scope && we(), e.pushScope(!0);
        var t = Te(e);
        ue("until"), e.raiseDeferredErrors();
        var r = Ze(e);
        return e.popScope(), n.scope && be(), L(x.repeatStatement(r, t));
      }
      function Ge(e) {
        var t = [];
        if ("end" !== D.value) {
          var n = Ye(e);
          for (null != n && t.push(n); ce(","); ) (n = Ze(e)), t.push(n);
          ce(";");
        }
        return L(x.returnStatement(t));
      }
      function Be(e) {
        var t,
          r,
          o,
          i = [];
        for (
          Ee && ((o = Ae[Ae.length - 1]), Ae.push(o)),
            t = Ze(e),
            ue("then"),
            n.scope && we(),
            e.pushScope(),
            r = Te(e),
            e.popScope(),
            n.scope && be(),
            i.push(L(x.ifClause(t, r))),
            Ee && (o = ke());
          ce("elseif");

        )
          Me(o),
            (t = Ze(e)),
            ue("then"),
            n.scope && we(),
            e.pushScope(),
            (r = Te(e)),
            e.popScope(),
            n.scope && be(),
            i.push(L(x.elseifClause(t, r))),
            Ee && (o = ke());
        return (
          ce("else") &&
            (Ee && ((o = new De(P)), Ae.push(o)),
            n.scope && we(),
            e.pushScope(),
            (r = Te(e)),
            e.popScope(),
            n.scope && be(),
            i.push(L(x.elseClause(r)))),
          ue("end"),
          L(x.ifStatement(i))
        );
      }
      function He(e) {
        var t,
          r = We();
        if ((n.scope && (we(), Le(r)), ce("="))) {
          var o = Ze(e);
          ue(",");
          var i = Ze(e),
            a = ce(",") ? Ze(e) : null;
          return (
            ue("do"),
            e.pushScope(!0),
            (t = Te(e)),
            e.popScope(),
            ue("end"),
            n.scope && be(),
            L(x.forNumericStatement(r, o, i, a, t))
          );
        }
        for (var s = [r]; ce(","); ) (r = We()), n.scope && Le(r), s.push(r);
        ue("in");
        var c = [];
        do {
          var u = Ze(e);
          c.push(u);
        } while (ce(","));
        return (
          ue("do"),
          e.pushScope(!0),
          (t = Te(e)),
          e.popScope(),
          ue("end"),
          n.scope && be(),
          L(x.forGenericStatement(s, c, t))
        );
      }
      function ze(e) {
        var t,
          r = P;
        if (d === D.type) {
          var o = [],
            i = [];
          do {
            (t = We()), o.push(t), e.addLocal(t.name, r);
          } while (ce(","));
          if (ce("="))
            do {
              var a = Ze(e);
              i.push(a);
            } while (ce(","));
          if (n.scope) for (var s = 0, c = o.length; s < c; ++s) Le(o[s]);
          return L(x.localStatement(o, i));
        }
        if (ce("function"))
          return (
            (t = We()),
            e.addLocal(t.name, r),
            n.scope && (Le(t), we()),
            Je(t, !0)
          );
        V("<name>", D);
      }
      function Ke(e) {
        var t,
          r,
          o,
          i,
          a,
          s = [];
        for (Ee && (r = ke()); ; ) {
          if ((Ee && (t = ke()), d === D.type))
            (a = D.value), (i = We()), n.scope && Se(i, Ce(a)), (o = !0);
          else {
            if ("(" !== D.value) return G(D);
            se(), (i = Ze(e)), ue(")"), (o = !1);
          }
          e: for (;;) {
            switch (f === D.type ? '"' : D.value) {
              case ".":
              case "[":
                o = !0;
                break;
              case ":":
              case "(":
              case "{":
              case '"':
                o = null;
                break;
              default:
                break e;
            }
            i = nt(i, t, e);
          }
          if ((s.push(i), "," !== D.value)) break;
          if (!o) return G(D);
          se();
        }
        if (1 === s.length && null === o)
          return Me(t), L(x.callStatement(s[0]));
        if (!o) return G(D);
        ue("=");
        var c = [];
        do {
          c.push(Ze(e));
        } while (ce(","));
        return Me(r), L(x.assignmentStatement(s, c));
      }
      function We() {
        Pe();
        var e = D.value;
        return d !== D.type && V("<name>", D), se(), L(x.identifier(e));
      }
      function Je(e, t) {
        var r = _e();
        r.pushScope();
        var o = [];
        if ((ue("("), !ce(")")))
          for (;;) {
            if (d === D.type) {
              var i = We();
              if ((n.scope && Le(i), o.push(i), ce(","))) continue;
            } else
              w === D.type
                ? ((r.allowVararg = !0), o.push(it(r)))
                : V("<name> or '...'", D);
            ue(")");
            break;
          }
        var a = Te(r);
        return (
          r.popScope(),
          ue("end"),
          n.scope && be(),
          (t = t || !1),
          L(x.functionStatement(e, o, t, a))
        );
      }
      function Xe() {
        var e, t, r;
        for (
          Ee && (r = ke()), e = We(), n.scope && (Se(e, Ce(e.name)), we());
          ce(".");

        )
          Me(r), (t = We()), (e = L(x.memberExpression(e, ".", t)));
        return (
          ce(":") &&
            (Me(r),
            (t = We()),
            (e = L(x.memberExpression(e, ":", t))),
            n.scope && xe("self")),
          e
        );
      }
      function Qe(e) {
        for (var t, n, r = []; ; ) {
          if ((Pe(), g === D.type && ce("[")))
            (t = Ze(e)),
              ue("]"),
              ue("="),
              (n = Ze(e)),
              r.push(L(x.tableKey(t, n)));
          else if (d === D.type)
            "=" === M.value
              ? ((t = We()),
                se(),
                (n = Ze(e)),
                r.push(L(x.tableKeyString(t, n))))
              : ((n = Ze(e)), r.push(L(x.tableValue(n))));
          else {
            if (null == (n = Ye(e))) {
              Ae.pop();
              break;
            }
            r.push(L(x.tableValue(n)));
          }
          if (!(",;".indexOf(D.value) >= 0)) break;
          se();
        }
        return ue("}"), L(x.tableConstructorExpression(r));
      }
      function Ye(e) {
        return tt(0, e);
      }
      function Ze(e) {
        var t = Ye(e);
        if (null != t) return t;
        V("<expression>", D);
      }
      function et(e) {
        var t = e.charCodeAt(0),
          n = e.length;
        if (1 === n)
          switch (t) {
            case 94:
              return 12;
            case 42:
            case 47:
            case 37:
              return 10;
            case 43:
            case 45:
              return 9;
            case 38:
              return 6;
            case 126:
              return 5;
            case 124:
              return 4;
            case 60:
            case 62:
              return 3;
          }
        else if (2 === n)
          switch (t) {
            case 47:
              return 10;
            case 46:
              return 8;
            case 60:
            case 62:
              return "<<" === e || ">>" === e ? 7 : 3;
            case 61:
            case 126:
              return 3;
            case 111:
              return 1;
          }
        else if (97 === t && "and" === e) return 2;
        return 0;
      }
      function tt(e, t) {
        var n,
          r,
          o,
          i = D.value;
        if ((Ee && (r = ke()), ve(D))) {
          Pe(), se();
          var a = tt(10, t);
          null == a && V("<expression>", D), (n = L(x.unaryExpression(i, a)));
        }
        if ((null == n && null == (n = it(t)) && (n = rt(t)), null == n))
          return null;
        for (
          ;
          (i = D.value),
            !(0 === (o = g === D.type || h === D.type ? et(i) : 0) || o <= e);

        ) {
          ("^" !== i && ".." !== i) || --o, se();
          var s = tt(o, t);
          null == s && V("<expression>", D),
            Ee && Ae.push(r),
            (n = L(x.binaryExpression(i, n, s)));
        }
        return n;
      }
      function nt(e, t, n) {
        var r, o;
        if (g === D.type)
          switch (D.value) {
            case "[":
              return (
                Me(t), se(), (r = Ze(n)), ue("]"), L(x.indexExpression(e, r))
              );
            case ".":
              return Me(t), se(), (o = We()), L(x.memberExpression(e, ".", o));
            case ":":
              return (
                Me(t),
                se(),
                (o = We()),
                (e = L(x.memberExpression(e, ":", o))),
                Me(t),
                ot(e, n)
              );
            case "(":
            case "{":
              return Me(t), ot(e, n);
          }
        else if (f === D.type) return Me(t), ot(e, n);
        return null;
      }
      function rt(e) {
        var t, r, o;
        if ((Ee && (o = ke()), d === D.type))
          (r = D.value), (t = We()), n.scope && Se(t, Ce(r));
        else {
          if (!ce("(")) return null;
          (t = Ze(e)), ue(")");
        }
        for (;;) {
          var i = nt(t, o, e);
          if (null === i) break;
          t = i;
        }
        return t;
      }
      function ot(e, t) {
        if (g === D.type)
          switch (D.value) {
            case "(":
              o.emptyStatement ||
                (D.line !== P.line && F(null, b.ambiguousSyntax, D.value)),
                se();
              var n = [],
                r = Ye(t);
              for (null != r && n.push(r); ce(","); ) (r = Ze(t)), n.push(r);
              return ue(")"), L(x.callExpression(e, n));
            case "{":
              Pe(), se();
              var i = Qe(t);
              return L(x.tableCallExpression(e, i));
          }
        else if (f === D.type) return L(x.stringCallExpression(e, it(t)));
        V("function arguments", D);
      }
      function it(e) {
        var r,
          o = f | m | v | y | w,
          i = D.value,
          a = D.type;
        if (
          (Ee && (r = ke()),
          a !== w || e.allowVararg || F(D, b.cannotUseVararg, D.value),
          a & o)
        ) {
          Me(r);
          var s = t.slice(D.range[0], D.range[1]);
          return se(), L(x.literal(a, i, s));
        }
        return h === a && "function" === i
          ? (Me(r), se(), n.scope && we(), Je(null))
          : ce("{")
          ? (Me(r), Qe(e))
          : void 0;
      }
      (De.prototype.complete = function () {
        n.locations &&
          ((this.loc.end.line = P.lastLine || P.line),
          (this.loc.end.column =
            P.range[1] - (P.lastLineStart || P.lineStart))),
          n.ranges && (this.range[1] = P.range[1]);
      }),
        (De.prototype.bless = function (e) {
          if (this.loc) {
            var t = this.loc;
            e.loc = {
              start: { line: t.start.line, column: t.start.column },
              end: { line: t.end.line, column: t.end.column },
            };
          }
          this.range && (e.range = [this.range[0], this.range[1]]);
        }),
        (Oe.prototype.isInLoop = function () {
          for (var e = this.scopes.length; e-- > 0; )
            if (this.scopes[e].isLoop) return !0;
          return !1;
        }),
        (Oe.prototype.pushScope = function (e) {
          var t = { labels: {}, locals: [], deferredGotos: [], isLoop: !!e };
          this.scopes.push(t);
        }),
        (Oe.prototype.popScope = function () {
          for (var e = 0; e < this.pendingGotos.length; ++e) {
            var t = this.pendingGotos[e];
            t.maxDepth >= this.scopes.length &&
              --t.maxDepth <= 0 &&
              F(t.token, b.labelNotVisible, t.target);
          }
          this.scopes.pop();
        }),
        (Oe.prototype.addGoto = function (e, t) {
          for (var n = [], r = 0; r < this.scopes.length; ++r) {
            var o = this.scopes[r];
            if (
              (n.push(o.locals.length),
              Object.prototype.hasOwnProperty.call(o.labels, e))
            )
              return;
          }
          this.pendingGotos.push({
            maxDepth: this.scopes.length,
            target: e,
            token: t,
            localCounts: n,
          });
        }),
        (Oe.prototype.addLabel = function (e, t) {
          var n = this.currentScope();
          if (Object.prototype.hasOwnProperty.call(n.labels, e))
            F(t, b.labelAlreadyDefined, e, n.labels[e].line);
          else {
            for (var r = [], o = 0; o < this.pendingGotos.length; ++o) {
              var i = this.pendingGotos[o];
              i.maxDepth >= this.scopes.length && i.target === e
                ? i.localCounts[this.scopes.length - 1] < n.locals.length &&
                  n.deferredGotos.push(i)
                : r.push(i);
            }
            this.pendingGotos = r;
          }
          n.labels[e] = { localCount: n.locals.length, line: t.line };
        }),
        (Oe.prototype.addLocal = function (e, t) {
          this.currentScope().locals.push({ name: e, token: t });
        }),
        (Oe.prototype.currentScope = function () {
          return this.scopes[this.scopes.length - 1];
        }),
        (Oe.prototype.raiseDeferredErrors = function () {
          for (
            var e = this.currentScope(), t = e.deferredGotos, n = 0;
            n < t.length;
            ++n
          ) {
            var r = t[n];
            F(
              r.token,
              b.gotoJumpInLocalScope,
              r.target,
              e.locals[r.localCounts[this.scopes.length - 1]].name
            );
          }
        }),
        ($e.prototype.isInLoop = function () {
          return !!this.loopLevels.length;
        }),
        ($e.prototype.pushScope = function (e) {
          ++this.level, e && this.loopLevels.push(this.level);
        }),
        ($e.prototype.popScope = function () {
          var e = this.loopLevels,
            t = e.length;
          t && e[t - 1] === this.level && e.pop(), --this.level;
        }),
        ($e.prototype.addGoto = $e.prototype.addLabel =
          function () {
            throw new Error("This should never happen");
          }),
        ($e.prototype.addLocal = $e.prototype.raiseDeferredErrors =
          function () {}),
        (e.parse = st);
      var at = {
        5.1: {},
        5.2: {
          labels: !0,
          emptyStatement: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          relaxedBreak: !0,
        },
        5.3: {
          labels: !0,
          emptyStatement: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          unicodeEscapes: !0,
          bitwiseOperators: !0,
          integerDivision: !0,
          relaxedBreak: !0,
        },
        LuaJIT: {
          labels: !0,
          contextualGoto: !0,
          hexEscapes: !0,
          skipWhitespaceEscape: !0,
          strictEscapes: !0,
          unicodeEscapes: !0,
          imaginaryNumbers: !0,
          integerSuffixes: !0,
        },
      };
      function st(s, c) {
        if (
          ("undefined" === typeof c &&
            "object" === typeof s &&
            ((c = s), (s = void 0)),
          c || (c = {}),
          (t = s || ""),
          (n = U({}, a, c)),
          (k = 0),
          (_ = 1),
          (N = 0),
          (r = t.length),
          (T = [[]]),
          (R = 0),
          (j = []),
          (Ae = []),
          !Object.prototype.hasOwnProperty.call(at, n.luaVersion))
        )
          throw new Error(A("Lua version '%1' not supported", n.luaVersion));
        if (
          ((o = U({}, at[n.luaVersion])),
          void 0 !== n.extendedIdentifiers &&
            (o.extendedIdentifiers = !!n.extendedIdentifiers),
          !Object.prototype.hasOwnProperty.call(l, n.encodingMode))
        )
          throw new Error(
            A("Encoding mode '%1' not supported", n.encodingMode)
          );
        return (
          (i = l[n.encodingMode]), n.comments && (O = []), n.wait ? e : ut()
        );
      }
      function ct(n) {
        return (t += String(n)), (r = t.length), e;
      }
      function ut(e) {
        "undefined" !== typeof e && ct(e),
          t &&
            "#!" === t.substr(0, 2) &&
            (t = t.replace(/^.*/, function (e) {
              return e.replace(/./g, " ");
            })),
          (r = t.length),
          (Ee = n.locations || n.ranges),
          (M = B());
        var o = Ne();
        if (
          (n.comments && (o.comments = O),
          n.scope && (o.globals = j),
          Ae.length > 0)
        )
          throw new Error(
            "Location tracking failed. This is most likely a bug in luaparse"
          );
        return o;
      }
      (e.write = ct), (e.end = ut);
    })(t);
  }),
  ace.define("ace/mode/lua_worker", [], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      o = e("../worker/mirror").Mirror,
      i = e("../mode/lua/luaparse"),
      a = (t.Worker = function (e) {
        o.call(this, e), this.setTimeout(500);
      });
    r.inherits(a, o),
      function () {
        this.onUpdate = function () {
          var e = this.doc.getValue(),
            t = [];
          try {
            i.parse(e);
          } catch (n) {
            n instanceof i.SyntaxError &&
              t.push({
                row: n.line - 1,
                column: n.column,
                text: n.message,
                type: "error",
              });
          }
          this.sender.emit("annotate", t);
        };
      }.call(a.prototype);
  });
