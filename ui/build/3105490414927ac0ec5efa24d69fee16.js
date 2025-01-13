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
    var o = e("../lib/oop"),
      r = e("./text_highlight_rules").TextHighlightRules,
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
    o.inherits(a, r),
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
      var o = e("../lib/oop"),
        r = e("./jsdoc_comment_highlight_rules").JsDocCommentHighlightRules,
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
              r.getStartRule("doc-start"),
              c("no_regex"),
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
              r.getStartRule("doc-start"),
              c("start"),
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
              c("function_arguments"),
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
              (e && 0 == e.jsx) || l.call(this)),
            this.embedRules(r, "doc-", [r.getEndRule("no_regex")]),
            this.normalizeRules();
        };
      function l() {
        var e = i.replace("\\d", "\\d\\-"),
          t = {
            onMatch: function (e, t, n) {
              var o = "/" == e.charAt(1) ? 2 : 1;
              return (
                1 == o
                  ? (t != this.nextState
                      ? n.unshift(this.next, this.nextState, 0)
                      : n.unshift(this.next),
                    n[2]++)
                  : 2 == o &&
                    t == this.nextState &&
                    (n[1]--, (!n[1] || n[1] < 0) && (n.shift(), n.shift())),
                [
                  {
                    type:
                      "meta.tag.punctuation." +
                      (1 == o ? "" : "end-") +
                      "tag-open.xml",
                    value: e.slice(0, o),
                  },
                  { type: "meta.tag.tag-name.xml", value: e.substr(o) },
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
            c("jsxAttributes"),
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
      function c(e) {
        return [
          {
            token: "comment",
            regex: /\/\*/,
            next: [
              r.getTagRule(),
              { token: "comment", regex: "\\*\\/", next: e || "pop" },
              { defaultToken: "comment", caseInsensitive: !0 },
            ],
          },
          {
            token: "comment",
            regex: "\\/\\/",
            next: [
              r.getTagRule(),
              { token: "comment", regex: "$|^", next: e || "pop" },
              { defaultToken: "comment", caseInsensitive: !0 },
            ],
          },
        ];
      }
      o.inherits(s, a), (t.JavaScriptHighlightRules = s);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      "use strict";
      var o = e("../range").Range,
        r = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return !!/^\s+$/.test(e) && /^\s*\}/.test(t);
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t).match(/^(\s*\})/);
            if (!n) return 0;
            var r = n[1].length,
              a = e.findMatchingBracket({ row: t, column: r });
            if (!a || a.row == t) return 0;
            var i = this.$getIndent(e.getLine(a.row));
            e.replace(new o(t, 0, t, r - 1), i);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }).call(r.prototype),
        (t.MatchingBraceOutdent = r);
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
      var o = e("../../lib/oop"),
        r = e("../../range").Range,
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
      o.inherits(i, a),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var o = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(o) &&
                !this.startRegionRe.test(o) &&
                !this.tripleStarBlockCommentRe.test(o)
              )
                return "";
              var r = this._getFoldWidgetBase(e, t, n);
              return !r && this.startRegionRe.test(o) ? "start" : r;
            }),
            (this.getFoldWidgetRange = function (e, t, n, o) {
              var r,
                a = e.getLine(n);
              if (this.startRegionRe.test(a))
                return this.getCommentRegionBlock(e, a, n);
              if ((r = a.match(this.foldingStartMarker))) {
                var i = r.index;
                if (r[1]) return this.openingBracketBlock(e, r[1], n, i);
                var s = e.getCommentFoldRange(n, i + r[0].length, 1);
                return (
                  s &&
                    !s.isMultiLine() &&
                    (o
                      ? (s = this.getSectionRange(e, n))
                      : "all" != t && (s = null)),
                  s
                );
              }
              if ("markbegin" !== t && (r = a.match(this.foldingStopMarker))) {
                i = r.index + r[0].length;
                return r[1]
                  ? this.closingBracketBlock(e, r[1], n, i)
                  : e.getCommentFoldRange(n, i, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              for (
                var n = e.getLine(t),
                  o = n.search(/\S/),
                  a = t,
                  i = n.length,
                  s = (t += 1),
                  l = e.getLength();
                ++t < l;

              ) {
                var c = (n = e.getLine(t)).search(/\S/);
                if (-1 !== c) {
                  if (o > c) break;
                  var u = this.getFoldWidgetRange(e, "all", t);
                  if (u) {
                    if (u.start.row <= a) break;
                    if (u.isMultiLine()) t = u.end.row;
                    else if (o == c) break;
                  }
                  s = t;
                }
              }
              return new r(a, i, s, e.getLine(s).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              for (
                var o = t.search(/\s*$/),
                  a = e.getLength(),
                  i = n,
                  s = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                  l = 1;
                ++n < a;

              ) {
                t = e.getLine(n);
                var c = s.exec(t);
                if (c && (c[1] ? l-- : l++, !l)) break;
              }
              if (n > i) return new r(i, o, n, t.length);
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
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        a = e("./javascript_highlight_rules").JavaScriptHighlightRules,
        i = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("../worker/worker_client").WorkerClient,
        l = e("./behaviour/cstyle").CstyleBehaviour,
        c = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = a),
            (this.$outdent = new i()),
            (this.$behaviour = new l()),
            (this.foldingRules = new c());
        };
      o.inherits(u, r),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$quotes = { '"': '"', "'": "'", "`": "`" }),
            (this.$pairQuotesAfter = { "`": /\w/ }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                r = this.getTokenizer().getLineTokens(t, e),
                a = r.tokens,
                i = r.state;
              if (a.length && "comment" == a[a.length - 1].type) return o;
              if ("start" == e || "no_regex" == e)
                (s = t.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/)) && (o += n);
              else if ("doc-start" == e) {
                if ("start" == i || "no_regex" == i) return "";
                var s;
                (s = t.match(/^\s*(\/?)\*/)) &&
                  (s[1] && (o += " "), (o += "* "));
              }
              return o;
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
        }.call(u.prototype),
        (t.Mode = u);
    }
  ),
  ace.define(
    "ace/mode/css_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = (e("../lib/lang"), e("./text_highlight_rules").TextHighlightRules),
        a = (t.supportType =
          "align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|hanging-punctuation|height|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left|margin-right|margin-top|max-height|max-width|max-zoom|min-height|min-width|min-zoom|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|order|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-x|overflow-y|padding|padding-bottom|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|perspective|perspective-origin|position|quotes|resize|right|tab-size|table-layout|text-align|text-align-last|text-decoration|text-decoration-color|text-decoration-line|text-decoration-style|text-indent|text-justify|text-overflow|text-shadow|text-transform|top|transform|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|unicode-bidi|user-select|user-zoom|vertical-align|visibility|white-space|width|word-break|word-spacing|word-wrap|z-index"),
        i = (t.supportFunction = "rgb|rgba|url|attr|counter|counters"),
        s = (t.supportConstant =
          "absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|flex-end|flex-start|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero|zoom"),
        l = (t.supportConstantColor =
          "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen"),
        c = (t.supportConstantFonts =
          "arial|century|comic|courier|cursive|fantasy|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace"),
        u = (t.numRe = "\\-?(?:(?:[0-9]+(?:\\.[0-9]+)?)|(?:\\.[0-9]+))"),
        g = (t.pseudoElements =
          "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b"),
        d = (t.pseudoClasses =
          "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b"),
        m = function () {
          var e = this.createKeywordMapper(
            {
              "support.function": i,
              "support.constant": s,
              "support.type": a,
              "support.constant.color": l,
              "support.constant.fonts": c,
            },
            "text",
            !0
          );
          (this.$rules = {
            start: [
              { include: ["strings", "url", "comments"] },
              { token: "paren.lparen", regex: "\\{", next: "ruleset" },
              { token: "paren.rparen", regex: "\\}" },
              { token: "string", regex: "@(?!viewport)", next: "media" },
              { token: "keyword", regex: "#[a-z0-9-_]+" },
              { token: "keyword", regex: "%" },
              { token: "variable", regex: "\\.[a-z0-9-_]+" },
              { token: "string", regex: ":[a-z0-9-_]+" },
              { token: "constant.numeric", regex: u },
              { token: "constant", regex: "[a-z0-9-_]+" },
              { caseInsensitive: !0 },
            ],
            media: [
              { include: ["strings", "url", "comments"] },
              { token: "paren.lparen", regex: "\\{", next: "start" },
              { token: "paren.rparen", regex: "\\}", next: "start" },
              { token: "string", regex: ";", next: "start" },
              {
                token: "keyword",
                regex:
                  "(?:media|supports|document|charset|import|namespace|media|supports|document|page|font|keyframes|viewport|counter-style|font-feature-values|swash|ornaments|annotation|stylistic|styleset|character-variant)",
              },
            ],
            comments: [
              {
                token: "comment",
                regex: "\\/\\*",
                push: [
                  { token: "comment", regex: "\\*\\/", next: "pop" },
                  { defaultToken: "comment" },
                ],
              },
            ],
            ruleset: [
              { regex: "-(webkit|ms|moz|o)-", token: "text" },
              { token: "punctuation.operator", regex: "[:;]" },
              { token: "paren.rparen", regex: "\\}", next: "start" },
              { include: ["strings", "url", "comments"] },
              {
                token: ["constant.numeric", "keyword"],
                regex:
                  "(" +
                  u +
                  ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vmax|vmin|vm|vw|%)",
              },
              { token: "constant.numeric", regex: u },
              { token: "constant.numeric", regex: "#[a-f0-9]{6}" },
              { token: "constant.numeric", regex: "#[a-f0-9]{3}" },
              {
                token: [
                  "punctuation",
                  "entity.other.attribute-name.pseudo-element.css",
                ],
                regex: g,
              },
              {
                token: [
                  "punctuation",
                  "entity.other.attribute-name.pseudo-class.css",
                ],
                regex: d,
              },
              { include: "url" },
              { token: e, regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*" },
              { caseInsensitive: !0 },
            ],
            url: [
              {
                token: "support.function",
                regex: "(?:url(:?-prefix)?|domain|regexp)\\(",
                push: [
                  { token: "support.function", regex: "\\)", next: "pop" },
                  { defaultToken: "string" },
                ],
              },
            ],
            strings: [
              {
                token: "string.start",
                regex: "'",
                push: [
                  { token: "string.end", regex: "'|$", next: "pop" },
                  { include: "escapes" },
                  {
                    token: "constant.language.escape",
                    regex: /\\$/,
                    consumeLineEnd: !0,
                  },
                  { defaultToken: "string" },
                ],
              },
              {
                token: "string.start",
                regex: '"',
                push: [
                  { token: "string.end", regex: '"|$', next: "pop" },
                  { include: "escapes" },
                  {
                    token: "constant.language.escape",
                    regex: /\\$/,
                    consumeLineEnd: !0,
                  },
                  { defaultToken: "string" },
                ],
              },
            ],
            escapes: [
              {
                token: "constant.language.escape",
                regex: /\\([a-fA-F\d]{1,6}|[^a-fA-F\d])/,
              },
            ],
          }),
            this.normalizeRules();
        };
      o.inherits(m, r), (t.CssHighlightRules = m);
    }
  ),
  ace.define(
    "ace/mode/css_completions",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      var o = {
          background: { "#$0": 1 },
          "background-color": { "#$0": 1, transparent: 1, fixed: 1 },
          "background-image": { "url('/$0')": 1 },
          "background-repeat": {
            repeat: 1,
            "repeat-x": 1,
            "repeat-y": 1,
            "no-repeat": 1,
            inherit: 1,
          },
          "background-position": {
            bottom: 2,
            center: 2,
            left: 2,
            right: 2,
            top: 2,
            inherit: 2,
          },
          "background-attachment": { scroll: 1, fixed: 1 },
          "background-size": { cover: 1, contain: 1 },
          "background-clip": {
            "border-box": 1,
            "padding-box": 1,
            "content-box": 1,
          },
          "background-origin": {
            "border-box": 1,
            "padding-box": 1,
            "content-box": 1,
          },
          border: { "solid $0": 1, "dashed $0": 1, "dotted $0": 1, "#$0": 1 },
          "border-color": { "#$0": 1 },
          "border-style": {
            solid: 2,
            dashed: 2,
            dotted: 2,
            double: 2,
            groove: 2,
            hidden: 2,
            inherit: 2,
            inset: 2,
            none: 2,
            outset: 2,
            ridged: 2,
          },
          "border-collapse": { collapse: 1, separate: 1 },
          bottom: { px: 1, em: 1, "%": 1 },
          clear: { left: 1, right: 1, both: 1, none: 1 },
          color: { "#$0": 1, "rgb(#$00,0,0)": 1 },
          cursor: {
            default: 1,
            pointer: 1,
            move: 1,
            text: 1,
            wait: 1,
            help: 1,
            progress: 1,
            "n-resize": 1,
            "ne-resize": 1,
            "e-resize": 1,
            "se-resize": 1,
            "s-resize": 1,
            "sw-resize": 1,
            "w-resize": 1,
            "nw-resize": 1,
          },
          display: {
            none: 1,
            block: 1,
            inline: 1,
            "inline-block": 1,
            "table-cell": 1,
          },
          "empty-cells": { show: 1, hide: 1 },
          float: { left: 1, right: 1, none: 1 },
          "font-family": {
            Arial: 2,
            "Comic Sans MS": 2,
            Consolas: 2,
            "Courier New": 2,
            Courier: 2,
            Georgia: 2,
            Monospace: 2,
            "Sans-Serif": 2,
            "Segoe UI": 2,
            Tahoma: 2,
            "Times New Roman": 2,
            "Trebuchet MS": 2,
            Verdana: 1,
          },
          "font-size": { px: 1, em: 1, "%": 1 },
          "font-weight": { bold: 1, normal: 1 },
          "font-style": { italic: 1, normal: 1 },
          "font-variant": { normal: 1, "small-caps": 1 },
          height: { px: 1, em: 1, "%": 1 },
          left: { px: 1, em: 1, "%": 1 },
          "letter-spacing": { normal: 1 },
          "line-height": { normal: 1 },
          "list-style-type": {
            none: 1,
            disc: 1,
            circle: 1,
            square: 1,
            decimal: 1,
            "decimal-leading-zero": 1,
            "lower-roman": 1,
            "upper-roman": 1,
            "lower-greek": 1,
            "lower-latin": 1,
            "upper-latin": 1,
            georgian: 1,
            "lower-alpha": 1,
            "upper-alpha": 1,
          },
          margin: { px: 1, em: 1, "%": 1 },
          "margin-right": { px: 1, em: 1, "%": 1 },
          "margin-left": { px: 1, em: 1, "%": 1 },
          "margin-top": { px: 1, em: 1, "%": 1 },
          "margin-bottom": { px: 1, em: 1, "%": 1 },
          "max-height": { px: 1, em: 1, "%": 1 },
          "max-width": { px: 1, em: 1, "%": 1 },
          "min-height": { px: 1, em: 1, "%": 1 },
          "min-width": { px: 1, em: 1, "%": 1 },
          overflow: { hidden: 1, visible: 1, auto: 1, scroll: 1 },
          "overflow-x": { hidden: 1, visible: 1, auto: 1, scroll: 1 },
          "overflow-y": { hidden: 1, visible: 1, auto: 1, scroll: 1 },
          padding: { px: 1, em: 1, "%": 1 },
          "padding-top": { px: 1, em: 1, "%": 1 },
          "padding-right": { px: 1, em: 1, "%": 1 },
          "padding-bottom": { px: 1, em: 1, "%": 1 },
          "padding-left": { px: 1, em: 1, "%": 1 },
          "page-break-after": {
            auto: 1,
            always: 1,
            avoid: 1,
            left: 1,
            right: 1,
          },
          "page-break-before": {
            auto: 1,
            always: 1,
            avoid: 1,
            left: 1,
            right: 1,
          },
          position: { absolute: 1, relative: 1, fixed: 1, static: 1 },
          right: { px: 1, em: 1, "%": 1 },
          "table-layout": { fixed: 1, auto: 1 },
          "text-decoration": {
            none: 1,
            underline: 1,
            "line-through": 1,
            blink: 1,
          },
          "text-align": { left: 1, right: 1, center: 1, justify: 1 },
          "text-transform": {
            capitalize: 1,
            uppercase: 1,
            lowercase: 1,
            none: 1,
          },
          top: { px: 1, em: 1, "%": 1 },
          "vertical-align": { top: 1, bottom: 1 },
          visibility: { hidden: 1, visible: 1 },
          "white-space": {
            nowrap: 1,
            normal: 1,
            pre: 1,
            "pre-line": 1,
            "pre-wrap": 1,
          },
          width: { px: 1, em: 1, "%": 1 },
          "word-spacing": { normal: 1 },
          filter: { "alpha(opacity=$0100)": 1 },
          "text-shadow": { "$02px 2px 2px #777": 1 },
          "text-overflow": { "ellipsis-word": 1, clip: 1, ellipsis: 1 },
          "-moz-border-radius": 1,
          "-moz-border-radius-topright": 1,
          "-moz-border-radius-bottomright": 1,
          "-moz-border-radius-topleft": 1,
          "-moz-border-radius-bottomleft": 1,
          "-webkit-border-radius": 1,
          "-webkit-border-top-right-radius": 1,
          "-webkit-border-top-left-radius": 1,
          "-webkit-border-bottom-right-radius": 1,
          "-webkit-border-bottom-left-radius": 1,
          "-moz-box-shadow": 1,
          "-webkit-box-shadow": 1,
          transform: { "rotate($00deg)": 1, "skew($00deg)": 1 },
          "-moz-transform": { "rotate($00deg)": 1, "skew($00deg)": 1 },
          "-webkit-transform": { "rotate($00deg)": 1, "skew($00deg)": 1 },
        },
        r = function () {};
      (function () {
        (this.completionsDefined = !1),
          (this.defineCompletions = function () {
            if (document) {
              var e = document.createElement("c").style;
              for (var t in e)
                if ("string" === typeof e[t]) {
                  var n = t.replace(/[A-Z]/g, function (e) {
                    return "-" + e.toLowerCase();
                  });
                  o.hasOwnProperty(n) || (o[n] = 1);
                }
            }
            this.completionsDefined = !0;
          }),
          (this.getCompletions = function (e, t, n, o) {
            if (
              (this.completionsDefined || this.defineCompletions(),
              "ruleset" === e || "ace/mode/scss" == t.$mode.$id)
            ) {
              var r = t.getLine(n.row).substr(0, n.column),
                a = /\([^)]*$/.test(r);
              return (
                a && (r = r.substr(r.lastIndexOf("(") + 1)),
                /:[^;]+$/.test(r)
                  ? (/([\w\-]+):[^:]*$/.test(r),
                    this.getPropertyValueCompletions(e, t, n, o))
                  : this.getPropertyCompletions(e, t, n, o, a)
              );
            }
            return [];
          }),
          (this.getPropertyCompletions = function (e, t, n, r, a) {
            return (
              (a = a || !1),
              Object.keys(o).map(function (e) {
                return {
                  caption: e,
                  snippet: e + ": $0" + (a ? "" : ";"),
                  meta: "property",
                  score: 1e6,
                };
              })
            );
          }),
          (this.getPropertyValueCompletions = function (e, t, n, r) {
            var a = t.getLine(n.row).substr(0, n.column),
              i = (/([\w\-]+):[^:]*$/.exec(a) || {})[1];
            if (!i) return [];
            var s = [];
            return (
              i in o && "object" === typeof o[i] && (s = Object.keys(o[i])),
              s.map(function (e) {
                return {
                  caption: e,
                  snippet: e,
                  meta: "property value",
                  score: 1e6,
                };
              })
            );
          });
      }).call(r.prototype),
        (t.CssCompletions = r);
    }
  ),
  ace.define(
    "ace/mode/behaviour/css",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/mode/behaviour/cstyle",
      "ace/token_iterator",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/oop"),
        r = (e("../behaviour").Behaviour, e("./cstyle").CstyleBehaviour),
        a = e("../../token_iterator").TokenIterator,
        i = function () {
          this.inherit(r),
            this.add("colon", "insertion", function (e, t, n, o, r) {
              if (":" === r && n.selection.isEmpty()) {
                var i = n.getCursorPosition(),
                  s = new a(o, i.row, i.column),
                  l = s.getCurrentToken();
                if (
                  (l && l.value.match(/\s+/) && (l = s.stepBackward()),
                  l && "support.type" === l.type)
                ) {
                  var c = o.doc.getLine(i.row);
                  if (":" === c.substring(i.column, i.column + 1))
                    return { text: "", selection: [1, 1] };
                  if (/^(\s+[^;]|\s*$)/.test(c.substring(i.column)))
                    return { text: ":;", selection: [1, 1] };
                }
              }
            }),
            this.add("colon", "deletion", function (e, t, n, o, r) {
              var i = o.doc.getTextRange(r);
              if (!r.isMultiLine() && ":" === i) {
                var s = n.getCursorPosition(),
                  l = new a(o, s.row, s.column),
                  c = l.getCurrentToken();
                if (
                  (c && c.value.match(/\s+/) && (c = l.stepBackward()),
                  c && "support.type" === c.type)
                )
                  if (
                    ";" ===
                    o.doc
                      .getLine(r.start.row)
                      .substring(r.end.column, r.end.column + 1)
                  )
                    return r.end.column++, r;
              }
            }),
            this.add("semicolon", "insertion", function (e, t, n, o, r) {
              if (";" === r && n.selection.isEmpty()) {
                var a = n.getCursorPosition();
                if (
                  ";" === o.doc.getLine(a.row).substring(a.column, a.column + 1)
                )
                  return { text: "", selection: [1, 1] };
              }
            }),
            this.add("!important", "insertion", function (e, t, n, o, r) {
              if ("!" === r && n.selection.isEmpty()) {
                var a = n.getCursorPosition(),
                  i = o.doc.getLine(a.row);
                if (/^\s*(;|}|$)/.test(i.substring(a.column)))
                  return { text: "!important", selection: [10, 10] };
              }
            });
        };
      o.inherits(i, r), (t.CssBehaviour = i);
    }
  ),
  ace.define(
    "ace/mode/css",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/css_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/worker/worker_client",
      "ace/mode/css_completions",
      "ace/mode/behaviour/css",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text").Mode,
        a = e("./css_highlight_rules").CssHighlightRules,
        i = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = e("../worker/worker_client").WorkerClient,
        l = e("./css_completions").CssCompletions,
        c = e("./behaviour/css").CssBehaviour,
        u = e("./folding/cstyle").FoldMode,
        g = function () {
          (this.HighlightRules = a),
            (this.$outdent = new i()),
            (this.$behaviour = new c()),
            (this.$completer = new l()),
            (this.foldingRules = new u());
        };
      o.inherits(g, r),
        function () {
          (this.foldingRules = "cStyle"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                r = this.getTokenizer().getLineTokens(t, e).tokens;
              return (
                (r.length && "comment" == r[r.length - 1].type) ||
                  (t.match(/^.*\{\s*$/) && (o += n)),
                o
              );
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.getCompletions = function (e, t, n, o) {
              return this.$completer.getCompletions(e, t, n, o);
            }),
            (this.createWorker = function (e) {
              var t = new s(["ace"], "ace/mode/css_worker", "Worker");
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
            (this.$id = "ace/mode/css"),
            (this.snippetFileId = "ace/snippets/css");
        }.call(g.prototype),
        (t.Mode = g);
    }
  ),
  ace.define(
    "ace/mode/xml_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./text_highlight_rules").TextHighlightRules,
        a = function e(t) {
          var n = "[_:a-zA-Z\xc0-\uffff][-_:.a-zA-Z0-9\xc0-\uffff]*";
          (this.$rules = {
            start: [
              {
                token: "string.cdata.xml",
                regex: "<\\!\\[CDATA\\[",
                next: "cdata",
              },
              {
                token: [
                  "punctuation.instruction.xml",
                  "keyword.instruction.xml",
                ],
                regex: "(<\\?)(" + n + ")",
                next: "processing_instruction",
              },
              { token: "comment.start.xml", regex: "<\\!--", next: "comment" },
              {
                token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
                regex: "(<\\!)(DOCTYPE)(?=[\\s])",
                next: "doctype",
                caseInsensitive: !0,
              },
              { include: "tag" },
              { token: "text.end-tag-open.xml", regex: "</" },
              { token: "text.tag-open.xml", regex: "<" },
              { include: "reference" },
              { defaultToken: "text.xml" },
            ],
            processing_instruction: [
              {
                token: "entity.other.attribute-name.decl-attribute-name.xml",
                regex: n,
              },
              {
                token: "keyword.operator.decl-attribute-equals.xml",
                regex: "=",
              },
              { include: "whitespace" },
              { include: "string" },
              {
                token: "punctuation.xml-decl.xml",
                regex: "\\?>",
                next: "start",
              },
            ],
            doctype: [
              { include: "whitespace" },
              { include: "string" },
              { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
              { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
              {
                token: "punctuation.int-subset",
                regex: "\\[",
                push: "int_subset",
              },
            ],
            int_subset: [
              { token: "text.xml", regex: "\\s+" },
              { token: "punctuation.int-subset.xml", regex: "]", next: "pop" },
              {
                token: [
                  "punctuation.markup-decl.xml",
                  "keyword.markup-decl.xml",
                ],
                regex: "(<\\!)(" + n + ")",
                push: [
                  { token: "text", regex: "\\s+" },
                  {
                    token: "punctuation.markup-decl.xml",
                    regex: ">",
                    next: "pop",
                  },
                  { include: "string" },
                ],
              },
            ],
            cdata: [
              { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
              { token: "text.xml", regex: "\\s+" },
              { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" },
            ],
            comment: [
              { token: "comment.end.xml", regex: "--\x3e", next: "start" },
              { defaultToken: "comment.xml" },
            ],
            reference: [
              {
                token: "constant.language.escape.reference.xml",
                regex:
                  "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
              },
            ],
            attr_reference: [
              {
                token: "constant.language.escape.reference.attribute-value.xml",
                regex:
                  "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
              },
            ],
            tag: [
              {
                token: [
                  "meta.tag.punctuation.tag-open.xml",
                  "meta.tag.punctuation.end-tag-open.xml",
                  "meta.tag.tag-name.xml",
                ],
                regex: "(?:(<)|(</))((?:" + n + ":)?" + n + ")",
                next: [
                  { include: "attributes" },
                  {
                    token: "meta.tag.punctuation.tag-close.xml",
                    regex: "/?>",
                    next: "start",
                  },
                ],
              },
            ],
            tag_whitespace: [
              { token: "text.tag-whitespace.xml", regex: "\\s+" },
            ],
            whitespace: [{ token: "text.whitespace.xml", regex: "\\s+" }],
            string: [
              {
                token: "string.xml",
                regex: "'",
                push: [
                  { token: "string.xml", regex: "'", next: "pop" },
                  { defaultToken: "string.xml" },
                ],
              },
              {
                token: "string.xml",
                regex: '"',
                push: [
                  { token: "string.xml", regex: '"', next: "pop" },
                  { defaultToken: "string.xml" },
                ],
              },
            ],
            attributes: [
              { token: "entity.other.attribute-name.xml", regex: n },
              { token: "keyword.operator.attribute-equals.xml", regex: "=" },
              { include: "tag_whitespace" },
              { include: "attribute_value" },
            ],
            attribute_value: [
              {
                token: "string.attribute-value.xml",
                regex: "'",
                push: [
                  {
                    token: "string.attribute-value.xml",
                    regex: "'",
                    next: "pop",
                  },
                  { include: "attr_reference" },
                  { defaultToken: "string.attribute-value.xml" },
                ],
              },
              {
                token: "string.attribute-value.xml",
                regex: '"',
                push: [
                  {
                    token: "string.attribute-value.xml",
                    regex: '"',
                    next: "pop",
                  },
                  { include: "attr_reference" },
                  { defaultToken: "string.attribute-value.xml" },
                ],
              },
            ],
          }),
            this.constructor === e && this.normalizeRules();
        };
      (function () {
        this.embedTagRules = function (e, t, n) {
          this.$rules.tag.unshift({
            token: [
              "meta.tag.punctuation.tag-open.xml",
              "meta.tag." + n + ".tag-name.xml",
            ],
            regex: "(<)(" + n + "(?=\\s|>|$))",
            next: [
              { include: "attributes" },
              {
                token: "meta.tag.punctuation.tag-close.xml",
                regex: "/?>",
                next: t + "start",
              },
            ],
          }),
            (this.$rules[n + "-end"] = [
              { include: "attributes" },
              {
                token: "meta.tag.punctuation.tag-close.xml",
                regex: "/?>",
                next: "start",
                onMatch: function (e, t, n) {
                  return n.splice(0), this.token;
                },
              },
            ]),
            this.embedRules(e, t, [
              {
                token: [
                  "meta.tag.punctuation.end-tag-open.xml",
                  "meta.tag." + n + ".tag-name.xml",
                ],
                regex: "(</)(" + n + "(?=\\s|>|$))",
                next: n + "-end",
              },
              { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[" },
              { token: "string.cdata.xml", regex: "\\]\\]>" },
            ]);
        };
      }).call(r.prototype),
        o.inherits(a, r),
        (t.XmlHighlightRules = a);
    }
  ),
  ace.define(
    "ace/mode/html_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/css_highlight_rules",
      "ace/mode/javascript_highlight_rules",
      "ace/mode/xml_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("../lib/lang"),
        a = e("./css_highlight_rules").CssHighlightRules,
        i = e("./javascript_highlight_rules").JavaScriptHighlightRules,
        s = e("./xml_highlight_rules").XmlHighlightRules,
        l = r.createMap({
          a: "anchor",
          button: "form",
          form: "form",
          img: "image",
          input: "form",
          label: "form",
          option: "form",
          script: "script",
          select: "form",
          textarea: "form",
          style: "style",
          table: "table",
          tbody: "table",
          td: "table",
          tfoot: "table",
          th: "table",
          tr: "table",
        }),
        c = function e() {
          s.call(this),
            this.addRules({
              attributes: [
                { include: "tag_whitespace" },
                {
                  token: "entity.other.attribute-name.xml",
                  regex: "[-_a-zA-Z0-9:.]+",
                },
                {
                  token: "keyword.operator.attribute-equals.xml",
                  regex: "=",
                  push: [
                    { include: "tag_whitespace" },
                    {
                      token: "string.unquoted.attribute-value.html",
                      regex: "[^<>='\"`\\s]+",
                      next: "pop",
                    },
                    { token: "empty", regex: "", next: "pop" },
                  ],
                },
                { include: "attribute_value" },
              ],
              tag: [
                {
                  token: function (e, t) {
                    var n = l[t];
                    return [
                      "meta.tag.punctuation." +
                        ("<" == e ? "" : "end-") +
                        "tag-open.xml",
                      "meta.tag" + (n ? "." + n : "") + ".tag-name.xml",
                    ];
                  },
                  regex: "(</?)([-_a-zA-Z0-9:.]+)",
                  next: "tag_stuff",
                },
              ],
              tag_stuff: [
                { include: "attributes" },
                {
                  token: "meta.tag.punctuation.tag-close.xml",
                  regex: "/?>",
                  next: "start",
                },
              ],
            }),
            this.embedTagRules(a, "css-", "style"),
            this.embedTagRules(new i({ jsx: !1 }).getRules(), "js-", "script"),
            this.constructor === e && this.normalizeRules();
        };
      o.inherits(c, s), (t.HtmlHighlightRules = c);
    }
  ),
  ace.define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/token_iterator",
      "ace/lib/lang",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/oop"),
        r = e("../behaviour").Behaviour,
        a = e("../../token_iterator").TokenIterator;
      e("../../lib/lang");
      function i(e, t) {
        return e && e.type.lastIndexOf(t + ".xml") > -1;
      }
      var s = function () {
        this.add("string_dquotes", "insertion", function (e, t, n, o, r) {
          if ('"' == r || "'" == r) {
            var s = r,
              l = o.doc.getTextRange(n.getSelectionRange());
            if (
              "" !== l &&
              "'" !== l &&
              '"' != l &&
              n.getWrapBehavioursEnabled()
            )
              return { text: s + l + s, selection: !1 };
            var c = n.getCursorPosition(),
              u = o.doc.getLine(c.row).substring(c.column, c.column + 1),
              g = new a(o, c.row, c.column),
              d = g.getCurrentToken();
            if (u == s && (i(d, "attribute-value") || i(d, "string")))
              return { text: "", selection: [1, 1] };
            if ((d || (d = g.stepBackward()), !d)) return;
            for (; i(d, "tag-whitespace") || i(d, "whitespace"); )
              d = g.stepBackward();
            var m = !u || u.match(/\s/);
            if (
              (i(d, "attribute-equals") && (m || ">" == u)) ||
              (i(d, "decl-attribute-equals") && (m || "?" == u))
            )
              return { text: s + s, selection: [1, 1] };
          }
        }),
          this.add("string_dquotes", "deletion", function (e, t, n, o, r) {
            var a = o.doc.getTextRange(r);
            if (
              !r.isMultiLine() &&
              ('"' == a || "'" == a) &&
              o.doc
                .getLine(r.start.row)
                .substring(r.start.column + 1, r.start.column + 2) == a
            )
              return r.end.column++, r;
          }),
          this.add("autoclosing", "insertion", function (e, t, n, o, r) {
            if (">" == r) {
              var s = n.getSelectionRange().start,
                l = new a(o, s.row, s.column),
                c = l.getCurrentToken() || l.stepBackward();
              if (
                !c ||
                !(
                  i(c, "tag-name") ||
                  i(c, "tag-whitespace") ||
                  i(c, "attribute-name") ||
                  i(c, "attribute-equals") ||
                  i(c, "attribute-value")
                )
              )
                return;
              if (i(c, "reference.attribute-value")) return;
              if (i(c, "attribute-value")) {
                var u = l.getCurrentTokenColumn() + c.value.length;
                if (s.column < u) return;
                if (s.column == u) {
                  var g = l.stepForward();
                  if (g && i(g, "attribute-value")) return;
                  l.stepBackward();
                }
              }
              if (/^\s*>/.test(o.getLine(s.row).slice(s.column))) return;
              for (; !i(c, "tag-name"); )
                if ("<" == (c = l.stepBackward()).value) {
                  c = l.stepForward();
                  break;
                }
              var d = l.getCurrentTokenRow(),
                m = l.getCurrentTokenColumn();
              if (i(l.stepBackward(), "end-tag-open")) return;
              var p = c.value;
              if (
                (d == s.row && (p = p.substring(0, s.column - m)),
                this.voidElements.hasOwnProperty(p.toLowerCase()))
              )
                return;
              return { text: "></" + p + ">", selection: [1, 1] };
            }
          }),
          this.add("autoindent", "insertion", function (e, t, n, o, r) {
            if ("\n" == r) {
              var i = n.getCursorPosition(),
                s = o.getLine(i.row),
                l = new a(o, i.row, i.column),
                c = l.getCurrentToken();
              if (c && -1 !== c.type.indexOf("tag-close")) {
                if ("/>" == c.value) return;
                for (; c && -1 === c.type.indexOf("tag-name"); )
                  c = l.stepBackward();
                if (!c) return;
                var u = c.value,
                  g = l.getCurrentTokenRow();
                if (!(c = l.stepBackward()) || -1 !== c.type.indexOf("end-tag"))
                  return;
                if (this.voidElements && !this.voidElements[u]) {
                  var d = o.getTokenAt(i.row, i.column + 1),
                    m = ((s = o.getLine(g)), this.$getIndent(s)),
                    p = m + o.getTabString();
                  return d && "</" === d.value
                    ? {
                        text: "\n" + p + "\n" + m,
                        selection: [1, p.length, 1, p.length],
                      }
                    : { text: "\n" + p };
                }
              }
            }
          });
      };
      o.inherits(s, r), (t.XmlBehaviour = s);
    }
  ),
  ace.define(
    "ace/mode/folding/mixed",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/oop"),
        r = e("./fold_mode").FoldMode,
        a = (t.FoldMode = function (e, t) {
          (this.defaultMode = e), (this.subModes = t);
        });
      o.inherits(a, r),
        function () {
          (this.$getMode = function (e) {
            for (var t in ("string" != typeof e && (e = e[0]), this.subModes))
              if (0 === e.indexOf(t)) return this.subModes[t];
            return null;
          }),
            (this.$tryMode = function (e, t, n, o) {
              var r = this.$getMode(e);
              return r ? r.getFoldWidget(t, n, o) : "";
            }),
            (this.getFoldWidget = function (e, t, n) {
              return (
                this.$tryMode(e.getState(n - 1), e, t, n) ||
                this.$tryMode(e.getState(n), e, t, n) ||
                this.defaultMode.getFoldWidget(e, t, n)
              );
            }),
            (this.getFoldWidgetRange = function (e, t, n) {
              var o = this.$getMode(e.getState(n - 1));
              return (
                (o && o.getFoldWidget(e, t, n)) ||
                  (o = this.$getMode(e.getState(n))),
                (o && o.getFoldWidget(e, t, n)) || (o = this.defaultMode),
                o.getFoldWidgetRange(e, t, n)
              );
            });
        }.call(a.prototype);
    }
  ),
  ace.define(
    "ace/mode/folding/xml",
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
      var o = e("../../lib/oop"),
        r = e("../../range").Range,
        a = e("./fold_mode").FoldMode,
        i = (t.FoldMode = function (e, t) {
          a.call(this),
            (this.voidElements = e || {}),
            (this.optionalEndTags = o.mixin({}, this.voidElements)),
            t && o.mixin(this.optionalEndTags, t);
        });
      o.inherits(i, a);
      var s = function () {
        (this.tagName = ""),
          (this.closing = !1),
          (this.selfClosing = !1),
          (this.start = { row: 0, column: 0 }),
          (this.end = { row: 0, column: 0 });
      };
      function l(e, t) {
        return e.type.lastIndexOf(t + ".xml") > -1;
      }
      (function () {
        (this.getFoldWidget = function (e, t, n) {
          var o = this._getFirstTagInLine(e, n);
          return o
            ? o.closing || (!o.tagName && o.selfClosing)
              ? "markbeginend" === t
                ? "end"
                : ""
              : !o.tagName ||
                o.selfClosing ||
                this.voidElements.hasOwnProperty(o.tagName.toLowerCase()) ||
                this._findEndTagInLine(e, n, o.tagName, o.end.column)
              ? ""
              : "start"
            : this.getCommentFoldWidget(e, n);
        }),
          (this.getCommentFoldWidget = function (e, t) {
            return /comment/.test(e.getState(t)) && /<!-/.test(e.getLine(t))
              ? "start"
              : "";
          }),
          (this._getFirstTagInLine = function (e, t) {
            for (
              var n = e.getTokens(t), o = new s(), r = 0;
              r < n.length;
              r++
            ) {
              var a = n[r];
              if (l(a, "tag-open")) {
                if (
                  ((o.end.column = o.start.column + a.value.length),
                  (o.closing = l(a, "end-tag-open")),
                  !(a = n[++r]))
                )
                  return null;
                for (
                  o.tagName = a.value, o.end.column += a.value.length, r++;
                  r < n.length;
                  r++
                )
                  if (
                    ((a = n[r]),
                    (o.end.column += a.value.length),
                    l(a, "tag-close"))
                  ) {
                    o.selfClosing = "/>" == a.value;
                    break;
                  }
                return o;
              }
              if (l(a, "tag-close"))
                return (o.selfClosing = "/>" == a.value), o;
              o.start.column += a.value.length;
            }
            return null;
          }),
          (this._findEndTagInLine = function (e, t, n, o) {
            for (var r = e.getTokens(t), a = 0, i = 0; i < r.length; i++) {
              var s = r[i];
              if (
                !((a += s.value.length) < o) &&
                l(s, "end-tag-open") &&
                (s = r[i + 1]) &&
                s.value == n
              )
                return !0;
            }
            return !1;
          }),
          (this.getFoldWidgetRange = function (e, t, n) {
            var o = e.getMatchingTags({ row: n, column: 0 });
            return o
              ? new r(
                  o.openTag.end.row,
                  o.openTag.end.column,
                  o.closeTag.start.row,
                  o.closeTag.start.column
                )
              : this.getCommentFoldWidget(e, n) &&
                  e.getCommentFoldRange(n, e.getLine(n).length);
          });
      }).call(i.prototype);
    }
  ),
  ace.define(
    "ace/mode/folding/html",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/mixed",
      "ace/mode/folding/xml",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../../lib/oop"),
        r = e("./mixed").FoldMode,
        a = e("./xml").FoldMode,
        i = e("./cstyle").FoldMode,
        s = (t.FoldMode = function (e, t) {
          r.call(this, new a(e, t), { "js-": new i(), "css-": new i() });
        });
      o.inherits(s, r);
    }
  ),
  ace.define(
    "ace/mode/html_completions",
    ["require", "exports", "module", "ace/token_iterator"],
    function (e, t, n) {
      "use strict";
      var o = e("../token_iterator").TokenIterator,
        r = [
          "accesskey",
          "class",
          "contenteditable",
          "contextmenu",
          "dir",
          "draggable",
          "dropzone",
          "hidden",
          "id",
          "inert",
          "itemid",
          "itemprop",
          "itemref",
          "itemscope",
          "itemtype",
          "lang",
          "spellcheck",
          "style",
          "tabindex",
          "title",
          "translate",
        ].concat([
          "onabort",
          "onblur",
          "oncancel",
          "oncanplay",
          "oncanplaythrough",
          "onchange",
          "onclick",
          "onclose",
          "oncontextmenu",
          "oncuechange",
          "ondblclick",
          "ondrag",
          "ondragend",
          "ondragenter",
          "ondragleave",
          "ondragover",
          "ondragstart",
          "ondrop",
          "ondurationchange",
          "onemptied",
          "onended",
          "onerror",
          "onfocus",
          "oninput",
          "oninvalid",
          "onkeydown",
          "onkeypress",
          "onkeyup",
          "onload",
          "onloadeddata",
          "onloadedmetadata",
          "onloadstart",
          "onmousedown",
          "onmousemove",
          "onmouseout",
          "onmouseover",
          "onmouseup",
          "onmousewheel",
          "onpause",
          "onplay",
          "onplaying",
          "onprogress",
          "onratechange",
          "onreset",
          "onscroll",
          "onseeked",
          "onseeking",
          "onselect",
          "onshow",
          "onstalled",
          "onsubmit",
          "onsuspend",
          "ontimeupdate",
          "onvolumechange",
          "onwaiting",
        ]),
        a = {
          a: {
            href: 1,
            target: { _blank: 1, top: 1 },
            ping: 1,
            rel: {
              nofollow: 1,
              alternate: 1,
              author: 1,
              bookmark: 1,
              help: 1,
              license: 1,
              next: 1,
              noreferrer: 1,
              prefetch: 1,
              prev: 1,
              search: 1,
              tag: 1,
            },
            media: 1,
            hreflang: 1,
            type: 1,
          },
          abbr: {},
          address: {},
          area: {
            shape: 1,
            coords: 1,
            href: 1,
            hreflang: 1,
            alt: 1,
            target: 1,
            media: 1,
            rel: 1,
            ping: 1,
            type: 1,
          },
          article: { pubdate: 1 },
          aside: {},
          audio: {
            src: 1,
            autobuffer: 1,
            autoplay: { autoplay: 1 },
            loop: { loop: 1 },
            controls: { controls: 1 },
            muted: { muted: 1 },
            preload: { auto: 1, metadata: 1, none: 1 },
          },
          b: {},
          base: { href: 1, target: 1 },
          bdi: {},
          bdo: {},
          blockquote: { cite: 1 },
          body: {
            onafterprint: 1,
            onbeforeprint: 1,
            onbeforeunload: 1,
            onhashchange: 1,
            onmessage: 1,
            onoffline: 1,
            onpopstate: 1,
            onredo: 1,
            onresize: 1,
            onstorage: 1,
            onundo: 1,
            onunload: 1,
          },
          br: {},
          button: {
            autofocus: 1,
            disabled: { disabled: 1 },
            form: 1,
            formaction: 1,
            formenctype: 1,
            formmethod: 1,
            formnovalidate: 1,
            formtarget: 1,
            name: 1,
            value: 1,
            type: { button: 1, submit: 1 },
          },
          canvas: { width: 1, height: 1 },
          caption: {},
          cite: {},
          code: {},
          col: { span: 1 },
          colgroup: { span: 1 },
          command: {
            type: 1,
            label: 1,
            icon: 1,
            disabled: 1,
            checked: 1,
            radiogroup: 1,
            command: 1,
          },
          data: {},
          datalist: {},
          dd: {},
          del: { cite: 1, datetime: 1 },
          details: { open: 1 },
          dfn: {},
          dialog: { open: 1 },
          div: {},
          dl: {},
          dt: {},
          em: {},
          embed: { src: 1, height: 1, width: 1, type: 1 },
          fieldset: { disabled: 1, form: 1, name: 1 },
          figcaption: {},
          figure: {},
          footer: {},
          form: {
            "accept-charset": 1,
            action: 1,
            autocomplete: 1,
            enctype: {
              "multipart/form-data": 1,
              "application/x-www-form-urlencoded": 1,
            },
            method: { get: 1, post: 1 },
            name: 1,
            novalidate: 1,
            target: { _blank: 1, top: 1 },
          },
          h1: {},
          h2: {},
          h3: {},
          h4: {},
          h5: {},
          h6: {},
          head: {},
          header: {},
          hr: {},
          html: { manifest: 1 },
          i: {},
          iframe: {
            name: 1,
            src: 1,
            height: 1,
            width: 1,
            sandbox: {
              "allow-same-origin": 1,
              "allow-top-navigation": 1,
              "allow-forms": 1,
              "allow-scripts": 1,
            },
            seamless: { seamless: 1 },
          },
          img: { alt: 1, src: 1, height: 1, width: 1, usemap: 1, ismap: 1 },
          input: {
            type: {
              text: 1,
              password: 1,
              hidden: 1,
              checkbox: 1,
              submit: 1,
              radio: 1,
              file: 1,
              button: 1,
              reset: 1,
              image: 31,
              color: 1,
              date: 1,
              datetime: 1,
              "datetime-local": 1,
              email: 1,
              month: 1,
              number: 1,
              range: 1,
              search: 1,
              tel: 1,
              time: 1,
              url: 1,
              week: 1,
            },
            accept: 1,
            alt: 1,
            autocomplete: { on: 1, off: 1 },
            autofocus: { autofocus: 1 },
            checked: { checked: 1 },
            disabled: { disabled: 1 },
            form: 1,
            formaction: 1,
            formenctype: {
              "application/x-www-form-urlencoded": 1,
              "multipart/form-data": 1,
              "text/plain": 1,
            },
            formmethod: { get: 1, post: 1 },
            formnovalidate: { formnovalidate: 1 },
            formtarget: { _blank: 1, _self: 1, _parent: 1, _top: 1 },
            height: 1,
            list: 1,
            max: 1,
            maxlength: 1,
            min: 1,
            multiple: { multiple: 1 },
            name: 1,
            pattern: 1,
            placeholder: 1,
            readonly: { readonly: 1 },
            required: { required: 1 },
            size: 1,
            src: 1,
            step: 1,
            width: 1,
            files: 1,
            value: 1,
          },
          ins: { cite: 1, datetime: 1 },
          kbd: {},
          keygen: {
            autofocus: 1,
            challenge: { challenge: 1 },
            disabled: { disabled: 1 },
            form: 1,
            keytype: { rsa: 1, dsa: 1, ec: 1 },
            name: 1,
          },
          label: { form: 1, for: 1 },
          legend: {},
          li: { value: 1 },
          link: {
            href: 1,
            hreflang: 1,
            rel: { stylesheet: 1, icon: 1 },
            media: { all: 1, screen: 1, print: 1 },
            type: {
              "text/css": 1,
              "image/png": 1,
              "image/jpeg": 1,
              "image/gif": 1,
            },
            sizes: 1,
          },
          main: {},
          map: { name: 1 },
          mark: {},
          math: {},
          menu: { type: 1, label: 1 },
          meta: {
            "http-equiv": { "content-type": 1 },
            name: { description: 1, keywords: 1 },
            content: { "text/html; charset=UTF-8": 1 },
            charset: 1,
          },
          meter: { value: 1, min: 1, max: 1, low: 1, high: 1, optimum: 1 },
          nav: {},
          noscript: { href: 1 },
          object: {
            param: 1,
            data: 1,
            type: 1,
            height: 1,
            width: 1,
            usemap: 1,
            name: 1,
            form: 1,
            classid: 1,
          },
          ol: { start: 1, reversed: 1 },
          optgroup: { disabled: 1, label: 1 },
          option: { disabled: 1, selected: 1, label: 1, value: 1 },
          output: { for: 1, form: 1, name: 1 },
          p: {},
          param: { name: 1, value: 1 },
          pre: {},
          progress: { value: 1, max: 1 },
          q: { cite: 1 },
          rp: {},
          rt: {},
          ruby: {},
          s: {},
          samp: {},
          script: {
            charset: 1,
            type: { "text/javascript": 1 },
            src: 1,
            defer: 1,
            async: 1,
          },
          select: {
            autofocus: 1,
            disabled: 1,
            form: 1,
            multiple: { multiple: 1 },
            name: 1,
            size: 1,
            readonly: { readonly: 1 },
          },
          small: {},
          source: { src: 1, type: 1, media: 1 },
          span: {},
          strong: {},
          style: { type: 1, media: { all: 1, screen: 1, print: 1 }, scoped: 1 },
          sub: {},
          sup: {},
          svg: {},
          table: { summary: 1 },
          tbody: {},
          td: { headers: 1, rowspan: 1, colspan: 1 },
          textarea: {
            autofocus: { autofocus: 1 },
            disabled: { disabled: 1 },
            form: 1,
            maxlength: 1,
            name: 1,
            placeholder: 1,
            readonly: { readonly: 1 },
            required: { required: 1 },
            rows: 1,
            cols: 1,
            wrap: { on: 1, off: 1, hard: 1, soft: 1 },
          },
          tfoot: {},
          th: { headers: 1, rowspan: 1, colspan: 1, scope: 1 },
          thead: {},
          time: { datetime: 1 },
          title: {},
          tr: {},
          track: { kind: 1, src: 1, srclang: 1, label: 1, default: 1 },
          section: {},
          summary: {},
          u: {},
          ul: {},
          var: {},
          video: {
            src: 1,
            autobuffer: 1,
            autoplay: { autoplay: 1 },
            loop: { loop: 1 },
            controls: { controls: 1 },
            width: 1,
            height: 1,
            poster: 1,
            muted: { muted: 1 },
            preload: { auto: 1, metadata: 1, none: 1 },
          },
          wbr: {},
        },
        i = Object.keys(a);
      function s(e, t) {
        return e.type.lastIndexOf(t + ".xml") > -1;
      }
      function l(e, t) {
        for (
          var n = new o(e, t.row, t.column), r = n.getCurrentToken();
          r && !s(r, "tag-name");

        )
          r = n.stepBackward();
        if (r) return r.value;
      }
      var c = function () {};
      (function () {
        (this.getCompletions = function (e, t, n, o) {
          var r = t.getTokenAt(n.row, n.column);
          if (!r) return [];
          if (s(r, "tag-name") || s(r, "tag-open") || s(r, "end-tag-open"))
            return this.getTagCompletions(e, t, n, o);
          if (s(r, "tag-whitespace") || s(r, "attribute-name"))
            return this.getAttributeCompletions(e, t, n, o);
          if (s(r, "attribute-value"))
            return this.getAttributeValueCompletions(e, t, n, o);
          var a = t.getLine(n.row).substr(0, n.column);
          return /&[a-z]*$/i.test(a)
            ? this.getHTMLEntityCompletions(e, t, n, o)
            : [];
        }),
          (this.getTagCompletions = function (e, t, n, o) {
            return i.map(function (e) {
              return { value: e, meta: "tag", score: 1e6 };
            });
          }),
          (this.getAttributeCompletions = function (e, t, n, o) {
            var i = l(t, n);
            if (!i) return [];
            var s = r;
            return (
              i in a && (s = s.concat(Object.keys(a[i]))),
              s.map(function (e) {
                return {
                  caption: e,
                  snippet: e + '="$0"',
                  meta: "attribute",
                  score: 1e6,
                };
              })
            );
          }),
          (this.getAttributeValueCompletions = function (e, t, n, r) {
            var i = l(t, n),
              c = (function (e, t) {
                for (
                  var n = new o(e, t.row, t.column), r = n.getCurrentToken();
                  r && !s(r, "attribute-name");

                )
                  r = n.stepBackward();
                if (r) return r.value;
              })(t, n);
            if (!i) return [];
            var u = [];
            return (
              i in a &&
                c in a[i] &&
                "object" === typeof a[i][c] &&
                (u = Object.keys(a[i][c])),
              u.map(function (e) {
                return {
                  caption: e,
                  snippet: e,
                  meta: "attribute value",
                  score: 1e6,
                };
              })
            );
          }),
          (this.getHTMLEntityCompletions = function (e, t, n, o) {
            return [
              "Aacute;",
              "aacute;",
              "Acirc;",
              "acirc;",
              "acute;",
              "AElig;",
              "aelig;",
              "Agrave;",
              "agrave;",
              "alefsym;",
              "Alpha;",
              "alpha;",
              "amp;",
              "and;",
              "ang;",
              "Aring;",
              "aring;",
              "asymp;",
              "Atilde;",
              "atilde;",
              "Auml;",
              "auml;",
              "bdquo;",
              "Beta;",
              "beta;",
              "brvbar;",
              "bull;",
              "cap;",
              "Ccedil;",
              "ccedil;",
              "cedil;",
              "cent;",
              "Chi;",
              "chi;",
              "circ;",
              "clubs;",
              "cong;",
              "copy;",
              "crarr;",
              "cup;",
              "curren;",
              "Dagger;",
              "dagger;",
              "dArr;",
              "darr;",
              "deg;",
              "Delta;",
              "delta;",
              "diams;",
              "divide;",
              "Eacute;",
              "eacute;",
              "Ecirc;",
              "ecirc;",
              "Egrave;",
              "egrave;",
              "empty;",
              "emsp;",
              "ensp;",
              "Epsilon;",
              "epsilon;",
              "equiv;",
              "Eta;",
              "eta;",
              "ETH;",
              "eth;",
              "Euml;",
              "euml;",
              "euro;",
              "exist;",
              "fnof;",
              "forall;",
              "frac12;",
              "frac14;",
              "frac34;",
              "frasl;",
              "Gamma;",
              "gamma;",
              "ge;",
              "gt;",
              "hArr;",
              "harr;",
              "hearts;",
              "hellip;",
              "Iacute;",
              "iacute;",
              "Icirc;",
              "icirc;",
              "iexcl;",
              "Igrave;",
              "igrave;",
              "image;",
              "infin;",
              "int;",
              "Iota;",
              "iota;",
              "iquest;",
              "isin;",
              "Iuml;",
              "iuml;",
              "Kappa;",
              "kappa;",
              "Lambda;",
              "lambda;",
              "lang;",
              "laquo;",
              "lArr;",
              "larr;",
              "lceil;",
              "ldquo;",
              "le;",
              "lfloor;",
              "lowast;",
              "loz;",
              "lrm;",
              "lsaquo;",
              "lsquo;",
              "lt;",
              "macr;",
              "mdash;",
              "micro;",
              "middot;",
              "minus;",
              "Mu;",
              "mu;",
              "nabla;",
              "nbsp;",
              "ndash;",
              "ne;",
              "ni;",
              "not;",
              "notin;",
              "nsub;",
              "Ntilde;",
              "ntilde;",
              "Nu;",
              "nu;",
              "Oacute;",
              "oacute;",
              "Ocirc;",
              "ocirc;",
              "OElig;",
              "oelig;",
              "Ograve;",
              "ograve;",
              "oline;",
              "Omega;",
              "omega;",
              "Omicron;",
              "omicron;",
              "oplus;",
              "or;",
              "ordf;",
              "ordm;",
              "Oslash;",
              "oslash;",
              "Otilde;",
              "otilde;",
              "otimes;",
              "Ouml;",
              "ouml;",
              "para;",
              "part;",
              "permil;",
              "perp;",
              "Phi;",
              "phi;",
              "Pi;",
              "pi;",
              "piv;",
              "plusmn;",
              "pound;",
              "Prime;",
              "prime;",
              "prod;",
              "prop;",
              "Psi;",
              "psi;",
              "quot;",
              "radic;",
              "rang;",
              "raquo;",
              "rArr;",
              "rarr;",
              "rceil;",
              "rdquo;",
              "real;",
              "reg;",
              "rfloor;",
              "Rho;",
              "rho;",
              "rlm;",
              "rsaquo;",
              "rsquo;",
              "sbquo;",
              "Scaron;",
              "scaron;",
              "sdot;",
              "sect;",
              "shy;",
              "Sigma;",
              "sigma;",
              "sigmaf;",
              "sim;",
              "spades;",
              "sub;",
              "sube;",
              "sum;",
              "sup;",
              "sup1;",
              "sup2;",
              "sup3;",
              "supe;",
              "szlig;",
              "Tau;",
              "tau;",
              "there4;",
              "Theta;",
              "theta;",
              "thetasym;",
              "thinsp;",
              "THORN;",
              "thorn;",
              "tilde;",
              "times;",
              "trade;",
              "Uacute;",
              "uacute;",
              "uArr;",
              "uarr;",
              "Ucirc;",
              "ucirc;",
              "Ugrave;",
              "ugrave;",
              "uml;",
              "upsih;",
              "Upsilon;",
              "upsilon;",
              "Uuml;",
              "uuml;",
              "weierp;",
              "Xi;",
              "xi;",
              "Yacute;",
              "yacute;",
              "yen;",
              "Yuml;",
              "yuml;",
              "Zeta;",
              "zeta;",
              "zwj;",
              "zwnj;",
            ].map(function (e) {
              return {
                caption: e,
                snippet: e,
                meta: "html entity",
                score: 1e6,
              };
            });
          });
      }).call(c.prototype),
        (t.HtmlCompletions = c);
    }
  ),
  ace.define(
    "ace/mode/html",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text",
      "ace/mode/javascript",
      "ace/mode/css",
      "ace/mode/html_highlight_rules",
      "ace/mode/behaviour/xml",
      "ace/mode/folding/html",
      "ace/mode/html_completions",
      "ace/worker/worker_client",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("../lib/lang"),
        a = e("./text").Mode,
        i = e("./javascript").Mode,
        s = e("./css").Mode,
        l = e("./html_highlight_rules").HtmlHighlightRules,
        c = e("./behaviour/xml").XmlBehaviour,
        u = e("./folding/html").FoldMode,
        g = e("./html_completions").HtmlCompletions,
        d = e("../worker/worker_client").WorkerClient,
        m = [
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "meta",
          "menuitem",
          "param",
          "source",
          "track",
          "wbr",
        ],
        p = [
          "li",
          "dt",
          "dd",
          "p",
          "rt",
          "rp",
          "optgroup",
          "option",
          "colgroup",
          "td",
          "th",
        ],
        h = function (e) {
          (this.fragmentContext = e && e.fragmentContext),
            (this.HighlightRules = l),
            (this.$behaviour = new c()),
            (this.$completer = new g()),
            this.createModeDelegates({ "js-": i, "css-": s }),
            (this.foldingRules = new u(this.voidElements, r.arrayToMap(p)));
        };
      o.inherits(h, a),
        function () {
          (this.blockComment = { start: "\x3c!--", end: "--\x3e" }),
            (this.voidElements = r.arrayToMap(m)),
            (this.getNextLineIndent = function (e, t, n) {
              return this.$getIndent(t);
            }),
            (this.checkOutdent = function (e, t, n) {
              return !1;
            }),
            (this.getCompletions = function (e, t, n, o) {
              return this.$completer.getCompletions(e, t, n, o);
            }),
            (this.createWorker = function (e) {
              if (this.constructor == h) {
                var t = new d(["ace"], "ace/mode/html_worker", "Worker");
                return (
                  t.attachToDocument(e.getDocument()),
                  this.fragmentContext &&
                    t.call("setOptions", [{ context: this.fragmentContext }]),
                  t.on("error", function (t) {
                    e.setAnnotations(t.data);
                  }),
                  t.on("terminate", function () {
                    e.clearAnnotations();
                  }),
                  t
                );
              }
            }),
            (this.$id = "ace/mode/html"),
            (this.snippetFileId = "ace/snippets/html");
        }.call(h.prototype),
        (t.Mode = h);
    }
  ),
  ace.define(
    "ace/mode/twig_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/html_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = (e("../lib/lang"), e("./html_highlight_rules").HtmlHighlightRules),
        a = e("./text_highlight_rules").TextHighlightRules,
        i = function () {
          r.call(this);
          var e =
            "autoescape|block|do|embed|extends|filter|flush|for|from|if|import|include|macro|sandbox|set|spaceless|use|verbatim";
          e = e + "|end" + e.replace(/\|/g, "|end");
          var t = this.createKeywordMapper(
            {
              "keyword.control.twig": e,
              "support.function.twig": [
                "abs|batch|capitalize|convert_encoding|date|date_modify|default|e|escape|first|format|join|json_encode|keys|last|length|lower|merge|nl2br|number_format|raw|replace|reverse|slice|sort|split|striptags|title|trim|upper|url_encode",
                "attribute|constant|cycle|date|dump|parent|random|range|template_from_string",
                "constant|divisibleby|sameas|defined|empty|even|iterable|odd",
              ].join("|"),
              "keyword.operator.twig": "b-and|b-xor|b-or|in|is|and|or|not",
              "constant.language.twig": "null|none|true|false",
            },
            "identifier"
          );
          for (var n in this.$rules)
            this.$rules[n].unshift(
              {
                token: "variable.other.readwrite.local.twig",
                regex: "\\{\\{-?",
                push: "twig-start",
              },
              { token: "meta.tag.twig", regex: "\\{%-?", push: "twig-start" },
              {
                token: "comment.block.twig",
                regex: "\\{#-?",
                push: "twig-comment",
              }
            );
          (this.$rules["twig-comment"] = [
            { token: "comment.block.twig", regex: ".*-?#\\}", next: "pop" },
          ]),
            (this.$rules["twig-start"] = [
              {
                token: "variable.other.readwrite.local.twig",
                regex: "-?\\}\\}",
                next: "pop",
              },
              { token: "meta.tag.twig", regex: "-?%\\}", next: "pop" },
              { token: "string", regex: "'", next: "twig-qstring" },
              { token: "string", regex: '"', next: "twig-qqstring" },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b",
              },
              { token: t, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              { token: "keyword.operator.assignment", regex: "=|~" },
              {
                token: "keyword.operator.comparison",
                regex: "==|!=|<|>|>=|<=|===",
              },
              {
                token: "keyword.operator.arithmetic",
                regex: "\\+|-|/|%|//|\\*|\\*\\*",
              },
              { token: "keyword.operator.other", regex: "\\.\\.|\\|" },
              { token: "punctuation.operator", regex: /\?|:|,|;|\./ },
              { token: "paren.lparen", regex: /[\[\({]/ },
              { token: "paren.rparen", regex: /[\])}]/ },
              { token: "text", regex: "\\s+" },
            ]),
            (this.$rules["twig-qqstring"] = [
              {
                token: "constant.language.escape",
                regex: /\\[\\"$#ntr]|#{[^"}]*}/,
              },
              { token: "string", regex: '"', next: "twig-start" },
              { defaultToken: "string" },
            ]),
            (this.$rules["twig-qstring"] = [
              { token: "constant.language.escape", regex: /\\[\\'ntr]}/ },
              { token: "string", regex: "'", next: "twig-start" },
              { defaultToken: "string" },
            ]),
            this.normalizeRules();
        };
      o.inherits(i, a), (t.TwigHighlightRules = i);
    }
  ),
  ace.define(
    "ace/mode/twig",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/html",
      "ace/mode/twig_highlight_rules",
      "ace/mode/matching_brace_outdent",
    ],
    function (e, t, n) {
      "use strict";
      var o = e("../lib/oop"),
        r = e("./html").Mode,
        a = e("./twig_highlight_rules").TwigHighlightRules,
        i = e("./matching_brace_outdent").MatchingBraceOutdent,
        s = function () {
          r.call(this), (this.HighlightRules = a), (this.$outdent = new i());
        };
      o.inherits(s, r),
        function () {
          (this.blockComment = { start: "{#", end: "#}" }),
            (this.getNextLineIndent = function (e, t, n) {
              var o = this.$getIndent(t),
                r = this.getTokenizer().getLineTokens(t, e),
                a = r.tokens;
              r.state;
              if (a.length && "comment" == a[a.length - 1].type) return o;
              "start" == e && t.match(/^.*[\{\(\[]\s*$/) && (o += n);
              return o;
            }),
            (this.checkOutdent = function (e, t, n) {
              return this.$outdent.checkOutdent(t, n);
            }),
            (this.autoOutdent = function (e, t, n) {
              this.$outdent.autoOutdent(t, n);
            }),
            (this.$id = "ace/mode/twig");
        }.call(s.prototype),
        (t.Mode = s);
    }
  ),
  ace.require(["ace/mode/twig"], function (e) {
    "object" == typeof module &&
      "object" == typeof exports &&
      module &&
      (module.exports = e);
  });
