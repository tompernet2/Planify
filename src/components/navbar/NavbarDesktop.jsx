import { useState } from "react";
import { CgCalendarDates, CgProfile, CgEricsson, CgChevronDoubleRight, CgChevronDoubleLeft } from "react-icons/cg";
import NavButton from "../ui/NavButton";

export default function NavbarDesktop() {
  const [mini, setMini] = useState(false);

  return (
    <div className={`hidden md:flex flex-col  bg-secondary  p-4 m-2 rounded-2xl transition-all duration-300 ${mini ? "w-20" : "w-max"}`}>

      <div className="flex flex-col items-center justify-center gap-2">

        <div className="relative flex items-center justify-center w-full mb-3 gap-2 ">

          {/* Logo */}
          {!mini && (
            <div className="text-4xl font-secondary text-white">Planify</div>
          )}
          {/* Btn Menu */}
          <button
            className={`${mini
                ? "bg-primary text-secondary border border-secondary border-4 rounded-full p-0.5 transition-all duration-300"
                : "absolute right-[-30px] bg-primary text-secondary border border-secondary border-4 rounded-full p-0.5 transition-all duration-300"}`}
            onClick={() => setMini(!mini)}>
            {mini ? <CgChevronDoubleRight size={20} /> : <CgChevronDoubleLeft size={20} />}
          </button>

        </div>


      </div>

      <nav className="flex flex-col gap-0 overflow-y-auto h-full pb-4">
        <NavButton to="/compte" icon={CgProfile} label="Compte" mini={mini} />
        <NavButton to="/" icon={CgCalendarDates} label="Planning" mini={mini} />
        {/* <NavButton to="/login" icon={CgCalendarDates} label="Login" mini={mini} />
        <NavButton to="/register" icon={CgEricsson} label="Register" mini={mini} /> */}
      </nav>
    </div>
  );
}
