import { useState } from "react";
import { CgCalendarDates, CgProfile, CgEricsson } from "react-icons/cg";
import NavButton from "../ui/NavButton";

export default function NavbarDesktop() {
  const [mini, setMini] = useState(false);

  return (
    <div
      className={`hidden md:flex flex-col h-screen bg-blue-700 text-white p-4 transition-all duration-300 ${mini ? "w-20" : "w-64"
        }`}
    >
      {/* Bouton réduire/agrandir et logo */}
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Bouton réduire/agrandir */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setMini(!mini)}
            className="bg-blue-600 hover:bg-blue-500 p-2 rounded"
          >
            {mini ? "➤" : "◀"}
          </button>
        </div>

        {/* Logo */}
        {!mini && (
          <div className="flex items-center justify-center mb-6">
            <div className="text-xl font-bold">Planify</div>
          </div>
        )}
      </div>

      {/* Liens du menu avec scroll vertical si nécessaire */}
      <nav className="flex flex-col gap-4 items-center overflow-y-auto h-full pb-4">
        <NavButton to="/" icon={CgProfile} label="Planning" mini={mini} />
        <NavButton to="/login" icon={CgCalendarDates} label="Login" mini={mini} />
        <NavButton to="/register" icon={CgEricsson} label="Register" mini={mini} />

      </nav>
    </div>
  );
}
