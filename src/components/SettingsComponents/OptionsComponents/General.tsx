import { JSX, useState } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";
import SliderButton from "../../ui/SliderButton";
import Button from "../../ui/Button";

const title: string = "General";
const options: Array<OptionProps> = [
    {label: "Output Folder", element: <Button text="Select Folder" paddingX={2} paddingY={2} />},
    {label: "Flatten CSV", element: <SliderButton func={() => console.log("placeholder")} />},
    {label: "Format Type", element: <></> },
    {label: "Format Style", element: <></> },
    {label: "Format Case", element: <></> },
    {label: "Generate Text", element: <SliderButton func={() => console.log("placeholder")} />},
]

export default function General(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}