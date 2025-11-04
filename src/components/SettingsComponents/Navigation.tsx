import React, { JSX, useState } from "react";
import { SettingsButton } from "./types";
import Button from "./NavigationComponents/Button";

export default function Navigation({buttons, selectedSetting, setSelectedSetting}: NavigationProps): JSX.Element{
    return (
        <div className={`h-full w-[35%] bg-gray-500/60 absolute 
        settings-left-panel p-2`}>
            {buttons.map((ele, i) => (
                <React.Fragment
                key={i}>
                    <Button opts={ele}
                    selectedSetting={selectedSetting} setSelectedSetting={setSelectedSetting} /> 
                </React.Fragment>
            ))}
        </div>
    )
}

type NavigationProps = {
    buttons: Array<SettingsButton>,
    selectedSetting: string,
    setSelectedSetting: React.Dispatch<React.SetStateAction<string>>,
}