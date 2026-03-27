"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type DropdownOption = {
  id: string;
  label: string;
  color?: string;
};

type Props = {
  label: string;
  options: DropdownOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function MultiSelectDropdown({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
          selected.length > 0
            ? "border-primary/50 bg-primary/10 text-foreground"
            : "border-white/10 bg-surface text-muted hover:border-white/20"
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <>
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold">
              {selected.length}
            </span>
            <X size={13} onClick={clear} className="text-muted hover:text-foreground transition-colors" />
          </>
        )}
        {selected.length === 0 && <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 min-w-[180px] rounded-xl border border-white/10 bg-surface shadow-xl overflow-y-auto max-h-64">
          {options.length === 0 ? (
            <p className="text-xs text-muted px-3 py-2">Nessuna opzione</p>
          ) : (
            options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggle(opt.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                      isSelected ? "bg-primary border-primary" : "border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white fill-none stroke-current stroke-2">
                        <polyline points="1,4 4,7 9,1" />
                      </svg>
                    )}
                  </span>
                  {opt.color && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: opt.color }}
                    />
                  )}
                  <span className="text-foreground">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
