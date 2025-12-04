import { NavLink } from "react-router-dom";

export default function NavButton({ to, icon: Icon, label, onClick = () => {}, mini = false, mobile = false }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `flex items-center gap-2 px-4 py-3 rounded-full hover:bg-blue-600 transition-colors ${isActive ? "bg-secondary-100   text-cream" : ""}${mini && !mobile ? "justify-center" : ""}`}
        >
            {Icon && <Icon size={24} />}
            {/* Texte visible si : mobile ou desktop normal */}
            {(mobile || !mini) && <span>{label}</span>}
        </NavLink>
    );
}
