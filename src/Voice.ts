import Synth from "./Synth";
import { midiToFreq } from "./util";
import Envelope from "./Envelope";

export default class Voice {
    synth: Synth;
    note: number;
    vel: number;
    freq: number;
    osc: OscillatorNode;
    oscGain: GainNode;
    filter: BiquadFilterNode;
    volume: GainNode;
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
        this.osc.frequency.value = this.freq;
        this.oscGain = new GainNode(synth.au);
        this.osc.type = synth.settings.oscType;
        this.oscGain.gain.value = this.vel;
        this.filter = new BiquadFilterNode(synth.au);
        this.filter.type = "lowpass";
        this.filter.Q.value = synth.settings.fQ;
        this.volume = new GainNode(synth.au);
        this.panner = new StereoPannerNode(synth.au);

        //LFO 1
        this.lfo = new OscillatorNode(synth.au);
        this.lfoGain = new GainNode(synth.au);
        this.lfoOnOff = synth.settings.lfoOnOff;
        this.lfo.type = synth.settings.lfoType;
        this.lfo.frequency.value = synth.settings.lfoSpeed * synth.speedMult;
        this.lfoGain.gain.value = synth.settings.lfoDepth * synth.depthMult;

        //Connections
        this.osc.connect(this.oscGain);
        this.oscGain.connect(this.filter);
        this.filter.connect(this.volume);
        this.volume.connect(this.panner);
        this.panner.connect(synth.gain);

        this.lfo.connect(this.lfoGain);
        switch (synth.settings.lfoMode) {
            case "vol":
                this.lfoGain.gain.value = synth.settings.lfoDepth;
                this.lfoGain.connect(this.oscGain.gain);
                break;
            case "fil":
                this.lfoGain.gain.value = synth.settings.filter.d[0] * synth.settings.lfoDepth + 100;
                this.lfoGain.connect(this.filter.frequency);
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
        const pitchEnv = this.synth.settings.pitch;
        const filterEnv = this.synth.settings.filter;
        const volumeEnv = this.synth.settings.volume;
        this.startEnvelope(this.osc.frequency, pitchEnv, this.osc.frequency.value);
        this.startEnvelope(this.filter.frequency, filterEnv);
        this.startEnvelope(this.volume.gain, volumeEnv);
    }
    public bye() {
        const pitchEnv = this.synth.settings.pitch;
        const filterEnv = this.synth.settings.filter;
        const volumeEnv = this.synth.settings.volume;
        this.endEnvelope(this.osc.frequency, pitchEnv, this.osc.frequency.value);
        this.endEnvelope(this.filter.frequency, filterEnv);
        this.endEnvelope(this.volume.gain, volumeEnv);

        this.osc.stop(this.synth.au.currentTime + 4);
    }
    public startEnvelope(param: AudioParam, envelope: Envelope, base: number = 0): void {
        param.setTargetAtTime(base + envelope.a[0], this.synth.au.currentTime, envelope.a[1]);
        param.setTargetAtTime(base + envelope.d[0], this.synth.au.currentTime + envelope.a[1], envelope.d[1]);
    }
    public endEnvelope(param: AudioParam, envelope: Envelope, base: number = 0): void {
        param.setTargetAtTime(base + envelope.s[0], this.synth.au.currentTime, envelope.s[1]);
        param.setTargetAtTime(base + envelope.r[0], this.synth.au.currentTime + envelope.s[1], envelope.r[1]);
    }
}
