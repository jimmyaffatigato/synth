/// <reference lib="dom" />

import { randomColor } from "./myLibrary";
import { pre, Voice, synth } from "./synth";
import { notesOn } from "./midi";
import Keybind from "./Keybind";

//HTML Stuff

//Element Definitions
export const leftBox = document.getElementById("leftBox") as HTMLInputElement;
export const rightBox = document.getElementById("rightBox") as HTMLInputElement;
export const scopeBox = document.getElementById("scopeBox") as HTMLCanvasElement;
export const pAT = document.getElementById("pAT") as HTMLInputElement;
export const fAT = document.getElementById("fAT") as HTMLInputElement;
export const fDT = document.getElementById("fDT") as HTMLInputElement;
export const fST = document.getElementById("fST") as HTMLInputElement;
export const fRT = document.getElementById("fRT") as HTMLInputElement;
export const fAV = document.getElementById("fAV") as HTMLInputElement;
export const fDV = document.getElementById("fDV") as HTMLInputElement;
export const fSV = document.getElementById("fSV") as HTMLInputElement;
export const fRV = document.getElementById("fRV") as HTMLInputElement;
export const fQ = document.getElementById("fQ") as HTMLInputElement;
export const vAT = document.getElementById("vAT") as HTMLInputElement;
export const vDT = document.getElementById("vDT") as HTMLInputElement;
export const vST = document.getElementById("vST") as HTMLInputElement;
export const vRT = document.getElementById("vRT") as HTMLInputElement;
export const vAV = document.getElementById("vAV") as HTMLInputElement;
export const vDV = document.getElementById("vDV") as HTMLInputElement;
export const vSV = document.getElementById("vSV") as HTMLInputElement;
export const vRV = document.getElementById("vRV") as HTMLInputElement;
export const lfoOnOff = document.getElementById("lfoOnOff") as HTMLInputElement & { checked: boolean };
export const lfoMode = document.getElementById("lfoMode") as HTMLInputElement;
export const lfoType = document.getElementById("lfoType") as HTMLInputElement;
export const lfoSpeed = document.getElementById("lfoSpeed") as HTMLInputElement;
export const lfoDepth = document.getElementById("lfoDepth") as HTMLInputElement;
export const modWheel = document.getElementById("modWheel") as HTMLInputElement;
export const devices = document.getElementById("devices") as HTMLInputElement;
export const settings = document.getElementById("settings") as HTMLInputElement;
export const oscType = document.getElementById("oscType") as HTMLSelectElement;
export const pitchAttackType = document.getElementById("pitchAttackType") as HTMLSelectElement;

//Update HTML
export function show() {
    oscType.value = pre.oscType;
    pAT.value = `${pre.p.a[1]} s`;
    pitchAttackType.value = pre.pitchAttackType;
    fAT.value = `${pre.f.a[1]} s`;
    fAV.value = `${pre.f.a[0]} Hz`;
    fDT.value = `${pre.f.d[1]} s`;
    fDV.value = `${pre.f.d[0]} Hz`;
    fST.value = `${pre.f.s[1]} s`;
    fSV.value = `${pre.f.s[0]} Hz`;
    fRT.value = `${pre.f.r[1]} s`;
    fRV.value = `${pre.f.r[0]} Hz`;
    fQ.value = `${pre.fQ}`;
    vAT.value = `${pre.v.a[1]} s`;
    vAV.value = `${pre.v.a[0]} x`;
    vDT.value = `${pre.v.d[1]} s`;
    vDV.value = `${pre.v.d[0]} x`;
    vST.value = `${pre.v.s[1]} s`;
    vSV.value = `${pre.v.s[0]} x`;
    vRT.value = `${pre.v.r[1]} s`;
    vRV.value = `${pre.v.r[0]} x`;
    lfoOnOff.checked = pre.lfoOnOff;
    lfoType.value = pre.lfoType;
    lfoMode.value = pre.lfoMode;
    lfoSpeed.value = `${pre.lfoSpeed} Hz`;
    lfoDepth.value = `${pre.lfoDepth} x`;
    settings.value = JSON.stringify(pre);
}
function changeValues() {
    pre.oscType = oscType.value as OscillatorType;
    pre.pitchAttackType = pitchAttackType.value;
    pre.p.a[1] = parseFloat(pAT.value);
    pre.f.a[1] = parseFloat(fAT.value);
    pre.f.a[0] = parseFloat(fAV.value);
    pre.f.d[1] = parseFloat(fDT.value);
    pre.f.d[0] = parseFloat(fDV.value);
    pre.f.s[1] = parseFloat(fST.value);
    pre.f.s[0] = parseFloat(fSV.value);
    pre.f.r[1] = parseFloat(fRT.value);
    pre.f.r[0] = parseFloat(fRV.value);
    pre.fQ = parseInt(fQ.value);
    pre.v.a[1] = parseFloat(vAT.value);
    pre.v.a[0] = parseFloat(vAV.value);
    pre.v.d[1] = parseFloat(vDT.value);
    pre.v.d[0] = parseFloat(vDV.value);
    pre.v.s[1] = parseFloat(vST.value);
    pre.v.s[0] = parseFloat(vSV.value);
    pre.v.r[1] = parseFloat(vRT.value);
    pre.v.r[0] = parseFloat(vRV.value);
    pre.lfoOnOff = lfoOnOff.checked;
    pre.lfoMode = lfoMode.value;
    pre.lfoType = lfoType.value as OscillatorType;
    pre.lfoSpeed = parseFloat(lfoSpeed.value);
    pre.lfoDepth = parseFloat(lfoDepth.value);
    pre.modWheel = modWheel.value;
    show();
}
show();
changeValues();
document.body.style.backgroundColor = randomColor();
leftBox.style.backgroundColor = randomColor();
leftBox.style.height = `${window.innerHeight - (window.innerWidth / 100) * 2}`;
rightBox.style.height = `${window.innerHeight - (window.innerWidth / 100) * 2}`;
rightBox.style.backgroundColor = leftBox.style.backgroundColor;
scopeBox.width = window.innerWidth / 2;
scopeBox.height = window.innerHeight;
const scopeContext = scopeBox.getContext("2d");
synth.scope.fftSize = 2048;
const bufferLength = 1024;
const dataArray = new Uint8Array(bufferLength);
synth.scope.getByteTimeDomainData(dataArray);
function draw() {
    synth.scope.getByteTimeDomainData(dataArray);
    scopeContext.fillStyle = document.body.style.backgroundColor;
    scopeContext.fillRect(0, 0, scopeBox.width, scopeBox.height);
    scopeContext.lineWidth = 10;
    scopeContext.strokeStyle = leftBox.style.backgroundColor;
    scopeContext.beginPath();
    const sliceWidth = (scopeBox.width * 1.0) / bufferLength;
    for (let i = 0, x = 0; i < bufferLength; i++, x += sliceWidth) {
        const v = dataArray[i] / 128.0;
        const y = (v * scopeBox.height) / 2;
        if (i === 0) {
            scopeContext.moveTo(x, y);
        } else {
            scopeContext.lineTo(x, y);
        }
    }
    scopeContext.lineTo(scopeBox.width, scopeBox.height / 2);
    scopeContext.stroke();
}

const noteFlags = [];
for (let k = 0; k < 127; k++) {
    noteFlags.push(true);
}
function voiceOn(note: number, velocity: number) {
    note += 12 * octave;
    if (noteFlags[note] == true) {
        const newVoice = new Voice(note, velocity);
        notesOn.push(newVoice);
        newVoice.go();
        noteFlags[note] = false;
    }
}
function voiceOff(note: number) {
    note += 12 * octave;
    noteFlags[note] = true;
    for (let notes = 0; notes < notesOn.length; notes++) {
        if (notesOn[notes].note == note) {
            notesOn[notes].bye();
            notesOn.splice(notes, 1);
        }
    }
}
let octave = 1;
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
        () => voiceOn(48, 127),
        () => voiceOff(48)
    ),
    new Keybind(
        "KeyW",
        () => voiceOn(49, 127),
        () => voiceOff(49)
    ),
    new Keybind(
        "KeyS",
        () => voiceOn(50, 127),
        () => voiceOff(50)
    ),
    new Keybind(
        "KeyE",
        () => voiceOn(51, 127),
        () => voiceOff(51)
    ),
    new Keybind(
        "KeyD",
        () => voiceOn(52, 127),
        () => voiceOff(52)
    ),
    new Keybind(
        "KeyF",
        () => voiceOn(53, 127),
        () => voiceOff(53)
    ),
    new Keybind(
        "KeyT",
        () => voiceOn(54, 127),
        () => voiceOff(54)
    ),
    new Keybind(
        "KeyG",
        () => voiceOn(55, 127),
        () => voiceOff(55)
    ),
    new Keybind(
        "KeyY",
        () => voiceOn(56, 127),
        () => voiceOff(56)
    ),
    new Keybind(
        "KeyH",
        () => voiceOn(57, 127),
        () => voiceOff(57)
    ),
    new Keybind(
        "KeyU",
        () => voiceOn(58, 127),
        () => voiceOff(58)
    ),
    new Keybind(
        "KeyJ",
        () => voiceOn(59, 127),
        () => voiceOff(59)
    ),
    new Keybind(
        "KeyK",
        () => voiceOn(60, 127),
        () => voiceOff(60)
    ),
    new Keybind("KeyQ", () => {
        if (settings.style.visibility == "visible") {
            settings.style.visibility = "hidden";
        } else {
            settings.style.visibility = "visible";
        }
    }),
    new Keybind("Space", () => {
        location.reload();
    }),
    new Keybind("Equal", () => {
        octave++;
        for (let notes = 0; notes < notesOn.length; notes++) {
            notesOn[notes].bye();
            notesOn.splice(notes, 1);
        }
    }),
    new Keybind("Minus", () => {
        octave--;
        for (let notes = 0; notes < notesOn.length; notes++) {
            notesOn[notes].bye();
            notesOn.splice(notes, 1);
        }
    }),
    new Keybind("KeyX", () => {
        for (let notes = 0; notes < notesOn.length; notes++) {
            notesOn[notes].bye();
            notesOn.splice(notes, 1);
        }
    }),
];

main();
function main() {
    setTimeout(main, 100);
    draw();
}
