export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-[300px] space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>
                )}

                {children}
            </div>
        </div>
    );
}
