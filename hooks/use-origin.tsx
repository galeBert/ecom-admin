import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setisMounted] = useState(false);
  const origin =
    (typeof window !== "undefined" && window.location.origin) ?? "";

  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!mounted) {
    return "";
  }

  return origin;
};
