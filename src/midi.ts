import { devices } from "./html";
import { Voice, pre, syn, synth } from "./synth";

export const notesOn = [];
function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator
            .requestMIDIAccess({
                sysex: false,
            })
            .then((midi) => {
                midi.inputs.forEach((input) => {
                    input.onmidimessage = onMIDIMessage;
                });
            });
    }
}

function onMIDIMessage(event: WebMidi.MIDIMessageEvent): void {
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
                                synth.au.currentTime,
                                0
                            );
                        }
                        break;
                    case "speed":
                        syn.speedMult = data[2] / 64;
                        for (let notes = 0; notes < notesOn.length; notes++) {
                            notesOn[notes].lfo.frequency.setTargetAtTime(
                                pre.lfoSpeed * syn.speedMult,
                                synth.au.currentTime,
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
                                synth.au.currentTime,
                                0
                            );
                        }
                        break;
                    case "vol":
                        synth.gain.gain.value = data[2] / 127;
                    case "fil":
                        break;
                }
            }
            //Volume Knob
            if (data[1] == 7) {
                synth.gain.gain.value = data[2] / 127;
            }
            break;
    }
}

openMIDI();
