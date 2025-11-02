import { JSX, useState } from "react";

const buttons: Array<SettingsButton> = [
    {label: "General"}
]

export default function Navigation(): JSX.Element{
    // by default it will always be general
    const [selectedSetting, setSelectedSetting] = useState(buttons[0].label);
    
    return (
        <>
            <div className={`h-full w-[35%] bg-gray-500/60 absolute 
            settings-left-panel p-2`}>
                {buttons.map((ele) => (
                    <div className="w-full h-8 rounded-xl hover:bg-gray-300 flex items-center p-3">
                        <span className="flex items-center text-xl">
                            {ele.label}
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
}

type SettingsButton = {
    label: string,
}