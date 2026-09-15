type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  OPEN: "bg-gray-700 text-gray-200",
  ASSIGNED: "bg-blue-900/60 text-blue-200",
  IN_PROGRESS: "bg-yellow-900/60 text-yellow-200",
  COMPLETED: "bg-green-900/60 text-green-200",
  CANCELLED: "bg-red-900/60 text-red-200",

  AVAILABLE: "bg-green-900/60 text-green-200",
  BUSY: "bg-yellow-900/60 text-yellow-200",
  UNAVAILABLE: "bg-gray-700 text-gray-300",
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-gray-700 text-gray-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {formatStatus(status)}
    </span>
  );
}

