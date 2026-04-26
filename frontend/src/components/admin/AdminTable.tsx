import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

function AdminTable({ headers, children, className }: AdminTableProps) {
  return (
    <div className={cn("card-base overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;