import * as React from "react";
import { FunctionComponent, PropsWithChildren, useRef, useEffect, useState } from "react";
import Synth from "../synth";

interface OscilloscopeProps {
    draw: (ctx: CanvasRenderingContext2D, synth: Synth) => void;
    synth: Synth;
}

const Oscilloscope: FunctionComponent<OscilloscopeProps> = (props: PropsWithChildren<OscilloscopeProps>) => {
    const canvas = useRef<HTMLCanvasElement>();
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    useEffect(() => {
        const ctx = canvas.current.getContext("2d");
        setWidth(Number(canvas.current.getBoundingClientRect().width));
        setHeight(Number(canvas.current.getBoundingClientRect().height));
        update(ctx);
    });
    const update = (ctx: CanvasRenderingContext2D) => {
        setTimeout(() => {
            update(ctx);
        }, 100);
        props.draw(ctx, props.synth);
    };
    return (
        <div className="oscilloscope">
            <canvas ref={canvas} width={width} height={height} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
};

export default Oscilloscope;
