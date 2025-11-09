import React, { useEffect } from "react";
import { OpcoMap, ReaderType } from "./types";

/**
 * Hook used to initialize the operating company mapping from the backend.
 * @param baseOpcoRef - A RefObject used to store the base values of `opcoOptions` from the call.
 * @param opcoKeysRef - The hash set of operating company keys, it is filled in the call.
 * @param setOpcoFunc - The React dispatch function for the operating company state.
 */
export function useOpcoInit(
    baseOpcoRef: React.RefObject<Array<OpcoMap>>,
    opcoKeysRef: React.RefObject<Set<string>>,
    setOpcoFunc: React.Dispatch<React.SetStateAction<Array<OpcoMap>>>,
    ){
        const setReaderContent = async (reader: ReaderType) => {
        await window.pywebview.api.get_reader_content(reader).then((res: Record<string, string>) => {
            const keys: Array<string> = Object.keys(res)

            let idCount: number = 0;
            keys.forEach(key => {
                const opco: OpcoMap = Object();

                opco.opcoKey = key;
                opco.value = res[key];
                opco.id = idCount.toString();
                
                idCount++;

                setOpcoFunc(prev => [...prev, opco]);
                opcoKeysRef.current.add(key);
                baseOpcoRef.current.push(opco);
            })
        })
        }

        const reader: ReaderType = "opco";

        useEffect(() => {
            setReaderContent(reader);
        }, [])
}