import Image from "next/image";
import Link from "next/link";

export function AppHeader({ navLabel, navHref }) {
    return (
        <header className="bg-white w-full border-b-2 border-card-border shadow-sm sticky top-0 z-10">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:text-sm focus:font-semibold"
            >
                Skip to main content
            </a>

            <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-3 min-w-0">
                {/* Logo + wordmark — bottom-aligned */}
                <div className="flex items-end gap-1.5 shrink min-w-0 overflow-hidden">
                    <Image
                        src="/logo.png"
                        alt="FIRE Tracker"
                        height={28}
                        width={107}
                        priority
                        className="shrink-0"
                    />
                    <span
                        className="text-sm sm:text-base font-semibold text-gradient-primary leading-none whitespace-nowrap"
                        aria-hidden="true"
                    >
                        Tracker
                    </span>
                </div>
                <nav aria-label="Page navigation">
                    <Link
                        href={navHref}
                        className="shrink-0 px-3 sm:px-5 py-2 rounded-lg border-2 border-primary/20 text-primary font-semibold text-xs sm:text-sm hover:bg-primary/5 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        {navLabel}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
