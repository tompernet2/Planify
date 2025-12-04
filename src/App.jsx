import NavbarMobile from "./components/navbar/NavbarMobile";
import NavbarDesktop from "./components/navbar/NavbarDesktop";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Planning from "./pages/Planning";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar mobile overlay */}
      <NavbarMobile />

      {/* Desktop + contenu */}
      <div className="hidden md:flex h-screen">
        <NavbarDesktop /> {/* sidebar desktop */}
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Planning />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>

      {/* Mobile content */}
      <div className="md:hidden p-4">
        <Routes>
          <Route path="/" element={<Planning />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
