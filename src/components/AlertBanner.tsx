import { TriangleAlert } from 'lucide-react';

interface AlertBannerProps {
  message: string;
}

export default function AlertBanner({ message }: AlertBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
        <TriangleAlert className="h-[18px] w-[18px] text-amber-400" />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <p className="text-sm font-medium text-amber-200">{message}</p>
        <button className="rounded-lg px-3 py-1 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/10">
          View details
        </button>
      </div>
    </div>
  );
}
