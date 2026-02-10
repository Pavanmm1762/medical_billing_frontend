import { useState } from "react";

export default function Expenses() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  // Dummy history (later from backend)
  const history = [
    { date: "2026-02-01", type: "Transport", amount: 300 },
    { date: "2026-02-02", type: "Repair", amount: 1200 },
    { date: "2026-02-03", type: "Misc", amount: 450 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    alert(`Expense saved: ${type} – ₹${amount}`);
    setType("");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">Other Expenses</h1>

      {/* Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-sm space-y-3"
      >
        <div>
          <label className="text-sm text-gray-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Expense Type</label>
          <input
            type="text"
            placeholder="Transport / Repair / Misc"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Amount</label>
          <input
            type="number"
            placeholder="₹ 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          Save Expense
        </button>
      </form>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b font-semibold">
          Expense History
        </div>

        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between px-4 py-3 border-b last:border-none"
          >
            <div>
              <p className="font-medium">{item.type}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>

            <div className="font-semibold text-red-600">
              ₹ {item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
