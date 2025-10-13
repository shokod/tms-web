import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const listQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  if (!userRes.data.user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = listQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }
  const { q, limit, offset } = parsed.data;

  let query = supabase.from("profiles").select("id, full_name, avatar, role, email").order("full_name").range(offset, offset + limit - 1);
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data });
}


