import { useNavigate, useLocation } from "react-router-dom";

const titles = {
  "/": "Dashboard",
  "/sales": "Daily Sales",
  "/purchase": "Purchases",
  "/expenses": "Other Expenses",
  "/reports": "Reports",
  "/fixed-expenses": "Fixed Expenses",
};

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const title = titles[location.pathname] || "Medical App";
  const showBack = location.pathname !== "/";

  const today = new Date();
  const dateText = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const monthText = today.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const isDashboard = location.pathname === "/";

  return (
    <div className="sticky top-0 z-20 bg-white border-b h-14 flex items-center px-4 justify-between">
      {/* Left: Back + Title */}
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 text-xl"
            aria-label="Back"
          >
            ←
          </button>
        )}
        <h1 className="text-lg font-semibold truncate">
          {title}
        </h1>
      </div>

      {/* Right: Date / Month indicator */}
      <div className="text-xs text-gray-500">
        {isDashboard ? dateText : monthText}
      </div>
    </div>
  );
}
