import { useCallback, useEffect, useMemo, useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const open = useCallback((item) => {
    if (!item) return;
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") close();
    };

    if (isOpen) {
      window.addEventListener("keydown", onEsc);
    }
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, close]);

  return useMemo(
    () => ({
      isOpen,
      selectedItem,
      open,
      close,
    }),
    [isOpen, selectedItem, open, close]
  );
}
