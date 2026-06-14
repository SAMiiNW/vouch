export const shortAddr = (a: string): string =>
  a && a.length > 10 ? `${a.slice(0, 6)}\u2026${a.slice(-4)}` : a;

export const shortHash = (h: string): string =>
  h && h.length > 14 ? `${h.slice(0, 10)}\u2026${h.slice(-6)}` : h;

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const rulingText: Record<string, string> = {
  TRUSTED: 'text-trusted',
  MIXED: 'text-mixed',
  UNVERIFIED: 'text-unverified',
};

export const rulingLabel: Record<string, string> = {
  TRUSTED: 'Trusted',
  MIXED: 'Mixed',
  UNVERIFIED: 'Unverified',
};

// hue used for the trust-meter rail fill per ruling
export const rulingHex: Record<string, string> = {
  TRUSTED: '#36b89a',
  MIXED: '#e0a93a',
  UNVERIFIED: '#e2738a',
};
