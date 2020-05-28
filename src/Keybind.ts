export default class Keybind {
    public key: string;
    public onDown: () => void;
    public onUp: () => void;
    constructor(key: string, onDown: () => void, onUp?: () => void) {
        this.key = key;
        this.onDown = onDown;
        this.onUp = onUp;
    }
}
