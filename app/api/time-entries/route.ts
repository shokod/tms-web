import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { timeEntryCreateSchema } from "@/lib/validators/time-entry";

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  order: z.enum(["asc", "desc"]).default("desc"),
  sort: z.enum(["date", "hours"]).default("date"),
  status: z.enum(["all", "draft", "pending", "approved"]).default("all"),
  q: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = listQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }
  const { limit, offset, order, sort, status, q } = parsed.data;

  let query = supabase
    .from("time_entries")
    .select("*, project:projects(name, client)", { count: "exact" })
    .eq("user_id", user.id)
    .order(sort, { ascending: order === "asc" })
    .range(offset, offset + limit - 1);

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.or(`activity.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data, count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = timeEntryCreateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }
  const input = parsed.data;

  const insertPayload = {
    user_id: user.id,
    invoice: input.invoice,
    contact: input.contact,
    email: input.email,
    date: input.date,
    start_time: input.start_time ?? null,
    end_time: input.end_time ?? null,
    break_minutes: input.break_minutes ?? 0,
    hours: input.hours,
    activity: input.activity,
    description: input.description ?? null,
    project: input.project,
    project_id: input.project_id ?? null,
    status: input.status,
  };

  const { data, error } = await supabase
    .from("time_entries")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data }, { status: 201 });
}


