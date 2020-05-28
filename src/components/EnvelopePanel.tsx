import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";
import ParamView from "./ParamView";
import Envelope from "../Envelope";

interface EnvelopePanelProps {
    title: string;
    envelope: Envelope;
}

const EnvelopePanel: FunctionComponent<EnvelopePanelProps> = (props: PropsWithChildren<EnvelopePanelProps>) => {
    return (
        <div style={{ borderStyle: "solid", borderColor: "white", padding: "1vw" }}>
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
                </tbody>
            </table>
            {props.children}
        </div>
    );
};

export default EnvelopePanel;
