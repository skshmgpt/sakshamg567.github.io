export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createHeadingIdGenerator() {
  const seen = new Map<string, number>();

  return (text: string) => {
    const base = slugifyHeading(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

function cleanHeadingText(text: string) {
  return text
    .replace(/\s+#+\s*$/, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[\\*_~]/g, "")
    .trim();
}

export function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const getId = createHeadingIdGenerator();
  let isInFence = false;

  for (const line of content.split("\n")) {
    if (/^```/.test(line.trim())) {
      isInFence = !isInFence;
      continue;
    }

    if (isInFence) continue;

    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (!match) continue;

    const text = cleanHeadingText(match[2]);
    if (!text) continue;

    headings.push({
      id: getId(text),
      text,
      level: match[1].length,
    });
  }

  return headings;
}
