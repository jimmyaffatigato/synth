import * as React from "react";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import EnvelopePanel from "./EnvelopePanel";
import Oscilloscope from "./Oscilloscope";
import Synth from "../synth";
import Column from "./Column";
import Selector from "./Selector";
import Envelope from "../Envelope";

export interface SynthComponentProps {
    synth: Synth;
    backgroundColor: string;
}

const SynthComponent: FunctionComponent<SynthComponentProps> = (props: PropsWithChildren<SynthComponentProps>) => {
    const [wave, setWave] = useState(props.synth.settings.oscType);
    const [pitchEnvelope, setPitchEnvelope] = useState(props.synth.settings.pitch);
    const [filterEnvelope, setFilterEnvelope] = useState(props.synth.settings.filter);
    const [volumeEnvelope, setVolumeEnvelope] = useState(props.synth.settings.volume);
    const [filterQ, setFilterQ] = useState(props.synth.settings.fQ);
    return (
        <div className="synth">
            <Column color={props.backgroundColor}>
                <Selector
                    title="Wave"
                    setValue={(value: string) => {
                        setWave(value as OscillatorType);
                    }}
                    value={wave}
                    options={[
                        { id: "sine", label: "Sine" },
                        { id: "sawtooth", label: "Sawtooth" },
                        { id: "square", label: "Square" },
                        { id: "triangle", label: "Triangle" },
                    ]}
                />
                <EnvelopePanel
                    title="Pitch"
                    envelope={pitchEnvelope}
                    setEnvelope={(envelope: Envelope) => {
                        setPitchEnvelope(envelope);
                        props.synth.settings.pitch = pitchEnvelope;
                    }}
                />

                <EnvelopePanel
                    title="Filter"
                    envelope={filterEnvelope}
                    setEnvelope={(envelope: Envelope) => {
                        setFilterEnvelope(envelope);
                        props.synth.settings.filter = filterEnvelope;
                    }}
                >
                    <tr>
                        <td>Filter Q</td>
                        <td>
                            <input
                                style={{ width: "7vw" }}
                                onChange={(e) => {
                                    setFilterQ(parseInt(e.target.value));
                                }}
                                onBlur={(e) => {
                                    props.synth.settings.fQ = filterQ;
                                }}
                                value={filterQ}
                            />
                        </td>
                    </tr>
                </EnvelopePanel>
                <EnvelopePanel
                    title="Volume"
                    envelope={volumeEnvelope}
                    setEnvelope={(envelope: Envelope) => {
                        setVolumeEnvelope(envelope);
                        props.synth.settings.volume = volumeEnvelope;
                    }}
                />
            </Column>

            <Oscilloscope scope={props.synth.scope} />

            <Column color={props.backgroundColor}>
                <h1>LFO:</h1>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        props.synth.settings.lfoOnOff = e.target.checked;
                    }}
                />
                <Selector
                    title="LFO Mode"
                    setValue={(value: string) => {
                        props.synth.settings.lfoMode = value;
                    }}
                    value={props.synth.settings.lfoMode}
                    options={[
                        { id: "vol", label: "Volume" },
                        { id: "fil", label: "Filter" },
                        { id: "pitch", label: "Pitch" },
                        { id: "pan", label: "Pan" },
                    ]}
                />
                <Selector
                    title="LFO Type"
                    setValue={(value: string) => {
                        props.synth.settings.lfoType = value as OscillatorType;
                    }}
                    value={props.synth.settings.oscType}
                    options={[
                        { id: "sine", label: "Sine" },
                        { id: "sawtooth", label: "Sawtooth" },
                        { id: "square", label: "Square" },
                        { id: "triangle", label: "Triangle" },
                    ]}
                />
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
            </Column>
        </div>
    );
};

export default SynthComponent;
