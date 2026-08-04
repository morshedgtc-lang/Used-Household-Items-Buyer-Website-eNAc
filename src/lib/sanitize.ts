import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

export function sanitizePlainText(input: string, maxLength = 5000): string {
  return input.replace(/[<>]/g, "").trim().slice(0, maxLength);
}
