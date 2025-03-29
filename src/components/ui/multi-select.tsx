
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
  options,
  selected,
  onChange,
  placeholder = "Seleziona...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            onChange(selected.slice(0, -1));
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, onChange]
  );

  const selectables = options.filter((item) => !selected.includes(item.value));

  return (
    <div className={className}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="flex items-center border border-input px-3 rounded-md">
          <div className="flex flex-wrap gap-1 p-1">
            {selected.map((item) => {
              const selectedOption = options.find((option) => option.value === item);
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
              placeholder={selected.length === 0 ? placeholder : undefined}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 h-10"
            />
          </div>
        </div>
        <div className="relative">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto max-h-60">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onChange([...selected, option.value]);
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
}
