import Envelope from "./Envelope";
import { randomInt, randomWave } from "./util";

export default class SynthSettings {
    oscType: OscillatorType;
    port: number;
    pitchAttackType: string;
    pitch: Envelope;
    filter: Envelope;
    volume: Envelope;
    fQ: number;
    lfoOnOff: boolean;
    lfoSpeed: number;
    lfoDepth: number;
    lfoType: OscillatorType;
    lfoMode: string;
    modWheel: string;
    bendWheel: string;
    volControl: number;
    constructor() {}
    public static random(): SynthSettings {
        const ss = new SynthSettings();
        ss.oscType = randomWave();
        ss.port = randomInt(0, 1);
        ss.pitchAttackType = "high";
        ss.pitch = { a: [0, Math.random() * 0.1], d: [0, 0], s: [0, 0], r: [0, 0] };
        ss.filter = {
            a: [randomInt(0, 10000), Math.random() * 0.25],
            d: [randomInt(0, 10000), Math.random() * 0.25],
            s: [randomInt(0, 10000), Math.random()],
            r: [randomInt(0, 10000), Math.random() * 0.25],
        };
        ss.volume = {
            a: [Math.random(), Math.random() * 0.25],
            d: [Math.random(), Math.random() * 0.25],
            s: [Math.random(), Math.random()],
            r: [0, Math.random() * 0.25],
        };
        ss.fQ = randomInt(1, 25);
        ss.lfoOnOff = Math.random() > 0.5 ? true : false;
        ss.lfoSpeed = Math.random() * 10;
        ss.lfoDepth = Math.random();
        ss.lfoType = randomWave();
        ss.lfoMode = "fil";
        ss.modWheel = "depth";
        ss.bendWheel = "pitch";
        ss.volControl = 1;
        return ss;
    }
}
