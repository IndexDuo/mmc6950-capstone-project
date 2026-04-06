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
                        <svg className="w-[10px] h-[10px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                        </svg>
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
