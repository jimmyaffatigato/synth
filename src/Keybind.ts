import Synth from "./Synth";

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

export const startKeyboard = (synth: Synth): void => {
    const keybinds = [
        keybindNote("KeyA", synth, 48),
        keybindNote("KeyW", synth, 49),
        keybindNote("KeyS", synth, 50),
        keybindNote("KeyE", synth, 51),
        keybindNote("KeyD", synth, 52),
        keybindNote("KeyF", synth, 53),
        keybindNote("KeyT", synth, 54),
        keybindNote("KeyG", synth, 55),
        keybindNote("KeyY", synth, 56),
        keybindNote("KeyH", synth, 57),
        keybindNote("KeyU", synth, 58),
        keybindNote("KeyJ", synth, 59),
        keybindNote("KeyK", synth, 60),
        new Keybind("Space", () => {
            location.reload();
        }),
        new Keybind("Equal", () => {
            synth.octave++;
            for (let notes = 0; notes < synth.notesOn.length; notes++) {
                synth.notesOn[notes].bye();
                synth.notesOn.splice(notes, 1);
            }
        }),
        new Keybind("Minus", () => {
            synth.octave--;
            for (let notes = 0; notes < synth.notesOn.length; notes++) {
                synth.notesOn[notes].bye();
                synth.notesOn.splice(notes, 1);
            }
        }),
        new Keybind("KeyX", () => {
            for (let notes = 0; notes < synth.notesOn.length; notes++) {
                synth.notesOn[notes].bye();
                synth.notesOn.splice(notes, 1);
            }
        }),
    ];

    window.onkeydown = (event: KeyboardEvent) => {
        if (!event.repeat) {
            keybinds.forEach((keybind) => {
                if (event.code == keybind.key) {
                    keybind.onDown();
                }
            });
        }
    };

    window.onkeyup = (event: KeyboardEvent) => {
        keybinds.forEach((keybind) => {
            if (event.code == keybind.key) {
                if (keybind.onUp) keybind.onUp();
            }
        });
    };
};

function keybindNote(key: string, synth: Synth, note: number): Keybind {
    return new Keybind(
        key,
        () => synth.voiceOn(note, 127),
        () => synth.voiceOff(note)
    );
}
