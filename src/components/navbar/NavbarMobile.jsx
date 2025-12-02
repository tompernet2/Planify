import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CgCalendarDates, CgProfile, CgEricsson } from "react-icons/cg";
import NavButton from "../ui/NavButton";

import { Link } from "react-router-dom";

export default function NavbarMobile() {
    const [open, setOpen] = useState(false);

    return (
        <div className=" md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-700 p-4">

                <button onClick={() => setOpen(true)}>
                    <Menu size={28} />
                </button>
                <div className="text-xl font-bold">Planify</div>
                <div></div>
            </div>

            {/* Menu plein écran */}
            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md text-white flex flex-col items-center justify-start pt-10 z-50">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 left-4"
                    >
                        <X size={28} />
                    </button>

                    {/* Liens du menu */}
                    <nav className="flex flex-col  text-2xl">
                        <NavButton to="/" icon={CgProfile} label="Planning" mobile={true} />
                        <NavButton to="/login" icon={CgProfile} label="Login" mobile={true} />
                        <NavButton to="/register" icon={CgProfile} label="Register" mobile={true} />
                    </nav>
                </div>
            )}
        </div>
    );
}
