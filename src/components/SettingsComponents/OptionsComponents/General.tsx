import { JSX, useState } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";
import SliderButton from "../../ui/SliderButton";

const title: string = "General";
const options: Array<OptionProps> = [
    {label: "Output Folder", element: <></>},
    {label: "Test", element: <SliderButton func={() => console.log("placeholder")} />},
]

export default function General(): JSX.Element{
    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}