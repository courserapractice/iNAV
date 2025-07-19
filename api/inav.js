
import { fetch } from 'undici';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch NSE data" });
    }

    const data = await response.json();

    const inav = data?.priceInfo?.iNavValue;
    const lastPrice = data?.priceInfo?.lastPrice;

    res.status(200).json({
      symbol,
      inav,
      lastPrice,
      premiumOrDiscount: (lastPrice && inav) ? (lastPrice - inav).toFixed(2) : null
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
