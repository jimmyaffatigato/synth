import * as React from "react";
import { FunctionComponent, PropsWithChildren, useEffect, useState } from "react";
import ParamView from "./ParamView";
import Envelope from "../Envelope";
import styles from "./EnvelopePanel.css";

interface EnvelopePanelProps {
    title: string;
    envelope: Envelope;
    setEnvelope: (envelope: Envelope) => void;
}

const EnvelopePanel: FunctionComponent<EnvelopePanelProps> = (props: PropsWithChildren<EnvelopePanelProps>) => {
    const [attack, setAttack] = useState(props.envelope.a);
    const [decay, setDecay] = useState(props.envelope.d);
    const [sustain, setSustain] = useState(props.envelope.s);
    const [release, setRelease] = useState(props.envelope.r);
    const updateEnvelope = () => {
        props.setEnvelope(new Envelope(attack, decay, sustain, release));
    };
    return (
        <div className={styles.envelopePanel}>
            <table>
                <thead>
                    <tr>
                        <td colSpan={3} style={{ textAlign: "center" }}>
                            <h1>{props.title}</h1>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <ParamView
                        title="Attack"
                        values={attack}
                        setValues={(values: [number, number]) => {
                            setAttack(values);
                            updateEnvelope();
                        }}
                    />
                    <ParamView
                        title="Decay"
                        values={decay}
                        setValues={(values: [number, number]) => {
                            setDecay(values);
                            updateEnvelope();
                        }}
                    />
                    <ParamView
                        title="Sustain"
                        values={sustain}
                        setValues={(values: [number, number]) => {
                            setSustain(values);
                            updateEnvelope();
                        }}
                    />
                    <ParamView
                        title="Release"
                        values={release}
                        setValues={(values: [number, number]) => {
                            setRelease(values);
                            updateEnvelope();
                        }}
                    />
                    {props.children}
                </tbody>
            </table>
        </div>
    );
};

export default EnvelopePanel;
