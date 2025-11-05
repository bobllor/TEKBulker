import React, { JSX, useState } from "react";
import { SliderButtonProps } from "./types";

export default function SliderButton({func}: {func: (...args: any[]) => any}): JSX.Element{
    const [active, setActive] = useState(false);

    return (
        <>
            <div
            onClick={() => onClick(active, setActive, func)}
            className={`flex rounded-3xl items-center w-10 h-6 relative px-0.5
                ${!active ? "bg-white justify-start" : "bg-blue-500 justify-end"}`}>
                <div 
                className="rounded-2xl bg-blue-300 w-5 h-5 "/>
            </div>
        </>
    )
}

async function onClick(
    buttonStatus: boolean, 
    setButtonStatus: React.Dispatch<React.SetStateAction<boolean>>, 
    func: (...args: any[]) => any){
        setButtonStatus(prev => !prev);

        func(setButtonStatus);
}