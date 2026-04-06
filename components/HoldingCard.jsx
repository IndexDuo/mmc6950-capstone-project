export function HoldingCard({ holding, onUpdate, onRemove, showRemove }) {
    return (
        <div className="bg-white rounded-xl border border-card-border shadow-sm p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-dark">
                    Symbol
                </label>
                <input
                    type="text"
                    placeholder="e.g. VTI"
                    maxLength={6}
                    value={holding.symbol}
                    onChange={(e) =>
                        onUpdate(
                            holding.id,
                            "symbol",
                            e.target.value.replace(/\s/g, "").toUpperCase().slice(0, 6),
                        )
                    }
                    className="h-11 w-full rounded-lg border-2 border-card-border px-4 text-base text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                />
            </div>
            <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-dark">
                        Shares
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={holding.shares}
                        onChange={(e) => {
                            if (e.target.value.length <= 12) onUpdate(holding.id, "shares", e.target.value);
                        }}
                        className="h-11 w-full rounded-lg border-2 border-card-border px-4 text-base text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-dark">
                        Target %
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={holding.targetPercent}
                        onChange={(e) => {
                            if (e.target.value.length <= 12) onUpdate(holding.id, "targetPercent", e.target.value);
                        }}
                        className="h-11 w-full rounded-lg border-2 border-card-border px-4 text-base text-dark bg-white focus-visible:border-primary focus-visible:outline-none transition-colors"
                    />
                </div>
            </div>
            {showRemove && (
                <button
                    onClick={() => onRemove(holding.id)}
                    aria-label={`Remove ${holding.symbol || "holding"}`}
                    className="w-full h-11 rounded-lg border-2 border-card-border font-semibold text-sm text-dark hover:border-danger hover:text-danger hover:bg-danger/5 transition-colors focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                >
                    Remove
                </button>
            )}
        </div>
    );
}
