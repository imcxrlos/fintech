import React from "react";
import { Image } from "@/components/ui/image";

const cloudUrl = "https://media.base44.com/images/public/6a78f94b469a2985507520df/e0eaf9f26_generated_image.png";
export default function CloudBackdrop({ dark = false }) {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true"><Image src={cloudUrl} alt="" className={`h-full w-full ${dark ? "opacity-30" : "opacity-55"}`} fittingType="fill" /><div className={`absolute inset-0 ${dark ? "bg-foreground/80" : "bg-gradient-to-b from-background/30 via-background/65 to-background"}`} /></div>;
}