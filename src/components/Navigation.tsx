import { JSX } from "react";
import { NavigateFunction } from "react-router";
import { useNavigate } from "react-router";
import { useModalContext } from "../context/ModalContext";
import { FormStateProps } from "./FormComponents/manualUtils/types";

const buttons: Array<{label: string, url: string}> = [
    {label: 'Home', url: '/'},
    {label: 'Custom', url: '/custom'}
]

export default function Navigation({formState}: {formState: FormStateProps}
    ): JSX.Element{
    let navigate: NavigateFunction = useNavigate();

    const { revealModal } = useModalContext();

    async function clickWrapper(url: string): Promise<void>{
      // FIXME: when its ready to be packaged into an app this has to be changed.
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
              className={`py-1 px-2 w-20 flex justify-center items-center rounded-xl bg-gray-300
              hover:bg-gray-500/60`}>
                {obj.label}
              </div>
            ))}
        </>
    )
}