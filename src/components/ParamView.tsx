import * as React from "react";
import { FunctionComponent, PropsWithChildren, useState, useEffect } from "react";

interface ParamViewProps {
    title: string;
    values: [number, number];
    setValues: (values: [number, number]) => void;
}

const ParamView: FunctionComponent<ParamViewProps> = (props: PropsWithChildren<ParamViewProps>) => {
    const [value, setValue] = useState(props.values[0].toFixed(2));
    const [time, setTime] = useState(props.values[1].toFixed(2));
    useEffect(() => {});
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name == "value") setValue(e.target.value);
        if (e.target.name == "time") setTime(e.target.value);
    };
    const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setValues([Number(value), Number(time)]);
    };

    return (
        <tr>
            <td>{props.title}</td>
            <td>
                <input name={"time"} style={{ width: "7vw" }} onChange={onChange} onBlur={onBlur} value={time} />
            </td>
            <td>
                <input name={"value"} style={{ width: "7vw" }} onChange={onChange} onBlur={onBlur} value={value} />
            </td>
        </tr>
    );
};

export default ParamView;
