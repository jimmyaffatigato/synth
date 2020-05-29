import SynthSettings from "./SynthSettings";
import Voice from "./Voice";

export default class Synth {
    public au: AudioContext;
    public gain: GainNode;
    public scope: AnalyserNode;
    public settings: SynthSettings;
    public notesOn: Voice[];
    public octave: number;
    public speedMult: number;
    public depthMult: number;
    constructor(au: AudioContext, settings: SynthSettings) {
        this.au = au;
        this.settings = settings;
        this.octave = 1;
        this.gain = new GainNode(au);
        this.gain.gain.value = 0.5;
        this.scope = new AnalyserNode(au);
        this.gain.connect(this.scope);
        this.scope.connect(au.destination);
        this.notesOn = [];
        this.speedMult = 1;
        this.depthMult = 1;
    }
    public voiceOn(note: number, velocity: number) {
        note += 12 * this.octave;
        const voice = new Voice(this, note, velocity);
        this.notesOn.push(voice);
        voice.go();
    }
    public voiceOff(note: number) {
        note += 12 * this.octave;
        this.notesOn = this.notesOn.filter((voice) => {
            let keep = false;
            voice.note == note ? voice.bye() : (keep = true);
            return keep;
        });
    }
}
