import * as React from "react";
import { FunctionComponent, PropsWithChildren, useEffect } from "react";
import { randomColor } from "../util";
import EnvelopePanel from "./EnvelopePanel";
import SynthSettings from "../SynthSettings";
import Oscilloscope from "./Oscilloscope";
import Synth from "../synthClass";

interface AppProps {
    synth: Synth;
}

const App: FunctionComponent<AppProps> = (props: PropsWithChildren<AppProps>) => {
    const backgroundColor = randomColor();
    return (
        <div className="synth">
            <div
                className="column"
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <h1>Wave:</h1>
                <select
                    onChange={(e) => {
                        props.synth.settings.oscType = e.target.value as OscillatorType;
                    }}
                    value={props.synth.settings.oscType}
                >
                    <option value="sine">Sine</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                </select>
                <EnvelopePanel title="Pitch" envelope={props.synth.settings.pitch}></EnvelopePanel>

                <EnvelopePanel title="Filter" envelope={props.synth.settings.filter}>
                    <tr>
                        <td>Filter Q</td>
                        <td>
                            <input
                                style={{ width: "7vw" }}
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    props.synth.settings.fQ = parseInt(e.target.value);
                                }}
                                value={props.synth.settings.fQ}
                            />
                        </td>
                    </tr>
                </EnvelopePanel>
                <EnvelopePanel title="Volume" envelope={props.synth.settings.volume} />
            </div>

            <Oscilloscope synth={props.synth} />

            <div
                className="column"
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <h1>LFO:</h1>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        props.synth.settings.lfoOnOff = e.target.checked;
                    }}
                />
                <h1>LFO Mode:</h1>
                <select
                    onChange={(e) => {
                        props.synth.settings.lfoMode = e.target.value;
                    }}
                >
                    <option value="vol">Volume</option>
                    <option value="fil">Filter</option>
                    <option value="pitch">Pitch</option>
                    <option value="pan">Pan</option>
                </select>
                <h1>LFO Type:</h1>
                <select
                    onChange={(e) => {
                        props.synth.settings.lfoType = e.target.value as OscillatorType;
                    }}
                >
                    <option value="sine">Sine</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                </select>
                <h1>LFO Speed:</h1>
                <input
                    onChange={(e) => {
                        props.synth.settings.lfoSpeed = Number(e.target.value);
                    }}
                />
                <h1>LFO Depth:</h1>
                <input
                    onChange={(e) => {
                        props.synth.settings.lfoDepth = Number(e.target.value);
                    }}
                />
                <h1>Pitch Wheel:</h1>
                <select>
                    <option>Pitch Bend</option>
                    <option>LFO Speed</option>
                    <option>LFO Depth</option>
                    <option>Volume</option>
                    <option>Filter Frequency</option>
                </select>
                <h1>Mod Wheel:</h1>
                <select
                    onChange={(e) => {
                        props.synth.settings.modWheel = e.target.value;
                    }}
                >
                    <option value="speed">LFO Speed</option>
                    <option value="depth">LFO Depth</option>
                    <option value="vol">Volume</option>
                    <option value="fil">Filter Frequency</option>
                    <option value="pitch">Pitch Bend</option>
                </select>
                <h1>Volume Knob:</h1>
                <select>
                    <option>Volume</option>
                    <option>LFO Speed</option>
                    <option>LFO Depth</option>
                    <option>Filter Frequency</option>
                    <option>Pitch Bend</option>
                </select>
            </div>
        </div>
    );
};

export default App;
