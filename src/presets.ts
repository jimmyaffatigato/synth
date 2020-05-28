import { randomWave, randomInt } from "./myLibrary";

//Array of preset objects
export const presets = [
    {
        oscType: randomWave(),
        port: randomInt(0, 1),
        pitchAttackType: "high",
        p: { a: [0, Math.random() * 0.1] },
        f: {
            a: [randomInt(0, 10000), Math.random() * 0.25],
            d: [randomInt(0, 10000), Math.random() * 0.25],
            s: [randomInt(0, 10000), Math.random()],
            r: [randomInt(0, 10000), Math.random() * 0.25],
        },
        v: {
            a: [Math.random(), Math.random() * 0.25],
            d: [Math.random(), Math.random() * 0.25],
            s: [Math.random(), Math.random()],
            r: [0, Math.random() * 0.25],
        },
        fQ: randomInt(1, 25),
        lfoOnOff: Math.random() > 0.5 ? true : false,
        lfoSpeed: Math.random() * 10,
        lfoDepth: Math.random(),
        lfoType: randomWave(),
        lfoMode: "fil",
        modWheel: "depth",
        bendWheel: "pitch",
        volControl: 1,
        randomize: function () {
            switch (randomInt(0, 2)) {
                case 0:
                    this.lfoMode = "vol";
                    break;
                case 1:
                    this.lfoMode = "fil";
                    break;
                case 2:
                    this.lfoMode = "pan";
                    break;
            }
            switch (randomInt(1, 2)) {
                case 0:
                    this.pitchAttackType = "high";
                    break;
                case 1:
                    this.pitchAttackType = "low";
                    break;
                case 2:
                    this.pitchAttackType = "port";
                    break;
            }
        },
    },
];
presets[0].randomize();
