"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchAction, fetchMutation } from "convex/nextjs";

async function verifyRecaptcha(token: string): Promise<void> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY not configured");

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await res.json()) as {
    success: boolean;
    score: number;
    action: string;
  };

  if (!data.success || data.score < 0.5) {
    throw new Error("Verifica anti-bot fallita. Riprova.");
  }
}

async function uploadFileToConvex(file: File): Promise<Id<"_storage">> {
  const uploadUrl = await fetchMutation(api.studios.generateUploadUrl, {});
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const { storageId } = await res.json();
  return storageId as Id<"_storage">;
}

export type SubmitStudioPayload = {
  name: string;
  descriptionIta: string;
  descriptionEng: string;
  email: string;
  location: string;
  urlWebsite?: string;
  urlInstagram?: string;
  urlLinkedin?: string;
  urlOther?: { label: string; url: string }[];
  submitterEmail?: string;
};

export async function submitStudio(formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  if (!recaptchaToken) throw new Error("Token reCAPTCHA mancante.");
  await verifyRecaptcha(recaptchaToken);

  const payload = JSON.parse(
    formData.get("data") as string,
  ) as SubmitStudioPayload;
  const logoFile = formData.get("logo") as File | null;

  const logoStorageId =
    logoFile && logoFile.size > 0
      ? await uploadFileToConvex(logoFile)
      : undefined;

  await fetchAction(api.emails.sendStudioSubmission, {
    name: payload.name,
    description: [
      { code: "ita", value: payload.descriptionIta },
      { code: "eng", value: payload.descriptionEng },
    ],
    email: payload.email,
    location: payload.location,
    urlWebsite: payload.urlWebsite,
    urlInstagram: payload.urlInstagram,
    urlLinkedin: payload.urlLinkedin,
    urlOther: payload.urlOther,
    logoStorageId,
    submitterEmail: payload.submitterEmail,
  });
}
