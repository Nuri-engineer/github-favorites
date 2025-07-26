import { useCallback, useEffect, useState } from "react";
import { FaWindows } from "react-icons/fa";

export function useHelpModal() {
  const [showHelp, setShowHelp] = useState(false);

  const open = useCallback(() => setShowHelp(true), []);
  const close = useCallback(() => setShowHelp(false), []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") close();
    };
    if (showHelp) {
      window.addEventListener("keydown", onEsc);
    }
    return () => window.removeEventListener("keydown", onEsc);
  }, [showHelp, close]);

  return { showHelp, open, close };
}
