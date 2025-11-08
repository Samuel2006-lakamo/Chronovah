import { useEffect, useRef } from "react";

export function useOutsideClose(handler, listenIsCapturing = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
      }
      document.addEventListener("click", handleClick, listenIsCapturing);
      return () =>
        document.removeEventListener("click", handleClick, listenIsCapturing);
    },
    [handler, listenIsCapturing]
  );

  return { ref };
}
