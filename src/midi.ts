import Synth from "./synth";
import SynthSettings from "./SynthSettings";

/*

export default function openMIDI() {
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
                synth.notesOn.push(newVoice);
                newVoice.go();
            }
            //Note Off
            else {
                for (let notes = 0; notes < synth.notesOn.length; notes++) {
                    if (synth.notesOn[notes].note == data[1]) {
                        synth.notesOn[notes].bye();
                        synth.notesOn[notes].osc.onended = synth.notesOn.splice(notes, 1);
                    }
                }
                break;
            }
        case 176:
            //Mod Wheel
            if (data[1] == 1) {
                switch (settings.modWheel) {
                    case "pitch":
                        syn.bend = data[2] / 127;
                        for (let notes = 0; notes < synth.notesOn.length; notes++) {
                            synth.notesOn[notes].osc.frequency.setTargetAtTime(
                                synth.notesOn[notes].freq * (syn.bend + 1),
                                synth.au.currentTime,
                                0
                            );
                        }
                        break;
                    case "speed":
                        syn.speedMult = data[2] / 64;
                        for (let notes = 0; notes < synth.notesOn.length; notes++) {
                            synth.notesOn[notes].lfo.frequency.setTargetAtTime(
                                settings.lfoSpeed * syn.speedMult,
                                synth.au.currentTime,
                                0
                            );
                        }
                        break;
                        break;
                    case "depth":
                        syn.depthMult = data[2] / 64;
                        for (let notes = 0; notes < synth.notesOn.length; notes++) {
                            synth.notesOn[notes].lfoGain.gain.setTargetAtTime(
                                settings.lfoDepth * syn.depthMult,
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
*/
