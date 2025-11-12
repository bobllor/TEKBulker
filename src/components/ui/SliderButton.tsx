import React, { JSX, useState } from "react";
import { SliderButtonProps } from "./types";

/**
 * Creates a new SliderButton. Contains a `status` boolean state
 * which can be used with `func`. The boolean argument should be last in `func`.
 * @param func - Any function. SliderButton has a `status` boolean state and the 
 * function can use this if `useStatus` is true.
 * @param useStatus - Indicates that the `status` state should be passed with `func`.
 * @returns jsxElement
 */
export default function SliderButton({func, useStatus = false}: {func: (...args: any[]) => any, useStatus?: boolean}): JSX.Element{
    const [status, setStatus] = useState(false);

    return (
        <>
            <div
            onClick={() => onClick(status, setStatus, func)}
            className={`flex rounded-3xl items-center w-10 h-6 relative px-0.5
                ${!status ? "bg-white justify-start" : "bg-blue-500 justify-end"}
                transition-all duration-400`}>
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