import { TimeFormat } from "@calcom/lib/timeFormat";
import { WorkflowActions } from "@calcom/prisma/enums";
import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";

import emailReminderTemplate from "./emailReminderTemplate";

const tMock = (key: string): string => {
  const mocks: Record<string, string> = {
    reminder: "Reminder",
    hi: "Hi",
    email_reminder_upcoming_event_notice: "This is a reminder about your upcoming event.",
    event_upper_case: "Event",
    date_and_time: "Date & Time",
    attendees: "Attendees",
    you_and_conjunction: "You &",
    location: "Location",
    scheduling_by: "Scheduling by",
  };
  return mocks[key] || key;
};

describe("emailReminderTemplate", () => {
  it("does not render 'undefined' when meetingUrl is missing", () => {
    const { emailBody } = emailReminderTemplate({
      isEditingMode: false,
      locale: "en",
      t: tMock as unknown as TFunction,
      action: WorkflowActions.EMAIL_ATTENDEE,
      timeFormat: TimeFormat.TWELVE_HOUR,
      startTime: "2026-04-01T10:00:00.000Z",
      endTime: "2026-04-01T10:30:00.000Z",
      eventName: "Demo Event",
      timeZone: "UTC",
      location: "Berlin",
      meetingUrl: undefined,
      otherPerson: "Organizer",
      name: "Attendee",
      isBrandingDisabled: true,
    });

    expect(emailBody).toContain("Berlin");
    expect(emailBody).not.toContain("undefined");
  });

  it("omits location section when both location and meetingUrl are empty", () => {
    const { emailBody } = emailReminderTemplate({
      isEditingMode: false,
      locale: "en",
      t: tMock as unknown as TFunction,
      action: WorkflowActions.EMAIL_ATTENDEE,
      timeFormat: TimeFormat.TWELVE_HOUR,
      startTime: "2026-04-01T10:00:00.000Z",
      endTime: "2026-04-01T10:30:00.000Z",
      eventName: "Demo Event",
      timeZone: "UTC",
      location: "",
      meetingUrl: "",
      otherPerson: "Organizer",
      name: "Attendee",
      isBrandingDisabled: true,
    });

    expect(emailBody).not.toContain("Location");
  });

  it("renders both location and meetingUrl when both are present", () => {
    const { emailBody } = emailReminderTemplate({
      isEditingMode: false,
      locale: "en",
      t: tMock as unknown as TFunction,
      action: WorkflowActions.EMAIL_ATTENDEE,
      timeFormat: TimeFormat.TWELVE_HOUR,
      startTime: "2026-04-01T10:00:00.000Z",
      endTime: "2026-04-01T10:30:00.000Z",
      eventName: "Demo Event",
      timeZone: "UTC",
      location: "Berlin",
      meetingUrl: "https://meet.example.com/abc",
      otherPerson: "Organizer",
      name: "Attendee",
      isBrandingDisabled: true,
    });

    expect(emailBody).toContain("Berlin");
    expect(emailBody).toContain("https://meet.example.com/abc");
    expect(emailBody).toContain("Location");
  });

  it("still renders location placeholders in editing mode", () => {
    const { emailBody } = emailReminderTemplate({
      isEditingMode: true,
      locale: "en",
      t: tMock as unknown as TFunction,
      action: WorkflowActions.EMAIL_ATTENDEE,
      isBrandingDisabled: true,
    });

    expect(emailBody).toContain("{LOCATION} {MEETING_URL}");
  });
});
