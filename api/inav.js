import { fetch } from 'undici';

export default async function handler(req, res) {
  const symbol = req.query.symbol || 'HDFCSML250';

  try {
    const response = await fetch(`https://www.nseindia.com/api/quote-equity?symbol=${symbol}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.nseindia.com'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch NSE data' });
    }

    const json = await response.json();

    const priceInfo = json?.priceInfo || {};
    const iNAV = parseFloat(priceInfo.iNavValue || 0);
    const lastPrice = parseFloat(priceInfo.lastPrice || 0);
    const change = parseFloat(priceInfo.change || 0);
    const percentChange = parseFloat(priceInfo.pChange || 0);
    const premiumDiscount = iNAV && lastPrice ? (lastPrice - iNAV).toFixed(2) : null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      symbol,
      iNAV,
      lastPrice,
      change,
      percentChange,
      premiumDiscount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
