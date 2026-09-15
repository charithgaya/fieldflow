import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

