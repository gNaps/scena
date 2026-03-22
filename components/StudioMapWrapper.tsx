"use client";

import dynamic from "next/dynamic";

const StudioMap = dynamic(() => import("@/components/StudioMap"), { ssr: false });

export default function StudioMapWrapper() {
  return <StudioMap />;
}
