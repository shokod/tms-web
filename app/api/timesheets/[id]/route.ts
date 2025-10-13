import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().min(1) });

// Returns weekly data summary and entries for a given timesheet id
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = paramsSchema.parse(await context.params);
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    return Response.json({ error: { code: "unauthorized", message: "Not authenticated" } }, { status: 401 });
  }

  // Load timesheet by id and ensure ownership
  const { data: timesheet, error: tsError } = await supabase
    .from("timesheets")
    .select("id, user_id, week_start, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (tsError || !timesheet) {
    return Response.json({ error: { code: "not_found", message: tsError?.message || "Timesheet not found" } }, { status: 404 });
  }

  // Compute week range [week_start, week_start + 6]
  const weekStart = new Date(timesheet.week_start);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const { data: entries, error: entriesError } = await supabase
    .from("time_entries")
    .select("id, date, hours, activity, status, project, project_id, start_time, end_time, break_minutes")
    .eq("user_id", user.id)
    .gte("date", weekStart.toISOString().split("T")[0])
    .lte("date", weekEnd.toISOString().split("T")[0])
    .order("date", { ascending: true });
  if (entriesError) {
    return Response.json({ error: { code: "db_error", message: entriesError.message } }, { status: 500 });
  }

  const totalHours = (entries || []).reduce((sum, e) => sum + (e.hours || 0), 0);

  return Response.json({
    data: {
      id: timesheet.id,
      weekStart: timesheet.week_start,
      status: timesheet.status,
      totalHours,
      targetHours: 40,
      productivity: 0,
      efficiency: 0,
      entries,
    }
  });
}


