import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favs from "./pages/Favs";
import NavBar from "./components/NavBar";
import { FavProvider } from "./context/FavContext";

function App() {
  return (
    <FavProvider>
      <NavBar />
      <main className="p-8 flex-1 flex flex-col box-border">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/favorites" element={<Favs />} />
        </Routes>
      </main>
    </FavProvider>
  );
}

export default App;
