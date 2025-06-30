import { Routes, Route } from "react-router";
import Buttons from "./components/Buttons";
import Manual from "./routes/Manual";
import Home from "./routes/Home";

const fullPageStyle = 'h-screen w-screen flex flex-col justify-center items-center overflow-hidden relative'

export default function App() {
  return (
    <> 
      <div className={fullPageStyle}>
        <div>
          <Buttons />
        </div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/manual' element={<Manual style={fullPageStyle}/>} />
        </Routes>
      </div>
    </>
  )
}