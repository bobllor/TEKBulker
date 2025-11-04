import { JSX } from "react";
import { Outlet } from "react-router";

export default function Options(): JSX.Element{
    return (
        <>
            <div className={`h-full w-[65%] bg-gray-200 absolute right-0
            settings-right-panel`}>
                <Outlet />
            </div>
        </>
    )
}