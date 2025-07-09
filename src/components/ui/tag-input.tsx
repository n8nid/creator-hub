import React, { useState, KeyboardEvent } from "react";
import { Badge } from "./badge";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 bg-white">
      {value.map((tag, idx) => (
        <Badge
          key={tag + idx}
          variant="outline"
          className="flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(idx)}
            className="ml-1 text-gray-400 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        className="flex-1 min-w-[100px] border-none outline-none bg-transparent py-1"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Tambah skill..."}
      />
    </div>
  );
};
