import * as React from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MultiSelectComboboxProps {
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter(
    (opt) =>
      opt.toLowerCase().includes(search.toLowerCase()) && !value.includes(opt)
  );

  return (
    <div className="w-full">
      <div
        className="flex flex-wrap gap-2 border rounded px-2 py-1 bg-white cursor-pointer min-h-[40px]"
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        {value.length === 0 && (
          <span className="text-gray-400 select-none">
            {placeholder || "Pilih kategori..."}
          </span>
        )}
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((v) => v !== tag));
              }}
              className="ml-1 text-gray-400 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg">
          <Command>
            <CommandInput
              placeholder="Cari kategori..."
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              {filtered.length === 0 && (
                <div className="p-2 text-gray-400 text-sm">Tidak ada hasil</div>
              )}
              {filtered.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange([...value, opt]);
                    setSearch("");
                  }}
                >
                  {opt}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
