"use client";

import React from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  language?: string;
}

function leftPad(str: string, length: number): string {
  return str.length >= length ? str : " ".repeat(length - str.length) + str;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ children, language, ...rest }, ref) => {
    const text = String(children ?? "");
    const lines = text.split("\n");
    const lineCount = lines.length;
    const pad = Math.max(3, String(lineCount).length);

    return (
      <div className="my-6">
        <div className="flex flex-row items-center justify-between border border-b-0 border-[#1F1F1C] bg-[#111110] px-4 py-2">
          <span className="font-mono text-[11px] text-[#889988] tracking-[0.06em] uppercase">
            {language ?? ""}
          </span>
          <span className="font-mono text-[11px] text-[#1F1F1C]">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
          </span>
        </div>
        <pre
          ref={ref}
          className="border border-[#1F1F1C] overflow-x-auto m-0 font-mono text-xs leading-relaxed"
          {...rest}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex flex-row min-h-[1lh] hover:bg-[#111110] transition-colors"
            >
              <span className="shrink-0 w-[5ch] text-right pr-4 select-none text-[#4A4A46] border-r border-[#1F1F1C] py-px">
                {leftPad(String(index + 1), pad)}
              </span>
              <span className="text-[#F0F0EB] whitespace-pre pl-4 py-px">
                {line || " "}
              </span>
            </div>
          ))}
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
