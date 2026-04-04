export function SectionHeader({ title, tooltip }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className="w-1 h-6 rounded-full shrink-0"
                style={{ backgroundImage: "var(--gradient-accent)" }}
                aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-dark">{title}</h2>
            {tooltip && (
                <div className="relative group">
                    <button
                        type="button"
                        aria-label={tooltip}
                        className="w-5 h-5 rounded-full border border-card-border text-muted text-xs flex items-center justify-center hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                        <i
                            className="fa-solid fa-circle-question text-[10px]"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-dark text-white text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20"
                    >
                        {tooltip}
                        <div
                            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
