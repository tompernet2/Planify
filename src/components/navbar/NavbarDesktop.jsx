import { useState } from "react";
import { CgCalendarDates, CgProfile, CgEricsson, CgChevronDoubleRight, CgChevronDoubleLeft } from "react-icons/cg";
import NavButton from "../ui/NavButton";

export default function NavbarDesktop() {
  const [mini, setMini] = useState(false);

  return (
    <div className={`hidden md:flex flex-col  bg-secondary text-white p-4 m-2 rounded-2xl transition-all duration-300 ${mini ? "w-20" : "w-max"}`}>
      {/* Bouton réduire/agrandir et logo */}
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Bouton réduire/agrandir */}
        <div className="flex items-center justify-center mb-3 gap-2 ">

          {/* Logo */}
          {!mini && (
            <div className="text-xl font-secondary">Planify</div>
          )}

          <button onClick={() => setMini(!mini)}>
            {mini ? <CgChevronDoubleRight size={34} /> : <CgChevronDoubleLeft size={34} />}
          </button>

        </div>


      </div>

      {/* Liens du menu avec scroll vertical si nécessaire */}
      <nav className="flex flex-col gap-4 overflow-y-auto h-full pb-4">
        <NavButton to="/" icon={CgProfile} label="Planning" mini={mini} />
        <NavButton to="/login" icon={CgCalendarDates} label="Login" mini={mini} />
        <NavButton to="/register" icon={CgEricsson} label="Register" mini={mini} />

      </nav>
    </div>
  );
}
