import type { Metadata } from "next";
import { InformationPage } from "@/components/information-page";

export const metadata: Metadata = { title: "How it works", description: "How BloodyCoTech measures a drawing and personalises suggestions without uploading the image.", alternates: { canonical: "/en/how-it-works/", languages: { vi: "/how-it-works/", en: "/en/how-it-works/" } } };

export default function EnglishHowItWorksPage() {
  return <InformationPage locale="en" alternateHref="/how-it-works/" eyebrow="Inside the app" title="From a few marks to one suggestion" intro="There is no mind-reading AI here. BloodyCoTech uses simple geometry and colour measurements, then compares them with the profile of each experience in its library.">
    <h2>1. Marks remain in temporary memory</h2>
    <p>While you draw, the browser keeps points for rendering, undo, and redo. Those points are not written to <code>localStorage</code>, sent to an API, or retained after a reload or closed tab.</p>
    <h2>2. The drawing becomes numbers</h2>
    <p>After you press “I’m done”, the algorithm measures stroke count, page coverage, centre, movement speed, edge use, curvature, left–right balance, brightness, saturation, and dominant colour. It derives six suggestion signals: energy, pressure, openness, focus, warmth, and playfulness.</p>
    <p className="information-note">These signals are product-design conventions for ranking experiences. They are not a psychological diagnosis, proof of emotion, or a basis for medical or employment decisions.</p>
    <h2>3. Experiences are ranked</h2>
    <p>Each app, game, or piece of writing has a target profile. The app measures its distance from the current drawing, then includes “fits/not for me” feedback and gives a small novelty advantage to things you have not opened recently.</p>
    <h2>4. Personalisation grows on this device</h2>
    <p>From the second drawing onward, ranking blends 70% of the current signals with 30% of your historic average. Only numeric profiles, opens, and feedback are stored. My corner lets you erase everything in one action.</p>
    <h2>5. No hidden analysis backend</h2>
    <p>The app is published as static files. Work-scene audio is generated with Web Audio after you press play. There is no analysis request, account, or cloud sync.</p>
  </InformationPage>;
}
