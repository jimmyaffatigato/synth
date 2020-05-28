export default class Envelope {
    a: [number, number];
    d: [number, number];
    s: [number, number];
    r: [number, number];
    constructor(a: [number, number], d: [number, number], s: [number, number], r: [number, number]) {
        this.a = a;
        this.d = d;
        this.s = s;
        this.r = r;
    }
    public clone(): Envelope {
        return new Envelope([...this.a], [...this.d], [...this.s], [...this.s]);
    }
}
