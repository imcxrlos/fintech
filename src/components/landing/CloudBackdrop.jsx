import React from "react";
import { Image } from "@/components/ui/image";

const cloudUrl = "https://media.base44.com/images/public/6a78f94b469a2985507520df/e0eaf9f26_generated_image.png";
export default function CloudBackdrop() {
  return <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true"><div className="sticky top-0 h-screen overflow-hidden"><Image src={cloudUrl} alt="" className="atmosphere-drift h-full w-full opacity-70" fittingType="fill" /><div className="absolute inset-0 bg-background/55" /></div></div>;
}