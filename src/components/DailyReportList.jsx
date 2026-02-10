import { useState, useEffect } from "react";

export default function DailyReportList({ daily }) {
  /* ---------------------------
     Pagination state (ADDED)
  ----------------------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);  

  /* Reset page when data or page size changes */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [daily, pageSize]);

  /* ---------------------------
     Pagination logic
  ----------------------------*/
  const totalItems = daily.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedDaily = daily.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 font-semibold border-b">
        Day-wise Summary
      </div>

      {daily.length === 0 && (
        <div className="p-4 text-sm text-gray-500">
          No data for this month
        </div>
      )}

      {paginatedDaily.map((d) => (
        <div
          key={d.date}
          className="px-4 py-3 border-b last:border-none"
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium">{d.date}</span>
            <span
              className={
                d.profit >= 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              ₹ {d.profit}
            </span>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Sales: ₹{d.sales}</span>
            <span>Purchase: ₹{d.purchases}</span>
            <span>Expense: ₹{d.otherExpenses}</span>
          </div>
        </div>
      ))}

      {/* 🔹 Pagination Footer (ADDED) */}
      {totalItems > 0 && (
        <div className="p-4 border-t flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Showing {startIndex + 1}–{endIndex} of {totalItems}
            </span>

            <select
              value={pageSize}
              onChange={(e) =>
                setPageSize(Number(e.target.value))
              }
              className="border rounded px-2 py-1 text-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex gap-3">
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
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
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
  );
}
