import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "config/integrations.json"), "utf8"));
const pattern = /^google\.com, pub-\d{10,20}, DIRECT, f08c47fec0942fa0$/;
const target = path.join(root, "out/ads.txt");

if (!config.adsTxt) {
  if (fs.existsSync(target)) fs.unlinkSync(target);
  process.exit(0);
}

if (!pattern.test(config.adsTxt)) {
  console.error("adsTxt không khớp dòng Google AdSense hợp lệ. Không ghi ads.txt.");
  process.exit(1);
}

fs.writeFileSync(target, `${config.adsTxt}\n`);
console.log("Wrote out/ads.txt");
