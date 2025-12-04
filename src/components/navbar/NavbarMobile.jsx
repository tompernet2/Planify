import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CgCalendarDates, CgProfile, CgEricsson } from "react-icons/cg";
import NavButton from "../ui/NavButton";

export default function NavbarMobile() {
    const [open, setOpen] = useState(false);
    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <div className="md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-700 p-4">
                <button onClick={() => setOpen(true)}>
                    <Menu size={28} />
                </button>
                <div className="text-xl font-bold">Planify</div>
                <div></div>
            </div>

            {/* Overlay + Menu */}
            <div
                className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"
                    }`}
            >
                {/* Fond noir */}
                <div
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
                        }`}
                />

                <div
                    className={`absolute left-0 top-0 h-full w-64 bg-blue-800 text-white p-6 shadow-xl 
          overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <button onClick={() => setOpen(false)} className="mb-6">
                        <X size={28} />
                    </button>

                    <nav className="flex flex-col text-xl gap-4 pb-10">
                        <NavButton to="/" icon={CgProfile} label="Planning" mobile onClick={closeMenu} />
                        <NavButton to="/login" icon={CgCalendarDates} label="Login" mobile onClick={closeMenu} />
                        <NavButton to="/register" icon={CgEricsson} label="Register" mobile onClick={closeMenu} />
                    </nav>
                </div>
            </div>
        </div>
    );
}
