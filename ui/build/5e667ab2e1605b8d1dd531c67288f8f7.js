ace.define(
  "ace/mode/jsdoc_comment_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      o = e("./text_highlight_rules").TextHighlightRules,
      a = function e() {
        (this.$rules = {
          start: [
            {
              token: ["comment.doc.tag", "comment.doc.text", "lparen.doc"],
              regex:
                "(@(?:param|member|typedef|property|namespace|var|const|callback))(\\s*)({)",
              push: [
                {
                  token: "lparen.doc",
                  regex: "{",
                  push: [
                    { include: "doc-syntax" },
                    { token: "rparen.doc", regex: "}|(?=$)", next: "pop" },
                  ],
                },
                {
                  token: [
                    "rparen.doc",
                    "text.doc",
                    "variable.parameter.doc",
                    "lparen.doc",
                    "variable.parameter.doc",
                    "rparen.doc",
                  ],
                  regex: /(})(\s*)(?:([\w=:\/\.]+)|(?:(\[)([\w=:\/\.]+)(\])))/,
                  next: "pop",
                },
                { token: "rparen.doc", regex: "}|(?=$)", next: "pop" },
                { include: "doc-syntax" },
                { defaultToken: "text.doc" },
              ],
            },
            {
              token: ["comment.doc.tag", "text.doc", "lparen.doc"],
              regex:
                "(@(?:returns?|yields|type|this|suppress|public|protected|private|package|modifies|implements|external|exception|throws|enum|define|extends))(\\s*)({)",
              push: [
                {
                  token: "lparen.doc",
                  regex: "{",
                  push: [
                    { include: "doc-syntax" },
                    { token: "rparen.doc", regex: "}|(?=$)", next: "pop" },
                  ],
                },
                { token: "rparen.doc", regex: "}|(?=$)", next: "pop" },
                { include: "doc-syntax" },
                { defaultToken: "text.doc" },
              ],
            },
            {
              token: ["comment.doc.tag", "text.doc", "variable.parameter.doc"],
              regex:
                '(@(?:alias|memberof|instance|module|name|lends|namespace|external|this|template|requires|param|implements|function|extends|typedef|mixes|constructor|var|memberof\\!|event|listens|exports|class|constructs|interface|emits|fires|throws|const|callback|borrows|augments))(\\s+)(\\w[\\w#.:/~"\\-]*)?',
            },
            {
              token: ["comment.doc.tag", "text.doc", "variable.parameter.doc"],
              regex: "(@method)(\\s+)(\\w[\\w.\\(\\)]*)",
            },
            {
              token: "comment.doc.tag",
              regex: "@access\\s+(?:private|public|protected)",
            },
            {
              token: "comment.doc.tag",
              regex:
                "@kind\\s+(?:class|constant|event|external|file|function|member|mixin|module|namespace|typedef)",
            },
            { token: "comment.doc.tag", regex: "@\\w+(?=\\s|$)" },
            e.getTagRule(),
            { defaultToken: "comment.doc", caseInsensitive: !0 },
          ],
          "doc-syntax": [
            { token: "operator.doc", regex: /[|:]/ },
            { token: "paren.doc", regex: /[\[\]]/ },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(a, o),
      (a.getTagRule = function (e) {
        return {
          token: "comment.doc.tag.storage.type",
          regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
        };
      }),
      (a.getStartRule = function (e) {
        return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
      }),
      (a.getEndRule = function (e) {
        return { token: "comment.doc", regex: "\\*\\/", next: e };
      }),
      (t.JsDocCommentHighlightRules = a);
  }
),
  ace.define(
    "ace/mode/javascript_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/jsdoc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./jsdoc_comment_highlight_rules").JsDocCommentHighlightRules,
        a = e("./text_highlight_rules").TextHighlightRules,
        i = "[a-zA-Z\\$_\xa1-\uffff][a-zA-Z\\d\\$_\xa1-\uffff]*",
        s = function (e) {
          var t = this.createKeywordMapper(
              {
                "variable.language":
                  "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Symbol|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",
                keyword:
                  "const|yield|import|get|set|async|await|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static|constructor",
                "storage.type": "const|let|var|function",
                "constant.language": "null|Infinity|NaN|undefined",
                "support.function": "alert",
                "constant.language.boolean": "true|false",
              },
              "identifier"
            ),
            n =
              "\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u{[0-9a-fA-F]{1,6}}|[0-2][0-7]{0,2}|3[0-7][0-7]?|[4-7][0-7]?|.)";
          (this.$rules = {
            no_regex: [
              o.getStartRule("doc-start"),
              l("no_regex"),
              { token: "string", regex: "'(?=.)", next: "qstring" },
              { token: "string", regex: '"(?=.)', next: "qqstring" },
              {
                token: "constant.numeric",
                regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/,
              },
              {
                token: "constant.numeric",
                regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/,
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "support.function",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                ],
                regex: "(" + i + ")(\\.)(prototype)(\\.)(" + i + ")(\\s*)(=)",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex:
                  "(" +
                  i +
                  ")(\\.)(" +
                  i +
                  ")(\\s*)(=)(\\s*)(function\\*?)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex: "(" + i + ")(\\s*)(=)(\\s*)(function\\*?)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "entity.name.function",
                  "text",
                  "paren.lparen",
                ],
                regex:
                  "(" +
                  i +
                  ")(\\.)(" +
                  i +
                  ")(\\s*)(=)(\\s*)(function\\*?)(\\s+)(\\w+)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "text",
                  "entity.name.function",
                  "text",
                  "paren.lparen",
                ],
                regex: "(function\\*?)(\\s+)(" + i + ")(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "entity.name.function",
                  "text",
                  "punctuation.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex: "(" + i + ")(\\s*)(:)(\\s*)(function\\*?)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: ["text", "text", "storage.type", "text", "paren.lparen"],
                regex: "(:)(\\s*)(function\\*?)(\\s*)(\\()",
                next: "function_arguments",
              },
              { token: "keyword", regex: "from(?=\\s*('|\"))" },
              {
                token: "keyword",
                regex:
                  "(?:case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void)\\b",
                next: "start",
              },
              { token: "support.constant", regex: /that\b/ },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "support.function.firebug",
                ],
                regex:
                  /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/,
              },
              { token: t, regex: i },
              {
                token: "punctuation.operator",
                regex: /[.](?![.])/,
                next: "property",
              },
              { token: "storage.type", regex: /=>/, next: "start" },
              {
                token: "keyword.operator",
                regex:
                  /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
                next: "start",
              },
              {
                token: "punctuation.operator",
                regex: /[?:,;.]/,
                next: "start",
              },
              { token: "paren.lparen", regex: /[\[({]/, next: "start" },
              { token: "paren.rparen", regex: /[\])}]/ },
              { token: "comment", regex: /^#!.*$/ },
            ],
            property: [
              { token: "text", regex: "\\s+" },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "entity.name.function",
                  "text",
                  "paren.lparen",
                ],
                regex:
                  "(" +
                  i +
                  ")(\\.)(" +
                  i +
                  ")(\\s*)(=)(\\s*)(function\\*?)(?:(\\s+)(\\w+))?(\\s*)(\\()",
                next: "function_arguments",
              },
              { token: "punctuation.operator", regex: /[.](?![.])/ },
              {
                token: "support.function",
                regex:
                  /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|lter|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward|rEach)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/,
              },
              {
                token: "support.function.dom",
                regex:
                  /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/,
              },
              {
                token: "support.constant",
                regex:
                  /(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/,
              },
              { token: "identifier", regex: i },
              { regex: "", token: "empty", next: "no_regex" },
            ],
            start: [
              o.getStartRule("doc-start"),
              l("start"),
              { token: "string.regexp", regex: "\\/", next: "regex" },
              { token: "text", regex: "\\s+|^$", next: "start" },
              { token: "empty", regex: "", next: "no_regex" },
            ],
            regex: [
              {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
              },
              {
                token: "string.regexp",
                regex: "/[sxngimy]*",
                next: "no_regex",
              },
              {
                token: "invalid",
                regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/,
              },
              {
                token: "constant.language.escape",
                regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/,
              },
              { token: "constant.language.delimiter", regex: /\|/ },
              {
                token: "constant.language.escape",
                regex: /\[\^?/,
                next: "regex_character_class",
              },
              { token: "empty", regex: "$", next: "no_regex" },
              { defaultToken: "string.regexp" },
            ],
            regex_character_class: [
              {
                token: "regexp.charclass.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
              },
              { token: "constant.language.escape", regex: "]", next: "regex" },
              { token: "constant.language.escape", regex: "-" },
              { token: "empty", regex: "$", next: "no_regex" },
              { defaultToken: "string.regexp.charachterclass" },
            ],
            default_parameter: [
              {
                token: "string",
                regex: "'(?=.)",
                push: [
                  { token: "string", regex: "'|$", next: "pop" },
                  { include: "qstring" },
                ],
              },
              {
                token: "string",
                regex: '"(?=.)',
                push: [
                  { token: "string", regex: '"|$', next: "pop" },
                  { include: "qqstring" },
                ],
              },
              {
                token: "constant.language",
                regex: "null|Infinity|NaN|undefined",
              },
              {
                token: "constant.numeric",
                regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/,
              },
              {
                token: "constant.numeric",
                regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/,
              },
              {
                token: "punctuation.operator",
                regex: ",",
                next: "function_arguments",
              },
              { token: "text", regex: "\\s+" },
              { token: "punctuation.operator", regex: "$" },
              { token: "empty", regex: "", next: "no_regex" },
            ],
            function_arguments: [
              l("function_arguments"),
              { token: "variable.parameter", regex: i },
              { token: "punctuation.operator", regex: "," },
              { token: "text", regex: "\\s+" },
              { token: "punctuation.operator", regex: "$" },
              { token: "empty", regex: "", next: "no_regex" },
            ],
            qqstring: [
              { token: "constant.language.escape", regex: n },
              { token: "string", regex: "\\\\$", consumeLineEnd: !0 },
              { token: "string", regex: '"|$', next: "no_regex" },
              { defaultToken: "string" },
            ],
            qstring: [
              { token: "constant.language.escape", regex: n },
              { token: "string", regex: "\\\\$", consumeLineEnd: !0 },
              { token: "string", regex: "'|$", next: "no_regex" },
              { defaultToken: "string" },
            ],
          }),
            (e && e.noES6) ||
              (this.$rules.no_regex.unshift(
                {
                  regex: "[{}]",
                  onMatch: function (e, t, n) {
                    if (
                      ((this.next = "{" == e ? this.nextState : ""),
                      "{" == e && n.length)
                    )
                      n.unshift("start", t);
                    else if (
                      "}" == e &&
                      n.length &&
                      (n.shift(),
                      (this.next = n.shift()),
                      -1 != this.next.indexOf("string") ||
                        -1 != this.next.indexOf("jsx"))
                    )
                      return "paren.quasi.end";
                    return "{" == e ? "paren.lparen" : "paren.rparen";
                  },
                  nextState: "start",
                },
                {
                  token: "string.quasi.start",
                  regex: /`/,
                  push: [
                    { token: "constant.language.escape", regex: n },
                    { token: "paren.quasi.start", regex: /\${/, push: "start" },
                    { token: "string.quasi.end", regex: /`/, next: "pop" },
                    { defaultToken: "string.quasi" },
                  ],
                },
                {
                  token: ["variable.parameter", "text"],
                  regex: "(" + i + ")(\\s*)(?=\\=>)",
                },
                {
                  token: "paren.lparen",
                  regex: "(\\()(?=.+\\s*=>)",
                  next: "function_arguments",
                },
                {
                  token: "variable.language",
                  regex: "(?:(?:(?:Weak)?(?:Set|Map))|Promise)\\b",
                }
              ),
              this.$rules.function_arguments.unshift(
                {
                  token: "keyword.operator",
                  regex: "=",
                  next: "default_parameter",
                },
                { token: "keyword.operator", regex: "\\.{3}" }
              ),
              this.$rules.property.unshift(
                {
                  token: "support.function",
                  regex:
                    "(findIndex|repeat|startsWith|endsWith|includes|isSafeInteger|trunc|cbrt|log2|log10|sign|then|catch|finally|resolve|reject|race|any|all|allSettled|keys|entries|isInteger)\\b(?=\\()",
                },
                {
                  token: "constant.language",
                  regex: "(?:MAX_SAFE_INTEGER|MIN_SAFE_INTEGER|EPSILON)\\b",
                }
              ),
              (e && 0 == e.jsx) || c.call(this)),
            this.embedRules(o, "doc-", [o.getEndRule("no_regex")]),
            this.normalizeRules();
        };
      function c() {
        var e = i.replace("\\d", "\\d\\-"),
          t = {
            onMatch: function (e, t, n) {
              var r = "/" == e.charAt(1) ? 2 : 1;
              return (
                1 == r
                  ? (t != this.nextState
                      ? n.unshift(this.next, this.nextState, 0)
                      : n.unshift(this.next),
                    n[2]++)
                  : 2 == r &&
                    t == this.nextState &&
                    (n[1]--, (!n[1] || n[1] < 0) && (n.shift(), n.shift())),
                [
                  {
                    type:
                      "meta.tag.punctuation." +
                      (1 == r ? "" : "end-") +
                      "tag-open.xml",
                    value: e.slice(0, r),
                  },
                  { type: "meta.tag.tag-name.xml", value: e.substr(r) },
                ]
              );
            },
            regex: "</?" + e,
            next: "jsxAttributes",
            nextState: "jsx",
          };
        this.$rules.start.unshift(t);
        var n = { regex: "{", token: "paren.quasi.start", push: "start" };
        (this.$rules.jsx = [
          n,
          t,
          { include: "reference" },
          { defaultToken: "string" },
        ]),
          (this.$rules.jsxAttributes = [
            {
              token: "meta.tag.punctuation.tag-close.xml",
              regex: "/?>",
              onMatch: function (e, t, n) {
                return (
                  t == n[0] && n.shift(),
                  2 == e.length &&
                    (n[0] == this.nextState && n[1]--,
                    (!n[1] || n[1] < 0) && n.splice(0, 2)),
                  (this.next = n[0] || "start"),
                  [{ type: this.token, value: e }]
                );
              },
              nextState: "jsx",
            },
            n,
            l("jsxAttributes"),
            { token: "entity.other.attribute-name.xml", regex: e },
            { token: "keyword.operator.attribute-equals.xml", regex: "=" },
            { token: "text.tag-whitespace.xml", regex: "\\s+" },
            {
              token: "string.attribute-value.xml",
              regex: "'",
              stateName: "jsx_attr_q",
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: "'",
                  next: "pop",
                },
                { include: "reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
            {
              token: "string.attribute-value.xml",
              regex: '"',
              stateName: "jsx_attr_qq",
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: '"',
                  next: "pop",
                },
                { include: "reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
            t,
          ]),
          (this.$rules.reference = [
            {
              token: "constant.language.escape.reference.xml",
              regex:
                "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
            },
          ]);
      }
      function l(e) {
        return [
          {
            token: "comment",
            regex: /\/\*/,
            next: [
              o.getTagRule(),
              { token: "comment", regex: "\\*\\/", next: e || "pop" },
              { defaultToken: "comment", caseInsensitive: !0 },
            ],
          },
          {
            token: "comment",
            regex: "\\/\\/",
            next: [
              o.getTagRule(),
              { token: "comment", regex: "$|^", next: e || "pop" },
              { defaultToken: "comment", caseInsensitive: !0 },
            ],
          },
        ];
      }
      r.inherits(s, a), (t.JavaScriptHighlightRules = s);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var r = e("../range").Range,
        o = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var o = n[1].length,
              a = e.findMatchingBracket({ row: t, column: o });
            if (!a || a.row == t) return 0;
            var i = this.$getIndent(e.getLine(a.row));
            e.replace(new r(t, 0, t, o - 1), i);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(o.prototype),
        (t.MatchingBraceOutdent = o);
    }
  ),
  ace.define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        o = e("../../range").Range,
        a = e("./fold_mode").FoldMode,
        i = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(i, a),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var o = this._getFoldWidgetBase(e, t, n);
              return !o && this.startRegionRe.test(r) ? "start" : o;
            }),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var o,
                a = e.getLine(n);
              if (this.startRegionRe.test(a))
                return this.getCommentRegionBlock(e, a, n);
              if ((o = a.match(this.foldingStartMarker))) {
                var i = o.index;
                if (o[1]) return this.openingBracketBlock(e, o[1], n, i);
                var s = e.getCommentFoldRange(n, i + o[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (r
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (o = a.match(this.foldingStopMarker))) {
                i = o.index + o[0].length;
                return o[1]
                  ? this.closingBracketBlock(e, o[1], n, i)
                  : e.getCommentFoldRange(n, i, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  r = n.search(/\S/),
                  a = t,
                  i = n.length,
                  s = (t += 1),
                  c = e.getLength();
                ++t < c;

              ) {
                var l = (n = e.getLine(t)).search(/\S/);
                if (-1 !== l) {
                  if (r > l) break;
                  var g = this.getFoldWidgetRange(e, "all", t);
                  if (g) {
                    if (g.start.row <= a) break;
                    if (g.isMultiLine()) t = g.end.row;
                    else if (r == l) break;
                  }
                  s = t;
                }
              }
              return new o(a, i, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var r = t.search(/\s*$/),
                  a = e.getLength(),
                  i = n,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  c = 1;
                ++n < a;

              ) {
                t = e.getLine(n);
                var l = s.exec(t);
                if (l && (l[1] ? c-- : c++, !c)) break;
              }
              if (n > i) return new o(i, r, n, t.length);
            });
        }.call(i.prototype);
    }
  ),
  ace.define(
    "ace/mode/javascript",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/javascript_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/worker/worker_client",
      "ace/mode/behaviour/cstyle",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./text").Mode,
        a = e("./javascript_highlight_rules").JavaScriptHighlightRules,
        i = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("../worker/worker_client").WorkerClient,
        c = e("./behaviour/cstyle").CstyleBehaviour,
        l = e("./folding/cstyle").FoldMode,
        g = function () {
          (this.HighlightRules = a),
            (this.$outdent = new i()),
            (this.$behaviour = new c()),
            (this.foldingRules = new l());
        };
      r.inherits(g, o),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$quotes = { '"': '"', "'": "'", "`": "`" }),
            (this.$pairQuotesAfter = { "`": /\w/ }),
            (this.getNextLineIndent = function (e, t, n) {
              var r = this.$getIndent(t),
                o = this.getTokenizer().getLineTokens(t, e),
                a = o.tokens,
                i = o.state;
              if (a.length && "comment" == a[a.length - 1].type) return r;
              if ("start" == e || "no_regex" == e)
                (s = t.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/)) && (r += n);
              else if ("doc-start" == e) {
                if ("start" == i || "no_regex" == i) return "";
                var s;
                (s = t.match(/^\s*(\/?)\*/)) &&
                  (s[1] && (r += " "), (r += "* "));
              }
              return r;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.createWorker = function (e) {
              var t = new s(
                ["ace"],
                "ace/mode/javascript_worker",
                "JavaScriptWorker"
              );
              return (
                t.attachToDocument(e.getDocument()),
                t.on("annotate", function (t) {
                  e.setAnnotations(t.data);
                }),
                t.on("terminate", function () {
                  e.clearAnnotations();
                }),
                t
              );
            }),
            (this.$id = "ace/mode/javascript"),
            (this.snippetFileId = "ace/snippets/javascript");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.define(
    "ace/mode/doc_comment_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./text_highlight_rules").TextHighlightRules,
        a = function e() {
          this.$rules = {
            start: [
              { token: "comment.doc.tag", regex: "@\\w+(?=\\s|$)" },
              e.getTagRule(),
              { defaultToken: "comment.doc", caseInsensitive: !0 },
            ],
          };
        };
      r.inherits(a, o),
        (a.getTagRule = function (e) {
          return {
            token: "comment.doc.tag.storage.type",
            regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
          };
        }),
        (a.getStartRule = function (e) {
          return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
        }),
        (a.getEndRule = function (e) {
          return { token: "comment.doc", regex: "\\*\\/", next: e };
        }),
        (t.DocCommentHighlightRules = a);
    }
  ),
  ace.define(
    "ace/mode/scala_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        a = e("./text_highlight_rules").TextHighlightRules,
        i = function () {
          var e = this.createKeywordMapper(
            {
              "variable.language": "this",
              keyword:
                "case|default|do|else|for|if|match|while|throw|return|try|trye|catch|finally|yield|abstract|class|def|extends|final|forSome|implicit|implicits|import|lazy|new|object|null|override|package|private|protected|sealed|super|this|trait|type|val|var|with|assert|assume|require|print|println|printf|readLine|readBoolean|readByte|readShort|readChar|readInt|readLong|readFloat|readDouble",
              "support.function":
                "AbstractMethodError|AssertionError|ClassCircularityError|ClassFormatError|Deprecated|EnumConstantNotPresentException|ExceptionInInitializerError|IllegalAccessError|IllegalThreadStateException|InstantiationError|InternalError|NegativeArraySizeException|NoSuchFieldError|Override|Process|ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|SuppressWarnings|TypeNotPresentException|UnknownError|UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|InstantiationException|IndexOutOfBoundsException|ArrayIndexOutOfBoundsException|CloneNotSupportedException|NoSuchFieldException|IllegalArgumentException|NumberFormatException|SecurityException|Void|InheritableThreadLocal|IllegalStateException|InterruptedException|NoSuchMethodException|IllegalAccessException|UnsupportedOperationException|Enum|StrictMath|Package|Compiler|Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|Character|Boolean|StackTraceElement|Appendable|StringBuffer|Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|StackOverflowError|OutOfMemoryError|VirtualMachineError|ArrayStoreException|ClassCastException|LinkageError|NoClassDefFoundError|ClassNotFoundException|RuntimeException|Exception|ThreadDeath|Error|Throwable|System|ClassLoader|Cloneable|Class|CharSequence|Comparable|String|Object|Unit|Any|AnyVal|AnyRef|Null|ScalaObject|Singleton|Seq|Iterable|List|Option|Array|Char|Byte|Int|Long|Nothing|App|Application|BufferedIterator|BigDecimal|BigInt|Console|Either|Enumeration|Equiv|Fractional|Function|IndexedSeq|Integral|Iterator|Map|Numeric|Nil|NotNull|Ordered|Ordering|PartialFunction|PartialOrdering|Product|Proxy|Range|Responder|Seq|Serializable|Set|Specializable|Stream|StringContext|Symbol|Traversable|TraversableOnce|Tuple|Vector|Pair|Triple",
              "constant.language": "true|false",
            },
            "identifier"
          );
          (this.$rules = {
            start: [
              { token: "comment", regex: "\\/\\/.*$" },
              o.getStartRule("doc-start"),
              { token: "comment", regex: "\\/\\*", next: "comment" },
              {
                token: "string.regexp",
                regex:
                  "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)",
              },
              { token: "string", regex: '"""', next: "tstring" },
              { token: "string", regex: '"(?=.)', next: "string" },
              { token: "symbol.constant", regex: "'[\\w\\d_]+" },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b",
              },
              { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)",
              },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: "\\*\\/", next: "start" },
              { defaultToken: "comment" },
            ],
            string: [
              { token: "escape", regex: '\\\\"' },
              { token: "string", regex: '"', next: "start" },
              { token: "string.invalid", regex: '[^"\\\\]*$', next: "start" },
              { token: "string", regex: '[^"\\\\]+' },
            ],
            tstring: [
              { token: "string", regex: '"{3,5}', next: "start" },
              { defaultToken: "string" },
            ],
          }),
            this.embedRules(o, "doc-", [o.getEndRule("start")]);
        };
      r.inherits(i, a), (t.ScalaHighlightRules = i);
    }
  ),
  ace.define(
    "ace/mode/scala",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/javascript",
      "ace/mode/scala_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        o = e("./javascript").Mode,
        a = e("./scala_highlight_rules").ScalaHighlightRules,
        i = function () {
          o.call(this), (this.HighlightRules = a);
        };
      r.inherits(i, o),
        function () {
          (this.createWorker = function (e) {
            return null;
          }),
            (this.$id = "ace/mode/scala");
        }.call(i.prototype),
        (t.Mode = i);
    }
  ),
  ace.require(["ace/mode/scala"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
