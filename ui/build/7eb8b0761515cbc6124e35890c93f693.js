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
      (e.onerror = function (e, t, r, n, i) {
        postMessage({
          type: "error",
          data: {
            message: e,
            data: i && i.data,
            file: t,
            line: r,
            col: n,
            stack: i && i.stack,
          },
        });
      }),
      (e.normalizeModule = function (t, r) {
        if (-1 !== r.indexOf("!")) {
          var n = r.split("!");
          return e.normalizeModule(t, n[0]) + "!" + e.normalizeModule(t, n[1]);
        }
        if ("." == r.charAt(0)) {
          var i = t.split("/").slice(0, -1).join("/");
          for (r = (i ? i + "/" : "") + r; -1 !== r.indexOf(".") && o != r; ) {
            var o = r;
            r = r
              .replace(/^\.\//, "")
              .replace(/\/\.\//, "/")
              .replace(/[^\/]+\/\.\.\//, "");
          }
        }
        return r;
      }),
      (e.require = function (t, r) {
        if ((r || ((r = t), (t = null)), !r.charAt))
          throw new Error(
            "worker.js require() accepts only (parentId, id) as arguments"
          );
        r = e.normalizeModule(t, r);
        var n = e.require.modules[r];
        if (n)
          return (
            n.initialized ||
              ((n.initialized = !0), (n.exports = n.factory().exports)),
            n.exports
          );
        if (!e.require.tlns) return console.log("unable to load " + r);
        var i = (function (e, t) {
          var r = e,
            n = "";
          for (; r; ) {
            var i = t[r];
            if ("string" == typeof i) return i + n;
            if (i)
              return i.location.replace(/\/*$/, "/") + (n || i.main || i.name);
            if (!1 === i) return "";
            var o = r.lastIndexOf("/");
            if (-1 === o) break;
            (n = r.substr(o) + n), (r = r.slice(0, o));
          }
          return e;
        })(r, e.require.tlns);
        return (
          ".js" != i.slice(-3) && (i += ".js"),
          (e.require.id = r),
          (e.require.modules[r] = {}),
          importScripts(i),
          e.require(t, r)
        );
      }),
      (e.require.modules = {}),
      (e.require.tlns = {}),
      (e.define = function (t, r, n) {
        if (
          (2 == arguments.length
            ? ((n = r), "string" != typeof t && ((r = t), (t = e.require.id)))
            : 1 == arguments.length && ((n = t), (r = []), (t = e.require.id)),
          "function" == typeof n)
        ) {
          r.length || (r = ["require", "exports", "module"]);
          var i = function (r) {
            return e.require(t, r);
          };
          e.require.modules[t] = {
            exports: {},
            factory: function () {
              var e = this,
                t = n.apply(
                  this,
                  r.slice(0, n.length).map(function (t) {
                    switch (t) {
                      case "require":
                        return i;
                      case "exports":
                        return e.exports;
                      case "module":
                        return e;
                      default:
                        return i(t);
                    }
                  })
                );
              return t && (e.exports = t), e;
            },
          };
        } else e.require.modules[t] = { exports: n, initialized: !0 };
      }),
      (e.define.amd = {}),
      (e.require.tlns = {}),
      (e.initBaseUrls = function (e) {
        for (var t in e) this.require.tlns[t] = e[t];
      }),
      (e.initSender = function () {
        var t = e.require("ace/lib/event_emitter").EventEmitter,
          r = e.require("ace/lib/oop"),
          n = function () {};
        return (
          function () {
            r.implement(this, t),
              (this.callback = function (e, t) {
                postMessage({ type: "call", id: t, data: e });
              }),
              (this.emit = function (e, t) {
                postMessage({ type: "event", name: e, data: t });
              });
          }.call(n.prototype),
          new n()
        );
      });
    var t = (e.main = null),
      r = (e.sender = null);
    e.onmessage = function (n) {
      var i = n.data;
      if (i.event && r) r._signal(i.event, i.data);
      else if (i.command)
        if (t[i.command]) t[i.command].apply(t, i.args);
        else {
          if (!e[i.command]) throw new Error("Unknown command:" + i.command);
          e[i.command].apply(e, i.args);
        }
      else if (i.init) {
        e.initBaseUrls(i.tlns), (r = e.sender = e.initSender());
        var o = this.require(i.module)[i.classname];
        t = e.main = new o(r);
      }
    };
  }
})(this),
  ace.define("ace/lib/oop", [], function (e, t, r) {
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
        for (var r in t) e[r] = t[r];
        return e;
      }),
      (t.implement = function (e, r) {
        t.mixin(e, r);
      });
  }),
  ace.define("ace/lib/lang", [], function (e, t, r) {
    "use strict";
    (t.last = function (e) {
      return e[e.length - 1];
    }),
      (t.stringReverse = function (e) {
        return e.split("").reverse().join("");
      }),
      (t.stringRepeat = function (e, t) {
        for (var r = ""; t > 0; ) 1 & t && (r += e), (t >>= 1) && (e += e);
        return r;
      });
    var n = /^\s\s*/,
      i = /\s\s*$/;
    (t.stringTrimLeft = function (e) {
      return e.replace(n, "");
    }),
      (t.stringTrimRight = function (e) {
        return e.replace(i, "");
      }),
      (t.copyObject = function (e) {
        var t = {};
        for (var r in e) t[r] = e[r];
        return t;
      }),
      (t.copyArray = function (e) {
        for (var t = [], r = 0, n = e.length; r < n; r++)
          e[r] && "object" == typeof e[r]
            ? (t[r] = this.copyObject(e[r]))
            : (t[r] = e[r]);
        return t;
      }),
      (t.deepCopy = function e(t) {
        if ("object" !== typeof t || !t) return t;
        var r;
        if (Array.isArray(t)) {
          r = [];
          for (var n = 0; n < t.length; n++) r[n] = e(t[n]);
          return r;
        }
        if ("[object Object]" !== Object.prototype.toString.call(t)) return t;
        for (var n in ((r = {}), t)) r[n] = e(t[n]);
        return r;
      }),
      (t.arrayToMap = function (e) {
        for (var t = {}, r = 0; r < e.length; r++) t[e[r]] = 1;
        return t;
      }),
      (t.createMap = function (e) {
        var t = Object.create(null);
        for (var r in e) t[r] = e[r];
        return t;
      }),
      (t.arrayRemove = function (e, t) {
        for (var r = 0; r <= e.length; r++) t === e[r] && e.splice(r, 1);
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
        var r = [];
        return (
          e.replace(t, function (e) {
            r.push({
              offset: arguments[arguments.length - 2],
              length: e.length,
            });
          }),
          r
        );
      }),
      (t.deferredCall = function (e) {
        var t = null,
          r = function () {
            (t = null), e();
          },
          n = function e(n) {
            return e.cancel(), (t = setTimeout(r, n || 0)), e;
          };
        return (
          (n.schedule = n),
          (n.call = function () {
            return this.cancel(), e(), n;
          }),
          (n.cancel = function () {
            return clearTimeout(t), (t = null), n;
          }),
          (n.isPending = function () {
            return t;
          }),
          n
        );
      }),
      (t.delayedCall = function (e, t) {
        var r = null,
          n = function () {
            (r = null), e();
          },
          i = function (e) {
            null == r && (r = setTimeout(n, e || t));
          };
        return (
          (i.delay = function (e) {
            r && clearTimeout(r), (r = setTimeout(n, e || t));
          }),
          (i.schedule = i),
          (i.call = function () {
            this.cancel(), e();
          }),
          (i.cancel = function () {
            r && clearTimeout(r), (r = null);
          }),
          (i.isPending = function () {
            return r;
          }),
          i
        );
      });
  }),
  ace.define("ace/apply_delta", [], function (e, t, r) {
    "use strict";
    t.applyDelta = function (e, t, r) {
      var n = t.start.row,
        i = t.start.column,
        o = e[n] || "";
      switch (t.action) {
        case "insert":
          if (1 === t.lines.length)
            e[n] = o.substring(0, i) + t.lines[0] + o.substring(i);
          else {
            var a = [n, 1].concat(t.lines);
            e.splice.apply(e, a),
              (e[n] = o.substring(0, i) + e[n]),
              (e[n + t.lines.length - 1] += o.substring(i));
          }
          break;
        case "remove":
          var s = t.end.column,
            l = t.end.row;
          n === l
            ? (e[n] = o.substring(0, i) + o.substring(s))
            : e.splice(n, l - n + 1, o.substring(0, i) + e[l].substring(s));
      }
    };
  }),
  ace.define("ace/lib/event_emitter", [], function (e, t, r) {
    "use strict";
    var n = {},
      i = function () {
        this.propagationStopped = !0;
      },
      o = function () {
        this.defaultPrevented = !0;
      };
    (n._emit = n._dispatchEvent =
      function (e, t) {
        this._eventRegistry || (this._eventRegistry = {}),
          this._defaultHandlers || (this._defaultHandlers = {});
        var r = this._eventRegistry[e] || [],
          n = this._defaultHandlers[e];
        if (r.length || n) {
          ("object" == typeof t && t) || (t = {}),
            t.type || (t.type = e),
            t.stopPropagation || (t.stopPropagation = i),
            t.preventDefault || (t.preventDefault = o),
            (r = r.slice());
          for (
            var a = 0;
            a < r.length && (r[a](t, this), !t.propagationStopped);
            a++
          );
          return n && !t.defaultPrevented ? n(t, this) : void 0;
        }
      }),
      (n._signal = function (e, t) {
        var r = (this._eventRegistry || {})[e];
        if (r) {
          r = r.slice();
          for (var n = 0; n < r.length; n++) r[n](t, this);
        }
      }),
      (n.once = function (e, t) {
        var r = this;
        if (
          (this.on(e, function n() {
            r.off(e, n), t.apply(null, arguments);
          }),
          !t)
        )
          return new Promise(function (e) {
            t = e;
          });
      }),
      (n.setDefaultHandler = function (e, t) {
        var r = this._defaultHandlers;
        if ((r || (r = this._defaultHandlers = { _disabled_: {} }), r[e])) {
          var n = r[e],
            i = r._disabled_[e];
          i || (r._disabled_[e] = i = []), i.push(n);
          var o = i.indexOf(t);
          -1 != o && i.splice(o, 1);
        }
        r[e] = t;
      }),
      (n.removeDefaultHandler = function (e, t) {
        var r = this._defaultHandlers;
        if (r) {
          var n = r._disabled_[e];
          if (r[e] == t) n && this.setDefaultHandler(e, n.pop());
          else if (n) {
            var i = n.indexOf(t);
            -1 != i && n.splice(i, 1);
          }
        }
      }),
      (n.on = n.addEventListener =
        function (e, t, r) {
          this._eventRegistry = this._eventRegistry || {};
          var n = this._eventRegistry[e];
          return (
            n || (n = this._eventRegistry[e] = []),
            -1 == n.indexOf(t) && n[r ? "unshift" : "push"](t),
            t
          );
        }),
      (n.off =
        n.removeListener =
        n.removeEventListener =
          function (e, t) {
            this._eventRegistry = this._eventRegistry || {};
            var r = this._eventRegistry[e];
            if (r) {
              var n = r.indexOf(t);
              -1 !== n && r.splice(n, 1);
            }
          }),
      (n.removeAllListeners = function (e) {
        e || (this._eventRegistry = this._defaultHandlers = void 0),
          this._eventRegistry && (this._eventRegistry[e] = void 0),
          this._defaultHandlers && (this._defaultHandlers[e] = void 0);
      }),
      (t.EventEmitter = n);
  }),
  ace.define("ace/range", [], function (e, t, r) {
    "use strict";
    var n = (function () {
      function e(e, t, r, n) {
        (this.start = { row: e, column: t }),
          (this.end = { row: r, column: n });
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
            r = e.end,
            n = e.start;
          return 1 == (t = this.compare(r.row, r.column))
            ? 1 == (t = this.compare(n.row, n.column))
              ? 2
              : 0 == t
              ? 1
              : 0
            : -1 == t
            ? -2
            : -1 == (t = this.compare(n.row, n.column))
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
        (e.prototype.clipRows = function (t, r) {
          if (this.end.row > r) var n = { row: r + 1, column: 0 };
          else if (this.end.row < t) n = { row: t, column: 0 };
          if (this.start.row > r) var i = { row: r + 1, column: 0 };
          else if (this.start.row < t) i = { row: t, column: 0 };
          return e.fromPoints(i || this.start, n || this.end);
        }),
        (e.prototype.extend = function (t, r) {
          var n = this.compare(t, r);
          if (0 == n) return this;
          if (-1 == n) var i = { row: t, column: r };
          else var o = { row: t, column: r };
          return e.fromPoints(i || this.start, o || this.end);
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
          var r = t.documentToScreenPosition(this.start),
            n = t.documentToScreenPosition(this.end);
          return new e(r.row, r.column, n.row, n.column);
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
    (n.fromPoints = function (e, t) {
      return new n(e.row, e.column, t.row, t.column);
    }),
      (n.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (n.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (t.Range = n);
  }),
  ace.define("ace/anchor", [], function (e, t, r) {
    "use strict";
    var n = e("./lib/oop"),
      i = e("./lib/event_emitter").EventEmitter,
      o = (function () {
        function e(e, t, r) {
          (this.$onChange = this.onChange.bind(this)),
            this.attach(e),
            "undefined" == typeof r
              ? this.setPosition(t.row, t.column)
              : this.setPosition(t, r);
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
              var t = (function (e, t, r) {
                var n = "insert" == e.action,
                  i = (n ? 1 : -1) * (e.end.row - e.start.row),
                  o = (n ? 1 : -1) * (e.end.column - e.start.column),
                  s = e.start,
                  l = n ? s : e.end;
                if (a(t, s, r)) return { row: t.row, column: t.column };
                if (a(l, t, !r))
                  return {
                    row: t.row + i,
                    column: t.column + (t.row == l.row ? o : 0),
                  };
                return { row: s.row, column: s.column };
              })(e, { row: this.row, column: this.column }, this.$insertRight);
              this.setPosition(t.row, t.column, !0);
            }
          }),
          (e.prototype.setPosition = function (e, t, r) {
            var n;
            if (
              ((n = r
                ? { row: e, column: t }
                : this.$clipPositionToDocument(e, t)),
              this.row != n.row || this.column != n.column)
            ) {
              var i = { row: this.row, column: this.column };
              (this.row = n.row),
                (this.column = n.column),
                this._signal("change", { old: i, value: n });
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
            var r = {};
            return (
              e >= this.document.getLength()
                ? ((r.row = Math.max(0, this.document.getLength() - 1)),
                  (r.column = this.document.getLine(r.row).length))
                : e < 0
                ? ((r.row = 0), (r.column = 0))
                : ((r.row = e),
                  (r.column = Math.min(
                    this.document.getLine(r.row).length,
                    Math.max(0, t)
                  ))),
              t < 0 && (r.column = 0),
              r
            );
          }),
          e
        );
      })();
    function a(e, t, r) {
      var n = r ? e.column <= t.column : e.column < t.column;
      return e.row < t.row || (e.row == t.row && n);
    }
    (o.prototype.$insertRight = !1),
      n.implement(o.prototype, i),
      (t.Anchor = o);
  }),
  ace.define("ace/document", [], function (e, t, r) {
    "use strict";
    var n = e("./lib/oop"),
      i = e("./apply_delta").applyDelta,
      o = e("./lib/event_emitter").EventEmitter,
      a = e("./range").Range,
      s = e("./anchor").Anchor,
      l = (function () {
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
              var r = t.length - 1;
              e.end.row - e.start.row == r &&
                (t[r] = t[r].substring(0, e.end.column));
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
            var r = this.clippedPos(e.row, e.column),
              n = this.pos(e.row, e.column + t.length);
            return (
              this.applyDelta(
                { start: r, end: n, action: "insert", lines: [t] },
                !0
              ),
              this.clonePos(n)
            );
          }),
          (e.prototype.clippedPos = function (e, t) {
            var r = this.getLength();
            void 0 === e
              ? (e = r)
              : e < 0
              ? (e = 0)
              : e >= r && ((e = r - 1), (t = void 0));
            var n = this.getLine(e);
            return (
              void 0 == t && (t = n.length),
              { row: e, column: (t = Math.min(Math.max(t, 0), n.length)) }
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
            var r = 0;
            (e = Math.min(Math.max(e, 0), this.getLength())) < this.getLength()
              ? ((t = t.concat([""])), (r = 0))
              : ((t = [""].concat(t)), e--, (r = this.$lines[e].length)),
              this.insertMergedLines({ row: e, column: r }, t);
          }),
          (e.prototype.insertMergedLines = function (e, t) {
            var r = this.clippedPos(e.row, e.column),
              n = {
                row: r.row + t.length - 1,
                column: (1 == t.length ? r.column : 0) + t[t.length - 1].length,
              };
            return (
              this.applyDelta({ start: r, end: n, action: "insert", lines: t }),
              this.clonePos(n)
            );
          }),
          (e.prototype.remove = function (e) {
            var t = this.clippedPos(e.start.row, e.start.column),
              r = this.clippedPos(e.end.row, e.end.column);
            return (
              this.applyDelta({
                start: t,
                end: r,
                action: "remove",
                lines: this.getLinesForRange({ start: t, end: r }),
              }),
              this.clonePos(t)
            );
          }),
          (e.prototype.removeInLine = function (e, t, r) {
            var n = this.clippedPos(e, t),
              i = this.clippedPos(e, r);
            return (
              this.applyDelta(
                {
                  start: n,
                  end: i,
                  action: "remove",
                  lines: this.getLinesForRange({ start: n, end: i }),
                },
                !0
              ),
              this.clonePos(n)
            );
          }),
          (e.prototype.removeFullLines = function (e, t) {
            e = Math.min(Math.max(0, e), this.getLength() - 1);
            var r =
                (t = Math.min(Math.max(0, t), this.getLength() - 1)) ==
                  this.getLength() - 1 && e > 0,
              n = t < this.getLength() - 1,
              i = r ? e - 1 : e,
              o = r ? this.getLine(i).length : 0,
              s = n ? t + 1 : t,
              l = n ? 0 : this.getLine(s).length,
              u = new a(i, o, s, l),
              c = this.$lines.slice(e, t + 1);
            return (
              this.applyDelta({
                start: u.start,
                end: u.end,
                action: "remove",
                lines: this.getLinesForRange(u),
              }),
              c
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
            var r = "insert" == e.action;
            (r
              ? e.lines.length <= 1 && !e.lines[0]
              : !a.comparePoints(e.start, e.end)) ||
              (r && e.lines.length > 2e4
                ? this.$splitAndapplyLargeDelta(e, 2e4)
                : (i(this.$lines, e, t), this._signal("change", e)));
          }),
          (e.prototype.$safeApplyDelta = function (e) {
            var t = this.$lines.length;
            (("remove" == e.action && e.start.row < t && e.end.row < t) ||
              ("insert" == e.action && e.start.row <= t)) &&
              this.applyDelta(e);
          }),
          (e.prototype.$splitAndapplyLargeDelta = function (e, t) {
            for (
              var r = e.lines,
                n = r.length - t + 1,
                i = e.start.row,
                o = e.start.column,
                a = 0,
                s = 0;
              a < n;
              a = s
            ) {
              s += t - 1;
              var l = r.slice(a, s);
              l.push(""),
                this.applyDelta(
                  {
                    start: this.pos(i + a, o),
                    end: this.pos(i + s, (o = 0)),
                    action: e.action,
                    lines: l,
                  },
                  !0
                );
            }
            (e.lines = r.slice(a)),
              (e.start.row = i + a),
              (e.start.column = o),
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
              var r = this.$lines || this.getAllLines(),
                n = this.getNewLineCharacter().length,
                i = t || 0,
                o = r.length;
              i < o;
              i++
            )
              if ((e -= r[i].length + n) < 0)
                return { row: i, column: e + r[i].length + n };
            return { row: o - 1, column: e + r[o - 1].length + n };
          }),
          (e.prototype.positionToIndex = function (e, t) {
            for (
              var r = this.$lines || this.getAllLines(),
                n = this.getNewLineCharacter().length,
                i = 0,
                o = Math.min(e.row, r.length),
                a = t || 0;
              a < o;
              ++a
            )
              i += r[a].length + n;
            return i + e.column;
          }),
          (e.prototype.$split = function (e) {
            return e.split(/\r\n|\r|\n/);
          }),
          e
        );
      })();
    (l.prototype.$autoNewLine = ""),
      (l.prototype.$newLineMode = "auto"),
      n.implement(l.prototype, o),
      (t.Document = l);
  }),
  ace.define("ace/worker/mirror", [], function (e, t, r) {
    "use strict";
    var n = e("../document").Document,
      i = e("../lib/lang"),
      o = (t.Mirror = function (e) {
        this.sender = e;
        var t = (this.doc = new n("")),
          r = (this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this))),
          o = this;
        e.on("change", function (e) {
          var n = e.data;
          if (n[0].start) t.applyDeltas(n);
          else
            for (var i = 0; i < n.length; i += 2) {
              var a, s;
              if (
                ("insert" ==
                (a = Array.isArray(n[i + 1])
                  ? { action: "insert", start: n[i], lines: n[i + 1] }
                  : { action: "remove", start: n[i], end: n[i + 1] }).action
                  ? a.start
                  : a.end
                ).row >= t.$lines.length
              )
                throw (
                  (((s = new Error("Invalid delta")).data = {
                    path: o.$path,
                    linesLength: t.$lines.length,
                    start: a.start,
                    end: a.end,
                  }),
                  s)
                );
              t.applyDelta(a, !0);
            }
          if (o.$timeout) return r.schedule(o.$timeout);
          o.onUpdate();
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
    }).call(o.prototype);
  }),
  ace.define("ace/mode/css/csslint", [], function (e, t, r) {
    var n = (function () {
      var e = e || {},
        t = (function () {
          var e;
          return (
            (e = (function t(r, n, i) {
              function o(s, l) {
                if (!n[s]) {
                  if (!r[s]) {
                    var u = "function" == typeof e && e;
                    if (!l && u) return u(s, !0);
                    if (a) return a(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw ((c.code = "MODULE_NOT_FOUND"), c);
                  }
                  var h = (n[s] = { exports: {} });
                  r[s][0].call(
                    h.exports,
                    function (e) {
                      return o(r[s][1][e] || e);
                    },
                    h,
                    h.exports,
                    t,
                    r,
                    n,
                    i
                  );
                }
                return n[s].exports;
              }
              for (
                var a = "function" == typeof e && e, s = 0;
                s < i.length;
                s++
              )
                o(i[s]);
              return o;
            })(
              {
                1: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = {
                      __proto__: null,
                      aliceblue: "#f0f8ff",
                      antiquewhite: "#faebd7",
                      aqua: "#00ffff",
                      aquamarine: "#7fffd4",
                      azure: "#f0ffff",
                      beige: "#f5f5dc",
                      bisque: "#ffe4c4",
                      black: "#000000",
                      blanchedalmond: "#ffebcd",
                      blue: "#0000ff",
                      blueviolet: "#8a2be2",
                      brown: "#a52a2a",
                      burlywood: "#deb887",
                      cadetblue: "#5f9ea0",
                      chartreuse: "#7fff00",
                      chocolate: "#d2691e",
                      coral: "#ff7f50",
                      cornflowerblue: "#6495ed",
                      cornsilk: "#fff8dc",
                      crimson: "#dc143c",
                      cyan: "#00ffff",
                      darkblue: "#00008b",
                      darkcyan: "#008b8b",
                      darkgoldenrod: "#b8860b",
                      darkgray: "#a9a9a9",
                      darkgreen: "#006400",
                      darkgrey: "#a9a9a9",
                      darkkhaki: "#bdb76b",
                      darkmagenta: "#8b008b",
                      darkolivegreen: "#556b2f",
                      darkorange: "#ff8c00",
                      darkorchid: "#9932cc",
                      darkred: "#8b0000",
                      darksalmon: "#e9967a",
                      darkseagreen: "#8fbc8f",
                      darkslateblue: "#483d8b",
                      darkslategray: "#2f4f4f",
                      darkslategrey: "#2f4f4f",
                      darkturquoise: "#00ced1",
                      darkviolet: "#9400d3",
                      deeppink: "#ff1493",
                      deepskyblue: "#00bfff",
                      dimgray: "#696969",
                      dimgrey: "#696969",
                      dodgerblue: "#1e90ff",
                      firebrick: "#b22222",
                      floralwhite: "#fffaf0",
                      forestgreen: "#228b22",
                      fuchsia: "#ff00ff",
                      gainsboro: "#dcdcdc",
                      ghostwhite: "#f8f8ff",
                      gold: "#ffd700",
                      goldenrod: "#daa520",
                      gray: "#808080",
                      green: "#008000",
                      greenyellow: "#adff2f",
                      grey: "#808080",
                      honeydew: "#f0fff0",
                      hotpink: "#ff69b4",
                      indianred: "#cd5c5c",
                      indigo: "#4b0082",
                      ivory: "#fffff0",
                      khaki: "#f0e68c",
                      lavender: "#e6e6fa",
                      lavenderblush: "#fff0f5",
                      lawngreen: "#7cfc00",
                      lemonchiffon: "#fffacd",
                      lightblue: "#add8e6",
                      lightcoral: "#f08080",
                      lightcyan: "#e0ffff",
                      lightgoldenrodyellow: "#fafad2",
                      lightgray: "#d3d3d3",
                      lightgreen: "#90ee90",
                      lightgrey: "#d3d3d3",
                      lightpink: "#ffb6c1",
                      lightsalmon: "#ffa07a",
                      lightseagreen: "#20b2aa",
                      lightskyblue: "#87cefa",
                      lightslategray: "#778899",
                      lightslategrey: "#778899",
                      lightsteelblue: "#b0c4de",
                      lightyellow: "#ffffe0",
                      lime: "#00ff00",
                      limegreen: "#32cd32",
                      linen: "#faf0e6",
                      magenta: "#ff00ff",
                      maroon: "#800000",
                      mediumaquamarine: "#66cdaa",
                      mediumblue: "#0000cd",
                      mediumorchid: "#ba55d3",
                      mediumpurple: "#9370db",
                      mediumseagreen: "#3cb371",
                      mediumslateblue: "#7b68ee",
                      mediumspringgreen: "#00fa9a",
                      mediumturquoise: "#48d1cc",
                      mediumvioletred: "#c71585",
                      midnightblue: "#191970",
                      mintcream: "#f5fffa",
                      mistyrose: "#ffe4e1",
                      moccasin: "#ffe4b5",
                      navajowhite: "#ffdead",
                      navy: "#000080",
                      oldlace: "#fdf5e6",
                      olive: "#808000",
                      olivedrab: "#6b8e23",
                      orange: "#ffa500",
                      orangered: "#ff4500",
                      orchid: "#da70d6",
                      palegoldenrod: "#eee8aa",
                      palegreen: "#98fb98",
                      paleturquoise: "#afeeee",
                      palevioletred: "#db7093",
                      papayawhip: "#ffefd5",
                      peachpuff: "#ffdab9",
                      peru: "#cd853f",
                      pink: "#ffc0cb",
                      plum: "#dda0dd",
                      powderblue: "#b0e0e6",
                      purple: "#800080",
                      rebeccapurple: "#663399",
                      red: "#ff0000",
                      rosybrown: "#bc8f8f",
                      royalblue: "#4169e1",
                      saddlebrown: "#8b4513",
                      salmon: "#fa8072",
                      sandybrown: "#f4a460",
                      seagreen: "#2e8b57",
                      seashell: "#fff5ee",
                      sienna: "#a0522d",
                      silver: "#c0c0c0",
                      skyblue: "#87ceeb",
                      slateblue: "#6a5acd",
                      slategray: "#708090",
                      slategrey: "#708090",
                      snow: "#fffafa",
                      springgreen: "#00ff7f",
                      steelblue: "#4682b4",
                      tan: "#d2b48c",
                      teal: "#008080",
                      thistle: "#d8bfd8",
                      tomato: "#ff6347",
                      turquoise: "#40e0d0",
                      violet: "#ee82ee",
                      wheat: "#f5deb3",
                      white: "#ffffff",
                      whitesmoke: "#f5f5f5",
                      yellow: "#ffff00",
                      yellowgreen: "#9acd32",
                      currentColor: "The value of the 'color' property.",
                      activeborder: "Active window border.",
                      activecaption: "Active window caption.",
                      appworkspace:
                        "Background color of multiple document interface.",
                      background: "Desktop background.",
                      buttonface:
                        "The face background color for 3-D elements that appear 3-D due to one layer of surrounding border.",
                      buttonhighlight:
                        "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border.",
                      buttonshadow:
                        "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border.",
                      buttontext: "Text on push buttons.",
                      captiontext:
                        "Text in caption, size box, and scrollbar arrow box.",
                      graytext:
                        "Grayed (disabled) text. This color is set to #000 if the current display driver does not support a solid gray color.",
                      greytext:
                        "Greyed (disabled) text. This color is set to #000 if the current display driver does not support a solid grey color.",
                      highlight: "Item(s) selected in a control.",
                      highlighttext: "Text of item(s) selected in a control.",
                      inactiveborder: "Inactive window border.",
                      inactivecaption: "Inactive window caption.",
                      inactivecaptiontext:
                        "Color of text in an inactive caption.",
                      infobackground: "Background color for tooltip controls.",
                      infotext: "Text color for tooltip controls.",
                      menu: "Menu background.",
                      menutext: "Text in menus.",
                      scrollbar: "Scroll bar gray area.",
                      threeddarkshadow:
                        "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",
                      threedface:
                        "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",
                      threedhighlight:
                        "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",
                      threedlightshadow:
                        "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",
                      threedshadow:
                        "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",
                      window: "Window background.",
                      windowframe: "Window frame.",
                      windowtext: "Text in windows.",
                    };
                  },
                  {},
                ],
                2: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r) {
                      n.call(this, e, t, r, i.COMBINATOR_TYPE),
                        (this.type = "unknown"),
                        /^\s+$/.test(e)
                          ? (this.type = "descendant")
                          : ">" === e
                          ? (this.type = "child")
                          : "+" === e
                          ? (this.type = "adjacent-sibling")
                          : "~" === e && (this.type = "sibling");
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                3: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/StringReader"),
                      i = e("../util/SyntaxError");
                    function o(e, t) {
                      (this.match = function (t) {
                        var r;
                        return t.mark(), (r = e(t)) ? t.drop() : t.restore(), r;
                      }),
                        (this.toString =
                          "function" === typeof t
                            ? t
                            : function () {
                                return t;
                              });
                    }
                    (o.prec = { MOD: 5, SEQ: 4, ANDAND: 3, OROR: 2, ALT: 1 }),
                      (o.parse = function (e) {
                        var t, r, a, s, l, u, c, h, d;
                        if (
                          ((t = new n(e)),
                          (r = function (e) {
                            var r = t.readMatch(e);
                            if (null === r)
                              throw new i(
                                "Expected " + e,
                                t.getLine(),
                                t.getCol()
                              );
                            return r;
                          }),
                          (a = function () {
                            for (var e = [s()]; null !== t.readMatch(" | "); )
                              e.push(s());
                            return 1 === e.length ? e[0] : o.alt.apply(o, e);
                          }),
                          (s = function () {
                            for (var e = [l()]; null !== t.readMatch(" || "); )
                              e.push(l());
                            return 1 === e.length ? e[0] : o.oror.apply(o, e);
                          }),
                          (l = function () {
                            for (var e = [u()]; null !== t.readMatch(" && "); )
                              e.push(u());
                            return 1 === e.length ? e[0] : o.andand.apply(o, e);
                          }),
                          (u = function () {
                            for (
                              var e = [c()];
                              null !== t.readMatch(/^ (?![&|\]])/);

                            )
                              e.push(c());
                            return 1 === e.length ? e[0] : o.seq.apply(o, e);
                          }),
                          (c = function () {
                            var e = h();
                            if (null !== t.readMatch("?")) return e.question();
                            if (null !== t.readMatch("*")) return e.star();
                            if (null !== t.readMatch("+")) return e.plus();
                            if (null !== t.readMatch("#")) return e.hash();
                            if (null !== t.readMatch(/^\{\s*/)) {
                              var n = r(/^\d+/);
                              r(/^\s*,\s*/);
                              var i = r(/^\d+/);
                              return (
                                r(/^\s*\}/), e.braces(Number(n), Number(i))
                              );
                            }
                            return e;
                          }),
                          (h = function () {
                            if (null !== t.readMatch("[ ")) {
                              var e = a();
                              return r(" ]"), e;
                            }
                            return o.fromType(r(/^[^ ?*+#{]+/));
                          }),
                          (d = a()),
                          !t.eof())
                        )
                          throw new i(
                            "Expected end of string",
                            t.getLine(),
                            t.getCol()
                          );
                        return d;
                      }),
                      (o.cast = function (e) {
                        return e instanceof o ? e : o.parse(e);
                      }),
                      (o.fromType = function (t) {
                        var r = e("./ValidationTypes");
                        return new o(function (e) {
                          return e.hasNext() && r.isType(e, t);
                        }, t);
                      }),
                      (o.seq = function () {
                        var e = Array.prototype.slice
                          .call(arguments)
                          .map(o.cast);
                        return 1 === e.length
                          ? e[0]
                          : new o(
                              function (t) {
                                var r,
                                  n = !0;
                                for (r = 0; n && r < e.length; r++)
                                  n = e[r].match(t);
                                return n;
                              },
                              function (t) {
                                var r = o.prec.SEQ,
                                  n = e
                                    .map(function (e) {
                                      return e.toString(r);
                                    })
                                    .join(" ");
                                return t > r && (n = "[ " + n + " ]"), n;
                              }
                            );
                      }),
                      (o.alt = function () {
                        var e = Array.prototype.slice
                          .call(arguments)
                          .map(o.cast);
                        return 1 === e.length
                          ? e[0]
                          : new o(
                              function (t) {
                                var r,
                                  n = !1;
                                for (r = 0; !n && r < e.length; r++)
                                  n = e[r].match(t);
                                return n;
                              },
                              function (t) {
                                var r = o.prec.ALT,
                                  n = e
                                    .map(function (e) {
                                      return e.toString(r);
                                    })
                                    .join(" | ");
                                return t > r && (n = "[ " + n + " ]"), n;
                              }
                            );
                      }),
                      (o.many = function (t) {
                        var r = Array.prototype.slice
                          .call(arguments, 1)
                          .reduce(function (t, r) {
                            if (r.expand) {
                              var n = e("./ValidationTypes");
                              t.push.apply(t, n.complex[r.expand].options);
                            } else t.push(o.cast(r));
                            return t;
                          }, []);
                        !0 === t &&
                          (t = r.map(function () {
                            return !0;
                          }));
                        var n = new o(
                          function (e) {
                            var n = [],
                              i = 0,
                              o = 0,
                              a = function a(s) {
                                for (var l = 0; l < r.length; l++)
                                  if (!n[l])
                                    if ((e.mark(), r[l].match(e))) {
                                      if (
                                        ((n[l] = !0),
                                        a(s + (!1 === t || t[l] ? 1 : 0)))
                                      )
                                        return e.drop(), !0;
                                      e.restore(), (n[l] = !1);
                                    } else e.drop();
                                return (function (e) {
                                  return 0 === o
                                    ? ((i = Math.max(e, i)), e === r.length)
                                    : e === i;
                                })(s);
                              };
                            if ((a(0) || (o++, a(0)), !1 === t)) return i > 0;
                            for (var s = 0; s < r.length; s++)
                              if (t[s] && !n[s]) return !1;
                            return !0;
                          },
                          function (e) {
                            var n = !1 === t ? o.prec.OROR : o.prec.ANDAND,
                              i = r
                                .map(function (e, r) {
                                  return !1 === t || t[r]
                                    ? e.toString(n)
                                    : e.toString(o.prec.MOD) + "?";
                                })
                                .join(!1 === t ? " || " : " && ");
                            return e > n && (i = "[ " + i + " ]"), i;
                          }
                        );
                        return (n.options = r), n;
                      }),
                      (o.andand = function () {
                        var e = Array.prototype.slice.call(arguments);
                        return e.unshift(!0), o.many.apply(o, e);
                      }),
                      (o.oror = function () {
                        var e = Array.prototype.slice.call(arguments);
                        return e.unshift(!1), o.many.apply(o, e);
                      }),
                      (o.prototype = {
                        constructor: o,
                        match: function () {
                          throw new Error("unimplemented");
                        },
                        toString: function () {
                          throw new Error("unimplemented");
                        },
                        func: function () {
                          return this.match.bind(this);
                        },
                        then: function (e) {
                          return o.seq(this, e);
                        },
                        or: function (e) {
                          return o.alt(this, e);
                        },
                        andand: function (e) {
                          return o.many(!0, this, e);
                        },
                        oror: function (e) {
                          return o.many(!1, this, e);
                        },
                        star: function () {
                          return this.braces(0, 1 / 0, "*");
                        },
                        plus: function () {
                          return this.braces(1, 1 / 0, "+");
                        },
                        question: function () {
                          return this.braces(0, 1, "?");
                        },
                        hash: function () {
                          return this.braces(1, 1 / 0, "#", o.cast(","));
                        },
                        braces: function (e, t, r, n) {
                          var i = this,
                            a = n ? n.then(this) : this;
                          return (
                            r || (r = "{" + e + "," + t + "}"),
                            new o(
                              function (r) {
                                var o;
                                for (
                                  o = 0;
                                  o < t &&
                                  (o > 0 && n ? a.match(r) : i.match(r));
                                  o++
                                );
                                return o >= e;
                              },
                              function () {
                                return i.toString(o.prec.MOD) + r;
                              }
                            )
                          );
                        },
                      });
                  },
                  {
                    "../util/StringReader": 24,
                    "../util/SyntaxError": 25,
                    "./ValidationTypes": 21,
                  },
                ],
                4: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t) {
                      n.call(
                        this,
                        "(" + e + (null !== t ? ":" + t : "") + ")",
                        e.startLine,
                        e.startCol,
                        i.MEDIA_FEATURE_TYPE
                      ),
                        (this.name = e),
                        (this.value = t);
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                5: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r, o, a) {
                      n.call(
                        this,
                        (e ? e + " " : "") +
                          (t || "") +
                          (t && r.length > 0 ? " and " : "") +
                          r.join(" and "),
                        o,
                        a,
                        i.MEDIA_QUERY_TYPE
                      ),
                        (this.modifier = e),
                        (this.mediaType = t),
                        (this.features = r);
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                6: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = w;
                    var n = e("../util/EventTarget"),
                      i = e("../util/SyntaxError"),
                      o = e("../util/SyntaxUnit"),
                      a = e("./Combinator"),
                      s = e("./MediaFeature"),
                      l = e("./MediaQuery"),
                      u = e("./PropertyName"),
                      c = e("./PropertyValue"),
                      h = e("./PropertyValuePart"),
                      d = e("./Selector"),
                      p = e("./SelectorPart"),
                      f = e("./SelectorSubPart"),
                      m = e("./TokenStream"),
                      g = e("./Tokens"),
                      b = e("./Validation");
                    function w(e) {
                      n.call(this),
                        (this.options = e || {}),
                        (this._tokenStream = null);
                    }
                    (w.DEFAULT_TYPE = 0),
                      (w.COMBINATOR_TYPE = 1),
                      (w.MEDIA_FEATURE_TYPE = 2),
                      (w.MEDIA_QUERY_TYPE = 3),
                      (w.PROPERTY_NAME_TYPE = 4),
                      (w.PROPERTY_VALUE_TYPE = 5),
                      (w.PROPERTY_VALUE_PART_TYPE = 6),
                      (w.SELECTOR_TYPE = 7),
                      (w.SELECTOR_PART_TYPE = 8),
                      (w.SELECTOR_SUB_PART_TYPE = 9),
                      (w.prototype = (function () {
                        var e,
                          t = new n(),
                          r = {
                            __proto__: null,
                            constructor: w,
                            DEFAULT_TYPE: 0,
                            COMBINATOR_TYPE: 1,
                            MEDIA_FEATURE_TYPE: 2,
                            MEDIA_QUERY_TYPE: 3,
                            PROPERTY_NAME_TYPE: 4,
                            PROPERTY_VALUE_TYPE: 5,
                            PROPERTY_VALUE_PART_TYPE: 6,
                            SELECTOR_TYPE: 7,
                            SELECTOR_PART_TYPE: 8,
                            SELECTOR_SUB_PART_TYPE: 9,
                            _stylesheet: function () {
                              var e,
                                t,
                                r,
                                n = this._tokenStream;
                              for (
                                this.fire("startstylesheet"),
                                  this._charset(),
                                  this._skipCruft();
                                n.peek() === g.IMPORT_SYM;

                              )
                                this._import(), this._skipCruft();
                              for (; n.peek() === g.NAMESPACE_SYM; )
                                this._namespace(), this._skipCruft();
                              for (r = n.peek(); r > g.EOF; ) {
                                try {
                                  switch (r) {
                                    case g.MEDIA_SYM:
                                      this._media(), this._skipCruft();
                                      break;
                                    case g.PAGE_SYM:
                                      this._page(), this._skipCruft();
                                      break;
                                    case g.FONT_FACE_SYM:
                                      this._font_face(), this._skipCruft();
                                      break;
                                    case g.KEYFRAMES_SYM:
                                      this._keyframes(), this._skipCruft();
                                      break;
                                    case g.VIEWPORT_SYM:
                                      this._viewport(), this._skipCruft();
                                      break;
                                    case g.DOCUMENT_SYM:
                                      this._document(), this._skipCruft();
                                      break;
                                    case g.SUPPORTS_SYM:
                                      this._supports(), this._skipCruft();
                                      break;
                                    case g.UNKNOWN_SYM:
                                      if ((n.get(), this.options.strict))
                                        throw new i(
                                          "Unknown @ rule.",
                                          n.LT(0).startLine,
                                          n.LT(0).startCol
                                        );
                                      for (
                                        this.fire({
                                          type: "error",
                                          error: null,
                                          message:
                                            "Unknown @ rule: " +
                                            n.LT(0).value +
                                            ".",
                                          line: n.LT(0).startLine,
                                          col: n.LT(0).startCol,
                                        }),
                                          e = 0;
                                        n.advance([g.LBRACE, g.RBRACE]) ===
                                        g.LBRACE;

                                      )
                                        e++;
                                      for (; e; ) n.advance([g.RBRACE]), e--;
                                      break;
                                    case g.S:
                                      this._readWhitespace();
                                      break;
                                    default:
                                      if (!this._ruleset())
                                        switch (r) {
                                          case g.CHARSET_SYM:
                                            throw (
                                              ((t = n.LT(1)),
                                              this._charset(!1),
                                              new i(
                                                "@charset not allowed here.",
                                                t.startLine,
                                                t.startCol
                                              ))
                                            );
                                          case g.IMPORT_SYM:
                                            throw (
                                              ((t = n.LT(1)),
                                              this._import(!1),
                                              new i(
                                                "@import not allowed here.",
                                                t.startLine,
                                                t.startCol
                                              ))
                                            );
                                          case g.NAMESPACE_SYM:
                                            throw (
                                              ((t = n.LT(1)),
                                              this._namespace(!1),
                                              new i(
                                                "@namespace not allowed here.",
                                                t.startLine,
                                                t.startCol
                                              ))
                                            );
                                          default:
                                            n.get(),
                                              this._unexpectedToken(n.token());
                                        }
                                  }
                                } catch (o) {
                                  if (!(o instanceof i) || this.options.strict)
                                    throw o;
                                  this.fire({
                                    type: "error",
                                    error: o,
                                    message: o.message,
                                    line: o.line,
                                    col: o.col,
                                  });
                                }
                                r = n.peek();
                              }
                              r !== g.EOF && this._unexpectedToken(n.token()),
                                this.fire("endstylesheet");
                            },
                            _charset: function (e) {
                              var t,
                                r,
                                n,
                                i = this._tokenStream;
                              i.match(g.CHARSET_SYM) &&
                                ((r = i.token().startLine),
                                (n = i.token().startCol),
                                this._readWhitespace(),
                                i.mustMatch(g.STRING),
                                (t = i.token().value),
                                this._readWhitespace(),
                                i.mustMatch(g.SEMICOLON),
                                !1 !== e &&
                                  this.fire({
                                    type: "charset",
                                    charset: t,
                                    line: r,
                                    col: n,
                                  }));
                            },
                            _import: function (e) {
                              var t,
                                r,
                                n,
                                i = this._tokenStream;
                              i.mustMatch(g.IMPORT_SYM),
                                (r = i.token()),
                                this._readWhitespace(),
                                i.mustMatch([g.STRING, g.URI]),
                                (t = i
                                  .token()
                                  .value.replace(
                                    /^(?:url\()?["']?([^"']+?)["']?\)?$/,
                                    "$1"
                                  )),
                                this._readWhitespace(),
                                (n = this._media_query_list()),
                                i.mustMatch(g.SEMICOLON),
                                this._readWhitespace(),
                                !1 !== e &&
                                  this.fire({
                                    type: "import",
                                    uri: t,
                                    media: n,
                                    line: r.startLine,
                                    col: r.startCol,
                                  });
                            },
                            _namespace: function (e) {
                              var t,
                                r,
                                n,
                                i,
                                o = this._tokenStream;
                              o.mustMatch(g.NAMESPACE_SYM),
                                (t = o.token().startLine),
                                (r = o.token().startCol),
                                this._readWhitespace(),
                                o.match(g.IDENT) &&
                                  ((n = o.token().value),
                                  this._readWhitespace()),
                                o.mustMatch([g.STRING, g.URI]),
                                (i = o
                                  .token()
                                  .value.replace(
                                    /(?:url\()?["']([^"']+)["']\)?/,
                                    "$1"
                                  )),
                                this._readWhitespace(),
                                o.mustMatch(g.SEMICOLON),
                                this._readWhitespace(),
                                !1 !== e &&
                                  this.fire({
                                    type: "namespace",
                                    prefix: n,
                                    uri: i,
                                    line: t,
                                    col: r,
                                  });
                            },
                            _supports: function (e) {
                              var t,
                                r,
                                n = this._tokenStream;
                              if (n.match(g.SUPPORTS_SYM)) {
                                for (
                                  t = n.token().startLine,
                                    r = n.token().startCol,
                                    this._readWhitespace(),
                                    this._supports_condition(),
                                    this._readWhitespace(),
                                    n.mustMatch(g.LBRACE),
                                    this._readWhitespace(),
                                    !1 !== e &&
                                      this.fire({
                                        type: "startsupports",
                                        line: t,
                                        col: r,
                                      });
                                  this._ruleset();

                                );
                                n.mustMatch(g.RBRACE),
                                  this._readWhitespace(),
                                  this.fire({
                                    type: "endsupports",
                                    line: t,
                                    col: r,
                                  });
                              }
                            },
                            _supports_condition: function () {
                              var e,
                                t = this._tokenStream;
                              if (t.match(g.IDENT))
                                "not" === (e = t.token().value.toLowerCase())
                                  ? (t.mustMatch(g.S),
                                    this._supports_condition_in_parens())
                                  : t.unget();
                              else
                                for (
                                  this._supports_condition_in_parens(),
                                    this._readWhitespace();
                                  t.peek() === g.IDENT;

                                )
                                  ("and" !==
                                    (e = t.LT(1).value.toLowerCase()) &&
                                    "or" !== e) ||
                                    (t.mustMatch(g.IDENT),
                                    this._readWhitespace(),
                                    this._supports_condition_in_parens(),
                                    this._readWhitespace());
                            },
                            _supports_condition_in_parens: function () {
                              var e = this._tokenStream;
                              e.match(g.LPAREN)
                                ? (this._readWhitespace(),
                                  e.match(g.IDENT)
                                    ? "not" === e.token().value.toLowerCase()
                                      ? (this._readWhitespace(),
                                        this._supports_condition(),
                                        this._readWhitespace(),
                                        e.mustMatch(g.RPAREN))
                                      : (e.unget(),
                                        this._supports_declaration_condition(
                                          !1
                                        ))
                                    : (this._supports_condition(),
                                      this._readWhitespace(),
                                      e.mustMatch(g.RPAREN)))
                                : this._supports_declaration_condition();
                            },
                            _supports_declaration_condition: function (e) {
                              var t = this._tokenStream;
                              !1 !== e && t.mustMatch(g.LPAREN),
                                this._readWhitespace(),
                                this._declaration(),
                                t.mustMatch(g.RPAREN);
                            },
                            _media: function () {
                              var e,
                                t,
                                r,
                                n = this._tokenStream;
                              for (
                                n.mustMatch(g.MEDIA_SYM),
                                  e = n.token().startLine,
                                  t = n.token().startCol,
                                  this._readWhitespace(),
                                  r = this._media_query_list(),
                                  n.mustMatch(g.LBRACE),
                                  this._readWhitespace(),
                                  this.fire({
                                    type: "startmedia",
                                    media: r,
                                    line: e,
                                    col: t,
                                  });
                                ;

                              )
                                if (n.peek() === g.PAGE_SYM) this._page();
                                else if (n.peek() === g.FONT_FACE_SYM)
                                  this._font_face();
                                else if (n.peek() === g.VIEWPORT_SYM)
                                  this._viewport();
                                else if (n.peek() === g.DOCUMENT_SYM)
                                  this._document();
                                else if (n.peek() === g.SUPPORTS_SYM)
                                  this._supports();
                                else if (n.peek() === g.MEDIA_SYM)
                                  this._media();
                                else if (!this._ruleset()) break;
                              n.mustMatch(g.RBRACE),
                                this._readWhitespace(),
                                this.fire({
                                  type: "endmedia",
                                  media: r,
                                  line: e,
                                  col: t,
                                });
                            },
                            _media_query_list: function () {
                              var e = this._tokenStream,
                                t = [];
                              for (
                                this._readWhitespace(),
                                  (e.peek() !== g.IDENT &&
                                    e.peek() !== g.LPAREN) ||
                                    t.push(this._media_query());
                                e.match(g.COMMA);

                              )
                                this._readWhitespace(),
                                  t.push(this._media_query());
                              return t;
                            },
                            _media_query: function () {
                              var e = this._tokenStream,
                                t = null,
                                r = null,
                                n = null,
                                i = [];
                              if (
                                (e.match(g.IDENT) &&
                                  ("only" !==
                                    (r = e.token().value.toLowerCase()) &&
                                  "not" !== r
                                    ? (e.unget(), (r = null))
                                    : (n = e.token())),
                                this._readWhitespace(),
                                e.peek() === g.IDENT
                                  ? ((t = this._media_type()),
                                    null === n && (n = e.token()))
                                  : e.peek() === g.LPAREN &&
                                    (null === n && (n = e.LT(1)),
                                    i.push(this._media_expression())),
                                null === t && 0 === i.length)
                              )
                                return null;
                              for (this._readWhitespace(); e.match(g.IDENT); )
                                "and" !== e.token().value.toLowerCase() &&
                                  this._unexpectedToken(e.token()),
                                  this._readWhitespace(),
                                  i.push(this._media_expression());
                              return new l(r, t, i, n.startLine, n.startCol);
                            },
                            _media_type: function () {
                              return this._media_feature();
                            },
                            _media_expression: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = null;
                              return (
                                r.mustMatch(g.LPAREN),
                                this._readWhitespace(),
                                (e = this._media_feature()),
                                this._readWhitespace(),
                                r.match(g.COLON) &&
                                  (this._readWhitespace(),
                                  (t = r.LT(1)),
                                  (n = this._expression())),
                                r.mustMatch(g.RPAREN),
                                this._readWhitespace(),
                                new s(
                                  e,
                                  n ? new o(n, t.startLine, t.startCol) : null
                                )
                              );
                            },
                            _media_feature: function () {
                              var e = this._tokenStream;
                              return (
                                this._readWhitespace(),
                                e.mustMatch(g.IDENT),
                                o.fromToken(e.token())
                              );
                            },
                            _page: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = null,
                                i = null;
                              r.mustMatch(g.PAGE_SYM),
                                (e = r.token().startLine),
                                (t = r.token().startCol),
                                this._readWhitespace(),
                                r.match(g.IDENT) &&
                                  "auto" ===
                                    (n = r.token().value).toLowerCase() &&
                                  this._unexpectedToken(r.token()),
                                r.peek() === g.COLON &&
                                  (i = this._pseudo_page()),
                                this._readWhitespace(),
                                this.fire({
                                  type: "startpage",
                                  id: n,
                                  pseudo: i,
                                  line: e,
                                  col: t,
                                }),
                                this._readDeclarations(!0, !0),
                                this.fire({
                                  type: "endpage",
                                  id: n,
                                  pseudo: i,
                                  line: e,
                                  col: t,
                                });
                            },
                            _margin: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = this._margin_sym();
                              return (
                                !!n &&
                                ((e = r.token().startLine),
                                (t = r.token().startCol),
                                this.fire({
                                  type: "startpagemargin",
                                  margin: n,
                                  line: e,
                                  col: t,
                                }),
                                this._readDeclarations(!0),
                                this.fire({
                                  type: "endpagemargin",
                                  margin: n,
                                  line: e,
                                  col: t,
                                }),
                                !0)
                              );
                            },
                            _margin_sym: function () {
                              var e = this._tokenStream;
                              return e.match([
                                g.TOPLEFTCORNER_SYM,
                                g.TOPLEFT_SYM,
                                g.TOPCENTER_SYM,
                                g.TOPRIGHT_SYM,
                                g.TOPRIGHTCORNER_SYM,
                                g.BOTTOMLEFTCORNER_SYM,
                                g.BOTTOMLEFT_SYM,
                                g.BOTTOMCENTER_SYM,
                                g.BOTTOMRIGHT_SYM,
                                g.BOTTOMRIGHTCORNER_SYM,
                                g.LEFTTOP_SYM,
                                g.LEFTMIDDLE_SYM,
                                g.LEFTBOTTOM_SYM,
                                g.RIGHTTOP_SYM,
                                g.RIGHTMIDDLE_SYM,
                                g.RIGHTBOTTOM_SYM,
                              ])
                                ? o.fromToken(e.token())
                                : null;
                            },
                            _pseudo_page: function () {
                              var e = this._tokenStream;
                              return (
                                e.mustMatch(g.COLON),
                                e.mustMatch(g.IDENT),
                                e.token().value
                              );
                            },
                            _font_face: function () {
                              var e,
                                t,
                                r = this._tokenStream;
                              r.mustMatch(g.FONT_FACE_SYM),
                                (e = r.token().startLine),
                                (t = r.token().startCol),
                                this._readWhitespace(),
                                this.fire({
                                  type: "startfontface",
                                  line: e,
                                  col: t,
                                }),
                                this._readDeclarations(!0),
                                this.fire({
                                  type: "endfontface",
                                  line: e,
                                  col: t,
                                });
                            },
                            _viewport: function () {
                              var e,
                                t,
                                r = this._tokenStream;
                              r.mustMatch(g.VIEWPORT_SYM),
                                (e = r.token().startLine),
                                (t = r.token().startCol),
                                this._readWhitespace(),
                                this.fire({
                                  type: "startviewport",
                                  line: e,
                                  col: t,
                                }),
                                this._readDeclarations(!0),
                                this.fire({
                                  type: "endviewport",
                                  line: e,
                                  col: t,
                                });
                            },
                            _document: function () {
                              var e,
                                t = this._tokenStream,
                                r = [],
                                n = "";
                              for (
                                t.mustMatch(g.DOCUMENT_SYM),
                                  e = t.token(),
                                  /^@-([^-]+)-/.test(e.value) &&
                                    (n = RegExp.$1),
                                  this._readWhitespace(),
                                  r.push(this._document_function());
                                t.match(g.COMMA);

                              )
                                this._readWhitespace(),
                                  r.push(this._document_function());
                              t.mustMatch(g.LBRACE),
                                this._readWhitespace(),
                                this.fire({
                                  type: "startdocument",
                                  functions: r,
                                  prefix: n,
                                  line: e.startLine,
                                  col: e.startCol,
                                });
                              for (var i = !0; i; )
                                switch (t.peek()) {
                                  case g.PAGE_SYM:
                                    this._page();
                                    break;
                                  case g.FONT_FACE_SYM:
                                    this._font_face();
                                    break;
                                  case g.VIEWPORT_SYM:
                                    this._viewport();
                                    break;
                                  case g.MEDIA_SYM:
                                    this._media();
                                    break;
                                  case g.KEYFRAMES_SYM:
                                    this._keyframes();
                                    break;
                                  case g.DOCUMENT_SYM:
                                    this._document();
                                    break;
                                  default:
                                    i = Boolean(this._ruleset());
                                }
                              t.mustMatch(g.RBRACE),
                                (e = t.token()),
                                this._readWhitespace(),
                                this.fire({
                                  type: "enddocument",
                                  functions: r,
                                  prefix: n,
                                  line: e.startLine,
                                  col: e.startCol,
                                });
                            },
                            _document_function: function () {
                              var e,
                                t = this._tokenStream;
                              return (
                                t.match(g.URI)
                                  ? ((e = t.token().value),
                                    this._readWhitespace())
                                  : (e = this._function()),
                                e
                              );
                            },
                            _operator: function (e) {
                              var t = this._tokenStream,
                                r = null;
                              return (
                                (t.match([g.SLASH, g.COMMA]) ||
                                  (e && t.match([g.PLUS, g.STAR, g.MINUS]))) &&
                                  ((r = t.token()), this._readWhitespace()),
                                r ? h.fromToken(r) : null
                              );
                            },
                            _combinator: function () {
                              var e,
                                t = this._tokenStream,
                                r = null;
                              return (
                                t.match([g.PLUS, g.GREATER, g.TILDE]) &&
                                  ((e = t.token()),
                                  (r = new a(e.value, e.startLine, e.startCol)),
                                  this._readWhitespace()),
                                r
                              );
                            },
                            _unary_operator: function () {
                              var e = this._tokenStream;
                              return e.match([g.MINUS, g.PLUS])
                                ? e.token().value
                                : null;
                            },
                            _property: function () {
                              var e,
                                t,
                                r,
                                n = this._tokenStream,
                                i = null,
                                o = null,
                                a = "";
                              if (
                                (n.peek() === g.STAR &&
                                  this.options.starHack &&
                                  (n.get(),
                                  (o = (e = n.token()).value),
                                  (t = e.startLine),
                                  (r = e.startCol)),
                                n.peek() === g.MINUS &&
                                  (n.get(),
                                  (a = (e = n.token()).value),
                                  (t = e.startLine),
                                  (r = e.startCol)),
                                n.match(g.IDENT))
                              )
                                "_" ===
                                  (a += (e = n.token()).value).charAt(0) &&
                                  this.options.underscoreHack &&
                                  ((o = "_"), (a = a.substring(1))),
                                  (i = new u(
                                    a,
                                    o,
                                    t || e.startLine,
                                    r || e.startCol
                                  )),
                                  this._readWhitespace();
                              else {
                                var s = n.peek();
                                s !== g.EOF &&
                                  s !== g.RBRACE &&
                                  this._unexpectedToken(n.LT(1));
                              }
                              return i;
                            },
                            _ruleset: function () {
                              var e,
                                t = this._tokenStream;
                              try {
                                e = this._selectors_group();
                              } catch (r) {
                                if (!(r instanceof i) || this.options.strict)
                                  throw r;
                                if (
                                  (this.fire({
                                    type: "error",
                                    error: r,
                                    message: r.message,
                                    line: r.line,
                                    col: r.col,
                                  }),
                                  t.advance([g.RBRACE]) !== g.RBRACE)
                                )
                                  throw r;
                                return !0;
                              }
                              return (
                                e &&
                                  (this.fire({
                                    type: "startrule",
                                    selectors: e,
                                    line: e[0].line,
                                    col: e[0].col,
                                  }),
                                  this._readDeclarations(!0),
                                  this.fire({
                                    type: "endrule",
                                    selectors: e,
                                    line: e[0].line,
                                    col: e[0].col,
                                  })),
                                e
                              );
                            },
                            _selectors_group: function () {
                              var e,
                                t = this._tokenStream,
                                r = [];
                              if (null !== (e = this._selector()))
                                for (r.push(e); t.match(g.COMMA); )
                                  this._readWhitespace(),
                                    null !== (e = this._selector())
                                      ? r.push(e)
                                      : this._unexpectedToken(t.LT(1));
                              return r.length ? r : null;
                            },
                            _selector: function () {
                              var e = this._tokenStream,
                                t = [],
                                r = null,
                                n = null,
                                i = null;
                              if (
                                null === (r = this._simple_selector_sequence())
                              )
                                return null;
                              for (t.push(r); ; )
                                if (null !== (n = this._combinator()))
                                  t.push(n),
                                    null ===
                                    (r = this._simple_selector_sequence())
                                      ? this._unexpectedToken(e.LT(1))
                                      : t.push(r);
                                else {
                                  if (!this._readWhitespace()) break;
                                  (i = new a(
                                    e.token().value,
                                    e.token().startLine,
                                    e.token().startCol
                                  )),
                                    (n = this._combinator()),
                                    null ===
                                    (r = this._simple_selector_sequence())
                                      ? null !== n &&
                                        this._unexpectedToken(e.LT(1))
                                      : (null !== n ? t.push(n) : t.push(i),
                                        t.push(r));
                                }
                              return new d(t, t[0].line, t[0].col);
                            },
                            _simple_selector_sequence: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = null,
                                i = [],
                                o = "",
                                a = [
                                  function () {
                                    return r.match(g.HASH)
                                      ? new f(
                                          r.token().value,
                                          "id",
                                          r.token().startLine,
                                          r.token().startCol
                                        )
                                      : null;
                                  },
                                  this._class,
                                  this._attrib,
                                  this._pseudo,
                                  this._negation,
                                ],
                                s = 0,
                                l = a.length,
                                u = null;
                              for (
                                e = r.LT(1).startLine,
                                  t = r.LT(1).startCol,
                                  (n = this._type_selector()) ||
                                    (n = this._universal()),
                                  null !== n && (o += n);
                                r.peek() !== g.S;

                              ) {
                                for (; s < l && null === u; )
                                  u = a[s++].call(this);
                                if (null === u) {
                                  if ("" === o) return null;
                                  break;
                                }
                                (s = 0),
                                  i.push(u),
                                  (o += u.toString()),
                                  (u = null);
                              }
                              return "" !== o ? new p(n, i, o, e, t) : null;
                            },
                            _type_selector: function () {
                              var e = this._tokenStream,
                                t = this._namespace_prefix(),
                                r = this._element_name();
                              return r
                                ? (t &&
                                    ((r.text = t + r.text),
                                    (r.col -= t.length)),
                                  r)
                                : (t && (e.unget(), t.length > 1 && e.unget()),
                                  null);
                            },
                            _class: function () {
                              var e,
                                t = this._tokenStream;
                              return t.match(g.DOT)
                                ? (t.mustMatch(g.IDENT),
                                  (e = t.token()),
                                  new f(
                                    "." + e.value,
                                    "class",
                                    e.startLine,
                                    e.startCol - 1
                                  ))
                                : null;
                            },
                            _element_name: function () {
                              var e,
                                t = this._tokenStream;
                              return t.match(g.IDENT)
                                ? ((e = t.token()),
                                  new f(
                                    e.value,
                                    "elementName",
                                    e.startLine,
                                    e.startCol
                                  ))
                                : null;
                            },
                            _namespace_prefix: function () {
                              var e = this._tokenStream,
                                t = "";
                              return (
                                (e.LA(1) !== g.PIPE && e.LA(2) !== g.PIPE) ||
                                  (e.match([g.IDENT, g.STAR]) &&
                                    (t += e.token().value),
                                  e.mustMatch(g.PIPE),
                                  (t += "|")),
                                t.length ? t : null
                              );
                            },
                            _universal: function () {
                              var e,
                                t = this._tokenStream,
                                r = "";
                              return (
                                (e = this._namespace_prefix()) && (r += e),
                                t.match(g.STAR) && (r += "*"),
                                r.length ? r : null
                              );
                            },
                            _attrib: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = null;
                              return r.match(g.LBRACKET)
                                ? ((n = (t = r.token()).value),
                                  (n += this._readWhitespace()),
                                  (e = this._namespace_prefix()) && (n += e),
                                  r.mustMatch(g.IDENT),
                                  (n += r.token().value),
                                  (n += this._readWhitespace()),
                                  r.match([
                                    g.PREFIXMATCH,
                                    g.SUFFIXMATCH,
                                    g.SUBSTRINGMATCH,
                                    g.EQUALS,
                                    g.INCLUDES,
                                    g.DASHMATCH,
                                  ]) &&
                                    ((n += r.token().value),
                                    (n += this._readWhitespace()),
                                    r.mustMatch([g.IDENT, g.STRING]),
                                    (n += r.token().value),
                                    (n += this._readWhitespace())),
                                  r.mustMatch(g.RBRACKET),
                                  new f(
                                    n + "]",
                                    "attribute",
                                    t.startLine,
                                    t.startCol
                                  ))
                                : null;
                            },
                            _pseudo: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = null,
                                o = ":";
                              if (r.match(g.COLON)) {
                                if (
                                  (r.match(g.COLON) && (o += ":"),
                                  r.match(g.IDENT)
                                    ? ((n = r.token().value),
                                      (e = r.token().startLine),
                                      (t = r.token().startCol - o.length))
                                    : r.peek() === g.FUNCTION &&
                                      ((e = r.LT(1).startLine),
                                      (t = r.LT(1).startCol - o.length),
                                      (n = this._functional_pseudo())),
                                  !n)
                                ) {
                                  var a = r.LT(1).startLine,
                                    s = r.LT(0).startCol;
                                  throw new i(
                                    "Expected a `FUNCTION` or `IDENT` after colon at line " +
                                      a +
                                      ", col " +
                                      s +
                                      ".",
                                    a,
                                    s
                                  );
                                }
                                n = new f(o + n, "pseudo", e, t);
                              }
                              return n;
                            },
                            _functional_pseudo: function () {
                              var e = this._tokenStream,
                                t = null;
                              return (
                                e.match(g.FUNCTION) &&
                                  ((t = e.token().value),
                                  (t += this._readWhitespace()),
                                  (t += this._expression()),
                                  e.mustMatch(g.RPAREN),
                                  (t += ")")),
                                t
                              );
                            },
                            _expression: function () {
                              for (
                                var e = this._tokenStream, t = "";
                                e.match([
                                  g.PLUS,
                                  g.MINUS,
                                  g.DIMENSION,
                                  g.NUMBER,
                                  g.STRING,
                                  g.IDENT,
                                  g.LENGTH,
                                  g.FREQ,
                                  g.ANGLE,
                                  g.TIME,
                                  g.RESOLUTION,
                                  g.SLASH,
                                ]);

                              )
                                (t += e.token().value),
                                  (t += this._readWhitespace());
                              return t.length ? t : null;
                            },
                            _negation: function () {
                              var e,
                                t,
                                r,
                                n = this._tokenStream,
                                i = "",
                                o = null;
                              return (
                                n.match(g.NOT) &&
                                  ((i = n.token().value),
                                  (e = n.token().startLine),
                                  (t = n.token().startCol),
                                  (i += this._readWhitespace()),
                                  (i += r = this._negation_arg()),
                                  (i += this._readWhitespace()),
                                  n.match(g.RPAREN),
                                  (i += n.token().value),
                                  (o = new f(i, "not", e, t)).args.push(r)),
                                o
                              );
                            },
                            _negation_arg: function () {
                              var e,
                                t,
                                r = this._tokenStream,
                                n = [
                                  this._type_selector,
                                  this._universal,
                                  function () {
                                    return r.match(g.HASH)
                                      ? new f(
                                          r.token().value,
                                          "id",
                                          r.token().startLine,
                                          r.token().startCol
                                        )
                                      : null;
                                  },
                                  this._class,
                                  this._attrib,
                                  this._pseudo,
                                ],
                                i = null,
                                o = 0,
                                a = n.length;
                              for (
                                e = r.LT(1).startLine, t = r.LT(1).startCol;
                                o < a && null === i;

                              )
                                (i = n[o].call(this)), o++;
                              return (
                                null === i && this._unexpectedToken(r.LT(1)),
                                "elementName" === i.type
                                  ? new p(i, [], i.toString(), e, t)
                                  : new p(null, [i], i.toString(), e, t)
                              );
                            },
                            _declaration: function () {
                              var e = this._tokenStream,
                                t = null,
                                r = null,
                                n = null,
                                i = null,
                                o = "";
                              if (null !== (t = this._property())) {
                                e.mustMatch(g.COLON),
                                  this._readWhitespace(),
                                  ((r = this._expr()) && 0 !== r.length) ||
                                    this._unexpectedToken(e.LT(1)),
                                  (n = this._prio()),
                                  (o = t.toString()),
                                  ((this.options.starHack && "*" === t.hack) ||
                                    (this.options.underscoreHack &&
                                      "_" === t.hack)) &&
                                    (o = t.text);
                                try {
                                  this._validateProperty(o, r);
                                } catch (a) {
                                  i = a;
                                }
                                return (
                                  this.fire({
                                    type: "property",
                                    property: t,
                                    value: r,
                                    important: n,
                                    line: t.line,
                                    col: t.col,
                                    invalid: i,
                                  }),
                                  !0
                                );
                              }
                              return !1;
                            },
                            _prio: function () {
                              var e = this._tokenStream.match(g.IMPORTANT_SYM);
                              return this._readWhitespace(), e;
                            },
                            _expr: function (e) {
                              var t = [],
                                r = null,
                                n = null;
                              if (null !== (r = this._term(e)))
                                for (t.push(r); ; ) {
                                  if (
                                    ((n = this._operator(e)) && t.push(n),
                                    null === (r = this._term(e)))
                                  )
                                    break;
                                  t.push(r);
                                }
                              return t.length > 0
                                ? new c(t, t[0].line, t[0].col)
                                : null;
                            },
                            _term: function (e) {
                              var t,
                                r,
                                n,
                                i,
                                o = this._tokenStream,
                                a = null,
                                s = null,
                                l = null;
                              return (
                                null !== (t = this._unary_operator()) &&
                                  ((n = o.token().startLine),
                                  (i = o.token().startCol)),
                                o.peek() === g.IE_FUNCTION &&
                                this.options.ieFilters
                                  ? ((a = this._ie_function()),
                                    null === t &&
                                      ((n = o.token().startLine),
                                      (i = o.token().startCol)))
                                  : e &&
                                    o.match([g.LPAREN, g.LBRACE, g.LBRACKET])
                                  ? ((s = (r = o.token()).endChar),
                                    (a = r.value + this._expr(e).text),
                                    null === t &&
                                      ((n = o.token().startLine),
                                      (i = o.token().startCol)),
                                    o.mustMatch(g.type(s)),
                                    (a += s),
                                    this._readWhitespace())
                                  : o.match([
                                      g.NUMBER,
                                      g.PERCENTAGE,
                                      g.LENGTH,
                                      g.ANGLE,
                                      g.TIME,
                                      g.FREQ,
                                      g.STRING,
                                      g.IDENT,
                                      g.URI,
                                      g.UNICODE_RANGE,
                                    ])
                                  ? ((a = o.token().value),
                                    null === t &&
                                      ((n = o.token().startLine),
                                      (i = o.token().startCol),
                                      (l = h.fromToken(o.token()))),
                                    this._readWhitespace())
                                  : null === (r = this._hexcolor())
                                  ? (null === t &&
                                      ((n = o.LT(1).startLine),
                                      (i = o.LT(1).startCol)),
                                    null === a &&
                                      (a =
                                        o.LA(3) === g.EQUALS &&
                                        this.options.ieFilters
                                          ? this._ie_function()
                                          : this._function()))
                                  : ((a = r.value),
                                    null === t &&
                                      ((n = r.startLine), (i = r.startCol))),
                                null !== l
                                  ? l
                                  : null !== a
                                  ? new h(null !== t ? t + a : a, n, i)
                                  : null
                              );
                            },
                            _function: function () {
                              var e,
                                t = this._tokenStream,
                                r = null;
                              if (t.match(g.FUNCTION)) {
                                if (
                                  ((r = t.token().value),
                                  this._readWhitespace(),
                                  (r += this._expr(!0)),
                                  this.options.ieFilters &&
                                    t.peek() === g.EQUALS)
                                )
                                  do {
                                    for (
                                      this._readWhitespace() &&
                                        (r += t.token().value),
                                        t.LA(0) === g.COMMA &&
                                          (r += t.token().value),
                                        t.match(g.IDENT),
                                        r += t.token().value,
                                        t.match(g.EQUALS),
                                        r += t.token().value,
                                        e = t.peek();
                                      e !== g.COMMA &&
                                      e !== g.S &&
                                      e !== g.RPAREN;

                                    )
                                      t.get(),
                                        (r += t.token().value),
                                        (e = t.peek());
                                  } while (t.match([g.COMMA, g.S]));
                                t.match(g.RPAREN),
                                  (r += ")"),
                                  this._readWhitespace();
                              }
                              return r;
                            },
                            _ie_function: function () {
                              var e,
                                t = this._tokenStream,
                                r = null;
                              if (t.match([g.IE_FUNCTION, g.FUNCTION])) {
                                r = t.token().value;
                                do {
                                  for (
                                    this._readWhitespace() &&
                                      (r += t.token().value),
                                      t.LA(0) === g.COMMA &&
                                        (r += t.token().value),
                                      t.match(g.IDENT),
                                      r += t.token().value,
                                      t.match(g.EQUALS),
                                      r += t.token().value,
                                      e = t.peek();
                                    e !== g.COMMA &&
                                    e !== g.S &&
                                    e !== g.RPAREN;

                                  )
                                    t.get(),
                                      (r += t.token().value),
                                      (e = t.peek());
                                } while (t.match([g.COMMA, g.S]));
                                t.match(g.RPAREN),
                                  (r += ")"),
                                  this._readWhitespace();
                              }
                              return r;
                            },
                            _hexcolor: function () {
                              var e,
                                t = this._tokenStream,
                                r = null;
                              if (t.match(g.HASH)) {
                                if (
                                  ((e = (r = t.token()).value),
                                  !/#[a-f0-9]{3,6}/i.test(e))
                                )
                                  throw new i(
                                    "Expected a hex color but found '" +
                                      e +
                                      "' at line " +
                                      r.startLine +
                                      ", col " +
                                      r.startCol +
                                      ".",
                                    r.startLine,
                                    r.startCol
                                  );
                                this._readWhitespace();
                              }
                              return r;
                            },
                            _keyframes: function () {
                              var e,
                                t,
                                r,
                                n = this._tokenStream,
                                i = "";
                              for (
                                n.mustMatch(g.KEYFRAMES_SYM),
                                  e = n.token(),
                                  /^@-([^-]+)-/.test(e.value) &&
                                    (i = RegExp.$1),
                                  this._readWhitespace(),
                                  r = this._keyframe_name(),
                                  this._readWhitespace(),
                                  n.mustMatch(g.LBRACE),
                                  this.fire({
                                    type: "startkeyframes",
                                    name: r,
                                    prefix: i,
                                    line: e.startLine,
                                    col: e.startCol,
                                  }),
                                  this._readWhitespace(),
                                  t = n.peek();
                                t === g.IDENT || t === g.PERCENTAGE;

                              )
                                this._keyframe_rule(),
                                  this._readWhitespace(),
                                  (t = n.peek());
                              this.fire({
                                type: "endkeyframes",
                                name: r,
                                prefix: i,
                                line: e.startLine,
                                col: e.startCol,
                              }),
                                this._readWhitespace(),
                                n.mustMatch(g.RBRACE),
                                this._readWhitespace();
                            },
                            _keyframe_name: function () {
                              var e = this._tokenStream;
                              return (
                                e.mustMatch([g.IDENT, g.STRING]),
                                o.fromToken(e.token())
                              );
                            },
                            _keyframe_rule: function () {
                              var e = this._key_list();
                              this.fire({
                                type: "startkeyframerule",
                                keys: e,
                                line: e[0].line,
                                col: e[0].col,
                              }),
                                this._readDeclarations(!0),
                                this.fire({
                                  type: "endkeyframerule",
                                  keys: e,
                                  line: e[0].line,
                                  col: e[0].col,
                                });
                            },
                            _key_list: function () {
                              var e = this._tokenStream,
                                t = [];
                              for (
                                t.push(this._key()), this._readWhitespace();
                                e.match(g.COMMA);

                              )
                                this._readWhitespace(),
                                  t.push(this._key()),
                                  this._readWhitespace();
                              return t;
                            },
                            _key: function () {
                              var e,
                                t = this._tokenStream;
                              if (t.match(g.PERCENTAGE))
                                return o.fromToken(t.token());
                              if (t.match(g.IDENT)) {
                                if (((e = t.token()), /from|to/i.test(e.value)))
                                  return o.fromToken(e);
                                t.unget();
                              }
                              this._unexpectedToken(t.LT(1));
                            },
                            _skipCruft: function () {
                              for (
                                ;
                                this._tokenStream.match([g.S, g.CDO, g.CDC]);

                              );
                            },
                            _readDeclarations: function (e, t) {
                              var r,
                                n = this._tokenStream;
                              this._readWhitespace(),
                                e && n.mustMatch(g.LBRACE),
                                this._readWhitespace();
                              try {
                                for (;;) {
                                  if (
                                    n.match(g.SEMICOLON) ||
                                    (t && this._margin())
                                  );
                                  else {
                                    if (!this._declaration()) break;
                                    if (!n.match(g.SEMICOLON)) break;
                                  }
                                  this._readWhitespace();
                                }
                                n.mustMatch(g.RBRACE), this._readWhitespace();
                              } catch (o) {
                                if (!(o instanceof i) || this.options.strict)
                                  throw o;
                                if (
                                  (this.fire({
                                    type: "error",
                                    error: o,
                                    message: o.message,
                                    line: o.line,
                                    col: o.col,
                                  }),
                                  (r = n.advance([g.SEMICOLON, g.RBRACE])) ===
                                    g.SEMICOLON)
                                )
                                  this._readDeclarations(!1, t);
                                else if (r !== g.EOF && r !== g.RBRACE) throw o;
                              }
                            },
                            _readWhitespace: function () {
                              for (
                                var e = this._tokenStream, t = "";
                                e.match(g.S);

                              )
                                t += e.token().value;
                              return t;
                            },
                            _unexpectedToken: function (e) {
                              throw new i(
                                "Unexpected token '" +
                                  e.value +
                                  "' at line " +
                                  e.startLine +
                                  ", col " +
                                  e.startCol +
                                  ".",
                                e.startLine,
                                e.startCol
                              );
                            },
                            _verifyEnd: function () {
                              this._tokenStream.LA(1) !== g.EOF &&
                                this._unexpectedToken(this._tokenStream.LT(1));
                            },
                            _validateProperty: function (e, t) {
                              b.validate(e, t);
                            },
                            parse: function (e) {
                              (this._tokenStream = new m(e, g)),
                                this._stylesheet();
                            },
                            parseStyleSheet: function (e) {
                              return this.parse(e);
                            },
                            parseMediaQuery: function (e) {
                              this._tokenStream = new m(e, g);
                              var t = this._media_query();
                              return this._verifyEnd(), t;
                            },
                            parsePropertyValue: function (e) {
                              (this._tokenStream = new m(e, g)),
                                this._readWhitespace();
                              var t = this._expr();
                              return (
                                this._readWhitespace(), this._verifyEnd(), t
                              );
                            },
                            parseRule: function (e) {
                              (this._tokenStream = new m(e, g)),
                                this._readWhitespace();
                              var t = this._ruleset();
                              return (
                                this._readWhitespace(), this._verifyEnd(), t
                              );
                            },
                            parseSelector: function (e) {
                              (this._tokenStream = new m(e, g)),
                                this._readWhitespace();
                              var t = this._selector();
                              return (
                                this._readWhitespace(), this._verifyEnd(), t
                              );
                            },
                            parseStyleAttribute: function (e) {
                              (e += "}"),
                                (this._tokenStream = new m(e, g)),
                                this._readDeclarations();
                            },
                          };
                        for (e in r)
                          Object.prototype.hasOwnProperty.call(r, e) &&
                            (t[e] = r[e]);
                        return t;
                      })());
                  },
                  {
                    "../util/EventTarget": 23,
                    "../util/SyntaxError": 25,
                    "../util/SyntaxUnit": 26,
                    "./Combinator": 2,
                    "./MediaFeature": 4,
                    "./MediaQuery": 5,
                    "./PropertyName": 8,
                    "./PropertyValue": 9,
                    "./PropertyValuePart": 11,
                    "./Selector": 13,
                    "./SelectorPart": 14,
                    "./SelectorSubPart": 15,
                    "./TokenStream": 17,
                    "./Tokens": 18,
                    "./Validation": 19,
                  },
                ],
                7: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = {
                      __proto__: null,
                      "align-items":
                        "flex-start | flex-end | center | baseline | stretch",
                      "align-content":
                        "flex-start | flex-end | center | space-between | space-around | stretch",
                      "align-self":
                        "auto | flex-start | flex-end | center | baseline | stretch",
                      all: "initial | inherit | unset",
                      "-webkit-align-items":
                        "flex-start | flex-end | center | baseline | stretch",
                      "-webkit-align-content":
                        "flex-start | flex-end | center | space-between | space-around | stretch",
                      "-webkit-align-self":
                        "auto | flex-start | flex-end | center | baseline | stretch",
                      "alignment-adjust":
                        "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>",
                      "alignment-baseline":
                        "auto | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
                      animation: 1,
                      "animation-delay": "<time>#",
                      "animation-direction": "<single-animation-direction>#",
                      "animation-duration": "<time>#",
                      "animation-fill-mode":
                        "[ none | forwards | backwards | both ]#",
                      "animation-iteration-count": "[ <number> | infinite ]#",
                      "animation-name": "[ none | <single-animation-name> ]#",
                      "animation-play-state": "[ running | paused ]#",
                      "animation-timing-function": 1,
                      "-moz-animation-delay": "<time>#",
                      "-moz-animation-direction": "[ normal | alternate ]#",
                      "-moz-animation-duration": "<time>#",
                      "-moz-animation-iteration-count":
                        "[ <number> | infinite ]#",
                      "-moz-animation-name":
                        "[ none | <single-animation-name> ]#",
                      "-moz-animation-play-state": "[ running | paused ]#",
                      "-ms-animation-delay": "<time>#",
                      "-ms-animation-direction": "[ normal | alternate ]#",
                      "-ms-animation-duration": "<time>#",
                      "-ms-animation-iteration-count":
                        "[ <number> | infinite ]#",
                      "-ms-animation-name":
                        "[ none | <single-animation-name> ]#",
                      "-ms-animation-play-state": "[ running | paused ]#",
                      "-webkit-animation-delay": "<time>#",
                      "-webkit-animation-direction": "[ normal | alternate ]#",
                      "-webkit-animation-duration": "<time>#",
                      "-webkit-animation-fill-mode":
                        "[ none | forwards | backwards | both ]#",
                      "-webkit-animation-iteration-count":
                        "[ <number> | infinite ]#",
                      "-webkit-animation-name":
                        "[ none | <single-animation-name> ]#",
                      "-webkit-animation-play-state": "[ running | paused ]#",
                      "-o-animation-delay": "<time>#",
                      "-o-animation-direction": "[ normal | alternate ]#",
                      "-o-animation-duration": "<time>#",
                      "-o-animation-iteration-count":
                        "[ <number> | infinite ]#",
                      "-o-animation-name":
                        "[ none | <single-animation-name> ]#",
                      "-o-animation-play-state": "[ running | paused ]#",
                      appearance: "none | auto",
                      "-moz-appearance":
                        "none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized",
                      "-ms-appearance":
                        "none | icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal",
                      "-webkit-appearance":
                        "none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox | listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical",
                      "-o-appearance":
                        "none | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal",
                      azimuth: "<azimuth>",
                      "backface-visibility": "visible | hidden",
                      background: 1,
                      "background-attachment": "<attachment>#",
                      "background-clip": "<box>#",
                      "background-color": "<color>",
                      "background-image": "<bg-image>#",
                      "background-origin": "<box>#",
                      "background-position": "<bg-position>",
                      "background-repeat": "<repeat-style>#",
                      "background-size": "<bg-size>#",
                      "baseline-shift":
                        "baseline | sub | super | <percentage> | <length>",
                      behavior: 1,
                      binding: 1,
                      bleed: "<length>",
                      "bookmark-label": "<content> | <attr> | <string>",
                      "bookmark-level": "none | <integer>",
                      "bookmark-state": "open | closed",
                      "bookmark-target": "none | <uri> | <attr>",
                      border: "<border-width> || <border-style> || <color>",
                      "border-bottom":
                        "<border-width> || <border-style> || <color>",
                      "border-bottom-color": "<color>",
                      "border-bottom-left-radius": "<x-one-radius>",
                      "border-bottom-right-radius": "<x-one-radius>",
                      "border-bottom-style": "<border-style>",
                      "border-bottom-width": "<border-width>",
                      "border-collapse": "collapse | separate",
                      "border-color": "<color>{1,4}",
                      "border-image": 1,
                      "border-image-outset": "[ <length> | <number> ]{1,4}",
                      "border-image-repeat":
                        "[ stretch | repeat | round | space ]{1,2}",
                      "border-image-slice": "<border-image-slice>",
                      "border-image-source": "<image> | none",
                      "border-image-width":
                        "[ <length> | <percentage> | <number> | auto ]{1,4}",
                      "border-left":
                        "<border-width> || <border-style> || <color>",
                      "border-left-color": "<color>",
                      "border-left-style": "<border-style>",
                      "border-left-width": "<border-width>",
                      "border-radius": "<border-radius>",
                      "border-right":
                        "<border-width> || <border-style> || <color>",
                      "border-right-color": "<color>",
                      "border-right-style": "<border-style>",
                      "border-right-width": "<border-width>",
                      "border-spacing": "<length>{1,2}",
                      "border-style": "<border-style>{1,4}",
                      "border-top":
                        "<border-width> || <border-style> || <color>",
                      "border-top-color": "<color>",
                      "border-top-left-radius": "<x-one-radius>",
                      "border-top-right-radius": "<x-one-radius>",
                      "border-top-style": "<border-style>",
                      "border-top-width": "<border-width>",
                      "border-width": "<border-width>{1,4}",
                      bottom: "<margin-width>",
                      "-moz-box-align":
                        "start | end | center | baseline | stretch",
                      "-moz-box-decoration-break": "slice | clone",
                      "-moz-box-direction": "normal | reverse",
                      "-moz-box-flex": "<number>",
                      "-moz-box-flex-group": "<integer>",
                      "-moz-box-lines": "single | multiple",
                      "-moz-box-ordinal-group": "<integer>",
                      "-moz-box-orient":
                        "horizontal | vertical | inline-axis | block-axis",
                      "-moz-box-pack": "start | end | center | justify",
                      "-o-box-decoration-break": "slice | clone",
                      "-webkit-box-align":
                        "start | end | center | baseline | stretch",
                      "-webkit-box-decoration-break": "slice | clone",
                      "-webkit-box-direction": "normal | reverse",
                      "-webkit-box-flex": "<number>",
                      "-webkit-box-flex-group": "<integer>",
                      "-webkit-box-lines": "single | multiple",
                      "-webkit-box-ordinal-group": "<integer>",
                      "-webkit-box-orient":
                        "horizontal | vertical | inline-axis | block-axis",
                      "-webkit-box-pack": "start | end | center | justify",
                      "box-decoration-break": "slice | clone",
                      "box-shadow": "<box-shadow>",
                      "box-sizing": "content-box | border-box",
                      "break-after":
                        "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
                      "break-before":
                        "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
                      "break-inside":
                        "auto | avoid | avoid-page | avoid-column",
                      "caption-side": "top | bottom",
                      clear: "none | right | left | both",
                      clip: "<shape> | auto",
                      "-webkit-clip-path": "<clip-source> | <clip-path> | none",
                      "clip-path": "<clip-source> | <clip-path> | none",
                      "clip-rule": "nonzero | evenodd",
                      color: "<color>",
                      "color-interpolation": "auto | sRGB | linearRGB",
                      "color-interpolation-filters": "auto | sRGB | linearRGB",
                      "color-profile": 1,
                      "color-rendering":
                        "auto | optimizeSpeed | optimizeQuality",
                      "column-count": "<integer> | auto",
                      "column-fill": "auto | balance",
                      "column-gap": "<length> | normal",
                      "column-rule":
                        "<border-width> || <border-style> || <color>",
                      "column-rule-color": "<color>",
                      "column-rule-style": "<border-style>",
                      "column-rule-width": "<border-width>",
                      "column-span": "none | all",
                      "column-width": "<length> | auto",
                      columns: 1,
                      content: 1,
                      "counter-increment": 1,
                      "counter-reset": 1,
                      crop: "<shape> | auto",
                      cue: "cue-after | cue-before",
                      "cue-after": 1,
                      "cue-before": 1,
                      cursor: 1,
                      direction: "ltr | rtl",
                      display:
                        "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | none | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box | -ms-flexbox | -ms-inline-flexbox | flex | -webkit-flex | inline-flex | -webkit-inline-flex",
                      "dominant-baseline":
                        "auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge",
                      "drop-initial-after-adjust":
                        "central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>",
                      "drop-initial-after-align":
                        "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
                      "drop-initial-before-adjust":
                        "before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>",
                      "drop-initial-before-align":
                        "caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
                      "drop-initial-size":
                        "auto | line | <length> | <percentage>",
                      "drop-initial-value": "<integer>",
                      elevation:
                        "<angle> | below | level | above | higher | lower",
                      "empty-cells": "show | hide",
                      "enable-background": 1,
                      fill: "<paint>",
                      "fill-opacity": "<opacity-value>",
                      "fill-rule": "nonzero | evenodd",
                      filter: "<filter-function-list> | none",
                      fit: "fill | hidden | meet | slice",
                      "fit-position": 1,
                      flex: "<flex>",
                      "flex-basis": "<width>",
                      "flex-direction":
                        "row | row-reverse | column | column-reverse",
                      "flex-flow": "<flex-direction> || <flex-wrap>",
                      "flex-grow": "<number>",
                      "flex-shrink": "<number>",
                      "flex-wrap": "nowrap | wrap | wrap-reverse",
                      "-webkit-flex": "<flex>",
                      "-webkit-flex-basis": "<width>",
                      "-webkit-flex-direction":
                        "row | row-reverse | column | column-reverse",
                      "-webkit-flex-flow": "<flex-direction> || <flex-wrap>",
                      "-webkit-flex-grow": "<number>",
                      "-webkit-flex-shrink": "<number>",
                      "-webkit-flex-wrap": "nowrap | wrap | wrap-reverse",
                      "-ms-flex": "<flex>",
                      "-ms-flex-align":
                        "start | end | center | stretch | baseline",
                      "-ms-flex-direction":
                        "row | row-reverse | column | column-reverse",
                      "-ms-flex-order": "<number>",
                      "-ms-flex-pack":
                        "start | end | center | justify | distribute",
                      "-ms-flex-wrap": "nowrap | wrap | wrap-reverse",
                      float: "left | right | none",
                      "float-offset": 1,
                      "flood-color": 1,
                      "flood-opacity": "<opacity-value>",
                      font: "<font-shorthand> | caption | icon | menu | message-box | small-caption | status-bar",
                      "font-family": "<font-family>",
                      "font-feature-settings": "<feature-tag-value> | normal",
                      "font-kerning": "auto | normal | none",
                      "font-size": "<font-size>",
                      "font-size-adjust": "<number> | none",
                      "font-stretch": "<font-stretch>",
                      "font-style": "<font-style>",
                      "font-variant": "<font-variant> | normal | none",
                      "font-variant-alternates":
                        "<font-variant-alternates> | normal",
                      "font-variant-caps": "<font-variant-caps> | normal",
                      "font-variant-east-asian":
                        "<font-variant-east-asian> | normal",
                      "font-variant-ligatures":
                        "<font-variant-ligatures> | normal | none",
                      "font-variant-numeric": "<font-variant-numeric> | normal",
                      "font-variant-position": "normal | sub | super",
                      "font-weight": "<font-weight>",
                      gap: "[ <length> | <percentage> ]{1,2}",
                      "glyph-orientation-horizontal": "<glyph-angle>",
                      "glyph-orientation-vertical": "auto | <glyph-angle>",
                      grid: 1,
                      "grid-area": 1,
                      "grid-auto-columns": 1,
                      "grid-auto-flow": 1,
                      "grid-auto-position": 1,
                      "grid-auto-rows": 1,
                      "grid-cell-stacking": "columns | rows | layer",
                      "grid-column": 1,
                      "grid-columns": 1,
                      "grid-column-align": "start | end | center | stretch",
                      "grid-column-sizing": 1,
                      "grid-column-start": 1,
                      "grid-column-end": 1,
                      "grid-column-span": "<integer>",
                      "grid-flow": "none | rows | columns",
                      "grid-gap": "[ <length> | <percentage> ]{1,2}",
                      "grid-layer": "<integer>",
                      "grid-row": 1,
                      "grid-rows": 1,
                      "grid-row-align": "start | end | center | stretch",
                      "grid-row-gap": 1,
                      "grid-row-start": 1,
                      "grid-row-end": 1,
                      "grid-row-span": "<integer>",
                      "grid-row-sizing": 1,
                      "grid-template": 1,
                      "grid-template-areas": 1,
                      "grid-template-columns": 1,
                      "grid-template-rows": 1,
                      "hanging-punctuation": 1,
                      height: "<margin-width> | <content-sizing>",
                      "hyphenate-after": "<integer> | auto",
                      "hyphenate-before": "<integer> | auto",
                      "hyphenate-character": "<string> | auto",
                      "hyphenate-lines": "no-limit | <integer>",
                      "hyphenate-resource": 1,
                      hyphens: "none | manual | auto",
                      icon: 1,
                      "image-orientation": "angle | auto",
                      "image-rendering":
                        "auto | optimizeSpeed | optimizeQuality",
                      "image-resolution": 1,
                      "ime-mode":
                        "auto | normal | active | inactive | disabled",
                      "inline-box-align": "last | <integer>",
                      "justify-content":
                        "flex-start | flex-end | center | space-between | space-around | space-evenly | stretch",
                      "-webkit-justify-content":
                        "flex-start | flex-end | center | space-between | space-around | space-evenly | stretch",
                      kerning: "auto | <length>",
                      left: "<margin-width>",
                      "letter-spacing": "<length> | normal",
                      "line-height": "<line-height>",
                      "line-break": "auto | loose | normal | strict",
                      "line-stacking": 1,
                      "line-stacking-ruby": "exclude-ruby | include-ruby",
                      "line-stacking-shift":
                        "consider-shifts | disregard-shifts",
                      "line-stacking-strategy":
                        "inline-line-height | block-line-height | max-height | grid-height",
                      "list-style": 1,
                      "list-style-image": "<uri> | none",
                      "list-style-position": "inside | outside",
                      "list-style-type":
                        "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none",
                      margin: "<margin-width>{1,4}",
                      "margin-bottom": "<margin-width>",
                      "margin-left": "<margin-width>",
                      "margin-right": "<margin-width>",
                      "margin-top": "<margin-width>",
                      mark: 1,
                      "mark-after": 1,
                      "mark-before": 1,
                      marker: 1,
                      "marker-end": 1,
                      "marker-mid": 1,
                      "marker-start": 1,
                      marks: 1,
                      "marquee-direction": 1,
                      "marquee-play-count": 1,
                      "marquee-speed": 1,
                      "marquee-style": 1,
                      mask: 1,
                      "max-height":
                        "<length> | <percentage> | <content-sizing> | none",
                      "max-width":
                        "<length> | <percentage> | <content-sizing> | none",
                      "min-height":
                        "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats",
                      "min-width":
                        "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats",
                      "mix-blend-mode": "<blend-mode>",
                      "move-to": 1,
                      "nav-down": 1,
                      "nav-index": 1,
                      "nav-left": 1,
                      "nav-right": 1,
                      "nav-up": 1,
                      "object-fit":
                        "fill | contain | cover | none | scale-down",
                      "object-position": "<position>",
                      opacity: "<opacity-value>",
                      order: "<integer>",
                      "-webkit-order": "<integer>",
                      orphans: "<integer>",
                      outline: 1,
                      "outline-color": "<color> | invert",
                      "outline-offset": 1,
                      "outline-style": "<border-style>",
                      "outline-width": "<border-width>",
                      overflow: "visible | hidden | scroll | auto",
                      "overflow-style": 1,
                      "overflow-wrap": "normal | break-word",
                      "overflow-x": 1,
                      "overflow-y": 1,
                      padding: "<padding-width>{1,4}",
                      "padding-bottom": "<padding-width>",
                      "padding-left": "<padding-width>",
                      "padding-right": "<padding-width>",
                      "padding-top": "<padding-width>",
                      page: 1,
                      "page-break-after":
                        "auto | always | avoid | left | right",
                      "page-break-before":
                        "auto | always | avoid | left | right",
                      "page-break-inside": "auto | avoid",
                      "page-policy": 1,
                      pause: 1,
                      "pause-after": 1,
                      "pause-before": 1,
                      perspective: 1,
                      "perspective-origin": 1,
                      phonemes: 1,
                      pitch: 1,
                      "pitch-range": 1,
                      "play-during": 1,
                      "pointer-events":
                        "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all",
                      position:
                        "static | relative | absolute | fixed | sticky | -webkit-sticky",
                      "presentation-level": 1,
                      "punctuation-trim": 1,
                      quotes: 1,
                      "rendering-intent": 1,
                      resize: 1,
                      rest: 1,
                      "rest-after": 1,
                      "rest-before": 1,
                      richness: 1,
                      right: "<margin-width>",
                      rotation: 1,
                      "rotation-point": 1,
                      "ruby-align": 1,
                      "ruby-overhang": 1,
                      "ruby-position": 1,
                      "ruby-span": 1,
                      "shape-rendering":
                        "auto | optimizeSpeed | crispEdges | geometricPrecision",
                      size: 1,
                      speak: "normal | none | spell-out",
                      "speak-header": "once | always",
                      "speak-numeral": "digits | continuous",
                      "speak-punctuation": "code | none",
                      "speech-rate": 1,
                      src: 1,
                      "stop-color": 1,
                      "stop-opacity": "<opacity-value>",
                      stress: 1,
                      "string-set": 1,
                      stroke: "<paint>",
                      "stroke-dasharray": "none | <dasharray>",
                      "stroke-dashoffset": "<percentage> | <length>",
                      "stroke-linecap": "butt | round | square",
                      "stroke-linejoin": "miter | round | bevel",
                      "stroke-miterlimit": "<miterlimit>",
                      "stroke-opacity": "<opacity-value>",
                      "stroke-width": "<percentage> | <length>",
                      "table-layout": "auto | fixed",
                      "tab-size": "<integer> | <length>",
                      target: 1,
                      "target-name": 1,
                      "target-new": 1,
                      "target-position": 1,
                      "text-align":
                        "left | right | center | justify | match-parent | start | end",
                      "text-align-last": 1,
                      "text-anchor": "start | middle | end",
                      "text-decoration":
                        "<text-decoration-line> || <text-decoration-style> || <text-decoration-color>",
                      "text-decoration-color": "<text-decoration-color>",
                      "text-decoration-line": "<text-decoration-line>",
                      "text-decoration-style": "<text-decoration-style>",
                      "text-decoration-skip":
                        "none | [ objects || spaces || ink || edges || box-decoration ]",
                      "-webkit-text-decoration-skip":
                        "none | [ objects || spaces || ink || edges || box-decoration ]",
                      "text-underline-position":
                        "auto | [ under || [ left | right ] ]",
                      "text-emphasis": 1,
                      "text-height": 1,
                      "text-indent": "<length> | <percentage>",
                      "text-justify":
                        "auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida",
                      "text-outline": 1,
                      "text-overflow": 1,
                      "text-rendering":
                        "auto | optimizeSpeed | optimizeLegibility | geometricPrecision",
                      "text-shadow": 1,
                      "text-transform":
                        "capitalize | uppercase | lowercase | none",
                      "text-wrap": "normal | none | avoid",
                      top: "<margin-width>",
                      "-ms-touch-action":
                        "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation",
                      "touch-action":
                        "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation",
                      transform: 1,
                      "transform-origin": 1,
                      "transform-style": 1,
                      transition: 1,
                      "transition-delay": 1,
                      "transition-duration": 1,
                      "transition-property": 1,
                      "transition-timing-function": 1,
                      "unicode-bidi":
                        "normal | embed | isolate | bidi-override | isolate-override | plaintext",
                      "user-modify": "read-only | read-write | write-only",
                      "user-select": "auto | text | none | contain | all",
                      "vertical-align":
                        "auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length>",
                      visibility: "visible | hidden | collapse",
                      "voice-balance": 1,
                      "voice-duration": 1,
                      "voice-family": 1,
                      "voice-pitch": 1,
                      "voice-pitch-range": 1,
                      "voice-rate": 1,
                      "voice-stress": 1,
                      "voice-volume": 1,
                      volume: 1,
                      "white-space":
                        "normal | pre | nowrap | pre-wrap | pre-line | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap",
                      "white-space-collapse": 1,
                      widows: "<integer>",
                      width:
                        "<length> | <percentage> | <content-sizing> | auto",
                      "will-change": "<will-change>",
                      "word-break":
                        "normal | keep-all | break-all | break-word",
                      "word-spacing": "<length> | normal",
                      "word-wrap": "normal | break-word",
                      "writing-mode":
                        "horizontal-tb | vertical-rl | vertical-lr | lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb",
                      "z-index": "<integer> | auto",
                      zoom: "<number> | <percentage> | normal",
                    };
                  },
                  {},
                ],
                8: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r, o) {
                      n.call(this, e, r, o, i.PROPERTY_NAME_TYPE),
                        (this.hack = t);
                    }
                    (o.prototype = new n()),
                      (o.prototype.constructor = o),
                      (o.prototype.toString = function () {
                        return (this.hack ? this.hack : "") + this.text;
                      });
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                9: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r) {
                      n.call(this, e.join(" "), t, r, i.PROPERTY_VALUE_TYPE),
                        (this.parts = e);
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                10: [
                  function (e, t, r) {
                    "use strict";
                    function n(e) {
                      (this._i = 0),
                        (this._parts = e.parts),
                        (this._marks = []),
                        (this.value = e);
                    }
                    (t.exports = n),
                      (n.prototype.count = function () {
                        return this._parts.length;
                      }),
                      (n.prototype.isFirst = function () {
                        return 0 === this._i;
                      }),
                      (n.prototype.hasNext = function () {
                        return this._i < this._parts.length;
                      }),
                      (n.prototype.mark = function () {
                        this._marks.push(this._i);
                      }),
                      (n.prototype.peek = function (e) {
                        return this.hasNext()
                          ? this._parts[this._i + (e || 0)]
                          : null;
                      }),
                      (n.prototype.next = function () {
                        return this.hasNext() ? this._parts[this._i++] : null;
                      }),
                      (n.prototype.previous = function () {
                        return this._i > 0 ? this._parts[--this._i] : null;
                      }),
                      (n.prototype.restore = function () {
                        this._marks.length && (this._i = this._marks.pop());
                      }),
                      (n.prototype.drop = function () {
                        this._marks.pop();
                      });
                  },
                  {},
                ],
                11: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = s;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Colors"),
                      o = e("./Parser"),
                      a = e("./Tokens");
                    function s(e, t, r, a) {
                      var l,
                        u = a || {};
                      if (
                        (n.call(this, e, t, r, o.PROPERTY_VALUE_PART_TYPE),
                        (this.type = "unknown"),
                        /^([+-]?[\d.]+)([a-z]+)$/i.test(e))
                      )
                        switch (
                          ((this.type = "dimension"),
                          (this.value = Number(RegExp.$1)),
                          (this.units = RegExp.$2),
                          this.units.toLowerCase())
                        ) {
                          case "em":
                          case "rem":
                          case "ex":
                          case "px":
                          case "cm":
                          case "mm":
                          case "in":
                          case "pt":
                          case "pc":
                          case "ch":
                          case "vh":
                          case "vw":
                          case "vmax":
                          case "vmin":
                            this.type = "length";
                            break;
                          case "fr":
                            this.type = "grid";
                            break;
                          case "deg":
                          case "rad":
                          case "grad":
                          case "turn":
                            this.type = "angle";
                            break;
                          case "ms":
                          case "s":
                            this.type = "time";
                            break;
                          case "hz":
                          case "khz":
                            this.type = "frequency";
                            break;
                          case "dpi":
                          case "dpcm":
                            this.type = "resolution";
                        }
                      else
                        /^([+-]?[\d.]+)%$/i.test(e)
                          ? ((this.type = "percentage"),
                            (this.value = Number(RegExp.$1)))
                          : /^([+-]?\d+)$/i.test(e)
                          ? ((this.type = "integer"),
                            (this.value = Number(RegExp.$1)))
                          : /^([+-]?[\d.]+)$/i.test(e)
                          ? ((this.type = "number"),
                            (this.value = Number(RegExp.$1)))
                          : /^#([a-f0-9]{3,6})/i.test(e)
                          ? ((this.type = "color"),
                            3 === (l = RegExp.$1).length
                              ? ((this.red = parseInt(
                                  l.charAt(0) + l.charAt(0),
                                  16
                                )),
                                (this.green = parseInt(
                                  l.charAt(1) + l.charAt(1),
                                  16
                                )),
                                (this.blue = parseInt(
                                  l.charAt(2) + l.charAt(2),
                                  16
                                )))
                              : ((this.red = parseInt(l.substring(0, 2), 16)),
                                (this.green = parseInt(l.substring(2, 4), 16)),
                                (this.blue = parseInt(l.substring(4, 6), 16))))
                          : /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.red = Number(RegExp.$1)),
                            (this.green = Number(RegExp.$2)),
                            (this.blue = Number(RegExp.$3)))
                          : /^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.red = (255 * Number(RegExp.$1)) / 100),
                            (this.green = (255 * Number(RegExp.$2)) / 100),
                            (this.blue = (255 * Number(RegExp.$3)) / 100))
                          : /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.red = Number(RegExp.$1)),
                            (this.green = Number(RegExp.$2)),
                            (this.blue = Number(RegExp.$3)),
                            (this.alpha = Number(RegExp.$4)))
                          : /^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.red = (255 * Number(RegExp.$1)) / 100),
                            (this.green = (255 * Number(RegExp.$2)) / 100),
                            (this.blue = (255 * Number(RegExp.$3)) / 100),
                            (this.alpha = Number(RegExp.$4)))
                          : /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.hue = Number(RegExp.$1)),
                            (this.saturation = Number(RegExp.$2) / 100),
                            (this.lightness = Number(RegExp.$3) / 100))
                          : /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)/i.test(
                              e
                            )
                          ? ((this.type = "color"),
                            (this.hue = Number(RegExp.$1)),
                            (this.saturation = Number(RegExp.$2) / 100),
                            (this.lightness = Number(RegExp.$3) / 100),
                            (this.alpha = Number(RegExp.$4)))
                          : /^url\(("([^\\"]|\.)*")\)/i.test(e)
                          ? ((this.type = "uri"),
                            (this.uri = s.parseString(RegExp.$1)))
                          : /^([^(]+)\(/i.test(e)
                          ? ((this.type = "function"),
                            (this.name = RegExp.$1),
                            (this.value = e))
                          : /^"([^\n\r\f\\"]|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*"/i.test(
                              e
                            ) ||
                            /^'([^\n\r\f\\']|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*'/i.test(
                              e
                            )
                          ? ((this.type = "string"),
                            (this.value = s.parseString(e)))
                          : i[e.toLowerCase()]
                          ? ((this.type = "color"),
                            (l = i[e.toLowerCase()].substring(1)),
                            (this.red = parseInt(l.substring(0, 2), 16)),
                            (this.green = parseInt(l.substring(2, 4), 16)),
                            (this.blue = parseInt(l.substring(4, 6), 16)))
                          : /^[,/]$/.test(e)
                          ? ((this.type = "operator"), (this.value = e))
                          : /^-?[a-z_\u00A0-\uFFFF][a-z0-9\-_\u00A0-\uFFFF]*$/i.test(
                              e
                            ) && ((this.type = "identifier"), (this.value = e));
                      this.wasIdent = Boolean(u.ident);
                    }
                    (s.prototype = new n()),
                      (s.prototype.constructor = s),
                      (s.parseString = function (e) {
                        return (e = e.slice(1, -1)).replace(
                          /\\(\r\n|[^\r0-9a-f]|[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)/gi,
                          function (e, t) {
                            if (/^(\n|\r\n|\r|\f)$/.test(t)) return "";
                            var r = /^[0-9a-f]{1,6}/i.exec(t);
                            if (r) {
                              var n = parseInt(r[0], 16);
                              return String.fromCodePoint
                                ? String.fromCodePoint(n)
                                : String.fromCharCode(n);
                            }
                            return t;
                          }
                        );
                      }),
                      (s.serializeString = function (e) {
                        return (
                          '"' +
                          e.replace(/["\r\n\f]/g, function (e, t) {
                            return '"' === t
                              ? "\\" + t
                              : "\\" +
                                  (String.codePointAt
                                    ? String.codePointAt(0)
                                    : String.charCodeAt(0)
                                  ).toString(16) +
                                  " ";
                          }) +
                          '"'
                        );
                      }),
                      (s.fromToken = function (e) {
                        return new s(e.value, e.startLine, e.startCol, {
                          ident: e.type === a.IDENT,
                        });
                      });
                  },
                  {
                    "../util/SyntaxUnit": 26,
                    "./Colors": 1,
                    "./Parser": 6,
                    "./Tokens": 18,
                  },
                ],
                12: [
                  function (e, t, r) {
                    "use strict";
                    var n = (t.exports = {
                      __proto__: null,
                      ":first-letter": 1,
                      ":first-line": 1,
                      ":before": 1,
                      ":after": 1,
                    });
                    (n.ELEMENT = 1),
                      (n.CLASS = 2),
                      (n.isElement = function (e) {
                        return (
                          0 === e.indexOf("::") ||
                          n[e.toLowerCase()] === n.ELEMENT
                        );
                      });
                  },
                  {},
                ],
                13: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = a;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser"),
                      o = e("./Specificity");
                    function a(e, t, r) {
                      n.call(this, e.join(" "), t, r, i.SELECTOR_TYPE),
                        (this.parts = e),
                        (this.specificity = o.calculate(this));
                    }
                    (a.prototype = new n()), (a.prototype.constructor = a);
                  },
                  {
                    "../util/SyntaxUnit": 26,
                    "./Parser": 6,
                    "./Specificity": 16,
                  },
                ],
                14: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r, o, a) {
                      n.call(this, r, o, a, i.SELECTOR_PART_TYPE),
                        (this.elementName = e),
                        (this.modifiers = t);
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                15: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("../util/SyntaxUnit"),
                      i = e("./Parser");
                    function o(e, t, r, o) {
                      n.call(this, e, r, o, i.SELECTOR_SUB_PART_TYPE),
                        (this.type = t),
                        (this.args = []);
                    }
                    (o.prototype = new n()), (o.prototype.constructor = o);
                  },
                  { "../util/SyntaxUnit": 26, "./Parser": 6 },
                ],
                16: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("./Pseudos"),
                      i = e("./SelectorPart");
                    function o(e, t, r, n) {
                      (this.a = e), (this.b = t), (this.c = r), (this.d = n);
                    }
                    (o.prototype = {
                      constructor: o,
                      compare: function (e) {
                        var t,
                          r,
                          n = ["a", "b", "c", "d"];
                        for (t = 0, r = n.length; t < r; t++) {
                          if (this[n[t]] < e[n[t]]) return -1;
                          if (this[n[t]] > e[n[t]]) return 1;
                        }
                        return 0;
                      },
                      valueOf: function () {
                        return (
                          1e3 * this.a + 100 * this.b + 10 * this.c + this.d
                        );
                      },
                      toString: function () {
                        return (
                          this.a + "," + this.b + "," + this.c + "," + this.d
                        );
                      },
                    }),
                      (o.calculate = function (e) {
                        var t,
                          r,
                          a,
                          s = 0,
                          l = 0,
                          u = 0;
                        function c(e) {
                          var t,
                            r,
                            i,
                            o,
                            a,
                            h = e.elementName ? e.elementName.text : "";
                          for (
                            h && "*" !== h.charAt(h.length - 1) && u++,
                              t = 0,
                              i = e.modifiers.length;
                            t < i;
                            t++
                          )
                            switch ((a = e.modifiers[t]).type) {
                              case "class":
                              case "attribute":
                                l++;
                                break;
                              case "id":
                                s++;
                                break;
                              case "pseudo":
                                n.isElement(a.text) ? u++ : l++;
                                break;
                              case "not":
                                for (r = 0, o = a.args.length; r < o; r++)
                                  c(a.args[r]);
                            }
                        }
                        for (t = 0, r = e.parts.length; t < r; t++)
                          (a = e.parts[t]) instanceof i && c(a);
                        return new o(0, s, l, u);
                      });
                  },
                  { "./Pseudos": 12, "./SelectorPart": 14 },
                ],
                17: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = b;
                    var n = e("../util/TokenStreamBase"),
                      i = e("./PropertyValuePart"),
                      o = e("./Tokens"),
                      a = /^[0-9a-fA-F]$/,
                      s = /^[\u00A0-\uFFFF]$/,
                      l = /\n|\r\n|\r|\f/,
                      u = /\u0009|\u000a|\u000c|\u000d|\u0020/;
                    function c(e) {
                      return null != e && a.test(e);
                    }
                    function h(e) {
                      return null != e && /\d/.test(e);
                    }
                    function d(e) {
                      return null != e && u.test(e);
                    }
                    function p(e) {
                      return null != e && l.test(e);
                    }
                    function f(e) {
                      return null != e && /[a-z_\u00A0-\uFFFF\\]/i.test(e);
                    }
                    function m(e) {
                      return null != e && (f(e) || /[0-9\-\\]/.test(e));
                    }
                    function g(e) {
                      return (
                        "string" === typeof e &&
                        (h(e[0]) || ("." === e[0] && h(e[1])))
                      );
                    }
                    function b(e) {
                      n.call(this, e, o);
                    }
                    b.prototype = (function (e, t) {
                      for (var r in t)
                        Object.prototype.hasOwnProperty.call(t, r) &&
                          (e[r] = t[r]);
                      return e;
                    })(new n(), {
                      _getToken: function () {
                        var e,
                          t = this._reader,
                          r = null,
                          n = t.getLine(),
                          i = t.getCol();
                        for (e = t.read(); e; ) {
                          switch (e) {
                            case "/":
                              r =
                                "*" === t.peek()
                                  ? this.commentToken(e, n, i)
                                  : this.charToken(e, n, i);
                              break;
                            case "|":
                            case "~":
                            case "^":
                            case "$":
                            case "*":
                              r =
                                "=" === t.peek()
                                  ? this.comparisonToken(e, n, i)
                                  : this.charToken(e, n, i);
                              break;
                            case '"':
                            case "'":
                              r = this.stringToken(e, n, i);
                              break;
                            case "#":
                              r = m(t.peek())
                                ? this.hashToken(e, n, i)
                                : this.charToken(e, n, i);
                              break;
                            case ".":
                              r = h(t.peek())
                                ? this.numberToken(e, n, i)
                                : this.charToken(e, n, i);
                              break;
                            case "-":
                              if (g(t.peekCount(2))) {
                                r = this.numberToken(e, n, i);
                                break;
                              }
                              r =
                                "->" === t.peekCount(2)
                                  ? this.htmlCommentEndToken(e, n, i)
                                  : this._getDefaultToken(e, n, i);
                              break;
                            case "+":
                              r = g(t.peekCount(2))
                                ? this.numberToken(e, n, i)
                                : this.charToken(e, n, i);
                              break;
                            case "!":
                              r = this.importantToken(e, n, i);
                              break;
                            case "@":
                              r = this.atRuleToken(e, n, i);
                              break;
                            case ":":
                              r = this.notToken(e, n, i);
                              break;
                            case "<":
                              r = this.htmlCommentStartToken(e, n, i);
                              break;
                            case "\\":
                              r = /[^\r\n\f]/.test(t.peek())
                                ? this.identOrFunctionToken(
                                    this.readEscape(e, !0),
                                    n,
                                    i
                                  )
                                : this.charToken(e, n, i);
                              break;
                            case "U":
                            case "u":
                              r =
                                "+" === t.peek()
                                  ? this.unicodeRangeToken(e, n, i)
                                  : this._getDefaultToken(e, n, i);
                              break;
                            default:
                              r = this._getDefaultToken(e, n, i);
                          }
                          break;
                        }
                        return (
                          r ||
                            null !== e ||
                            (r = this.createToken(o.EOF, null, n, i)),
                          r
                        );
                      },
                      _getDefaultToken: function (e, t, r) {
                        var n,
                          i = this._reader,
                          o = null;
                        return (
                          h(e)
                            ? (o = this.numberToken(e, t, r))
                            : d(e)
                            ? (o = this.whitespaceToken(e, t, r))
                            : (o =
                                "string" === typeof (n = e + i.peekCount(1)) &&
                                (("-" === n[0] && f(n[1])) || f(n[0]))
                                  ? this.identOrFunctionToken(e, t, r)
                                  : this.charToken(e, t, r)),
                          o
                        );
                      },
                      createToken: function (e, t, r, n, i) {
                        var o = this._reader;
                        return {
                          value: t,
                          type: e,
                          channel: (i = i || {}).channel,
                          endChar: i.endChar,
                          hide: i.hide || !1,
                          startLine: r,
                          startCol: n,
                          endLine: o.getLine(),
                          endCol: o.getCol(),
                        };
                      },
                      atRuleToken: function (e, t, r) {
                        var n = e,
                          i = this._reader,
                          a = o.CHAR;
                        return (
                          i.mark(),
                          (n = e + this.readName()),
                          ((a = o.type(n.toLowerCase())) !== o.CHAR &&
                            a !== o.UNKNOWN) ||
                            (n.length > 1
                              ? (a = o.UNKNOWN_SYM)
                              : ((a = o.CHAR), (n = e), i.reset())),
                          this.createToken(a, n, t, r)
                        );
                      },
                      charToken: function (e, t, r) {
                        var n = o.type(e),
                          i = {};
                        return (
                          -1 === n ? (n = o.CHAR) : (i.endChar = o[n].endChar),
                          this.createToken(n, e, t, r, i)
                        );
                      },
                      commentToken: function (e, t, r) {
                        var n = this.readComment(e);
                        return this.createToken(o.COMMENT, n, t, r);
                      },
                      comparisonToken: function (e, t, r) {
                        var n = e + this._reader.read(),
                          i = o.type(n) || o.CHAR;
                        return this.createToken(i, n, t, r);
                      },
                      hashToken: function (e, t, r) {
                        var n = this.readName(e);
                        return this.createToken(o.HASH, n, t, r);
                      },
                      htmlCommentStartToken: function (e, t, r) {
                        var n = this._reader,
                          i = e;
                        return (
                          n.mark(),
                          "\x3c!--" === (i += n.readCount(3))
                            ? this.createToken(o.CDO, i, t, r)
                            : (n.reset(), this.charToken(e, t, r))
                        );
                      },
                      htmlCommentEndToken: function (e, t, r) {
                        var n = this._reader,
                          i = e;
                        return (
                          n.mark(),
                          "--\x3e" === (i += n.readCount(2))
                            ? this.createToken(o.CDC, i, t, r)
                            : (n.reset(), this.charToken(e, t, r))
                        );
                      },
                      identOrFunctionToken: function (e, t, r) {
                        var n,
                          i = this._reader,
                          a = this.readName(e),
                          s = o.IDENT;
                        return (
                          "(" === i.peek()
                            ? ((a += i.read()),
                              ["url(", "url-prefix(", "domain("].indexOf(
                                a.toLowerCase()
                              ) > -1
                                ? (i.mark(),
                                  null === (n = this.readURI(a))
                                    ? (i.reset(), (s = o.FUNCTION))
                                    : ((s = o.URI), (a = n)))
                                : (s = o.FUNCTION))
                            : ":" === i.peek() &&
                              "progid" === a.toLowerCase() &&
                              ((a += i.readTo("(")), (s = o.IE_FUNCTION)),
                          this.createToken(s, a, t, r)
                        );
                      },
                      importantToken: function (e, t, r) {
                        var n,
                          i,
                          a = this._reader,
                          s = e,
                          l = o.CHAR;
                        for (a.mark(), i = a.read(); i; ) {
                          if ("/" === i) {
                            if ("*" !== a.peek()) break;
                            if ("" === (n = this.readComment(i))) break;
                          } else {
                            if (!d(i)) {
                              if (/i/i.test(i)) {
                                (n = a.readCount(8)),
                                  /mportant/i.test(n) &&
                                    ((s += i + n), (l = o.IMPORTANT_SYM));
                                break;
                              }
                              break;
                            }
                            s += i + this.readWhitespace();
                          }
                          i = a.read();
                        }
                        return l === o.CHAR
                          ? (a.reset(), this.charToken(e, t, r))
                          : this.createToken(l, s, t, r);
                      },
                      notToken: function (e, t, r) {
                        var n = this._reader,
                          i = e;
                        return (
                          n.mark(),
                          ":not(" === (i += n.readCount(4)).toLowerCase()
                            ? this.createToken(o.NOT, i, t, r)
                            : (n.reset(), this.charToken(e, t, r))
                        );
                      },
                      numberToken: function (e, t, r) {
                        var n,
                          i = this._reader,
                          a = this.readNumber(e),
                          s = o.NUMBER,
                          l = i.peek();
                        return (
                          !(function (e) {
                            return null != e && (f(e) || /-\\/.test(e));
                          })(l)
                            ? "%" === l && ((a += i.read()), (s = o.PERCENTAGE))
                            : ((a += n = this.readName(i.read())),
                              (s =
                                /^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^fr$|^vmax$|^vmin$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(
                                  n
                                )
                                  ? o.LENGTH
                                  : /^deg|^rad$|^grad$|^turn$/i.test(n)
                                  ? o.ANGLE
                                  : /^ms$|^s$/i.test(n)
                                  ? o.TIME
                                  : /^hz$|^khz$/i.test(n)
                                  ? o.FREQ
                                  : /^dpi$|^dpcm$/i.test(n)
                                  ? o.RESOLUTION
                                  : o.DIMENSION)),
                          this.createToken(s, a, t, r)
                        );
                      },
                      stringToken: function (e, t, r) {
                        for (
                          var n,
                            i = e,
                            a = e,
                            s = this._reader,
                            l = o.STRING,
                            u = s.read();
                          u;

                        ) {
                          if (((a += u), "\\" === u)) {
                            if (null === (u = s.read())) break;
                            if (/[^\r\n\f0-9a-f]/i.test(u)) a += u;
                            else {
                              for (n = 0; c(u) && n < 6; n++)
                                (a += u), (u = s.read());
                              if (
                                ("\r" === u &&
                                  "\n" === s.peek() &&
                                  ((a += u), (u = s.read())),
                                !d(u))
                              )
                                continue;
                              a += u;
                            }
                          } else {
                            if (u === i) break;
                            if (p(s.peek())) {
                              l = o.INVALID;
                              break;
                            }
                          }
                          u = s.read();
                        }
                        return (
                          null === u && (l = o.INVALID),
                          this.createToken(l, a, t, r)
                        );
                      },
                      unicodeRangeToken: function (e, t, r) {
                        var n,
                          i = this._reader,
                          a = e,
                          s = o.CHAR;
                        return (
                          "+" === i.peek() &&
                            (i.mark(),
                            (a += i.read()),
                            2 === (a += this.readUnicodeRangePart(!0)).length
                              ? i.reset()
                              : ((s = o.UNICODE_RANGE),
                                -1 === a.indexOf("?") &&
                                  "-" === i.peek() &&
                                  (i.mark(),
                                  (n = i.read()),
                                  1 ===
                                  (n += this.readUnicodeRangePart(!1)).length
                                    ? i.reset()
                                    : (a += n)))),
                          this.createToken(s, a, t, r)
                        );
                      },
                      whitespaceToken: function (e, t, r) {
                        var n = e + this.readWhitespace();
                        return this.createToken(o.S, n, t, r);
                      },
                      readUnicodeRangePart: function (e) {
                        for (
                          var t = this._reader, r = "", n = t.peek();
                          c(n) && r.length < 6;

                        )
                          t.read(), (r += n), (n = t.peek());
                        if (e)
                          for (; "?" === n && r.length < 6; )
                            t.read(), (r += n), (n = t.peek());
                        return r;
                      },
                      readWhitespace: function () {
                        for (var e = this._reader, t = "", r = e.peek(); d(r); )
                          e.read(), (t += r), (r = e.peek());
                        return t;
                      },
                      readNumber: function (e) {
                        for (
                          var t = this._reader,
                            r = e,
                            n = "." === e,
                            i = t.peek();
                          i;

                        ) {
                          if (h(i)) r += t.read();
                          else {
                            if ("." !== i) break;
                            if (n) break;
                            (n = !0), (r += t.read());
                          }
                          i = t.peek();
                        }
                        return r;
                      },
                      readString: function () {
                        var e = this.stringToken(this._reader.read(), 0, 0);
                        return e.type === o.INVALID ? null : e.value;
                      },
                      readURI: function (e) {
                        for (
                          var t = this._reader, r = e, n = "", o = t.peek();
                          o && d(o);

                        )
                          t.read(), (o = t.peek());
                        for (
                          "'" === o || '"' === o
                            ? null !== (n = this.readString()) &&
                              (n = i.parseString(n))
                            : (n = this.readUnquotedURL()),
                            o = t.peek();
                          o && d(o);

                        )
                          t.read(), (o = t.peek());
                        return (
                          null === n || ")" !== o
                            ? (r = null)
                            : (r += i.serializeString(n) + t.read()),
                          r
                        );
                      },
                      readUnquotedURL: function (e) {
                        var t,
                          r = this._reader,
                          n = e || "";
                        for (t = r.peek(); t; t = r.peek())
                          if (s.test(t) || /^[-!#$%&*-[\]-~]$/.test(t))
                            (n += t), r.read();
                          else {
                            if ("\\" !== t) break;
                            if (!/^[^\r\n\f]$/.test(r.peek(2))) break;
                            n += this.readEscape(r.read(), !0);
                          }
                        return n;
                      },
                      readName: function (e) {
                        var t,
                          r = this._reader,
                          n = e || "";
                        for (t = r.peek(); t; t = r.peek())
                          if ("\\" === t) {
                            if (!/^[^\r\n\f]$/.test(r.peek(2))) break;
                            n += this.readEscape(r.read(), !0);
                          } else {
                            if (!m(t)) break;
                            n += r.read();
                          }
                        return n;
                      },
                      readEscape: function (e, t) {
                        var r = this._reader,
                          n = e || "",
                          i = 0,
                          o = r.peek();
                        if (c(o))
                          do {
                            (n += r.read()), (o = r.peek());
                          } while (o && c(o) && ++i < 6);
                        if (1 === n.length) {
                          if (!/^[^\r\n\f0-9a-f]$/.test(o))
                            throw new Error("Bad escape sequence.");
                          if ((r.read(), t)) return o;
                        } else
                          "\r" === o
                            ? (r.read(), "\n" === r.peek() && (o += r.read()))
                            : /^[ \t\n\f]$/.test(o)
                            ? r.read()
                            : (o = "");
                        if (t) {
                          var a = parseInt(n.slice(e.length), 16);
                          return String.fromCodePoint
                            ? String.fromCodePoint(a)
                            : String.fromCharCode(a);
                        }
                        return n + o;
                      },
                      readComment: function (e) {
                        var t = this._reader,
                          r = e || "",
                          n = t.read();
                        if ("*" === n) {
                          for (; n; ) {
                            if (
                              (r += n).length > 2 &&
                              "*" === n &&
                              "/" === t.peek()
                            ) {
                              r += t.read();
                              break;
                            }
                            n = t.read();
                          }
                          return r;
                        }
                        return "";
                      },
                    });
                  },
                  {
                    "../util/TokenStreamBase": 27,
                    "./PropertyValuePart": 11,
                    "./Tokens": 18,
                  },
                ],
                18: [
                  function (e, t, r) {
                    "use strict";
                    var n = (t.exports = [
                      { name: "CDO" },
                      { name: "CDC" },
                      { name: "S", whitespace: !0 },
                      {
                        name: "COMMENT",
                        comment: !0,
                        hide: !0,
                        channel: "comment",
                      },
                      { name: "INCLUDES", text: "~=" },
                      { name: "DASHMATCH", text: "|=" },
                      { name: "PREFIXMATCH", text: "^=" },
                      { name: "SUFFIXMATCH", text: "$=" },
                      { name: "SUBSTRINGMATCH", text: "*=" },
                      { name: "STRING" },
                      { name: "IDENT" },
                      { name: "HASH" },
                      { name: "IMPORT_SYM", text: "@import" },
                      { name: "PAGE_SYM", text: "@page" },
                      { name: "MEDIA_SYM", text: "@media" },
                      { name: "FONT_FACE_SYM", text: "@font-face" },
                      { name: "CHARSET_SYM", text: "@charset" },
                      { name: "NAMESPACE_SYM", text: "@namespace" },
                      { name: "SUPPORTS_SYM", text: "@supports" },
                      {
                        name: "VIEWPORT_SYM",
                        text: ["@viewport", "@-ms-viewport", "@-o-viewport"],
                      },
                      {
                        name: "DOCUMENT_SYM",
                        text: ["@document", "@-moz-document"],
                      },
                      { name: "UNKNOWN_SYM" },
                      {
                        name: "KEYFRAMES_SYM",
                        text: [
                          "@keyframes",
                          "@-webkit-keyframes",
                          "@-moz-keyframes",
                          "@-o-keyframes",
                        ],
                      },
                      { name: "IMPORTANT_SYM" },
                      { name: "LENGTH" },
                      { name: "ANGLE" },
                      { name: "TIME" },
                      { name: "FREQ" },
                      { name: "DIMENSION" },
                      { name: "PERCENTAGE" },
                      { name: "NUMBER" },
                      { name: "URI" },
                      { name: "FUNCTION" },
                      { name: "UNICODE_RANGE" },
                      { name: "INVALID" },
                      { name: "PLUS", text: "+" },
                      { name: "GREATER", text: ">" },
                      { name: "COMMA", text: "," },
                      { name: "TILDE", text: "~" },
                      { name: "NOT" },
                      { name: "TOPLEFTCORNER_SYM", text: "@top-left-corner" },
                      { name: "TOPLEFT_SYM", text: "@top-left" },
                      { name: "TOPCENTER_SYM", text: "@top-center" },
                      { name: "TOPRIGHT_SYM", text: "@top-right" },
                      { name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner" },
                      {
                        name: "BOTTOMLEFTCORNER_SYM",
                        text: "@bottom-left-corner",
                      },
                      { name: "BOTTOMLEFT_SYM", text: "@bottom-left" },
                      { name: "BOTTOMCENTER_SYM", text: "@bottom-center" },
                      { name: "BOTTOMRIGHT_SYM", text: "@bottom-right" },
                      {
                        name: "BOTTOMRIGHTCORNER_SYM",
                        text: "@bottom-right-corner",
                      },
                      { name: "LEFTTOP_SYM", text: "@left-top" },
                      { name: "LEFTMIDDLE_SYM", text: "@left-middle" },
                      { name: "LEFTBOTTOM_SYM", text: "@left-bottom" },
                      { name: "RIGHTTOP_SYM", text: "@right-top" },
                      { name: "RIGHTMIDDLE_SYM", text: "@right-middle" },
                      { name: "RIGHTBOTTOM_SYM", text: "@right-bottom" },
                      { name: "RESOLUTION", state: "media" },
                      { name: "IE_FUNCTION" },
                      { name: "CHAR" },
                      { name: "PIPE", text: "|" },
                      { name: "SLASH", text: "/" },
                      { name: "MINUS", text: "-" },
                      { name: "STAR", text: "*" },
                      { name: "LBRACE", endChar: "}", text: "{" },
                      { name: "RBRACE", text: "}" },
                      { name: "LBRACKET", endChar: "]", text: "[" },
                      { name: "RBRACKET", text: "]" },
                      { name: "EQUALS", text: "=" },
                      { name: "COLON", text: ":" },
                      { name: "SEMICOLON", text: ";" },
                      { name: "LPAREN", endChar: ")", text: "(" },
                      { name: "RPAREN", text: ")" },
                      { name: "DOT", text: "." },
                    ]);
                    !(function () {
                      var e = [],
                        t = Object.create(null);
                      (n.UNKNOWN = -1), n.unshift({ name: "EOF" });
                      for (var r = 0, i = n.length; r < i; r++)
                        if ((e.push(n[r].name), (n[n[r].name] = r), n[r].text))
                          if (n[r].text instanceof Array)
                            for (var o = 0; o < n[r].text.length; o++)
                              t[n[r].text[o]] = r;
                          else t[n[r].text] = r;
                      (n.name = function (t) {
                        return e[t];
                      }),
                        (n.type = function (e) {
                          return t[e] || -1;
                        });
                    })();
                  },
                  {},
                ],
                19: [
                  function (e, t, r) {
                    "use strict";
                    var n = e("./Matcher"),
                      i = e("./Properties"),
                      o = e("./ValidationTypes"),
                      a = e("./ValidationError"),
                      s = e("./PropertyValueIterator");
                    t.exports = {
                      validate: function (e, t) {
                        var r,
                          n = e.toString().toLowerCase(),
                          l = new s(t),
                          u = i[n];
                        if (u) {
                          if ("number" !== typeof u) {
                            if (o.isAny(l, "inherit | initial | unset")) {
                              if (l.hasNext())
                                throw (
                                  ((r = l.next()),
                                  new a(
                                    "Expected end of value but found '" +
                                      r +
                                      "'.",
                                    r.line,
                                    r.col
                                  ))
                                );
                              return;
                            }
                            this.singleProperty(u, l);
                          }
                        } else if (0 !== n.indexOf("-"))
                          throw new a(
                            "Unknown property '" + e + "'.",
                            e.line,
                            e.col
                          );
                      },
                      singleProperty: function (e, t) {
                        var r,
                          i = t.value;
                        if (!n.parse(e).match(t))
                          throw t.hasNext() && !t.isFirst()
                            ? ((r = t.peek()),
                              new a(
                                "Expected end of value but found '" + r + "'.",
                                r.line,
                                r.col
                              ))
                            : new a(
                                "Expected (" +
                                  o.describe(e) +
                                  ") but found '" +
                                  i +
                                  "'.",
                                i.line,
                                i.col
                              );
                        if (t.hasNext())
                          throw (
                            ((r = t.next()),
                            new a(
                              "Expected end of value but found '" + r + "'.",
                              r.line,
                              r.col
                            ))
                          );
                      },
                    };
                  },
                  {
                    "./Matcher": 3,
                    "./Properties": 7,
                    "./PropertyValueIterator": 10,
                    "./ValidationError": 20,
                    "./ValidationTypes": 21,
                  },
                ],
                20: [
                  function (e, t, r) {
                    "use strict";
                    function n(e, t, r) {
                      (this.col = r), (this.line = t), (this.message = e);
                    }
                    (t.exports = n), (n.prototype = new Error());
                  },
                  {},
                ],
                21: [
                  function (e, t, r) {
                    "use strict";
                    var n,
                      i,
                      o = t.exports,
                      a = e("./Matcher");
                    (n = o),
                      (i = {
                        isLiteral: function (e, t) {
                          var r,
                            n,
                            i = e.text.toString().toLowerCase(),
                            o = t.split(" | "),
                            a = !1;
                          for (r = 0, n = o.length; r < n && !a; r++)
                            "<" === o[r].charAt(0)
                              ? (a = this.simple[o[r]](e))
                              : "()" === o[r].slice(-2)
                              ? (a =
                                  "function" === e.type &&
                                  e.name === o[r].slice(0, -2))
                              : i === o[r].toLowerCase() && (a = !0);
                          return a;
                        },
                        isSimple: function (e) {
                          return Boolean(this.simple[e]);
                        },
                        isComplex: function (e) {
                          return Boolean(this.complex[e]);
                        },
                        describe: function (e) {
                          return this.complex[e] instanceof a
                            ? this.complex[e].toString(0)
                            : e;
                        },
                        isAny: function (e, t) {
                          var r,
                            n,
                            i = t.split(" | "),
                            o = !1;
                          for (
                            r = 0, n = i.length;
                            r < n && !o && e.hasNext();
                            r++
                          )
                            o = this.isType(e, i[r]);
                          return o;
                        },
                        isAnyOfGroup: function (e, t) {
                          var r,
                            n,
                            i = t.split(" || "),
                            o = !1;
                          for (r = 0, n = i.length; r < n && !o; r++)
                            o = this.isType(e, i[r]);
                          return !!o && i[r - 1];
                        },
                        isType: function (e, t) {
                          var r = e.peek(),
                            n = !1;
                          return (
                            "<" !== t.charAt(0)
                              ? (n = this.isLiteral(r, t)) && e.next()
                              : this.simple[t]
                              ? (n = this.simple[t](r)) && e.next()
                              : (n =
                                  this.complex[t] instanceof a
                                    ? this.complex[t].match(e)
                                    : this.complex[t](e)),
                            n
                          );
                        },
                        simple: {
                          __proto__: null,
                          "<absolute-size>":
                            "xx-small | x-small | small | medium | large | x-large | xx-large",
                          "<animateable-feature>":
                            "scroll-position | contents | <animateable-feature-name>",
                          "<animateable-feature-name>": function (e) {
                            return (
                              this["<ident>"](e) &&
                              !/^(unset|initial|inherit|will-change|auto|scroll-position|contents)$/i.test(
                                e
                              )
                            );
                          },
                          "<angle>": function (e) {
                            return "angle" === e.type;
                          },
                          "<attachment>": "scroll | fixed | local",
                          "<attr>": "attr()",
                          "<basic-shape>":
                            "inset() | circle() | ellipse() | polygon()",
                          "<bg-image>": "<image> | <gradient> | none",
                          "<border-style>":
                            "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset",
                          "<border-width>": "<length> | thin | medium | thick",
                          "<box>": "padding-box | border-box | content-box",
                          "<clip-source>": "<uri>",
                          "<color>": function (e) {
                            return (
                              "color" === e.type ||
                              "transparent" === String(e) ||
                              "currentColor" === String(e)
                            );
                          },
                          "<color-svg>": function (e) {
                            return "color" === e.type;
                          },
                          "<content>": "content()",
                          "<content-sizing>":
                            "fill-available | -moz-available | -webkit-fill-available | max-content | -moz-max-content | -webkit-max-content | min-content | -moz-min-content | -webkit-min-content | fit-content | -moz-fit-content | -webkit-fit-content",
                          "<feature-tag-value>": function (e) {
                            return (
                              "function" === e.type && /^[A-Z0-9]{4}$/i.test(e)
                            );
                          },
                          "<filter-function>":
                            "blur() | brightness() | contrast() | custom() | drop-shadow() | grayscale() | hue-rotate() | invert() | opacity() | saturate() | sepia()",
                          "<flex-basis>": "<width>",
                          "<flex-direction>":
                            "row | row-reverse | column | column-reverse",
                          "<flex-grow>": "<number>",
                          "<flex-shrink>": "<number>",
                          "<flex-wrap>": "nowrap | wrap | wrap-reverse",
                          "<font-size>":
                            "<absolute-size> | <relative-size> | <length> | <percentage>",
                          "<font-stretch>":
                            "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded",
                          "<font-style>": "normal | italic | oblique",
                          "<font-variant-caps>":
                            "small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
                          "<font-variant-css21>": "normal | small-caps",
                          "<font-weight>":
                            "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900",
                          "<generic-family>":
                            "serif | sans-serif | cursive | fantasy | monospace",
                          "<geometry-box>":
                            "<shape-box> | fill-box | stroke-box | view-box",
                          "<glyph-angle>": function (e) {
                            return "angle" === e.type && "deg" === e.units;
                          },
                          "<gradient>": function (e) {
                            return (
                              "function" === e.type &&
                              /^(?:-(?:ms|moz|o|webkit)-)?(?:repeating-)?(?:radial-|linear-)?gradient/i.test(
                                e
                              )
                            );
                          },
                          "<icccolor>":
                            "cielab() | cielch() | cielchab() | icc-color() | icc-named-color()",
                          "<ident>": function (e) {
                            return "identifier" === e.type || e.wasIdent;
                          },
                          "<ident-not-generic-family>": function (e) {
                            return (
                              this["<ident>"](e) && !this["<generic-family>"](e)
                            );
                          },
                          "<image>": "<uri>",
                          "<integer>": function (e) {
                            return "integer" === e.type;
                          },
                          "<length>": function (e) {
                            return (
                              !(
                                "function" !== e.type ||
                                !/^(?:-(?:ms|moz|o|webkit)-)?calc/i.test(e)
                              ) ||
                              "length" === e.type ||
                              "number" === e.type ||
                              "integer" === e.type ||
                              "0" === String(e)
                            );
                          },
                          "<line>": function (e) {
                            return "integer" === e.type;
                          },
                          "<line-height>":
                            "<number> | <length> | <percentage> | normal",
                          "<margin-width>": "<length> | <percentage> | auto",
                          "<miterlimit>": function (e) {
                            return this["<number>"](e) && e.value >= 1;
                          },
                          "<nonnegative-length-or-percentage>": function (e) {
                            return (
                              (this["<length>"](e) ||
                                this["<percentage>"](e)) &&
                              ("0" === String(e) ||
                                "function" === e.type ||
                                e.value >= 0)
                            );
                          },
                          "<nonnegative-number-or-percentage>": function (e) {
                            return (
                              (this["<number>"](e) ||
                                this["<percentage>"](e)) &&
                              ("0" === String(e) ||
                                "function" === e.type ||
                                e.value >= 0)
                            );
                          },
                          "<number>": function (e) {
                            return "number" === e.type || this["<integer>"](e);
                          },
                          "<opacity-value>": function (e) {
                            return (
                              this["<number>"](e) &&
                              e.value >= 0 &&
                              e.value <= 1
                            );
                          },
                          "<padding-width>":
                            "<nonnegative-length-or-percentage>",
                          "<percentage>": function (e) {
                            return "percentage" === e.type || "0" === String(e);
                          },
                          "<relative-size>": "smaller | larger",
                          "<shape>": "rect() | inset-rect()",
                          "<shape-box>": "<box> | margin-box",
                          "<single-animation-direction>":
                            "normal | reverse | alternate | alternate-reverse",
                          "<single-animation-name>": function (e) {
                            return (
                              this["<ident>"](e) &&
                              /^-?[a-z_][-a-z0-9_]+$/i.test(e) &&
                              !/^(none|unset|initial|inherit)$/i.test(e)
                            );
                          },
                          "<string>": function (e) {
                            return "string" === e.type;
                          },
                          "<time>": function (e) {
                            return "time" === e.type;
                          },
                          "<uri>": function (e) {
                            return "uri" === e.type;
                          },
                          "<width>": "<margin-width>",
                        },
                        complex: {
                          __proto__: null,
                          "<azimuth>":
                            "<angle> | [ [ left-side | far-left | left | center-left | center | center-right | right | far-right | right-side ] || behind ] | leftwards | rightwards",
                          "<bg-position>": "<position>#",
                          "<bg-size>":
                            "[ <length> | <percentage> | auto ]{1,2} | cover | contain",
                          "<blend-mode>":
                            "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity",
                          "<border-image-slice>": a.many(
                            [!0],
                            a.cast("<nonnegative-number-or-percentage>"),
                            a.cast("<nonnegative-number-or-percentage>"),
                            a.cast("<nonnegative-number-or-percentage>"),
                            a.cast("<nonnegative-number-or-percentage>"),
                            "fill"
                          ),
                          "<border-radius>":
                            "<nonnegative-length-or-percentage>{1,4} [ / <nonnegative-length-or-percentage>{1,4} ]?",
                          "<box-shadow>": "none | <shadow>#",
                          "<clip-path>": "<basic-shape> || <geometry-box>",
                          "<dasharray>": a
                            .cast("<nonnegative-length-or-percentage>")
                            .braces(1, 1 / 0, "#", a.cast(",").question()),
                          "<family-name>":
                            "<string> | <ident-not-generic-family> <ident>*",
                          "<filter-function-list>":
                            "[ <filter-function> | <uri> ]+",
                          "<flex>":
                            "none | [ <flex-grow> <flex-shrink>? || <flex-basis> ]",
                          "<font-family>":
                            "[ <generic-family> | <family-name> ]#",
                          "<font-shorthand>":
                            "[ <font-style> || <font-variant-css21> || <font-weight> || <font-stretch> ]? <font-size> [ / <line-height> ]? <font-family>",
                          "<font-variant-alternates>":
                            "stylistic() || historical-forms || styleset() || character-variant() || swash() || ornaments() || annotation()",
                          "<font-variant-ligatures>":
                            "[ common-ligatures | no-common-ligatures ] || [ discretionary-ligatures | no-discretionary-ligatures ] || [ historical-ligatures | no-historical-ligatures ] || [ contextual | no-contextual ]",
                          "<font-variant-numeric>":
                            "[ lining-nums | oldstyle-nums ] || [ proportional-nums | tabular-nums ] || [ diagonal-fractions | stacked-fractions ] || ordinal || slashed-zero",
                          "<font-variant-east-asian>":
                            "[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ] || [ full-width | proportional-width ] || ruby",
                          "<paint>": "<paint-basic> | <uri> <paint-basic>?",
                          "<paint-basic>":
                            "none | currentColor | <color-svg> <icccolor>?",
                          "<position>":
                            "[ center | [ left | right ] [ <percentage> | <length> ]? ] && [ center | [ top | bottom ] [ <percentage> | <length> ]? ] | [ left | center | right | <percentage> | <length> ] [ top | center | bottom | <percentage> | <length> ] | [ left | center | right | top | bottom | <percentage> | <length> ]",
                          "<repeat-style>":
                            "repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}",
                          "<shadow>": a.many(
                            [!0],
                            a.cast("<length>").braces(2, 4),
                            "inset",
                            "<color>"
                          ),
                          "<text-decoration-color>": "<color>",
                          "<text-decoration-line>":
                            "none | [ underline || overline || line-through || blink ]",
                          "<text-decoration-style>":
                            "solid | double | dotted | dashed | wavy",
                          "<will-change>": "auto | <animateable-feature>#",
                          "<x-one-radius>": "[ <length> | <percentage> ]{1,2}",
                        },
                      }),
                      Object.keys(i).forEach(function (e) {
                        n[e] = i[e];
                      }),
                      Object.keys(o.simple).forEach(function (e) {
                        var t = o.simple[e];
                        "string" === typeof t &&
                          (o.simple[e] = function (e) {
                            return o.isLiteral(e, t);
                          });
                      }),
                      Object.keys(o.complex).forEach(function (e) {
                        var t = o.complex[e];
                        "string" === typeof t && (o.complex[e] = a.parse(t));
                      }),
                      (o.complex["<font-variant>"] = a.oror(
                        { expand: "<font-variant-ligatures>" },
                        { expand: "<font-variant-alternates>" },
                        "<font-variant-caps>",
                        { expand: "<font-variant-numeric>" },
                        { expand: "<font-variant-east-asian>" }
                      ));
                  },
                  { "./Matcher": 3 },
                ],
                22: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = {
                      Colors: e("./Colors"),
                      Combinator: e("./Combinator"),
                      Parser: e("./Parser"),
                      PropertyName: e("./PropertyName"),
                      PropertyValue: e("./PropertyValue"),
                      PropertyValuePart: e("./PropertyValuePart"),
                      Matcher: e("./Matcher"),
                      MediaFeature: e("./MediaFeature"),
                      MediaQuery: e("./MediaQuery"),
                      Selector: e("./Selector"),
                      SelectorPart: e("./SelectorPart"),
                      SelectorSubPart: e("./SelectorSubPart"),
                      Specificity: e("./Specificity"),
                      TokenStream: e("./TokenStream"),
                      Tokens: e("./Tokens"),
                      ValidationError: e("./ValidationError"),
                    };
                  },
                  {
                    "./Colors": 1,
                    "./Combinator": 2,
                    "./Matcher": 3,
                    "./MediaFeature": 4,
                    "./MediaQuery": 5,
                    "./Parser": 6,
                    "./PropertyName": 8,
                    "./PropertyValue": 9,
                    "./PropertyValuePart": 11,
                    "./Selector": 13,
                    "./SelectorPart": 14,
                    "./SelectorSubPart": 15,
                    "./Specificity": 16,
                    "./TokenStream": 17,
                    "./Tokens": 18,
                    "./ValidationError": 20,
                  },
                ],
                23: [
                  function (e, t, r) {
                    "use strict";
                    function n() {
                      this._listeners = Object.create(null);
                    }
                    (t.exports = n),
                      (n.prototype = {
                        constructor: n,
                        addListener: function (e, t) {
                          this._listeners[e] || (this._listeners[e] = []),
                            this._listeners[e].push(t);
                        },
                        fire: function (e) {
                          if (
                            ("string" === typeof e && (e = { type: e }),
                            "undefined" !== typeof e.target &&
                              (e.target = this),
                            "undefined" === typeof e.type)
                          )
                            throw new Error(
                              "Event object missing 'type' property."
                            );
                          if (this._listeners[e.type])
                            for (
                              var t = this._listeners[e.type].concat(),
                                r = 0,
                                n = t.length;
                              r < n;
                              r++
                            )
                              t[r].call(this, e);
                        },
                        removeListener: function (e, t) {
                          if (this._listeners[e])
                            for (
                              var r = this._listeners[e], n = 0, i = r.length;
                              n < i;
                              n++
                            )
                              if (r[n] === t) {
                                r.splice(n, 1);
                                break;
                              }
                        },
                      });
                  },
                  {},
                ],
                24: [
                  function (e, t, r) {
                    "use strict";
                    function n(e) {
                      (this._input = e.replace(/(\r\n?|\n)/g, "\n")),
                        (this._line = 1),
                        (this._col = 1),
                        (this._cursor = 0);
                    }
                    (t.exports = n),
                      (n.prototype = {
                        constructor: n,
                        getCol: function () {
                          return this._col;
                        },
                        getLine: function () {
                          return this._line;
                        },
                        eof: function () {
                          return this._cursor === this._input.length;
                        },
                        peek: function (e) {
                          var t = null;
                          return (
                            (e = "undefined" === typeof e ? 1 : e),
                            this._cursor < this._input.length &&
                              (t = this._input.charAt(this._cursor + e - 1)),
                            t
                          );
                        },
                        read: function () {
                          var e = null;
                          return (
                            this._cursor < this._input.length &&
                              ("\n" === this._input.charAt(this._cursor)
                                ? (this._line++, (this._col = 1))
                                : this._col++,
                              (e = this._input.charAt(this._cursor++))),
                            e
                          );
                        },
                        mark: function () {
                          this._bookmark = {
                            cursor: this._cursor,
                            line: this._line,
                            col: this._col,
                          };
                        },
                        reset: function () {
                          this._bookmark &&
                            ((this._cursor = this._bookmark.cursor),
                            (this._line = this._bookmark.line),
                            (this._col = this._bookmark.col),
                            delete this._bookmark);
                        },
                        peekCount: function (e) {
                          return (
                            (e = "undefined" === typeof e ? 1 : Math.max(e, 0)),
                            this._input.substring(
                              this._cursor,
                              this._cursor + e
                            )
                          );
                        },
                        readTo: function (e) {
                          for (
                            var t, r = "";
                            r.length < e.length ||
                            r.lastIndexOf(e) !== r.length - e.length;

                          ) {
                            if (!(t = this.read()))
                              throw new Error(
                                'Expected "' +
                                  e +
                                  '" at line ' +
                                  this._line +
                                  ", col " +
                                  this._col +
                                  "."
                              );
                            r += t;
                          }
                          return r;
                        },
                        readWhile: function (e) {
                          for (
                            var t = "", r = this.peek();
                            null !== r && e(r);

                          )
                            (t += this.read()), (r = this.peek());
                          return t;
                        },
                        readMatch: function (e) {
                          var t = this._input.substring(this._cursor),
                            r = null;
                          return (
                            "string" === typeof e
                              ? t.slice(0, e.length) === e &&
                                (r = this.readCount(e.length))
                              : e instanceof RegExp &&
                                e.test(t) &&
                                (r = this.readCount(RegExp.lastMatch.length)),
                            r
                          );
                        },
                        readCount: function (e) {
                          for (var t = ""; e--; ) t += this.read();
                          return t;
                        },
                      });
                  },
                  {},
                ],
                25: [
                  function (e, t, r) {
                    "use strict";
                    function n(e, t, r) {
                      Error.call(this),
                        (this.name = this.constructor.name),
                        (this.col = r),
                        (this.line = t),
                        (this.message = e);
                    }
                    (t.exports = n),
                      (n.prototype = Object.create(Error.prototype)),
                      (n.prototype.constructor = n);
                  },
                  {},
                ],
                26: [
                  function (e, t, r) {
                    "use strict";
                    function n(e, t, r, n) {
                      (this.col = r),
                        (this.line = t),
                        (this.text = e),
                        (this.type = n);
                    }
                    (t.exports = n),
                      (n.fromToken = function (e) {
                        return new n(e.value, e.startLine, e.startCol);
                      }),
                      (n.prototype = {
                        constructor: n,
                        valueOf: function () {
                          return this.toString();
                        },
                        toString: function () {
                          return this.text;
                        },
                      });
                  },
                  {},
                ],
                27: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = o;
                    var n = e("./StringReader"),
                      i = e("./SyntaxError");
                    function o(e, t) {
                      (this._reader = new n(e ? e.toString() : "")),
                        (this._token = null),
                        (this._tokenData = t),
                        (this._lt = []),
                        (this._ltIndex = 0),
                        (this._ltIndexCache = []);
                    }
                    (o.createTokenData = function (e) {
                      var t = [],
                        r = Object.create(null),
                        n = e.concat([]),
                        i = 0,
                        o = n.length + 1;
                      for (
                        n.UNKNOWN = -1, n.unshift({ name: "EOF" });
                        i < o;
                        i++
                      )
                        t.push(n[i].name),
                          (n[n[i].name] = i),
                          n[i].text && (r[n[i].text] = i);
                      return (
                        (n.name = function (e) {
                          return t[e];
                        }),
                        (n.type = function (e) {
                          return r[e];
                        }),
                        n
                      );
                    }),
                      (o.prototype = {
                        constructor: o,
                        match: function (e, t) {
                          e instanceof Array || (e = [e]);
                          for (
                            var r = this.get(t), n = 0, i = e.length;
                            n < i;

                          )
                            if (r === e[n++]) return !0;
                          return this.unget(), !1;
                        },
                        mustMatch: function (e) {
                          var t;
                          if (
                            (e instanceof Array || (e = [e]),
                            !this.match.apply(this, arguments))
                          )
                            throw (
                              ((t = this.LT(1)),
                              new i(
                                "Expected " +
                                  this._tokenData[e[0]].name +
                                  " at line " +
                                  t.startLine +
                                  ", col " +
                                  t.startCol +
                                  ".",
                                t.startLine,
                                t.startCol
                              ))
                            );
                        },
                        advance: function (e, t) {
                          for (; 0 !== this.LA(0) && !this.match(e, t); )
                            this.get();
                          return this.LA(0);
                        },
                        get: function (e) {
                          var t,
                            r,
                            n = this._tokenData,
                            i = 0;
                          if (
                            this._lt.length &&
                            this._ltIndex >= 0 &&
                            this._ltIndex < this._lt.length
                          ) {
                            for (
                              i++,
                                this._token = this._lt[this._ltIndex++],
                                r = n[this._token.type];
                              "undefined" !== typeof r.channel &&
                              e !== r.channel &&
                              this._ltIndex < this._lt.length;

                            )
                              (this._token = this._lt[this._ltIndex++]),
                                (r = n[this._token.type]),
                                i++;
                            if (
                              ("undefined" === typeof r.channel ||
                                e === r.channel) &&
                              this._ltIndex <= this._lt.length
                            )
                              return (
                                this._ltIndexCache.push(i), this._token.type
                              );
                          }
                          return (
                            (t = this._getToken()).type > -1 &&
                              !n[t.type].hide &&
                              ((t.channel = n[t.type].channel),
                              (this._token = t),
                              this._lt.push(t),
                              this._ltIndexCache.push(
                                this._lt.length - this._ltIndex + i
                              ),
                              this._lt.length > 5 && this._lt.shift(),
                              this._ltIndexCache.length > 5 &&
                                this._ltIndexCache.shift(),
                              (this._ltIndex = this._lt.length)),
                            (r = n[t.type]) &&
                            (r.hide ||
                              ("undefined" !== typeof r.channel &&
                                e !== r.channel))
                              ? this.get(e)
                              : t.type
                          );
                        },
                        LA: function (e) {
                          var t,
                            r = e;
                          if (e > 0) {
                            if (e > 5) throw new Error("Too much lookahead.");
                            for (; r; ) (t = this.get()), r--;
                            for (; r < e; ) this.unget(), r++;
                          } else if (e < 0) {
                            if (!this._lt[this._ltIndex + e])
                              throw new Error("Too much lookbehind.");
                            t = this._lt[this._ltIndex + e].type;
                          } else t = this._token.type;
                          return t;
                        },
                        LT: function (e) {
                          return this.LA(e), this._lt[this._ltIndex + e - 1];
                        },
                        peek: function () {
                          return this.LA(1);
                        },
                        token: function () {
                          return this._token;
                        },
                        tokenName: function (e) {
                          return e < 0 || e > this._tokenData.length
                            ? "UNKNOWN_TOKEN"
                            : this._tokenData[e].name;
                        },
                        tokenType: function (e) {
                          return this._tokenData[e] || -1;
                        },
                        unget: function () {
                          if (!this._ltIndexCache.length)
                            throw new Error("Too much lookahead.");
                          (this._ltIndex -= this._ltIndexCache.pop()),
                            (this._token = this._lt[this._ltIndex - 1]);
                        },
                      });
                  },
                  { "./StringReader": 24, "./SyntaxError": 25 },
                ],
                28: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = {
                      StringReader: e("./StringReader"),
                      SyntaxError: e("./SyntaxError"),
                      SyntaxUnit: e("./SyntaxUnit"),
                      EventTarget: e("./EventTarget"),
                      TokenStreamBase: e("./TokenStreamBase"),
                    };
                  },
                  {
                    "./EventTarget": 23,
                    "./StringReader": 24,
                    "./SyntaxError": 25,
                    "./SyntaxUnit": 26,
                    "./TokenStreamBase": 27,
                  },
                ],
                parserlib: [
                  function (e, t, r) {
                    "use strict";
                    t.exports = { css: e("./css"), util: e("./util") };
                  },
                  { "./css": 22, "./util": 28 },
                ],
              },
              {},
              []
            )),
            e("parserlib")
          );
        })(),
        r = (function () {
          "use strict";
          function e(e, t) {
            return null != t && e instanceof t;
          }
          var t, r, n;
          try {
            t = Map;
          } catch (s) {
            t = function () {};
          }
          try {
            r = Set;
          } catch (s) {
            r = function () {};
          }
          try {
            n = Promise;
          } catch (s) {
            n = function () {};
          }
          function i(o, s, l, u, c) {
            "object" === typeof s &&
              ((l = s.depth),
              (u = s.prototype),
              (c = s.includeNonEnumerable),
              (s = s.circular));
            var h = [],
              d = [],
              p = "undefined" != typeof Buffer;
            return (
              "undefined" == typeof s && (s = !0),
              "undefined" == typeof l && (l = 1 / 0),
              (function o(l, f) {
                if (null === l) return null;
                if (0 === f) return l;
                var m, g;
                if ("object" != typeof l) return l;
                if (e(l, t)) m = new t();
                else if (e(l, r)) m = new r();
                else if (e(l, n))
                  m = new n(function (e, t) {
                    l.then(
                      function (t) {
                        e(o(t, f - 1));
                      },
                      function (e) {
                        t(o(e, f - 1));
                      }
                    );
                  });
                else if (i.__isArray(l)) m = [];
                else if (i.__isRegExp(l))
                  (m = new RegExp(l.source, a(l))),
                    l.lastIndex && (m.lastIndex = l.lastIndex);
                else if (i.__isDate(l)) m = new Date(l.getTime());
                else {
                  if (p && Buffer.isBuffer(l))
                    return (
                      (m = Buffer.allocUnsafe
                        ? Buffer.allocUnsafe(l.length)
                        : new Buffer(l.length)),
                      l.copy(m),
                      m
                    );
                  e(l, Error)
                    ? (m = Object.create(l))
                    : "undefined" == typeof u
                    ? ((g = Object.getPrototypeOf(l)), (m = Object.create(g)))
                    : ((m = Object.create(u)), (g = u));
                }
                if (s) {
                  var b = h.indexOf(l);
                  if (-1 != b) return d[b];
                  h.push(l), d.push(m);
                }
                for (var w in (e(l, t) &&
                  l.forEach(function (e, t) {
                    var r = o(t, f - 1),
                      n = o(e, f - 1);
                    m.set(r, n);
                  }),
                e(l, r) &&
                  l.forEach(function (e) {
                    var t = o(e, f - 1);
                    m.add(t);
                  }),
                l)) {
                  var y;
                  g && (y = Object.getOwnPropertyDescriptor(g, w)),
                    (y && null == y.set) || (m[w] = o(l[w], f - 1));
                }
                if (Object.getOwnPropertySymbols) {
                  var k = Object.getOwnPropertySymbols(l);
                  for (w = 0; w < k.length; w++) {
                    var v = k[w];
                    (!(x = Object.getOwnPropertyDescriptor(l, v)) ||
                      x.enumerable ||
                      c) &&
                      ((m[v] = o(l[v], f - 1)),
                      x.enumerable ||
                        Object.defineProperty(m, v, { enumerable: !1 }));
                  }
                }
                if (c) {
                  var _ = Object.getOwnPropertyNames(l);
                  for (w = 0; w < _.length; w++) {
                    var x,
                      E = _[w];
                    ((x = Object.getOwnPropertyDescriptor(l, E)) &&
                      x.enumerable) ||
                      ((m[E] = o(l[E], f - 1)),
                      Object.defineProperty(m, E, { enumerable: !1 }));
                  }
                }
                return m;
              })(o, l)
            );
          }
          function o(e) {
            return Object.prototype.toString.call(e);
          }
          function a(e) {
            var t = "";
            return (
              e.global && (t += "g"),
              e.ignoreCase && (t += "i"),
              e.multiline && (t += "m"),
              t
            );
          }
          return (
            (i.clonePrototype = function (e) {
              if (null === e) return null;
              var t = function () {};
              return (t.prototype = e), new t();
            }),
            (i.__objToStr = o),
            (i.__isDate = function (e) {
              return "object" === typeof e && "[object Date]" === o(e);
            }),
            (i.__isArray = function (e) {
              return "object" === typeof e && "[object Array]" === o(e);
            }),
            (i.__isRegExp = function (e) {
              return "object" === typeof e && "[object RegExp]" === o(e);
            }),
            (i.__getRegExpFlags = a),
            i
          );
        })();
      "object" === typeof e && e.exports && (e.exports = r);
      var n = (function () {
        "use strict";
        var e = [],
          o = [],
          a = /\/\*\s*csslint([^\*]*)\*\//,
          s = new t.util.EventTarget();
        return (
          (s.version = "1.0.5"),
          (s.addRule = function (t) {
            e.push(t), (e[t.id] = t);
          }),
          (s.clearRules = function () {
            e = [];
          }),
          (s.getRules = function () {
            return [].concat(e).sort(function (e, t) {
              return e.id > t.id ? 1 : 0;
            });
          }),
          (s.getRuleset = function () {
            for (var t = {}, r = 0, n = e.length; r < n; ) t[e[r++].id] = 1;
            return t;
          }),
          (s.addFormatter = function (e) {
            o[e.id] = e;
          }),
          (s.getFormatter = function (e) {
            return o[e];
          }),
          (s.format = function (e, t, r, n) {
            var i = s.getFormatter(r),
              o = null;
            return (
              i &&
                ((o = i.startFormat()),
                (o += i.formatResults(e, t, n || {})),
                (o += i.endFormat())),
              o
            );
          }),
          (s.hasFormat = function (e) {
            return o.hasOwnProperty(e);
          }),
          (s.verify = function (o, l) {
            var u,
              c,
              h,
              d = 0,
              p = {},
              f = [],
              m = new t.css.Parser({
                starHack: !0,
                ieFilters: !0,
                underscoreHack: !0,
                strict: !1,
              });
            (c = o.replace(/\n\r?/g, "$split$").split("$split$")),
              n.Util.forEach(c, function (e, t) {
                var r =
                    e &&
                    e.match(/\/\*[ \t]*csslint[ \t]+allow:[ \t]*([^\*]*)\*\//i),
                  n = r && r[1],
                  i = {};
                n &&
                  (n
                    .toLowerCase()
                    .split(",")
                    .forEach(function (e) {
                      i[e.trim()] = !0;
                    }),
                  Object.keys(i).length > 0 && (p[t + 1] = i));
              });
            var g = null,
              b = null;
            for (d in (n.Util.forEach(c, function (e, t) {
              null === g &&
                e.match(/\/\*[ \t]*csslint[ \t]+ignore:start[ \t]*\*\//i) &&
                (g = t),
                e.match(/\/\*[ \t]*csslint[ \t]+ignore:end[ \t]*\*\//i) &&
                  (b = t),
                null !== g && null !== b && (f.push([g, b]), (g = b = null));
            }),
            null !== g && f.push([g, c.length]),
            l || (l = s.getRuleset()),
            a.test(o) &&
              (l = (function (e, t) {
                var r,
                  n = e && e.match(a),
                  i = n && n[1];
                return (
                  i &&
                    ((r = { true: 2, "": 1, false: 0, 2: 2, 1: 1, 0: 0 }),
                    i
                      .toLowerCase()
                      .split(",")
                      .forEach(function (e) {
                        var n = e.split(":"),
                          i = n[0] || "",
                          o = n[1] || "";
                        t[i.trim()] = r[o.trim()];
                      })),
                  t
                );
              })(o, (l = r(l)))),
            (u = new i(c, l, p, f)),
            (l.errors = 2),
            l))
              l.hasOwnProperty(d) && l[d] && e[d] && e[d].init(m, u);
            try {
              m.parse(o);
            } catch (w) {
              u.error(
                "Fatal error, cannot continue: " + w.message,
                w.line,
                w.col,
                {}
              );
            }
            return (
              (h = {
                messages: u.messages,
                stats: u.stats,
                ruleset: u.ruleset,
                allow: u.allow,
                ignore: u.ignore,
              }).messages.sort(function (e, t) {
                return e.rollup && !t.rollup
                  ? 1
                  : !e.rollup && t.rollup
                  ? -1
                  : e.line - t.line;
              }),
              h
            );
          }),
          s
        );
      })();
      function i(e, t, r, n) {
        "use strict";
        (this.messages = []),
          (this.stats = []),
          (this.lines = e),
          (this.ruleset = t),
          (this.allow = r),
          this.allow || (this.allow = {}),
          (this.ignore = n),
          this.ignore || (this.ignore = []);
      }
      return (
        (i.prototype = {
          constructor: i,
          error: function (e, t, r, n) {
            "use strict";
            this.messages.push({
              type: "error",
              line: t,
              col: r,
              message: e,
              evidence: this.lines[t - 1],
              rule: n || {},
            });
          },
          warn: function (e, t, r, n) {
            "use strict";
            this.report(e, t, r, n);
          },
          report: function (e, t, r, n) {
            "use strict";
            (this.allow.hasOwnProperty(t) &&
              this.allow[t].hasOwnProperty(n.id)) ||
              this.isIgnored(t) ||
              this.messages.push({
                type: 2 === this.ruleset[n.id] ? "error" : "warning",
                line: t,
                col: r,
                message: e,
                evidence: this.lines[t - 1],
                rule: n,
              });
          },
          info: function (e, t, r, n) {
            "use strict";
            this.messages.push({
              type: "info",
              line: t,
              col: r,
              message: e,
              evidence: this.lines[t - 1],
              rule: n,
            });
          },
          rollupError: function (e, t) {
            "use strict";
            this.messages.push({
              type: "error",
              rollup: !0,
              message: e,
              rule: t,
            });
          },
          rollupWarn: function (e, t) {
            "use strict";
            this.messages.push({
              type: "warning",
              rollup: !0,
              message: e,
              rule: t,
            });
          },
          stat: function (e, t) {
            "use strict";
            this.stats[e] = t;
          },
          isIgnored: function (e) {
            "use strict";
            var t = !1;
            return (
              n.Util.forEach(this.ignore, function (r) {
                r[0] <= e && e <= r[1] && (t = !0);
              }),
              t
            );
          },
        }),
        (n._Reporter = i),
        (n.Util = {
          mix: function (e, t) {
            "use strict";
            var r;
            for (r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            return r;
          },
          indexOf: function (e, t) {
            "use strict";
            if (e.indexOf) return e.indexOf(t);
            for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
            return -1;
          },
          forEach: function (e, t) {
            "use strict";
            if (e.forEach) return e.forEach(t);
            for (var r = 0, n = e.length; r < n; r++) t(e[r], r, e);
          },
        }),
        n.addRule({
          id: "box-model",
          name: "Beware of broken box size",
          desc: "Don't use width or height when using padding or border.",
          url: "https://github.com/CSSLint/csslint/wiki/Beware-of-box-model-size",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n = this,
              i = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
              },
              o = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1,
              },
              a = !1;
            function s() {
              (r = {}), (a = !1);
            }
            function l() {
              var e, s;
              if (!a) {
                if (r.height)
                  for (e in o)
                    o.hasOwnProperty(e) &&
                      r[e] &&
                      ((s = r[e].value),
                      ("padding" === e &&
                        2 === s.parts.length &&
                        0 === s.parts[0].value) ||
                        t.report(
                          "Using height with " +
                            e +
                            " can sometimes make elements larger than you expect.",
                          r[e].line,
                          r[e].col,
                          n
                        ));
                if (r.width)
                  for (e in i)
                    i.hasOwnProperty(e) &&
                      r[e] &&
                      ((s = r[e].value),
                      ("padding" === e &&
                        2 === s.parts.length &&
                        0 === s.parts[1].value) ||
                        t.report(
                          "Using width with " +
                            e +
                            " can sometimes make elements larger than you expect.",
                          r[e].line,
                          r[e].col,
                          n
                        ));
              }
            }
            e.addListener("startrule", s),
              e.addListener("startfontface", s),
              e.addListener("startpage", s),
              e.addListener("startpagemargin", s),
              e.addListener("startkeyframerule", s),
              e.addListener("startviewport", s),
              e.addListener("property", function (e) {
                var t = e.property.text.toLowerCase();
                o[t] || i[t]
                  ? /^0\S*$/.test(e.value) ||
                    ("border" === t && "none" === e.value.toString()) ||
                    (r[t] = {
                      line: e.property.line,
                      col: e.property.col,
                      value: e.value,
                    })
                  : /^(width|height)/i.test(t) &&
                    /^(length|percentage)/.test(e.value.parts[0].type)
                  ? (r[t] = 1)
                  : "box-sizing" === t && (a = !0);
              }),
              e.addListener("endrule", l),
              e.addListener("endfontface", l),
              e.addListener("endpage", l),
              e.addListener("endpagemargin", l),
              e.addListener("endkeyframerule", l),
              e.addListener("endviewport", l);
          },
        }),
        n.addRule({
          id: "bulletproof-font-face",
          name: "Use the bulletproof @font-face syntax",
          desc: "Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).",
          url: "https://github.com/CSSLint/csslint/wiki/Bulletproof-font-face",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n,
              i = this,
              o = !1,
              a = !0,
              s = !1;
            e.addListener("startfontface", function () {
              o = !0;
            }),
              e.addListener("property", function (e) {
                if (o) {
                  var t = e.property.toString().toLowerCase(),
                    i = e.value.toString();
                  if (((r = e.line), (n = e.col), "src" === t)) {
                    var l =
                      /^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;
                    !i.match(l) && a
                      ? ((s = !0), (a = !1))
                      : i.match(l) && !a && (s = !1);
                  }
                }
              }),
              e.addListener("endfontface", function () {
                (o = !1),
                  s &&
                    t.report(
                      "@font-face declaration doesn't follow the fontspring bulletproof syntax.",
                      r,
                      n,
                      i
                    );
              });
          },
        }),
        n.addRule({
          id: "compatible-vendor-prefixes",
          name: "Require compatible vendor prefixes",
          desc: "Include all compatible vendor prefixes to reach a wider range of users.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-compatible-vendor-prefixes",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              i,
              o,
              a,
              s,
              l,
              u,
              c = this,
              h = !1,
              d = Array.prototype.push,
              p = [];
            for (o in (r = {
              animation: "webkit",
              "animation-delay": "webkit",
              "animation-direction": "webkit",
              "animation-duration": "webkit",
              "animation-fill-mode": "webkit",
              "animation-iteration-count": "webkit",
              "animation-name": "webkit",
              "animation-play-state": "webkit",
              "animation-timing-function": "webkit",
              appearance: "webkit moz",
              "border-end": "webkit moz",
              "border-end-color": "webkit moz",
              "border-end-style": "webkit moz",
              "border-end-width": "webkit moz",
              "border-image": "webkit moz o",
              "border-radius": "webkit",
              "border-start": "webkit moz",
              "border-start-color": "webkit moz",
              "border-start-style": "webkit moz",
              "border-start-width": "webkit moz",
              "box-align": "webkit moz",
              "box-direction": "webkit moz",
              "box-flex": "webkit moz",
              "box-lines": "webkit",
              "box-ordinal-group": "webkit moz",
              "box-orient": "webkit moz",
              "box-pack": "webkit moz",
              "box-sizing": "",
              "box-shadow": "",
              "column-count": "webkit moz ms",
              "column-gap": "webkit moz ms",
              "column-rule": "webkit moz ms",
              "column-rule-color": "webkit moz ms",
              "column-rule-style": "webkit moz ms",
              "column-rule-width": "webkit moz ms",
              "column-width": "webkit moz ms",
              flex: "webkit ms",
              "flex-basis": "webkit",
              "flex-direction": "webkit ms",
              "flex-flow": "webkit",
              "flex-grow": "webkit",
              "flex-shrink": "webkit",
              hyphens: "epub moz",
              "line-break": "webkit ms",
              "margin-end": "webkit moz",
              "margin-start": "webkit moz",
              "marquee-speed": "webkit wap",
              "marquee-style": "webkit wap",
              "padding-end": "webkit moz",
              "padding-start": "webkit moz",
              "tab-size": "moz o",
              "text-size-adjust": "webkit ms",
              transform: "webkit ms",
              "transform-origin": "webkit ms",
              transition: "",
              "transition-delay": "",
              "transition-duration": "",
              "transition-property": "",
              "transition-timing-function": "",
              "user-modify": "webkit moz",
              "user-select": "webkit moz ms",
              "word-break": "epub ms",
              "writing-mode": "epub ms",
            }))
              if (r.hasOwnProperty(o)) {
                for (
                  a = [], l = 0, u = (s = r[o].split(" ")).length;
                  l < u;
                  l++
                )
                  a.push("-" + s[l] + "-" + o);
                (r[o] = a), d.apply(p, a);
              }
            e.addListener("startrule", function () {
              i = [];
            }),
              e.addListener("startkeyframes", function (e) {
                h = e.prefix || !0;
              }),
              e.addListener("endkeyframes", function () {
                h = !1;
              }),
              e.addListener("property", function (e) {
                var t = e.property;
                n.Util.indexOf(p, t.text) > -1 &&
                  ((h &&
                    "string" === typeof h &&
                    0 === t.text.indexOf("-" + h + "-")) ||
                    i.push(t));
              }),
              e.addListener("endrule", function () {
                if (i.length) {
                  var e,
                    o,
                    a,
                    s,
                    l,
                    u,
                    h,
                    d,
                    p,
                    f,
                    m = {};
                  for (e = 0, o = i.length; e < o; e++)
                    for (s in ((a = i[e]), r))
                      r.hasOwnProperty(s) &&
                        ((l = r[s]),
                        n.Util.indexOf(l, a.text) > -1 &&
                          (m[s] ||
                            (m[s] = {
                              full: l.slice(0),
                              actual: [],
                              actualNodes: [],
                            }),
                          -1 === n.Util.indexOf(m[s].actual, a.text) &&
                            (m[s].actual.push(a.text),
                            m[s].actualNodes.push(a))));
                  for (s in m)
                    if (
                      m.hasOwnProperty(s) &&
                      ((h = (u = m[s]).full),
                      (d = u.actual),
                      h.length > d.length)
                    )
                      for (e = 0, o = h.length; e < o; e++)
                        (p = h[e]),
                          -1 === n.Util.indexOf(d, p) &&
                            ((f =
                              1 === d.length
                                ? d[0]
                                : 2 === d.length
                                ? d.join(" and ")
                                : d.join(", ")),
                            t.report(
                              "The property " +
                                p +
                                " is compatible with " +
                                f +
                                " and should be included as well.",
                              u.actualNodes[0].line,
                              u.actualNodes[0].col,
                              c
                            ));
                }
              });
          },
        }),
        n.addRule({
          id: "display-property-grouping",
          name: "Require properties appropriate for display",
          desc: "Certain properties shouldn't be used with certain display property values.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-properties-appropriate-for-display",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n = this,
              i = {
                display: 1,
                float: "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1,
              };
            function o(e, o, a) {
              r[e] &&
                (("string" === typeof i[e] &&
                  r[e].value.toLowerCase() === i[e]) ||
                  t.report(
                    a || e + " can't be used with display: " + o + ".",
                    r[e].line,
                    r[e].col,
                    n
                  ));
            }
            function a() {
              r = {};
            }
            function s() {
              var e = r.display ? r.display.value : null;
              if (e)
                switch (e) {
                  case "inline":
                    o("height", e),
                      o("width", e),
                      o("margin", e),
                      o("margin-top", e),
                      o("margin-bottom", e),
                      o(
                        "float",
                        e,
                        "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug)."
                      );
                    break;
                  case "block":
                    o("vertical-align", e);
                    break;
                  case "inline-block":
                    o("float", e);
                    break;
                  default:
                    0 === e.indexOf("table-") &&
                      (o("margin", e),
                      o("margin-left", e),
                      o("margin-right", e),
                      o("margin-top", e),
                      o("margin-bottom", e),
                      o("float", e));
                }
            }
            e.addListener("startrule", a),
              e.addListener("startfontface", a),
              e.addListener("startkeyframerule", a),
              e.addListener("startpagemargin", a),
              e.addListener("startpage", a),
              e.addListener("startviewport", a),
              e.addListener("property", function (e) {
                var t = e.property.text.toLowerCase();
                i[t] &&
                  (r[t] = {
                    value: e.value.text,
                    line: e.property.line,
                    col: e.property.col,
                  });
              }),
              e.addListener("endrule", s),
              e.addListener("endfontface", s),
              e.addListener("endkeyframerule", s),
              e.addListener("endpagemargin", s),
              e.addListener("endpage", s),
              e.addListener("endviewport", s);
          },
        }),
        n.addRule({
          id: "duplicate-background-images",
          name: "Disallow duplicate background images",
          desc: "Every background-image should be unique. Use a common class for e.g. sprites.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-background-images",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = {};
            e.addListener("property", function (e) {
              var i,
                o,
                a = e.property.text,
                s = e.value;
              if (a.match(/background/i))
                for (i = 0, o = s.parts.length; i < o; i++)
                  "uri" === s.parts[i].type &&
                    ("undefined" === typeof n[s.parts[i].uri]
                      ? (n[s.parts[i].uri] = e)
                      : t.report(
                          "Background image '" +
                            s.parts[i].uri +
                            "' was used multiple times, first declared at line " +
                            n[s.parts[i].uri].line +
                            ", col " +
                            n[s.parts[i].uri].col +
                            ".",
                          e.line,
                          e.col,
                          r
                        ));
            });
          },
        }),
        n.addRule({
          id: "duplicate-properties",
          name: "Disallow duplicate properties",
          desc: "Duplicate properties must appear one after the other.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-properties",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n,
              i = this;
            function o() {
              r = {};
            }
            e.addListener("startrule", o),
              e.addListener("startfontface", o),
              e.addListener("startpage", o),
              e.addListener("startpagemargin", o),
              e.addListener("startkeyframerule", o),
              e.addListener("startviewport", o),
              e.addListener("property", function (e) {
                var o = e.property.text.toLowerCase();
                !r[o] ||
                  (n === o && r[o] !== e.value.text) ||
                  t.report(
                    "Duplicate property '" + e.property + "' found.",
                    e.line,
                    e.col,
                    i
                  ),
                  (r[o] = e.value.text),
                  (n = o);
              });
          },
        }),
        n.addRule({
          id: "empty-rules",
          name: "Disallow empty rules",
          desc: "Rules without any properties specified should be removed.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-empty-rules",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("startrule", function () {
              n = 0;
            }),
              e.addListener("property", function () {
                n++;
              }),
              e.addListener("endrule", function (e) {
                var i = e.selectors;
                0 === n && t.report("Rule is empty.", i[0].line, i[0].col, r);
              });
          },
        }),
        n.addRule({
          id: "errors",
          name: "Parsing Errors",
          desc: "This rule looks for recoverable syntax errors.",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("error", function (e) {
              t.error(e.message, e.line, e.col, r);
            });
          },
        }),
        n.addRule({
          id: "floats",
          name: "Disallow too many floats",
          desc: "This rule tests if the float property is used too many times",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-too-many-floats",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("property", function (e) {
              t.isIgnored(e.property.line) ||
                ("float" === e.property.text.toLowerCase() &&
                  "none" !== e.value.text.toLowerCase() &&
                  n++);
            }),
              e.addListener("endstylesheet", function () {
                t.stat("floats", n),
                  n >= 10 &&
                    t.rollupWarn(
                      "Too many floats (" +
                        n +
                        "), you're probably using them for layout. Consider using a grid system instead.",
                      r
                    );
              });
          },
        }),
        n.addRule({
          id: "font-faces",
          name: "Don't use too many web fonts",
          desc: "Too many different web fonts in the same stylesheet.",
          url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-web-fonts",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("startfontface", function (e) {
              t.isIgnored(e.line) || n++;
            }),
              e.addListener("endstylesheet", function () {
                n > 5 &&
                  t.rollupWarn(
                    "Too many @font-face declarations (" + n + ").",
                    r
                  );
              });
          },
        }),
        n.addRule({
          id: "font-sizes",
          name: "Disallow too many font sizes",
          desc: "Checks the number of font-size declarations.",
          url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-font-size-declarations",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("property", function (e) {
              t.isIgnored(e.property.line) ||
                ("font-size" === e.property.toString() && n++);
            }),
              e.addListener("endstylesheet", function () {
                t.stat("font-sizes", n),
                  n >= 10 &&
                    t.rollupWarn(
                      "Too many font-size declarations (" +
                        n +
                        "), abstraction needed.",
                      r
                    );
              });
          },
        }),
        n.addRule({
          id: "gradients",
          name: "Require all gradient definitions",
          desc: "When using a vendor-prefixed gradient, make sure to use them all.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-all-gradient-definitions",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n = this;
            e.addListener("startrule", function () {
              r = { moz: 0, webkit: 0, oldWebkit: 0, o: 0 };
            }),
              e.addListener("property", function (e) {
                /\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(
                  e.value
                )
                  ? (r[RegExp.$1] = 1)
                  : /\-webkit\-gradient/i.test(e.value) && (r.oldWebkit = 1);
              }),
              e.addListener("endrule", function (e) {
                var i = [];
                r.moz || i.push("Firefox 3.6+"),
                  r.webkit || i.push("Webkit (Safari 5+, Chrome)"),
                  r.oldWebkit || i.push("Old Webkit (Safari 4+, Chrome)"),
                  r.o || i.push("Opera 11.1+"),
                  i.length &&
                    i.length < 4 &&
                    t.report(
                      "Missing vendor-prefixed CSS gradients for " +
                        i.join(", ") +
                        ".",
                      e.selectors[0].line,
                      e.selectors[0].col,
                      n
                    );
              });
          },
        }),
        n.addRule({
          id: "ids",
          name: "Disallow IDs in selectors",
          desc: "Selectors should not contain IDs.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-IDs-in-selectors",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("startrule", function (n) {
              var i,
                o,
                a,
                s,
                l,
                u,
                c = n.selectors;
              for (s = 0; s < c.length; s++) {
                for (i = c[s], a = 0, l = 0; l < i.parts.length; l++)
                  if ((o = i.parts[l]).type === e.SELECTOR_PART_TYPE)
                    for (u = 0; u < o.modifiers.length; u++)
                      "id" === o.modifiers[u].type && a++;
                1 === a
                  ? t.report("Don't use IDs in selectors.", i.line, i.col, r)
                  : a > 1 &&
                    t.report(
                      a + " IDs in the selector, really?",
                      i.line,
                      i.col,
                      r
                    );
              }
            });
          },
        }),
        n.addRule({
          id: "import-ie-limit",
          name: "@import limit on IE6-IE9",
          desc: "IE6-9 supports up to 31 @import per stylesheet",
          browsers: "IE6, IE7, IE8, IE9",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("startpage", function () {
              n = 0;
            }),
              e.addListener("import", function () {
                n++;
              }),
              e.addListener("endstylesheet", function () {
                n > 31 &&
                  t.rollupError(
                    "Too many @import rules (" +
                      n +
                      "). IE6-9 supports up to 31 import per stylesheet.",
                    r
                  );
              });
          },
        }),
        n.addRule({
          id: "import",
          name: "Disallow @import",
          desc: "Don't use @import, use <link> instead.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-%40import",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("import", function (e) {
              t.report(
                "@import prevents parallel downloads, use <link> instead.",
                e.line,
                e.col,
                r
              );
            });
          },
        }),
        n.addRule({
          id: "important",
          name: "Disallow !important",
          desc: "Be careful when using !important declaration",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-%21important",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("property", function (e) {
              t.isIgnored(e.line) ||
                (!0 === e.important &&
                  (n++, t.report("Use of !important", e.line, e.col, r)));
            }),
              e.addListener("endstylesheet", function () {
                t.stat("important", n),
                  n >= 10 &&
                    t.rollupWarn(
                      "Too many !important declarations (" +
                        n +
                        "), try to use less than 10 to avoid specificity issues.",
                      r
                    );
              });
          },
        }),
        n.addRule({
          id: "known-properties",
          name: "Require use of known properties",
          desc: "Properties should be known (listed in CSS3 specification) or be a vendor-prefixed property.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-use-of-known-properties",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("property", function (e) {
              e.invalid && t.report(e.invalid.message, e.line, e.col, r);
            });
          },
        }),
        n.addRule({
          id: "order-alphabetical",
          name: "Alphabetical order",
          desc: "Assure properties are in alphabetical order",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n = this,
              i = function () {
                r = [];
              },
              o = function (e) {
                r.join(",") !== r.sort().join(",") &&
                  t.report(
                    "Rule doesn't have all its properties in alphabetical order.",
                    e.line,
                    e.col,
                    n
                  );
              };
            e.addListener("startrule", i),
              e.addListener("startfontface", i),
              e.addListener("startpage", i),
              e.addListener("startpagemargin", i),
              e.addListener("startkeyframerule", i),
              e.addListener("startviewport", i),
              e.addListener("property", function (e) {
                var t = e.property.text.toLowerCase().replace(/^-.*?-/, "");
                r.push(t);
              }),
              e.addListener("endrule", o),
              e.addListener("endfontface", o),
              e.addListener("endpage", o),
              e.addListener("endpagemargin", o),
              e.addListener("endkeyframerule", o),
              e.addListener("endviewport", o);
          },
        }),
        n.addRule({
          id: "outline-none",
          name: "Disallow outline: none",
          desc: "Use of outline: none or outline: 0 should be limited to :focus rules.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-outline%3Anone",
          browsers: "All",
          tags: ["Accessibility"],
          init: function (e, t) {
            "use strict";
            var r,
              n = this;
            function i(e) {
              r = e.selectors
                ? {
                    line: e.line,
                    col: e.col,
                    selectors: e.selectors,
                    propCount: 0,
                    outline: !1,
                  }
                : null;
            }
            function o() {
              r &&
                r.outline &&
                (-1 === r.selectors.toString().toLowerCase().indexOf(":focus")
                  ? t.report(
                      "Outlines should only be modified using :focus.",
                      r.line,
                      r.col,
                      n
                    )
                  : 1 === r.propCount &&
                    t.report(
                      "Outlines shouldn't be hidden unless other visual changes are made.",
                      r.line,
                      r.col,
                      n
                    ));
            }
            e.addListener("startrule", i),
              e.addListener("startfontface", i),
              e.addListener("startpage", i),
              e.addListener("startpagemargin", i),
              e.addListener("startkeyframerule", i),
              e.addListener("startviewport", i),
              e.addListener("property", function (e) {
                var t = e.property.text.toLowerCase(),
                  n = e.value;
                r &&
                  (r.propCount++,
                  "outline" !== t ||
                    ("none" !== n.toString() && "0" !== n.toString()) ||
                    (r.outline = !0));
              }),
              e.addListener("endrule", o),
              e.addListener("endfontface", o),
              e.addListener("endpage", o),
              e.addListener("endpagemargin", o),
              e.addListener("endkeyframerule", o),
              e.addListener("endviewport", o);
          },
        }),
        n.addRule({
          id: "overqualified-elements",
          name: "Disallow overqualified elements",
          desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-overqualified-elements",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = {};
            e.addListener("startrule", function (i) {
              var o,
                a,
                s,
                l,
                u,
                c,
                h = i.selectors;
              for (l = 0; l < h.length; l++)
                for (o = h[l], u = 0; u < o.parts.length; u++)
                  if ((a = o.parts[u]).type === e.SELECTOR_PART_TYPE)
                    for (c = 0; c < a.modifiers.length; c++)
                      (s = a.modifiers[c]),
                        a.elementName && "id" === s.type
                          ? t.report(
                              "Element (" +
                                a +
                                ") is overqualified, just use " +
                                s +
                                " without element name.",
                              a.line,
                              a.col,
                              r
                            )
                          : "class" === s.type &&
                            (n[s] || (n[s] = []),
                            n[s].push({ modifier: s, part: a }));
            }),
              e.addListener("endstylesheet", function () {
                var e;
                for (e in n)
                  n.hasOwnProperty(e) &&
                    1 === n[e].length &&
                    n[e][0].part.elementName &&
                    t.report(
                      "Element (" +
                        n[e][0].part +
                        ") is overqualified, just use " +
                        n[e][0].modifier +
                        " without element name.",
                      n[e][0].part.line,
                      n[e][0].part.col,
                      r
                    );
              });
          },
        }),
        n.addRule({
          id: "regex-selectors",
          name: "Disallow selectors that look like regexs",
          desc: "Selectors that look like regular expressions are slow and should be avoided.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-selectors-that-look-like-regular-expressions",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("startrule", function (n) {
              var i,
                o,
                a,
                s,
                l,
                u,
                c = n.selectors;
              for (s = 0; s < c.length; s++)
                for (i = c[s], l = 0; l < i.parts.length; l++)
                  if ((o = i.parts[l]).type === e.SELECTOR_PART_TYPE)
                    for (u = 0; u < o.modifiers.length; u++)
                      "attribute" === (a = o.modifiers[u]).type &&
                        /([~\|\^\$\*]=)/.test(a) &&
                        t.report(
                          "Attribute selectors with " +
                            RegExp.$1 +
                            " are slow!",
                          a.line,
                          a.col,
                          r
                        );
            });
          },
        }),
        n.addRule({
          id: "rules-count",
          name: "Rules Count",
          desc: "Track how many rules there are.",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = 0;
            e.addListener("startrule", function () {
              r++;
            }),
              e.addListener("endstylesheet", function () {
                t.stat("rule-count", r);
              });
          },
        }),
        n.addRule({
          id: "selector-max-approaching",
          name: "Warn when approaching the 4095 selector limit for IE",
          desc: "Will warn when selector count is >= 3800 selectors.",
          browsers: "IE",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("startrule", function (e) {
              n += e.selectors.length;
            }),
              e.addListener("endstylesheet", function () {
                n >= 3800 &&
                  t.report(
                    "You have " +
                      n +
                      " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",
                    0,
                    0,
                    r
                  );
              });
          },
        }),
        n.addRule({
          id: "selector-max",
          name: "Error when past the 4095 selector limit for IE",
          desc: "Will error when selector count is > 4095.",
          browsers: "IE",
          init: function (e, t) {
            "use strict";
            var r = this,
              n = 0;
            e.addListener("startrule", function (e) {
              n += e.selectors.length;
            }),
              e.addListener("endstylesheet", function () {
                n > 4095 &&
                  t.report(
                    "You have " +
                      n +
                      " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",
                    0,
                    0,
                    r
                  );
              });
          },
        }),
        n.addRule({
          id: "selector-newline",
          name: "Disallow new-line characters in selectors",
          desc: "New-line characters in selectors are usually a forgotten comma and not a descendant combinator.",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("startrule", function (e) {
              var n,
                i,
                o,
                a,
                s,
                l,
                u,
                c,
                h,
                d,
                p,
                f = e.selectors;
              for (n = 0, i = f.length; n < i; n++)
                for (a = 0, l = (o = f[n]).parts.length; a < l; a++)
                  for (s = a + 1; s < l; s++)
                    (u = o.parts[a]),
                      (c = o.parts[s]),
                      (h = u.type),
                      (d = u.line),
                      (p = c.line),
                      "descendant" === h &&
                        p > d &&
                        t.report(
                          "newline character found in selector (forgot a comma?)",
                          d,
                          f[n].parts[0].col,
                          r
                        );
            });
          },
        }),
        n.addRule({
          id: "shorthand",
          name: "Require shorthand properties",
          desc: "Use shorthand properties where possible.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-shorthand-properties",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n,
              i,
              o,
              a = this,
              s = {},
              l = {
                margin: [
                  "margin-top",
                  "margin-bottom",
                  "margin-left",
                  "margin-right",
                ],
                padding: [
                  "padding-top",
                  "padding-bottom",
                  "padding-left",
                  "padding-right",
                ],
              };
            for (r in l)
              if (l.hasOwnProperty(r))
                for (n = 0, i = l[r].length; n < i; n++) s[l[r][n]] = r;
            function u() {
              o = {};
            }
            function c(e) {
              var r, n, i, s;
              for (r in l)
                if (l.hasOwnProperty(r)) {
                  for (s = 0, n = 0, i = l[r].length; n < i; n++)
                    s += o[l[r][n]] ? 1 : 0;
                  s === l[r].length &&
                    t.report(
                      "The properties " +
                        l[r].join(", ") +
                        " can be replaced by " +
                        r +
                        ".",
                      e.line,
                      e.col,
                      a
                    );
                }
            }
            e.addListener("startrule", u),
              e.addListener("startfontface", u),
              e.addListener("property", function (e) {
                var t = e.property.toString().toLowerCase();
                s[t] && (o[t] = 1);
              }),
              e.addListener("endrule", c),
              e.addListener("endfontface", c);
          },
        }),
        n.addRule({
          id: "star-property-hack",
          name: "Disallow properties with a star prefix",
          desc: "Checks for the star property hack (targets IE6/7)",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-star-hack",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("property", function (e) {
              "*" === e.property.hack &&
                t.report(
                  "Property with star prefix found.",
                  e.property.line,
                  e.property.col,
                  r
                );
            });
          },
        }),
        n.addRule({
          id: "text-indent",
          name: "Disallow negative text-indent",
          desc: "Checks for text indent less than -99px",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-negative-text-indent",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n,
              i = this;
            function o() {
              (r = !1), (n = "inherit");
            }
            function a() {
              r &&
                "ltr" !== n &&
                t.report(
                  "Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.",
                  r.line,
                  r.col,
                  i
                );
            }
            e.addListener("startrule", o),
              e.addListener("startfontface", o),
              e.addListener("property", function (e) {
                var t = e.property.toString().toLowerCase(),
                  i = e.value;
                "text-indent" === t && i.parts[0].value < -99
                  ? (r = e.property)
                  : "direction" === t && "ltr" === i.toString() && (n = "ltr");
              }),
              e.addListener("endrule", a),
              e.addListener("endfontface", a);
          },
        }),
        n.addRule({
          id: "underscore-property-hack",
          name: "Disallow properties with an underscore prefix",
          desc: "Checks for the underscore property hack (targets IE6)",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-underscore-hack",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("property", function (e) {
              "_" === e.property.hack &&
                t.report(
                  "Property with underscore prefix found.",
                  e.property.line,
                  e.property.col,
                  r
                );
            });
          },
        }),
        n.addRule({
          id: "universal-selector",
          name: "Disallow universal selector",
          desc: "The universal selector (*) is known to be slow.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-universal-selector",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("startrule", function (e) {
              var n,
                i,
                o,
                a = e.selectors;
              for (o = 0; o < a.length; o++)
                "*" ===
                  (i = (n = a[o]).parts[n.parts.length - 1]).elementName &&
                  t.report(r.desc, i.line, i.col, r);
            });
          },
        }),
        n.addRule({
          id: "unqualified-attributes",
          name: "Disallow unqualified attribute selectors",
          desc: "Unqualified attribute selectors are known to be slow.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-unqualified-attribute-selectors",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("startrule", function (n) {
              var i,
                o,
                a,
                s,
                l,
                u = n.selectors,
                c = !1;
              for (s = 0; s < u.length; s++)
                if (
                  (o = (i = u[s]).parts[i.parts.length - 1]).type ===
                  e.SELECTOR_PART_TYPE
                ) {
                  for (l = 0; l < o.modifiers.length; l++)
                    if (
                      "class" === (a = o.modifiers[l]).type ||
                      "id" === a.type
                    ) {
                      c = !0;
                      break;
                    }
                  if (!c)
                    for (l = 0; l < o.modifiers.length; l++)
                      "attribute" !== (a = o.modifiers[l]).type ||
                        (o.elementName && "*" !== o.elementName) ||
                        t.report(r.desc, o.line, o.col, r);
                }
            });
          },
        }),
        n.addRule({
          id: "vendor-prefix",
          name: "Require standard property with vendor prefix",
          desc: "When using a vendor-prefixed property, make sure to include the standard one.",
          url: "https://github.com/CSSLint/csslint/wiki/Require-standard-property-with-vendor-prefix",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r,
              n,
              i = this,
              o = {
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius":
                  "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius":
                  "border-bottom-right-radius",
                "-o-border-radius": "border-radius",
                "-o-border-top-left-radius": "border-top-left-radius",
                "-o-border-top-right-radius": "border-top-right-radius",
                "-o-border-bottom-left-radius": "border-bottom-left-radius",
                "-o-border-bottom-right-radius": "border-bottom-right-radius",
                "-moz-border-radius": "border-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",
                "-moz-column-count": "column-count",
                "-webkit-column-count": "column-count",
                "-moz-column-gap": "column-gap",
                "-webkit-column-gap": "column-gap",
                "-moz-column-rule": "column-rule",
                "-webkit-column-rule": "column-rule",
                "-moz-column-rule-style": "column-rule-style",
                "-webkit-column-rule-style": "column-rule-style",
                "-moz-column-rule-color": "column-rule-color",
                "-webkit-column-rule-color": "column-rule-color",
                "-moz-column-rule-width": "column-rule-width",
                "-webkit-column-rule-width": "column-rule-width",
                "-moz-column-width": "column-width",
                "-webkit-column-width": "column-width",
                "-webkit-column-span": "column-span",
                "-webkit-columns": "columns",
                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",
                "-moz-transform": "transform",
                "-webkit-transform": "transform",
                "-o-transform": "transform",
                "-ms-transform": "transform",
                "-moz-transform-origin": "transform-origin",
                "-webkit-transform-origin": "transform-origin",
                "-o-transform-origin": "transform-origin",
                "-ms-transform-origin": "transform-origin",
                "-moz-box-sizing": "box-sizing",
                "-webkit-box-sizing": "box-sizing",
              };
            function a() {
              (r = {}), (n = 1);
            }
            function s() {
              var e,
                n,
                a,
                s,
                l,
                u = [];
              for (e in r) o[e] && u.push({ actual: e, needed: o[e] });
              for (n = 0, a = u.length; n < a; n++)
                (s = u[n].needed),
                  (l = u[n].actual),
                  r[s]
                    ? r[s][0].pos < r[l][0].pos &&
                      t.report(
                        "Standard property '" +
                          s +
                          "' should come after vendor-prefixed property '" +
                          l +
                          "'.",
                        r[l][0].name.line,
                        r[l][0].name.col,
                        i
                      )
                    : t.report(
                        "Missing standard property '" +
                          s +
                          "' to go along with '" +
                          l +
                          "'.",
                        r[l][0].name.line,
                        r[l][0].name.col,
                        i
                      );
            }
            e.addListener("startrule", a),
              e.addListener("startfontface", a),
              e.addListener("startpage", a),
              e.addListener("startpagemargin", a),
              e.addListener("startkeyframerule", a),
              e.addListener("startviewport", a),
              e.addListener("property", function (e) {
                var t = e.property.text.toLowerCase();
                r[t] || (r[t] = []),
                  r[t].push({ name: e.property, value: e.value, pos: n++ });
              }),
              e.addListener("endrule", s),
              e.addListener("endfontface", s),
              e.addListener("endpage", s),
              e.addListener("endpagemargin", s),
              e.addListener("endkeyframerule", s),
              e.addListener("endviewport", s);
          },
        }),
        n.addRule({
          id: "zero-units",
          name: "Disallow units for 0 values",
          desc: "You don't need to specify units when a value is 0.",
          url: "https://github.com/CSSLint/csslint/wiki/Disallow-units-for-zero-values",
          browsers: "All",
          init: function (e, t) {
            "use strict";
            var r = this;
            e.addListener("property", function (e) {
              for (var n = e.value.parts, i = 0, o = n.length; i < o; )
                (!n[i].units && "percentage" !== n[i].type) ||
                  0 !== n[i].value ||
                  "time" === n[i].type ||
                  t.report(
                    "Values of 0 shouldn't have units specified.",
                    n[i].line,
                    n[i].col,
                    r
                  ),
                  i++;
            });
          },
        }),
        (function () {
          "use strict";
          var e = function (e) {
            return e && e.constructor === String
              ? e.replace(/["&><]/g, function (e) {
                  switch (e) {
                    case '"':
                      return "&quot;";
                    case "&":
                      return "&amp;";
                    case "<":
                      return "&lt;";
                    case ">":
                      return "&gt;";
                  }
                })
              : "";
          };
          n.addFormatter({
            id: "checkstyle-xml",
            name: "Checkstyle XML format",
            startFormat: function () {
              return '<?xml version="1.0" encoding="utf-8"?><checkstyle>';
            },
            endFormat: function () {
              return "</checkstyle>";
            },
            readError: function (t, r) {
              return (
                '<file name="' +
                e(t) +
                '"><error line="0" column="0" severty="error" message="' +
                e(r) +
                '"></error></file>'
              );
            },
            formatResults: function (t, r) {
              var i = t.messages,
                o = [];
              return (
                i.length > 0 &&
                  (o.push('<file name="' + r + '">'),
                  n.Util.forEach(i, function (t) {
                    var r;
                    t.rollup ||
                      o.push(
                        '<error line="' +
                          t.line +
                          '" column="' +
                          t.col +
                          '" severity="' +
                          t.type +
                          '" message="' +
                          e(t.message) +
                          '" source="' +
                          (((r = t.rule) && "name" in r
                            ? "net.csslint." + r.name.replace(/\s/g, "")
                            : "") +
                            '"/>')
                      );
                  }),
                  o.push("</file>")),
                o.join("")
              );
            },
          });
        })(),
        n.addFormatter({
          id: "compact",
          name: "Compact, 'porcelain' format",
          startFormat: function () {
            "use strict";
            return "";
          },
          endFormat: function () {
            "use strict";
            return "";
          },
          formatResults: function (e, t, r) {
            "use strict";
            var i = e.messages,
              o = "";
            r = r || {};
            var a = function (e) {
              return e.charAt(0).toUpperCase() + e.slice(1);
            };
            return 0 === i.length
              ? r.quiet
                ? ""
                : t + ": Lint Free!"
              : (n.Util.forEach(i, function (e) {
                  e.rollup
                    ? (o +=
                        t +
                        ": " +
                        a(e.type) +
                        " - " +
                        e.message +
                        " (" +
                        e.rule.id +
                        ")\n")
                    : (o +=
                        t +
                        ": line " +
                        e.line +
                        ", col " +
                        e.col +
                        ", " +
                        a(e.type) +
                        " - " +
                        e.message +
                        " (" +
                        e.rule.id +
                        ")\n");
                }),
                o);
          },
        }),
        n.addFormatter({
          id: "csslint-xml",
          name: "CSSLint XML format",
          startFormat: function () {
            "use strict";
            return '<?xml version="1.0" encoding="utf-8"?><csslint>';
          },
          endFormat: function () {
            "use strict";
            return "</csslint>";
          },
          formatResults: function (e, t) {
            "use strict";
            var r = e.messages,
              i = [],
              o = function (e) {
                return e && e.constructor === String
                  ? e
                      .replace(/"/g, "'")
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  : "";
              };
            return (
              r.length > 0 &&
                (i.push('<file name="' + t + '">'),
                n.Util.forEach(r, function (e) {
                  e.rollup
                    ? i.push(
                        '<issue severity="' +
                          e.type +
                          '" reason="' +
                          o(e.message) +
                          '" evidence="' +
                          o(e.evidence) +
                          '"/>'
                      )
                    : i.push(
                        '<issue line="' +
                          e.line +
                          '" char="' +
                          e.col +
                          '" severity="' +
                          e.type +
                          '" reason="' +
                          o(e.message) +
                          '" evidence="' +
                          o(e.evidence) +
                          '"/>'
                      );
                }),
                i.push("</file>")),
              i.join("")
            );
          },
        }),
        n.addFormatter({
          id: "json",
          name: "JSON",
          startFormat: function () {
            "use strict";
            return (this.json = []), "";
          },
          endFormat: function () {
            "use strict";
            var e = "";
            return (
              this.json.length > 0 &&
                (e =
                  1 === this.json.length
                    ? JSON.stringify(this.json[0])
                    : JSON.stringify(this.json)),
              e
            );
          },
          formatResults: function (e, t, r) {
            "use strict";
            return (
              (e.messages.length > 0 || !r.quiet) &&
                this.json.push({
                  filename: t,
                  messages: e.messages,
                  stats: e.stats,
                }),
              ""
            );
          },
        }),
        n.addFormatter({
          id: "junit-xml",
          name: "JUNIT XML format",
          startFormat: function () {
            "use strict";
            return '<?xml version="1.0" encoding="utf-8"?><testsuites>';
          },
          endFormat: function () {
            "use strict";
            return "</testsuites>";
          },
          formatResults: function (e, t) {
            "use strict";
            var r = e.messages,
              n = [],
              i = { error: 0, failure: 0 },
              o = function (e) {
                return e && e.constructor === String
                  ? e
                      .replace(/"/g, "'")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  : "";
              };
            return (
              r.length > 0 &&
                (r.forEach(function (e) {
                  var t,
                    r = "warning" === e.type ? "error" : e.type;
                  e.rollup ||
                    (n.push(
                      '<testcase time="0" name="' +
                        (((t = e.rule) && "name" in t
                          ? "net.csslint." + t.name.replace(/\s/g, "")
                          : "") +
                          '">')
                    ),
                    n.push(
                      "<" +
                        r +
                        ' message="' +
                        o(e.message) +
                        '"><![CDATA[' +
                        e.line +
                        ":" +
                        e.col +
                        ":" +
                        o(e.evidence) +
                        "]]></" +
                        r +
                        ">"
                    ),
                    n.push("</testcase>"),
                    (i[r] += 1));
                }),
                n.unshift(
                  '<testsuite time="0" tests="' +
                    r.length +
                    '" skipped="0" errors="' +
                    i.error +
                    '" failures="' +
                    i.failure +
                    '" package="net.csslint" name="' +
                    t +
                    '">'
                ),
                n.push("</testsuite>")),
              n.join("")
            );
          },
        }),
        n.addFormatter({
          id: "lint-xml",
          name: "Lint XML format",
          startFormat: function () {
            "use strict";
            return '<?xml version="1.0" encoding="utf-8"?><lint>';
          },
          endFormat: function () {
            "use strict";
            return "</lint>";
          },
          formatResults: function (e, t) {
            "use strict";
            var r = e.messages,
              i = [],
              o = function (e) {
                return e && e.constructor === String
                  ? e
                      .replace(/"/g, "'")
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  : "";
              };
            return (
              r.length > 0 &&
                (i.push('<file name="' + t + '">'),
                n.Util.forEach(r, function (e) {
                  if (e.rollup)
                    i.push(
                      '<issue severity="' +
                        e.type +
                        '" reason="' +
                        o(e.message) +
                        '" evidence="' +
                        o(e.evidence) +
                        '"/>'
                    );
                  else {
                    var t = "";
                    e.rule && e.rule.id && (t = 'rule="' + o(e.rule.id) + '" '),
                      i.push(
                        "<issue " +
                          t +
                          'line="' +
                          e.line +
                          '" char="' +
                          e.col +
                          '" severity="' +
                          e.type +
                          '" reason="' +
                          o(e.message) +
                          '" evidence="' +
                          o(e.evidence) +
                          '"/>'
                      );
                  }
                }),
                i.push("</file>")),
              i.join("")
            );
          },
        }),
        n.addFormatter({
          id: "text",
          name: "Plain Text",
          startFormat: function () {
            "use strict";
            return "";
          },
          endFormat: function () {
            "use strict";
            return "";
          },
          formatResults: function (e, t, r) {
            "use strict";
            var i = e.messages,
              o = "";
            if (((r = r || {}), 0 === i.length))
              return r.quiet ? "" : "\n\ncsslint: No errors in " + t + ".";
            (o = "\n\ncsslint: There "),
              1 === i.length
                ? (o += "is 1 problem")
                : (o += "are " + i.length + " problems"),
              (o += " in " + t + ".");
            var a = t.lastIndexOf("/"),
              s = t;
            return (
              -1 === a && (a = t.lastIndexOf("\\")),
              a > -1 && (s = t.substring(a + 1)),
              n.Util.forEach(i, function (e, t) {
                (o = o + "\n\n" + s),
                  e.rollup
                    ? ((o += "\n" + (t + 1) + ": " + e.type),
                      (o += "\n" + e.message))
                    : ((o +=
                        "\n" +
                        (t + 1) +
                        ": " +
                        e.type +
                        " at line " +
                        e.line +
                        ", col " +
                        e.col),
                      (o += "\n" + e.message),
                      (o += "\n" + e.evidence));
              }),
              o
            );
          },
        }),
        n
      );
    })();
    r.exports.CSSLint = n;
  }),
  ace.define("ace/mode/css_worker", [], function (e, t, r) {
    "use strict";
    var n = e("../lib/oop"),
      i = e("../lib/lang"),
      o = e("../worker/mirror").Mirror,
      a = e("./css/csslint").CSSLint,
      s = (t.Worker = function (e) {
        o.call(this, e),
          this.setTimeout(400),
          (this.ruleset = null),
          this.setDisabledRules("ids|order-alphabetical"),
          this.setInfoRules(
            "adjoining-classes|zero-units|gradients|box-model|import|outline-none|vendor-prefix"
          );
      });
    n.inherits(s, o),
      function () {
        (this.setInfoRules = function (e) {
          "string" == typeof e && (e = e.split("|")),
            (this.infoRules = i.arrayToMap(e)),
            this.doc.getValue() && this.deferredUpdate.schedule(100);
        }),
          (this.setDisabledRules = function (e) {
            if (e) {
              "string" == typeof e && (e = e.split("|"));
              var t = {};
              a.getRules().forEach(function (e) {
                t[e.id] = !0;
              }),
                e.forEach(function (e) {
                  delete t[e];
                }),
                (this.ruleset = t);
            } else this.ruleset = null;
            this.doc.getValue() && this.deferredUpdate.schedule(100);
          }),
          (this.onUpdate = function () {
            var e = this.doc.getValue();
            if (!e) return this.sender.emit("annotate", []);
            var t = this.infoRules,
              r = a.verify(e, this.ruleset);
            this.sender.emit(
              "annotate",
              r.messages.map(function (e) {
                return {
                  row: e.line - 1,
                  column: e.col - 1,
                  text: e.message,
                  type: t[e.rule.id] ? "info" : e.type,
                  rule: e.rule.name,
                };
              })
            );
          });
      }.call(s.prototype);
  });
