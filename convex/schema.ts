import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    title: v.string(),
    description: v.array(
      v.object({
        code: v.string(),
        value: v.string(),
      }),
    ),
    status: v.id("statuses"),
    releaseTime: v.optional(v.string()),
    expectedReleaseTime: v.optional(v.string()),
    updateTime: v.optional(v.string()),
    studio: v.id("studios"),
    platforms: v.array(v.id("platforms")),
    genres: v.array(v.id("genres")),
    urlSteam: v.optional(v.string()),
    urlEpicGames: v.optional(v.string()),
    urlPsStore: v.optional(v.string()),
    urlXboxStore: v.optional(v.string()),
    urlNintendoStore: v.optional(v.string()),
    urlItchIo: v.optional(v.string()),
    urlKickstarter: v.optional(v.string()),
    urlOther: v.optional(
      v.array(
        v.object({
          label: v.string(),
          url: v.string(),
        }),
      ),
    ),
    screenshots: v.optional(v.array(v.id("_storage"))),
    videos: v.optional(v.array(v.id("_storage"))),
    voice: v.optional(v.array(v.string())),
    screenLanguage: v.optional(v.array(v.string())),
  }),
  studios: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    logo: v.optional(v.id("_storage")),
    urlWebsite: v.optional(v.string()),
    urlInstagram: v.optional(v.string()),
    urlLinkedin: v.optional(v.string()),
    urlOther: v.optional(
      v.array(
        v.object({
          label: v.string(),
          url: v.string(),
        }),
      ),
    ),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    updateTime: v.optional(v.string()),
  }),
  genres: defineTable({
    key: v.string(),
    languages: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
      }),
    ),
  }),
  statuses: defineTable({
    key: v.string(),
    languages: v.array(
      v.object({
        code: v.string(),
        name: v.string(),
      }),
    ),
  }),
  platforms: defineTable({
    key: v.string(),
  }),
  langugaes: defineTable({
    code: v.string(),
    name: v.string(),
  }),
});
