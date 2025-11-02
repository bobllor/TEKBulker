import React, { JSX } from "react";
import BackgroundBlur from "../components/ui/BackgroundBlur";
import Navigation from "../components/SettingsComponents/Navigation";
import General from "../components/SettingsComponents/General";

export default function Settings({setShowSetting}: 
        {setShowSetting: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element{
    return (
        <>
            <div
            className={`absolute w-150 h-100 z-4 bg-white settings-modal-border`}> 
                <Navigation />
                <General />
            </div> 
            <BackgroundBlur setComponentState={setShowSetting} />
        </>
    )
}