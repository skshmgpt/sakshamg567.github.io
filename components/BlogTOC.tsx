"use client";

import TreeView from "@/components/sacred/TreeView";
import type { BlogHeading } from "@/lib/blog-headings";
import React from "react";

type HeadingNode = BlogHeading & { children: HeadingNode[] };

function buildTree(headings: BlogHeading[]): HeadingNode[] {
  const root: HeadingNode[] = [];
  const stack: HeadingNode[] = [];

  for (const heading of headings) {
    const h = {
      ...heading,
      level: Math.max(1, heading.level),
    };
    const node = { ...h, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return root;
}

function getScrollContainer() {
  return document.querySelector<HTMLElement>("[data-blog-scroll-container]");
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  const container = getScrollContainer();

  if (!el) return;

  if (!container) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const containerTop = container.getBoundingClientRect().top;
  const elementTop = el.getBoundingClientRect().top;
  container.scrollTo({
    top: container.scrollTop + elementTop - containerTop - 16,
    behavior: "smooth",
  });
}

function HeadingTitle({ heading }: { heading: BlogHeading }) {
  return (
    <button
      type="button"
      data-nav
      onClick={(event) => {
        event.stopPropagation();
        scrollToHeading(heading.id);
      }}
      className="text-left text-inherit transition-colors hover:text-[#F0F0EB] focus:outline-none focus:text-[#00FF41]"
    >
      {heading.text}
    </button>
  );
}

function renderTree(nodes: HeadingNode[]): React.ReactNode {
  return nodes.map((node, index) => {
    const hasChildren = node.children.length > 0;

    return (
      <TreeView
        key={node.id}
        title={<HeadingTitle heading={node} />}
        isFile={!hasChildren}
        isLastChild={index === nodes.length - 1}
        defaultValue={node.level <= 2}
      >
        {hasChildren ? renderTree(node.children) : null}
      </TreeView>
    );
  });
}

export default function BlogTOC({ headings }: { headings: BlogHeading[] }) {
  const tree = buildTree(headings);

  if (tree.length === 0) return null;

  return (
    <nav className="p-4" aria-label="Blog table of contents">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#00FF41]">
        index
      </div>
      <div className="overflow-x-auto pb-2">{renderTree(tree)}</div>
    </nav>
  );
}
