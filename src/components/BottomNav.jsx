import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠", exact: true },
  { to: "/sales", label: "Sales", icon: "💰" },
  { to: "/purchase", label: "Purchase", icon: "📦" },
  { to: "/reports", label: "Reports", icon: "📊" },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm h-16 grid grid-cols-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-xs font-medium transition
             ${
               isActive
                 ? "text-blue-600 border-t-2 border-blue-600"
                 : "text-gray-500"
             }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
