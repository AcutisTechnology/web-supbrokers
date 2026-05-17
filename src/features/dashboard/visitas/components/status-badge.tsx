import { VisitStatus } from "../types/visit";
import { STATUS_LABELS, STATUS_VARIANTS } from "../utils/visit-labels";

type Props = {
  status: VisitStatus;
  className?: string;
};

export function VisitStatusBadge({ status, className }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_VARIANTS[status]} ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
