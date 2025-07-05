// utitlity helper to strip HTML tags, replace multiple spaces and remove emojis and special symbols
export const cleanTextContent = (html: string): string => {
  let text = html.replace(/<[^>]*>?/gm, "");
  text = text.replace(/[^\w\s.,!?;:'"-]/g, "");
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

// Utility function to truncate text to 100 character count
export const truncateText = (
  text: string,
  charCount: number = 100,
  ellipsis: boolean = true
): string => {
  const cleanText = cleanTextContent(text);
  if (cleanText.length <= charCount) return cleanText;
  return cleanText.substring(0, charCount) + (ellipsis ? "..." : "");
};

// Combined utility for HTML content preview
export const getHtmlPreview = (
  html: string,
  charCount: number = 100
): string => {
  return truncateText(html, charCount);
};

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
}

export function formatDate(ms: number) {
  const date = new Date(ms);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// remove unneeded json and text format
export const cleanGeminiJsonBlock = (raw: string): string => {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();
};
