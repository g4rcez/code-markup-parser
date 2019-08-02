/* clear brackets at init/end of string */
const clearBrackets = (str = "") => str.replace(/^\[/, "").replace(/\]$/, "");

/* clear commas at init/end of string */
const clearCommas = (str = "") => str.replace(/^;/, "").replace(/;$/, "");

/* Parse http to https or any string as https link */
const toSecureHttps = (str = "") => {
	if (str.startsWith("http://")) {
		return str.replace("http://", "https://");
	}
	return str.startsWith("https://") ? str : `https://${str}`;
};

/* Clean up all HTML before parser the input */
const sanitizeHTML = (str = "") => str.replace(/<[^>]*>/g, "");

/*
	Map all possible commands as a HTML tags
*/
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
/*
	Anything other than the map will be `style` command
*/
const tagCommand = {
	"[link": "href",
	"[zap": "href"
};

const linkArray = [tagCommand["[link"], tagCommand["[zap"]];
const asLink = (str = "") => linkArray.includes(str);

const fillColors = (defaults, map) => {
	if (!!map) {
		const newMap = Object.keys(map).reduce((acc, el) => {
			return { ...acc, [el]: map[el] };
		}, {});
		return { ...map, ...newMap };
	}
	return defaults;
};
const matchCloseCommands = match => codeMap[match];

const openRegex = /\[(b|i|zap|t|line|link) ?(color=[#0-9a-zA-z_-]+|url=.+\.[a-z]{2,5}|phone=[0-9]{13,20}|class="[ \S]+")?\]/g;
const closeRegex = /\[\/(b|i|zap|line|t|link)\]/gi;

const parser = (params = {}) => str => {
	const colors = fillColors(
		{
			primary: "purple",
			secondary: "cyan",
			danger: "red"
		},
		params.colors
	);

	const keyOperator = {
		color: value => (colors.hasOwnProperty(value) ? colors[value] : value),
		phone: value => `https://wa.me/${value}`,
		url: value => toSecureHttps(value),
		class: value => value.trim()
	};

	const reduceString = master => (acc, el) => {
		const clear = clearBrackets(el);
		const [key, value] = clear.split("=");
		const newValue = key in keyOperator ? keyOperator[key](value) : value;
		if (asLink(master)) {
			return newValue;
		}
		console.log("CLASS KEY", key);
		if (key === "class") {
			return `${acc} ${newValue}`;
		}
		return `${acc};${key}: ${newValue};`;
	};

	const matchOpenCommands = match => {
		// const commands = match.split(/ ([a-z]+='[\S ]+')/);
		// const splits = commands.slice(0, -1)
		const splits = match.split(" ");
		if (splits.length === 1) {
			return codeMap[splits[0]];
		}
		const [tag, ...parameters] = splits;
		const command = tagCommand[tag] || "style";
		const args = parameters.reduce(reduceString(command), "").trim();
		const clearArgs = clearCommas(args);
		const final = `${codeMap[tag]} ${command}="${clearArgs}"`;
		if (command === tagCommand["[link"]) {
			return final + ` target="_blank">`;
		}
		return final + ">";
	};

	return sanitizeHTML(str)
		.replace(openRegex, matchOpenCommands)
		.replace(closeRegex, matchCloseCommands);
};

export default parser;
