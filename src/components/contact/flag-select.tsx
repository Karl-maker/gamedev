"use client";

import Image from "next/image";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type FlagSelectOption = {
  id: string;
  value: string;
  countryCode: string;
  label: string;
  secondary?: string;
  search?: string;
};

type FlagSelectProps = {
  options: FlagSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  name?: string;
  invalid?: boolean;
};

const flagUrl = (countryCode: string) => `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

export function FlagSelect({ options, value, onChange, placeholder, ariaLabel, name, invalid }: FlagSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.id === value);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return options;
    return options.filter((option) =>
      `${option.label} ${option.secondary ?? ""} ${option.countryCode} ${option.search ?? ""}`.toLocaleLowerCase().includes(term)
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function choose(option: FlagSelectOption) {
    onChange(option.id);
    setQuery("");
    setOpen(false);
    buttonRef.current?.focus();
  }

  function focusOption(current: HTMLElement | null, direction: 1 | -1) {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    if (!items.length) return;
    const index = current ? items.indexOf(current) : -1;
    const next = direction === 1
      ? items[Math.min(index + 1, items.length - 1)]
      : items[Math.max(index - 1, 0)];
    next?.focus();
  }

  return (
    <div className="flag-select" ref={rootRef}>
      {name && <input type="hidden" name={name} value={selected?.value ?? ""} />}
      <button
        ref={buttonRef}
        className="flag-select-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-invalid={invalid || undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="flag-select-value">
          {selected ? (
            <>
              <Image unoptimized src={flagUrl(selected.countryCode)} alt="" width={26} height={19} aria-hidden="true" />
              <span><strong>{selected.label}</strong>{selected.secondary && <small>{selected.secondary}</small>}</span>
            </>
          ) : <span className="flag-placeholder">{placeholder}</span>}
        </span>
        <ChevronDown aria-hidden="true" className={open ? "is-open" : ""} />
      </button>

      {open && (
        <div className="flag-select-popover">
          <div className="flag-select-search">
            <Search aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  focusOption(null, 1);
                }
              }}
              placeholder="Search country or code"
              aria-label={`Search ${ariaLabel.toLowerCase()}`}
            />
          </div>
          <div ref={listRef} id={listboxId} className="flag-select-list" role="listbox" aria-label={ariaLabel}>
            {filtered.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className="flag-select-option"
                key={option.id}
                onClick={() => choose(option)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    focusOption(event.currentTarget, event.key === "ArrowDown" ? 1 : -1);
                  }
                }}
              >
                <Image loading="lazy" unoptimized src={flagUrl(option.countryCode)} alt="" width={28} height={20} aria-hidden="true" />
                <span><strong>{option.label}</strong>{option.secondary && <small>{option.secondary}</small>}</span>
                {option.id === value && <Check aria-hidden="true" />}
              </button>
            ))}
            {filtered.length === 0 && <p className="flag-select-empty">No matching country found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
