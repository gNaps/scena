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
  const uploadUrl = await fetchMutation(api.games.generateUploadUrl, {});
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const { storageId } = await res.json();
  return storageId as Id<"_storage">;
}

export type SubmitGamePayload = {
  title: string;
  descriptionIta: string;
  descriptionEng: string;
  status: string;
  studio: string;
  releaseTime?: number;
  expectedReleaseTime?: number;
  platforms: string[];
  genres: string[];
  urlSteam?: string;
  urlEpicGames?: string;
  urlPsStore?: string;
  urlXboxStore?: string;
  urlNintendoStore?: string;
  urlItchIo?: string;
  urlKickstarter?: string;
  urlOther?: { label: string; url: string }[];
  videos?: string[];
  voice?: string[];
  screenLanguage?: string[];
  submitterEmail?: string;
};

export async function submitGame(formData: FormData) {
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  if (!recaptchaToken) throw new Error("Token reCAPTCHA mancante.");
  await verifyRecaptcha(recaptchaToken);

  const payload = JSON.parse(
    formData.get("data") as string,
  ) as SubmitGamePayload;
  const coverFile = formData.get("cover") as File | null;
  const screenshotFiles = formData.getAll("screenshots") as File[];

  const [coverStorageId, ...screenshotStorageIds] = await Promise.all([
    coverFile && coverFile.size > 0
      ? uploadFileToConvex(coverFile)
      : Promise.resolve(undefined),
    ...screenshotFiles.filter((f) => f.size > 0).map(uploadFileToConvex),
  ]);

  await fetchAction(api.emails.sendGameSubmission, {
    title: payload.title,
    description: [
      { code: "ita", value: payload.descriptionIta },
      { code: "eng", value: payload.descriptionEng },
    ],
    status: payload.status,
    studio: payload.studio,
    releaseTime: payload.releaseTime,
    expectedReleaseTime: payload.expectedReleaseTime,
    platforms: payload.platforms,
    genres: payload.genres,
    urlSteam: payload.urlSteam,
    urlEpicGames: payload.urlEpicGames,
    urlPsStore: payload.urlPsStore,
    urlXboxStore: payload.urlXboxStore,
    urlNintendoStore: payload.urlNintendoStore,
    urlItchIo: payload.urlItchIo,
    urlKickstarter: payload.urlKickstarter,
    urlOther: payload.urlOther,
    coverStorageId: coverStorageId ?? undefined,
    screenshotStorageIds: screenshotStorageIds.length
      ? (screenshotStorageIds as Id<"_storage">[])
      : undefined,
    videos: payload.videos,
    voice: payload.voice,
    screenLanguage: payload.screenLanguage,
    submitterEmail: payload.submitterEmail,
  });
}
