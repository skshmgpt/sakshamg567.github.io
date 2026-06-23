import React from "react";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "SINGLE" | "DOUBLE" | "GRADIENT";
}

export default function Divider({ type = "SINGLE", style }: DividerProps) {
  if (type === "GRADIENT") {
    return (
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, #1F1F1C, transparent)",
          ...style,
        }}
      />
    );
  }

  if (type === "DOUBLE") {
    return (
      <div style={style}>
        <div style={{ height: 1, background: "var(--theme-border, #1F1F1C)", marginBottom: 2 }} />
        <div style={{ height: 1, background: "var(--theme-border, #1F1F1C)" }} />
      </div>
    );
  }

  return (
    <div style={style}>
      <div style={{ height: 1, background: "var(--theme-border, #1F1F1C)" }} />
    </div>
  );
}
