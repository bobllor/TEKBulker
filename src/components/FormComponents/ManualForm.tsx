import { useState, useRef, JSX } from "react";
import { addEntry } from "./manualUtils/functions";
import { formInputs, tableHeaders } from "./manualUtils/vars";
import { useManualData } from "./manualUtils/hooks";
import { FormStateProps } from "./manualUtils/types";

/** Form for manual entries instead of reading an Excel file. */
export default function ManualForm({formState}:{
        formState: FormStateProps}
    ): JSX.Element{
    const divRef: React.RefObject<HTMLDivElement|null> = useRef(null);

    const [manualData, setManualData] = useManualData(formState);
    
    // TODO: add editing for each column later
    const [selectedCell, setSelectedCell] = useState<HTMLTableCellElement>();

    return (
        <>
            <div
            className="flex flex-col gap-3 pb-5"
            ref={divRef}>
                {formInputs.map((obj, i) => (
                    <input name={obj.name}
                    id={obj.name}
                    className="border-1 px-3 py-1 rounded-xl"
                    onKeyDown={(e) => e.key == 'Enter' && addEntry(divRef, setManualData)}
                    type="text" key={i} />
                ))}
                <button
                onClick={() => addEntry(divRef, setManualData)}>Submit</button>
            </div>
            <div
            className="relative overflow-y-scroll min-w-150 max-w-150 min-h-60 max-h-60">
                {manualData.length > 0 ? 
                <table
                className="w-full text-left">
                    <thead className="uppercase bg-gray-200">
                        <tr>
                            {tableHeaders.map((header, i) => (
                                <th key={i}
                                className="px-4 py-1">{header}</th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {manualData.map((obj, i) => (
                            <tr
                            className="border-b-1 border-gray-400" 
                            key={i}>
                                <td className="px-4 py-2">
                                    {obj.name!.length < 16 ? obj.name : obj.name!.slice(0, 16) + '...'}
                                </td>
                                <td className="px-4 py-2">
                                    {obj.opco!.length < 20 ? obj.opco : obj.opco!.slice(0, 20) + '...'}
                                </td>
                                <td 
                                onClick={() => setManualData(prev => prev.filter((_, id) => {
                                    return id != i;
                                }))}>
                                    D
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> :
                <div
                className="w-full flex justify-center items-center bg-gray-200 px-4 py-1 uppercase">
                    <p><strong>No entries entered</strong></p>
                </div>
                }
            </div>
        </>
    )
}