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
    constructor(settings: SynthSettings = SynthSettings.random()) {
        this.oscType = settings.oscType;
        this.port = settings.port;
        this.pitchAttackType = settings.pitchAttackType;
        this.pitch = settings.pitch.clone();
        this.filter = settings.filter.clone();
        this.volume = settings.volume.clone();
        this.fQ = settings.fQ;
        this.lfoOnOff = settings.lfoOnOff;
        this.lfoSpeed = settings.lfoSpeed;
        this.lfoMode = settings.lfoMode;
        this.modWheel = settings.modWheel;
        this.bendWheel = settings.bendWheel;
        this.volControl = settings.volControl;
    }
    public static random() {
        return {
            oscType: randomWave(),
            port: randomInt(0, 1),
            pitchAttackType: "high",
            pitch: new Envelope([0, Math.random() * 0.1], [0, 0], [0, 0], [0, 0]),
            filter: new Envelope(
                [randomInt(0, 10000), Math.random() * 0.25],
                [randomInt(0, 10000), Math.random() * 0.25],
                [randomInt(0, 10000), Math.random()],
                [randomInt(0, 10000), Math.random() * 0.25]
            ),
            volume: new Envelope(
                [Math.random(), Math.random() * 0.25],
                [Math.random(), Math.random() * 0.25],
                [Math.random(), Math.random()],
                [0, Math.random() * 0.25]
            ),
            fQ: randomInt(1, 25),
            lfoOnOff: Math.random() > 0.5 ? true : false,
            lfoSpeed: Math.random() * 10,
            lfoDepth: Math.random(),
            lfoType: randomWave(),
            lfoMode: "fil",
            modWheel: "depth",
            bendWheel: "pitch",
            volControl: 1,
        };
    }
}
