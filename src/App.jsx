import NavbarMobile from "./components/navbar/NavbarMobile";
import NavbarDesktop from "./components/navbar/NavbarDesktop";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Planning from "./pages/Planning";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Compte from "./pages/Compte";
import Reservation from "./pages/Reservation";
import Wrapper from "./pages/Wrapper";

export default function App() {
  return (
    <BrowserRouter>
      {/* Desktop + contenu */}
      <div className="hidden md:flex h-screen">
        <NavbarDesktop /> {/* sidebar desktop */}
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Planning />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reservation" element={<Wrapper><Reservation /></Wrapper>} />
          </Routes>
        </main>
      </div>

      <NavbarMobile />
      {/* Mobile content */}
      <div className="md:hidden p-4">
        <Routes>
          <Route path="/" element={<Planning />} />
          <Route path="/compte" element={<Compte />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservation" element={<Wrapper><Reservation /></Wrapper>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
