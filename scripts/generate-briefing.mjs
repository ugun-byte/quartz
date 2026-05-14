#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

const root = process.cwd()
const args = process.argv.slice(2)

function argValue(name, fallback) {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const inputPath = argValue("--input", "data/processed/latest-briefing.json")
const outputDir = argValue("--out", "content/signals")
const dryRun = args.includes("--dry-run")

function readJson(file) {
  const full = path.resolve(root, file)
  if (!fs.existsSync(full)) {
    throw new Error(`Input JSON not found: ${file}`)
  }
  return JSON.parse(fs.readFileSync(full, "utf8"))
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function fallbackCodename(briefing) {
  const seed = [
    briefing.title,
    briefing.summary,
    briefing.publishedAt,
    JSON.stringify(briefing.sections ?? []),
  ].join("|")
  const hash = crypto.createHash("sha1").update(seed).digest("hex").slice(0, 8)
  return `signal-cabinet-${hash}`
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""))
}

function listYaml(values) {
  const arr = Array.isArray(values) ? values : []
  if (arr.length === 0) return "[]"
  return `\n${arr.map((v) => `  - ${yamlString(v)}`).join("\n")}`
}

function renderBriefing(briefing) {
  const title = briefing.title || "Untitled Signal"
  const codename = slugify(briefing.codename || title) || fallbackCodename(briefing)
  const date = briefing.publishedAt || new Date().toISOString()
  const description = briefing.description || briefing.summary || "Signal Cabinet briefing"
  const tags = ["signal-cabinet", "x-briefing", ...(briefing.tags || [])]
  const uniqueTags = [...new Set(tags)]

  const lines = []
  lines.push("---")
  lines.push(`title: ${yamlString(title)}`)
  lines.push(`description: ${yamlString(description)}`)
  lines.push(`date: ${yamlString(date)}`)
  lines.push(`tags: ${listYaml(uniqueTags)}`)
  lines.push("draft: false")
  lines.push("---")
  lines.push("")
  lines.push(`# ${title}`)
  lines.push("")
  if (briefing.window) {
    lines.push(`> 관측 창: **${briefing.window}**`)
    lines.push("")
  }
  if (briefing.summary) {
    lines.push("## Cabinet Note")
    lines.push("")
    lines.push(briefing.summary)
    lines.push("")
  }

  const sections = Array.isArray(briefing.sections) ? briefing.sections : []
  for (const section of sections) {
    lines.push(`## ${section.title || section.sector || "Signal"}`)
    lines.push("")
    if (section.summary) {
      lines.push(section.summary)
      lines.push("")
    }
    const signals = Array.isArray(section.signals) ? section.signals : []
    for (const signal of signals) {
      const person = signal.person || "Unknown"
      const handle = signal.handle ? `[@${signal.handle}](https://x.com/${signal.handle})` : ""
      lines.push(`### ${person}${handle ? ` ${handle}` : ""}`)
      lines.push("")
      if (signal.text) {
        lines.push(signal.text)
        lines.push("")
      }
      if (signal.whyItMatters) {
        lines.push(`**왜 중요한가:** ${signal.whyItMatters}`)
        lines.push("")
      }
      if (signal.url) {
        lines.push(`원문: ${signal.url}`)
        lines.push("")
      }
    }
  }

  lines.push("---")
  lines.push("")
  lines.push(
    "이 글은 Signal Cabinet 자동 파이프라인으로 생성되었습니다. 날짜는 메타데이터로 보존하고, 파일명은 그날의 핵심 분위기를 담은 코드네임을 사용합니다.",
  )
  lines.push("")

  return { codename, markdown: lines.join("\n") }
}

try {
  const briefing = readJson(inputPath)
  const { codename, markdown } = renderBriefing(briefing)
  const outputPath = path.join(outputDir, `${codename}.md`)

  if (dryRun) {
    console.log(markdown)
  } else {
    fs.mkdirSync(path.resolve(root, outputDir), { recursive: true })
    fs.writeFileSync(path.resolve(root, outputPath), markdown)
    console.log(`Generated ${outputPath}`)
  }
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
