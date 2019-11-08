/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var onlyNumbers = function (str) { return str.replace(/[^\d]/g, ""); };
var trueTrim = function (str) { return str.trim().replace(/\s\s+/g, " "); };
var isEmpty = function (object) {
    if (typeof object === "undefined" || object === null) {
        return true;
    }
    if (Array.isArray(object) && object.length === 0) {
        return true;
    }
    if (typeof object === "string" && object.trim().length === 0) {
        return true;
    }
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
var placeholder = { class: "", phone: { text: "", number: "" }, style: {}, user: "" };
var fnPlaceholder = function (v) { return v; };
var clearQuote = function (str) {
    if (str === void 0) { str = ""; }
    return str.replace(/^"/, "").replace(/$"/, "");
};
var mutate = function (key, value, refObject) {
    var _a, _b;
    if (refObject.hasOwnProperty(key)) {
        return __assign(__assign({}, refObject), (_a = {}, _a[key] = refObject[key] + " " + value, _a));
    }
    return __assign(__assign({}, refObject), (_b = {}, _b[key] = value, _b));
};
var placeholderFunctions = {
    class: function (prev, value) { return (__assign(__assign({}, prev), { class: value })); },
    text: function (prev, text) { return (__assign(__assign({}, prev), { phone: __assign(__assign({}, prev.phone), { text: text }) })); },
    phone: function (prev, n) { return (__assign(__assign({}, prev), { phone: __assign(__assign({}, prev.phone), { number: n }) })); },
    user: function (prev, user) { return (__assign(__assign({}, prev), { user: user })); }
};
var toSecureHttps = function (str) {
    if (str === void 0) { str = ""; }
    if (str.startsWith("http://")) {
        return str.replace("http://", "https://");
    }
    return str.startsWith("https://") ? str : "https://" + str;
};
var sanitizeHTML = function (str) {
    if (str === void 0) { str = ""; }
    return str.replace(/<[^>]*>/g, "");
};
var codeMap = {
    "[line]": "<p>",
    "[/line]": "</p>",
    "[/b]": "</strong>",
    "[b": "<strong",
    "[insta": "<a",
    "[instagram": "<a",
    "[i": "<i",
    "[/i]": "</i>",
    "[/insta]": "</a>",
    "[/instagram]": "</a>",
    "[t": "<span",
    "[/t]": "</span>",
    "[link": "<a",
    "[/link]": "</a>",
    "[zap": "<a",
    "[/zap]": "<a>"
};
var quote = "('|\")";
var matchCloseCommands = function (match) { return codeMap[match]; };
var optionalREconcat = function (acc, el) { return el + "|" + acc; };
var paramToRE = function () {
    var flags = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        flags[_i] = arguments[_i];
    }
    return flags.reduce(optionalREconcat, "").replace(/\|$/, "");
};
var acceptChars = "#@0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýäëïöüÿçßØøÅåÆæœ.:/ _-";
var tags = paramToRE("zap", "b", "link", "i", "t", "line", "insta", "instagram");
var tagAttributes = paramToRE("phone", "text", "color", "url", "class", "mark", "user");
var openRegex = new RegExp("\\[(" + tags + ")( ?(" + tagAttributes + ")=" + quote + "[" + acceptChars + "]+" + quote + " ?){0,}?\\]", "gi");
var closeRegex = new RegExp("\\[/(" + tags + ")]", "gi");
var tagParameters = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[\]"']))+.)["']?/g;
var parser = function (str) {
    var keyOperator = {
        class: function (value) { return value.trim(); },
        url: function (value) { return toSecureHttps(value); },
        phone: function (value) { return "https://wa.me/" + onlyNumbers(value); },
        text: function (value) { return encodeURIComponent(clearQuote(value.trim())); },
        mark: function (value) { return value; },
        color: function (value) { return value; }
    };
    var matchOpenCommands = function (match) {
        var _a = match.split(/(\[[a-z]+) ?/), tag = _a[1], matches = _a[2];
        var attributesOfTag = {};
        matches.replace(tagParameters, function (values) {
            var _a = values.split("="), key = _a[0], value = _a[1];
            try {
                var cleanValue = value.replace(/^['"]/, "").replace(/['"]$/, "");
                var functionByKey = keyOperator[key] || fnPlaceholder;
                attributesOfTag = mutate(key, functionByKey(cleanValue).trim(), attributesOfTag);
                return "";
            }
            catch (error) {
                return "";
            }
        });
        var openTag = codeMap[tag.trim()];
        var keys = Object.keys(attributesOfTag);
        if (keys.length === 0) {
            return openTag + ">";
        }
        var attrs = keys.reduce(function (acc, el) {
            var _a;
            var val = "" + attributesOfTag[el];
            if (placeholderFunctions.hasOwnProperty(el)) {
                return placeholderFunctions[el](acc, val);
            }
            return __assign(__assign({}, acc), { style: __assign(__assign({}, acc.style), (_a = {}, _a[el] = val, _a)) });
        }, placeholder);
        var innerAttributes = "";
        if (!!attrs.class) {
            innerAttributes += "class=\"" + attrs.class + "\"";
        }
        if (!!attrs.phone.number) {
            var _b = attrs.phone, number = _b.number, text = _b.text;
            innerAttributes += "href=\"" + number + "?text=" + text + "\"";
        }
        if (!!attrs.user) {
            innerAttributes += "href=\"" + attrs.user + "\" ";
        }
        if (!isEmpty(attrs.style)) {
            var ok = Object.entries(attrs.style)
                .map(function (x) { return x[0].replace(/mark/, "background-color") + ":" + x[1]; })
                .join(";");
            innerAttributes += "style=\"" + ok + "\"";
        }
        return openTag + " " + innerAttributes + ">";
    };
    return trueTrim(sanitizeHTML(str))
        .replace(openRegex, matchOpenCommands)
        .replace(closeRegex, matchCloseCommands);
};

export default parser;
//# sourceMappingURL=index.es.js.map
