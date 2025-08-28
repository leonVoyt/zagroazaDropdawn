import { useEffect, useRef, useState } from "react";

export const useDebaunce = ({
  searchEnabled,
  options,
  query,
  getOptionLabel,
  searchFn,
  setSearchedOptions,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const searchFnRef = useRef(searchFn);
  const getOptionLabelRef = useRef(getOptionLabel);

  useEffect(() => {
    searchFnRef.current = searchFn;
  }, [searchFn]);

  useEffect(() => {
    getOptionLabelRef.current = getOptionLabel;
  }, [getOptionLabel]);

  useEffect(() => {
    if (!searchEnabled) return;
    let active = true;
    const timer = setTimeout(async () => {
      const effectiveOptions = options ?? [];
      const getLabel = getOptionLabelRef.current;
      const doSearch = searchFnRef.current;
      if (!doSearch) {
        const local = query
          ? effectiveOptions.filter((opt) =>
              getLabel(opt).toLowerCase().includes(query.toLowerCase())
            )
          : effectiveOptions;
        if (active) setSearchedOptions(local);
        return;
      }
      try {
        setIsSearching(true);
        const result = await Promise.resolve(doSearch(query, effectiveOptions));
        if (active) setSearchedOptions(Array.isArray(result) ? result : []);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, searchEnabled, options]);

  return { isSearching, setIsSearching, searchFnRef };
};
