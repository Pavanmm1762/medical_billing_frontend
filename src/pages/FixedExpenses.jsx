import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFixedExpenses } from "../hooks/useFixedExpenses";

export default function FixedExpenses() {
  const navigate = useNavigate();

  // Default → current month
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data, isLoading, save } = useFixedExpenses(month);

  const [rent, setRent] = useState("");
  const [electricity, setElectricity] = useState("");
  const [others, setOthers] = useState("");

  /* Prefill when data loads */
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRent(data.rent ?? "");
      setElectricity(data.electricity ?? "");
      setOthers(data.others ?? "");
    } else {
      setRent("");
      setElectricity("");
      setOthers("");
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    save.mutate(
      {
        month,
        rent: Number(rent) || 0,
        electricity: Number(electricity) || 0,
        others: Number(others) || 0,
      },
      {
        onSuccess: () => {
          toast.success("Fixed expenses saved");
          navigate(-1); // 🔙 Back to dashboard
        },
        onError: () => {
          toast.error("Failed to save fixed expenses");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-xl font-bold">Fixed Expenses</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-sm space-y-3"
      >
        {/* Month */}
        <div>
          <label className="text-sm text-gray-500">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <Input label="Rent" value={rent} set={setRent} />
        <Input label="Electricity" value={electricity} set={setElectricity} />
        <Input label="Other Fixed" value={others} set={setOthers} />

        <button
          type="submit"
          disabled={save.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          {save.isPending ? "Saving..." : "Save Fixed Expenses"}
        </button>
      </form>
    </div>
  );
}

/* Reusable input */
function Input({ label, value, set }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full mt-1 border rounded-lg p-2"
      />
    </div>
  );
}
