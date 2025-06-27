import React, { useEffect, useState } from 'react';
const METALS = [
  { label: 'Gold (XAU/USD)', value: 'XAU/USD' },
  { label: 'Gold (XAU/INR)', value: 'XAU/INR' },
  { label: 'Silver (XAG/USD)', value: 'XAG/USD' },
  { label: 'Silver (XAG/INR)', value: 'XAG/INR' },
];

const CURRENCY_PAIRS = [
  { label: 'USD to INR', base: 'USD', target: 'INR' },
  { label: 'USD to EUR', base: 'USD', target: 'EUR' },
  { label: 'EUR to USD', base: 'EUR', target: 'USD' },
];

// API Keys

const GOLD_API_KEY = import.meta.env.VITE_GOLD_API_KEY;
const GOLD_API_BASE = 'https://www.goldapi.io/api';

const CURRENCY_API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const CURRENCY_API_BASE = 'https://api.currencyapi.com/v3/latest';

function RatesSidebar() {
  const [selectedMetal, setSelectedMetal] = useState(METALS[0].value);
  const [selectedPair, setSelectedPair] = useState(CURRENCY_PAIRS[0]);

  const [goldPrice, setGoldPrice] = useState(null);
  const [goldLoading, setGoldLoading] = useState(false);
  const [goldError, setGoldError] = useState(null);

  const [currencyRate, setCurrencyRate] = useState(null);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState(null);

  // Fetch metal price (Gold/Silver) using GoldAPI.io
  useEffect(() => {
    const [metal, currency] = selectedMetal.split('/');
    setGoldLoading(true);
    setGoldError(null);
    setGoldPrice(null);

    fetch(`${GOLD_API_BASE}/${metal}/${currency}`, {
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch metal price');
        return res.json();
      })
      .then(data => {
        if (data && data.price) setGoldPrice(data.price);
        else setGoldError(data.message || 'Failed to get metal price');
      })
      .catch((err) => {
        setGoldError(err.message || 'Error fetching metal price');
      })
      .finally(() => setGoldLoading(false));
  }, [selectedMetal]);

  // Fetch currency exchange rate using currencyapi.com
  useEffect(() => {
    const { base, target } = selectedPair;
    setCurrencyLoading(true);
    setCurrencyError(null);
    setCurrencyRate(null);

    fetch(`${CURRENCY_API_BASE}?apikey=${CURRENCY_API_KEY}&base_currency=${base}&currencies=${target}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch currency rate');
        return res.json();
      })
      .then(data => {
        if (data && data.data && data.data[target] && data.data[target].value) {
          setCurrencyRate(data.data[target].value);
        } else {
          setCurrencyError('Failed to get currency rate');
        }
      })
      .catch(() => setCurrencyError('Error fetching currency rate'))
      .finally(() => setCurrencyLoading(false));
  }, [selectedPair]);

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '';
    }
  };

  const metalCurrency = selectedMetal.split('/')[1];
  const symbol = getCurrencySymbol(metalCurrency);

  return (
    <nav className="rates-bar" style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Metal:&nbsp;
          <select
            value={selectedMetal}
            onChange={e => setSelectedMetal(e.target.value)}
          >
            {METALS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
        <div>
          <strong>{METALS.find(m => m.value === selectedMetal)?.label}:</strong>&nbsp;
          <span>
            {goldLoading
              ? 'Loading...'
              : goldError
                ? <span style={{ color: 'red' }}>{goldError}</span>
                : goldPrice !== null
                  ? `${symbol}${goldPrice.toFixed(2)}`
                  : '-'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Currency Pair:&nbsp;
          <select
            value={`${selectedPair.base}/${selectedPair.target}`}
            onChange={e => {
              const [base, target] = e.target.value.split('/');
              const pair = CURRENCY_PAIRS.find(p => p.base === base && p.target === target);
              if (pair) setSelectedPair(pair);
            }}
          >
            {CURRENCY_PAIRS.map(p => (
              <option key={`${p.base}${p.target}`} value={`${p.base}/${p.target}`}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <div>
          <strong>{selectedPair.label}:</strong>&nbsp;
          <span>
            {currencyLoading
              ? 'Loading...'
              : currencyError
                ? <span style={{ color: 'red' }}>{currencyError}</span>
                : currencyRate !== null
                  ? currencyRate.toFixed(2)
                  : '-'}
          </span>
        </div>
      </div>

      {/* Fuel Prices Section */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
        <strong>Fuel Prices in India:</strong><br />
        <a
          href="https://www.mypetrolprice.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          View Petrol & Diesel Prices →
        </a>
      </div>
    </nav>
  );
}

export default RatesSidebar;
