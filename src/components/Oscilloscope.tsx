import * as React from "react";
import { FunctionComponent, PropsWithChildren, useRef, useEffect, useState } from "react";
import Synth from "../Synth";

interface OscilloscopeProps {
    scope: AnalyserNode;
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
    const draw = (ctx: CanvasRenderingContext2D, scope: AnalyserNode) => {
        scope.fftSize = 2048;
        const bufferLength = 1024;
        const dataArray = new Uint8Array(bufferLength);
        scope.getByteTimeDomainData(dataArray);
        scope.getByteTimeDomainData(dataArray);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 10;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        const sliceWidth = (ctx.canvas.width * 1.0) / bufferLength;
        for (let i = 0, x = 0; i < bufferLength; i++, x += sliceWidth) {
            const v = dataArray[i] / 128.0;
            const y = (v * ctx.canvas.height) / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
        ctx.stroke();
    };

    const update = (ctx: CanvasRenderingContext2D) => {
        setTimeout(() => {
            update(ctx);
        }, 100);
        draw(ctx, props.scope);
    };
    return (
        <div className="oscilloscope">
            <canvas ref={canvas} width={width} height={height} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
};

export default Oscilloscope;
