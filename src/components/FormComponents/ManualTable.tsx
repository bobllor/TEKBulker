import { JSX, useState } from "react";
import { tableHeaders } from "./manualUtils/vars";
import { ManualData } from "./manualUtils/types";
import { showInput } from "./manualUtils/functions";

export default function ManualTable({manualData, setManualData}: 
    {manualData: ManualData[], setManualData: React.Dispatch<React.SetStateAction<ManualData[]>>}): JSX.Element{
    
    // uses the ID of manualData to display the cell
    const [selectedCell, showSelectedCell] = useState<string>('');

    return (
        <>
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
                            <td
                            onDoubleClick={() => showSelectedCell(obj.id! + obj.name)}
                            className="px-4 py-2 relative">
                                {obj.name!.length < 16 ? obj.name : obj.name!.slice(0, 16) + '...'}
                                {obj.id! + obj.name == selectedCell && <div
                                className="absolute z-3 top-[50%] bg-white border-1 p-3">
                                    <input className="border-1 p-2 rounded-xl w-30"
                                    spellCheck={false}
                                    type="text" defaultValue={obj.name} />
                                </div>}
                            </td>
                            <td
                            className="px-4 py-2">
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
            </table>
        </>
    )
}