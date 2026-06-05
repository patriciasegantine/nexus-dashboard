export const ACCENT_COLORS = [
  { border: "border-l-blue-400 border-b-blue-400",     avatar: "bg-blue-500" },
  { border: "border-l-violet-400 border-b-violet-400", avatar: "bg-violet-500" },
  { border: "border-l-emerald-400 border-b-emerald-400", avatar: "bg-emerald-500" },
  { border: "border-l-orange-400 border-b-orange-400", avatar: "bg-orange-500" },
  { border: "border-l-pink-400 border-b-pink-400",     avatar: "bg-pink-500" },
  { border: "border-l-teal-400 border-b-teal-400",     avatar: "bg-teal-500" },
  { border: "border-l-yellow-400 border-b-yellow-400", avatar: "bg-yellow-500" },
  { border: "border-l-rose-400 border-b-rose-400",     avatar: "bg-rose-500" },
]

export const TAG_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
]

export function colorIndex(id: string, length: number) {
  return id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % length
}

export function progressColor(progress: number, total: number) {
  if (total === 0 || progress === 0) return "bg-red-500"
  if (progress < 30) return "bg-red-500"
  if (progress < 70) return "bg-amber-500"
  return "bg-emerald-500"
}
