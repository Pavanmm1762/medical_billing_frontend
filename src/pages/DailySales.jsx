import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  saveDailySales,
  getSalesByDate,
  getSalesHistory,
} from "../services/api";

export default function DailySales() {
  const queryClient = useQueryClient();
  const lastDateRef = useRef(null);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [cash, setCash] = useState("");
  const [online, setOnline] = useState("");

  /* 🔹 Pagination state (ADDED) */
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const total =
    (Number(cash) || 0) + (Number(online) || 0);

  /* Load sales for selected date */
  const salesQuery = useQuery({
    queryKey: ["daily-sales", date],
    queryFn: () => getSalesByDate(date),
    enabled: !!date,
    retry: false,
  });

  /* Load history */
  const historyQuery = useQuery({
    queryKey: ["sales-history"],
    queryFn: getSalesHistory,
  });

  useEffect(() => {
    if (!salesQuery.isSuccess) return;

    if (lastDateRef.current !== date) {
      if (salesQuery.data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCash(String(salesQuery.data.cashAmount ?? ""));
        setOnline(String(salesQuery.data.onlineAmount ?? ""));
      } else {
        setCash("");
        setOnline("");
      }

      lastDateRef.current = date;
    }
  }, [salesQuery.isSuccess, salesQuery.data, date]);

  /* Reset page when history updates (ADDED) */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [historyQuery.data]);

  /* 🔹 Save mutation */
  const mutation = useMutation({
    mutationFn: saveDailySales,

    onSuccess: () => {
      toast.success("Sales saved successfully");
      queryClient.invalidateQueries({ queryKey: ["daily-sales", date] });
      queryClient.invalidateQueries({ queryKey: ["sales-history"] });
      queryClient.invalidateQueries({ queryKey: ["daily-report", date] });
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: () => {
      toast.error("Failed to save sales");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cash && !online) {
      toast.error("Enter cash or online amount");
      return;
    }

    mutation.mutate({
      saleDate: date,
      cashAmount: Number(cash) || 0,
      onlineAmount: Number(online) || 0,
    });
  };

  const handleDateChange = (e) => {
    lastDateRef.current = null;
    setDate(e.target.value);
  };

  /* 🔹 Pagination logic (ADDED) */
  const history = historyQuery.data || [];
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const paginatedHistory = history.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Entry Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-sm space-y-3"
      >
        <div>
          <label className="text-sm text-gray-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Cash Sales</label>
          <input
            type="number"
            placeholder="₹ Cash"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Online Sales</label>
          <input
            type="number"
            placeholder="₹ UPI / Card"
            value={online}
            onChange={(e) => setOnline(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        <div className="flex justify-between text-sm font-medium pt-2 border-t">
          <span>Total Sales</span>
          <span className="text-blue-600">₹ {total}</span>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          {mutation.isPending ? "Saving..." : "Save Sales"}
        </button>
      </form>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b font-semibold">
          Sales History
        </div>

        {historyQuery.isLoading && (
          <div className="p-4 text-sm text-gray-500">
            Loading history...
          </div>
        )}

        {paginatedHistory.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b last:border-none"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{item.saleDate}</span>
              <span className="font-semibold">
                ₹ {item.totalAmount}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Cash: ₹{item.cashAmount}</span>
              <span>Online: ₹{item.onlineAmount}</span>
            </div>
          </div>
        ))}

        {/* 🔹 Mobile-friendly Pagination (ADDED) */}
        {totalItems > 0 && (
          <div className="p-4 flex flex-col gap-2">
            <div className="text-xs text-gray-500 text-center">
              Showing {startIndex + 1}–{endIndex} of {totalItems}
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
