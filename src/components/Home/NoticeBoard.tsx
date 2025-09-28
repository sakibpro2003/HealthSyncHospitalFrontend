"use client";

import { useEffect, useMemo, useState } from "react";
import { addNotice, deleteNotice, getNotices, updateNotice } from "@/utils/notice";
import { TNotice, TNoticeAudience, TNoticePriority } from "@/types/notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CalendarDays,
  Megaphone,
  Pencil,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  Users2,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

type NoticeFormState = {
  title: string;
  summary: string;
  body: string;
  priority: TNoticePriority;
  audience: TNoticeAudience;
};

const defaultForm: NoticeFormState = {
  title: "",
  summary: "",
  body: "",
  priority: "medium",
  audience: "all",
};

const NoticeBoard = () => {
  const [notices, setNotices] = useState<TNotice[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<TNotice | null>(null);
  const [form, setForm] = useState<NoticeFormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ role?: string; name?: string } | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setNotices(getNotices());
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) return;
        const payload = await response.json();
        setUser(payload?.user ?? null);
      } catch (error) {
        console.error("Unable to fetch current user", error);
      }
    };

    fetchUser();
  }, []);

  const sortedNotices = useMemo(() => {
    return [...notices].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [notices]);

  const priorityStyles: Record<TNoticePriority, string> = {
    high: "bg-rose-100 text-rose-600",
    medium: "bg-amber-100 text-amber-600",
    low: "bg-emerald-100 text-emerald-600",
  };

  const audienceLabels: Record<TNoticeAudience, string> = {
    all: "All visitors",
    patients: "Patients & families",
    staff: "Clinical & admin staff",
    visitors: "Guests & attendants",
  };

  const openEditor = (notice?: TNotice) => {
    if (notice) {
      setEditingNotice(notice);
      setForm({
        title: notice.title,
        summary: notice.summary,
        body: notice.body,
        priority: notice.priority,
        audience: notice.audience,
      });
    } else {
      setEditingNotice(null);
      setForm(defaultForm);
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingNotice(null);
    setForm(defaultForm);
  };

  const handleChange = <Field extends keyof NoticeFormState>(field: Field, value: NoticeFormState[Field]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.body.trim()) {
      toast.error("Please fill in the title, summary, and details.");
      return;
    }

    setIsSubmitting(true);
    try {
      let updated: TNotice[];
      if (editingNotice) {
        updated = updateNotice(editingNotice.id, {
          ...form,
          author: editingNotice.author ?? user?.name,
        });
        toast.success("Notice updated successfully");
      } else {
        updated = addNotice({
          ...form,
          author: user?.name ?? "HealthSync Admin",
        });
        toast.success("Notice published");
      }
      setNotices(updated);
      closeEditor();
    } catch (error) {
      console.error("Failed to update notice board", error);
      toast.error("Unable to save notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Remove this notice?")) {
      return;
    }
    try {
      const updated = deleteNotice(id);
      setNotices(updated);
      toast.success("Notice removed");
    } catch (error) {
      console.error("Failed to delete notice", error);
      toast.error("Unable to delete notice. Please try again.");
    }
  };

  return (
    <section className="relative isolate mx-auto mt-20 w-11/12 max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/95 via-white/80 to-violet-50/80 px-6 py-16 shadow-[0_35px_80px_-40px_rgba(30,41,59,0.55)] backdrop-blur md:px-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-200 via-violet-100 to-white" aria-hidden />
      <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col gap-8">
        <header className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700">
              <Megaphone className="size-4" />
              Notice Board
            </span>
            <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Real-time updates for our community
            </h2>
            <p className="max-w-2xl text-base text-slate-600">
              Stay informed about operational changes, community programmes, and critical announcements from the HealthSync team.
            </p>
          </div>
          {isAdmin ? (
            <Button
              onClick={() => openEditor()}
              className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              <Plus className="mr-2 size-4" /> Publish notice
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2 text-sm text-slate-500 md:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow">
                <Users2 className="size-4 text-violet-500" />
                <span>Managed by HealthSync admins</span>
              </div>
            </div>
          )}
        </header>

        {sortedNotices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-violet-200 bg-white/70 p-10 text-center text-slate-500">
            No notices yet. Check back soon for updates.
          </div>
        ) : (
          <ul className="grid gap-5">
            {sortedNotices.map((notice) => (
              <li
                key={notice.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl md:p-8"
              >
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-violet-200/40 blur-2xl" aria-hidden />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={priorityStyles[notice.priority]}>Priority: {notice.priority}</Badge>
                    <Badge variant="outline" className="border-violet-200 bg-white/60 text-violet-600">
                      {audienceLabels[notice.audience]}
                    </Badge>
                    {notice.author && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                        <Sparkles className="size-3 text-violet-500" /> {notice.author}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900">{notice.title}</h3>
                  <p className="text-base text-slate-600">{notice.summary}</p>

                  <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm text-slate-600">
                    {notice.body}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="size-4 text-violet-500" />
                      <span>
                        Posted {formatDistanceToNow(new Date(notice.publishedAt), { addSuffix: true })}
                        {" · "}
                        {format(new Date(notice.publishedAt), "dd MMM yyyy, h:mm a")}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                          onClick={() => openEditor(notice)}
                        >
                          <Pencil className="mr-2 size-4" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-400/30 backdrop-blur">
          <div className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl">
            <div className="absolute -left-16 top-0 h-36 w-36 rounded-full bg-violet-200/60 blur-3xl" aria-hidden />
            <div className="absolute -right-20 bottom-0 h-44 w-44 rounded-full bg-sky-200/60 blur-3xl" aria-hidden />

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5 p-8 md:p-10">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
                    <Megaphone className="size-3.5" />
                    {editingNotice ? "Update notice" : "Publish notice"}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    {editingNotice ? "Edit announcement" : "New announcement"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Share timely updates with staff, patients, and visitors. Highlight critical notices by marking them as high priority.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-10 rounded-full text-slate-500 hover:bg-slate-100"
                  onClick={closeEditor}
                >
                  <X className="size-5" />
                </Button>
              </header>

              <Input
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Notice headline"
                className="h-12 rounded-xl border-slate-200 bg-white/90 text-base focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                required
              />

              <Input
                value={form.summary}
                onChange={(event) => handleChange("summary", event.target.value)}
                placeholder="Short summary"
                className="h-12 rounded-xl border-slate-200 bg-white/90 text-base focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                required
              />

              <Textarea
                value={form.body}
                onChange={(event) => handleChange("body", event.target.value)}
                placeholder="Detailed information"
                className="min-h-[160px] rounded-xl border-slate-200 bg-white/90 text-base focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600" htmlFor="notice-priority">
                    Priority level
                  </label>
                  <Select
                    value={form.priority}
                    onValueChange={(value: TNoticePriority) => handleChange("priority", value)}
                  >
                    <SelectTrigger id="notice-priority" className="h-12 rounded-xl border-slate-200 bg-white/90 text-left text-base focus:border-violet-400 focus:ring-2 focus:ring-violet-200">
                      <SelectValue placeholder="Choose priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-violet-100 bg-white/95">
                      <SelectItem value="high" className="text-rose-600">
                        High – requires immediate attention
                      </SelectItem>
                      <SelectItem value="medium" className="text-amber-600">
                        Medium – upcoming change/event
                      </SelectItem>
                      <SelectItem value="low" className="text-emerald-600">
                        Low – informational update
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600" htmlFor="notice-audience">
                    Primary audience
                  </label>
                  <Select
                    value={form.audience}
                    onValueChange={(value: TNoticeAudience) => handleChange("audience", value)}
                  >
                    <SelectTrigger id="notice-audience" className="h-12 rounded-xl border-slate-200 bg-white/90 text-left text-base focus:border-violet-400 focus:ring-2 focus:ring-violet-200">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-violet-100 bg-white/95">
                      <SelectItem value="all">All visitors</SelectItem>
                      <SelectItem value="patients">Patients & families</SelectItem>
                      <SelectItem value="staff">Staff & clinicians</SelectItem>
                      <SelectItem value="visitors">Guests & attendants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <ShieldAlert className="size-4 text-violet-500" />
                  {editingNotice ? "Updating existing notice" : "New notice will appear at the top"}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-slate-200 px-6 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                    onClick={closeEditor}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingNotice ? "Save changes" : "Publish notice"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default NoticeBoard;
