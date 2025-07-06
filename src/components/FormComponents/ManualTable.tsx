import { JSX, useState } from "react";
import { tableHeaders } from "./manualUtils/vars";
import { ManualData } from "./manualUtils/types";
import TableData from "./TableData";

export default function ManualTable({manualData, setManualData}: 
    {manualData: ManualData[], setManualData: React.Dispatch<React.SetStateAction<Array<ManualData>>>}): JSX.Element{
    
    // uses the ID of manualData to display the cell
    const [selectedCell, setSelectedCell] = useState<string>('');

    return (
        <>
            <table
            className="w-full text-left">
                <thead className="uppercase bg-gray-200">
                    <tr>
                        {tableHeaders.map((header, i) => (
                            <th key={i}
                            className="px-4 py-1 w-25 text-center">{header}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {manualData.map((obj, i) => (
                        <tr
                        className="border-b-1 border-gray-400" 
                        key={i}>
                            <TableData 
                            id={obj.name! + obj.id}
                            data={obj.name!}
                            maxLength={16}
                            select={{curr: selectedCell, setCurr: setSelectedCell}} 
                            manData={{manualData: manualData, setManualData: setManualData}} />
                            <TableData 
                            id={obj.opco! + obj.id}
                            data={obj.opco!}
                            maxLength={20}
                            select={{curr: selectedCell, setCurr: setSelectedCell}} 
                            manData={{manualData: manualData, setManualData: setManualData}} />
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