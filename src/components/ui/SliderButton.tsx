import React, { JSX, useEffect, useState } from "react";

/**
 * Creates a new SliderButton. Contains a `status` boolean state
 * which can be used with `func`. The boolean argument should be last in `func`.
 * @param func Any function. SliderButton has a `status` boolean state and the 
 * function can use this if `useStatus` is true
 * @param initialStatus The initial status of the button
 */
export default function SliderButton({func, initialStatus}: 
    {func: (...args: any[]) => any, initialStatus: boolean}): JSX.Element{

    return (
        <>
            <div
            onClick={() => func(initialStatus)}
            className={`flex rounded-3xl items-center w-10 h-6 relative px-0.5
                ${!initialStatus ? "bg-white justify-start" : "bg-blue-500 justify-end"}
                transition-all duration-400`}>
                <div 
                className="rounded-2xl bg-blue-300 w-5 h-5 "/>
            </div>
        </>
    )
}