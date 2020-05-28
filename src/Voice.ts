import Synth from "./synthClass";
import { midiToFreq } from "./util";

export default class Voice {
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
        this.lfo.frequency.value = synth.settings.lfoSpeed * synth.speedMult;
        this.lfoGain.gain.value = synth.settings.lfoDepth * synth.depthMult;

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
        const bent = this.freq * (this.synth.bend + 1);
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
