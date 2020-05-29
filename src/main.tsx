/// <reference lib="dom" />

import Synth from "./Synth";
import { randomColor } from "./util";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import SynthSettings from "./SynthSettings";
import { Provider } from "react-redux";
import { createStore } from "redux";
import synthSettingChanger from "./reducers/synthSettingChanger";
import { startKeyboard } from "./Keybind";

const store = createStore(synthSettingChanger);

export const synth = new Synth(new AudioContext(), SynthSettings.random());

document.body.style.backgroundColor = randomColor();

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(
    <Provider store={store}>
        <App synth={synth} />
    </Provider>,
    container
);

startKeyboard(synth);
