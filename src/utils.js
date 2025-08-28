import { GLOBAL_EVENT_NAME } from "./constants";

export const handleGetOptionId = (opt) =>
  typeof opt === "object" && opt !== null
    ? opt.id ?? opt.value ?? String(opt)
    : String(opt);

export const handleGetOptionLabel = (opt) =>
  typeof opt === "object" && opt !== null
    ? opt.label ?? opt.text ?? String(opt)
    : String(opt);

export const emitDropdownOpen = (id) => {
  window.dispatchEvent(new CustomEvent(GLOBAL_EVENT_NAME, { detail: { id } }));
};
