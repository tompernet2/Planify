export default function Button({ children, variant = "primary", size = "md", onClick, className = "" }) {
    const baseStyle = "font-medium rounded-lg transition-all duration-200 cursor-pointer border-none";
    
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-0.5",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        outline: "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50",
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };
    
    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}