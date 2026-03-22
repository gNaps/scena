import { defaultLocale } from "@/lib/i18n";
import { redirect } from "next/navigation";

export default function GamesRedirect() {
  redirect(`/${defaultLocale}/games`);
}
