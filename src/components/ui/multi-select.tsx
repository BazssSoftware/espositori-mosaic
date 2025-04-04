
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options = [], // Default empty array for options
  selected = [], // Default empty array for selected
  onChange,
  placeholder = "Seleziona...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Ensure selected is always an array
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter((i) => i !== item));
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && safeSelected.length > 0) {
            onChange(safeSelected.slice(0, -1));
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [safeSelected, onChange]
  );
  
  // Filter out already selected items from safe options
  const selectables = safeOptions.filter((item) => !safeSelected.includes(item.value));

  return (
    <div className={className}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
        shouldFilter={false} // Add this to prevent filtering issues
      >
        <div className="flex items-center border border-input px-3 rounded-md">
          <div className="flex flex-wrap gap-1 p-1">
            {safeSelected.map((item) => {
              const selectedOption = safeOptions.find((option) => option.value === item);
              return (
                <Badge key={item} variant="secondary" className="rounded-sm px-1">
                  {selectedOption?.label || item}
                  <button
                    type="button"
                    className="ml-1 rounded-sm"
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Rimuovi {selectedOption?.label || item}</span>
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={safeSelected.length === 0 ? placeholder : undefined}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 h-10"
            />
          </div>
        </div>
        <div className="relative">
          {open && selectables.length > 0 && (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto max-h-60">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...safeSelected, option.value]);
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
