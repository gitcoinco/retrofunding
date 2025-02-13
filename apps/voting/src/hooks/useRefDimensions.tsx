import { useEffect, useRef, useState } from "react";

export const useRefDimensions = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<{
    height: number | null;
    width: number | null;
  }>({ height: null, width: null });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          height: ref.current.clientHeight,
          width: ref.current.clientWidth,
        });
      }
    };
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return { ref, ...dimensions };
};
