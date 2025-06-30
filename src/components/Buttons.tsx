import { JSX } from "react";
import { Link } from "react-router";
import { NavigateFunction } from "react-router";
import { useNavigate } from "react-router";

const buttons: Array<{label: string, url: string}> = [
    {label: 'Home', url: '/'},
    {label: 'Manual', url: '/manual'}
]

export default function Buttons(): JSX.Element{
    const buttonStyle: string = '';

    let navigate: NavigateFunction = useNavigate();
    
    return (
        <>  
            {buttons.map((obj, i) => (
              <div key={i}
              onClick={() => navigate(obj.url)}
              className={""}>
                {obj.label}
              </div>
            ))}
        </>
    )
}