import SynthSettings from "./SynthSettings";
import Voice from "./Voice";

export default class Synth {
    public au: AudioContext;
    public gain: GainNode;
    public scope: AnalyserNode;
    public settings: SynthSettings;
    public notesOn: Voice[];
    public octave: number;
    private noteFlags: boolean[];
    public bend: number;
    public speedMult: number;
    public depthMult: number;
    constructor(au: AudioContext, settings: SynthSettings) {
        this.au = au;
        this.settings = settings;
        this.octave = 1;
        this.gain = new GainNode(au);
        this.gain.gain.value = 0.8;
        this.scope = new AnalyserNode(au);
        this.gain.connect(this.scope);
        this.scope.connect(au.destination);
        this.notesOn = [];
        this.noteFlags = [];
        for (let k = 0; k < 127; k++) {
            this.noteFlags.push(true);
        }
        this.bend = 0;
        this.speedMult = 1;
        this.depthMult = 1;
    }
    public voiceOn(note: number, velocity: number) {
        note += 12 * this.octave;
        if (this.noteFlags[note] == true) {
            const voice = new Voice(this, note, velocity);
            this.notesOn.push(voice);
            voice.go();
            this.noteFlags[note] = false;
        }
    }
    public voiceOff(note: number) {
        note += 12 * this.octave;
        this.noteFlags[note] = true;
        for (let notes = 0; notes < this.notesOn.length; notes++) {
            if (this.notesOn[notes].note == note) {
                this.notesOn[notes].bye();
                this.notesOn.splice(notes, 1);
            }
        }
    }
}
