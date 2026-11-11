export interface AnalyticsTotals{
    events: number;
    registrations: number;
    avgFillRate: number | null;  // b/w 0 and 1
}

export interface DailyAnalytics{
    date: string; // YYYY-MM-DD, UTC
    registrations: number;
}

export interface EventAnalytics{
    eventId: string;
    title: string;
    registrations: number;
    capacity: number | null;
}

export interface MyAnalyticsResponse{
    totals: AnalyticsTotals;
    byDay: DailyAnalytics[];
    byEvent: EventAnalytics[];
}