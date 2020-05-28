import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";

interface ParamViewProps {
    title: string;
    values: [number, number];
}

const ParamView: FunctionComponent<ParamViewProps> = (props: PropsWithChildren<ParamViewProps>) => {
    return (
        <tr>
            <td>{props.title}</td>
            <td>
                <input
                    style={{ width: "7vw" }}
                    onChange={(e) => {
                        props.values[1] = Number(e.target.value);
                    }}
                    value={props.values[1].toFixed(2)}
                />
            </td>
            <td>
                <input
                    style={{ width: "7vw" }}
                    onChange={(e) => {
                        props.values[0] = Number(e.target.value);
                    }}
                    value={props.values[0].toFixed(2)}
                />
            </td>
        </tr>
    );
};

export default ParamView;
