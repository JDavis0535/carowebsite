// The standard scarf sizes offered on every product.
// Edit here to change sizes everywhere (size selector + size chart).

export interface ScarfSize {
  id: string;
  label: string;
  neck: string; // neck measurement range
}

export const SIZES: ScarfSize[] = [
  { id: "small", label: "Small", neck: '7–10"' },
  { id: "medium", label: "Medium", neck: '11–14"' },
  { id: "large", label: "Large", neck: '15–18"' },
  { id: "x-large", label: "X-Large", neck: '19–22"' },
  { id: "xx-large", label: "XX-Large", neck: '23–27"' },
];
