import { midiToFreq } from "./myLibrary";
import SynthSettings from "./SynthSettings";

const noteFlags = [];
for (let k = 0; k < 127; k++) {
    noteFlags.push(true);
}

export default class Synth {
    public au: AudioContext;
    public gain: GainNode;
    public scope: AnalyserNode;
    public settings: SynthSettings;
    public notesOn;
    public octave;
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
    }
    public voiceOn(note: number, velocity: number) {
        note += 12 * this.octave;
        if (noteFlags[note] == true) {
            const newVoice = new Voice(this, note, velocity);
            this.notesOn.push(newVoice);
            newVoice.go();
            noteFlags[note] = false;
        }
    }
    public voiceOff(note: number) {
        note += 12 * this.octave;
        noteFlags[note] = true;
        for (let notes = 0; notes < this.notesOn.length; notes++) {
            if (this.notesOn[notes].note == note) {
                this.notesOn[notes].bye();
                this.notesOn.splice(notes, 1);
            }
        }
    }
}

export const syn = {
    port: 0,
    bend: 0,
    speedMult: 1,
    depthMult: 1,
};

export class Voice {
    synth: Synth;
    note: number;
    vel: number;
    freq: number;
    osc: OscillatorNode;
    oscGain: GainNode;
    filEnv: BiquadFilterNode;
    volEnv: GainNode;
    panner: StereoPannerNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    lfoOnOff: boolean;
    constructor(synth: Synth, note: number, vel: number) {
        this.synth = synth;
        this.note = note;
        this.vel = vel / 127;
        this.freq = midiToFreq(note);
        this.osc = new OscillatorNode(synth.au);
        this.oscGain = new GainNode(synth.au);
        this.osc.type = synth.settings.oscType;
        this.oscGain.gain.value = this.vel;
        this.filEnv = new BiquadFilterNode(synth.au);
        this.filEnv.type = "lowpass";
        this.filEnv.Q.value = synth.settings.fQ;
        this.volEnv = new GainNode(synth.au);
        this.panner = new StereoPannerNode(synth.au);
        const bufferSize = 2 * synth.au.sampleRate,
            noiseBuffer = synth.au.createBuffer(1, bufferSize, synth.au.sampleRate),
            output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random();
        }

        //LFO 1
        this.lfo = new OscillatorNode(synth.au);
        this.lfoGain = new GainNode(synth.au);
        this.lfoOnOff = synth.settings.lfoOnOff;
        this.lfo.type = synth.settings.lfoType;
        this.lfo.frequency.value = synth.settings.lfoSpeed * syn.speedMult;
        this.lfoGain.gain.value = synth.settings.lfoDepth * syn.depthMult;

        //Connections
        this.osc.connect(this.oscGain);
        this.oscGain.connect(this.filEnv);
        this.filEnv.connect(this.volEnv);
        this.volEnv.connect(this.panner);
        this.panner.connect(synth.gain);

        this.lfo.connect(this.lfoGain);
        switch (synth.settings.lfoMode) {
            case "vol":
                this.lfoGain.gain.value = synth.settings.lfoDepth;
                this.lfoGain.connect(this.oscGain.gain);
                break;
            case "fil":
                this.lfoGain.gain.value = synth.settings.filter.d[0] * synth.settings.lfoDepth + 100;
                this.lfoGain.connect(this.filEnv.frequency);
                break;
            case "pan":
                this.lfoGain.gain.value = synth.settings.lfoDepth;
                this.lfoGain.connect(this.panner.pan);
                break;
            case "pitch":
                this.lfoGain.gain.value = this.freq * synth.settings.lfoDepth;
                this.lfoGain.connect(this.osc.frequency);
                break;
        }

        this.osc.start();
        if (synth.settings.lfoOnOff == true) {
            this.lfo.start();
        }
    }
    public go() {
        switch (this.synth.settings.pitchAttackType) {
            case "high":
                syn.port = 2400;
                break;
            case "low":
                syn.port = 0;
                break;
            case "port":
                break;
        }
        const bent = this.freq * (syn.bend + 1);
        this.osc.frequency.setTargetAtTime(syn.port, this.synth.au.currentTime, 0);
        syn.port = this.freq;
        this.osc.frequency.setTargetAtTime(bent, this.synth.au.currentTime, this.synth.settings.pitch.a[1]);
        this.filEnv.frequency.setTargetAtTime(0, this.synth.au.currentTime, 0);
        this.filEnv.frequency.setTargetAtTime(
            this.synth.settings.filter.a[0],
            this.synth.au.currentTime,
            this.synth.settings.filter.a[1]
        );
        this.filEnv.frequency.setTargetAtTime(
            this.synth.settings.filter.d[0],
            this.synth.au.currentTime + this.synth.settings.filter.a[1],
            this.synth.settings.filter.d[1]
        );
        this.volEnv.gain.setTargetAtTime(0, this.synth.au.currentTime, 0);
        this.volEnv.gain.setTargetAtTime(
            this.synth.settings.volume.a[0],
            this.synth.au.currentTime,
            this.synth.settings.volume.a[1]
        );
        this.volEnv.gain.setTargetAtTime(
            this.synth.settings.volume.d[0],
            this.synth.au.currentTime + this.synth.settings.volume.a[1],
            this.synth.settings.volume.d[1]
        );
    }
    public bye() {
        this.filEnv.frequency.setTargetAtTime(
            this.synth.settings.filter.s[0],
            this.synth.au.currentTime,
            this.synth.settings.filter.s[1]
        );
        this.filEnv.frequency.setTargetAtTime(
            this.synth.settings.filter.r[0],
            this.synth.au.currentTime + this.synth.settings.filter.s[1],
            this.synth.settings.filter.r[1]
        );
        this.volEnv.gain.setTargetAtTime(
            this.synth.settings.volume.s[0],
            this.synth.au.currentTime,
            this.synth.settings.volume.s[1]
        );
        this.volEnv.gain.setTargetAtTime(
            this.synth.settings.volume.r[0],
            this.synth.au.currentTime + this.synth.settings.volume.s[1],
            this.synth.settings.volume.r[1]
        );
        this.osc.stop(this.synth.au.currentTime + 4);
    }
}
