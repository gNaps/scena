"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { defaultLocale, t } from "@/lib/i18n";
import { submitStudio } from "@/app/actions/submitStudio";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = z.object({
  name: z.string().min(1),
  descriptionIta: z.string().optional(),
  descriptionEng: z.string().optional(),
  email: z.string().email(),
  location: z.string().min(1),
  urlWebsite: z.string().url().or(z.literal("")).optional(),
  urlInstagram: z.string().url().or(z.literal("")).optional(),
  urlLinkedin: z.string().url().or(z.literal("")).optional(),
  urlOther: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
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
      <label className="font-mono text-[12px] tracking-[0.04em] text-text-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted font-mono">{hint}</p>}
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-surface-elevated border border-border rounded-[2px] px-3.5 py-2.5 font-mono text-[13px] text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary mt-8 mb-4">
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StudioForm({
  locale = defaultLocale,
  recaptchaSiteKey = "",
}: {
  locale?: string;
  recaptchaSiteKey?: string;
}) {
  const tr = t(locale);
  const f = tr.studioForm.fields;
  const e = tr.studioForm.errors;
  const s = tr.studioForm.sections;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { urlOther: [] },
  });

  const { fields: urlOtherFields, append: appendUrlOther, remove: removeUrlOther } =
    useFieldArray({ control, name: "urlOther" });

  const handleLogoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitState("loading");
    setSubmitError(null);
    try {
      if (!recaptchaSiteKey) throw new Error("reCAPTCHA site key non configurata.");
      const recaptchaToken: string = await new Promise((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha
            .execute(recaptchaSiteKey, { action: "submit_studio" })
            .then(resolve)
            .catch(reject);
        });
      });

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name: data.name,
          descriptionIta: data.descriptionIta ?? "",
          descriptionEng: data.descriptionEng ?? "",
          email: data.email,
          location: data.location,
          urlWebsite: data.urlWebsite || undefined,
          urlInstagram: data.urlInstagram || undefined,
          urlLinkedin: data.urlLinkedin || undefined,
          urlOther: data.urlOther?.filter((u) => u.label && u.url),
          submitterEmail: data.submitterEmail || undefined,
        })
      );
      if (logoFile) formData.append("logo", logoFile);
      formData.append("recaptchaToken", recaptchaToken);

      await submitStudio(formData);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary fill-none stroke-current stroke-2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-sans text-xl font-bold text-text-strong">{tr.studioForm.successTitle}</h2>
        <p className="text-muted text-sm text-center max-w-sm">{tr.studioForm.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      {/* ---- INFO BASE ---- */}
      <SectionTitle>{s.base}</SectionTitle>

      <Field label={f.submitterEmail} hint={f.submitterEmailHint} error={errors.submitterEmail && e.invalidEmail}>
        <input {...register("submitterEmail")} type="email" placeholder={f.emailPlaceholder} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={f.name} error={errors.name && e.name}>
          <input {...register("name")} placeholder={f.namePlaceholder} className={inputClass} />
        </Field>
        <Field label={f.location} error={errors.location && e.location}>
          <input {...register("location")} placeholder={f.locationPlaceholder} className={inputClass} />
        </Field>
      </div>

      <Field label={f.email} error={errors.email && e.email}>
        <input {...register("email")} type="email" placeholder={f.emailPlaceholder} className={inputClass} />
      </Field>

      {/* ---- DESCRIZIONE ---- */}
      <SectionTitle>{s.description}</SectionTitle>

      <Field label={f.descriptionIta}>
        <textarea
          {...register("descriptionIta")}
          rows={4}
          placeholder={f.descriptionItaPlaceholder}
          className={inputClass}
        />
      </Field>

      <Field label={f.descriptionEng}>
        <textarea
          {...register("descriptionEng")}
          rows={4}
          placeholder={f.descriptionEngPlaceholder}
          className={inputClass}
        />
      </Field>

      {/* ---- LOGO ---- */}
      <SectionTitle>{s.logo}</SectionTitle>

      <Field label={f.logo}>
        <div className="flex items-start gap-4">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} className="w-40 h-28 object-cover rounded-[2px]" />
              <button
                type="button"
                onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface-elevated border border-white/20 flex items-center justify-center hover:bg-red-900/40"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-28 border border-dashed border-white/20 rounded-[2px] cursor-pointer hover:border-primary/50 transition-colors bg-surface-elevated">
              <Upload size={18} className="text-muted mb-1" />
              <span className="text-xs text-muted">{f.uploadLogo}</span>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
          )}
        </div>
      </Field>

      {/* ---- LINK ---- */}
      <SectionTitle>{s.links}</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={f.urlWebsite} error={errors.urlWebsite && e.invalidUrl}>
          <input {...register("urlWebsite")} placeholder="https://..." className={inputClass} />
        </Field>
        <Field label={f.urlInstagram} error={errors.urlInstagram && e.invalidUrl}>
          <input {...register("urlInstagram")} placeholder="https://instagram.com/..." className={inputClass} />
        </Field>
        <Field label={f.urlLinkedin} error={errors.urlLinkedin && e.invalidUrl}>
          <input {...register("urlLinkedin")} placeholder="https://linkedin.com/company/..." className={inputClass} />
        </Field>
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

      {submitState === "error" && submitError && (
        <div className="rounded-[2px] border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full md:w-auto self-end px-8 py-[15px] rounded-[2px] bg-primary text-[#0B0B0F] font-mono font-bold text-[13px] uppercase tracking-[0.06em] hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitState === "loading" ? tr.studioForm.submitting : tr.studioForm.submitButton}
      </button>
    </form>
  );
}
