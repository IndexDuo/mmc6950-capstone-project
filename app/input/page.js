"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { FormField } from "@/components/FormField";
import { HoldingCard } from "@/components/HoldingCard";
import { useFireData } from "@/hooks/useFireData";
import { annualAmount } from "@/lib/calculations";

const FREQ_PAY = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
];

const FREQ_RENT = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
];

const FREQ_GROCERY = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
];

const FREQ_VEHICLE = [
    { value: "monthly", label: "Monthly" },
    { value: "biannually", label: "Every 6 months" },
    { value: "annually", label: "Annually" },
];

const FREQ_PARKING = [
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
];

export default function InputPage() {
    const router = useRouter();
    const {
        payAmount, setPayAmount, payFrequency, setPayFrequency,
        rentAmount, setRentAmount, rentFrequency, setRentFrequency,
        groceryAmount, setGroceryAmount, groceryFrequency, setGroceryFrequency,
        vehicleAmount, setVehicleAmount, vehicleFrequency, setVehicleFrequency,
        parkingAmount, setParkingAmount, parkingFrequency, setParkingFrequency,
        otherSpendingAAmount, setOtherSpendingAAmount, otherSpendingAFrequency, setOtherSpendingAFrequency,
        otherSpendingBAmount, setOtherSpendingBAmount, otherSpendingBFrequency, setOtherSpendingBFrequency,
        holdings, addHolding, removeHolding, updateHolding,
        totalExpensesPerPaycheck,
        amountLeft,
        totalTargetPercent,
        saveToStorage,
    } = useFireData();

    function handleSave() {
        saveToStorage();
        router.push("/");
    }

    return (
        <div className="min-h-screen bg-surface overflow-x-hidden">
            <AppHeader navLabel="Dashboard" navHref="/" />

            <main id="main-content" tabIndex={-1}>
            <div className="flex flex-col gap-6 px-6 py-6 max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold text-dark">
                    Budget &amp; Portfolio Setup
                </h1>

                <section className="flex flex-col gap-4" aria-label="Income and Expenses">
                    <SectionHeader title="Income & Expenses" />

                    <div className="bg-white rounded-xl border border-card-border shadow-sm p-6 flex flex-col gap-6">
                        <FormField
                            label="Paycheck Amount"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            frequency={payFrequency}
                            onFrequencyChange={(e) => setPayFrequency(e.target.value)}
                            frequencyOptions={FREQ_PAY}
                            annualAmount={annualAmount(payAmount, payFrequency)}
                        />
                        <FormField
                            label="Rent"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                            frequency={rentFrequency}
                            onFrequencyChange={(e) => setRentFrequency(e.target.value)}
                            frequencyOptions={FREQ_RENT}
                            annualAmount={annualAmount(rentAmount, rentFrequency)}
                        />
                        <FormField
                            label="Grocery / Food"
                            value={groceryAmount}
                            onChange={(e) => setGroceryAmount(e.target.value)}
                            frequency={groceryFrequency}
                            onFrequencyChange={(e) => setGroceryFrequency(e.target.value)}
                            frequencyOptions={FREQ_GROCERY}
                            annualAmount={annualAmount(groceryAmount, groceryFrequency)}
                        />
                        <FormField
                            label="Vehicle (gas & insurance)"
                            value={vehicleAmount}
                            onChange={(e) => setVehicleAmount(e.target.value)}
                            frequency={vehicleFrequency}
                            onFrequencyChange={(e) => setVehicleFrequency(e.target.value)}
                            frequencyOptions={FREQ_VEHICLE}
                            annualAmount={annualAmount(vehicleAmount, vehicleFrequency)}
                        />
                        <FormField
                            label="Parking"
                            value={parkingAmount}
                            onChange={(e) => setParkingAmount(e.target.value)}
                            frequency={parkingFrequency}
                            onFrequencyChange={(e) => setParkingFrequency(e.target.value)}
                            frequencyOptions={FREQ_PARKING}
                            annualAmount={annualAmount(parkingAmount, parkingFrequency)}
                        />
                        <FormField
                            label="Other Spending A"
                            value={otherSpendingAAmount}
                            onChange={(e) => setOtherSpendingAAmount(e.target.value)}
                            frequency={otherSpendingAFrequency}
                            onFrequencyChange={(e) => setOtherSpendingAFrequency(e.target.value)}
                            frequencyOptions={FREQ_PAY}
                            annualAmount={annualAmount(otherSpendingAAmount, otherSpendingAFrequency)}
                        />
                        <FormField
                            label="Other Spending B"
                            value={otherSpendingBAmount}
                            onChange={(e) => setOtherSpendingBAmount(e.target.value)}
                            frequency={otherSpendingBFrequency}
                            onFrequencyChange={(e) => setOtherSpendingBFrequency(e.target.value)}
                            frequencyOptions={FREQ_PAY}
                            annualAmount={annualAmount(otherSpendingBAmount, otherSpendingBFrequency)}
                        />

                        <div className="pt-4 border-t border-card-border grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-muted">Total Expenses</p>
                                <p className="text-xl font-semibold text-dark">
                                    ${totalExpensesPerPaycheck.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted">per paycheck</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-muted">Total Leftover for Investment</p>
                                <p className={`text-xl font-semibold ${amountLeft >= 0 ? "text-teal" : "text-danger"}`}>
                                    ${amountLeft.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted">per paycheck</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4" aria-label="Portfolio Holdings">
                    <SectionHeader title="Portfolio Holdings" />

                    <div className="flex flex-col gap-4 md:hidden">
                        {holdings.map((holding) => (
                            <HoldingCard
                                key={holding.id}
                                holding={holding}
                                onUpdate={updateHolding}
                                onRemove={removeHolding}
                                showRemove={holdings.length > 1}
                            />
                        ))}
                    </div>

                    <div className="hidden md:block bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundImage: "var(--gradient-primary)" }}>
                                    {["Symbol", "Number of Shares", "Target Allocation %", ""].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border">
                                {holdings.map((holding) => (
                                    <tr key={holding.id}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                placeholder="e.g. VTI"
                                                aria-label={`Stock symbol, row ${holdings.indexOf(holding) + 1}`}
                                                value={holding.symbol}
                                                onChange={(e) => updateHolding(holding.id, "symbol", e.target.value.toUpperCase())}
                                                className="h-9 w-full rounded-lg border-2 border-card-border px-3 text-sm text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                aria-label={`Number of shares for ${holding.symbol || `holding ${holdings.indexOf(holding) + 1}`}`}
                                                value={holding.shares}
                                                onChange={(e) => updateHolding(holding.id, "shares", e.target.value)}
                                                className="h-9 w-full rounded-lg border-2 border-card-border px-3 text-sm text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                aria-label={`Target allocation percentage for ${holding.symbol || `holding ${holdings.indexOf(holding) + 1}`}`}
                                                value={holding.targetPercent}
                                                onChange={(e) => updateHolding(holding.id, "targetPercent", e.target.value)}
                                                className="h-9 w-full rounded-lg border-2 border-card-border px-3 text-sm text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                                            />
                                        </td>
                                        <td className="px-4 py-3 w-24">
                                            {holdings.length > 1 && (
                                                <button
                                                    onClick={() => removeHolding(holding.id)}
                                                    aria-label={`Remove ${holding.symbol || "holding"}`}
                                                    className="h-9 px-4 rounded-lg border-2 border-card-border text-sm font-semibold text-dark hover:border-danger hover:text-danger hover:bg-danger/5 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between px-4 py-3 border-t border-card-border gap-4">
                            <button
                                onClick={addHolding}
                                className="h-9 px-6 rounded-lg border-2 border-card-border text-sm font-semibold text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                + Add Holding
                            </button>
                            <p className={`text-sm font-semibold ${Math.abs(totalTargetPercent - 100) < 0.01 ? "text-teal" : "text-danger"}`}>
                                Total target allocation: {totalTargetPercent.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    <div className="md:hidden flex flex-col gap-2">
                        <button
                            onClick={addHolding}
                            className="w-full h-11 rounded-lg border-2 border-card-border text-sm font-semibold text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            + Add Holding
                        </button>
                        <p className={`text-sm font-semibold ${Math.abs(totalTargetPercent - 100) < 0.01 ? "text-teal" : "text-danger"}`}>
                            Total target allocation: {totalTargetPercent.toFixed(1)}%
                        </p>
                    </div>
                </section>

                <div className="flex flex-col gap-3 pb-8">
                    <div className="flex flex-col gap-2 md:hidden">
                        <button
                            onClick={handleSave}
                            className="btn-primary w-full h-12 text-base"
                        >
                            Save &amp; Return to Dashboard
                        </button>
                        <p className="text-sm text-muted text-center">
                            <i className="fa-solid fa-hard-drive mr-1.5" aria-hidden="true"></i>Changes auto-save to local storage
                        </p>
                    </div>
                    <div className="hidden md:flex md:items-center md:justify-between gap-3">
                        <p className="text-sm text-muted">
                            <i className="fa-solid fa-hard-drive mr-1.5" aria-hidden="true"></i>Changes auto-save to local storage
                        </p>
                        <button
                            onClick={handleSave}
                            className="btn-primary h-12 px-8 text-base"
                        >
                            Save &amp; Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
            </main>
        </div>
    );
}
