type Sizeable = { width: number; height: number; setDisplaySize(width: number, height: number): unknown };

export function fitDisplaySize(target: Sizeable, maxDim: number) {
  const scale = maxDim / Math.max(target.width, target.height);
  target.setDisplaySize(target.width * scale, target.height * scale);
}
