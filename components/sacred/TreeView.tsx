"use client";

import React, { useState } from "react";

interface TreeViewProps {
  children?: React.ReactNode;
  defaultValue?: boolean;
  depth?: number;
  isFile?: boolean;
  isLastChild?: boolean;
  parentLines?: boolean[];
  style?: React.CSSProperties;
  title: React.ReactNode;
}

export default function TreeView({
  defaultValue = false,
  title,
  children,
  depth = 0,
  isFile = false,
  isLastChild = false,
  style,
  parentLines = [],
}: TreeViewProps) {
  const [show, setShow] = useState<boolean>(defaultValue);

  const onToggleShow = () => {
    if (!isFile) setShow((prev) => !prev);
  };

  const hasChildren = React.Children.count(children) > 0;

  const spacing = parentLines.map((line) => (line ? "│ . " : ". . ")).join("");
  const endPrefix = isLastChild ? "└───" : "├───";
  const prefix = `${spacing}${endPrefix}`;
  const icon = isFile ? " " : show ? "╦ " : "╤ ";

  const updatedParentLines = [...parentLines, !isLastChild];

  return (
    <div className="font-mono text-xs leading-[1.3] select-none" style={style}>
      <div
        tabIndex={0}
        role="button"
        onClick={onToggleShow}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.key === " ") e.preventDefault();
            onToggleShow();
          }
        }}
        className="text-[#889988] hover:text-[#F0F0EB] cursor-pointer whitespace-pre focus:outline-none focus:text-[#00FF41] transition-colors"
        aria-expanded={show}
      >
        {prefix}
        {icon}
        {title}
      </div>
      {show && hasChildren && (
        <div>
          {React.Children.map(children, (child, index) =>
            React.isValidElement(child)
              ? React.cloneElement(
                  child as React.ReactElement<TreeViewProps>,
                  {
                    depth: depth + 1,
                    isLastChild: index === React.Children.count(children) - 1,
                    parentLines: updatedParentLines,
                  } as Partial<TreeViewProps>
                )
              : child
          )}
        </div>
      )}
    </div>
  );
}
