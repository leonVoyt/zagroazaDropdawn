import { useState } from "react";
import { emitDropdownOpen } from "../utils";

export const useOnKeyDown = ({
  isOpen,
  setIsOpen,
  idRef,
  buttonRef,
  items,
  handleSelect,
}) => {
  const [highlightIndex, setHighlightIndex] = useState(-1);
  function onKeyDown(e) {
    if (
      !isOpen &&
      (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      setIsOpen(true);
      emitDropdownOpen(idRef.current);
      return;
    }
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((idx) =>
        Math.min(idx === -1 ? 0 : idx + 1, Math.max(items.length - 1, 0))
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((idx) => Math.max(idx - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const opt = items[highlightIndex];
      if (opt) handleSelect(opt);
      return;
    }
  }

  return { highlightIndex, setHighlightIndex, onKeyDown };
};
