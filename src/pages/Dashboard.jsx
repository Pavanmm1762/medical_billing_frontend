import MetricCard from "../components/MetricCard";
import QuickAction from "../components/QuickAction";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const { daily, monthly, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load dashboard
      </div>
    );
  }

  return ( 
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard title="Today Sales" value={daily.sales} color="text-blue-600" />
        <MetricCard title="This Month Sales" value={monthly.totalSales} color="text-blue-600" />
        <MetricCard title="Purchases" value={monthly.totalPurchases} color="text-red-600" />
        <MetricCard title="Other Expenses" value={monthly.otherExpenses} color="text-red-600" />
        <MetricCard title="Fixed Expenses" value={monthly.fixedExpenses} color="text-red-600" editable/>
        <MetricCard title="Net Profit" value={monthly.netProfit} color="text-green-600" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 pt-2">
        <QuickAction to="/sales" label="➕ Add Sales" />
        <QuickAction to="/purchase" label="➕ Add Purchase" />
        <QuickAction to="/expenses" label="➕ Add Expense" />
      </div>

      {/* Daily Audit */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="font-semibold mb-3">Today Audit</p>

        <AuditRow label="Sales" value={daily.sales} color="text-blue-600" />
        <AuditRow label="Purchases" value={daily.purchases} color="text-red-600" />
        <AuditRow label="Other Expenses" value={daily.otherExpenses} color="text-red-600" />

        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Net Balance</span>
          <span className={daily.netBalance >= 0 ? "text-green-600" : "text-red-600"}>
            ₹ {daily.netBalance}
          </span>
        </div>
      </div>
    </div>
  );
}

function AuditRow({ label, value, color }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${color}`}>₹ {value}</span>
    </div>
  );
}
