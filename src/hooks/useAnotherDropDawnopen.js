import { useEffect } from "react";
import { GLOBAL_EVENT_NAME } from "../constants";

export const useAnotherDropDawnopen = ({ idRef, setIsOpen }) => {
  useEffect(() => {
    function onAnyDropdownOpen(e) {
      const otherId = e?.detail?.id;
      if (otherId && otherId !== idRef.current) {
        setIsOpen(false);
      }
    }
    window.addEventListener(GLOBAL_EVENT_NAME, onAnyDropdownOpen);
    return () =>
      window.removeEventListener(GLOBAL_EVENT_NAME, onAnyDropdownOpen);
  }, [idRef, setIsOpen]);
};
