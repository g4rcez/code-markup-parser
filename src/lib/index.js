const clearBrackets = (str = "") => str.replace(/^\[/, "").replace(/\]$/, "");

const clearApostrophe = (str = "") => str.replace(/^'/, "").replace(/;'/, "");

const replaceAllSpaces = (str = "") => str.replace(/[ ]/g, "");

const onlyNumbers = (str = "") => str.replace(/[^0-9]/gi, "");

/* Parse http to https or any string as https link */
const toSecureHttps = (str = "") => {
	if (str.startsWith("http://")) {
		return str.replace("http://", "https://");
	}
	return str.startsWith("https://") ? str : `https://${str}`;
};

const sanitizeHTML = (str = "") => str.replace(/<[^>]*>/g, "");

const quote = `('|")`;
const matchCloseCommands = (match) => codeMap[match];

const optionalREconcat = (acc, el) => `${el}|${acc}`;
const paramToRE = (...flags) => flags.reduce(optionalREconcat, "").replace(/\|$/, "");
const acceptChars = "#0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýäëïöüÿçßØøÅåÆæœ _-";
const tags = paramToRE("zap", "b", "link", "i", "t", "line");
const tagAttributes = paramToRE("phone", "text", "color", "link", "class", "target");
const openRegex = new RegExp(`\\[(${tags})( ?(${tagAttributes})=${quote}[${acceptChars}]+${quote} ?){0,}?\\]`, "gi");

const closeRegex = /\[\/(b|i|zap|line|t|link)\]/gi;
const tagParameters = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[\]"']))+.)["']?/g;

const codeMap = {
	"[line]": "<p>",
	"[/line]": "</p>",
	"[b]": "<strong>",
	"[/b]": "</strong>",
	"[b": "<strong",
	"[i]": "<i>",
	"[i": "<i",
	"[/i]": "</i>",
	"[t": "<span",
	"[t]": "<span>",
	"[/t]": "</span>",
	"[link": "<a",
	"[/link]": "</a>",
	"[zap": "<a",
	"[/zap]": "<a>"
};

const tagLinkFunction = (v) => `href="${replaceAllSpaces(v)}"`;

const operateOnTag = {
	"[zap": tagLinkFunction,
	"[link": tagLinkFunction,
	"[b": (v) => `style="${v}"`,
	"[t": (v) => `class="${v}"`
};
const remap = (map) => (acc, el) => {
	return { ...acc, [el]: map[el] };
};

const fillColors = (defaults, map) => {
	if (!!map) {
		const executeMap = remap(map);
		const newMap = Object.keys(map).reduce(executeMap, {});
		return { ...map, ...newMap };
	}
	return defaults;
};

const fnPlaceholder = (v) => v;

const replaces = {
	class: (value) => `${value}`,
	color: (value) => `color:${value}`,
	target: (value) => `target="${value}"`,
	phone: (value) => clearApostrophe(value),
	text: (value) => `?text=${encodeURIComponent(value)}`
};

const replaceValueByKey = (key, value) => (replaces.hasOwnProperty(key) ? replaces[key](value) : value);

const parser = (params = {}) => (str) => {
	const colors = fillColors(
		{
			primary: "purple",
			secondary: "cyan",
			danger: "red"
		},
		params.colors
	);

	const keyOperator = {
		text: (value) => value.trim(),
		class: (value) => value.trim(),
		url: (value) => toSecureHttps(value),
		phone: (value) => `https://wa.me/${onlyNumbers(value)}`,
		color: (value) => (colors.hasOwnProperty(value) ? colors[value] : value)
	};

	const tagParametersOperator = (values) => {
		const [key, value] = values.split("=");
		try {
			const cleanValue = value.replace(/^'/, "").replace(/'$/, "");
			const fn = keyOperator[key] || fnPlaceholder;
			return replaceValueByKey(key, fn(cleanValue).trim());
		} catch (error) {
			return `${key}='${value}'`;
		}
	};

	const matchOpenCommands = (match) => {
		const [empty, tag, params] = match.split(/(\[[a-z]+) ?/);
		const keyValue = params.replace(tagParameters, tagParametersOperator);
		const attributes = clearBrackets(keyValue);
		const tagTrim = tag.trim();
		const openTag = codeMap[tag];
		const innerValue = operateOnTag.hasOwnProperty(tagTrim) ? operateOnTag[tagTrim](attributes) : attributes;
		return `${openTag} ${innerValue}>`;
	};

	return sanitizeHTML(str)
		.replace(openRegex, matchOpenCommands)
		.replace(closeRegex, matchCloseCommands);
};

export default parser;
