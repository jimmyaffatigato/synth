import { presets } from "./presets";
import { midiToFreq } from "./myLibrary";
import { settings, show } from "./html";

class Synth {
    public au: AudioContext;
    public gain: GainNode;
    public scope: AnalyserNode;
    constructor(au: AudioContext) {
        this.au = au;
        this.gain = new GainNode(au);
        this.gain.gain.value = 0.8;
        this.scope = new AnalyserNode(au);
        this.gain.connect(this.scope);
        this.scope.connect(au.destination);
    }
}

export const synth = new Synth(new AudioContext());

export let pre = presets[0];
export const syn = {
    port: 0,
    bend: 0,
    speedMult: 1,
    depthMult: 1,
};

export class Voice {
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
    constructor(note: number, vel: number) {
        this.note = note;
        this.vel = vel / 127;
        this.freq = midiToFreq(note);
        this.osc = new OscillatorNode(synth.au);
        this.oscGain = new GainNode(synth.au);
        this.osc.type = pre.oscType;
        this.oscGain.gain.value = this.vel;
        this.filEnv = new BiquadFilterNode(synth.au);
        this.filEnv.type = "lowpass";
        this.filEnv.Q.value = pre.fQ;
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
        this.lfoOnOff = pre.lfoOnOff;
        this.lfo.type = pre.lfoType;
        this.lfo.frequency.value = pre.lfoSpeed * syn.speedMult;
        this.lfoGain.gain.value = pre.lfoDepth * syn.depthMult;

        //Connections
        this.osc.connect(this.oscGain);
        this.oscGain.connect(this.filEnv);
        this.filEnv.connect(this.volEnv);
        this.volEnv.connect(this.panner);
        this.panner.connect(synth.gain);

        this.lfo.connect(this.lfoGain);
        switch (pre.lfoMode) {
            case "vol":
                this.lfoGain.gain.value = pre.lfoDepth;
                this.lfoGain.connect(this.oscGain.gain);
                break;
            case "fil":
                this.lfoGain.gain.value = pre.f.d[0] * pre.lfoDepth + 100;
                this.lfoGain.connect(this.filEnv.frequency);
                break;
            case "pan":
                this.lfoGain.gain.value = pre.lfoDepth;
                this.lfoGain.connect(this.panner.pan);
                break;
            case "pitch":
                this.lfoGain.gain.value = this.freq * pre.lfoDepth;
                this.lfoGain.connect(this.osc.frequency);
                break;
        }

        this.osc.start();
        if (pre.lfoOnOff == true) {
            this.lfo.start();
        }
    }
    public go() {
        switch (pre.pitchAttackType) {
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
        this.osc.frequency.setTargetAtTime(syn.port, synth.au.currentTime, 0);
        syn.port = this.freq;
        this.osc.frequency.setTargetAtTime(bent, synth.au.currentTime, pre.p.a[1]);
        this.filEnv.frequency.setTargetAtTime(0, synth.au.currentTime, 0);
        this.filEnv.frequency.setTargetAtTime(pre.f.a[0], synth.au.currentTime, pre.f.a[1]);
        this.filEnv.frequency.setTargetAtTime(pre.f.d[0], synth.au.currentTime + pre.f.a[1], pre.f.d[1]);
        this.volEnv.gain.setTargetAtTime(0, synth.au.currentTime, 0);
        this.volEnv.gain.setTargetAtTime(pre.v.a[0], synth.au.currentTime, pre.v.a[1]);
        this.volEnv.gain.setTargetAtTime(pre.v.d[0], synth.au.currentTime + pre.v.a[1], pre.v.d[1]);
    }
    public bye() {
        this.filEnv.frequency.setTargetAtTime(pre.f.s[0], synth.au.currentTime, pre.f.s[1]);
        this.filEnv.frequency.setTargetAtTime(pre.f.r[0], synth.au.currentTime + pre.f.s[1], pre.f.r[1]);
        this.volEnv.gain.setTargetAtTime(pre.v.s[0], synth.au.currentTime, pre.v.s[1]);
        this.volEnv.gain.setTargetAtTime(pre.v.r[0], synth.au.currentTime + pre.v.s[1], pre.v.r[1]);
        this.osc.stop(synth.au.currentTime + 4);
    }
}

function loadSettings() {
    const newPreset = JSON.parse(settings.value);
    pre = newPreset;
    show();
}
let code = "";
let url = window.location.href;
for (let y = 0; y < url.length; y++) {
    if (url[y - 1] == "?") {
        code = url.slice(y);
    }
}
if (code.length > 0) {
    code = decodeURIComponent(code);
    pre = JSON.parse(code);
    show();
}
