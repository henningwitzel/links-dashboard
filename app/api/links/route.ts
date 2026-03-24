import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function parseLinks(markdown: string) {
  const links = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]*?)\s*\|/)
    if (!match) continue
    const [, date, title, url, notes] = match
    if (date.includes('Date') || date.includes('----')) continue

    let domain = ''
    try { domain = new URL(url).hostname.replace('www.', '') } catch {}

    links.push({ date: date.trim(), title: title.trim(), url: url.trim(), notes: notes.trim(), domain })
  }

  return links
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data/links.md')
  const content = fs.readFileSync(filePath, 'utf8')
  return NextResponse.json(parseLinks(content))
}
