export const SAVE_KEY = "demo.score.v1";

export function readSave(storage) {
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (!isSaveV1(data)) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSave(storage, save) {
  storage.setItem(SAVE_KEY, JSON.stringify(save));
}

function isSaveV1(data) {
  return (
    typeof data === "object" &&
    data !== null &&
    data.version === 1 &&
    typeof data.score === "number" &&
    Number.isFinite(data.score) &&
    data.score >= 0 &&
    typeof data.muted === "boolean"
  );
}
