import { TNotice, TNoticeAudience, TNoticePriority } from "@/types/notice";

const STORAGE_KEY = "healthsync-notice-board";

const DEFAULT_NOTICES: TNotice[] = [
  {
    id: "notice-wellness-week",
    title: "Wellness Week screenings",
    summary: "Free blood pressure, glucose, and BMI screenings available for all visitors from 10–14 February.",
    body: "Our preventive care specialists will be hosting complimentary screenings in the atrium between 9:00 AM and 4:00 PM daily. No appointment needed—simply bring a valid ID and arrive 10 minutes early to complete a short health questionnaire.",
    priority: "medium",
    audience: "visitors",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    author: "Community Outreach",
  },
  {
    id: "notice-icu-upgrade",
    title: "ICU upgrade works overnight",
    summary: "Essential maintenance will take place on the ICU monitoring system from 12:00 AM – 3:00 AM this Friday.",
    body: "Access to the ICU will remain uninterrupted; however, please coordinate with the on-call intensivist for escorted entry during the maintenance window. All alerts are being mirrored to the backup command centre.",
    priority: "high",
    audience: "staff",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    author: "Clinical Operations",
  },
  {
    id: "notice-portal-update",
    title: "Patient portal release 4.2",
    summary: "New telehealth booking flow now live with instant payment confirmation and prescription tracking.",
    body: "Patients can now view their medication history, reorder prescriptions, and receive SMS reminders within the portal. Reception teams have been briefed—reach out if you need refresher material for your department.",
    priority: "low",
    audience: "patients",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    author: "Digital Care Team",
  },
];

const withWindow = <T,>(fn: () => T, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    return fn();
  } catch (error) {
    console.error("Notice storage error", error);
    return fallback;
  }
};

const saveNotices = (notices: TNotice[]) => {
  withWindow(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  }, undefined);
};

export const getNotices = (): TNotice[] =>
  withWindow(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveNotices(DEFAULT_NOTICES);
      return DEFAULT_NOTICES;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      saveNotices(DEFAULT_NOTICES);
      return DEFAULT_NOTICES;
    }
    return parsed as TNotice[];
  }, DEFAULT_NOTICES);

export type NoticeDraft = {
  title: string;
  summary: string;
  body: string;
  priority: TNoticePriority;
  audience: TNoticeAudience;
  author?: string;
};

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `notice-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export const addNotice = (draft: NoticeDraft): TNotice[] => {
  const notices = getNotices();
  const newNotice: TNotice = {
    id: createId(),
    publishedAt: new Date().toISOString(),
    ...draft,
  };
  const updated = [newNotice, ...notices];
  saveNotices(updated);
  return updated;
};

export const updateNotice = (id: string, patch: Partial<NoticeDraft>): TNotice[] => {
  const notices = getNotices();
  const updated = notices.map((notice) =>
    notice.id === id ? { ...notice, ...patch } : notice,
  );
  saveNotices(updated);
  return updated;
};

export const deleteNotice = (id: string): TNotice[] => {
  const notices = getNotices().filter((notice) => notice.id !== id);
  saveNotices(notices);
  return notices;
};
