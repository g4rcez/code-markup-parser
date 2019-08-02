import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import parser from "./lib";

const configuredMap = parser({ colors: { primary: "blue" } });

function App() {
	const [state, setState] = useState(`
        [t]Normal text[/t]
        [t color=#ff0000]Text using color[/t]
        [line][link url=permita.me]How to in separate line[/link][/line]
        [line][zap phone=5521000000000][i][b color=primary]Call me in Hiroshima Nagazap[/b][/i][/zap][/line]
    `);
	return (
		<div className="App">
			<textarea rows={15} cols={60} value={state} onChange={e => setState(e.target.value)} />
			<div dangerouslySetInnerHTML={{ __html: configuredMap(state) }} />
			<div style={{ marginTop: "2em" }}>
				<code>{configuredMap(state)}</code>
			</div>
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));
