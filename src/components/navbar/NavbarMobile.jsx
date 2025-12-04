import { useState } from "react";
import { CgCalendarDates, CgProfile, CgEricsson, CgMenu   } from "react-icons/cg";
import NavButton from "../ui/NavButton";

export default function NavbarMobile() {
    const [open, setOpen] = useState(false);
    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <div className="md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-secondary text-cream m-2 rounded-2xl">
                <button onClick={() => setOpen(true)}>
                    <CgMenu  size={28} />
                </button>
                <div className="text-xl font-secondary">Planify</div>
                <div></div>
            </div>

            {/* Menu déroulant en dessous - Largeur adaptative */}
            <div
                className={`absolute left-2 z-50 bg-secondary text-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="p-4 w-max">

                    <nav className="flex flex-col text-sm gap-0 whitespace-nowrap">
                        <NavButton to="/" icon={CgProfile} label="Planning" mobile onClick={closeMenu} />
                        <NavButton to="/login" icon={CgCalendarDates} label="Login" mobile onClick={closeMenu} />
                        <NavButton to="/register" icon={CgEricsson} label="Register" mobile onClick={closeMenu} />
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40"
                />
            )}
        </div>
    );
}