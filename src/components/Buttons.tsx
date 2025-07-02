import { JSX, useEffect } from "react";
import { NavigateFunction } from "react-router";
import { useNavigate } from "react-router";
import { useModalContext } from "../context/ModalContext";
import { FormStateProps } from "./FormComponents/manualUtils/types";

const buttons: Array<{label: string, url: string}> = [
    {label: 'Home', url: '/'},
    {label: 'Manual', url: '/manual'}
]

export default function Buttons({formState}: {formState: FormStateProps}
    ): JSX.Element{
    const buttonStyle: string = '';

    let navigate: NavigateFunction = useNavigate();

    const { revealModal } = useModalContext();

    async function clickWrapper(url: string): Promise<void>{
      if(window.location.pathname == url) return;

      // only used if a form has been edited before navigation
      if(formState.state){
        const action: boolean = await revealModal('Changes you made are not saved. Are you sure you want to leave?');

        if(!action){
          return;
        }

        formState.func(false);
      }

      navigate(url);
    }
    
    return (
        <>  
            {buttons.map((obj, i) => (
              <div key={i}
              onClick={() => clickWrapper(obj.url)}
              className={""}>
                {obj.label}
              </div>
            ))}
        </>
    )
}