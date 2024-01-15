import { Routes, Route } from "react-router-dom";
import Homepage from "./views/Homepage";

function Navbar() {
  return (
    <div className="text-center my-10 text-xl font-bold">
      <h1>D3.js 基本圖表</h1>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
}

export default App;
