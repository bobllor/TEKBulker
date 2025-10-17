import { toast } from "react-toastify";

export function toaster(msg: string, type: "error" | "info" | "success" | "warning", duration: number = 3000): void{
    toast(
        msg,
        {
            position: "top-center",
            type: type,
            closeOnClick: true, 
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: duration,
        }
    )
}