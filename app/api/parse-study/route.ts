import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

type Card = { front: string; back: string };

function parseMd(text: string): Card[] {
  const cards: Card[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Pattern 1: `**Term**: Definition` or `**Term** - Definition`
    const boldMatch = line.match(/^\*\*(.+?)\*\*\s*[:\-–]\s*(.+)$/);
    if (boldMatch) {
      cards.push({ front: boldMatch[1].trim(), back: boldMatch[2].trim() });
      i++;
      continue;
    }

    // Pattern 2: `### Heading` followed by non-empty content paragraph
    const headMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headMatch) {
      const heading = headMatch[1].trim();
      let body = "";
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && !lines[j].trim().startsWith("#")) {
        body = lines[j].trim();
      }
      if (body) {
        cards.push({ front: heading, back: body });
      }
      i++;
      continue;
    }

    // Pattern 3: `- Term: Definition` or `- Q: A`
    const bulletColonMatch = line.match(/^[-*]\s+(.+?)\s*[:\-–]\s*(.+)$/);
    if (bulletColonMatch) {
      cards.push({ front: bulletColonMatch[1].trim(), back: bulletColonMatch[2].trim() });
      i++;
      continue;
    }

    // Pattern 4: Markdown table row `| Front | Back |`
    if (line.startsWith("|") && line.includes("|")) {
      const parts = line.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2 && !parts[0].match(/^[-:]+$/)) {
        cards.push({ front: parts[0], back: parts[1] });
      }
      i++;
      continue;
    }

    // Pattern 5: `Term: Definition` (no bullet, colon-separated, line < 150 chars)
    if (line.length < 150 && !line.startsWith("#") && !line.startsWith("!")) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 2 && colonIdx < line.length - 2) {
        const front = line.slice(0, colonIdx).trim();
        const back  = line.slice(colonIdx + 1).trim();
        if (front.length < 80 && back.length > 0) {
          cards.push({ front, back });
          i++;
          continue;
        }
      }
    }

    i++;
  }

  return cards.filter((c) => c.front.length > 0 && c.back.length > 0);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const form   = await req.formData();
    const file   = form.get("file") as File;
    const deckId = form.get("deck_id") as string;

    if (!file || !deckId) return NextResponse.json({ error: "Missing file or deck_id" }, { status: 400 });

    const text  = await file.text();
    const cards = parseMd(text);

    if (!cards.length) {
      return NextResponse.json({ error: "No flashcard patterns found in file. Try: **Term**: Definition or ## Heading with text below." }, { status: 400 });
    }

    const svc = createServiceClient();
    const rows = cards.map((c) => ({ deck_id: deckId, user_id: user.id, front: c.front, back: c.back }));
    const { error } = await svc.from("flashcards").insert(rows);

    if (error) return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });

    return NextResponse.json({ success: true, count: cards.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
