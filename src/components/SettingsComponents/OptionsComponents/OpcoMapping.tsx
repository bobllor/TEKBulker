import { JSX, useState } from "react";
import { OptionProps } from "../types";
import OptionBase from "./OptionBase";

const title: string = "Operating Companies";

export default function OpcoMapping(): JSX.Element{
    // TODO: use context to load operating companies from backend
    // NOTES: how do i approach this?
    const [opcoOptions, setOpcoOptions] = useState<Array<OptionProps>>([]);

    return (
        <>
            <OptionBase options={opcoOptions} title={title} />
        </>
    )
}