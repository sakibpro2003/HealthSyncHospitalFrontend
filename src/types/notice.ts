export type TNoticePriority = "low" | "medium" | "high";

export type TNoticeAudience = "all" | "patients" | "staff" | "visitors";

export type TNotice = {
  id: string;
  title: string;
  summary: string;
  body: string;
  priority: TNoticePriority;
  audience: TNoticeAudience;
  publishedAt: string;
  author?: string;
};
