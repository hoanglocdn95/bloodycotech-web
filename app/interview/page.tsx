import type { Metadata } from "next";
import { InterviewGuide } from "@/components/interview-guide";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const description = "Bộ ôn phỏng vấn Frontend ReactJS từ nền tảng đến thực hành: JavaScript, TypeScript, React, REST API, responsive, performance, Git và teamwork.";

export const metadata: Metadata = createMetadata({ title: "Ôn phỏng vấn Frontend ReactJS", description, path: "/interview/" });

export default function InterviewPage() {
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }, { name: "Ôn phỏng vấn", path: "/interview/" }])} /><InterviewGuide locale="vi" /></>;
}
