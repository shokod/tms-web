import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  order: z.enum(["asc", "desc"]).default("desc"),
  sort: z.enum(["due_date", "name"]).default("due_date"),
  q: z.string().optional(),
});

const createProjectSchema = z.object({
  name: z.string().min(1),
  client: z.string().min(1),
  budget: z.number().nonnegative().optional(),
  status: z.enum(["on-track", "behind", "at-risk"]).default("on-track"),
  due_date: z.string().optional(),
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

  const { limit, offset, order, sort, q } = parsed.data;
  let query = supabase
    .from("projects")
    .select("*")
    .order(sort, { ascending: order === "asc" })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(`name.ilike.%${q}%,client.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();
  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data }, { status: 201 });
}


