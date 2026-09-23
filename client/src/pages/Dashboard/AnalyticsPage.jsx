import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { myAnalytics } from "../../api/events";

const pct = (n) => (n == null ? "N/A" : `${Math.round(n * 100)}%`);

// Short label for the x-axis: "2026-09-20" -> "Sep 20"
const shortDate = (isoDay) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    myAnalytics()
      .then(setData)
      .catch((e) => setError(e.response?.data?.error || "Failed to load analytics"));
  }, []);

  if (error) return <p className="ev-error">{error}</p>;
  if (!data) return <p className="ev-status">Loading...</p>;

  const { totals, byDay, byEvent } = data;

  if (totals.events === 0) {
    return (
      <div>
        <h1>Analytics</h1>
        <p className="ev-empty">
          Create an event and get some registrations to see participation trends here.
        </p>
      </div>
    );
  }

  const trend = byDay.map((d) => ({ ...d, label: shortDate(d.date) }));
  // Keep the bar chart readable: top 10 events by registrations.
  const topEvents = byEvent.slice(0, 10).map((e) => ({
    ...e,
    label: e.title.length > 18 ? `${e.title.slice(0, 17)}…` : e.title,
  }));

  return (
    <div>
      <h1>Analytics</h1>

      <div className="ev-stats">
        <div className="ev-stat">
          <span className="ev-stat-value">{totals.events}</span>
          <span className="ev-stat-label">Events</span>
        </div>
        <div className="ev-stat">
          <span className="ev-stat-value">{totals.registrations}</span>
          <span className="ev-stat-label">Total registrations</span>
        </div>
        <div className="ev-stat">
          <span className="ev-stat-value">{pct(totals.avgFillRate)}</span>
          <span className="ev-stat-label">Avg. fill rate</span>
        </div>
      </div>

      <section className="ev-chart-card">
        <h2>Registrations over time</h2>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [value, "Registrations"]}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="registrations" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="ev-note">No registrations yet.</p>
        )}
      </section>

      <section className="ev-chart-card">
        <h2>Attendance by event</h2>
        <ResponsiveContainer width="100%" height={Math.max(220, topEvents.length * 42)}>
          <BarChart data={topEvents} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="var(--line)" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <YAxis type="category" dataKey="label" width={140} tick={{ fill: "var(--ink)", fontSize: 12 }} />
            <Tooltip
              formatter={(value, _name, ctx) => {
                const cap = ctx.payload.capacity;
                return [cap != null ? `${value} of ${cap}` : value, "Registered"];
              }}
              labelFormatter={(_label, ctx) => ctx?.[0]?.payload?.title || ""}
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8 }}
            />
            <Bar dataKey="registrations" fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}