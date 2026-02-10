import { Link } from "react-router-dom";

export default function MetricCard({
  title,
  value,
  color = "text-gray-800",
  editable = false,  
  editLink = "/fixed-expenses",
}) {
  return (
    <div className="relative bg-white rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <p className={`mt-1 text-2xl font-bold ${color}`}>
        ₹ {value}
      </p>

      {editable && (
        <Link
          to={editLink}
          className="absolute top-3 right-3 text-xs text-blue-600 font-medium"
        >
          Edit
        </Link>
      )}
    </div>
  );
}
