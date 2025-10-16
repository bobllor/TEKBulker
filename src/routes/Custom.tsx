import { JSX, useState } from "react";
import ManualForm from "../components/FormComponents/ManualForm";
import { handleDivClick } from "../components/FormComponents/manualUtils/functions";

export default function Custom({style, formState}: ManualProps): JSX.Element{
    const [selectedCell, setSelectedCell] = useState<string>('');

    return (
        <>
            <div
            onClick={e => handleDivClick(e, selectedCell, setSelectedCell)}
            className={style}>
                <ManualForm formState={formState} 
                select={{selectedCell: selectedCell, setSelectedCell: setSelectedCell}}/>
            </div>
        </>
    )
}

type ManualProps = {
    style: string,
    formState: {
        state: boolean,
        func: React.Dispatch<React.SetStateAction<boolean>>
    }
}