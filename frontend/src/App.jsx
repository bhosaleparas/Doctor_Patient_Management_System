import { Routes, Route } from "react-router-dom";
import NavScrollExample from "./components/common/Navbar";
import Test from "./components/common/Test";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flowbite';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavScrollExample />} />
        <Route path="/test1" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
