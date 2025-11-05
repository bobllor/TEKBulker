import { JSX, useState } from "react";
import { OpcoMap, OptionProps } from "../types";
import OptionBase from "./OptionBase";
import { useOpcoInit } from "../hooks";

const title: string = "Operating Companies";

export default function OpcoMapping(): JSX.Element{
    const [opcoOptions, setOpcoOptions] = useState<Array<OpcoMap>>([]);

    // NOTE: strict mode renders this twice.
    useOpcoInit(setOpcoOptions);

    return (
        <>
            {opcoOptions.length == 0 
                ? <div>NOT FOUND</div>
                :
                opcoOptions.map((opco, i) => (
                    <div
                    key={i}>
                        {opco.value}
                    </div>
                ))
            }
        </>
    )
}