import { Link } from "react-router-dom";

export default function NavButton({ to, icon: Icon, label, mini = false, mobile = false }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition-colors
        ${mini && !mobile ? "justify-center" : ""}
      `}
        >
            {Icon && <Icon size={24} />}
            {/* Texte visible si : mobile ou desktop normal */}
            {(mobile || !mini) && <span>{label}</span>}
        </Link>
    );
}
