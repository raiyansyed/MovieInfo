import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favs from "./pages/Favs";
import { FavProvider } from "./context/FavContext";
import {MovieDetails, NavBar, Recommendations} from './components/index.js'
function App() {
  return (
    <FavProvider>
      <NavBar />
      <main className="p-8 flex-1 flex flex-col box-border">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/favorites" element={<Favs />} />
          <Route path="/movie/:id" element={<MovieDetails/>} />
        </Routes>
      </main>
    </FavProvider>
  );
}

export default App;
