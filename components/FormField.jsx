export function FormField({
    label,
    hint,
    value,
    onChange,
    frequency,
    onFrequencyChange,
    frequencyOptions,
    annualAmount,
}) {
    const inputId = label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const selectId = `${inputId}-frequency`;

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={inputId}
                className="text-sm font-semibold text-dark"
            >
                {label}
            </label>
            <div className="flex gap-2 items-center min-w-0">
                <input
                    id={inputId}
                    type="number"
                    value={value}
                    onChange={(e) => { if (e.target.value.length <= 12) onChange(e); }}
                    placeholder="0"
                    className="flex-1 min-w-0 h-11 rounded-lg border-2 border-card-border px-3 text-base text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                />
                <select
                    id={selectId}
                    aria-label={`${label} frequency`}
                    value={frequency}
                    onChange={onFrequencyChange}
                    className="shrink-0 w-[90px] sm:w-auto h-11 rounded-lg border-2 border-card-border px-2 sm:px-3 text-xs sm:text-sm text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors cursor-pointer"
                >
                    {frequencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {annualAmount != null && (
                <p className="text-xs text-muted">
                    Annual: ${annualAmount.toFixed(2)}
                </p>
            )}
            {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
    );
}
