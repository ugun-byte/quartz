import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const signalsDir = path.join(repoRoot, "content", "signals");
const dailyDir = path.join(repoRoot, "content", "daily");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function listSignalFiles() {
  if (!fs.existsSync(signalsDir)) return [];
  return fs
    .readdirSync(signalsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(signalsDir, name));
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  return String(tags)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractObservationWindow(content) {
  const patterns = [
    />\s*관측 창:\s*\*\*([^*]+)\*\*/,
    /관측 창:\s*([^\n]+)/,
    /(\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*[^\n]+?KST)/,
    /(\d{4}-\d{2}-\d{2}\s*[^\n]+?KST)/,
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/\s+/g, " ");
  }
  return "관측 창 미기재";
}

function firstParagraph(content) {
  const body = content
    .replace(/^---[\s\S]*?---\s*/, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith(">"));
  return body.find((line) => !line.startsWith("- ")) ?? "";
}

function signalRecord(file) {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const slug = path.basename(file, ".md");
  const date = parsed.data.date ? String(parsed.data.date).slice(0, 10) : "undated";
  const tags = normalizeTags(parsed.data.tags);
  const title = parsed.data.title ?? slug;
  const description = parsed.data.description ?? firstParagraph(parsed.content);
  const window = extractObservationWindow(parsed.content);
  const isFourHour = tags.includes("4시간-브리핑") || tags.includes("4-hour-briefing") || String(title).includes("4시간");

  return { file, slug, date, tags, title, description, window, isFourHour };
}

function sortSignals(a, b) {
  return String(a.window).localeCompare(String(b.window), "ko") || String(a.title).localeCompare(String(b.title), "ko");
}

function groupByDate(records) {
  const groups = new Map();
  for (const record of records) {
    if (record.date === "undated") continue;
    if (!groups.has(record.date)) groups.set(record.date, []);
    groups.get(record.date).push(record);
  }
  return groups;
}

function writeDailyIndex(groups) {
  const dates = [...groups.keys()].sort().reverse();
  const lines = [
    "---",
    'title: "일간 신호 자료실"',
    'description: "Signal Cabinet 4시간 브리핑을 날짜별로 모아보는 자료실"',
    "tags:",
    '  - "signal-cabinet"',
    '  - "일간브리핑"',
    '  - "daily-archive"',
    "draft: false",
    "---",
    "",
    "# 일간 신호 자료실",
    "",
    "4시간마다 수집된 Signal Cabinet 브리핑을 날짜별로 모아보는 공간입니다.",
    "",
  ];

  for (const date of dates) {
    const records = groups.get(date).slice().sort(sortSignals);
    const fourHourCount = records.filter((record) => record.isFourHour).length;
    lines.push(`- [${date} 하루 신호 모음](./${date}) — 브리핑 ${records.length}개${fourHourCount ? `, 4시간 브리핑 ${fourHourCount}개` : ""}`);
  }

  lines.push("");
  fs.writeFileSync(path.join(dailyDir, "index.md"), `${lines.join("\n")}\n`);
}

function writeDailyPage(date, records) {
  const sorted = records.slice().sort(sortSignals);
  const fourHour = sorted.filter((record) => record.isFourHour);
  const tags = [...new Set(sorted.flatMap((record) => record.tags))]
    .filter((tag) => !["signal-cabinet", "x-briefing", "X-브리핑"].includes(tag))
    .slice(0, 12);

  const lines = [
    "---",
    `title: "${date} 하루 신호 모음"`,
    `description: "${date}에 발행된 Signal Cabinet 브리핑 ${sorted.length}개를 한곳에 모은 일간 자료실"`,
    `date: "${date}"`,
    "tags:",
    '  - "signal-cabinet"',
    '  - "일간브리핑"',
    '  - "daily-archive"',
    '  - "X-브리핑"',
    "draft: false",
    "---",
    "",
    `# ${date} 하루 신호 모음`,
    "",
    `이 페이지는 ${date}에 발행된 Signal Cabinet 브리핑을 하루 단위로 묶은 자료실입니다.`,
    "",
    "## 한눈에 보기",
    "",
    `- 전체 브리핑: **${sorted.length}개**`,
    `- 4시간 브리핑: **${fourHour.length}개**`,
    tags.length ? `- 주요 태그: ${tags.map((tag) => `#${tag}`).join(" ")}` : "- 주요 태그: 없음",
    "",
    "## 시간대별 브리핑",
    "",
  ];

  for (const record of sorted) {
    lines.push(`### [${record.title}](../signals/${record.slug})`);
    lines.push("");
    lines.push(`- 관측 창: ${record.window}`);
    lines.push(`- 파일: \`${record.slug}.md\``);
    lines.push(`- 태그: ${record.tags.map((tag) => `#${tag}`).join(" ") || "없음"}`);
    if (record.description) {
      lines.push(`- 요약: ${String(record.description).replace(/\s+/g, " ")}`);
    }
    lines.push("");
  }

  lines.push("## 전체 브리핑 링크");
  lines.push("");
  for (const record of sorted) {
    lines.push(`- [${record.title}](../signals/${record.slug})`);
  }
  lines.push("");

  fs.writeFileSync(path.join(dailyDir, `${date}.md`), `${lines.join("\n")}\n`);
}

ensureDir(dailyDir);
const records = listSignalFiles().map(signalRecord).filter((record) => record.date !== "undated");
const groups = groupByDate(records);
writeDailyIndex(groups);
for (const [date, dayRecords] of groups.entries()) {
  writeDailyPage(date, dayRecords);
}

console.log(`Generated ${groups.size} daily archive pages in content/daily`);
