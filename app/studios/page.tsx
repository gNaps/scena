import { defaultLocale } from "@/lib/i18n";
import { redirect } from "next/navigation";

export default function StudiosRedirect() {
  redirect(`/${defaultLocale}/studios`);
}
