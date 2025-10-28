import { JSX } from "react";

export default function BackgroundBlur(): JSX.Element{
    return (
        <>
            <div className="bg-gray-300/60 blur-lg absolute w-full h-full" />
        </>
    )    
}