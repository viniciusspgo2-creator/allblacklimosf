import React from "react";

/**
 * Lightweight Markdown → HTML renderer for blog content.
 * Supports: headings (#, ##, ###), bold, italic, links, lists,
 * blockquotes, paragraphs, hr.
 *
 * Note: input is trusted (created by admin), but we still escape HTML.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inlineFormat(s: string): string {
  let out = escapeHtml(s);
  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Internal links [text](/path)
  out = out.replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>');
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  out = out.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  // Inline code
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let blockquote: string[] = [];
  let paragraph: string[] = [];
  let tableBuffer: string[][] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      const html = inlineFormat(paragraph.join(" "));
      blocks.push(
        <p key={`p-${blocks.length}`} dangerouslySetInnerHTML={{ __html: html }} />
      );
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0) {
      const items = list.map((li, i) => (
        <li key={`li-${blocks.length}-${i}`} dangerouslySetInnerHTML={{ __html: inlineFormat(li) }} />
      ));
      blocks.push(<ul key={`ul-${blocks.length}`}>{items}</ul>);
      list = [];
    }
  };
  const flushOrderedList = () => {
    if (orderedList.length > 0) {
      const items = orderedList.map((li, i) => (
        <li key={`ol-${blocks.length}-${i}`} dangerouslySetInnerHTML={{ __html: inlineFormat(li) }} />
      ));
      blocks.push(<ol key={`ol-${blocks.length}`}>{items}</ol>);
      orderedList = [];
    }
  };
  const flushBlockquote = () => {
    if (blockquote.length > 0) {
      const html = blockquote.map((l) => inlineFormat(l)).join("<br />");
      blocks.push(
        <blockquote key={`bq-${blocks.length}`} dangerouslySetInnerHTML={{ __html: html }} />
      );
      blockquote = [];
    }
  };
  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const rows = tableBuffer.map((row, ri) => {
        const cells = row.map((cell, ci) => {
          if (ri === 0) {
            return <th key={`th-${ri}-${ci}`} dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />;
          }
          return <td key={`td-${ri}-${ci}`} dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />;
        });
        return <tr key={`tr-${ri}`}>{cells}</tr>;
      });
      blocks.push(
        <div key={`tbl-${blocks.length}`} style={{ overflowX: "auto", margin: "20px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>{rows}</tbody>
          </table>
        </div>
      );
      tableBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      flushList();
      flushOrderedList();
      flushBlockquote();
      flushTable();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph(); flushList(); flushOrderedList(); flushBlockquote(); flushTable();
      blocks.push(<h2 key={`h2-${blocks.length}`}>{trimmed.slice(2)}</h2>);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph(); flushList(); flushOrderedList(); flushBlockquote(); flushTable();
      blocks.push(<h3 key={`h3-${blocks.length}`}>{trimmed.slice(3)}</h3>);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushParagraph(); flushList(); flushOrderedList(); flushBlockquote(); flushTable();
      blocks.push(<h4 key={`h4-${blocks.length}`} style={{ color: "var(--gold-bright)", fontFamily: "var(--font-display)", fontSize: "20px" }}>{trimmed.slice(4)}</h4>);
      continue;
    }
    if (trimmed === "---" || trimmed === "***") {
      flushParagraph(); flushList(); flushOrderedList(); flushBlockquote(); flushTable();
      blocks.push(<hr key={`hr-${blocks.length}`} style={{ borderColor: "var(--line)", margin: "28px 0" }} />);
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushParagraph(); flushList(); flushOrderedList(); flushTable();
      blockquote.push(trimmed.slice(2));
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph(); flushOrderedList(); flushBlockquote(); flushTable();
      list.push(trimmed.slice(2));
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph(); flushList(); flushBlockquote(); flushTable();
      orderedList.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    }
    if (trimmed.startsWith("|")) {
      flushParagraph(); flushList(); flushOrderedList(); flushBlockquote();
      const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
      // Skip separator rows like | --- | --- |
      if (!cells.every((c) => /^-+$/.test(c))) {
        tableBuffer.push(cells);
      }
      continue;
    }
    // Fallback: paragraph text
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushOrderedList();
  flushBlockquote();
  flushTable();

  return <div className="article-body">{blocks}</div>;
}
