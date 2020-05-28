import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";
import ParamView from "./ParamView";
import Envelope from "../Envelope";
import styles from "./EnvelopePanel.css";

interface EnvelopePanelProps {
    title: string;
    envelope: Envelope;
}

const EnvelopePanel: FunctionComponent<EnvelopePanelProps> = (props: PropsWithChildren<EnvelopePanelProps>) => {
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
                    <ParamView title="Attack" values={props.envelope.a} />
                    <ParamView title="Delay" values={props.envelope.d} />
                    <ParamView title="Sustain" values={props.envelope.s} />
                    <ParamView title="Release" values={props.envelope.r} />
                    {props.children}
                </tbody>
            </table>
        </div>
    );
};

export default EnvelopePanel;
