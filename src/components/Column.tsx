import * as React from "react";
import { FunctionComponent, PropsWithChildren } from "react";

interface ColumnProps {
    color: string;
}

const Column: FunctionComponent<ColumnProps> = (props: PropsWithChildren<ColumnProps>) => {
    return (
        <div
            className="column"
            style={{
                backgroundColor: props.color,
            }}
        >
            {props.children}
        </div>
    );
};

export default Column;
