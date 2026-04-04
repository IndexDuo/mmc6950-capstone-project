import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "FIRE Tracker",
    description: "Personal Financial Independence, Retire Early tracker",
    icons: {
        icon: "/logo-favicon.png",
        shortcut: "/logo-favicon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body
                className={`${inter.variable} font-sans antialiased bg-surface text-dark`}
            >
                {children}
            </body>
        </html>
    );
}
