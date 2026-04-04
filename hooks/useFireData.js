"use client";

import { useEffect, useMemo, useState } from "react";
import { expensePerPaycheck } from "@/lib/calculations";

const DEFAULT_HOLDINGS = [
    { id: "1", symbol: "VTI", shares: "10", targetPercent: "50" },
    { id: "2", symbol: "QQQ", shares: "5", targetPercent: "30" },
    { id: "3", symbol: "VXUS", shares: "8", targetPercent: "20" },
];

const STORAGE_KEY = "fire_inputs";

export function useFireData() {
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
    const [holdings, setHoldings] = useState(DEFAULT_HOLDINGS);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const data = JSON.parse(saved);
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
        setOtherSpendingAFrequency(data.otherSpendingAFrequency ?? "monthly");
        setOtherSpendingBAmount(data.otherSpendingBAmount ?? "0");
        setOtherSpendingBFrequency(data.otherSpendingBFrequency ?? "monthly");
        if (data.holdings && data.holdings.length > 0) {
            setHoldings(data.holdings);
        }
    }, []);

    const rentPerPaycheck = useMemo(
        () => expensePerPaycheck(rentAmount, rentFrequency, payFrequency),
        [rentAmount, rentFrequency, payFrequency],
    );
    const groceryPerPaycheck = useMemo(
        () => expensePerPaycheck(groceryAmount, groceryFrequency, payFrequency),
        [groceryAmount, groceryFrequency, payFrequency],
    );
    const vehiclePerPaycheck = useMemo(
        () => expensePerPaycheck(vehicleAmount, vehicleFrequency, payFrequency),
        [vehicleAmount, vehicleFrequency, payFrequency],
    );
    const parkingPerPaycheck = useMemo(
        () => expensePerPaycheck(parkingAmount, parkingFrequency, payFrequency),
        [parkingAmount, parkingFrequency, payFrequency],
    );
    const otherSpendingAPerPaycheck = useMemo(
        () =>
            expensePerPaycheck(
                otherSpendingAAmount,
                otherSpendingAFrequency,
                payFrequency,
            ),
        [otherSpendingAAmount, otherSpendingAFrequency, payFrequency],
    );
    const otherSpendingBPerPaycheck = useMemo(
        () =>
            expensePerPaycheck(
                otherSpendingBAmount,
                otherSpendingBFrequency,
                payFrequency,
            ),
        [otherSpendingBAmount, otherSpendingBFrequency, payFrequency],
    );

    const totalExpensesPerPaycheck = useMemo(
        () =>
            rentPerPaycheck +
            groceryPerPaycheck +
            vehiclePerPaycheck +
            parkingPerPaycheck +
            otherSpendingAPerPaycheck +
            otherSpendingBPerPaycheck,
        [
            rentPerPaycheck,
            groceryPerPaycheck,
            vehiclePerPaycheck,
            parkingPerPaycheck,
            otherSpendingAPerPaycheck,
            otherSpendingBPerPaycheck,
        ],
    );

    const amountLeft = useMemo(
        () => (Number(payAmount) || 0) - totalExpensesPerPaycheck,
        [payAmount, totalExpensesPerPaycheck],
    );

    const totalTargetPercent = useMemo(
        () =>
            holdings.reduce(
                (sum, h) => sum + (Number(h.targetPercent) || 0),
                0,
            ),
        [holdings],
    );

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

    function saveToStorage() {
        localStorage.setItem(
            STORAGE_KEY,
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
    }

    return {
        payAmount,
        setPayAmount,
        payFrequency,
        setPayFrequency,
        rentAmount,
        setRentAmount,
        rentFrequency,
        setRentFrequency,
        groceryAmount,
        setGroceryAmount,
        groceryFrequency,
        setGroceryFrequency,
        vehicleAmount,
        setVehicleAmount,
        vehicleFrequency,
        setVehicleFrequency,
        parkingAmount,
        setParkingAmount,
        parkingFrequency,
        setParkingFrequency,
        otherSpendingAAmount,
        setOtherSpendingAAmount,
        otherSpendingAFrequency,
        setOtherSpendingAFrequency,
        otherSpendingBAmount,
        setOtherSpendingBAmount,
        otherSpendingBFrequency,
        setOtherSpendingBFrequency,
        holdings,
        addHolding,
        removeHolding,
        updateHolding,
        rentPerPaycheck,
        groceryPerPaycheck,
        vehiclePerPaycheck,
        parkingPerPaycheck,
        otherSpendingAPerPaycheck,
        otherSpendingBPerPaycheck,
        totalExpensesPerPaycheck,
        amountLeft,
        totalTargetPercent,
        saveToStorage,
    };
}
