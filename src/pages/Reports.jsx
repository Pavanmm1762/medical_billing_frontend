import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyReport } from "../services/reports";

import MetricCard from "../components/MetricCard";
import DailyReportList from "../components/DailyReportList";
import DownloadMenu from "../components/DownloadMenu";

export default function Reports() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data, isLoading } = useQuery({
    queryKey: ["monthly-report", month],
    queryFn: () => getMonthlyReport(month),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <DownloadMenu month={month} />
      </div>

      {/* Month selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <label className="text-sm text-gray-500">
          Select Month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full mt-1 border rounded-lg p-2"
        />
      </div>

      {isLoading && (
        <div className="text-sm text-gray-500">
          Loading report...
        </div>
      )}

      {data && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Total Sales"
              value={data.summary.totalSales}
              color="text-blue-600"
            />
            <MetricCard
              title="Purchases"
              value={data.summary.totalPurchases}
              color="text-red-600"
            />
            <MetricCard
              title="Other Expenses"
              value={data.summary.otherExpenses}
              color="text-red-600"
            />
            <MetricCard
              title="Fixed Expenses"
              value={data.summary.fixedExpenses}
              color="text-red-600"
            />
            <div className="col-span-2">
              <MetricCard
                title="Net Profit"
                value={data.summary.netProfit}
                color={
                  data.summary.netProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              />
            </div>
          </div>
          
          {/* Simple Explanation */}
          <div className="bg-white p-4 rounded-xl shadow-sm text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">
              Profit Calculation
            </p>
            <p>
              Net Profit = Sales − Purchases − Other Expenses − Fixed Expenses
            </p>
          </div>
      
          {/* Daily */}
          <DailyReportList daily={data.daily} />
        </>
      )}

    </div>
  );
}
