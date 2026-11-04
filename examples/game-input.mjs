const ACTIONS = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "jump",
  KeyW: "jump",
  Space: "jump",
};

export function actionFromKey(code) {
  return Object.prototype.hasOwnProperty.call(ACTIONS, code) ? ACTIONS[code] : null;
}
