export function randomColorGenerator() {
  // Returns a random Tailwind background color class for badges
  const colors = [
    "bg-blue-100/50 text-blue-700",
    "bg-green-100/50 text-green-700",
    "bg-yellow-100/50 text-yellow-700",
    "bg-purple-100/50 text-purple-700",
    "bg-pink-100/50 text-pink-700",
    "bg-indigo-100/50 text-indigo-700",
    "bg-red-100/50 text-red-700",
    "bg-gray-100/50 text-gray-700",
    "bg-teal-100/50 text-teal-700",
    "bg-orange-100/50 text-orange-700",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}