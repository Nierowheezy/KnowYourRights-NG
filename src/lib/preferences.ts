export const LOW_BW_KEY = "kyr-lowbw";

export function readLowBandwidth(): boolean {
  try {
    return localStorage.getItem(LOW_BW_KEY) === "1";
  } catch {
    return false;
  }
}

export function applyLowBandwidth(enabled: boolean): void {
  if (enabled) document.documentElement.setAttribute("data-lowbw", "1");
  else document.documentElement.removeAttribute("data-lowbw");
}

export function writeLowBandwidth(enabled: boolean): void {
  try {
    localStorage.setItem(LOW_BW_KEY, enabled ? "1" : "0");
  } catch {
    // storage can be unavailable in private mode; the in-memory state still works
  }
  applyLowBandwidth(enabled);
  window.dispatchEvent(new Event("kyr-preferences-changed"));
}
