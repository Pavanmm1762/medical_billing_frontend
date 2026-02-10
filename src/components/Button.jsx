export default function Button({ text, ...props }) {
  return (
    <button
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
      {...props}
    >
      {text}
    </button>
  );
}
