import React, { Dispatch } from "react";
import { InputDataProps } from "./types";
import { ManualData } from "./types";
import { formInputs } from "./vars";
import { toastError } from "../../../toastUtils";

export async function addEntry(
    divRef: React.RefObject<HTMLDivElement|null>,
    setData: Dispatch<React.SetStateAction<ManualData[]>>): Promise<void>{
    if(!divRef.current) return;

    const objTemp: ManualData = {};

    const objProps: Array<string> = ['name', 'opco'];

    // used to prevent the name and opco fields from being the same value.
    let nameInput: null|HTMLInputElement = null;
    let nameInputValue: null|string = null;
    
    // not sure if there is a better way to do this, i tried thinking about using refs in ManualForm but
    // it wouldn't work really well because of the loop to create the elements
    const inputElements: NodeListOf<HTMLInputElement> = divRef.current!.querySelectorAll('input');
    let index: number = 0;

    for(const input of inputElements){
        const value: string = input.value.trim();

        if(value == '' && input.id.includes('name')){
            toastError('Cannot have an empty entry in the name field.');
            return;
        }else if(nameInputValue == value){
            toastError('Cannot have two of the same value as an entry.');
            return;
        }

        if(!nameInput && !nameInputValue){
            nameInput = input;
            nameInputValue = input.value;
        }

        if(formInputs[index].name == input.id){
            objTemp[objProps[index]] = input.value;
        }

        index += 1;
    }

    // only resets the values if successful
    for(const input of inputElements){
        input.value = '';
    }

    firstInput?.focus();
    
    const id: string = Date.now().toString();
    objTemp['id'] = id;

    setData(prev => [...prev, objTemp]);
}

export function validateInput(event: React.ChangeEvent<HTMLInputElement>,
    setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>, 
    setDisableSubmit: React.Dispatch<React.SetStateAction<boolean>>){
        const elementName: string = event.currentTarget.name;
        const currValue: string = event.currentTarget.value;

        setInputData(prev => {
            const otherKey: string = Object.keys(prev).filter((key) => {return key != elementName})[0];
            const otherVal: string = prev[otherKey];
            
            if(otherVal == currValue && otherVal != '' && currValue != ''){
                setDisableSubmit(true);
            }else{
                setDisableSubmit(false);
            }

            return {...prev, [elementName]: currValue}
        })
}

export async function submitManualEntry(manualData: Array<ManualData>): Promise<void>{
    if(manualData.length == 0){
        toastError('Cannot generate CSV due to having no entries.');
        return;
    }

    let res: {status: string, message: string} = await window.pywebview.api.generate_manual_csv(manualData);
}

export function handleTableClick(event: React.MouseEvent<HTMLTableElement, MouseEvent>, 
        setSelectedCell: React.Dispatch<React.SetStateAction<string>>): void{
    console.log(event);
}