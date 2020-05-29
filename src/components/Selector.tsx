import * as React from "react";
import { FunctionComponent, PropsWithChildren, useState } from "react";

interface SelectorProps {
    title: string;
    setValue: (value: string) => void;
    value: string;
    options: { id: string; label: string }[];
}

const Selector: FunctionComponent<SelectorProps> = (props: PropsWithChildren<SelectorProps>) => {
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setValue(e.target.value);
    };
    return (
        <div className="selector">
            <h1>{props.title}</h1>
            <select onChange={onChange} value={props.value}>
                {props.options.map((option, i) => (
                    <option value={option.id} key={i}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;
