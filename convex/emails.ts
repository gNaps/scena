import { v } from "convex/values";
import { action } from "./_generated/server";

export const sendGameSubmission = action({
  args: {
    title: v.string(),
    description: v.array(v.object({ code: v.string(), value: v.string() })),
    status: v.string(),
    releaseTime: v.optional(v.number()),
    expectedReleaseTime: v.optional(v.number()),
    studio: v.string(),
    platforms: v.array(v.string()),
    genres: v.array(v.string()),
    urlSteam: v.optional(v.string()),
    urlEpicGames: v.optional(v.string()),
    urlPsStore: v.optional(v.string()),
    urlXboxStore: v.optional(v.string()),
    urlNintendoStore: v.optional(v.string()),
    urlItchIo: v.optional(v.string()),
    urlKickstarter: v.optional(v.string()),
    urlOther: v.optional(
      v.array(v.object({ label: v.string(), url: v.string() })),
    ),
    coverStorageId: v.optional(v.id("_storage")),
    screenshotStorageIds: v.optional(v.array(v.id("_storage"))),
    videos: v.optional(v.array(v.string())),
    voice: v.optional(v.array(v.string())),
    screenLanguage: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    submitterEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey) throw new Error("RESEND_API_KEY not configured");

    // Resolve storage URLs
    const coverUrl = args.coverStorageId
      ? await ctx.storage.getUrl(args.coverStorageId)
      : null;
    const screenshotUrls = args.screenshotStorageIds
      ? await Promise.all(
          args.screenshotStorageIds.map((id) => ctx.storage.getUrl(id)),
        )
      : [];

    const formatDate = (ts?: number) =>
      ts ? new Date(ts).toLocaleDateString("it-IT") : "—";

    const descriptionRows = args.description
      .map(
        (d) =>
          `<tr><td style="padding:4px 8px;font-weight:600;text-transform:uppercase;color:#8b5cf6">${d.code}</td><td style="padding:4px 8px">${d.value || "—"}</td></tr>`,
      )
      .join("");

    const storeLinks = [
      { label: "Steam", url: args.urlSteam },
      { label: "Epic Games", url: args.urlEpicGames },
      { label: "PS Store", url: args.urlPsStore },
      { label: "Xbox Store", url: args.urlXboxStore },
      { label: "Nintendo Store", url: args.urlNintendoStore },
      { label: "Itch.io", url: args.urlItchIo },
      { label: "Kickstarter", url: args.urlKickstarter },
    ]
      .filter((l) => l.url)
      .map(
        (l) =>
          `<a href="${l.url}" style="color:#8b5cf6;margin-right:12px">${l.label}</a>`,
      )
      .join("");

    const otherLinks = (args.urlOther ?? [])
      .map(
        (l) =>
          `<a href="${l.url}" style="color:#8b5cf6;margin-right:12px">${l.label}</a>`,
      )
      .join("");

    const screenshotImgs = screenshotUrls
      .filter(Boolean)
      .map(
        (url) =>
          `<img src="${url}" style="max-width:240px;border-radius:6px;margin:4px" />`,
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#07070f;color:#ede9fe;padding:32px;max-width:700px;margin:0 auto">
  <h1 style="color:#8b5cf6;margin-bottom:4px">Nuova submission gioco</h1>
  <p style="color:#6b7280;margin-top:0">Inviata tramite il form di Scena</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr><td style="padding:8px;color:#6b7280;width:160px">Titolo</td><td style="padding:8px;font-weight:700;font-size:18px">${args.title}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Studio</td><td style="padding:8px">${args.studio}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Stato</td><td style="padding:8px">${args.status}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Piattaforme</td><td style="padding:8px">${args.platforms.join(", ") || "—"}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Generi</td><td style="padding:8px">${args.genres.join(", ") || "—"}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Data uscita</td><td style="padding:8px">${formatDate(args.releaseTime)}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Uscita prevista</td><td style="padding:8px">${formatDate(args.expectedReleaseTime)}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Slug</td><td style="padding:8px">${args.slug || "—"}</td></tr>
    ${args.submitterEmail ? `<tr><td style="padding:8px;color:#6b7280">Email mittente</td><td style="padding:8px">${args.submitterEmail}</td></tr>` : ""}
  </table>

  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Descrizione</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${descriptionRows}</table>

  ${
    storeLinks || otherLinks
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Link store</h2>
  <p style="margin-bottom:24px">${storeLinks}${otherLinks}</p>
  `
      : ""
  }

  ${
    args.videos?.length
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Video</h2>
  <ul style="margin-bottom:24px">${args.videos.map((v) => `<li><a href="${v}" style="color:#8b5cf6">${v}</a></li>`).join("")}</ul>
  `
      : ""
  }

  ${
    args.voice?.length
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Doppiaggio</h2>
  <p style="margin-bottom:24px">${args.voice.join(", ")}</p>
  `
      : ""
  }

  ${
    args.screenLanguage?.length
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Lingue schermo</h2>
  <p style="margin-bottom:24px">${args.screenLanguage.join(", ")}</p>
  `
      : ""
  }

  ${
    coverUrl
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Cover</h2>
  <img src="${coverUrl}" style="max-width:300px;border-radius:8px;margin-bottom:24px" />
  `
      : ""
  }

  ${
    screenshotImgs
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Screenshot</h2>
  <div style="margin-bottom:24px">${screenshotImgs}</div>
  `
      : ""
  }

  <p style="color:#6b7280;font-size:12px;margin-top:32px">Scena — ${new Date().toLocaleString("it-IT")}</p>
</body>
</html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Scena <${fromEmail}>`,
        to: [toEmail],
        subject: `[Scena] Nuova submission: ${args.title}`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sender API error ${response.status}: ${body}`);
    }

    return { success: true };
  },
});

export const sendStudioSubmission = action({
  args: {
    name: v.string(),
    description: v.array(v.object({ code: v.string(), value: v.string() })),
    email: v.string(),
    location: v.string(),
    urlWebsite: v.optional(v.string()),
    urlInstagram: v.optional(v.string()),
    urlLinkedin: v.optional(v.string()),
    urlOther: v.optional(
      v.array(v.object({ label: v.string(), url: v.string() })),
    ),
    logoStorageId: v.optional(v.id("_storage")),
    submitterEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey) throw new Error("RESEND_API_KEY not configured");

    const logoUrl = args.logoStorageId
      ? await ctx.storage.getUrl(args.logoStorageId)
      : null;

    const socialLinks = [
      { label: "Sito web", url: args.urlWebsite },
      { label: "Instagram", url: args.urlInstagram },
      { label: "LinkedIn", url: args.urlLinkedin },
    ]
      .filter((l) => l.url)
      .map(
        (l) =>
          `<a href="${l.url}" style="color:#8b5cf6;margin-right:12px">${l.label}</a>`,
      )
      .join("");

    const otherLinks = (args.urlOther ?? [])
      .map(
        (l) =>
          `<a href="${l.url}" style="color:#8b5cf6;margin-right:12px">${l.label}</a>`,
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#07070f;color:#ede9fe;padding:32px;max-width:700px;margin:0 auto">
  <h1 style="color:#8b5cf6;margin-bottom:4px">Nuova submission studio</h1>
  <p style="color:#6b7280;margin-top:0">Inviata tramite il form di Scena</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr><td style="padding:8px;color:#6b7280;width:160px">Nome</td><td style="padding:8px;font-weight:700;font-size:18px">${args.name}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Email</td><td style="padding:8px">${args.email}</td></tr>
    <tr><td style="padding:8px;color:#6b7280">Città</td><td style="padding:8px">${args.location}</td></tr>
    ${args.submitterEmail ? `<tr><td style="padding:8px;color:#6b7280">Email mittente</td><td style="padding:8px">${args.submitterEmail}</td></tr>` : ""}
  </table>

  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Descrizione</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${args.description.map((d) => `<tr><td style="padding:4px 8px;font-weight:600;text-transform:uppercase;color:#8b5cf6;width:60px">${d.code}</td><td style="padding:4px 8px;white-space:pre-wrap">${d.value || "—"}</td></tr>`).join("")}</table>

  ${
    socialLinks || otherLinks
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Link</h2>
  <p style="margin-bottom:24px">${socialLinks}${otherLinks}</p>
  `
      : ""
  }

  ${
    logoUrl
      ? `
  <h2 style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:1px">Logo</h2>
  <img src="${logoUrl}" style="max-width:300px;border-radius:8px;margin-bottom:24px" />
  `
      : ""
  }

  <p style="color:#6b7280;font-size:12px;margin-top:32px">Scena — ${new Date().toLocaleString("it-IT")}</p>
</body>
</html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Scena <${fromEmail}>`,
        to: [toEmail],
        subject: `[Scena] Nuova submission studio: ${args.name}`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sender API error ${response.status}: ${body}`);
    }

    return { success: true };
  },
});
