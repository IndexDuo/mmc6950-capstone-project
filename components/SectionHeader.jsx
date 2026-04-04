"use client";

import { useState } from "react";

export function SectionHeader({ title, tooltip }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <div
                className="w-1 h-6 rounded-full shrink-0"
                style={{ backgroundImage: "var(--gradient-accent)" }}
                aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-dark">{title}</h2>
            {tooltip && (
                <div
                    className="relative"
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            setOpen(false);
                        }
                    }}
                >
                    <button
                        type="button"
                        aria-label="How is this calculated?"
                        aria-expanded={open}
                        onClick={() => setOpen((prev) => !prev)}
                        className="w-5 h-5 rounded-full border border-card-border text-muted text-xs flex items-center justify-center hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                        <i className="fa-solid fa-circle-question text-[10px]" aria-hidden="true" />
                    </button>

                    {open && (
                        <div
                            role="tooltip"
                            className="absolute bottom-full right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 mb-2 w-64 bg-dark text-white text-xs rounded-lg px-3 py-2 shadow-lg z-20"
                        >
                            {tooltip}
                            <div
                                className="absolute top-full right-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-dark"
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
