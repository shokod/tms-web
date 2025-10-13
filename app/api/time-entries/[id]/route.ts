import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { timeEntryUpdateSchema } from "@/lib/validators/time-entry";

const paramsSchema = z.object({ id: z.string().min(1) });

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("time_entries")
    .select("*, project:projects(name, client)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return Response.json({ error: { code: "not_found", message: error.message } }, { status: 404 });
  }
  return Response.json({ data });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = timeEntryUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }
  const input = parsed.data;

  const { data, error } = await supabase
    .from("time_entries")
    .update({ ...input })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ data });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ success: true });
}


