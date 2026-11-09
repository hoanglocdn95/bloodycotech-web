import type { Metadata } from "next";
import { PersonalCanvasApp } from "@/components/personal-canvas-app";
export const metadata: Metadata = { title: "Draw Something. Discover Something.", description: "Draw something and discover an app, game, or tiny story that may fit you right now.", alternates: { canonical: "/en/", languages: { vi: "/", en: "/en/", "x-default": "/" } } };
export default function EnglishHomePage() { return <div lang="en"><PersonalCanvasApp locale="en" /></div>; }
