export function paychecksPerYear(frequency) {
    if (frequency === "weekly") return 52;
    if (frequency === "biweekly") return 26;
    if (frequency === "monthly") return 12;
    return 1;
}

export function annualMultiplier(frequency) {
    if (frequency === "weekly") return 52;
    if (frequency === "biweekly") return 26;
    if (frequency === "monthly") return 12;
    if (frequency === "biannually") return 2;
    if (frequency === "annually") return 1;
    return 12;
}

export function expensePerPaycheck(
    amount,
    expenseFrequency,
    paycheckFrequency,
) {
    const amt = Number(amount) || 0;
    const paychecks = paychecksPerYear(paycheckFrequency);
    const annual = amt * annualMultiplier(expenseFrequency);
    return annual / paychecks;
}

export function annualAmount(amount, frequency) {
    const amt = Number(amount) || 0;
    return amt * annualMultiplier(frequency);
}
