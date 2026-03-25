import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/common/NavbarComponent";
import Test from "./components/common/Test"
// import Component from "./components/common/Component";

import './index.css'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavbarComponent/>} />
        <Route path="/test1" element={<Test />} />
        {/* <Route path="/test2" element={<Component/>}/> */}
      </Routes>
    </>
  );
}

export default App;
