import { useEffect } from "react";

export const useOutsideClick = ({ setIsOpen, rootRef, isOpen }) => {
  useEffect(() => {
    function onDocumentMouseDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function onDocumentFocusIn(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", onDocumentMouseDown);
      document.addEventListener("focusin", onDocumentFocusIn);
    }
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("focusin", onDocumentFocusIn);
    };
  }, [isOpen]);
};
