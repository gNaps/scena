"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { defaultLocale, t } from "@/lib/i18n";
import { submitGame } from "@/app/actions/submitGame";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  title: z.string().min(1),
  descriptionIta: z.string().optional(),
  descriptionEng: z.string().optional(),
  status: z.string().min(1),
  studio: z.string().min(1),
  releaseTime: z.string().optional(),
  expectedReleaseTime: z.string().optional(),
  platforms: z.array(z.string()).min(1),
  genres: z.array(z.string()).min(1),
  urlSteam: z.string().url().or(z.literal("")).optional(),
  urlEpicGames: z.string().url().or(z.literal("")).optional(),
  urlPsStore: z.string().url().or(z.literal("")).optional(),
  urlXboxStore: z.string().url().or(z.literal("")).optional(),
  urlNintendoStore: z.string().url().or(z.literal("")).optional(),
  urlItchIo: z.string().url().or(z.literal("")).optional(),
  urlKickstarter: z.string().url().or(z.literal("")).optional(),
  urlOther: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  videos: z.array(z.object({ value: z.string().url() })).optional(),
  voice: z.array(z.string()).optional(),
  screenLanguage: z.array(z.string()).optional(),
  submitterEmail: z.string().email().or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-surface-elevated border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mt-8 mb-4">
      {children}
    </h2>
  );
}

function MultiPillSelect({
  options,
  selected,
  onChange,
  error,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                active
                  ? "bg-primary/20 border-primary/60 text-foreground"
                  : "bg-surface-elevated border-white/10 text-muted hover:border-white/20"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function GameForm({ locale = defaultLocale, recaptchaSiteKey = "" }: { locale?: string; recaptchaSiteKey?: string }) {
  const tr = t(locale);
  const f = tr.gameForm.fields;
  const e = tr.gameForm.errors;
  const s = tr.gameForm.sections;

  const genres = useQuery(api.genres.findAll);
  const statuses = useQuery(api.statuses.findAll);
  const platforms = useQuery(api.platforms.findAll);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platforms: [], genres: [], urlOther: [], videos: [] },
  });

  const { fields: urlOtherFields, append: appendUrlOther, remove: removeUrlOther } =
    useFieldArray({ control, name: "urlOther" });

  const { fields: videoFields, append: appendVideo, remove: removeVideo } =
    useFieldArray({ control, name: "videos" });

  const handleCoverChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleScreenshotsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files ?? []);
    setScreenshotFiles((prev) => [...prev, ...files]);
    setScreenshotPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeScreenshot = (index: number) => {
    setScreenshotFiles((prev) => prev.filter((_, i) => i !== index));
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitState("loading");
    setSubmitError(null);
    try {
      if (!recaptchaSiteKey) throw new Error("reCAPTCHA site key non configurata.");
      const recaptchaToken: string = await new Promise((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha
            .execute(recaptchaSiteKey, { action: "submit_game" })
            .then(resolve)
            .catch(reject);
        });
      });
      // Resolve IDs → labels using already-loaded data
      const statusLabel =
        statuses?.find((st) => st._id === data.status)?.languages.find((l) => l.code === locale)?.name ??
        statuses?.find((st) => st._id === data.status)?.languages.find((l) => l.code === defaultLocale)?.name ??
        data.status;

      const platformLabels = (platforms ?? [])
        .filter((p) => data.platforms.includes(p._id))
        .map((p) => p.key);

      const genreLabels = (genres ?? [])
        .filter((g) => data.genres.includes(g._id))
        .map(
          (g) =>
            g.languages.find((l) => l.code === locale)?.name ??
            g.languages.find((l) => l.code === defaultLocale)?.name ??
            g.key
        );

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          descriptionIta: data.descriptionIta ?? "",
          descriptionEng: data.descriptionEng ?? "",
          status: statusLabel,
          studio: data.studio,
          releaseTime: data.releaseTime ? new Date(data.releaseTime).getTime() : undefined,
          expectedReleaseTime: data.expectedReleaseTime
            ? new Date(data.expectedReleaseTime).getTime()
            : undefined,
          platforms: platformLabels,
          genres: genreLabels,
          urlSteam: data.urlSteam || undefined,
          urlEpicGames: data.urlEpicGames || undefined,
          urlPsStore: data.urlPsStore || undefined,
          urlXboxStore: data.urlXboxStore || undefined,
          urlNintendoStore: data.urlNintendoStore || undefined,
          urlItchIo: data.urlItchIo || undefined,
          urlKickstarter: data.urlKickstarter || undefined,
          urlOther: data.urlOther?.filter((u) => u.label && u.url),
          videos: data.videos?.map((v) => v.value).filter(Boolean),
          voice: data.voice?.filter(Boolean),
          screenLanguage: data.screenLanguage?.filter(Boolean),
          submitterEmail: data.submitterEmail || undefined,
        })
      );
      if (coverFile) formData.append("cover", coverFile);
      screenshotFiles.forEach((f) => formData.append("screenshots", f));
      formData.append("recaptchaToken", recaptchaToken);

      await submitGame(formData);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (!genres || !statuses || !platforms) {
    return (
      <div className="flex items-center justify-center py-20 text-muted text-sm">
        {tr.gameForm.loading}
      </div>
    );
  }

  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary fill-none stroke-current stroke-2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">{tr.gameForm.successTitle}</h2>
        <p className="text-muted text-sm text-center max-w-sm">{tr.gameForm.successMessage}</p>
      </div>
    );
  }

  const genreOptions = genres.map((g) => ({
    id: g._id,
    label:
      g.languages.find((l) => l.code === locale)?.name ??
      g.languages.find((l) => l.code === defaultLocale)?.name ??
      g.key,
  }));

  const platformOptions = platforms.map((p) => ({ id: p._id, label: p.key }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* ---- INFO BASE ---- */}
      <SectionTitle>{s.base}</SectionTitle>

      <Field label={f.submitterEmail} error={errors.submitterEmail && e.invalidEmail} hint={f.submitterEmailHint}>
        <input {...register("submitterEmail")} type="email" placeholder="studio@example.com" className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={f.title} error={errors.title && e.title}>
          <input {...register("title")} placeholder={f.titlePlaceholder} className={inputClass} />
        </Field>
        <Field label={f.studio} error={errors.studio && e.studio}>
          <input {...register("studio")} placeholder={f.studioPlaceholder} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={f.status} error={errors.status && e.status}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <select {...field} className={inputClass}>
                <option value="">{f.statusPlaceholder}</option>
                {statuses.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.languages.find((l) => l.code === locale)?.name ??
                      st.languages.find((l) => l.code === defaultLocale)?.name ??
                      st.key}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={f.releaseTime}>
            <input type="date" {...register("releaseTime")} className={inputClass} />
          </Field>
          <Field label={f.expectedReleaseTime}>
            <input type="date" {...register("expectedReleaseTime")} className={inputClass} />
          </Field>
        </div>
      </div>

      {/* ---- DESCRIZIONE ---- */}
      <SectionTitle>{s.description}</SectionTitle>

      <Field label={f.descriptionIta}>
        <textarea {...register("descriptionIta")} rows={4} placeholder={f.descriptionItaPlaceholder} className={inputClass} />
      </Field>
      <Field label={f.descriptionEng}>
        <textarea {...register("descriptionEng")} rows={4} placeholder={f.descriptionEngPlaceholder} className={inputClass} />
      </Field>

      {/* ---- PIATTAFORME & GENERI ---- */}
      <SectionTitle>{s.platformsGenres}</SectionTitle>

      <Field label={f.platforms} error={errors.platforms && e.platforms}>
        <Controller
          control={control}
          name="platforms"
          render={({ field }) => (
            <MultiPillSelect options={platformOptions} selected={field.value} onChange={field.onChange} error={errors.platforms && e.platforms} />
          )}
        />
      </Field>

      <Field label={f.genres} error={errors.genres && e.genres}>
        <Controller
          control={control}
          name="genres"
          render={({ field }) => (
            <MultiPillSelect options={genreOptions} selected={field.value} onChange={field.onChange} error={errors.genres && e.genres} />
          )}
        />
      </Field>

      {/* ---- IMMAGINI ---- */}
      <SectionTitle>{s.images}</SectionTitle>

      <Field label={f.cover}>
        <div className="flex items-start gap-4">
          {coverPreview ? (
            <div className="relative">
              <img src={coverPreview} className="w-40 h-28 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface-elevated border border-white/20 flex items-center justify-center hover:bg-red-900/40"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-28 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-surface-elevated">
              <Upload size={18} className="text-muted mb-1" />
              <span className="text-xs text-muted">{f.uploadCover}</span>
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          )}
        </div>
      </Field>

      <Field label={f.screenshots}>
        <div className="flex flex-wrap gap-3">
          {screenshotPreviews.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} className="w-36 h-24 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => removeScreenshot(i)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface-elevated border border-white/20 flex items-center justify-center hover:bg-red-900/40"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center w-36 h-24 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-surface-elevated">
            <Upload size={16} className="text-muted mb-1" />
            <span className="text-xs text-muted">{f.addScreenshot}</span>
            <input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="hidden" />
          </label>
        </div>
      </Field>

      {/* ---- LINK STORE ---- */}
      <SectionTitle>{s.storeLinks}</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(
          [
            { name: "urlSteam", label: "Steam" },
            { name: "urlEpicGames", label: "Epic Games" },
            { name: "urlPsStore", label: "PlayStation Store" },
            { name: "urlXboxStore", label: "Xbox Store" },
            { name: "urlNintendoStore", label: "Nintendo Store" },
            { name: "urlItchIo", label: "Itch.io" },
            { name: "urlKickstarter", label: "Kickstarter" },
          ] as const
        ).map(({ name, label }) => (
          <Field key={name} label={label} error={errors[name] && e.invalidUrl}>
            <input {...register(name)} placeholder="https://..." className={inputClass} />
          </Field>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/80">{f.otherLinks}</span>
          <button
            type="button"
            onClick={() => appendUrlOther({ label: "", url: "" })}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} /> {f.addLink}
          </button>
        </div>
        {urlOtherFields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-start">
            <Field label={f.linkLabel} error={errors.urlOther?.[i]?.label?.message}>
              <input {...register(`urlOther.${i}.label`)} placeholder={f.linkLabelPlaceholder} className={inputClass} />
            </Field>
            <Field label={f.linkUrl} error={errors.urlOther?.[i]?.url && e.invalidUrl}>
              <input {...register(`urlOther.${i}.url`)} placeholder="https://..." className={inputClass} />
            </Field>
            <button
              type="button"
              onClick={() => removeUrlOther(i)}
              className="mt-7 p-2 rounded-lg hover:bg-red-900/30 text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* ---- MEDIA & LINGUE ---- */}
      <SectionTitle>{s.media}</SectionTitle>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/80">{f.videos}</span>
          <button
            type="button"
            onClick={() => appendVideo({ value: "" })}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} /> {f.addVideo}
          </button>
        </div>
        {videoFields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                {...register(`videos.${i}.value`)}
                placeholder={f.videoPlaceholder}
                className={inputClass}
              />
              {errors.videos?.[i]?.value && (
                <p className="text-xs text-red-400 mt-1">{e.invalidUrl}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeVideo(i)}
              className="p-2 rounded-lg hover:bg-red-900/30 text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Field label={f.voice} hint={f.voiceHint}>
        <Controller
          control={control}
          name="voice"
          render={({ field }) => (
            <input
              value={field.value?.join(", ") ?? ""}
              onChange={(ev) => field.onChange(ev.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder={f.langPlaceholder}
              className={inputClass}
            />
          )}
        />
      </Field>

      <Field label={f.screenLanguage} hint={f.screenLanguageHint}>
        <Controller
          control={control}
          name="screenLanguage"
          render={({ field }) => (
            <input
              value={field.value?.join(", ") ?? ""}
              onChange={(ev) => field.onChange(ev.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder={f.langPlaceholder}
              className={inputClass}
            />
          )}
        />
      </Field>

      {submitState === "error" && submitError && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full md:w-auto self-end px-8 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitState === "loading" ? tr.gameForm.submitting : tr.gameForm.submitButton}
      </button>
    </form>
  );
}
