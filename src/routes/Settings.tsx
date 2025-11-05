import React, { JSX, useState } from "react";
import BackgroundBlur from "../components/ui/BackgroundBlur";
import Navigation from "../components/SettingsComponents/Navigation";
import Options from "../components/SettingsComponents/Options";
import { SettingsButton } from "../components/SettingsComponents/types";

const buttons: Array<SettingsButton> = [
    {label: "General", url: ""},
    {label: "Headers", url: "headers-mapping"}
]

export default function Settings({setShowSetting}: 
    {setShowSetting: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element{
    const [selectedSetting, setSelectedSetting] = useState(buttons[0].label);

    return (
        <>
            <div
            className={`absolute w-200 h-150 z-4 bg-white settings-modal-border`}> 
                <Navigation buttons={buttons} 
                selectedSetting={selectedSetting} setSelectedSetting={setSelectedSetting} />
                <Options />
            </div> 
            <BackgroundBlur setComponentState={setShowSetting} />
        </>
    )
}