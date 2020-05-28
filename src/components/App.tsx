import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";
import { randomColor } from "../myLibrary";
import EnvelopePanel from "./EnvelopePanel";
import SynthSettings from "../SynthSettings";

interface AppProps {
    settings: SynthSettings;
}

const App: FunctionComponent<AppProps> = (props: PropsWithChildren<AppProps>) => {
    const backgroundColor = randomColor();
    return (
        <div>
            <div
                id="leftBox"
                style={{
                    backgroundColor: backgroundColor,
                    height: `${window.innerHeight - (window.innerWidth / 100) * 2}`,
                }}
            >
                <h1>Wave:</h1>
                <select
                    onChange={(e) => {
                        props.settings.oscType = e.target.value as OscillatorType;
                    }}
                    value={props.settings.oscType}
                >
                    <option value="sine">Sine</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                </select>
                <h1>Pitch Attack:</h1>
                <input
                    onChange={(e) => {
                        props.settings.pitch.a[1] = Number(e.target.value);
                    }}
                    value={props.settings.pitch.a[1]}
                />
                <select
                    onChange={(e) => {
                        props.settings.pitchAttackType = e.target.value;
                    }}
                >
                    <option value="high">High</option>
                    <option value="low">Low</option>
                    <option value="port">Portamento</option>
                </select>
                <EnvelopePanel title="Filter" envelope={props.settings.filter}>
                    Filter Q:
                    <input
                        style={{ width: "7vw" }}
                        onChange={(e) => {
                            props.settings.fQ = parseInt(e.target.value);
                        }}
                        value={props.settings.fQ}
                    />
                </EnvelopePanel>
                <EnvelopePanel title="Volume" envelope={props.settings.volume} />
            </div>

            <canvas id="scopeBox" width={window.innerWidth / 2} height={window.innerHeight}></canvas>

            <div
                id="rightBox"
                style={{
                    backgroundColor: backgroundColor,
                    height: `${window.innerHeight - (window.innerWidth / 100) * 2}`,
                }}
            >
                <h1>LFO:</h1>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        props.settings.lfoOnOff = e.target.checked;
                    }}
                />
                <h1>LFO Mode:</h1>
                <select
                    onChange={(e) => {
                        props.settings.lfoMode = e.target.value;
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
                        props.settings.lfoType = e.target.value as OscillatorType;
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
                        props.settings.lfoSpeed = Number(e.target.value);
                    }}
                />
                <h1>LFO Depth:</h1>
                <input
                    onChange={(e) => {
                        props.settings.lfoDepth = Number(e.target.value);
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
                        props.settings.modWheel = e.target.value;
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
