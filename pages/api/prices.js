async function getPrices(symbols) {
    const key = process.env.MARKETSTACK_API_KEY;
    const symbolList = symbols.join(",");
    const url =
        `https://api.marketstack.com/v2/eod/latest` +
        `?access_key=${encodeURIComponent(key)}` +
        `&symbols=${encodeURIComponent(symbolList)}`;

    const response = await fetch(url);
    const data = await response.json();

    const prices = {};
    for (const sym of symbols) prices[sym] = null;

    const rows = data.data;
    for (const row of rows) {
        const symbol = String(row.symbol).toUpperCase();
        const close = Number(row.close ?? row.adj_close);
        if (prices.hasOwnProperty(symbol)) prices[symbol] = close;
    }

    return prices;
}

export default async function handler(req, res) {
    switch (req.method) {
        case "GET": {
            const raw = req.query.symbols;
            if (!raw) {
                return res
                    .status(400)
                    .json({ error: "Missing ?symbols= query parameter" });
            }
            const symbols = raw
                .split(",")
                .map((s) => s.trim().toUpperCase())
                .filter(Boolean);
            try {
                const prices = await getPrices(symbols);
                return res.status(200).json({
                    prices,
                    source: "marketstack",
                    updatedAt: new Date().toISOString(),
                });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }
        default:
            return res.status(404).end();
    }
}
