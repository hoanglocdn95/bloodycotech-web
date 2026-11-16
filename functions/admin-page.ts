export function adminPageHtml(): string {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Danh mục trải nghiệm</title>
  <style>
    :root { color-scheme: light; --bg: #faf8f3; --surface: #fffefa; --ink: #292a2e; --muted: #706e69; --line: #ddd7ce; --accent: #a76545; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.5 ui-sans-serif, system-ui, sans-serif; }
    main { width: min(100% - 2rem, 52rem); margin: 0 auto; padding: 2.5rem 0 6rem; }
    h1 { margin: .2rem 0 0; font-family: Georgia, serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 500; letter-spacing: -.04em; }
    .lead { max-width: 40rem; color: var(--muted); }
    .bar { display: flex; flex-wrap: wrap; gap: .7rem; align-items: center; margin: 1.4rem 0; }
    button { border: 0; border-radius: 999px; background: var(--accent); color: white; padding: .75rem 1.15rem; font: inherit; font-weight: 700; cursor: pointer; }
    button[disabled] { opacity: .6; cursor: progress; }
    .status { min-height: 1.5rem; color: var(--muted); }
    article { margin-top: 1rem; border: 1px solid var(--line); border-radius: 1.1rem; background: var(--surface); padding: 1rem 1rem 1.15rem; }
    header { display: flex; flex-wrap: wrap; gap: .8rem 1.2rem; align-items: center; justify-content: space-between; }
    .identity { display: flex; gap: .7rem; align-items: baseline; }
    .kind { color: var(--accent); font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    code { color: var(--muted); font-size: .85rem; }
    label { display: grid; gap: .3rem; margin-top: .8rem; font-size: .82rem; font-weight: 700; }
    .toggle { display: flex; flex: none; align-items: center; gap: .45rem; margin: 0; white-space: nowrap; }
    input, textarea { width: 100%; border: 1px solid var(--line); border-radius: .7rem; background: white; color: inherit; padding: .65rem .75rem; font: inherit; font-weight: 500; }
    textarea { min-height: 4.6rem; resize: vertical; }
    .grid { display: grid; gap: .7rem; }
    .signals { display: grid; grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr)); gap: .7rem; }
    .pair { display: grid; gap: .7rem; grid-template-columns: 1fr 1fr; }
    @media (max-width: 640px) { .pair { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <p class="kind">BloodyCoTech</p>
    <h1>Danh mục trải nghiệm</h1>
    <p class="lead">Những mục đang bật mới được đưa tới người vẽ. Tên, mô tả và các mức ghép nét vẽ sửa được tại đây. Phần chương trình của từng app vẫn nằm trong code của site.</p>
    <div class="bar"><button id="save" type="button">Lưu danh mục</button><p class="status" id="status" role="status"></p></div>
    <div id="list"></div>
  </main>
  <script>
    const signals = [
      ["energy", "Năng lượng"],
      ["pressure", "Áp lực"],
      ["openness", "Độ mở"],
      ["focus", "Tập trung"],
      ["warmth", "Ấm áp"],
      ["playfulness", "Tính chơi"]
    ];
    const kinds = { app: "Ứng dụng", game: "Trò chơi", story: "Câu chữ" };
    const list = document.querySelector("#list");
    const status = document.querySelector("#status");
    const save = document.querySelector("#save");

    const field = (label, value, multiline) => {
      const wrap = document.createElement("label");
      wrap.textContent = label;
      const input = document.createElement(multiline ? "textarea" : "input");
      input.value = value;
      wrap.append(input);
      return { wrap, input };
    };

    const render = (experiences) => {
      list.replaceChildren();
      experiences.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
      for (const item of experiences) {
        const article = document.createElement("article");
        article.dataset.id = item.id;
        const header = document.createElement("header");
        const identity = document.createElement("div");
        identity.className = "identity";
        const kind = document.createElement("span");
        kind.className = "kind";
        kind.textContent = kinds[item.kind] || item.kind;
        const id = document.createElement("code");
        id.textContent = item.id;
        identity.append(kind, id);
        const toggle = document.createElement("label");
        toggle.className = "toggle";
        const enabled = document.createElement("input");
        enabled.type = "checkbox";
        enabled.checked = item.enabled;
        enabled.dataset.field = "enabled";
        const toggleText = document.createElement("span");
        toggleText.textContent = "Đưa tới user";
        toggle.append(enabled, toggleText);
        header.append(identity, toggle);

        const names = document.createElement("div");
        names.className = "pair";
        const titleVi = field("Tên tiếng Việt", item.titleVi);
        const titleEn = field("Tên tiếng Anh", item.titleEn);
        titleVi.input.dataset.field = "titleVi";
        titleEn.input.dataset.field = "titleEn";
        names.append(titleVi.wrap, titleEn.wrap);

        const descriptions = document.createElement("div");
        descriptions.className = "pair";
        const descriptionVi = field("Mô tả tiếng Việt", item.descriptionVi, true);
        const descriptionEn = field("Mô tả tiếng Anh", item.descriptionEn, true);
        descriptionVi.input.dataset.field = "descriptionVi";
        descriptionEn.input.dataset.field = "descriptionEn";
        descriptions.append(descriptionVi.wrap, descriptionEn.wrap);

        const meta = document.createElement("div");
        meta.className = "pair";
        const icon = field("Biểu tượng", item.icon);
        const order = field("Thứ tự", String(item.sortOrder));
        icon.input.dataset.field = "icon";
        icon.input.maxLength = 8;
        order.input.dataset.field = "sortOrder";
        order.input.type = "number";
        order.input.min = "0";
        order.input.max = "999";
        meta.append(icon.wrap, order.wrap);

        const scores = document.createElement("div");
        scores.className = "signals";
        for (const [key, label] of signals) {
          const score = field(label, String(item[key]));
          score.input.dataset.field = key;
          score.input.type = "number";
          score.input.min = "0";
          score.input.max = "100";
          scores.append(score.wrap);
        }
        article.append(header, names, descriptions, meta, scores);
        list.append(article);
      }
    };

    const payload = () => [...list.querySelectorAll("article")].map((article) => {
      const value = (name) => article.querySelector('[data-field="' + name + '"]');
      const number = (name) => Number(value(name).value);
      return {
        id: article.dataset.id,
        icon: value("icon").value,
        titleVi: value("titleVi").value,
        titleEn: value("titleEn").value,
        descriptionVi: value("descriptionVi").value,
        descriptionEn: value("descriptionEn").value,
        energy: number("energy"),
        pressure: number("pressure"),
        openness: number("openness"),
        focus: number("focus"),
        warmth: number("warmth"),
        playfulness: number("playfulness"),
        enabled: value("enabled").checked,
        sortOrder: number("sortOrder")
      };
    });

    const load = async () => {
      status.textContent = "Đang tải…";
      const response = await fetch("/api/admin/experiences", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error("load");
      const body = await response.json();
      render(body.experiences.map((item) => ({
        ...item,
        titleVi: item.title.vi,
        titleEn: item.title.en,
        descriptionVi: item.description.vi,
        descriptionEn: item.description.en,
        ...item.target
      })));
      status.textContent = "";
    };

    save.addEventListener("click", async () => {
      save.disabled = true;
      status.textContent = "Đang lưu…";
      try {
        const response = await fetch("/api/admin/experiences", {
          method: "PUT",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({ experiences: payload() })
        });
        const body = await response.json();
        if (!response.ok) throw new Error("save");
        render(body.experiences.map((item) => ({
          ...item,
          titleVi: item.title.vi,
          titleEn: item.title.en,
          descriptionVi: item.description.vi,
          descriptionEn: item.description.en,
          ...item.target
        })));
        status.textContent = "Đã lưu. Trang vẽ sẽ nhận danh mục này.";
      } catch {
        status.textContent = "Chưa lưu được. Kiểm tra các ô rồi thử lại.";
      } finally {
        save.disabled = false;
      }
    });

    load().catch(() => { status.textContent = "Không tải được danh mục."; });
  </script>
</body>
</html>`;
}
