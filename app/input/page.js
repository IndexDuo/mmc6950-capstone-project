"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

export default function InputPage() {
    const router = useRouter();

    // Paycheck
    const [payAmount, setPayAmount] = useState("2000");
    const [payFrequency, setPayFrequency] = useState("biweekly");

    // Expenses
    const [rentAmount, setRentAmount] = useState("700");
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

    // Portfolio holdings
    const [holdings, setHoldings] = useState(DEFAULT_HOLDINGS);

    useEffect(() => {
        const savedInputs = localStorage.getItem("fire_inputs");

        if (savedInputs) {
            const data = JSON.parse(savedInputs);

            setPayAmount(data.payAmount ?? "2000");
            setPayFrequency(data.payFrequency ?? "biweekly");
            setRentAmount(data.rentAmount ?? "700");
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
                setHoldings(data.holdings);
            }
        }
    }, []);

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

    const totalTargetPercent = useMemo(() => {
        return holdings.reduce(
            (sum, h) => sum + (Number(h.targetPercent) || 0),
            0,
        );
    }, [holdings]);

    function addHolding() {
        setHoldings([
            ...holdings,
            {
                id: Date.now().toString(),
                symbol: "",
                shares: "0",
                targetPercent: "0",
            },
        ]);
    }

    function removeHolding(id) {
        setHoldings(holdings.filter((h) => h.id !== id));
    }

    function updateHolding(id, field, value) {
        setHoldings(
            holdings.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
        );
    }

    function handleSave() {
        localStorage.setItem(
            "fire_inputs",
            JSON.stringify({
                payAmount,
                payFrequency,
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
                holdings,
                savedAt: Date.now(),
            }),
        );

        router.push("/");
    }

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Budget &amp; Portfolio Setup</h1>
                <button
                    onClick={() => router.push("/")}
                    className="btn btn-secondary"
                >
                    Back to Dashboard
                </button>
            </div>

            <h2>Paycheck &amp; Expenses</h2>

            <div className="form-group">
                <label>Paycheck Amount</label>
                <input
                    className="input-field ml-6"
                    value={payAmount}
                    placeholder="2000"
                    onChange={(e) => setPayAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={payFrequency}
                    onChange={(e) => setPayFrequency(e.target.value)}
                >
                    <option value="weekly">weekly</option>
                    <option value="biweekly">biweekly</option>
                    <option value="monthly">monthly</option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="form-group">
                <label>Rent</label>
                <input
                    className="input-field ml-6"
                    value={rentAmount}
                    placeholder="700"
                    onChange={(e) => setRentAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={rentFrequency}
                    onChange={(e) => setRentFrequency(e.target.value)}
                >
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="form-group">
                <label>Grocery / Food</label>
                <input
                    className="input-field ml-6"
                    value={groceryAmount}
                    placeholder="0"
                    onChange={(e) => setGroceryAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={groceryFrequency}
                    onChange={(e) => setGroceryFrequency(e.target.value)}
                >
                    <option value="weekly">weekly</option>
                    <option value="biweekly">biweekly</option>
                    <option value="monthly">monthly</option>
                </select>
            </div>

            <div className="form-group">
                <label>
                    Vehicle Expenses{" "}
                    <span className="label-hint">(gas &amp; insurance)</span>
                </label>
                <input
                    className="input-field ml-6"
                    value={vehicleAmount}
                    placeholder="0"
                    onChange={(e) => setVehicleAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={vehicleFrequency}
                    onChange={(e) => setVehicleFrequency(e.target.value)}
                >
                    <option value="monthly">monthly</option>
                    <option value="biannually">
                        biannually (every 6 months)
                    </option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="form-group">
                <label>Parking</label>
                <input
                    className="input-field ml-6"
                    value={parkingAmount}
                    placeholder="0"
                    onChange={(e) => setParkingAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={parkingFrequency}
                    onChange={(e) => setParkingFrequency(e.target.value)}
                >
                    <option value="monthly">monthly</option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="form-group">
                <label>Other Spending</label>
                <input
                    className="input-field ml-6"
                    value={otherSpendingAAmount}
                    placeholder="0"
                    onChange={(e) => setOtherSpendingAAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={otherSpendingAFrequency}
                    onChange={(e) => setOtherSpendingAFrequency(e.target.value)}
                >
                    <option value="weekly">weekly</option>
                    <option value="biweekly">biweekly</option>
                    <option value="monthly">monthly</option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="form-group">
                <label>Other Spending</label>
                <input
                    className="input-field ml-6"
                    value={otherSpendingBAmount}
                    placeholder="0"
                    onChange={(e) => setOtherSpendingBAmount(e.target.value)}
                />
                <select
                    className="select-field"
                    value={otherSpendingBFrequency}
                    onChange={(e) => setOtherSpendingBFrequency(e.target.value)}
                >
                    <option value="weekly">weekly</option>
                    <option value="biweekly">biweekly</option>
                    <option value="monthly">monthly</option>
                    <option value="annually">annually</option>
                </select>
            </div>

            <div className="info-section">
                <div className="info-label">Amount Left After All Expenses</div>
                <div className="info-value">${amountLeft.toFixed(2)}</div>
            </div>

            <h2>Portfolio Holdings</h2>

            <table className="data-table mb-16">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Number of Shares</th>
                        <th>Target Allocation %</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {holdings.map((holding) => (
                        <tr key={holding.id}>
                            <td>
                                <input
                                    className="input-field"
                                    value={holding.symbol}
                                    placeholder="e.g. VTI"
                                    onChange={(e) =>
                                        updateHolding(
                                            holding.id,
                                            "symbol",
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    className="input-field"
                                    value={holding.shares}
                                    placeholder="0"
                                    onChange={(e) =>
                                        updateHolding(
                                            holding.id,
                                            "shares",
                                            e.target.value,
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    className="input-field"
                                    value={holding.targetPercent}
                                    placeholder="0"
                                    onChange={(e) =>
                                        updateHolding(
                                            holding.id,
                                            "targetPercent",
                                            e.target.value,
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <button
                                    onClick={() => removeHolding(holding.id)}
                                    className="btn btn-secondary"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-group">
                <button onClick={addHolding} className="btn btn-secondary">
                    + Add Holding
                </button>
            </div>

            {Math.abs(totalTargetPercent - 100) > 0.01 && (
                <p className="allocation-warning mt-10">
                    Target allocation adds up to{" "}
                    <strong>{totalTargetPercent.toFixed(2)}%</strong>, not 100%.
                    The remaining{" "}
                    <strong>{(100 - totalTargetPercent).toFixed(2)}%</strong>{" "}
                    will not be allocated to any investment.
                </p>
            )}

            <div className="mt-10">
                <button onClick={handleSave} className="btn btn-primary">
                    Save &amp; Return to Dashboard
                </button>
            </div>
        </main>
    );
}
