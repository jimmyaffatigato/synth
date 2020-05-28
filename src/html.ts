/// <reference lib="dom" />

import { randomColor } from "./myLibrary";
import { pre, scope, Voice, au } from "./synth";
import { notesOn } from "./midi";

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
export const noise = document.getElementById("settings") as HTMLInputElement & { checked: boolean };

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
    pre.oscType = oscType.value;
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
    pre.lfoType = lfoType.value;
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
var scopeContext = scopeBox.getContext("2d");
scope.fftSize = 2048;
var bufferLength = 1024;
var dataArray = new Uint8Array(bufferLength);
scope.getByteTimeDomainData(dataArray);
function draw() {
    scope.getByteTimeDomainData(dataArray);
    scopeContext.fillStyle = document.body.style.backgroundColor;
    scopeContext.fillRect(0, 0, scopeBox.width, scopeBox.height);
    scopeContext.lineWidth = 10;
    scopeContext.strokeStyle = leftBox.style.backgroundColor;
    scopeContext.beginPath();
    var sliceWidth = (scopeBox.width * 1.0) / bufferLength;
    var x = 0;
    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = (v * scopeBox.height) / 2;
        if (i === 0) {
            scopeContext.moveTo(x, y);
        } else {
            scopeContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    scopeContext.lineTo(scopeBox.width, scopeBox.height / 2);
    scopeContext.stroke();
}

const noteFlags = [];
for (let k = 0; k < 127; k++) {
    noteFlags.push(true);
}
function voiceOn(note, velocity) {
    note += 12 * octave;
    if (noteFlags[note] == true) {
        var newVoice = new Voice(note, velocity);
        notesOn.push(newVoice);
        newVoice.go();
        noteFlags[note] = false;
    }
}
function voiceOff(note) {
    note += 12 * octave;
    noteFlags[note] = true;
    for (let notes = 0; notes < notesOn.length; notes++) {
        if (notesOn[notes].note == note) {
            notesOn[notes].bye();
            notesOn.splice(notes, 1);
        }
    }
}
var octave = 1;
window.onkeydown = function (event: KeyboardEvent) {
    switch (event.key) {
        case "a":
            voiceOn(48, 32);
            break;
        case "w":
            voiceOn(49, 32);
            break;
        case "s":
            voiceOn(50, 32);
            break;
        case "e":
            voiceOn(51, 32);
            break;
        case "d":
            voiceOn(52, 32);
            break;
        case "f":
            voiceOn(53, 32);
            break;
        case "t":
            voiceOn(54, 32);
            break;
        case "g":
            voiceOn(55, 32);
            break;
        case "y":
            voiceOn(56, 32);
            break;
        case "h":
            voiceOn(57, 32);
            break;
        case "u":
            voiceOn(58, 32);
            break;
        case "j":
            voiceOn(59, 32);
            break;
        case "k":
            voiceOn(60, 32);
            break;
        case "o":
            voiceOn(60, 127);
            break;
        case "l":
            voiceOn(60, 127);
            break;
        case "p":
            voiceOn(60, 127);
            break;
        case ";":
            voiceOn(60, 127);
            break;
        case "'":
            voiceOn(60, 127);
            break;
        case "A":
            voiceOn(48, 127);
            break;
        case "W":
            voiceOn(49, 127);
            break;
        case "S":
            voiceOn(50, 127);
            break;
        case "E":
            voiceOn(51, 127);
            break;
        case "D":
            voiceOn(52, 127);
            break;
        case "F":
            voiceOn(53, 127);
            break;
        case "T":
            voiceOn(54, 127);
            break;
        case "G":
            voiceOn(55, 127);
            break;
        case "Y":
            voiceOn(56, 127);
            break;
        case "H":
            voiceOn(57, 127);
            break;
        case "U":
            voiceOn(58, 127);
            break;
        case "J":
            voiceOn(59, 127);
            break;
        case "K":
            voiceOn(60, 127);
            break;
        case "O":
            voiceOn(60, 127);
            break;
        case "L":
            voiceOn(60, 127);
            break;
        case "P":
            voiceOn(60, 127);
            break;
        case ":":
            voiceOn(60, 127);
            break;
        case '"':
            voiceOn(60, 127);
            break;
        case "q":
            if (settings.style.visibility == "visible") {
                settings.style.visibility = "hidden";
            } else {
                settings.style.visibility = "visible";
            }
            break;
        case " ":
            location.reload();
            break;
        case "=":
        case "+":
            octave++;
            for (let notes = 0; notes < notesOn.length; notes++) {
                notesOn[notes].bye();
                notesOn.splice(notes, 1);
            }
            break;
        case "_":
        case "-":
            octave--;
            for (let notes = 0; notes < notesOn.length; notes++) {
                notesOn[notes].bye();
                notesOn.splice(notes, 1);
            }
            break;
        case "x":
        case "X":
            for (let notes = 0; notes < notesOn.length; notes++) {
                notesOn[notes].bye();
                notesOn.splice(notes, 1);
            }
    }
};

window.onkeyup = function (event: KeyboardEvent) {
    switch (event.key) {
        case "a":
        case "A":
            voiceOff(48);
            break;
        case "w":
        case "W":
            voiceOff(49);
            break;
        case "s":
        case "S":
            voiceOff(50);
            break;
        case "e":
        case "E":
            voiceOff(51);
            break;
        case "d":
        case "D":
            voiceOff(52);
            break;
        case "f":
        case "F":
            voiceOff(53);
            break;
        case "t":
        case "T":
            voiceOff(54);
            break;
        case "g":
        case "G":
            voiceOff(55);
            break;
        case "y":
        case "Y":
            voiceOff(56);
            break;
        case "h":
        case "H":
            voiceOff(57);
            break;
        case "u":
        case "U":
            voiceOff(58);
            break;
        case "j":
        case "J":
            voiceOff(59);
            break;
        case "k":
        case "K":
            voiceOff(60);
            break;
        case "o":
        case "O":
            voiceOff(61);
            break;
        case "l":
        case "L":
            voiceOff(62);
            break;
        case "p":
        case "P":
            voiceOff(63);
            break;
        case ";":
        case ":":
            voiceOff(64);
            break;
        case "'":
        case '"':
            voiceOff(65);
            break;
    }
};

main();
function main() {
    setTimeout(main, 100);
    draw();
}
