export default async function handler(req, res) {
  const symbol = req.query.symbol;

  try {
    // Hit homepage to get cookies
    await fetch("https://www.nseindia.com", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const response = await fetch(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.nseindia.com/"
      }
    });

    const data = await response.json();
    const iNAV = data?.marketDeptOrderBook?.iNav || null;
    res.status(200).json({ symbol, iNAV });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
