// Import necessary hooks from React and an icon from Heroicons
import { useState, useEffect } from "react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

// Main App Component
export default function App() {
  // State to track input amount from user
  const [amount, setAmount] = useState(1);

  // State to store the converted amount
  const [converted, setConverted] = useState(null);

  // State to store the list of available currency options
  const [currencyOptions, setCurrencyOptions] = useState([]);

  // Your API key for the currency API
  const API_KEY = "cur_live_NLAHflWlAAXwULtDCTTZznG5nYLVMJQkvkzU7yuM";


  // State for selected "from" currency
  const [fromCurrency, setFromCurrency] = useState({
    country: "India",
    symbol: "₹",
    code: "INR",
  });

  // State for selected "to" currency
  const [toCurrency, setToCurrency] = useState({
    country: "USA",
    symbol: "$",
    code: "USD",
  });

  // Fetches conversion rate and calculates converted amount
  const fetchRate = async () => {
    try {
      const todayRes = await fetch(
        `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${fromCurrency.code}&currencies=${toCurrency.code}`
      );

      const todayData = await todayRes.json();
      const latestRate = todayData.data[toCurrency.code].value;

      // Update converted value based on latest rate and input amount
      setConverted(latestRate * amount);
    } catch (err) {
      console.error("Error fetching currency rates:", err);
    }
  };

  // Swap the "from" and "to" currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Fetch currency metadata on initial render (symbols, names, codes)
  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch(
        `https://api.currencyapi.com/v3/currencies?apikey=${API_KEY}`
      );
      const data = await res.json();

      // Format the currency data into a usable array
      const options = Object.entries(data.data).map(([code, currency]) => ({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol_native || currency.symbol || "",
        country: currency.countries?.[0] || currency.name,
      }));

      setCurrencyOptions(options);
    };

    fetchCurrencies();
  }, []);

  // Re-fetch conversion rate whenever input amount or selected currencies change
  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="min-h-screen bg-[url('assets/bg.jpg')] bg-center bg-cover bg-no-repeat flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-4xl p-8 w-full max-w-4xl text-white border border-white/20">

        {/* App Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-semibold">🌍 Currency Converter</h1>

          {/* Live Status Indicator */}
          <span className="flex items-center gap-1 text-green-500 font-semibold text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600" />
            </span>
            Live
          </span>
        </div>

        {/* Currency Selectors and Swap Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* From Currency Selector */}
          <div className="flex items-start justify-between bg-white/5 p-4 rounded-xl w-full md:w-1/2">
            <select
              className="bg-transparent text-white font-medium appearance-none outline-none flex-1 w-1/2"
              value={fromCurrency.code}
              onChange={(e) => {
                const selected = currencyOptions.find(
                  (opt) => opt.code === e.target.value
                );
                if (selected) setFromCurrency(selected);
              }}
            >
              {currencyOptions.map((option) => (
                <option
                  key={option.code}
                  value={option.code}
                  className="text-black"
                >
                  {option.name}
                </option>
              ))}
            </select>

            {/* Display symbol and code of selected currency */}
            <div className="flex items-center gap-2">
              <span className="border-2 border-blue-600 rounded-full px-2 py-0.5 text-sm">
                {fromCurrency.symbol}
              </span>
              <span className="text-sm">{fromCurrency.code}</span>
            </div>
          </div>

          {/* Swap Button */}
          <button
            className="p-2 rounded-full transition bg-white/10 hover:bg-white/20"
            onClick={handleSwap}
          >
            <ArrowsRightLeftIcon className="w-6 h-6 text-white hover:text-gray-400 cursor-pointer" />
          </button>

          {/* To Currency Selector */}
          <div className="flex items-start justify-between bg-white/5 p-4 rounded-xl w-full md:w-1/2">
            <select
              className="bg-transparent text-white font-medium appearance-none outline-none flex-1 w-1/2"
              value={toCurrency.code}
              onChange={(e) => {
                const selected = currencyOptions.find(
                  (opt) => opt.code === e.target.value
                );
                if (selected) setToCurrency(selected);
              }}
            >
              {currencyOptions.map((option) => (
                <option
                  key={option.code}
                  value={option.code}
                  className="text-black"
                >
                  {option.name}
                </option>
              ))}
            </select>

            {/* Display symbol and code of selected currency */}
            <div className="flex items-center gap-2">
              <span className="border-2 border-blue-600 rounded-full px-2 py-0.5 text-sm">
                {toCurrency.symbol}
              </span>
              <span className="text-sm">{toCurrency.code}</span>
            </div>
          </div>
        </div>

        {/* Amount Input and Result Display */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 py-5 mt-4">

          {/* Input for Amount in From Currency */}
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <input
              type="number"
              className="bg-white/10 text-white p-4 rounded-xl outline-none w-full"
              placeholder="From amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Divider Line (only on medium screens and up) */}
          <div className="hidden md:block w-px h-14 bg-white/50 mx-2" />

          {/* Display Converted Amount in To Currency */}
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <input
              type="number"
              className="bg-white/10 text-white p-4 rounded-xl outline-none w-full"
              placeholder="To amount"
              value={converted ? converted.toFixed(2) : ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
