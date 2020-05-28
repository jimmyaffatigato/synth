import { devices } from "./html";
import { Voice, pre, syn, au, volControl } from "./synth";

export const notesOn = [];
function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator
            .requestMIDIAccess({
                sysex: false,
            })
            .then(midiContext);
    }
    function midiContext(MIDIAccess) {
        const midi = MIDIAccess;
        const inputs = [];
        var input;
        if (midi.inputs.size > 0) {
            for (let h = 0; h < 9; h++) {
                if (midi.inputs.get(h) != undefined) {
                    var tex = document.createTextNode(midi.inputs.get(h).name);
                    var opt = document.createElement("OPTION");
                    opt.setAttribute("value", String(h));
                    opt.appendChild(tex);
                    devices.appendChild(opt);
                }
            }
            input = midi.inputs.get(devices.value);
            input.onmidimessage = onMIDIMessage;
        } else {
            var tex = document.createTextNode("No Device");
            var opt = document.createElement("OPTION");
            opt.appendChild(tex);
            devices.appendChild(opt);
        }
    }
    function onMIDIMessage(event) {
        const data = event.data;
        switch (data[0]) {
            case 144:
                //Note On
                if (data[2] > 0) {
                    var newVoice = new Voice(data[1], data[2]);
                    notesOn.push(newVoice);
                    newVoice.go();
                }
                //Note Off
                else {
                    for (let notes = 0; notes < notesOn.length; notes++) {
                        if (notesOn[notes].note == data[1]) {
                            notesOn[notes].bye();
                            notesOn[notes].osc.onended = notesOn.splice(notes, 1);
                        }
                    }
                    break;
                }
            case 176:
                //Mod Wheel
                if (data[1] == 1) {
                    switch (pre.modWheel) {
                        case "pitch":
                            syn.bend = data[2] / 127;
                            for (let notes = 0; notes < notesOn.length; notes++) {
                                notesOn[notes].osc.frequency.setTargetAtTime(
                                    notesOn[notes].freq * (syn.bend + 1),
                                    au.currentTime,
                                    0
                                );
                            }
                            break;
                        case "speed":
                            syn.speedMult = data[2] / 64;
                            for (let notes = 0; notes < notesOn.length; notes++) {
                                notesOn[notes].lfo.frequency.setTargetAtTime(
                                    pre.lfoSpeed * syn.speedMult,
                                    au.currentTime,
                                    0
                                );
                            }
                            break;
                            break;
                        case "depth":
                            syn.depthMult = data[2] / 64;
                            for (let notes = 0; notes < notesOn.length; notes++) {
                                notesOn[notes].lfoGain.gain.setTargetAtTime(
                                    pre.lfoDepth * syn.depthMult,
                                    au.currentTime,
                                    0
                                );
                            }
                            break;
                        case "vol":
                            volControl.gain.value = data[2] / 127;
                        case "fil":
                            break;
                    }
                }
                //Volume Knob
                if (data[1] == 7) {
                    volControl.gain.value = data[2] / 127;
                }
                break;
        }
    }
}
openMIDI();
