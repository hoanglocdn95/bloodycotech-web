import type { Metadata } from "next";
import { InterviewGuide } from "@/components/interview-guide";
import { createMetadata } from "@/lib/seo";

const description = "A practical Frontend ReactJS interview curriculum covering JavaScript, TypeScript, React, REST APIs, responsive UI, performance, Git, and teamwork.";

export const metadata: Metadata = createMetadata({ title: "Frontend ReactJS interview prep", description, path: "/en/interview/" });

export default function EnglishInterviewPage() {
  return <InterviewGuide locale="en" />;
}
