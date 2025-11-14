import { JSX } from "react";
import OptionBase from "./OptionBase";
import { OptionProps } from "../types";
import SliderButton from "../../ui/SliderButton";
import Button from "../../ui/Button";
import "../../../pywebview";
import { SettingsData, useSettingsContext } from "../../../context/SettingsContext";
import { setOutputDir, setTextGenerationState } from "../functions";

const title: string = "General";

export default function General(): JSX.Element{
    const {apiSettings, setApiSettings} = useSettingsContext();
    const options: Array<OptionProps> = [
        {
            label: "Output Folder", 
            element: <Button text="Select Folder" paddingX={2} paddingY={2} 
                func={() => setOutputDir(setApiSettings)} type="button" />, 
            optElement: OutputFolder(apiSettings.output_dir),
        },
        {label: "Flatten CSV", element: <></>},
        {label: "Format Type", element: <></> },
        {label: "Format Style", element: <></> },
        {label: "Format Case", element: <></> },
        {label: "Generate Text", element: GenerateTextSlider(apiSettings.template.enabled, setApiSettings)},
    ]

    return (
        <>
            <OptionBase options={options} title={title} />
        </>
    )
}

function OutputFolder(outputDir: string): JSX.Element{
    return (
        <>
            <span
            title={outputDir.length >= 20 ? outputDir : ""}>
                {outputDir.length < 20 ? outputDir : outputDir.slice(0, 20) + "..."}
            </span>        
        </>
    )
}

function GenerateTextSlider(templateStatus: boolean, setApiSettings: SettingsData["setApiSettings"]): JSX.Element{
    return (
        <SliderButton 
        initialStatus={templateStatus} 
        func={(state: boolean) => setTextGenerationState(state, setApiSettings)} />
    )
}