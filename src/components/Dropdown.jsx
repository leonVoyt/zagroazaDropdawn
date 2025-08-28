import { useEffect, useMemo, useRef, useState } from "react";
import {
  emitDropdownOpen,
  handleGetOptionId,
  handleGetOptionLabel,
} from "../utils";
import { useDebaunce } from "../hooks/useDebaunce";
import { useOnKeyDown } from "../hooks/useOnKeyDown";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useAnotherDropDawnopen } from "../hooks/useAnotherDropDawnopen";
import "./Dropdown.css";

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  dropdownClassName = "",
  listClassName = "",
  optionClassName = "",
  renderSelected,
  renderOption,
  getOptionId = handleGetOptionId,
  getOptionLabel = handleGetOptionLabel,
  searchEnabled = true,
  searchPlaceholder = "Search...",
  searchFn, // (query, options) => Promise<filteredOptions> | filteredOptions
  noOptionsText = "No options",
}) {
  const idRef = useRef(Math.random().toString(36).slice(2));
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchedOptions, setSearchedOptions] = useState(options ?? []);

  useEffect(() => {
    setSearchedOptions(options ?? []);
  }, [options]);

  useAnotherDropDawnopen({ idRef, setIsOpen });

  useOutsideClick({ isOpen, rootRef, setIsOpen });

  function handleFocus() {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      emitDropdownOpen(idRef.current);
    }
  }

  function toggleOpen() {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) emitDropdownOpen(idRef.current);
      return next;
    });
  }

  function handleSelect(opt) {
    onChange?.(opt);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  const { isSearching } = useDebaunce({
    options,
    query,
    searchEnabled,
    searchFn,
    setSearchedOptions,
    getOptionLabel,
  });

  const selectedLabel = useMemo(() => {
    if (value == null) return placeholder;
    return renderSelected ? renderSelected(value) : getOptionLabel(value);
  }, [value, placeholder, renderSelected, getOptionLabel]);

  const items = searchEnabled ? searchedOptions : options ?? [];

  const { highlightIndex, onKeyDown, setHighlightIndex } = useOnKeyDown({
    buttonRef,
    handleSelect,
    idRef,
    isOpen,
    items,
    setIsOpen,
  });

  return (
    <div
      ref={rootRef}
      className={`dropdown ${className}`.trim()}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        ref={buttonRef}
        className={`dropdown__button ${
          disabled ? "dropdown__button--disabled" : ""
        }`.trim()}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleOpen();
        }}
        onFocus={handleFocus}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={`dropdown__selected`}>{selectedLabel}</span>
        <span
          className={`dropdown__chevron ${
            isOpen ? "dropdown__chevron--open" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={`dropdown__menu ${dropdownClassName}`.trim()}>
          {searchEnabled && (
            <div className="dropdown__search">
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="dropdown__search-input"
                placeholder={searchPlaceholder}
                autoFocus
              />
            </div>
          )}
          <ul
            role="listbox"
            className={`dropdown__list ${listClassName}`.trim()}
          >
            {isSearching ? (
              <li className="dropdown__option dropdown__option--disabled">
                Searching...
              </li>
            ) : items.length === 0 ? (
              <li className="dropdown__option dropdown__option--disabled">
                {noOptionsText}
              </li>
            ) : (
              items.map((opt, index) => {
                const id = getOptionId(opt);
                const isSelected = value ? getOptionId(value) === id : false;
                const isActive = index === highlightIndex;
                return (
                  <li
                    key={id}
                    role="option"
                    aria-selected={isSelected}
                    className={`dropdown__option ${optionClassName} ${
                      isSelected ? "dropdown__option--selected" : ""
                    } ${isActive ? "dropdown__option--active" : ""}`.trim()}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(opt)}
                  >
                    {renderOption
                      ? renderOption(opt, isActive, isSelected)
                      : getOptionLabel(opt)}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
