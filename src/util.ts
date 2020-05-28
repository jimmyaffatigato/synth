export function noteFrequency(hs: number, fixedNote = 440): number {
    const x = Math.pow(2, 1 / 12);
    const freq = fixedNote * Math.pow(x, hs);
    return freq;
}
export function midiToFreq(midiNote: number, temp?: number): number {
    const halfSteps = midiNote - 57;
    return noteFrequency(halfSteps, temp);
}
export function randomColor(): string {
    return "#" + Math.random().toString(16).slice(-6);
}
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomWave(): OscillatorType {
    switch (randomInt(0, 3)) {
        case 0:
            return "sine";
        case 1:
            return "sawtooth";
        case 2:
            return "square";
        case 3:
            return "triangle";
    }
}
