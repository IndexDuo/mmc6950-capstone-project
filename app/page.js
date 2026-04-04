"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { ContributionCard } from "@/components/ContributionCard";
import { useFireData } from "@/hooks/useFireData";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function Dashboard() {
    const {
        payAmount,
        rentPerPaycheck,
        groceryPerPaycheck,
        vehiclePerPaycheck,
        parkingPerPaycheck,
        otherSpendingAPerPaycheck,
        otherSpendingBPerPaycheck,
        totalExpensesPerPaycheck,
        amountLeft,
        holdings,
    } = useFireData();

    const [prices, setPrices] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("poc_prices");
        if (!cached) return;
        const data = JSON.parse(cached);
        if (Date.now() - data.savedAt < ONE_WEEK) {
            setPrices(data.prices);
            setLastUpdated(data.savedAt);
        }
    }, []);

    async function loadPrices(forceRefresh) {
        if (!forceRefresh) {
            const cached = localStorage.getItem("poc_prices");
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.savedAt < ONE_WEEK) {
                    setPrices(data.prices);
                    setLastUpdated(data.savedAt);
                    return;
                }
            }
        }
        setLoading(true);
        setError(null);
        try {
            const symbols = holdings
                .map((h) => h.symbol.trim().toUpperCase())
                .filter(Boolean)
                .join(",");
            if (!symbols) {
                setError("Add at least one holding before loading prices.");
                setLoading(false);
                return;
            }
            const res = await fetch(
                `/api/prices?symbols=${encodeURIComponent(symbols)}`,
                { cache: "no-store" },
            );
            const resData = await res.json();
            const savedAt = Date.now();
            setPrices(resData.prices);
            setLastUpdated(savedAt);
            localStorage.setItem(
                "poc_prices",
                JSON.stringify({ prices: resData.prices, savedAt }),
            );
        } catch {
            setError("Failed to fetch prices. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const priceBySymbol = useMemo(() => prices || {}, [prices]);

    const enrichedHoldings = useMemo(() => {
        return holdings.map((h) => {
            const shares = Number(h.shares) || 0;
            const price =
                priceBySymbol[h.symbol] != null
                    ? Number(priceBySymbol[h.symbol]) || 0
                    : 0;
            return {
                id: h.id,
                symbol: h.symbol,
                price: priceBySymbol[h.symbol] ?? null,
                shares,
                value: shares * price,
                targetPercent: Number(h.targetPercent) || 0,
            };
        });
    }, [holdings, priceBySymbol]);

    const totalValue = useMemo(
        () => enrichedHoldings.reduce((sum, h) => sum + h.value, 0),
        [enrichedHoldings],
    );

    const tableRows = useMemo(() => {
        const usableLeftover = amountLeft > 0 ? amountLeft : 0;
        const rows = enrichedHoldings.map((h) => {
            const currentPercent =
                totalValue > 0 ? (h.value / totalValue) * 100 : 0;
            const diffPercent = h.targetPercent - currentPercent;
            return { ...h, currentPercent, diffPercent };
        });
        const positiveDiffs = rows.map((r) =>
            r.diffPercent > 0 ? r.diffPercent : 0,
        );
        const sumPositiveDiffs = positiveDiffs.reduce((a, b) => a + b, 0);
        return rows.map((row, i) => ({
            ...row,
            suggestedAmount:
                sumPositiveDiffs === 0
                    ? 0
                    : (usableLeftover * positiveDiffs[i]) / sumPositiveDiffs,
        }));
    }, [enrichedHoldings, totalValue, amountLeft]);

    const formattedLastUpdated = useMemo(() => {
        if (!lastUpdated) return null;
        return new Date(lastUpdated).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }, [lastUpdated]);

    const expenseBreakdown = [
        { label: "Rent", value: rentPerPaycheck },
        { label: "Grocery", value: groceryPerPaycheck },
        { label: "Vehicle", value: vehiclePerPaycheck },
        { label: "Parking", value: parkingPerPaycheck },
        { label: "Other A", value: otherSpendingAPerPaycheck },
        { label: "Other B", value: otherSpendingBPerPaycheck },
    ].filter((e) => e.value > 0);

    return (
        <div className="min-h-screen bg-surface overflow-x-hidden">
            <AppHeader navLabel="Budget & Portfolio Setup" navHref="/input" />

            <main id="main-content" tabIndex={-1}>
                <h1 className="sr-only">FIRE Tracker — Dashboard</h1>

                <div className="flex flex-col gap-6 px-6 py-6 max-w-5xl mx-auto">
                    <div className="flex gap-3 lg:hidden" role="group" aria-label="Price controls">
                        <button
                            onClick={() => loadPrices(false)}
                            disabled={loading}
                            aria-busy={loading}
                            className="btn-primary h-9 text-sm"
                        >
                            {loading ? "Loading…" : "Load prices (use 1-week cache)"}
                        </button>
                        <button
                            onClick={() => loadPrices(true)}
                            disabled={loading}
                            aria-busy={loading}
                            className="btn-secondary h-9 text-sm"
                        >
                            Refresh Prices
                        </button>
                    </div>

                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                        {loading && "Loading stock prices…"}
                        {!loading && formattedLastUpdated && `Prices updated ${formattedLastUpdated}`}
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <section className="flex flex-col gap-4" aria-label="Portfolio Summary">
                        <SectionHeader title="Portfolio Summary" />
                        <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden lg:flex">
                            <div className="p-6 lg:flex-1">
                                <p className="text-muted text-sm mb-1">Total Portfolio Value</p>
                                <p className="text-3xl font-semibold text-gradient-primary">
                                    ${totalValue.toFixed(2)}
                                </p>
                            </div>

                            <hr className="border-[#E5E7EB] mx-6 lg:hidden" aria-hidden="true" />
                            <div className="hidden lg:block w-px bg-[#E5E7EB] my-6 shrink-0" aria-hidden="true" />

                            <div className="p-6 lg:flex-1">
                                <p className="text-muted text-sm mb-3">Current Allocation</p>
                                <div className="flex flex-col gap-3">
                                    {tableRows.map((row) => {
                                        const isOnTrack = Math.abs(row.diffPercent) < 0.01;
                                        const statusText = isOnTrack
                                            ? "On track"
                                            : row.diffPercent > 0
                                              ? `Off track — ${row.diffPercent.toFixed(2)}% under target`
                                              : `Off track — ${Math.abs(row.diffPercent).toFixed(2)}% over target`;
                                        return (
                                            <div key={row.id} className="flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:gap-2 min-w-0">
                                                <p className="text-primary font-extrabold text-base lg:text-sm lg:w-12 lg:shrink-0">
                                                    {row.symbol}
                                                </p>
                                                <p className="text-dark font-semibold text-sm lg:w-16 lg:shrink-0">
                                                    {row.currentPercent.toFixed(2)}%
                                                </p>
                                                <p className={`text-sm min-w-0 break-words ${isOnTrack ? "text-teal" : "text-danger"}`}>
                                                    {statusText}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="border-[#E5E7EB] mx-6 lg:hidden" aria-hidden="true" />
                            <div className="hidden lg:block w-px bg-[#E5E7EB] my-6 shrink-0" aria-hidden="true" />

                            <div className="p-6 lg:flex-1 flex flex-col gap-3">
                                <div>
                                    <p className="text-muted text-sm mb-1">Last Price Update</p>
                                    <p className="text-dark font-semibold text-sm">
                                        {formattedLastUpdated ?? "Not yet loaded"}
                                    </p>
                                </div>
                                <div className="hidden lg:flex flex-col gap-2 items-start">
                                    <button
                                        onClick={() => loadPrices(false)}
                                        disabled={loading}
                                        aria-busy={loading}
                                        className="btn-primary h-9 text-sm"
                                    >
                                        {loading ? "Loading…" : "Load prices (use 1-week cache)"}
                                    </button>
                                    <button
                                        onClick={() => loadPrices(true)}
                                        disabled={loading}
                                        aria-busy={loading}
                                        className="btn-secondary h-9 text-sm"
                                    >
                                        Refresh Prices
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-4" aria-label="Current Paycheck Snapshot">
                        <SectionHeader
                            title="Current Paycheck Snapshot"
                            tooltip="Each expense is annualized then divided by your paycheck frequency (e.g. $700/mo rent ÷ 26 bi-weekly checks = $323.08/check.)"
                        />
                        <div className="bg-white rounded-xl border border-card-border shadow-sm p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1 md:hidden">
                                <p className="text-muted text-sm">Total Leftover</p>
                                <p className={`text-2xl font-semibold ${amountLeft >= 0 ? "text-teal" : "text-danger"}`}>
                                    ${amountLeft.toFixed(2)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="min-w-0">
                                    <p className="text-muted text-sm">Paycheck</p>
                                    <p className="text-primary font-semibold text-base sm:text-lg break-words">
                                        ${(Number(payAmount) || 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-muted text-sm">Total Expenses</p>
                                    <p className="text-dark font-semibold text-base sm:text-lg break-words">
                                        ${totalExpensesPerPaycheck.toFixed(2)}
                                    </p>
                                </div>
                                <div className="hidden md:block min-w-0">
                                    <p className="text-muted text-sm">Total Leftover</p>
                                    <p className={`text-base sm:text-lg font-semibold break-words ${amountLeft >= 0 ? "text-teal" : "text-danger"}`}>
                                        ${amountLeft.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {expenseBreakdown.length > 0 && (
                                <div className="pt-4 border-t border-card-border">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                                        {expenseBreakdown.map((e) => (
                                            <p key={e.label} className="text-sm text-muted">
                                                {e.label}:{" "}
                                                <span className="font-semibold text-dark">
                                                    ${e.value.toFixed(2)}
                                                </span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="flex flex-col gap-4" aria-label="Suggested Contribution Table">
                        <SectionHeader title="Suggested Contribution Table" />

                        {prices ? (
                            <p className="text-xs text-muted">
                                Stock prices are cached. Click &ldquo;Refresh Prices&rdquo; to update.
                            </p>
                        ) : (
                            <p className="text-xs text-muted">
                                Load prices to see suggested contributions.
                            </p>
                        )}

                        <div className="flex flex-col gap-4 md:hidden">
                            {tableRows.map((row) => (
                                <ContributionCard key={row.id} {...row} />
                            ))}
                        </div>

                        <div className="hidden md:block bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" aria-label="Suggested contribution amounts by holding">
                                    <thead>
                                        <tr style={{ backgroundImage: "var(--gradient-primary)" }}>
                                            {["Symbol", "Price", "Shares", "Value", "Current %", "Target %", "Diff", "Suggested $"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-card-border">
                                        {tableRows.map((row) => (
                                            <tr key={row.id} className="hover:bg-surface transition-colors">
                                                <td className="px-4 py-3 font-bold text-primary">{row.symbol}</td>
                                                <td className="px-4 py-3 text-dark">
                                                    {row.price == null ? "—" : `$${Number(row.price).toFixed(2)}`}
                                                </td>
                                                <td className="px-4 py-3 text-dark">{row.shares}</td>
                                                <td className="px-4 py-3 text-dark">${row.value.toFixed(2)}</td>
                                                <td className="px-4 py-3 font-semibold text-primary">
                                                    {row.currentPercent.toFixed(2)}%
                                                </td>
                                                <td className="px-4 py-3 text-dark">
                                                    {row.targetPercent.toFixed(2)}%
                                                </td>
                                                <td className={`px-4 py-3 font-semibold ${row.diffPercent >= 0 ? "text-teal" : "text-danger"}`}>
                                                    {row.diffPercent >= 0 ? "+" : ""}
                                                    {row.diffPercent.toFixed(2)}%
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-teal">
                                                    ${row.suggestedAmount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-t-2 border-card-border bg-surface">
                                            <td colSpan={3} className="px-4 py-3 font-semibold text-dark">Total</td>
                                            <td className="px-4 py-3 font-semibold text-dark">${totalValue.toFixed(2)}</td>
                                            <td colSpan={4} />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white rounded-xl border border-card-border shadow-sm px-6 py-4 md:hidden">
                            <p className="font-semibold text-dark text-sm">Total Portfolio Value</p>
                            <p className="font-semibold text-dark text-sm">${totalValue.toFixed(2)}</p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
