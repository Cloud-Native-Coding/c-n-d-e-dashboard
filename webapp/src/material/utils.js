import { useRef, useEffect } from "react";
import { MDCRipple } from "@material/ripple";

export function useRipple(ref) {
  const r = useRef(ref);

  useEffect(function() {
    const ripple = new MDCRipple(r.current);

    return () => {
      try {
        ripple.destroy();
      } catch (e) {
        console.warn(e);
      }
    };
  }, []);

  return r;
}
