export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring"
        {...props}
      />
    </div>
  );
}
