import Link from "next/link";

type FileRow = {
  name   : string;
  type   : string;
  size   : string;
  updated: string;
};

type FileTableProps = {
  rows: FileRow[];
};

export const FileTable = ({ rows }: FileTableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-130 text-left text-sm">
        <thead className="bg-white/5 text-[10px] uppercase tracking-[0.25em] text-white/40">
          <tr>
            <th className="px-4 py-3">Archivo</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Tamano</th>
            <th className="px-4 py-3 text-right">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-t border-white/5 transition hover:bg-white/5"
            >
              <td className="px-4 py-3 text-white/90">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold text-white/70">
                    {row.type}
                  </span>
                  <div className="space-y-1">
                    <Link
                      href={`/drive?file=${encodeURIComponent(row.name)}`}
                      className="text-sm font-semibold text-white/90 transition hover:text-white"
                    >
                      {row.name}
                    </Link>
                    <p className="text-xs text-white/40">Abrir en Drive</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-white/60">{row.type}</td>
              <td className="px-4 py-3 text-white/60">{row.size}</td>
              <td className="px-4 py-3 text-right text-white/60">{row.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
