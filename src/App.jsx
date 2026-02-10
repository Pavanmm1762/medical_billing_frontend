import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Dashboard from "./pages/Dashboard";
import DailySales from "./pages/DailySales";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import FixedExpenses from "./pages/FixedExpenses";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 pb-16">
        <AppHeader />

         <div className="pt-2">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<DailySales />} />
            <Route path="/purchase" element={<Purchases />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/fixed-expenses" element={<FixedExpenses />} />
          </Routes>
        </div>

        <BottomNav /> 
      </div>
    </BrowserRouter>
  );
}
