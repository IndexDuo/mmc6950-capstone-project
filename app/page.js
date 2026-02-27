"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_HOLDINGS = [
    { id: "1", symbol: "VTI", shares: "10", targetPercent: "50" },
    { id: "2", symbol: "QQQ", shares: "5", targetPercent: "30" },
    { id: "3", symbol: "VXUS", shares: "8", targetPercent: "20" },
];

function paychecksPerYear(frequency) {
    if (frequency === "weekly") return 52;
    if (frequency === "biweekly") return 26;
    if (frequency === "monthly") return 12;
    return 1;
}

function expensePerPaycheck(amount, expenseFrequency, paycheckFrequency) {
    const amt = Number(amount) || 0;
    const paychecks = paychecksPerYear(paycheckFrequency);
    let annual;
    if (expenseFrequency === "weekly") annual = amt * 52;
    else if (expenseFrequency === "biweekly") annual = amt * 26;
    else if (expenseFrequency === "monthly") annual = amt * 12;
    else if (expenseFrequency === "biannually") annual = amt * 2;
    else if (expenseFrequency === "annually") annual = amt;
    else annual = amt * 12;
    return annual / paychecks;
}

export default function Home() {
    const [prices, setPrices] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [portfolioHoldings, setPortfolioHoldings] =
        useState(DEFAULT_HOLDINGS);

    const [payAmount, setPayAmount] = useState("0");
    const [payFrequency, setPayFrequency] = useState("biweekly");
    const [rentAmount, setRentAmount] = useState("0");
    const [rentFrequency, setRentFrequency] = useState("monthly");
    const [groceryAmount, setGroceryAmount] = useState("0");
    const [groceryFrequency, setGroceryFrequency] = useState("monthly");
    const [vehicleAmount, setVehicleAmount] = useState("0");
    const [vehicleFrequency, setVehicleFrequency] = useState("monthly");
    const [parkingAmount, setParkingAmount] = useState("0");
    const [parkingFrequency, setParkingFrequency] = useState("monthly");
    const [otherSpendingAAmount, setOtherSpendingAAmount] = useState("0");
    const [otherSpendingAFrequency, setOtherSpendingAFrequency] =
        useState("monthly");
    const [otherSpendingBAmount, setOtherSpendingBAmount] = useState("0");
    const [otherSpendingBFrequency, setOtherSpendingBFrequency] =
        useState("monthly");

    useEffect(() => {
        document.title = "FIRE Tracker";

        const cachedPrices = localStorage.getItem("poc_prices");
        if (cachedPrices) {
            const cachedPricesData = JSON.parse(cachedPrices);
            if (Date.now() - cachedPricesData.savedAt < ONE_WEEK) {
                setPrices(cachedPricesData.prices);
                setLastUpdated(cachedPricesData.savedAt);
            }
        }

        const savedInputs = localStorage.getItem("fire_inputs");
        if (savedInputs) {
            const data = JSON.parse(savedInputs);
            setPayAmount(data.payAmount ?? "0");
            setPayFrequency(data.payFrequency ?? "biweekly");
            setRentAmount(data.rentAmount ?? "0");
            setRentFrequency(data.rentFrequency ?? "monthly");
            setGroceryAmount(data.groceryAmount ?? "0");
            setGroceryFrequency(data.groceryFrequency ?? "monthly");
            setVehicleAmount(data.vehicleAmount ?? "0");
            setVehicleFrequency(data.vehicleFrequency ?? "monthly");
            setParkingAmount(data.parkingAmount ?? "0");
            setParkingFrequency(data.parkingFrequency ?? "monthly");
            setOtherSpendingAAmount(data.otherSpendingAAmount ?? "0");
            setOtherSpendingAFrequency(
                data.otherSpendingAFrequency ?? "monthly",
            );
            setOtherSpendingBAmount(data.otherSpendingBAmount ?? "0");
            setOtherSpendingBFrequency(
                data.otherSpendingBFrequency ?? "monthly",
            );
            if (data.holdings && data.holdings.length > 0) {
                setPortfolioHoldings(data.holdings);
            }
        }
    }, []);

    async function loadPrices(forceRefresh) {
        if (!forceRefresh) {
            const cachedPrices = localStorage.getItem("poc_prices");
            if (cachedPrices) {
                const cachedPricesData = JSON.parse(cachedPrices);
                if (Date.now() - cachedPricesData.savedAt < ONE_WEEK) {
                    setPrices(cachedPricesData.prices);
                    setLastUpdated(cachedPricesData.savedAt);
                    return;
                }
            }
        }

        const response = await fetch("/api/prices", { cache: "no-store" });
        const responseData = await response.json();

        const savedAt = Date.now();
        setPrices(responseData.prices);
        setLastUpdated(savedAt);
        localStorage.setItem(
            "poc_prices",
            JSON.stringify({
                prices: responseData.prices,
                savedAt,
            }),
        );
    }

    const rentPerPaycheck = useMemo(() => {
        return expensePerPaycheck(rentAmount, rentFrequency, payFrequency);
    }, [rentAmount, rentFrequency, payFrequency]);

    const totalExpensesPerPaycheck = useMemo(() => {
        return (
            expensePerPaycheck(rentAmount, rentFrequency, payFrequency) +
            expensePerPaycheck(groceryAmount, groceryFrequency, payFrequency) +
            expensePerPaycheck(vehicleAmount, vehicleFrequency, payFrequency) +
            expensePerPaycheck(parkingAmount, parkingFrequency, payFrequency) +
            expensePerPaycheck(
                otherSpendingAAmount,
                otherSpendingAFrequency,
                payFrequency,
            ) +
            expensePerPaycheck(
                otherSpendingBAmount,
                otherSpendingBFrequency,
                payFrequency,
            )
        );
    }, [
        rentAmount,
        rentFrequency,
        groceryAmount,
        groceryFrequency,
        vehicleAmount,
        vehicleFrequency,
        parkingAmount,
        parkingFrequency,
        otherSpendingAAmount,
        otherSpendingAFrequency,
        otherSpendingBAmount,
        otherSpendingBFrequency,
        payFrequency,
    ]);

    const amountLeft = useMemo(() => {
        const payNumber = Number(payAmount) || 0;
        return payNumber - totalExpensesPerPaycheck;
    }, [payAmount, totalExpensesPerPaycheck]);

    const priceBySymbol = useMemo(() => prices || {}, [prices]);

    const holdings = useMemo(() => {
        return portfolioHoldings.map((h) => {
            const sharesAmount = Number(h.shares) || 0;
            const currentPrice =
                priceBySymbol[h.symbol] == null
                    ? 0
                    : Number(priceBySymbol[h.symbol]) || 0;

            return {
                symbol: h.symbol,
                price: priceBySymbol[h.symbol] ?? null,
                shares: sharesAmount,
                value: sharesAmount * currentPrice,
                targetPercent: Number(h.targetPercent) || 0,
            };
        });
    }, [portfolioHoldings, priceBySymbol]);

    const totalValue = useMemo(() => {
        return holdings.reduce((sum, holding) => sum + holding.value, 0);
    }, [holdings]);

    const tableRows = useMemo(() => {
        const totalPortfolioValue = totalValue;
        const currentAllocationRows = holdings.map((holding) => {
            const currentPercent =
                totalPortfolioValue > 0
                    ? (holding.value / totalPortfolioValue) * 100
                    : 0;

            const targetPercent = holding.targetPercent;
            const diffPercent = targetPercent - currentPercent;

            return {
                ...holding,
                currentPercent,
                targetPercent,
                diffPercent,
            };
        });

        const usableLeftover = amountLeft > 0 ? amountLeft : 0;

        const positiveDiffs = currentAllocationRows.map((row) =>
            row.diffPercent > 0 ? row.diffPercent : 0,
        );
        const sumPositiveDiffs = positiveDiffs.reduce((a, b) => a + b, 0);

        return currentAllocationRows.map((row, index) => {
            const suggestedAmount =
                sumPositiveDiffs === 0
                    ? 0
                    : (usableLeftover * positiveDiffs[index]) /
                      sumPositiveDiffs;

            return {
                ...row,
                suggestedAmount,
            };
        });
    }, [holdings, totalValue, amountLeft]);

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

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>FIRE Tracker</h1>
                <Link href="/input" className="btn btn-secondary">
                    Budget &amp; Portfolio Setup
                </Link>
            </div>

            <div className="button-group">
                <button
                    onClick={() => loadPrices(false)}
                    className="btn btn-primary"
                >
                    Load prices (use 1-week cache)
                </button>
                <button
                    onClick={() => loadPrices(true)}
                    className="btn btn-primary"
                >
                    Force refresh
                </button>
            </div>

            <h2>Portfolio Summary</h2>
            <div className="portfolio-summary">
                <div className="portfolio-summary-row">
                    <span className="summary-label">Total Portfolio Value</span>
                    <span>
                        <strong>${totalValue.toFixed(2)}</strong>
                    </span>
                </div>
                <div className="portfolio-summary-row">
                    <span className="summary-label">Current Allocation</span>
                    <div className="allocation-list">
                        {tableRows.map((row) => {
                            const isOnTrack = Math.abs(row.diffPercent) < 0.01;
                            const statusLabel = isOnTrack
                                ? "On track"
                                : row.diffPercent > 0
                                  ? `Off track — ${row.diffPercent.toFixed(2)}% under target`
                                  : `Off track — ${Math.abs(row.diffPercent).toFixed(2)}% over target`;
                            return (
                                <div
                                    key={row.symbol}
                                    className="allocation-item"
                                >
                                    <span className="allocation-symbol">
                                        {row.symbol}
                                    </span>
                                    <span className="allocation-percent">
                                        {row.currentPercent.toFixed(2)}%
                                    </span>
                                    <span
                                        className={`allocation-status ${
                                            isOnTrack
                                                ? "status-on-track"
                                                : "status-off-track"
                                        }`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="portfolio-summary-row">
                    <span className="summary-label">Last Price Update</span>
                    <span>{formattedLastUpdated ?? "Not yet loaded"}</span>
                </div>
            </div>

            <h2>Current Paycheck Snapshot</h2>
            <p className="summary-text">
                Paycheck <strong>${(Number(payAmount) || 0).toFixed(2)}</strong>
                {" | "}Rent <strong>${rentPerPaycheck.toFixed(2)}</strong>
                {" | "}Total Expenses{" "}
                <strong>${totalExpensesPerPaycheck.toFixed(2)}</strong>
                {" | "}Amount Left <strong>${amountLeft.toFixed(2)}</strong>
            </p>

            <h2>Suggested Contribution Table</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Shares</th>
                        <th>Value</th>
                        <th>Current %</th>
                        <th>Target %</th>
                        <th>Diff</th>
                        <th>Suggested $</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((row) => (
                        <tr key={row.symbol}>
                            <td>{row.symbol}</td>
                            <td>
                                {row.price == null
                                    ? "-"
                                    : `$${Number(row.price).toFixed(2)}`}
                            </td>
                            <td>{row.shares}</td>
                            <td>${row.value.toFixed(2)}</td>
                            <td>{row.currentPercent.toFixed(2)}%</td>
                            <td>{row.targetPercent.toFixed(2)}%</td>
                            <td>
                                {row.diffPercent >= 0 ? "+" : ""}
                                {row.diffPercent.toFixed(2)}%
                            </td>
                            <td>${row.suggestedAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3">
                            <strong>Total</strong>
                        </td>
                        <td>
                            <strong>${totalValue.toFixed(2)}</strong>
                        </td>
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
            </table>
        </main>
    );
}
