import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Tooltip.module.css";

type Position = {
  top?: number;
  left?: number;
};

export const Tooltip = ({
  anchorRef,
  offset = 10,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  offset?: number;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({});

  useLayoutEffect(() => {
    if (!anchorRef.current) return;

    if (show) {
      const tooltipWidth =
        tooltipRef?.current?.getBoundingClientRect()?.width || 0;
      const anchorRect = anchorRef.current.getBoundingClientRect();

      const top = anchorRect.bottom + offset;
      const left = anchorRect.x + anchorRect.width / 2 - tooltipWidth / 2;

      // update position if changed
      setPosition((position) => {
        if (position.top === top && position.left === left) return position;
        return { top, left };
      });
    } else {
      setPosition({});
    }
  }, [show, anchorRef, tooltipRef]);

  useEffect(() => {
    const showListener = () => setShow(true);
    const hideListener = () => setShow(false);

    anchorRef.current?.addEventListener("mouseenter", showListener);
    anchorRef.current?.addEventListener("mouseleave", hideListener);
    () => {
      anchorRef.current?.removeEventListener("mouseenter", showListener);
      anchorRef.current?.removeEventListener("mouseleave", hideListener);
    };
  }, [tooltipRef, anchorRef]);

  if (!show) return null;

  return (
    <div ref={tooltipRef} className={styles.tooltip} style={position}>
      {children}
    </div>
  );
};
