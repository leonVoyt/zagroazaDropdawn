import { useEffect } from "react";
import { GLOBAL_EVENT_NAME } from "../constants";

export const useAnotherDropDawnopen = ({ idRef, setIsOpen }) => {
  useEffect(() => {
    let rafId = null;
    function onAnyDropdownOpen(e) {
      const otherId = e?.detail?.id;
      if (otherId && otherId !== idRef.current) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => setIsOpen(false));
      }
    }
    window.addEventListener(GLOBAL_EVENT_NAME, onAnyDropdownOpen);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener(GLOBAL_EVENT_NAME, onAnyDropdownOpen);
    };
  }, [idRef, setIsOpen]);
};
