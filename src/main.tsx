/// <reference lib="dom" />

import Synth from "./synthClass";
import { randomColor } from "./util";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Keybind from "./Keybind";
import App from "./components/App";
import SynthSettings from "./SynthSettings";

export const synth = new Synth(new AudioContext(), SynthSettings.random());

window.onkeydown = (event: KeyboardEvent) => {
    keybinds.forEach((keybind) => {
        if (event.code == keybind.key) {
            keybind.onDown();
        }
    });
};

window.onkeyup = (event: KeyboardEvent) => {
    keybinds.forEach((keybind) => {
        if (event.code == keybind.key) {
            if (keybind.onUp) keybind.onUp();
        }
    });
};

const keybinds = [
    new Keybind(
        "KeyA",
        () => synth.voiceOn(48, 127),
        () => synth.voiceOff(48)
    ),
    new Keybind(
        "KeyW",
        () => synth.voiceOn(49, 127),
        () => synth.voiceOff(49)
    ),
    new Keybind(
        "KeyS",
        () => synth.voiceOn(50, 127),
        () => synth.voiceOff(50)
    ),
    new Keybind(
        "KeyE",
        () => synth.voiceOn(51, 127),
        () => synth.voiceOff(51)
    ),
    new Keybind(
        "KeyD",
        () => synth.voiceOn(52, 127),
        () => synth.voiceOff(52)
    ),
    new Keybind(
        "KeyF",
        () => synth.voiceOn(53, 127),
        () => synth.voiceOff(53)
    ),
    new Keybind(
        "KeyT",
        () => synth.voiceOn(54, 127),
        () => synth.voiceOff(54)
    ),
    new Keybind(
        "KeyG",
        () => synth.voiceOn(55, 127),
        () => synth.voiceOff(55)
    ),
    new Keybind(
        "KeyY",
        () => synth.voiceOn(56, 127),
        () => synth.voiceOff(56)
    ),
    new Keybind(
        "KeyH",
        () => synth.voiceOn(57, 127),
        () => synth.voiceOff(57)
    ),
    new Keybind(
        "KeyU",
        () => synth.voiceOn(58, 127),
        () => synth.voiceOff(58)
    ),
    new Keybind(
        "KeyJ",
        () => synth.voiceOn(59, 127),
        () => synth.voiceOff(59)
    ),
    new Keybind(
        "KeyK",
        () => synth.voiceOn(60, 127),
        () => synth.voiceOff(60)
    ),
    new Keybind("Space", () => {
        location.reload();
    }),
    new Keybind("Equal", () => {
        synth.octave++;
        for (let notes = 0; notes < synth.notesOn.length; notes++) {
            synth.notesOn[notes].bye();
            synth.notesOn.splice(notes, 1);
        }
    }),
    new Keybind("Minus", () => {
        synth.octave--;
        for (let notes = 0; notes < synth.notesOn.length; notes++) {
            synth.notesOn[notes].bye();
            synth.notesOn.splice(notes, 1);
        }
    }),
    new Keybind("KeyX", () => {
        for (let notes = 0; notes < synth.notesOn.length; notes++) {
            synth.notesOn[notes].bye();
            synth.notesOn.splice(notes, 1);
        }
    }),
];

document.body.style.backgroundColor = randomColor();

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<App synth={synth} />, container);
