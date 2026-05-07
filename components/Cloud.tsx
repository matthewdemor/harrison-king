type CloudProps = { variant: 1 | 2 | 3 };

export function Cloud({ variant }: CloudProps) {
  const styles =
    variant === 1
      ? { width: 80, height: 40, top: 60, left: "10%", animation: "var(--animate-float)" }
      : variant === 2
        ? { width: 100, height: 45, top: 120, right: "8%", animation: "var(--animate-float-rev)" }
        : { width: 70, height: 35, top: 250, left: "50%", animation: "var(--animate-float)" };

  const beforeSize =
    variant === 1
      ? { w: 50, h: 50, top: -20, left: 10 }
      : variant === 2
        ? { w: 55, h: 55, top: -25, left: 15 }
        : { w: 40, h: 40, top: -18, left: 8 };

  const afterSize =
    variant === 1
      ? { w: 40, h: 40, top: -15, right: 10 }
      : variant === 2
        ? { w: 45, h: 45, top: -18, right: 10 }
        : { w: 35, h: 35, top: -12, right: 8 };

  return (
    <div className="cloud" style={styles as React.CSSProperties}>
      <span
        className="absolute bg-white rounded-full"
        style={{
          width: beforeSize.w,
          height: beforeSize.h,
          top: beforeSize.top,
          left: beforeSize.left,
        }}
      />
      <span
        className="absolute bg-white rounded-full"
        style={{
          width: afterSize.w,
          height: afterSize.h,
          top: afterSize.top,
          right: afterSize.right,
        }}
      />
    </div>
  );
}
