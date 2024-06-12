import React from "react";

export default function useResizeObserver() {
  const ref = React.useRef<HTMLDivElement>(null);

  const [clientHeight, setClientHeight] = React.useState(0);

  React.useEffect(() => {
    const { current } = ref;

    const observer = new ResizeObserver((entries) => {
      setClientHeight(entries[0].target.clientHeight);
    });
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  return { ref, clientHeight };
}
