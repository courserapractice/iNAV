import fetch from 'node-fetch';

export default async function handler(req, res) {
  const symbol = req.query.symbol || "HDFCSML250";

  try {
    // Step 1: Set NSE homepage to get cookies
    await fetch("https://www.nseindia.com", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    // Step 2: Fetch ETF data
    const response = await fetch(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.nseindia.com/",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from NSE" });
    }

    const data = await response.json();
    const priceInfo = data?.priceInfo || {};

    const iNAV = parseFloat(priceInfo.iNavValue || 0);
    const ltp = parseFloat(priceInfo.lastPrice || 0);
    const change = parseFloat(priceInfo.change || 0);
    const percentChange = parseFloat(priceInfo.pChange || 0);
    const premium = iNAV && ltp ? (ltp - iNAV).toFixed(2) : null;

    res.status(200).json({
      symbol,
      iNAV,
      lastPrice: ltp,
      change,
      percentChange,
      premiumDiscount: premium
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
