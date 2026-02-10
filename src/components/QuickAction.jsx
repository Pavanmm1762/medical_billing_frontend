import { Link } from "react-router-dom";

export default function QuickAction({ to, label }) {
  return (
    <Link
      to={to}
      className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl font-medium"
    >
      {label}
    </Link>
  );
}
