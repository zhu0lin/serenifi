import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./features/MapPage/MapPage";
import Layout from "./Layout";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/ >}>

            <Route path="/" element={<MapPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
