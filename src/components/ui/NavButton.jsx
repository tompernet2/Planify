import { NavLink } from "react-router-dom";

export default function NavButton({ to, icon: Icon, label, onClick = () => {}, mini = false, mobile = false }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition-colors ${isActive ? "bg-blue-500   text-black" : ""}${mini && !mobile ? "justify-center" : ""}`}
        >
            {Icon && <Icon size={24} />}
            {/* Texte visible si : mobile ou desktop normal */}
            {(mobile || !mini) && <span>{label}</span>}
        </NavLink>
    );
}
