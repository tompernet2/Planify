import { NavLink } from "react-router-dom";

export default function NavButton({ to, icon: Icon, label, onClick = () => {}, mini = false, mobile = false }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `flex items-center gap-2 px-3 py-2 text-cream rounded-full hover:text-primary-hover transition-colors ${isActive ? "text-primary" : ""} ${mini && !mobile ? "justify-center" : ""}`}
        >
            {Icon && <Icon size={24} />}
            {/* Texte visible si : mobile ou desktop normal */}
            {(mobile || !mini) && <span className="pr-10">{ label}</span>}
        </NavLink>
    );
}
