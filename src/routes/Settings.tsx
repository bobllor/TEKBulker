import React, { JSX, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import BackgroundBlur from "../components/ui/BackgroundBlur";
import Navigation from "../components/SettingsComponents/Navigation";
import General from "../components/SettingsComponents/General";
import { BORDER_COLOR, OUTER_BORDER_THICKNESS, OUTER_MODAL_ROUNDING } from "../components/SettingsComponents/vars";

export default function Settings({setShowSetting}: 
        {setShowSetting: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element{
    const location = useLocation();
    const navigate = useNavigate();
    const settingsRef = useRef(null);

    useEffect(() => {
        const closeSettings = () => {
            navigate(location.state?.previousLocation || "/");
            setShowSetting(false);
        }
        const onClick = (e: MouseEvent) => {
            if(e.target != settingsRef.current){
                closeSettings();
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            switch(e.key){
                case "Escape":
                    closeSettings();
                default:
                    return;
            }
        }

        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("click", onClick);
        }
    }, [])

    return (
        <>
            <div
            ref={settingsRef}
            className={`absolute w-150 h-100 z-3 bg-white ${OUTER_MODAL_ROUNDING}
            ${OUTER_BORDER_THICKNESS} border-${BORDER_COLOR}`}> 
                <Navigation />
                <General />
            </div> 
            <BackgroundBlur />
        </>
    )
}