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
      (t.onerror = function (t, e, n, r, i) {
        postMessage({
          type: "error",
          data: {
            message: t,
            data: i && i.data,
            file: e,
            line: n,
            col: r,
            stack: i && i.stack,
          },
        });
      }),
      (t.normalizeModule = function (e, n) {
        if (-1 !== n.indexOf("!")) {
          var r = n.split("!");
          return t.normalizeModule(e, r[0]) + "!" + t.normalizeModule(e, r[1]);
        }
        if ("." == n.charAt(0)) {
          var i = e.split("/").slice(0, -1).join("/");
          for (n = (i ? i + "/" : "") + n; -1 !== n.indexOf(".") && o != n; ) {
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
        var i = (function (t, e) {
          var n = t,
            r = "";
          for (; n; ) {
            var i = e[n];
            if ("string" == typeof i) return i + r;
            if (i)
              return i.location.replace(/\/*$/, "/") + (r || i.main || i.name);
            if (!1 === i) return "";
            var o = n.lastIndexOf("/");
            if (-1 === o) break;
            (r = n.substr(o) + r), (n = n.slice(0, o));
          }
          return t;
        })(n, t.require.tlns);
        return (
          ".js" != i.slice(-3) && (i += ".js"),
          (t.require.id = n),
          (t.require.modules[n] = {}),
          importScripts(i),
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
          var i = function (n) {
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
                        return i;
                      case "exports":
                        return t.exports;
                      case "module":
                        return t;
                      default:
                        return i(e);
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
      var i = r.data;
      if (i.event && n) n._signal(i.event, i.data);
      else if (i.command)
        if (e[i.command]) e[i.command].apply(e, i.args);
        else {
          if (!t[i.command]) throw new Error("Unknown command:" + i.command);
          t[i.command].apply(t, i.args);
        }
      else if (i.init) {
        t.initBaseUrls(i.tlns), (n = t.sender = t.initSender());
        var o = this.require(i.module)[i.classname];
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
      i = /\s\s*$/;
    (e.stringTrimLeft = function (t) {
      return t.replace(r, "");
    }),
      (e.stringTrimRight = function (t) {
        return t.replace(i, "");
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
          i = function (t) {
            null == n && (n = setTimeout(r, t || e));
          };
        return (
          (i.delay = function (t) {
            n && clearTimeout(n), (n = setTimeout(r, t || e));
          }),
          (i.schedule = i),
          (i.call = function () {
            this.cancel(), t();
          }),
          (i.cancel = function () {
            n && clearTimeout(n), (n = null);
          }),
          (i.isPending = function () {
            return n;
          }),
          i
        );
      });
  }),
  ace.define("ace/apply_delta", [], function (t, e, n) {
    "use strict";
    e.applyDelta = function (t, e, n) {
      var r = e.start.row,
        i = e.start.column,
        o = t[r] || "";
      switch (e.action) {
        case "insert":
          if (1 === e.lines.length)
            t[r] = o.substring(0, i) + e.lines[0] + o.substring(i);
          else {
            var s = [r, 1].concat(e.lines);
            t.splice.apply(t, s),
              (t[r] = o.substring(0, i) + t[r]),
              (t[r + e.lines.length - 1] += o.substring(i));
          }
          break;
        case "remove":
          var a = e.end.column,
            u = e.end.row;
          r === u
            ? (t[r] = o.substring(0, i) + o.substring(a))
            : t.splice(r, u - r + 1, o.substring(0, i) + t[u].substring(a));
      }
    };
  }),
  ace.define("ace/lib/event_emitter", [], function (t, e, n) {
    "use strict";
    var r = {},
      i = function () {
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
            e.stopPropagation || (e.stopPropagation = i),
            e.preventDefault || (e.preventDefault = o),
            (n = n.slice());
          for (
            var s = 0;
            s < n.length && (n[s](e, this), !e.propagationStopped);
            s++
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
            i = n._disabled_[t];
          i || (n._disabled_[t] = i = []), i.push(r);
          var o = i.indexOf(e);
          -1 != o && i.splice(o, 1);
        }
        n[t] = e;
      }),
      (r.removeDefaultHandler = function (t, e) {
        var n = this._defaultHandlers;
        if (n) {
          var r = n._disabled_[t];
          if (n[t] == e) r && this.setDefaultHandler(t, r.pop());
          else if (r) {
            var i = r.indexOf(e);
            -1 != i && r.splice(i, 1);
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
          if (this.start.row > n) var i = { row: n + 1, column: 0 };
          else if (this.start.row < e) i = { row: e, column: 0 };
          return t.fromPoints(i || this.start, r || this.end);
        }),
        (t.prototype.extend = function (e, n) {
          var r = this.compare(e, n);
          if (0 == r) return this;
          if (-1 == r) var i = { row: e, column: n };
          else var o = { row: e, column: n };
          return t.fromPoints(i || this.start, o || this.end);
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
      i = t("./lib/event_emitter").EventEmitter,
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
                  i = (r ? 1 : -1) * (t.end.row - t.start.row),
                  o = (r ? 1 : -1) * (t.end.column - t.start.column),
                  a = t.start,
                  u = r ? a : t.end;
                if (s(e, a, n)) return { row: e.row, column: e.column };
                if (s(u, e, !n))
                  return {
                    row: e.row + i,
                    column: e.column + (e.row == u.row ? o : 0),
                  };
                return { row: a.row, column: a.column };
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
              var i = { row: this.row, column: this.column };
              (this.row = r.row),
                (this.column = r.column),
                this._signal("change", { old: i, value: r });
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
    function s(t, e, n) {
      var r = n ? t.column <= e.column : t.column < e.column;
      return t.row < e.row || (t.row == e.row && r);
    }
    (o.prototype.$insertRight = !1),
      r.implement(o.prototype, i),
      (e.Anchor = o);
  }),
  ace.define("ace/document", [], function (t, e, n) {
    "use strict";
    var r = t("./lib/oop"),
      i = t("./apply_delta").applyDelta,
      o = t("./lib/event_emitter").EventEmitter,
      s = t("./range").Range,
      a = t("./anchor").Anchor,
      u = (function () {
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
            this.remove(new s(0, 0, e, this.getLine(e).length)),
              this.insert({ row: 0, column: 0 }, t || "");
          }),
          (t.prototype.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
          }),
          (t.prototype.createAnchor = function (t, e) {
            return new a(this, t, e);
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
              i = this.clippedPos(t, n);
            return (
              this.applyDelta(
                {
                  start: r,
                  end: i,
                  action: "remove",
                  lines: this.getLinesForRange({ start: r, end: i }),
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
              i = n ? t - 1 : t,
              o = n ? this.getLine(i).length : 0,
              a = r ? e + 1 : e,
              u = r ? 0 : this.getLine(a).length,
              c = new s(i, o, a, u),
              l = this.$lines.slice(t, e + 1);
            return (
              this.applyDelta({
                start: c.start,
                end: c.end,
                action: "remove",
                lines: this.getLinesForRange(c),
              }),
              l
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
              t instanceof s || (t = s.fromPoints(t.start, t.end)),
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
              : !s.comparePoints(t.start, t.end)) ||
              (n && t.lines.length > 2e4
                ? this.$splitAndapplyLargeDelta(t, 2e4)
                : (i(this.$lines, t, e), this._signal("change", t)));
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
                i = t.start.row,
                o = t.start.column,
                s = 0,
                a = 0;
              s < r;
              s = a
            ) {
              a += e - 1;
              var u = n.slice(s, a);
              u.push(""),
                this.applyDelta(
                  {
                    start: this.pos(i + s, o),
                    end: this.pos(i + a, (o = 0)),
                    action: t.action,
                    lines: u,
                  },
                  !0
                );
            }
            (t.lines = n.slice(s)),
              (t.start.row = i + s),
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
                i = e || 0,
                o = n.length;
              i < o;
              i++
            )
              if ((t -= n[i].length + r) < 0)
                return { row: i, column: t + n[i].length + r };
            return { row: o - 1, column: t + n[o - 1].length + r };
          }),
          (t.prototype.positionToIndex = function (t, e) {
            for (
              var n = this.$lines || this.getAllLines(),
                r = this.getNewLineCharacter().length,
                i = 0,
                o = Math.min(t.row, n.length),
                s = e || 0;
              s < o;
              ++s
            )
              i += n[s].length + r;
            return i + t.column;
          }),
          (t.prototype.$split = function (t) {
            return t.split(/\r\n|\r|\n/);
          }),
          t
        );
      })();
    (u.prototype.$autoNewLine = ""),
      (u.prototype.$newLineMode = "auto"),
      r.implement(u.prototype, o),
      (e.Document = u);
  }),
  ace.define("ace/worker/mirror", [], function (t, e, n) {
    "use strict";
    var r = t("../document").Document,
      i = t("../lib/lang"),
      o = (e.Mirror = function (t) {
        this.sender = t;
        var e = (this.doc = new r("")),
          n = (this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this))),
          o = this;
        t.on("change", function (t) {
          var r = t.data;
          if (r[0].start) e.applyDeltas(r);
          else
            for (var i = 0; i < r.length; i += 2) {
              var s, a;
              if (
                ("insert" ==
                (s = Array.isArray(r[i + 1])
                  ? { action: "insert", start: r[i], lines: r[i + 1] }
                  : { action: "remove", start: r[i], end: r[i + 1] }).action
                  ? s.start
                  : s.end
                ).row >= e.$lines.length
              )
                throw (
                  (((a = new Error("Invalid delta")).data = {
                    path: o.$path,
                    linesLength: e.$lines.length,
                    start: s.start,
                    end: s.end,
                  }),
                  a)
                );
              e.applyDelta(s, !0);
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
  ace.define("ace/mode/xml/sax", [], function (t, e, n) {
    var r =
        /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
      i = new RegExp(
        "[\\-\\.0-9" +
          r.source.slice(1, -1) +
          "\xb7\u0300-\u036f\\ux203F-\u2040]"
      ),
      o = new RegExp(
        "^" + r.source + i.source + "*(?::" + r.source + i.source + "*)?$"
      ),
      s = 0,
      a = 1,
      u = 2,
      c = 3,
      l = 4,
      h = 5,
      p = 6,
      f = 7;
    function d() {}
    function m(t, e) {
      return (
        (e.lineNumber = t.lineNumber), (e.columnNumber = t.columnNumber), e
      );
    }
    function g(t, e, n, r, i) {
      for (var o, d = ++e, m = s; ; ) {
        var g = t.charAt(d);
        switch (g) {
          case "=":
            if (m === a) (o = t.slice(e, d)), (m = c);
            else {
              if (m !== u)
                throw new Error("attribute equal must after attrName");
              m = c;
            }
            break;
          case "'":
          case '"':
            if (m === c) {
              if (((e = d + 1), !((d = t.indexOf(g, e)) > 0)))
                throw new Error("attribute value no end '" + g + "' match");
              (w = t.slice(e, d).replace(/&#?\w+;/g, r)),
                n.add(o, w, e - 1),
                (m = h);
            } else {
              if (m != l) throw new Error('attribute value must after "="');
              (w = t.slice(e, d).replace(/&#?\w+;/g, r)),
                n.add(o, w, e),
                i.warning(
                  'attribute "' + o + '" missed start quot(' + g + ")!!"
                ),
                (e = d + 1),
                (m = h);
            }
            break;
          case "/":
            switch (m) {
              case s:
                n.setTagName(t.slice(e, d));
              case h:
              case p:
              case f:
                (m = f), (n.closed = !0);
              case l:
              case a:
              case u:
                break;
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            i.error("unexpected end of input");
          case ">":
            switch (m) {
              case s:
                n.setTagName(t.slice(e, d));
              case h:
              case p:
              case f:
                break;
              case l:
              case a:
                "/" === (w = t.slice(e, d)).slice(-1) &&
                  ((n.closed = !0), (w = w.slice(0, -1)));
              case u:
                m === u && (w = o),
                  m == l
                    ? (i.warning('attribute "' + w + '" missed quot(")!!'),
                      n.add(o, w.replace(/&#?\w+;/g, r), e))
                    : (i.warning(
                        'attribute "' +
                          w +
                          '" missed value!! "' +
                          w +
                          '" instead!!'
                      ),
                      n.add(w, w, e));
                break;
              case c:
                throw new Error("attribute value missed!!");
            }
            return d;
          case "\x80":
            g = " ";
          default:
            if (g <= " ")
              switch (m) {
                case s:
                  n.setTagName(t.slice(e, d)), (m = p);
                  break;
                case a:
                  (o = t.slice(e, d)), (m = u);
                  break;
                case l:
                  var w = t.slice(e, d).replace(/&#?\w+;/g, r);
                  i.warning('attribute "' + w + '" missed quot(")!!'),
                    n.add(o, w, e);
                case h:
                  m = p;
              }
            else
              switch (m) {
                case u:
                  i.warning(
                    'attribute "' + o + '" missed value!! "' + o + '" instead!!'
                  ),
                    n.add(o, o, e),
                    (e = d),
                    (m = a);
                  break;
                case h:
                  i.warning('attribute space is required"' + o + '"!!');
                case p:
                  (m = a), (e = d);
                  break;
                case c:
                  (m = l), (e = d);
                  break;
                case f:
                  throw new Error(
                    "elements closed character '/' and '>' must be connected to"
                  );
              }
        }
        d++;
      }
    }
    function w(t, e, n) {
      for (
        var r = t.tagName,
          i = null,
          o = n[n.length - 1].currentNSMap,
          s = t.length;
        s--;

      ) {
        var a = t[s],
          u = a.qName,
          c = a.value;
        if ((f = u.indexOf(":")) > 0)
          var l = (a.prefix = u.slice(0, f)),
            h = u.slice(f + 1),
            p = "xmlns" === l && h;
        else (h = u), (l = null), (p = "xmlns" === u && "");
        (a.localName = h),
          !1 !== p &&
            (null == i && ((i = {}), N(o, (o = {}))),
            (o[p] = i[p] = c),
            (a.uri = "http://www.w3.org/2000/xmlns/"),
            e.startPrefixMapping(p, c));
      }
      for (s = t.length; s--; ) {
        (l = (a = t[s]).prefix) &&
          ("xml" === l && (a.uri = "http://www.w3.org/XML/1998/namespace"),
          "xmlns" !== l && (a.uri = o[l]));
      }
      var f;
      (f = r.indexOf(":")) > 0
        ? ((l = t.prefix = r.slice(0, f)), (h = t.localName = r.slice(f + 1)))
        : ((l = null), (h = t.localName = r));
      var d = (t.uri = o[l || ""]);
      if ((e.startElement(d, h, r, t), t.closed)) {
        if ((e.endElement(d, h, r), i)) for (l in i) e.endPrefixMapping(l);
      } else (t.currentNSMap = o), (t.localNSMap = i), n.push(t);
    }
    function v(t, e, n, r, i) {
      if (/^(?:script|textarea)$/i.test(n)) {
        var o = t.indexOf("</" + n + ">", e),
          s = t.substring(e + 1, o);
        if (/[&<]/.test(s))
          return /^script$/i.test(n)
            ? (i.characters(s, 0, s.length), o)
            : ((s = s.replace(/&#?\w+;/g, r)), i.characters(s, 0, s.length), o);
      }
      return e + 1;
    }
    function y(t, e, n, r) {
      var i = r[n];
      return null == i && (i = r[n] = t.lastIndexOf("</" + n + ">")), i < e;
    }
    function N(t, e) {
      for (var n in t) e[n] = t[n];
    }
    function b(t, e, n, r) {
      var i;
      if ("-" === t.charAt(e + 2))
        return "-" === t.charAt(e + 3)
          ? (i = t.indexOf("--\x3e", e + 4)) > e
            ? (n.comment(t, e + 4, i - e - 4), i + 3)
            : (r.error("Unclosed comment"), -1)
          : -1;
      if ("CDATA[" == t.substr(e + 3, 6))
        return (i = t.indexOf("]]>", e + 9)) > e
          ? (n.startCDATA(),
            n.characters(t, e + 9, i - e - 9),
            n.endCDATA(),
            i + 3)
          : (r.error("Unclosed CDATA"), -1);
      var o = (function (t, e) {
          var n,
            r = [],
            i = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
          (i.lastIndex = e), i.exec(t);
          for (; (n = i.exec(t)); ) if ((r.push(n), n[1])) return r;
        })(t, e),
        s = o.length;
      if (s > 1 && /!doctype/i.test(o[0][0])) {
        var a = o[1][0],
          u = s > 3 && /^public$/i.test(o[2][0]) && o[3][0],
          c = s > 4 && o[4][0],
          l = o[s - 1];
        return (
          n.startDTD(
            a,
            u && u.replace(/^(['"])(.*?)\1$/, "$2"),
            c && c.replace(/^(['"])(.*?)\1$/, "$2")
          ),
          n.endDTD(),
          l.index + l[0].length
        );
      }
      return -1;
    }
    function E(t, e, n) {
      var r = t.indexOf("?>", e);
      if (r) {
        var i = t.substring(e, r).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
        if (i) {
          i[0].length;
          return n.processingInstruction(i[1], i[2]), r + 2;
        }
        return -1;
      }
      return -1;
    }
    function D(t) {}
    function x(t, e) {
      return (t.__proto__ = e), t;
    }
    return (
      (d.prototype = {
        parse: function (t, e, n) {
          var r = this.domBuilder;
          r.startDocument(),
            N(e, (e = {})),
            (function (t, e, n, r, i) {
              function o(t) {
                if (t > 65535) {
                  var e = 55296 + ((t -= 65536) >> 10),
                    n = 56320 + (1023 & t);
                  return String.fromCharCode(e, n);
                }
                return String.fromCharCode(t);
              }
              function s(t) {
                var e = t.slice(1, -1);
                return e in n
                  ? n[e]
                  : "#" === e.charAt(0)
                  ? o(parseInt(e.substr(1).replace("x", "0x")))
                  : (i.error("entity not found:" + t), t);
              }
              function a(e) {
                var n = t.substring(N, e).replace(/&#?\w+;/g, s);
                p && u(N), r.characters(n, 0, e - N), (N = e);
              }
              function u(e, n) {
                for (; e >= l && (n = h.exec(t)); )
                  (c = n.index), (l = c + n[0].length), p.lineNumber++;
                p.columnNumber = e - c + 1;
              }
              var c = 0,
                l = 0,
                h = /.+(?:\r\n?|\n)|.*$/g,
                p = r.locator,
                f = [{ currentNSMap: e }],
                d = {},
                N = 0;
              for (;;) {
                if ((O = t.indexOf("<", N)) < 0) {
                  if (!t.substr(N).match(/^\s*$/)) {
                    var x = r.document,
                      _ = x.createTextNode(t.substr(N));
                    x.appendChild(_), (r.currentElement = _);
                  }
                  return;
                }
                switch ((O > N && a(O), t.charAt(O + 1))) {
                  case "/":
                    var T,
                      S = t.indexOf(">", O + 3),
                      C = t.substring(O + 2, S);
                    if (!(f.length > 1)) {
                      i.fatalError("end tag name not found for: " + C);
                      break;
                    }
                    var L = (T = f.pop()).localNSMap;
                    if (
                      (T.tagName != C &&
                        i.fatalError(
                          "end tag name: " +
                            C +
                            " does not match the current start tagName: " +
                            T.tagName
                        ),
                      r.endElement(T.uri, T.localName, C),
                      L)
                    )
                      for (var A in L) r.endPrefixMapping(A);
                    S++;
                    break;
                  case "?":
                    p && u(O), (S = E(t, O, r));
                    break;
                  case "!":
                    p && u(O), (S = b(t, O, r, i));
                    break;
                  default:
                    try {
                      p && u(O);
                      var R = new D(),
                        I = ((S = g(t, O, R, s, i)), R.length);
                      if (I && p) {
                        for (var M = m(p, {}), O = 0; O < I; O++) {
                          var P = R[O];
                          u(P.offset), (P.offset = m(p, {}));
                        }
                        m(M, p);
                      }
                      !R.closed &&
                        y(t, S, R.tagName, d) &&
                        ((R.closed = !0),
                        n.nbsp || i.warning("unclosed xml attribute")),
                        w(R, r, f),
                        "http://www.w3.org/1999/xhtml" !== R.uri || R.closed
                          ? S++
                          : (S = v(t, S, R.tagName, s, r));
                    } catch ($) {
                      i.error("element parse error: " + $), (S = -1);
                    }
                }
                S < 0 ? a(O + 1) : (N = S);
              }
            })(t, e, n, r, this.errorHandler),
            r.endDocument();
        },
      }),
      (D.prototype = {
        setTagName: function (t) {
          if (!o.test(t)) throw new Error("invalid tagName:" + t);
          this.tagName = t;
        },
        add: function (t, e, n) {
          if (!o.test(t)) throw new Error("invalid attribute:" + t);
          this[this.length++] = { qName: t, value: e, offset: n };
        },
        length: 0,
        getLocalName: function (t) {
          return this[t].localName;
        },
        getOffset: function (t) {
          return this[t].offset;
        },
        getQName: function (t) {
          return this[t].qName;
        },
        getURI: function (t) {
          return this[t].uri;
        },
        getValue: function (t) {
          return this[t].value;
        },
      }),
      x({}, x.prototype) instanceof x ||
        (x = function (t, e) {
          function n() {}
          for (e in ((n.prototype = e), (n = new n()), t)) n[e] = t[e];
          return n;
        }),
      d
    );
  }),
  ace.define("ace/mode/xml/dom", [], function (t, e, n) {
    function r(t, e) {
      for (var n in t) e[n] = t[n];
    }
    function i(t, e) {
      var n = function () {},
        i = t.prototype;
      if (Object.create) {
        var o = Object.create(e.prototype);
        i.__proto__ = o;
      }
      i instanceof e ||
        ((n.prototype = e.prototype),
        r(i, (n = new n())),
        (t.prototype = i = n)),
        i.constructor != t &&
          ("function" != typeof t && console.error("unknown Class:" + t),
          (i.constructor = t));
    }
    var o = {},
      s = (o.ELEMENT_NODE = 1),
      a = (o.ATTRIBUTE_NODE = 2),
      u = (o.TEXT_NODE = 3),
      c = (o.CDATA_SECTION_NODE = 4),
      l = (o.ENTITY_REFERENCE_NODE = 5),
      h = (o.ENTITY_NODE = 6),
      p = (o.PROCESSING_INSTRUCTION_NODE = 7),
      f = (o.COMMENT_NODE = 8),
      d = (o.DOCUMENT_NODE = 9),
      m = (o.DOCUMENT_TYPE_NODE = 10),
      g = (o.DOCUMENT_FRAGMENT_NODE = 11),
      w = (o.NOTATION_NODE = 12),
      v = {},
      y = {},
      N =
        ((v.INDEX_SIZE_ERR = ((y[1] = "Index size error"), 1)),
        (v.DOMSTRING_SIZE_ERR = ((y[2] = "DOMString size error"), 2)),
        (v.HIERARCHY_REQUEST_ERR = ((y[3] = "Hierarchy request error"), 3)),
        (v.WRONG_DOCUMENT_ERR = ((y[4] = "Wrong document"), 4)),
        (v.INVALID_CHARACTER_ERR = ((y[5] = "Invalid character"), 5)),
        (v.NO_DATA_ALLOWED_ERR = ((y[6] = "No data allowed"), 6)),
        (v.NO_MODIFICATION_ALLOWED_ERR =
          ((y[7] = "No modification allowed"), 7)),
        (v.NOT_FOUND_ERR = ((y[8] = "Not found"), 8))),
      b =
        ((v.NOT_SUPPORTED_ERR = ((y[9] = "Not supported"), 9)),
        (v.INUSE_ATTRIBUTE_ERR = ((y[10] = "Attribute in use"), 10)));
    (v.INVALID_STATE_ERR = ((y[11] = "Invalid state"), 11)),
      (v.SYNTAX_ERR = ((y[12] = "Syntax error"), 12)),
      (v.INVALID_MODIFICATION_ERR = ((y[13] = "Invalid modification"), 13)),
      (v.NAMESPACE_ERR = ((y[14] = "Invalid namespace"), 14)),
      (v.INVALID_ACCESS_ERR = ((y[15] = "Invalid access"), 15));
    function E(t, e) {
      if (e instanceof Error) var n = e;
      else
        (n = this),
          Error.call(this, y[t]),
          (this.message = y[t]),
          Error.captureStackTrace && Error.captureStackTrace(this, E);
      return (n.code = t), e && (this.message = this.message + ": " + e), n;
    }
    function D() {}
    function x(t, e) {
      (this._node = t), (this._refresh = e), _(this);
    }
    function _(t) {
      var e = t._node._inc || t._node.ownerDocument._inc;
      if (t._inc != e) {
        var n = t._refresh(t._node);
        et(t, "length", n.length), r(n, t), (t._inc = e);
      }
    }
    function T() {}
    function S(t, e) {
      for (var n = t.length; n--; ) if (t[n] === e) return n;
    }
    function C(t, e, n, r) {
      if ((r ? (e[S(e, r)] = n) : (e[e.length++] = n), t)) {
        n.ownerElement = t;
        var i = t.ownerDocument;
        i &&
          (r && P(i, t, r),
          (function (t, e, n) {
            t && t._inc++;
            var r = n.namespaceURI;
            "http://www.w3.org/2000/xmlns/" == r &&
              (e._nsMap[n.prefix ? n.localName : ""] = n.value);
          })(i, t, n));
      }
    }
    function L(t, e, n) {
      var r = S(e, n);
      if (!(r >= 0)) throw new E(N, new Error());
      for (var i = e.length - 1; r < i; ) e[r] = e[++r];
      if (((e.length = i), t)) {
        var o = t.ownerDocument;
        o && (P(o, t, n), (n.ownerElement = null));
      }
    }
    function A(t) {
      if (((this._features = {}), t)) for (var e in t) this._features = t[e];
    }
    function R() {}
    function I(t) {
      return (
        ("<" == t ? "&lt;" : ">" == t && "&gt;") ||
        ("&" == t && "&amp;") ||
        ('"' == t && "&quot;") ||
        "&#" + t.charCodeAt() + ";"
      );
    }
    function M(t, e) {
      if (e(t)) return !0;
      if ((t = t.firstChild))
        do {
          if (M(t, e)) return !0;
        } while ((t = t.nextSibling));
    }
    function O() {}
    function P(t, e, n, r) {
      t && t._inc++,
        "http://www.w3.org/2000/xmlns/" == n.namespaceURI &&
          delete e._nsMap[n.prefix ? n.localName : ""];
    }
    function $(t, e, n) {
      if (t && t._inc) {
        t._inc++;
        var r = e.childNodes;
        if (n) r[r.length++] = n;
        else {
          for (var i = e.firstChild, o = 0; i; )
            (r[o++] = i), (i = i.nextSibling);
          r.length = o;
        }
      }
    }
    function F(t, e) {
      var n = e.previousSibling,
        r = e.nextSibling;
      return (
        n ? (n.nextSibling = r) : (t.firstChild = r),
        r ? (r.previousSibling = n) : (t.lastChild = n),
        $(t.ownerDocument, t),
        e
      );
    }
    function U(t, e, n) {
      var r = e.parentNode;
      if ((r && r.removeChild(e), e.nodeType === g)) {
        var i = e.firstChild;
        if (null == i) return e;
        var o = e.lastChild;
      } else i = o = e;
      var s = n ? n.previousSibling : t.lastChild;
      (i.previousSibling = s),
        (o.nextSibling = n),
        s ? (s.nextSibling = i) : (t.firstChild = i),
        null == n ? (t.lastChild = o) : (n.previousSibling = o);
      do {
        i.parentNode = t;
      } while (i !== o && (i = i.nextSibling));
      return (
        $(t.ownerDocument || t, t),
        e.nodeType == g && (e.firstChild = e.lastChild = null),
        e
      );
    }
    function k() {
      this._nsMap = {};
    }
    function q() {}
    function j() {}
    function B() {}
    function V() {}
    function H() {}
    function z() {}
    function Y() {}
    function W() {}
    function G() {}
    function X() {}
    function Q() {}
    function Z() {}
    function J(t, e) {
      switch (t.nodeType) {
        case s:
          var n = t.attributes,
            r = n.length,
            i = t.firstChild,
            o = t.tagName,
            h = "http://www.w3.org/1999/xhtml" === t.namespaceURI;
          e.push("<", o);
          for (var w = 0; w < r; w++) J(n.item(w), e);
          if (i || (h && !/^(?:meta|link|img|br|hr|input|button)$/i.test(o))) {
            if ((e.push(">"), h && /^script$/i.test(o))) i && e.push(i.data);
            else for (; i; ) J(i, e), (i = i.nextSibling);
            e.push("</", o, ">");
          } else e.push("/>");
          return;
        case d:
        case g:
          for (i = t.firstChild; i; ) J(i, e), (i = i.nextSibling);
          return;
        case a:
          return e.push(" ", t.name, '="', t.value.replace(/[<&"]/g, I), '"');
        case u:
          return e.push(t.data.replace(/[<&]/g, I));
        case c:
          return e.push("<![CDATA[", t.data, "]]>");
        case f:
          return e.push("\x3c!--", t.data, "--\x3e");
        case m:
          var v = t.publicId,
            y = t.systemId;
          if ((e.push("<!DOCTYPE ", t.name), v))
            e.push(' PUBLIC "', v),
              y && "." != y && e.push('" "', y),
              e.push('">');
          else if (y && "." != y) e.push(' SYSTEM "', y, '">');
          else {
            var N = t.internalSubset;
            N && e.push(" [", N, "]"), e.push(">");
          }
          return;
        case p:
          return e.push("<?", t.target, " ", t.data, "?>");
        case l:
          return e.push("&", t.nodeName, ";");
        default:
          e.push("??", t.nodeName);
      }
    }
    function K(t, e, n) {
      var r;
      switch (e.nodeType) {
        case s:
          (r = e.cloneNode(!1)).ownerDocument = t;
        case g:
          break;
        case a:
          n = !0;
      }
      if (
        (r || (r = e.cloneNode(!1)),
        (r.ownerDocument = t),
        (r.parentNode = null),
        n)
      )
        for (var i = e.firstChild; i; )
          r.appendChild(K(t, i, n)), (i = i.nextSibling);
      return r;
    }
    function tt(t, e, n) {
      var r = new e.constructor();
      for (var i in e) {
        var o = e[i];
        "object" != typeof o && o != r[i] && (r[i] = o);
      }
      switch (
        (e.childNodes && (r.childNodes = new D()),
        (r.ownerDocument = t),
        r.nodeType)
      ) {
        case s:
          var u = e.attributes,
            c = (r.attributes = new T()),
            l = u.length;
          c._ownerElement = r;
          for (var h = 0; h < l; h++) r.setAttributeNode(tt(t, u.item(h), !0));
          break;
        case a:
          n = !0;
      }
      if (n)
        for (var p = e.firstChild; p; )
          r.appendChild(tt(t, p, n)), (p = p.nextSibling);
      return r;
    }
    function et(t, e, n) {
      t[e] = n;
    }
    function nt(t) {
      switch (t.nodeType) {
        case 1:
        case 11:
          var e = [];
          for (t = t.firstChild; t; )
            7 !== t.nodeType && 8 !== t.nodeType && e.push(nt(t)),
              (t = t.nextSibling);
          return e.join("");
        default:
          return t.nodeValue;
      }
    }
    (E.prototype = Error.prototype),
      r(v, E),
      (D.prototype = {
        length: 0,
        item: function (t) {
          return this[t] || null;
        },
      }),
      (x.prototype.item = function (t) {
        return _(this), this[t];
      }),
      i(x, D),
      (T.prototype = {
        length: 0,
        item: D.prototype.item,
        getNamedItem: function (t) {
          for (var e = this.length; e--; ) {
            var n = this[e];
            if (n.nodeName == t) return n;
          }
        },
        setNamedItem: function (t) {
          var e = t.ownerElement;
          if (e && e != this._ownerElement) throw new E(b);
          var n = this.getNamedItem(t.nodeName);
          return C(this._ownerElement, this, t, n), n;
        },
        setNamedItemNS: function (t) {
          var e,
            n = t.ownerElement;
          if (n && n != this._ownerElement) throw new E(b);
          return (
            (e = this.getNamedItemNS(t.namespaceURI, t.localName)),
            C(this._ownerElement, this, t, e),
            e
          );
        },
        removeNamedItem: function (t) {
          var e = this.getNamedItem(t);
          return L(this._ownerElement, this, e), e;
        },
        removeNamedItemNS: function (t, e) {
          var n = this.getNamedItemNS(t, e);
          return L(this._ownerElement, this, n), n;
        },
        getNamedItemNS: function (t, e) {
          for (var n = this.length; n--; ) {
            var r = this[n];
            if (r.localName == e && r.namespaceURI == t) return r;
          }
          return null;
        },
      }),
      (A.prototype = {
        hasFeature: function (t, e) {
          var n = this._features[t.toLowerCase()];
          return !(!n || (e && !(e in n)));
        },
        createDocument: function (t, e, n) {
          var r = new O();
          if (
            ((r.implementation = this),
            (r.childNodes = new D()),
            (r.doctype = n),
            n && r.appendChild(n),
            e)
          ) {
            var i = r.createElementNS(t, e);
            r.appendChild(i);
          }
          return r;
        },
        createDocumentType: function (t, e, n) {
          var r = new z();
          return (
            (r.name = t),
            (r.nodeName = t),
            (r.publicId = e),
            (r.systemId = n),
            r
          );
        },
      }),
      (R.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        insertBefore: function (t, e) {
          return U(this, t, e);
        },
        replaceChild: function (t, e) {
          this.insertBefore(t, e), e && this.removeChild(e);
        },
        removeChild: function (t) {
          return F(this, t);
        },
        appendChild: function (t) {
          return this.insertBefore(t, null);
        },
        hasChildNodes: function () {
          return null != this.firstChild;
        },
        cloneNode: function (t) {
          return tt(this.ownerDocument || this, this, t);
        },
        normalize: function () {
          for (var t = this.firstChild; t; ) {
            var e = t.nextSibling;
            e && e.nodeType == u && t.nodeType == u
              ? (this.removeChild(e), t.appendData(e.data))
              : (t.normalize(), (t = e));
          }
        },
        isSupported: function (t, e) {
          return this.ownerDocument.implementation.hasFeature(t, e);
        },
        hasAttributes: function () {
          return this.attributes.length > 0;
        },
        lookupPrefix: function (t) {
          for (var e = this; e; ) {
            var n = e._nsMap;
            if (n) for (var r in n) if (n[r] == t) return r;
            e = 2 == e.nodeType ? e.ownerDocument : e.parentNode;
          }
          return null;
        },
        lookupNamespaceURI: function (t) {
          for (var e = this; e; ) {
            var n = e._nsMap;
            if (n && t in n) return n[t];
            e = 2 == e.nodeType ? e.ownerDocument : e.parentNode;
          }
          return null;
        },
        isDefaultNamespace: function (t) {
          return null == this.lookupPrefix(t);
        },
      }),
      r(o, R),
      r(o, R.prototype),
      (O.prototype = {
        nodeName: "#document",
        nodeType: d,
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function (t, e) {
          if (t.nodeType == g) {
            for (var n = t.firstChild; n; ) {
              var r = n.nextSibling;
              this.insertBefore(n, e), (n = r);
            }
            return t;
          }
          return (
            null == this.documentElement &&
              1 == t.nodeType &&
              (this.documentElement = t),
            U(this, t, e),
            (t.ownerDocument = this),
            t
          );
        },
        removeChild: function (t) {
          return (
            this.documentElement == t && (this.documentElement = null),
            F(this, t)
          );
        },
        importNode: function (t, e) {
          return K(this, t, e);
        },
        getElementById: function (t) {
          var e = null;
          return (
            M(this.documentElement, function (n) {
              if (1 == n.nodeType && n.getAttribute("id") == t)
                return (e = n), !0;
            }),
            e
          );
        },
        createElement: function (t) {
          var e = new k();
          return (
            (e.ownerDocument = this),
            (e.nodeName = t),
            (e.tagName = t),
            (e.childNodes = new D()),
            ((e.attributes = new T())._ownerElement = e),
            e
          );
        },
        createDocumentFragment: function () {
          var t = new X();
          return (t.ownerDocument = this), (t.childNodes = new D()), t;
        },
        createTextNode: function (t) {
          var e = new B();
          return (e.ownerDocument = this), e.appendData(t), e;
        },
        createComment: function (t) {
          var e = new V();
          return (e.ownerDocument = this), e.appendData(t), e;
        },
        createCDATASection: function (t) {
          var e = new H();
          return (e.ownerDocument = this), e.appendData(t), e;
        },
        createProcessingInstruction: function (t, e) {
          var n = new Q();
          return (
            (n.ownerDocument = this),
            (n.tagName = n.target = t),
            (n.nodeValue = n.data = e),
            n
          );
        },
        createAttribute: function (t) {
          var e = new q();
          return (
            (e.ownerDocument = this),
            (e.name = t),
            (e.nodeName = t),
            (e.localName = t),
            (e.specified = !0),
            e
          );
        },
        createEntityReference: function (t) {
          var e = new G();
          return (e.ownerDocument = this), (e.nodeName = t), e;
        },
        createElementNS: function (t, e) {
          var n = new k(),
            r = e.split(":"),
            i = (n.attributes = new T());
          return (
            (n.childNodes = new D()),
            (n.ownerDocument = this),
            (n.nodeName = e),
            (n.tagName = e),
            (n.namespaceURI = t),
            2 == r.length
              ? ((n.prefix = r[0]), (n.localName = r[1]))
              : (n.localName = e),
            (i._ownerElement = n),
            n
          );
        },
        createAttributeNS: function (t, e) {
          var n = new q(),
            r = e.split(":");
          return (
            (n.ownerDocument = this),
            (n.nodeName = e),
            (n.name = e),
            (n.namespaceURI = t),
            (n.specified = !0),
            2 == r.length
              ? ((n.prefix = r[0]), (n.localName = r[1]))
              : (n.localName = e),
            n
          );
        },
      }),
      i(O, R),
      (k.prototype = {
        nodeType: s,
        hasAttribute: function (t) {
          return null != this.getAttributeNode(t);
        },
        getAttribute: function (t) {
          var e = this.getAttributeNode(t);
          return (e && e.value) || "";
        },
        getAttributeNode: function (t) {
          return this.attributes.getNamedItem(t);
        },
        setAttribute: function (t, e) {
          var n = this.ownerDocument.createAttribute(t);
          (n.value = n.nodeValue = "" + e), this.setAttributeNode(n);
        },
        removeAttribute: function (t) {
          var e = this.getAttributeNode(t);
          e && this.removeAttributeNode(e);
        },
        appendChild: function (t) {
          return t.nodeType === g
            ? this.insertBefore(t, null)
            : (function (t, e) {
                var n = e.parentNode;
                if (n) {
                  var r = t.lastChild;
                  n.removeChild(e), (r = t.lastChild);
                }
                return (
                  (r = t.lastChild),
                  (e.parentNode = t),
                  (e.previousSibling = r),
                  (e.nextSibling = null),
                  r ? (r.nextSibling = e) : (t.firstChild = e),
                  (t.lastChild = e),
                  $(t.ownerDocument, t, e),
                  e
                );
              })(this, t);
        },
        setAttributeNode: function (t) {
          return this.attributes.setNamedItem(t);
        },
        setAttributeNodeNS: function (t) {
          return this.attributes.setNamedItemNS(t);
        },
        removeAttributeNode: function (t) {
          return this.attributes.removeNamedItem(t.nodeName);
        },
        removeAttributeNS: function (t, e) {
          var n = this.getAttributeNodeNS(t, e);
          n && this.removeAttributeNode(n);
        },
        hasAttributeNS: function (t, e) {
          return null != this.getAttributeNodeNS(t, e);
        },
        getAttributeNS: function (t, e) {
          var n = this.getAttributeNodeNS(t, e);
          return (n && n.value) || "";
        },
        setAttributeNS: function (t, e, n) {
          var r = this.ownerDocument.createAttributeNS(t, e);
          (r.value = r.nodeValue = "" + n), this.setAttributeNode(r);
        },
        getAttributeNodeNS: function (t, e) {
          return this.attributes.getNamedItemNS(t, e);
        },
        getElementsByTagName: function (t) {
          return new x(this, function (e) {
            var n = [];
            return (
              M(e, function (r) {
                r === e ||
                  r.nodeType != s ||
                  ("*" !== t && r.tagName != t) ||
                  n.push(r);
              }),
              n
            );
          });
        },
        getElementsByTagNameNS: function (t, e) {
          return new x(this, function (n) {
            var r = [];
            return (
              M(n, function (i) {
                i === n ||
                  i.nodeType !== s ||
                  ("*" !== t && i.namespaceURI !== t) ||
                  ("*" !== e && i.localName != e) ||
                  r.push(i);
              }),
              r
            );
          });
        },
      }),
      (O.prototype.getElementsByTagName = k.prototype.getElementsByTagName),
      (O.prototype.getElementsByTagNameNS = k.prototype.getElementsByTagNameNS),
      i(k, R),
      (q.prototype.nodeType = a),
      i(q, R),
      (j.prototype = {
        data: "",
        substringData: function (t, e) {
          return this.data.substring(t, t + e);
        },
        appendData: function (t) {
          (t = this.data + t),
            (this.nodeValue = this.data = t),
            (this.length = t.length);
        },
        insertData: function (t, e) {
          this.replaceData(t, 0, e);
        },
        appendChild: function (t) {
          throw new Error(y[3]);
        },
        deleteData: function (t, e) {
          this.replaceData(t, e, "");
        },
        replaceData: function (t, e, n) {
          (n = this.data.substring(0, t) + n + this.data.substring(t + e)),
            (this.nodeValue = this.data = n),
            (this.length = n.length);
        },
      }),
      i(j, R),
      (B.prototype = {
        nodeName: "#text",
        nodeType: u,
        splitText: function (t) {
          var e = this.data,
            n = e.substring(t);
          (e = e.substring(0, t)),
            (this.data = this.nodeValue = e),
            (this.length = e.length);
          var r = this.ownerDocument.createTextNode(n);
          return (
            this.parentNode &&
              this.parentNode.insertBefore(r, this.nextSibling),
            r
          );
        },
      }),
      i(B, j),
      (V.prototype = { nodeName: "#comment", nodeType: f }),
      i(V, j),
      (H.prototype = { nodeName: "#cdata-section", nodeType: c }),
      i(H, j),
      (z.prototype.nodeType = m),
      i(z, R),
      (Y.prototype.nodeType = w),
      i(Y, R),
      (W.prototype.nodeType = h),
      i(W, R),
      (G.prototype.nodeType = l),
      i(G, R),
      (X.prototype.nodeName = "#document-fragment"),
      (X.prototype.nodeType = g),
      i(X, R),
      (Q.prototype.nodeType = p),
      i(Q, R),
      (Z.prototype.serializeToString = function (t) {
        var e = [];
        return J(t, e), e.join("");
      }),
      (R.prototype.toString = function () {
        return Z.prototype.serializeToString(this);
      });
    try {
      Object.defineProperty &&
        (Object.defineProperty(x.prototype, "length", {
          get: function () {
            return _(this), this.$$length;
          },
        }),
        Object.defineProperty(R.prototype, "textContent", {
          get: function () {
            return nt(this);
          },
          set: function (t) {
            switch (this.nodeType) {
              case 1:
              case 11:
                for (; this.firstChild; ) this.removeChild(this.firstChild);
                (t || String(t)) &&
                  this.appendChild(this.ownerDocument.createTextNode(t));
                break;
              default:
                (this.data = t), (this.value = value), (this.nodeValue = t);
            }
          },
        }),
        (et = function (t, e, n) {
          t["$$" + e] = n;
        }));
    } catch (rt) {}
    return A;
  }),
  ace.define("ace/mode/xml/dom-parser", [], function (t, e, n) {
    "use strict";
    var r = t("./sax"),
      i = t("./dom");
    function o(t) {
      this.options = t || { locator: {} };
    }
    function s() {
      this.cdata = !1;
    }
    function a(t, e) {
      (e.lineNumber = t.lineNumber), (e.columnNumber = t.columnNumber);
    }
    function u(t) {
      if (t)
        return (
          "\n@" +
          (t.systemId || "") +
          "#[line:" +
          t.lineNumber +
          ",col:" +
          t.columnNumber +
          "]"
        );
    }
    function c(t, e, n) {
      return "string" == typeof t
        ? t.substr(e, n)
        : t.length >= e + n || e
        ? new java.lang.String(t, e, n) + ""
        : t;
    }
    function l(t, e) {
      t.currentElement
        ? t.currentElement.appendChild(e)
        : t.document.appendChild(e);
    }
    return (
      (o.prototype.parseFromString = function (t, e) {
        var n = this.options,
          i = new r(),
          o = n.domBuilder || new s(),
          a = n.errorHandler,
          c = n.locator,
          l = n.xmlns || {},
          h = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
        return (
          c && o.setDocumentLocator(c),
          (i.errorHandler = (function (t, e, n) {
            if (!t) {
              if (e instanceof s) return e;
              t = e;
            }
            var r = {},
              i = t instanceof Function;
            function o(e) {
              var o = t[e];
              if (!o)
                if (i)
                  o =
                    2 == t.length
                      ? function (n) {
                          t(e, n);
                        }
                      : t;
                else
                  for (
                    var s = arguments.length;
                    --s && !(o = t[arguments[s]]);

                  );
              r[e] =
                (o &&
                  function (t) {
                    o(t + u(n), t, n);
                  }) ||
                function () {};
            }
            return (
              (n = n || {}),
              o("warning", "warn"),
              o("error", "warn", "warning"),
              o("fatalError", "warn", "warning", "error"),
              r
            );
          })(a, o, c)),
          (i.domBuilder = n.domBuilder || o),
          /\/x?html?$/.test(e) &&
            ((h.nbsp = "\xa0"),
            (h.copy = "\xa9"),
            (l[""] = "http://www.w3.org/1999/xhtml")),
          t
            ? i.parse(t, l, h)
            : i.errorHandler.error("invalid document source"),
          o.document
        );
      }),
      (s.prototype = {
        startDocument: function () {
          (this.document = new i().createDocument(null, null, null)),
            this.locator && (this.document.documentURI = this.locator.systemId);
        },
        startElement: function (t, e, n, r) {
          var i = this.document,
            o = i.createElementNS(t, n || e),
            s = r.length;
          l(this, o),
            (this.currentElement = o),
            this.locator && a(this.locator, o);
          for (var u = 0; u < s; u++) {
            t = r.getURI(u);
            var c = r.getValue(u),
              h = ((n = r.getQName(u)), i.createAttributeNS(t, n));
            h.getOffset && a(h.getOffset(1), h),
              (h.value = h.nodeValue = c),
              o.setAttributeNode(h);
          }
        },
        endElement: function (t, e, n) {
          var r = this.currentElement;
          r.tagName;
          this.currentElement = r.parentNode;
        },
        startPrefixMapping: function (t, e) {},
        endPrefixMapping: function (t) {},
        processingInstruction: function (t, e) {
          var n = this.document.createProcessingInstruction(t, e);
          this.locator && a(this.locator, n), l(this, n);
        },
        ignorableWhitespace: function (t, e, n) {},
        characters: function (t, e, n) {
          if (((t = c.apply(this, arguments)), this.currentElement && t)) {
            if (this.cdata) {
              var r = this.document.createCDATASection(t);
              this.currentElement.appendChild(r);
            } else {
              r = this.document.createTextNode(t);
              this.currentElement.appendChild(r);
            }
            this.locator && a(this.locator, r);
          }
        },
        skippedEntity: function (t) {},
        endDocument: function () {
          this.document.normalize();
        },
        setDocumentLocator: function (t) {
          (this.locator = t) && (t.lineNumber = 0);
        },
        comment: function (t, e, n) {
          t = c.apply(this, arguments);
          var r = this.document.createComment(t);
          this.locator && a(this.locator, r), l(this, r);
        },
        startCDATA: function () {
          this.cdata = !0;
        },
        endCDATA: function () {
          this.cdata = !1;
        },
        startDTD: function (t, e, n) {
          var r = this.document.implementation;
          if (r && r.createDocumentType) {
            var i = r.createDocumentType(t, e, n);
            this.locator && a(this.locator, i), l(this, i);
          }
        },
        warning: function (t) {
          console.warn(t, u(this.locator));
        },
        error: function (t) {
          console.error(t, u(this.locator));
        },
        fatalError: function (t) {
          throw (console.error(t, u(this.locator)), t);
        },
      }),
      "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
        /\w+/g,
        function (t) {
          s.prototype[t] = function () {
            return null;
          };
        }
      ),
      { DOMParser: o }
    );
  }),
  ace.define("ace/mode/xml_worker", [], function (t, e, n) {
    "use strict";
    var r = t("../lib/oop"),
      i = (t("../lib/lang"), t("../worker/mirror").Mirror),
      o = t("./xml/dom-parser").DOMParser,
      s = (e.Worker = function (t) {
        i.call(this, t), this.setTimeout(400), (this.context = null);
      });
    r.inherits(s, i),
      function () {
        (this.setOptions = function (t) {
          this.context = t.context;
        }),
          (this.onUpdate = function () {
            var t = this.doc.getValue();
            if (t) {
              var e = new o(),
                n = [];
              (e.options.errorHandler = {
                fatalError: function (t, e, r) {
                  n.push({
                    row: r.lineNumber,
                    column: r.columnNumber,
                    text: e,
                    type: "error",
                  });
                },
                error: function (t, e, r) {
                  n.push({
                    row: r.lineNumber,
                    column: r.columnNumber,
                    text: e,
                    type: "error",
                  });
                },
                warning: function (t, e, r) {
                  n.push({
                    row: r.lineNumber,
                    column: r.columnNumber,
                    text: e,
                    type: "warning",
                  });
                },
              }),
                e.parseFromString(t),
                this.sender.emit("error", n);
            }
          });
      }.call(s.prototype);
  });
