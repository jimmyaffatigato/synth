import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";
import { randomColor } from "../util";
import Synth from "../synth";
import SynthComponent from "./SynthComponent";

export interface AppProps {
    synth: Synth;
}

const App: FunctionComponent<AppProps> = (props: PropsWithChildren<AppProps>) => {
    return <SynthComponent synth={props.synth} backgroundColor={randomColor()} />;
};

export default App;
