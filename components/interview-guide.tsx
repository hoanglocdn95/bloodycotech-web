import Link from "next/link";
import { CheckCircle2, Clock3, Target } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/container";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/table-of-contents";
import type { Locale } from "@/lib/i18n";
import { getInterviewGuide } from "@/lib/interview";

export function InterviewGuide({ locale }: { locale: Locale }) {
  const guide = getInterviewGuide(locale);
  const en = locale === "en";
  const base = en ? "/en/" : "/";

  return (
    <div lang={locale}>
      <Container className="py-10 sm:py-14">
        <Breadcrumb
          items={[
            { label: en ? "Home" : "Trang chủ", href: base },
            { label: en ? "Interview prep" : "Ôn phỏng vấn" },
          ]}
        />
        <header className="mt-7 max-w-4xl">
          <p className="hud-label">MISSION_01 // FRONTEND REACTJS</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {en ? "Frontend interview training room" : "Phòng luyện phỏng vấn Frontend"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {en
              ? "A study path built from the actual role: 2+ years of frontend experience, React, TypeScript, state management, REST APIs, responsive UI, performance, Git, and team delivery for a Japanese client."
              : "Lộ trình này bám trực tiếp vào JD: Frontend từ 2 năm kinh nghiệm, React, TypeScript, state management, REST API, responsive, performance, Git và cách giao hàng trong dự án khách hàng Nhật."}
          </p>
        </header>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <Info icon={<Clock3 />} value="7–10" label={en ? "focused days" : "ngày tập trung"} />
          <Info icon={<Target />} value="10" label={en ? "knowledge modules" : "chặng kiến thức"} />
          <Info icon={<CheckCircle2 />} value="20+" label={en ? "hands-on prompts" : "bài tập thực hành"} />
        </dl>

        <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,46rem)_17rem] lg:justify-center">
          <article className="min-w-0">
            <div className="mb-8 lg:hidden"><TableOfContents items={guide.toc} /></div>
            <MdxContent source={guide.content} />
            <div className="pixel-card mt-12 p-6">
              <p className="hud-label">NEXT_CHECKPOINT</p>
              <p className="mt-3 leading-7 text-muted">
                {en
                  ? "Do not try to memorize every sentence. Explain each concept in your own words, write the code without copying, then compare the trade-offs aloud."
                  : "Đừng học thuộc từng câu. Hãy tự giải thích khái niệm, viết lại code không nhìn mẫu, rồi nói thành tiếng vì sao chọn giải pháp đó và mình đã đánh đổi điều gì."}
              </p>
              <Link href={en ? "/en/contact/" : "/contact/"} className="mt-4 inline-flex font-semibold text-accent">
                {en ? "Report a mistake in this guide →" : "Báo lỗi trong bộ ôn tập →"}
              </Link>
            </div>
          </article>
          <aside className="hidden min-w-0 lg:block"><TableOfContents items={guide.toc} /></aside>
        </div>
      </Container>
    </div>
  );
}

function Info({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="pixel-card flex items-center gap-4 p-4">
      <span className="text-accent [&>svg]:size-5" aria-hidden="true">{icon}</span>
      <div><dt className="font-display text-xl font-bold">{value}</dt><dd className="text-sm text-muted">{label}</dd></div>
    </div>
  );
}
