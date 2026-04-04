export function ContributionCard({
    symbol,
    price,
    shares,
    value,
    currentPercent,
    targetPercent,
    diffPercent,
    suggestedAmount,
}) {
    const diffPositive = diffPercent >= 0;

    return (
        <div className="bg-white rounded-xl border border-card-border shadow-sm p-6">
            {/* Header: symbol left, suggested $ right */}
            <div className="flex items-start justify-between">
                <p className="text-primary font-bold text-xl">{symbol}</p>
                <div className="text-right">
                    <p className="text-muted text-xs">Suggested $</p>
                    <p
                        className={`font-semibold text-base ${suggestedAmount > 0 ? "text-teal" : "text-dark"}`}
                    >
                        +${suggestedAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <hr
                className="border-[#E5E7EB] my-4 -mx-6"
                style={{
                    marginLeft: 0,
                    marginRight: 0,
                    borderColor: "#E5E7EB",
                }}
                aria-hidden="true"
            />

            {/*Shares | Price | Value | Current % | Target % | Difference */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <p className="text-muted text-xs">Shares</p>
                    <p className="text-dark font-semibold text-sm">{shares}</p>
                </div>
                <div>
                    <p className="text-muted text-xs">Price</p>
                    <p className="text-dark font-semibold text-sm">
                        {price == null ? "—" : `$${Number(price).toFixed(2)}`}
                    </p>
                </div>
                <div>
                    <p className="text-muted text-xs">Value</p>
                    <p className="text-dark font-semibold text-sm">
                        ${value.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-muted text-xs">Current %</p>
                    <p className="text-dark font-semibold text-sm">
                        {currentPercent.toFixed(2)}%
                    </p>
                </div>
                <div>
                    <p className="text-muted text-xs">Target %</p>
                    <p className="text-primary font-semibold text-sm">
                        {targetPercent.toFixed(2)}%
                    </p>
                </div>
                <div>
                    <p className="text-muted text-xs">Difference</p>
                    <p
                        className={`font-semibold text-sm ${diffPositive ? "text-teal" : "text-danger"}`}
                    >
                        {diffPositive ? "+" : ""}
                        {diffPercent.toFixed(2)}%
                    </p>
                </div>
            </div>
        </div>
    );
}
