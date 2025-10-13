import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().min(1) });
const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  client: z.string().min(1).optional(),
  budget: z.number().nonnegative().optional(),
  status: z.enum(["on-track", "behind", "at-risk"]).optional(),
  due_date: z.string().optional(),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) {
    return Response.json({ error: { code: "not_found", message: error.message } }, { status: 404 });
  }
  return Response.json({ data });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  if (!userRes.data.user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }
  const json = await request.json().catch(() => null);
  const parsed = updateProjectSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: { code: "bad_request", message: parsed.error.message } }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id)
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
  if (!userRes.data.user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    return Response.json({ error: { code: "db_error", message: error.message } }, { status: 500 });
  }
  return Response.json({ success: true });
}


