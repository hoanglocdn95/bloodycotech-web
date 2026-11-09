import type { Metadata } from "next";
import Link from "next/link";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "About", description: "Why BloodyCoTech begins with a blank canvas and grows into a personal corner in your browser.", alternates: { canonical: "/en/about/", languages: { vi: "/about/", en: "/en/about/" } } };

export default function EnglishAboutPage() {
  return <InformationPage locale="en" alternateHref="/about/" eyebrow="An independent project" title="BloodyCoTech is being built by one person" intro="I want this domain to be useful even when a visitor does not want an account, a form, or a long article.">
    <p>BloodyCoTech used to be a place for my frontend notes. This version follows a more focused idea: draw a few marks, let the app observe measurable traits, and receive a small experience you can try immediately.</p>
    <h2>Why begin with a drawing?</h2>
    <p>A blank page can feel lighter than a questionnaire. You do not have to label an emotion or disclose a private story. The drawing is input for a small on-device algorithm, not a personality test.</p>
    <h2>What I want to preserve</h2>
    <ul><li>Never pretend to know exactly what a visitor is thinking.</li><li>Never require an account for the basic experience.</li><li>Never upload drawings or sell personal data.</li><li>Every listed app and game should actually work.</li></ul>
    <h2>A product that is still growing</h2>
    <p>Focus, movement, work scenes, mini-games, and board games form the first collection. “This fits” and “Not for me” only adjust a local profile on your device. You can inspect or erase that profile from My corner.</p>
    <p>Read the technical explanation in <Link href="/en/how-it-works/">How BloodyCoTech works</Link>.</p>
  </InformationPage>;
}
