import { Reducer } from "redux";
import { AppProps } from "../components/App";
import Synth from "../Synth";
import SynthSettings from "../SynthSettings";

interface SynthAction {
    type: string;
}

let initState = { synth: new Synth(new AudioContext(), SynthSettings.random()) };

const synthSettingChanger: Reducer<AppProps, SynthAction> = (state: AppProps = initState, action): AppProps => {
    const newState = { synth: new Synth(state.synth.au, new SynthSettings(state.synth.settings)) };
    if (action.type == "SYNTH") {
    }
    const saveFile = JSON.stringify(newState);
    localStorage.setItem("save", saveFile);
    return newState;
};

export default synthSettingChanger;
