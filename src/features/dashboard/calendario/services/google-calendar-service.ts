"use client";

import { api } from "@/shared/configs/api";

export type GoogleCalendarStatus = {
  connected: boolean;
  email?: string | null;
  calendar_id?: string | null;
  expires_at?: string | null;
};

export type GoogleCalendarListItem = {
  id: string;
  summary: string;
  primary: boolean;
  accessRole?: string | null;
};

export type GoogleCalendarEvent = {
  id: string;
  summary: string;
  description?: string | null;
  location?: string | null;
  htmlLink?: string | null;
  start?: string | null;
  end?: string | null;
  status?: string | null;
};

export const googleCalendarService = {
  async getStatus(): Promise<GoogleCalendarStatus> {
    const response = await api.get("google-calendar/status").json<{ data: GoogleCalendarStatus }>();
    return response.data;
  },

  async getAuthUrl(): Promise<string> {
    const response = await api.get("google-calendar/auth-url").json<{ data: { url: string } }>();
    return response.data.url;
  },

  async disconnect(): Promise<void> {
    await api.post("google-calendar/disconnect").json();
  },

  async listCalendars(): Promise<GoogleCalendarListItem[]> {
    const response = await api.get("google-calendar/calendars").json<{ data: GoogleCalendarListItem[] }>();
    return Array.isArray(response.data) ? response.data : [];
  },

  async listEvents(params: { calendarId: string; timeMin: string; timeMax: string }): Promise<GoogleCalendarEvent[]> {
    const response = await api
      .get("google-calendar/events", {
        searchParams: {
          calendar_id: params.calendarId,
          time_min: params.timeMin,
          time_max: params.timeMax,
        },
      })
      .json<{ data: GoogleCalendarEvent[] }>();

    return Array.isArray(response.data) ? response.data : [];
  },

  async setDefaultCalendar(calendarId: string): Promise<void> {
    await api.post("google-calendar/default-calendar", { json: { calendar_id: calendarId } }).json();
  },
};

